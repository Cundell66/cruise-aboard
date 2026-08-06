import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { CruiseOffer } from "@/components/offer-card";

interface FeaturedCruiseCardProps {
  offer: CruiseOffer;
  onRequestQuote: (offer: CruiseOffer) => void;
}

function cleanDestinations(destination: string): string {
  return (destination || "")
    .split(",")
    .map((d) => d.trim())
    .filter((d) => d && !/southampton|united kingdom|^uk$/i.test(d))
    .join(", ");
}

export function FeaturedCruiseCard({ offer, onRequestQuote }: FeaturedCruiseCardProps) {
  const region = offer.regions?.[0] || "Northern Europe";
  const destinations = cleanDestinations(offer.destination);
  const insidePrice = offer.insidePrice ?? offer.discountedPrice;
  const balconyPrice = offer.balconyPrice;

  return (
    <section id="featured-offers" className="w-full bg-primary py-16 md:py-20">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="max-w-2xl mb-10">
          <div className="h-1 w-14 rounded bg-accent mb-5" />
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary-foreground">
            This month's featured cruise
          </h2>
          <p className="mt-3 text-lg text-primary-foreground/75">
            A short taste of the high seas, from your home port of Southampton.
          </p>
        </div>

        <Card className="grid overflow-hidden rounded-2xl border-0 bg-card text-foreground shadow-2xl md:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-[300px] md:min-h-[420px]">
            <Image
              src="/featured-cruise.jpg"
              alt={offer.ship}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-center p-8 md:p-12">
            <span className="inline-block w-fit rounded-full bg-secondary px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              Featured sailing
            </span>
            <h3 className="font-headline mt-5 text-3xl font-bold text-foreground md:text-4xl">
              {offer.ship}, {offer.nights || 3} nights
            </h3>
            <p className="mt-2 text-muted-foreground">
              {region}, {offer.date}, from Southampton
              {destinations ? `, ${destinations}` : ""}
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              <div className="rounded-xl bg-secondary/60 px-5 py-4">
                <p className="text-sm text-muted-foreground">Inside cabin</p>
                <p className="font-headline text-2xl font-bold text-primary">£{insidePrice}pp</p>
              </div>
              {balconyPrice && balconyPrice > 0 && (
                <div className="rounded-xl bg-secondary/60 px-5 py-4">
                  <p className="text-sm text-muted-foreground">Balcony cabin</p>
                  <p className="font-headline text-2xl font-bold text-primary">£{balconyPrice}pp</p>
                </div>
              )}
            </div>

            {offer.blurb && (
              <p className="mt-6 border-l-4 border-accent pl-4 italic text-foreground/80">
                {offer.blurb}
              </p>
            )}

            <div className="mt-8">
              <Button
                size="lg"
                onClick={() => onRequestQuote(offer)}
                className="bg-primary text-white font-bold hover:bg-primary/90"
              >
                View this cruise
              </Button>
            </div>

            <p className="mt-5 text-xs text-muted-foreground">
              Lead-in prices, subject to availability. Charlie will confirm the exact price for your dates and cabin, and let you know if there's a better deal.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}
