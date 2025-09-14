
"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export interface CruiseOffer {
  id: string | number;
  title: string;
  date: string;
  imageUrl: string;
  imageAlt: string;
  details: string[];
  originalPrice: number;
  discountedPrice: number;
  ship: string;
  destination: string;
  departureDates: string;
}

interface OfferCardProps {
  offer: CruiseOffer;
  onRequestQuote: (offer: CruiseOffer) => void;
}

export function OfferCard({ offer, onRequestQuote }: OfferCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
      <div className="bg-primary text-primary-foreground text-center p-3 flex items-center justify-center min-h-[5.5rem]">
        <h3 className="font-headline font-bold text-lg">{offer.title}</h3>
      </div>
      <CardContent className="p-0 flex-grow flex flex-col">
        <div className="p-4 text-center">
            <p className="font-headline font-semibold text-muted-foreground">{offer.date}</p>
        </div>
        <div className="relative w-full aspect-[4/3]">
          <Image
            src={offer.imageUrl}
            alt={offer.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            data-ai-hint="cruise map"
          />
        </div>
        <div className="p-6 flex-grow">
          <ul className="space-y-2 text-sm">
            {offer.details.map((detail, index) => (
              <li key={index} className="flex items-center">
                <span className="text-primary mr-2">◆</span>
                <p dangerouslySetInnerHTML={{ __html: detail }} />
              </li>
            ))}
          </ul>
        </div>
        <div className="px-6 pb-4">
          <p className="text-lg">
            <span className="text-black-1000"><strong>From: </strong></span>
            <del className="text-muted-foreground">£{offer.originalPrice}</del>
            <strong className="text-blue-600 ml-2">£{offer.discountedPrice} pp</strong>
          </p>
        </div>
        <div className="p-6 pt-2 mt-auto">
          <Button onClick={() => onRequestQuote(offer)} size="lg" className="w-full bg-accent text-white font-bold hover:bg-accent/90">
            Request A Quote
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
