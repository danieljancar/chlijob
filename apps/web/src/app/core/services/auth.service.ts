import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthError, Session } from '@supabase/supabase-js';
import { PostgrestError } from '@supabase/postgrest-js';
import type { Profile, ProfileUpdate, RegisterData } from '../types';
import { SupabaseService } from './supabase.service';
import { NotificationService } from './notification.service';

/** Postgres error code returned by PostgREST when .single() finds no rows. */
const PGRST_NO_ROWS = 'PGRST116';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private supabase = inject(SupabaseService);
  private router = inject(Router);
  private notify = inject(NotificationService);

  readonly session = signal<Session | null>(null);
  readonly profile = signal<Profile | null>(null);
  readonly loading = signal(true);

  /** True only while our own signOut() call is in flight, to avoid double-navigation. */
  private signingOut = false;

  readonly isAuthenticated = computed(() => !!this.session());

  readonly initials = computed(() => {
    const p = this.profile();
    if (!p) return '?';
    return ((p.first_name?.[0] ?? '') + (p.last_name?.[0] ?? '')).toUpperCase();
  });

  readonly fullName = computed(() => {
    const p = this.profile();
    if (!p) return '';
    return `${p.first_name} ${p.last_name}`.trim();
  });

  readonly avatarUrl = computed(() => {
    const p = this.profile();
    if (!p?.avatar_path) return null;
    return this.supabase.getPublicUrl('avatars', p.avatar_path);
  });

  constructor() {
    /**
     * Single source of truth for auth state.
     * Supabase v2 fires INITIAL_SESSION synchronously on subscription,
     * covering the initial page load — no need for a separate getSession() call.
     */
    this.supabase.client.auth.onAuthStateChange((event, session) => {
      switch (event) {
        case 'INITIAL_SESSION':
          this.session.set(session);
          if (session) {
            this.loadProfile(session.user.id);
          } else {
            this.loading.set(false);
          }
          break;

        case 'SIGNED_IN':
        case 'TOKEN_REFRESHED':
        case 'USER_UPDATED':
          this.session.set(session);
          if (session) this.loadProfile(session.user.id);
          break;

        case 'SIGNED_OUT':
          this.session.set(null);
          this.profile.set(null);
          this.loading.set(false);
          // Involuntary sign-out (expired/invalid token): notify and redirect.
          if (!this.signingOut && this.router.url.startsWith('/app')) {
            this.notify.warning('NOTIFY.SESSION_EXPIRED');
            this.router.navigate(['/auth/login']);
          }
          break;
      }
    });
  }

  /**
   * Loads the profile for the given user.
   * If the profile row does not exist (e.g. after a DB reset), signs the user out
   * so the app never ends up in an inconsistent authenticated-but-profileless state.
   */
  private async loadProfile(userId: string): Promise<void> {
    const { data, error } = await this.supabase.client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === PGRST_NO_ROWS) {
        // Auth token exists but the profile row is gone (DB reset, manual deletion, etc.).
        // Clear the stale session so the user is sent back to login.
        await this.signOut();
      }
      this.loading.set(false);
      return;
    }

    this.profile.set(data);
    this.loading.set(false);
  }

  async updateProfile(data: ProfileUpdate): Promise<{ error: PostgrestError | null }> {
    const session = this.session();
    if (!session) {
      return {
        error: { message: 'Not authenticated', details: '', hint: '', code: '' } as PostgrestError,
      };
    }

    const { error } = await this.supabase.client
      .from('profiles')
      .update(data)
      .eq('id', session.user.id);

    if (!error) {
      this.profile.update((p) => (p ? { ...p, ...data } : p));
    }
    return { error };
  }

  async signIn(email: string, password: string): Promise<{ error: AuthError | null }> {
    const { error } = await this.supabase.client.auth.signInWithPassword({ email, password });
    if (!error) await this.router.navigate(['/app']);
    return { error };
  }

  async signUp(
    email: string,
    password: string,
    data: RegisterData,
  ): Promise<{ error: AuthError | null }> {
    const { data: authData, error } = await this.supabase.client.auth.signUp({ email, password });
    if (error || !authData.user) return { error };

    const { error: profileError } = await this.supabase.client.from('profiles').upsert({
      id: authData.user.id,
      ...data,
    });

    if (!profileError) await this.router.navigate(['/app']);
    return { error: profileError as unknown as AuthError };
  }

  async signOut(): Promise<void> {
    this.signingOut = true;
    await this.supabase.client.auth.signOut();
    this.session.set(null);
    this.profile.set(null);
    await this.router.navigate(['/']);
    this.signingOut = false;
  }
}
