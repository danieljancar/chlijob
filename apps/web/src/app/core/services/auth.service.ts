import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthError, Session } from '@supabase/supabase-js';
import { PostgrestError } from '@supabase/postgrest-js';
import { Profile, PreferredRole } from '../models/profile.model';
import { SupabaseService } from './supabase.service';

export interface RegisterData {
  first_name: string;
  last_name: string;
  birthday: string;
  preferred_role: PreferredRole;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private supabase = inject(SupabaseService);
  private router = inject(Router);

  readonly session = signal<Session | null>(null);
  readonly profile = signal<Profile | null>(null);
  readonly loading = signal(true);

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
    this.supabase.client.auth.getSession().then(({ data }) => {
      this.session.set(data.session);
      if (data.session) this.loadProfile(data.session.user.id);
      this.loading.set(false);
    });

    this.supabase.client.auth.onAuthStateChange((_event, session) => {
      this.session.set(session);
      if (session) {
        this.loadProfile(session.user.id);
      } else {
        this.profile.set(null);
      }
    });
  }

  private async loadProfile(userId: string): Promise<void> {
    const { data, error } = await this.supabase.client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (!error && data) {
      this.profile.set(data as Profile);
    }
  }

  async updateProfile(
    data: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>,
  ): Promise<{ error: PostgrestError | null }> {
    const session = this.session();
    if (!session)
      return {
        error: { message: 'Not authenticated', details: '', hint: '', code: '' } as PostgrestError,
      };

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
    if (!error) await this.router.navigate(['/']);
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

    if (!profileError) await this.router.navigate(['/']);
    return { error: profileError as unknown as AuthError };
  }

  async signOut(): Promise<void> {
    await this.supabase.client.auth.signOut();
    this.profile.set(null);
    await this.router.navigate(['/auth/login']);
  }
}
