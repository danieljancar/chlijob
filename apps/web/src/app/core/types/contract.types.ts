import type { Database } from './database.types';

export type ContractStatus = 'open' | 'assigned' | 'completed' | 'canceled';
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

export type Contract = Database['public']['Tables']['contracts']['Row'];
export type ContractInsert = Database['public']['Tables']['contracts']['Insert'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Application = Database['public']['Tables']['applications']['Row'];
export type ContractImage = Database['public']['Tables']['contract_images']['Row'];

export interface ContractCreatorProfile {
  id: string;
  first_name: string;
  last_name: string;
  rating_avg: number;
  review_count: number;
  avatar_path: string | null;
  avatar_blurhash: string | null;
  location: string | null;
}

export interface ContractWithDetails extends Contract {
  category: Category | null;
  creator: ContractCreatorProfile | null;
  images?: ContractImage[];
}

export interface ApplicationApplicantProfile {
  id: string;
  first_name: string;
  last_name: string;
  rating_avg: number;
  review_count: number;
  avatar_path: string | null;
  bio: string | null;
}

export interface ApplicationWithProfile extends Application {
  profile: ApplicationApplicantProfile | null;
}

export interface CreateContractData {
  title: string;
  description: string | null;
  category_id: number | null;
  payment_type: 'hourly' | 'lump_sum';
  salary_per_hour: number | null;
  lump_sum: number | null;
  address: string | null;
  estimated_hours: number | null;
  preferred_date: string | null;
}

export interface ApplicationWithContractDetails extends Application {
  contract: {
    id: number;
    title: string;
    address: string | null;
    preferred_date: string | null;
    salary_per_hour: number | null;
    status: ContractStatus;
    category: Category | null;
    creator: { id: string; first_name: string; last_name: string } | null;
  } | null;
}

export interface ApplicationWithProfileAndContract extends Application {
  profile: ApplicationApplicantProfile | null;
  contract: { id: number; title: string } | null;
}

export interface ContractWithApplicationCount extends ContractWithDetails {
  applicationCount: number;
}

export interface TakerDashboardData {
  activeContracts: ContractWithDetails[];
  pendingApplicationsCount: number;
  totalEarnings: number;
  recentApplications: ApplicationWithContractDetails[];
  completedContracts: ContractWithDetails[];
}

export interface GiverDashboardData {
  openContracts: ContractWithApplicationCount[];
  pendingApplications: ApplicationWithProfileAndContract[];
  pendingApplicationsCount: number;
  completedCount: number;
}
