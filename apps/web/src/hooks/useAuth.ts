'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth-store';
import { usePreferencesStore } from '@/store/preferences-store';
import type {
  AuthResponse,
  RequestLoginCodeInput,
  RequestLoginCodeResponse,
  VerifyLoginCodeInput,
} from '@/types/auth';

export function useRequestLoginCode() {
  return useMutation({
    mutationFn: (input: RequestLoginCodeInput) =>
      apiClient.post<RequestLoginCodeResponse>('/auth/passwordless/request-code', input),
  });
}

export function useVerifyLoginCode() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const setCountry = usePreferencesStore((state) => state.setCountry);
  const setCurrencyCode = usePreferencesStore((state) => state.setCurrencyCode);
  return useMutation({
    mutationFn: (input: VerifyLoginCodeInput) =>
      apiClient.post<AuthResponse>('/auth/passwordless/verify-code', input),
    onSuccess: (data) => {
      setAuth(data.accessToken, data.user);
      if (data.user.country) setCountry(data.user.country);
      if (data.user.marketProfile?.currency) setCurrencyCode(data.user.marketProfile.currency);
    },
  });
}

export function useCompleteOnboarding() {
  const updateUser = useAuthStore((state) => state.updateUser);
  const setCountry = usePreferencesStore((state) => state.setCountry);
  const setCurrencyCode = usePreferencesStore((state) => state.setCurrencyCode);
  return useMutation({
    mutationFn: () => apiClient.post<AuthResponse['user']>('/auth/onboarding/complete', {}),
    onSuccess: (user) => {
      updateUser(user);
      if (user.country) setCountry(user.country);
      if (user.marketProfile?.currency) setCurrencyCode(user.marketProfile.currency);
    },
  });
}
