import type { Metadata } from 'next';
import { PasswordlessAuthForm } from '@/components/auth/PasswordlessAuthForm';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create a ProcureChain account and personalize your procurement market intelligence.',
};

export default function RegisterPage() {
  return <PasswordlessAuthForm mode="SIGNUP" />;
}
