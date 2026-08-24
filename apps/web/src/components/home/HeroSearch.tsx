'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export function HeroSearch() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-accent">
        <Sparkles size={12} />
        Procurement Intelligence
      </span>
      <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
        Procurement Intelligence for Better Buying Decisions
      </h1>
      <p className="mt-4 max-w-xl text-lg text-ink-muted">
        Understand what is happening in the market before you make your next procurement
        decision.
      </p>
      <p className="mt-2 max-w-xl text-sm text-ink-faint">
        Market intelligence, commodity trends, category insights, procurement benchmarks,
        calculators and AI-powered analysis — in one place.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link
          href="/market-intelligence"
          className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          Explore Market Intelligence
          <ArrowRight size={15} />
        </Link>
        <Link
          href="/health-check"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:border-accent hover:text-ink"
        >
          Check Your Procurement Health
        </Link>
      </div>
    </motion.div>
  );
}
