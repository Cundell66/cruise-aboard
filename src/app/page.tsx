
import fs from 'fs';
import path from 'path';
import { type CruiseOffer } from "@/components/offer-card";
import { LandingPageClient } from '@/components/landing-page-client';
import { FaqItem } from '@/components/faq-section';

export const dynamic = 'force-dynamic';

interface FeaturedCruiseInfo {
  vendor_id: string;
  offerPrice: number;
  drinks?: 'included' | 'available';
  comments?: string;
}

interface ItineraryInfo {
  vendor_id: string;
  imageUrl: string;
  title: string;
}

async function getCruiseData(): Promise<{ featuredCruises: CruiseOffer[], allCruises: CruiseOffer[] }> {
  const token = process.env.TOKEN;
  const appId = process.env.APPID;

  if (!token || !appId) {
    console.error('API token or App ID is not set in environment variables.');
    return { featuredCruises: [], allCruises: [] };
  }

  // Read and parse itinerary images and titles
  const itineraryImagesFilePath = path.join(process.cwd(), 'src', 'lib', 'itinerary-images.json');
  let itineraryDataMap = new Map();
  try {
    const itineraryImagesJsonData = fs.readFileSync(itineraryImagesFilePath, 'utf-8');
    const itineraryImagesData = JSON.parse(itineraryImagesJsonData);
    if (itineraryImagesData && itineraryImagesData.itineraries) {
      itineraryDataMap = new Map(itineraryImagesData.itineraries.map((item: ItineraryInfo) => [item.vendor_id, { imageUrl: item.imageUrl, title: item.title }]));
    }
  } catch (error) {
    console.error("Could not read or parse itinerary-images.json", error);
    itineraryDataMap = new Map();
  }


  // Read and parse featured cruises
  const featuredCruisesFilePath = path.join(process.cwd(), 'src', 'lib', 'featured-cruises.json');
  let featuredCruiseMap = new Map();
  let featuredVendorIds = new Set();
  try {
    const featuredCruisesJsonData = fs.readFileSync(featuredCruisesFilePath, 'utf-8');
    const featuredCruisesData = JSON.parse(featuredCruisesJsonData);
    if (featuredCruisesData && featuredCruisesData.featured) {
        featuredCruiseMap = new Map(featuredCruisesData.featured.map((item: FeaturedCruiseInfo) => [item.vendor_id, { offerPrice: item.offerPrice, drinks: item.drinks, comments: item.comments }]));
        featuredVendorIds = new Set(featuredCruisesData.featured.map((item: FeaturedCruiseInfo) => item.vendor_id));
    }
  } catch (error) {
    console.error("Could not read or parse featured-cruises.json", error);
    featuredCruiseMap = new Map();
    featuredVendorIds = new Set();
  }


  const baseUrl = `https://www.widgety.co.uk/api/cruises.json?operator=msc-cruises&start_from=Southampton&token=${token}&app_id=${appId}&page=`;
  const headers = {
    'User-Agent': 'CruiseAboardTracker/1.2',
    'Accept': 'application/json;api_version=2',
  };

  let allCruisesFromApi: any[] = [];
  let currentPage = 1;
  let hasMorePages = true;
  const maxPages = 10; // Safety break to prevent infinite loops

  try {
    while (hasMorePages && currentPage <= maxPages) {
      const response = await fetch(`${baseUrl}${currentPage}`, {
        headers,
      });

      if (!response.ok) {
        console.error(`API call failed for page ${currentPage} with status: ${response.status}`);
        // Stop pagination on first error
        break; 
      }

      const data = await response.json();
      
      if (data.cruises && data.cruises.length > 0) {
        allCruisesFromApi = allCruisesFromApi.concat(data.cruises);
        currentPage++;
      } else {
        hasMorePages = false;
      }
    }

    const allCruises: CruiseOffer[] = allCruisesFromApi
      .filter((cruise: any) => cruise.starts_at === 'Southampton' && cruise.cruise_only_price && parseFloat(cruise.cruise_only_price) > 0)
      .map((cruise: any, index: number) => {
        const originalPrice = parseFloat(cruise.cruise_only_price);
        const itineraryInfo = itineraryDataMap.get(cruise.vendor_id);
        const imageUrl = itineraryInfo?.imageUrl || 'https://placehold.co/600x400.jpg';
        const title = itineraryInfo?.title || cruise.ship_title;
        const formattedDestinations = cruise.name && typeof cruise.name === 'string'
          ? cruise.name
            .split(',')
            .filter((destination: string) => destination.trim().toLowerCase() !== 'southampton' && destination.trim().toLowerCase() !== 'united kingdom')
            .join('<span class="text-blue-600 mx-1">● </span>')
          : "Various destinations";

        return {
          id: cruise.vendor_id || index,
          title: title,
          date: new Date(cruise.starts_on).toLocaleDateString('en-GB', { month: 'long', day: 'numeric', year: 'numeric' }) || 'Date TBC',
          imageUrl: imageUrl, 
          imageAlt: cruise.name,
          details: [
            cruise.ship_title,
            `${cruise.cruise_nights} nights`,
            "From Southampton to:",
            formattedDestinations,
            "<strong>Premium Drinks Available</strong>",
            "Gratuities Included",
            "Voyager Discount available"
          ],
          originalPrice: originalPrice,
          discountedPrice: Math.round(originalPrice * 0.9),
          ship: cruise.ship_title,
          destination: cruise.name || 'Various',
          departureDates: new Date(cruise.starts_on).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) || 'Date TBC',
        };
      });

    allCruises.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const featuredCruises = allCruises
      .filter(cruise => featuredVendorIds.has(String(cruise.id)))
      .map(cruise => {
          const featuredInfo = featuredCruiseMap.get(String(cruise.id));
          if (!featuredInfo) return cruise;

          const drinksIncluded = featuredInfo.drinks === 'included';
          const drinksText = `<strong>Premium Drinks ${drinksIncluded ? 'Included' : 'Available'}</strong>`;

          // Clone the cruise object to avoid mutating the original in the allCruises list
          const featuredCruise = { ...cruise, details: [...cruise.details] }; // Deep copy details
          featuredCruise.discountedPrice = featuredInfo.offerPrice;
          featuredCruise.drinksIncluded = drinksIncluded;
          
          // Find and replace the default drinks text
          const drinksIndex = featuredCruise.details.findIndex(detail => detail.includes("Premium Drinks"));
          if (drinksIndex !== -1) {
              featuredCruise.details[drinksIndex] = drinksText;
          }

          // Find and replace the Voyager Discount text if comments exist
          const voyagerIndex = featuredCruise.details.findIndex(detail => detail.includes("Voyager Discount"));
          if (voyagerIndex !== -1 && featuredInfo.comments) {
              featuredCruise.details[voyagerIndex] = featuredInfo.comments;
          }

          return featuredCruise;
      });
    
    return { featuredCruises, allCruises };

  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('API fetch timed out:', error);
    } else {
      console.error('Failed to fetch and process cruise offers:', error);
    }
    return { featuredCruises: [], allCruises: [] };
  }
}


export default async function LandingPage() {
  const { featuredCruises, allCruises } = await getCruiseData();

  const faqFilePath = path.join(process.cwd(), 'src', 'lib', 'faq-data.json');
  let faqItems: FaqItem[] = [];
  try {
    const faqJsonData = fs.readFileSync(faqFilePath, 'utf-8');
    faqItems = JSON.parse(faqJsonData);
  } catch (error) {
    console.error("Could not read or parse faq-data.json", error);
  }


  return <LandingPageClient featuredCruises={featuredCruises} allCruises={allCruises} faqItems={faqItems} />;
}
