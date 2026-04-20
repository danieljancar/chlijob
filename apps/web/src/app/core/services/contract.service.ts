import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';
import type {
  Category,
  ContractWithDetails,
  ApplicationWithProfile,
  CreateContractData,
} from '../types';

@Injectable({ providedIn: 'root' })
export class ContractService {
  private supabase = inject(SupabaseService);
  private auth = inject(AuthService);

  async getCategories(): Promise<Category[]> {
    const { data } = await this.supabase.client.from('categories').select('*').order('name');
    return (data ?? []) as Category[];
  }

  async getOpenContracts(filters?: {
    categoryId?: number | null;
    location?: string | null;
  }): Promise<ContractWithDetails[]> {
    let query = this.supabase.client
      .from('contracts')
      .select(
        `*, category:categories(*), creator:profiles!creator_id(id, first_name, last_name, rating_avg, review_count, avatar_path, avatar_blurhash, location)`,
      )
      .eq('status', 'open')
      .order('created_at', { ascending: false });

    if (filters?.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }

    const { data } = await query;
    let results = (data ?? []) as unknown as ContractWithDetails[];

    if (filters?.location) {
      results = results.filter((c) => c.creator?.location === filters.location);
    }

    return results;
  }

  async getMyContracts(): Promise<ContractWithDetails[]> {
    const userId = this.auth.session()?.user.id;
    if (!userId) return [];

    const { data } = await this.supabase.client
      .from('contracts')
      .select(
        `*, category:categories(*), creator:profiles!creator_id(id, first_name, last_name, rating_avg, review_count, avatar_path, avatar_blurhash, location)`,
      )
      .eq('creator_id', userId)
      .order('created_at', { ascending: false });

    return (data ?? []) as unknown as ContractWithDetails[];
  }

  async getContractApplications(contractId: number): Promise<ApplicationWithProfile[]> {
    const { data } = await this.supabase.client
      .from('applications')
      .select(
        `*, profile:profiles!user_id(id, first_name, last_name, rating_avg, review_count, avatar_path, bio)`,
      )
      .eq('contract_id', contractId)
      .order('created_at', { ascending: false });

    return (data ?? []) as unknown as ApplicationWithProfile[];
  }

  async getUserActiveContracts(): Promise<ContractWithDetails[]> {
    const userId = this.auth.session()?.user.id;
    if (!userId) return [];

    const { data } = await this.supabase.client
      .from('contracts')
      .select(
        `*, category:categories(*), creator:profiles!creator_id(id, first_name, last_name, rating_avg, review_count, avatar_path, avatar_blurhash, location)`,
      )
      .or(`creator_id.eq.${userId},taker_id.eq.${userId}`)
      .in('status', ['assigned', 'completed'])
      .order('updated_at', { ascending: false });

    return (data ?? []) as unknown as ContractWithDetails[];
  }

  async getMyApplications(): Promise<ApplicationWithProfile[]> {
    const userId = this.auth.session()?.user.id;
    if (!userId) return [];

    const { data } = await this.supabase.client
      .from('applications')
      .select(
        `*, profile:profiles!user_id(id, first_name, last_name, rating_avg, review_count, avatar_path, bio)`,
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return (data ?? []) as unknown as ApplicationWithProfile[];
  }

  async createContract(data: CreateContractData): Promise<{ error: Error | null }> {
    const userId = this.auth.session()?.user.id;
    if (!userId) return { error: new Error('Not authenticated') };

    const { error } = await this.supabase.client.from('contracts').insert({
      ...data,
      creator_id: userId,
    });

    return { error: error as Error | null };
  }

  async applyToContract(contractId: number, text?: string): Promise<{ error: Error | null }> {
    const userId = this.auth.session()?.user.id;
    if (!userId) return { error: new Error('Not authenticated') };

    const { error } = await this.supabase.client.from('applications').insert({
      user_id: userId,
      contract_id: contractId,
      text: text ?? null,
    });

    return { error: error as Error | null };
  }

  async acceptApplication(applicationId: number): Promise<{ error: Error | null }> {
    const { error } = await this.supabase.client.rpc('accept_application', {
      p_application_id: applicationId,
    });
    return { error: error as Error | null };
  }

  async rejectApplication(applicationId: number): Promise<{ error: Error | null }> {
    const { error } = await this.supabase.client
      .from('applications')
      .update({ status: 'rejected' })
      .eq('id', applicationId);
    return { error: error as Error | null };
  }

  async hasApplied(contractId: number): Promise<boolean> {
    const userId = this.auth.session()?.user.id;
    if (!userId) return false;

    const { data } = await this.supabase.client
      .from('applications')
      .select('id')
      .eq('contract_id', contractId)
      .eq('user_id', userId)
      .maybeSingle();

    return data !== null;
  }
}
