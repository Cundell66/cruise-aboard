import type { CruiseOffer } from "@/components/offer-card";

// The full Cruise Aboard fleet. Always shown in the ship filter so customers
// can pick "their" ship even when it has no current sailings from Southampton.
const KNOWN_SHIPS = ['MSC Virtuosa', 'MSC Meraviglia', 'MSC Preziosa'];

export interface FilterOptions {
  months: string[];
  ships: string[];
}

export function getFilterOptions(allCruises: CruiseOffer[]): FilterOptions {
  const months = new Set<string>();
  const ships = new Set<string>(KNOWN_SHIPS);

  allCruises.forEach((cruise) => {
    const date = new Date(cruise.date);
    months.add(`${date.toLocaleString('en-GB', { month: 'long' })} ${date.getFullYear()}`);
    if (cruise.ship) ships.add(cruise.ship);
  });

  return {
    months: Array.from(months).sort((a, b) => new Date(a).getTime() - new Date(b).getTime()),
    // Known fleet first (keeps a stable order), then any extra ships the API returns
    ships: [...KNOWN_SHIPS.filter((s) => ships.has(s)), ...Array.from(ships).filter((s) => !KNOWN_SHIPS.includes(s))],
  };
}
