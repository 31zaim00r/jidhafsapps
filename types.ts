
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export enum PoemCategory {
  QASIDA = 'وقفة',
  MUWASHSHAH = 'موشح',
  MULTIPLE_METERS = 'متعدد الأوزان'
}

export interface Profile {
  id: string;
  name: string;
  email: string | null;
  phone_number: string | null;
  profile_image: string | null;
  can_upload: boolean;
  created_at: string;
  updated_at: string;
  role?: UserRole; // Joined from user_roles
}

export interface Occasion {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Poem {
  id: string;
  title: string;
  poet_name: string;
  year: number | null;
  category: PoemCategory | null;
  content: string | null;
  media_url: string | null;
  occasion_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
