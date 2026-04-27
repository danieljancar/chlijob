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
    const userId = this.auth.session()?.user.id;

    const appliedIds = await this.getAppliedContractIds();

    let query = this.supabase.client
      .from('contracts')
      .select(
        `*, category:categories(*), creator:profiles!creator_id(id, first_name, last_name, rating_avg, review_count, avatar_path, avatar_blurhash, location), images:contract_images(*)`,
      )
      .eq('status', 'open')
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.neq('creator_id', userId);
    }

    if (appliedIds.length > 0) {
      query = query.not('id', 'in', `(${appliedIds.join(',')})`);
    }

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

  async getContractById(id: number): Promise<ContractWithDetails | null> {
    const { data } = await this.supabase.client
      .from('contracts')
      .select(
        `*, category:categories(*), creator:profiles!creator_id(id, first_name, last_name, rating_avg, review_count, avatar_path, avatar_blurhash, location), images:contract_images(*)`,
      )
      .eq('id', id)
      .maybeSingle();

    return data as unknown as ContractWithDetails | null;
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

  async createContract(
    data: CreateContractData,
  ): Promise<{ id: number | null; error: Error | null }> {
    const userId = this.auth.session()?.user.id;
    if (!userId) return { id: null, error: new Error('Not authenticated') };

    const { data: inserted, error } = await this.supabase.client
      .from('contracts')
      .insert({ ...data, creator_id: userId })
      .select('id')
      .single();

    return { id: inserted?.id ?? null, error: error as Error | null };
  }

  async uploadContractImages(contractId: number, files: File[]): Promise<void> {
    for (const file of files) {
      const ext = file.name.split('.').pop() ?? 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const imagePath = `${contractId}/${fileName}`;

      const { error: uploadError } = await this.supabase
        .storage('contract-images')
        .upload(imagePath, file, { upsert: false });

      if (uploadError) continue;

      await this.supabase.client
        .from('contract_images')
        .insert({ contract_id: contractId, image_path: imagePath });
    }
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

  private async getAppliedContractIds(): Promise<number[]> {
    const userId = this.auth.session()?.user.id;
    if (!userId) return [];

    const { data } = await this.supabase.client
      .from('applications')
      .select('contract_id')
      .eq('user_id', userId);

    return (data ?? []).map((a) => a.contract_id).filter((id): id is number => id !== null);
  }

  async cancelApplication(contractId: number): Promise<{ error: Error | null }> {
    const contract = await this.getContractById(contractId);
    if (!contract) return { error: new Error('Contract not found') };

    const userId = this.auth.session()?.user.id;
    if (!userId) return { error: new Error('Not authenticated') };

    const { error } = await this.supabase.client
      .from('contracts')
      .update({ taker_id: null })
      .eq('id', contractId)
      .eq('taker_id', userId);

    if (error) {
      console.error('Error cancelling application:', error);
      return { error: error as Error };
    }
    return { error: null };
  }
}
