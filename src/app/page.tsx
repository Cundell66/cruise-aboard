
export const dynamic = 'force-dynamic';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { type CruiseOffer } from "@/components/offer-card";
import { LandingPageClient, type ArticlePreview } from '@/components/landing-page-client';
import { FaqItem } from '@/components/faq-section';

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
  const itineraryImagesJsonData = fs.readFileSync(itineraryImagesFilePath, 'utf-8');
  const itineraryImagesData = JSON.parse(itineraryImagesJsonData);
  const itineraryDataMap = new Map<string, { imageUrl: string; title: string }>(itineraryImagesData.itineraries.map((item: ItineraryInfo) => [item.vendor_id, { imageUrl: item.imageUrl, title: item.title }]));

  // Read and parse featured cruises
  const featuredCruisesFilePath = path.join(process.cwd(), 'content', 'featured-cruises.json');
  const featuredCruisesJsonData = fs.readFileSync(featuredCruisesFilePath, 'utf-8');
  const featuredCruisesData = JSON.parse(featuredCruisesJsonData);
  const featuredCruiseMap = new Map<string, { offerPrice: number; drinks?: 'included' | 'available'; comments?: string }>(featuredCruisesData.featured.map((item: FeaturedCruiseInfo) => [item.vendor_id, { offerPrice: item.offerPrice, drinks: item.drinks, comments: item.comments }]));
  const featuredVendorIds = new Set(featuredCruisesData.featured.map((item: FeaturedCruiseInfo) => item.vendor_id));

  // Read site settings (editable via Decap CMS)
  const siteSettingsFilePath = path.join(process.cwd(), 'content', 'site-settings.json');
  const siteSettingsJsonData = fs.readFileSync(siteSettingsFilePath, 'utf-8');
  const siteSettings = JSON.parse(siteSettingsJsonData);
  const discountPercent = siteSettings.voyagerDiscountPercent ?? 5;
  const voyagerDiscountLabel = siteSettings.voyagerDiscountLabel ?? 'Voyager Discount available';
  const discountFactor = (100 - discountPercent) / 100;


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
        const originalPrice = parseFloat(cruise.cruise_only_price) || 0;
        const itineraryInfo = itineraryDataMap.get(cruise.vendor_id);
        const imageUrl = itineraryInfo?.imageUrl || 'https://placehold.co/600x400.jpg';
        const title = itineraryInfo?.title || cruise.ship_title || '';
        const formattedDestinations = cruise.name
          ?.split(',')
          .filter((destination: string) => destination.trim().toLowerCase() !== 'southampton' && destination.trim().toLowerCase() !== 'united kingdom')
          .join('<span class="text-blue-600 mx-1">● </span>') || '';

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
            voyagerDiscountLabel
          ],
          originalPrice: originalPrice,
          discountedPrice: Math.round(originalPrice * discountFactor),
          ship: cruise.ship_title || '',
          destination: cruise.name || 'Various',
          departureDates: new Date(cruise.starts_on).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) || 'Date TBC',
          nights: cruise.cruise_nights ? Number(cruise.cruise_nights) : 0,
        };
      });

    allCruises.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const featuredCruises = allCruises
      .filter(cruise => featuredVendorIds.has(String(cruise.id)))
      .map(cruise => {
          const featuredInfo = featuredCruiseMap.get(String(cruise.id));
          if (!featuredInfo) return cruise;

          const featuredCruise = { ...cruise, details: [...cruise.details] };
          
          featuredCruise.discountedPrice = featuredInfo.offerPrice;
          const drinksIncluded = featuredInfo.drinks === 'included';
          featuredCruise.drinksIncluded = drinksIncluded;
          
          const drinksIndex = featuredCruise.details.findIndex(detail => detail?.includes("Premium Drinks"));
          if (drinksIndex !== -1) {
              const drinksText = `<strong>Premium Drinks ${drinksIncluded ? 'Included' : 'Available'}</strong>`;
              featuredCruise.details[drinksIndex] = drinksText;
          }

          const voyagerIndex = featuredCruise.details.findIndex(detail => detail?.includes("Voyager Discount"));
          if (voyagerIndex !== -1 && featuredInfo.comments) {
              featuredCruise.details[voyagerIndex] = featuredInfo.comments;
          }

          return featuredCruise;
      });
    
    return { featuredCruises, allCruises };

  } catch (error) {
    console.error('Failed to fetch and process cruise offers:', error);
    return { featuredCruises: [], allCruises: [] };
  }
}


async function getArticles(): Promise<ArticlePreview[]> {
  try {
    const dir = path.join(process.cwd(), 'content', 'articles');
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
    const articles: ArticlePreview[] = files.map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
      const { data } = matter(raw);
      return {
        slug: data.slug || file.replace(/\.md$/, ''),
        title: data.title || '',
        date: data.date || '',
        excerpt: data.excerpt || '',
        imageUrl: data.imageUrl || '',
      };
    });
    articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return articles;
  } catch (error) {
    console.error('Failed to read articles:', error);
    return [];
  }
}

export default async function LandingPage() {
  const { featuredCruises, allCruises } = await getCruiseData();

  const faqFilePath = path.join(process.cwd(), 'content', 'faqs.json');
  const faqJsonData = fs.readFileSync(faqFilePath, 'utf-8');
  const faqItems: FaqItem[] = JSON.parse(faqJsonData).faqs;

  const articles = await getArticles();

  return <LandingPageClient featuredCruises={featuredCruises} allCruises={allCruises} faqItems={faqItems} articles={articles} />;
}
