import type { Metadata } from 'next';
import { PasswordlessAuthForm } from '@/components/auth/PasswordlessAuthForm';

export const metadata: Metadata = {
  title: 'Log In',
  description: 'Log in to your existing ProcureChain account.',
};

export default function LoginPage() {
  return <PasswordlessAuthForm mode="LOGIN" />;
}
