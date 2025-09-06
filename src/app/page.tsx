import FrostyStrategistClient from '@/components/frosty-strategist-client';
import ErrorBoundary from '@/components/error-boundary';

export default function Home() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <ErrorBoundary>
        <FrostyStrategistClient />
      </ErrorBoundary>
    </main>
  );
}
