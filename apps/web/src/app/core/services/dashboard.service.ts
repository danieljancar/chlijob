import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';
import type {
  ContractWithDetails,
  ApplicationWithContractDetails,
  ApplicationWithProfileAndContract,
  ContractWithApplicationCount,
  TakerDashboardData,
  GiverDashboardData,
} from '../types';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private supabase = inject(SupabaseService);
  private auth = inject(AuthService);

  async getTakerData(): Promise<TakerDashboardData> {
    const userId = this.auth.session()!.user.id;

    const [activeContracts, recentApplications, completedContracts] = await Promise.all([
      this.fetchActiveContractsAsTaker(userId),
      this.fetchMyRecentApplications(userId),
      this.fetchCompletedContractsAsTaker(userId),
    ]);

    const pendingApplicationsCount = recentApplications.filter(
      (a) => a.status === 'pending',
    ).length;

    const totalEarnings = completedContracts.reduce(
      (sum, c) => sum + (c.salary_per_hour ?? 0) * (c.estimated_hours ?? 0),
      0,
    );

    return {
      activeContracts,
      pendingApplicationsCount,
      totalEarnings,
      recentApplications,
      completedContracts,
    };
  }

  async getGiverData(): Promise<GiverDashboardData> {
    const userId = this.auth.session()!.user.id;

    const [openContracts, completedCount] = await Promise.all([
      this.fetchOpenContractsAsGiver(userId),
      this.fetchCompletedCountAsGiver(userId),
    ]);

    const contractIds = openContracts.map((c) => c.id);
    const pendingApplications =
      contractIds.length > 0 ? await this.fetchPendingApplicationsForContracts(contractIds) : [];

    return {
      openContracts,
      pendingApplications,
      pendingApplicationsCount: pendingApplications.length,
      completedCount,
    };
  }

  private async fetchActiveContractsAsTaker(userId: string): Promise<ContractWithDetails[]> {
    const { data } = await this.supabase.client
      .from('contracts')
      .select(
        `*, category:categories(*), creator:profiles!creator_id(id, first_name, last_name, rating_avg, review_count, avatar_path, avatar_blurhash, location)`,
      )
      .eq('taker_id', userId)
      .eq('status', 'assigned')
      .order('preferred_date', { ascending: true })
      .limit(5);
    return (data ?? []) as unknown as ContractWithDetails[];
  }

  private async fetchMyRecentApplications(
    userId: string,
  ): Promise<ApplicationWithContractDetails[]> {
    const { data } = await this.supabase.client
      .from('applications')
      .select(
        `*, contract:contracts!contract_id(id, title, address, preferred_date, salary_per_hour, status, category:categories(id, name, slug), creator:profiles!creator_id(id, first_name, last_name))`,
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(6);
    return (data ?? []) as unknown as ApplicationWithContractDetails[];
  }

  private async fetchCompletedContractsAsTaker(userId: string): Promise<ContractWithDetails[]> {
    const { data } = await this.supabase.client
      .from('contracts')
      .select(
        `*, category:categories(*), creator:profiles!creator_id(id, first_name, last_name, rating_avg, review_count, avatar_path, avatar_blurhash, location)`,
      )
      .eq('taker_id', userId)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })
      .limit(5);
    return (data ?? []) as unknown as ContractWithDetails[];
  }

  private async fetchOpenContractsAsGiver(userId: string): Promise<ContractWithApplicationCount[]> {
    const { data } = await this.supabase.client
      .from('contracts')
      .select(
        `*, category:categories(*), creator:profiles!creator_id(id, first_name, last_name, rating_avg, review_count, avatar_path, avatar_blurhash, location), applications(count)`,
      )
      .eq('creator_id', userId)
      .eq('status', 'open')
      .order('created_at', { ascending: false });

    return ((data ?? []) as unknown[]).map((row: any) => ({
      ...row,
      applicationCount: row.applications?.[0]?.count ?? 0,
    })) as ContractWithApplicationCount[];
  }

  private async fetchCompletedCountAsGiver(userId: string): Promise<number> {
    const { count } = await this.supabase.client
      .from('contracts')
      .select('id', { count: 'exact', head: true })
      .eq('creator_id', userId)
      .eq('status', 'completed');
    return count ?? 0;
  }

  private async fetchPendingApplicationsForContracts(
    contractIds: number[],
  ): Promise<ApplicationWithProfileAndContract[]> {
    const { data } = await this.supabase.client
      .from('applications')
      .select(
        `*, profile:profiles!user_id(id, first_name, last_name, rating_avg, review_count, avatar_path, bio), contract:contracts!contract_id(id, title)`,
      )
      .in('contract_id', contractIds)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(8);
    return (data ?? []) as unknown as ApplicationWithProfileAndContract[];
  }
}
