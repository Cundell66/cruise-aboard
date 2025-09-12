
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
      // Revalidate the data every hour (3600 seconds)
      next: { revalidate: 3600 } 
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const data = await response.json();

    // Filter and Map the API response to the CruiseOffer interface
    return data.cruises
      .filter((cruise: any) => cruise.starts_at === 'Southampton' && cruise.cruise_only_price && parseFloat(cruise.cruise_only_price) > 0)
      .map((cruise: any, index: number) => {
        const originalPrice = parseFloat(cruise.cruise_only_price);
        const discountedPrice = Math.round(originalPrice * 0.9);

        return {
          id: cruise.vendor_id || index,
          title: cruise.ship_title,
          date: new Date(cruise.starts_on).toLocaleDateString('en-GB', { month: 'long', day: 'numeric', year: 'numeric' }) || 'Date TBC',
          imageUrl: 'https://placehold.co/600x400', // API does not seem to provide images
          imageAlt: cruise.name,
          details: [
            `${cruise.cruise_nights} nights`,
            cruise.name,
            "Gratuities Included",
            "Voyager Discount available"
          ],
          originalPrice: originalPrice,
          discountedPrice: discountedPrice,
          ship: cruise.ship_title,
          destination: cruise.regions.join(', ') || 'Various',
          departureDates: new Date(cruise.starts_on).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) || 'Date TBC',
        };
      });

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
