import type { CruiseOffer } from "@/components/offer-card";

// Friendly labels for API region values (anything unknown passes through as-is)
const REGION_LABELS: Record<string, string> = {
  'northern europe': 'Northern Europe',
  'world-wide': 'World Cruises',
  'mediterranean': 'Mediterranean',
  'norway': 'Norwegian Fjords',
  'norwegian fjords': 'Norwegian Fjords',
  'canaries': 'Canaries',
  'canary islands': 'Canaries',
};

export interface FilterOptions {
  months: string[];
  ships: string[];
  destinations: { value: string; label: string }[];
}

export function getFilterOptions(allCruises: CruiseOffer[]): FilterOptions {
  const months = new Set<string>();
  const ships = new Set<string>();
  const regions = new Set<string>();

  allCruises.forEach((cruise) => {
    const date = new Date(cruise.date);
    months.add(`${date.toLocaleString('en-GB', { month: 'long' })} ${date.getFullYear()}`);
    if (cruise.ship) ships.add(cruise.ship);
    (cruise.regions || []).forEach((r) => regions.add(r.trim().toLowerCase()));
  });

  return {
    months: Array.from(months).sort((a, b) => new Date(a).getTime() - new Date(b).getTime()),
    ships: Array.from(ships).sort(),
    destinations: Array.from(regions)
      .sort()
      .map((r) => ({ value: r, label: REGION_LABELS[r] || r })),
  };
}

export function cruiseMatchesDestination(cruise: CruiseOffer, destinationFilter: string): boolean {
  if (!destinationFilter || destinationFilter === 'all') return true;
  const wanted = destinationFilter.trim().toLowerCase();
  const regions = (cruise.regions || []).map((r) => r.trim().toLowerCase());
  return regions.includes(wanted);
}
