import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import type { Database } from '../types';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  readonly client: SupabaseClient<Database> = createClient<Database>(
    environment.supabaseUrl,
    environment.supabasePublishableKey,
  );

  get auth() {
    return this.client.auth;
  }

  storage(bucket: string) {
    return this.client.storage.from(bucket);
  }

  getPublicUrl(bucket: string, path: string): string {
    return this.client.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  }
}
