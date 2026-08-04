
"use client";

import { useState, useRef, useMemo } from "react";
import Image from "next/image";
import type { SuggestAlternativeCruisesOutput } from "@/ai/flows/suggest-alternative-cruises";
import { EnquiryForm } from "@/components/enquiry-form";
import { CruiseSuggestions } from "@/components/cruise-suggestions";
import { submitEnquiry } from "@/app/actions";
import { Anchor, Ship, Filter, XCircle } from "lucide-react";
import type { EnquiryFormValues } from "@/components/enquiry-form";
import { OfferCard, type CruiseOffer } from "@/components/offer-card";
import { FaqSection, type FaqItem } from "@/components/faq-section";
import { InclusionsSection } from "./inclusions-section";
import { TestimonialsSection } from "./testimonials-section";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "./ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const videos = [
   {
      ship: 'MSC Virtuosa',
      src: 'https://iframe.mediadelivery.net/embed/58732/3c61795a-5d9d-42f0-8e69-bb760aa53c0b?autoplay=true&loop=true&muted=true&preload=true&responsive=true',
    },
    {
      ship: 'MSC Poesia',
      src: 'https://iframe.mediadelivery.net/embed/58732/7dc1b7ca-62e6-4949-b4c3-8d91f66f7bd0?autoplay=true&loop=true&muted=true&preload=true&responsive=true',
    },
    {
      ship: 'MSC Preziosa',
      src: 'https://iframe.mediadelivery.net/embed/58732/6bc430cb-6689-41e7-b5bb-1bbe3ddff9a5?autoplay=true&loop=true&muted=true&preload=true&responsive=true',
    },
  ];

interface LandingPageClientProps {
    featuredCruises: CruiseOffer[];
    allCruises: CruiseOffer[];
    faqItems: FaqItem[];
}

export function LandingPageClient({ featuredCruises, allCruises, faqItems }: LandingPageClientProps) {
  const [submissionState, setSubmissionState] = useState<SuggestAlternativeCruisesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<Partial<EnquiryFormValues> | undefined>(undefined);
  
  const [monthFilter, setMonthFilter] = useState('all');
  const [shipFilter, setShipFilter] = useState('all');

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

  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    allCruises.forEach(cruise => {
        const date = new Date(cruise.date);
        const monthYear = `${date.toLocaleString('en-GB', { month: 'long' })} ${date.getFullYear()}`;
        months.add(monthYear);
    });
    return Array.from(months);
  }, [allCruises]);

  const availableShips = ['MSC Virtuosa', 'MSC Poesia', 'MSC Preziosa'];

  const filteredCruises = useMemo(() => {
    return allCruises.filter(cruise => {
        const date = new Date(cruise.date);
        const cruiseMonthYear = `${date.toLocaleString('en-GB', { month: 'long' })} ${date.getFullYear()}`;
        
        const monthMatch = monthFilter === 'all' || cruiseMonthYear === monthFilter;
        const shipMatch = shipFilter === 'all' || cruise.ship === shipFilter;

        return monthMatch && shipMatch;
    });
  }, [allCruises, monthFilter, shipFilter]);
    
  const handleClearFilters = () => {
    setMonthFilter('all');
    setShipFilter('all');
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-full bg-background text-foreground">
      <main className="w-full max-w-7xl mx-auto p-4 md:p-8 flex-grow">
        <header className="text-center mb-8">
          <div className="flex justify-center items-center gap-4 mb-2">
            <Image
              src="/cruise-aboard-logo.png"
              alt="Cruise Aboard Logo"
              width={72}
              height={72}
              className="rounded-md"
            />
          </div>
          <p className="font-headline text-2xl md:text-3xl font-semibold text-primary/90 mb-2">
            MSC cruises from Southampton, sorted properly.
          </p>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            I'm Charlie — one person, no call centres. Browse the cruises below,
            then ask me for a quote. I'll find you the right ship, the right
            cabin and the right price.
          </p>
        </header>

        <div className="mb-12 max-w-3xl mx-auto text-2xl text-muted-foreground text-center font-headline">
          {/* <strong>Cruise Week - An EXTRA 5% Off All Listed Prices</strong>
          <img src="/cruise-week.jpg" alt="Cruise Week Monday 15 - Sunday 21 September 2025" /> */}
            <Carousel className="w-full">
              <CarouselContent>
                {videos.map((video, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card>
                        <CardContent className="relative flex flex-col aspect-video items-center justify-center p-0 rounded-lg overflow-hidden">
                           <div className="absolute top-0 left-0 w-full z-10 p-4 bg-gradient-to-b from-black/60 to-transparent">
                             <h3 className="font-headline text-2xl font-bold text-white text-center">{video.ship}</h3>
                           </div>
                           <iframe
                             src={video.src}
                             className="absolute top-0 left-0 w-full h-full border-0"
                             allow="autoplay; fullscreen"
                             allowFullScreen
                             referrerPolicy="no-referrer"
                           ></iframe>
                         </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </Carousel>
          </div>

        {featuredCruises.length > 0 && (
          <section id="featured-offers" className="mb-16">
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-center text-primary/90 mb-8">Featured Offers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredCruises.map(offer => (
                  <OfferCard key={offer.id} offer={offer} onRequestQuote={handleRequestQuote} />
                ))}
              </div>
          </section>
        )}

        <section id="all-offers" className="mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-center text-primary/90 mb-8">All MSC Cruises from Southampton</h2>
            
            <div className="bg-card p-4 rounded-lg border shadow-sm mb-8 flex flex-col md:flex-row items-center gap-4">
                <div className="flex items-center gap-2 font-semibold text-primary/90">
                    <Filter className="w-5 h-5"/>
                    <span>Filter Cruises:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:flex-row gap-4 w-full md:w-auto flex-grow">
                    <Select value={monthFilter} onValueChange={setMonthFilter}>
                        <SelectTrigger className="w-full sm:w-[200px]">
                            <SelectValue placeholder="Filter by month..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Months</SelectItem>
                            {availableMonths.map(month => (
                                <SelectItem key={month} value={month}>{month}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={shipFilter} onValueChange={setShipFilter}>
                        <SelectTrigger className="w-full sm:w-[200px]">
                            <SelectValue placeholder="Filter by ship..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Ships</SelectItem>
                            {availableShips.map(ship => (
                                <SelectItem key={ship} value={ship}>{ship}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {(monthFilter !== 'all' || shipFilter !== 'all') && (
                    <Button variant="ghost" onClick={handleClearFilters} className="text-muted-foreground hover:text-foreground">
                        <XCircle className="w-4 h-4 mr-2" />
                        Clear Filters
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
                    <p className="text-lg text-muted-foreground">No cruises match your selected filters.</p>
                </div>
              )}
            </div>
        </section>

        <div ref={formRef} className="w-full max-w-2xl mx-auto scroll-mt-20 mb-16">
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

        <InclusionsSection />
        <TestimonialsSection />
        <FaqSection items={faqItems} />

      </main>
    </div>
  );
}
