import { getCruiseData } from '@/lib/cruises';
import { CruisesClient } from '@/components/cruises-client';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Cruise Aboard - All MSC Cruises from Southampton',
  description: "Browse live MSC cruises from Southampton with real prices. Filter by month, ship, destination and duration, then ask Charlie to sort the rest.",
};

interface SearchParams {
  month?: string;
  destination?: string;
  duration?: string;
}

export default async function CruisesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { allCruises } = await getCruiseData();
  const params = await searchParams;

  return (
    <CruisesClient
      allCruises={allCruises}
      initialMonth={params.month}
      initialDestination={params.destination}
      initialDuration={params.duration}
    />
  );
}
