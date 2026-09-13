'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth-store';
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
  return useMutation({
    mutationFn: (input: VerifyLoginCodeInput) =>
      apiClient.post<AuthResponse>('/auth/passwordless/verify-code', input),
    onSuccess: (data) => setAuth(data.accessToken, data.user),
  });
}

export function useCompleteOnboarding() {
  const updateUser = useAuthStore((state) => state.updateUser);
  return useMutation({
    mutationFn: () => apiClient.post<AuthResponse['user']>('/auth/onboarding/complete', {}),
    onSuccess: (user) => updateUser(user),
  });
}
