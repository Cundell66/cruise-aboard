"use client";

import { useState, useRef, useMemo } from "react";
import type { SuggestAlternativeCruisesOutput } from "@/ai/flows/suggest-alternative-cruises";
import { EnquiryForm } from "@/components/enquiry-form";
import { CruiseSuggestions } from "@/components/cruise-suggestions";
import { submitEnquiry } from "@/app/actions";
import { Filter, XCircle, Search } from "lucide-react";
import type { EnquiryFormValues } from "@/components/enquiry-form";
import { OfferCard, type CruiseOffer } from "@/components/offer-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "./ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { getFilterOptions, cruiseMatchesDestination } from "@/lib/cruise-filters";

interface CruisesClientProps {
  allCruises: CruiseOffer[];
  initialMonth?: string;
  initialDestination?: string;
  initialDuration?: string;
}

export function CruisesClient({ allCruises, initialMonth, initialDestination, initialDuration }: CruisesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [submissionState, setSubmissionState] = useState<SuggestAlternativeCruisesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<Partial<EnquiryFormValues> | undefined>(undefined);

  const [monthFilter, setMonthFilter] = useState(initialMonth && initialMonth !== 'all' ? initialMonth : 'all');
  const [shipFilter, setShipFilter] = useState('all');
  const [destinationFilter, setDestinationFilter] = useState(initialDestination && initialDestination !== 'all' ? initialDestination : 'all');
  const [durationFilter, setDurationFilter] = useState(initialDuration && initialDuration !== 'all' ? initialDuration : 'all');

  const formRef = useRef<HTMLDivElement>(null);

  const handleFormSubmit = async (data: EnquiryFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await submitEnquiry(data);
      if (result.success && result.suggestions) {
        setSubmissionState({ suggestions: result.suggestions });
      } else {
        setError(result.error || "An unexpected error occurred. Please try again.");
      }
    } catch (e) {
      setError("A server error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestQuote = (offer: CruiseOffer) => {
    setSelectedOffer({
      ship: offer.ship,
      destination: offer.destination,
      departureDates: offer.departureDates,
      vendorId: String(offer.id),
    });
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const availableMonths = useMemo(() => getFilterOptions(allCruises).months, [allCruises]);

  const availableShips = useMemo(() => getFilterOptions(allCruises).ships, [allCruises]);

  const availableDestinations = useMemo(() => getFilterOptions(allCruises).destinations, [allCruises]);

  const filteredCruises = useMemo(() => {
    return allCruises.filter(cruise => {
        const date = new Date(cruise.date);
        const cruiseMonthYear = `${date.toLocaleString('en-GB', { month: 'long' })} ${date.getFullYear()}`;

        const monthMatch = monthFilter === 'all' || cruiseMonthYear === monthFilter;
        const shipMatch = shipFilter === 'all' || cruise.ship === shipFilter;
        const destMatch = cruiseMatchesDestination(cruise, destinationFilter);
        const durationMatch = durationFilter === 'all'
          || (durationFilter === '3-5' && cruise.nights && cruise.nights >= 3 && cruise.nights <= 5)
          || (durationFilter === '6-9' && cruise.nights && cruise.nights >= 6 && cruise.nights <= 9)
          || (durationFilter === '10+' && cruise.nights && cruise.nights >= 10);

        return monthMatch && shipMatch && destMatch && durationMatch;
    });
  }, [allCruises, monthFilter, shipFilter, destinationFilter, durationFilter]);

  const syncFiltersToUrl = (month: string, destination: string, duration: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const set = (key: string, value: string) => {
      if (value && value !== 'all') params.set(key, value);
      else params.delete(key);
    };
    set('month', month);
    set('destination', destination);
    set('duration', duration);
    router.replace(`/cruises?${params.toString()}`, { scroll: false });
  };

  const handleMonthChange = (v: string) => { setMonthFilter(v); syncFiltersToUrl(v, destinationFilter, durationFilter); };
  const handleDestinationChange = (v: string) => { setDestinationFilter(v); syncFiltersToUrl(monthFilter, v, durationFilter); };
  const handleDurationChange = (v: string) => { setDurationFilter(v); syncFiltersToUrl(monthFilter, destinationFilter, v); };

  const handleClearFilters = () => {
    setMonthFilter('all');
    setShipFilter('all');
    setDestinationFilter('all');
    setDurationFilter('all');
    router.replace('/cruises', { scroll: false });
  };

  const hasActiveFilters = monthFilter !== 'all' || shipFilter !== 'all' || destinationFilter !== 'all' || durationFilter !== 'all';

  return (
    <main className="w-full max-w-7xl mx-auto p-4 md:p-8 flex-grow">
      <div className="text-center mb-8">
        <h1 className="font-headline text-3xl md:text-5xl font-bold text-primary/90 mb-3">
          All MSC Cruises from Southampton
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Live prices, straight from MSC. Find your sailing, then ask Charlie to sort the rest.
        </p>
      </div>

      <div className="bg-card p-4 rounded-lg border shadow-sm mb-8 flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center gap-2 font-semibold text-primary/90">
          <Filter className="w-5 h-5" />
          <span>Filter:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full flex-grow">
          <Select value={monthFilter} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Month..." /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Months</SelectItem>
              {availableMonths.map(month => (
                <SelectItem key={month} value={month}>{month}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={shipFilter} onValueChange={setShipFilter}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Ship..." /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ships</SelectItem>
              {availableShips.map(ship => (
                <SelectItem key={ship} value={ship}>{ship}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={destinationFilter} onValueChange={handleDestinationChange}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Destination..." /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Anywhere</SelectItem>
              {availableDestinations.map((d) => (
                <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={durationFilter} onValueChange={handleDurationChange}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Duration..." /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any length</SelectItem>
              <SelectItem value="3-5">3-5 nights</SelectItem>
              <SelectItem value="6-9">6-9 nights</SelectItem>
              <SelectItem value="10+">10+ nights</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" onClick={handleClearFilters} className="text-muted-foreground hover:text-foreground shrink-0">
            <XCircle className="w-4 h-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCruises.length > 0 ? (
          filteredCruises.map(offer => (
            <OfferCard key={offer.id} offer={offer} onRequestQuote={handleRequestQuote} />
          ))
        ) : (
          <div className="md:col-span-2 lg:col-span-3 text-center py-10">
            <Search className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-lg text-muted-foreground mb-4">No cruises match your selected filters.</p>
            <Button variant="outline" onClick={handleClearFilters}>Clear Filters</Button>
          </div>
        )}
      </div>

      <div ref={formRef} id="quote" className="w-full max-w-2xl mx-auto scroll-mt-20 mt-16">
        {submissionState ? (
          <CruiseSuggestions suggestions={submissionState.suggestions} />
        ) : (
          <EnquiryForm
            key={selectedOffer ? `${selectedOffer.ship}-${selectedOffer.destination}` : 'default'}
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
            serverError={error}
            initialData={selectedOffer}
          />
        )}
      </div>
    </main>
  );
}
