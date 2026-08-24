'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth-store';
import type { AuthResponse, LoginInput, RegisterInput } from '@/types/auth';

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: (input: RegisterInput) => apiClient.post<AuthResponse>('/auth/register', input),
    onSuccess: (data) => setAuth(data.accessToken, data.user),
  });
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: (input: LoginInput) => apiClient.post<AuthResponse>('/auth/login', input),
    onSuccess: (data) => setAuth(data.accessToken, data.user),
  });
}
