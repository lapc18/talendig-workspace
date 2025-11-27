export type UserRole = 'admin' | 'coordinator' | 'viewer';

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

