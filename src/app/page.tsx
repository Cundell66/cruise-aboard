
import fs from 'fs';
import path from 'path';
import { type CruiseOffer } from "@/components/offer-card";
import { LandingPageClient } from '@/components/landing-page-client';
import { FaqItem } from '@/components/faq-section';

async function getCruiseOffers(): Promise<CruiseOffer[]> {
  const url = 'https://www.widgety.co.uk/api/cruises.json?token=df770a1821b3878341f3870173e3c2d2733a10d4a7d8c34fd05f0e83f6dc7dfa&app_id=4ad715a61acc68d4505319eb4270705fc20d2790';
  const headers = {
    'User-Agent': 'CruiseAboardTracker/1.2',
    'Accept': 'application/json;api_version=2',
  };

  try {
    const response = await fetch(url, { 
      headers,
      // Using 'no-cache' to ensure we always get the latest data.
      // Consider 'revalidate' for production use if data doesn't change too frequently.
      cache: 'no-cache' 
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const data = await response.json();

    // Map the API response to the CruiseOffer interface
    // This mapping is based on a likely structure. If it's different, we'll need to adjust it.
    return data.cruises.map((cruise: any, index: number) => ({
      id: cruise.id || index,
      title: cruise.cruise_line.name,
      date: new Date(cruise.sailings[0]?.start_date).toLocaleDateString('en-GB', { month: 'long', day: 'numeric', year: 'numeric' }) || 'Date TBC',
      imageUrl: cruise.images[0]?.url || 'https://placehold.co/600x400',
      imageAlt: cruise.name,
      details: [
        `${cruise.duration_nights} nights`,
        cruise.name,
        `From: <strong>£${cruise.sailings[0]?.price_pp || 'N/A'}pp</strong>`,
        "Gratuities Included",
        "Voyager Discount available"
      ],
      originalPrice: cruise.sailings[0]?.price_pp, // Assuming no separate original price from API
      discountedPrice: cruise.sailings[0]?.price_pp,
      ship: cruise.ship.name,
      destination: cruise.itinerary.name,
      departureDates: new Date(cruise.sailings[0]?.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) || 'Date TBC',
    }));

  } catch (error) {
    console.error('Failed to fetch cruise offers:', error);
    // Return an empty array or some fallback data in case of an error
    return [];
  }
}


export default async function LandingPage() {
  const cruiseOffers = await getCruiseOffers();

  const faqFilePath = path.join(process.cwd(), 'src', 'lib', 'faq-data.json');
  const faqJsonData = fs.readFileSync(faqFilePath, 'utf-8');
  const faqItems: FaqItem[] = JSON.parse(faqJsonData);


  return <LandingPageClient cruiseOffers={cruiseOffers} faqItems={faqItems} />;
}
