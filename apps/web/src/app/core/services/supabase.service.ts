import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import type { Database } from '../types';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  readonly client: SupabaseClient<Database> = createClient<Database>(
    environment.supabaseUrl,
    environment.supabasePublishableKey,
    {
      auth: {
        // Automatically refresh the access token before it expires.
        autoRefreshToken: true,
        // Persist the session in localStorage across page reloads.
        persistSession: true,
        // Pick up the session from the URL hash after OAuth / magic-link redirects.
        detectSessionInUrl: true,
        // Namespaced key so multiple apps on the same origin don't clobber each other.
        storageKey: 'chlijobs-auth',
      },
    },
  );

  storage(bucket: string) {
    return this.client.storage.from(bucket);
  }

  getPublicUrl(bucket: string, path: string): string {
    return this.client.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  }
}
