'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { CreateLeadInput, CreateLeadResponse } from '@/types/leads';

export function useCreateLead() {
  return useMutation({
    mutationFn: (input: CreateLeadInput) => apiClient.post<CreateLeadResponse>('/leads', input),
  });
}
