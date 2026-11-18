export const dynamic = 'force-dynamic';

import fs from 'fs';
import path from 'path';
import { getCruiseData } from '@/lib/cruises';
import { getFilterOptions, type FilterOptions } from '@/lib/cruise-filters';
import { LandingPageClient, type ArticlePreview } from '@/components/landing-page-client';
import { FaqItem } from '@/components/faq-section';
import { getArticles } from '@/lib/articles';

export default async function LandingPage() {
  const { featuredCruises, allCruises } = await getCruiseData();
  const filterOptions: FilterOptions = getFilterOptions(allCruises);

  const faqFilePath = path.join(process.cwd(), 'content', 'faqs.json');
  const faqJsonData = fs.readFileSync(faqFilePath, 'utf-8');
  const faqItems: FaqItem[] = JSON.parse(faqJsonData).faqs;

  const articles: ArticlePreview[] = (await getArticles()).map((a) => ({
    slug: a.slug,
    title: a.title,
    date: a.date,
    excerpt: a.excerpt,
    imageUrl: a.imageUrl,
  }));

  return <LandingPageClient featuredCruises={featuredCruises} faqItems={faqItems} articles={articles} filterOptions={filterOptions} />;
}
