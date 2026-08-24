import { notFound } from 'next/navigation';
import { CALCULATOR_REGISTRY } from '@/components/calculators/calculator-registry';
import { CALCULATORS } from '@/lib/calculators-index';

export function generateStaticParams() {
  return CALCULATORS.map((calc) => ({ slug: calc.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const calc = CALCULATORS.find((c) => c.slug === params.slug);
  return {
    title: calc?.name ?? 'Calculator',
    description: calc?.description,
  };
}

export default function CalculatorPage({ params }: { params: { slug: string } }) {
  const Calculator = CALCULATOR_REGISTRY[params.slug];
  if (!Calculator) {
    notFound();
  }
  return <Calculator />;
}
