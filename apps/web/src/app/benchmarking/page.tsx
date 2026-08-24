import { BenchmarkingView } from '@/components/benchmarking/BenchmarkingView';

export const metadata = {
  title: 'Procurement Benchmarking',
  description: 'See your Procurement Performance Index and how your procurement operation compares.',
};

export default function BenchmarkingPage() {
  return (
    <div className="container-page py-16">
      <BenchmarkingView />
    </div>
  );
}
