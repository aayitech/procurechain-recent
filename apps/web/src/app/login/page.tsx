'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLogin } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { mutate, isPending, error } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    mutate({ email, password }, { onSuccess: () => router.push('/') });
  }

  return (
    <div className="container-page flex justify-center py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-ink">Log in</h1>
        <p className="mt-1 text-sm text-ink-muted">Welcome back to ProcureChain Intelligence Hub.</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Work email"
            className="rounded-lg border border-border bg-canvas-raised px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
          />
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="rounded-lg border border-border bg-canvas-raised px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            disabled={isPending}
            className="mt-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
          >
            {isPending ? 'Logging in…' : 'Log in'}
          </button>
          {error && <p className="text-xs text-negative">{(error as Error).message || 'Invalid email or password.'}</p>}
        </form>

        <p className="mt-4 text-center text-sm text-ink-muted">
          No account yet?{' '}
          <Link href="/register" className="text-accent hover:underline">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}
