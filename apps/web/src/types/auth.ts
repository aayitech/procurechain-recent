export interface AuthUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  country: string | null;
  industry: string | null;
  jobTitle: string | null;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  company?: string;
  country?: string;
  industry?: string;
  jobTitle?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
