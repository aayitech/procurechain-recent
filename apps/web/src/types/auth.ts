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
  marketProfile: {
    regionCity: string | null;
    currency: string | null;
    procurementCategories: string[];
    commodities: string[];
    purchaseMix: string | null;
    sourcingCountries: string[];
    tradeLanes: string[];
    procurementChallenges: string[];
  } | null;
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
  regionCity?: string;
  currency?: string;
  procurementCategories?: string[];
  commodities?: string[];
  purchaseMix?: string;
  sourcingCountries?: string[];
  tradeLanes?: string[];
  procurementChallenges?: string[];
}

export interface LoginInput {
  email: string;
  password: string;
}
