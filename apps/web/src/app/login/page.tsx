'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRequestLoginCode, useVerifyLoginCode } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const requestCode = useRequestLoginCode();
  const verifyCode = useVerifyLoginCode();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [developmentCode, setDevelopmentCode] = useState<string | null>(null);

  function sendCode() {
    requestCode.mutate(
      { email },
      {
        onSuccess: (result) => {
          setCodeSent(true);
          setCode('');
          verifyCode.reset();
          setDevelopmentCode(result.developmentCode ?? null);
        },
      },
    );
  }

  function handleRequestCode(event: FormEvent) {
    event.preventDefault();
    sendCode();
  }

  function handleVerifyCode(event: FormEvent) {
    event.preventDefault();
    verifyCode.mutate({ email, code }, { onSuccess: () => router.push('/') });
  }

  function changeEmail() {
    setCodeSent(false);
    setCode('');
    setDevelopmentCode(null);
    requestCode.reset();
    verifyCode.reset();
  }

  return (
    <div className="container-page flex justify-center py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-ink">Log in</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {codeSent ? `Enter the code sent to ${email}.` : 'Enter your email — no password required.'}
        </p>

        {!codeSent ? (
          <form onSubmit={handleRequestCode} className="mt-6 flex flex-col gap-3">
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Work email"
              className="rounded-lg border border-border bg-canvas-raised px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              disabled={requestCode.isPending}
              className="mt-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
            >
              {requestCode.isPending ? 'Sending code…' : 'Email me a login code'}
            </button>
            {requestCode.error && (
              <p className="text-xs text-negative">{(requestCode.error as Error).message || 'Unable to send a code.'}</p>
            )}
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="mt-6 flex flex-col gap-3">
            <input
              required
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="6-digit verification code"
              aria-label="Verification code"
              className="rounded-lg border border-border bg-canvas-raised px-3 py-2 text-center font-mono text-lg tracking-[0.35em] text-ink placeholder:font-sans placeholder:text-sm placeholder:tracking-normal placeholder:text-ink-faint focus:border-accent focus:outline-none"
            />
            {developmentCode && (
              <p className="rounded-lg border border-border bg-canvas-raised p-3 text-xs text-ink-muted">
                Development code: <span className="font-mono font-semibold text-ink">{developmentCode}</span>
              </p>
            )}
            <button
              type="submit"
              disabled={verifyCode.isPending || code.length !== 6}
              className="mt-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
            >
              {verifyCode.isPending ? 'Verifying…' : 'Verify and log in'}
            </button>
            {verifyCode.error && (
              <p className="text-xs text-negative">{(verifyCode.error as Error).message || 'Invalid or expired code.'}</p>
            )}
            {requestCode.error && (
              <p className="text-xs text-negative">{(requestCode.error as Error).message || 'Unable to send another code.'}</p>
            )}
            <div className="flex items-center justify-center gap-4 text-sm">
              <button
                type="button"
                onClick={sendCode}
                disabled={requestCode.isPending}
                className="text-accent hover:underline disabled:opacity-60"
              >
                {requestCode.isPending ? 'Sending…' : 'Send another code'}
              </button>
              <button type="button" onClick={changeEmail} className="text-accent hover:underline">
                Change email
              </button>
            </div>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-ink-muted">
          New to ProcureChain?{' '}
          <Link href="/register" className="text-accent hover:underline">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
