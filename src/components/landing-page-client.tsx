"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SuggestAlternativeCruisesOutput } from "@/ai/flows/suggest-alternative-cruises";
import { EnquiryForm } from "@/components/enquiry-form";
import { CruiseSuggestions } from "@/components/cruise-suggestions";
import { submitEnquiry } from "@/app/actions";
import { Facebook, Mail, CheckCircle } from "lucide-react";
import type { EnquiryFormValues } from "@/components/enquiry-form";
import { OfferCard, type CruiseOffer } from "@/components/offer-card";
import { FaqSection, type FaqItem } from "@/components/faq-section";
import { InclusionsSection } from "./inclusions-section";
import { TestimonialsSection } from "./testimonials-section";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "./ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SITE_CONFIG, CONTACT_LINKS } from "@/lib/site-config";
import type { FilterOptions } from "@/lib/cruise-filters";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export interface ArticlePreview {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  imageUrl: string;
}

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
    faqItems: FaqItem[];
    articles: ArticlePreview[];
    filterOptions: FilterOptions;
}

export function LandingPageClient({ featuredCruises, faqItems, articles, filterOptions }: LandingPageClientProps) {
  const router = useRouter();
  const [submissionState, setSubmissionState] = useState<SuggestAlternativeCruisesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<Partial<EnquiryFormValues> | undefined>(undefined);

  const [shipFilter, setShipFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');

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

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (shipFilter !== 'all') params.set('ship', shipFilter);
    if (monthFilter !== 'all') params.set('month', monthFilter);
    if (durationFilter !== 'all') params.set('duration', durationFilter);
    const qs = params.toString();
    router.push(qs ? `/cruises?${qs}` : '/cruises');
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-background text-foreground">

      {/* ===== HERO ===== */}
      <section className="relative w-full min-h-[560px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero.jpg"
            alt="MSC Virtuosa in Geirangerfjord, Norway"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/60 to-transparent" />
        </div>
        <div className="relative container mx-auto px-4 md:px-6 py-24 md:py-32 text-primary-foreground">
          <p className="text-accent font-headline font-semibold tracking-widest uppercase text-sm mb-4">
            Cruise Aboard
          </p>
          <h1 className="font-headline text-4xl md:text-6xl font-bold max-w-2xl leading-tight mb-5">
            Your cruise, handled by Charlie.
          </h1>
          <p className="text-lg md:text-xl max-w-xl mb-8 text-primary-foreground/90">
            No call centres. No faceless booking sites. Just Charlie, a real person who finds you the right cruise, answers every question and handles the details so you don't have to.
          </p>
          <Button
            size="lg"
            onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-accent text-white font-bold text-lg px-8 py-6 h-auto hover:bg-accent/90"
          >
            Talk To Me Today
          </Button>
        </div>
      </section>

      <main className="w-full max-w-7xl mx-auto p-4 md:p-8 flex-grow">

        {/* ===== SEARCH STRIP ===== */}
        <section className="-mt-10 relative z-10 mb-12">
          <Card className="border shadow-xl bg-card">
            <CardContent className="p-5 md:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-primary mb-1 block">Date</label>
                  <Select value={monthFilter} onValueChange={setMonthFilter}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="When?" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any time</SelectItem>
                      {filterOptions.months.map((month) => (
                        <SelectItem key={month} value={month}>{month}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-primary mb-1 block">Ship</label>
                  <Select value={shipFilter} onValueChange={setShipFilter}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Which ship?" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any ship</SelectItem>
                      {filterOptions.ships.map((ship) => (
                        <SelectItem key={ship} value={ship}>{ship}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-primary mb-1 block">Duration</label>
                  <Select value={durationFilter} onValueChange={setDurationFilter}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="How long?" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any length</SelectItem>
                      <SelectItem value="3-5">3-5 nights</SelectItem>
                      <SelectItem value="6-9">6-9 nights</SelectItem>
                      <SelectItem value="10+">10+ nights</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSearch} size="lg" className="w-full bg-primary text-white font-bold hover:bg-primary/90 h-11">
                  <SearchIcon /> Search cruises
                </Button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground italic">
                Don't see what you're after? <span className="text-primary font-medium">I can find any cruise on any ship. Just ask.</span>
              </p>
            </CardContent>
          </Card>
        </section>

        {/* ===== ABOUT CHARLIE ===== */}
        <section id="about" className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary/90 mb-6">
                A few words about Charlie
              </h2>
              <div className="space-y-4 text-lg text-foreground/90">
                <p>
                  I'm Charlie, and I run Cruise Aboard from the place I love most: my Facebook group of <strong>{SITE_CONFIG.groupMembers} MSC cruisers</strong> (and counting), where I've spent years helping people plan the holidays they actually want.
                </p>
                <p>
                  I don't do call centres or scripts. When you talk to me, you get me. From your first question to the moment you step back on the gangway. I've helped hundreds of families, couples and groups book their cruises, and I'll be honest with you about what's worth your money and what isn't.
                </p>
                <p>
                  Parking sorted. Voyager Club discounts applied. Cabin questions answered. Shore excursions suggested. I'll handle the lot. You just pack the suncream.
                </p>
              </div>
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card border rounded-lg p-4 text-center shadow-sm">
                  <p className="font-headline text-2xl font-bold text-primary">{SITE_CONFIG.groupMembers}</p>
                  <p className="text-xs text-muted-foreground mt-1">group members</p>
                </div>
                <div className="bg-card border rounded-lg p-4 text-center shadow-sm">
                  <p className="font-headline text-2xl font-bold text-primary">100s</p>
                  <p className="text-xs text-muted-foreground mt-1">of cruises booked</p>
                </div>
                <div className="bg-card border rounded-lg p-4 text-center shadow-sm">
                  <p className="font-headline text-2xl font-bold text-primary">5-star</p>
                  <p className="text-xs text-muted-foreground mt-1">personal service</p>
                </div>
                <div className="bg-card border rounded-lg p-4 text-center shadow-sm">
                  <p className="font-headline text-2xl font-bold text-primary">ATOL</p>
                  <p className="text-xs text-muted-foreground mt-1">protected booking</p>
                </div>
              </div>
            </div>
            <div className="bg-secondary/50 border rounded-xl p-8">
              <h3 className="font-headline text-2xl font-bold text-primary mb-4">Why book with Charlie?</h3>
              <ul className="space-y-4">
                {[
                  "Real prices, checked for you",
                  "Voyager Club discounts applied",
                  "Parking sorted for you",
                  "Honest advice on what's worth it",
                  "ATOL-protected booking",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                    <span className="text-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/about" className="inline-block mt-6 font-semibold text-primary hover:text-primary/70">
                More about Charlie →
              </Link>
            </div>
          </div>
        </section>

        {/* ===== FEATURED CRUISES ===== */}
        {featuredCruises.length > 0 && (
          <section id="featured-offers" className="mb-16">
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-center text-primary/90 mb-8">This month's featured cruises</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredCruises.map(offer => (
                  <OfferCard key={offer.id} offer={offer} onRequestQuote={handleRequestQuote} />
                ))}
              </div>
              <div className="text-center mt-8">
                <Button asChild variant="outline" size="lg" className="font-bold">
                  <Link href="/cruises">See all cruises from Southampton</Link>
                </Button>
              </div>
          </section>
        )}

        {/* ===== ENQUIRY FORM ===== */}
        <div ref={formRef} id="quote" className="w-full max-w-2xl mx-auto scroll-mt-20 mb-16">
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

        {/* ===== SHIP VIDEOS ===== */}
        <section id="ships" className="mb-16">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center text-primary/90 mb-8">Take a look on board</h2>
          <Carousel className="w-full">
            <CarouselContent>
              {videos.map((video, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
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
        </section>

        {/* ===== SOCIALS ===== */}
        <section id="community" className="mb-16 text-center bg-secondary/40 border rounded-xl p-10">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary/90 mb-4">Join the community</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Join <strong className="text-primary">{SITE_CONFIG.groupMembers} cruisers</strong> who've already found their man in the group.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary text-white font-bold hover:bg-primary/90">
              <a href={SITE_CONFIG.facebookGroup || CONTACT_LINKS.messengerHref} target="_blank" rel="noopener noreferrer">
                <Facebook className="w-5 h-5 mr-2" /> Join our Facebook group
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-bold">
              <a href={CONTACT_LINKS.messengerHref} target="_blank" rel="noopener noreferrer">
                <Mail className="w-5 h-5 mr-2" /> Message Charlie
              </a>
            </Button>
          </div>
        </section>

        <InclusionsSection />
        <TestimonialsSection />

        {/* ===== NEWS / BLOG ===== */}
        {articles.length > 0 && (
          <section id="news" className="mb-16">
            <div className="text-center mb-10">
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary/90 mb-3">Cruise tips &amp; news</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Everything you need to know before you sail.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {articles.slice(0, 3).map((article) => (
                <Link key={article.slug} href={`/articles/${article.slug}`} className="block group">
                  <Card className="h-full overflow-hidden shadow-sm hover:shadow-primary/20 transition-all duration-300 group-hover:border-primary/40">
                    <div className="relative w-full h-44">
                      <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-headline text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{article.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">{article.excerpt}</p>
                      <span className="inline-block mt-3 font-semibold text-sm text-primary">Read more ›</span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button asChild variant="outline" size="lg" className="font-bold">
                <Link href="/articles">Read the blog</Link>
              </Button>
            </div>
          </section>
        )}

        <FaqSection items={faqItems} />

      </main>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  );
}
