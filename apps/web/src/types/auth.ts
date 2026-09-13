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
  onboardingCompletedAt: string | null;
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

export interface RequestLoginCodeInput {
  email: string;
}

export interface RequestLoginCodeResponse {
  message: string;
  expiresInSeconds: number;
  developmentCode?: string;
}

export interface VerifyLoginCodeInput {
  email: string;
  code: string;
}
