import Link from 'next/link';
import { GhlSignupEmbed } from '@/components/leads/GhlSignupEmbed';

export default function RegisterPage() {
  return (
    <div className="container-page flex justify-center py-12 sm:py-16">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-semibold text-ink">Create your account</h1>
        <p className="mt-1 text-sm leading-6 text-ink-muted">
          Complete the short form to access ProcureChain and receive market insights tailored to your industry.
        </p>

        <div className="mt-6">
          <GhlSignupEmbed />
        </div>

        <p className="mt-4 text-center text-sm text-ink-muted">
          Already registered?{' '}
          <Link href="/login" className="text-accent hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
