export const dynamic = 'force-dynamic';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getCruiseData } from '@/lib/cruises';
import { getFilterOptions, type FilterOptions } from '@/lib/cruise-filters';
import { LandingPageClient, type ArticlePreview } from '@/components/landing-page-client';
import { FaqItem } from '@/components/faq-section';

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
  const filterOptions: FilterOptions = getFilterOptions(allCruises);

  const faqFilePath = path.join(process.cwd(), 'content', 'faqs.json');
  const faqJsonData = fs.readFileSync(faqFilePath, 'utf-8');
  const faqItems: FaqItem[] = JSON.parse(faqJsonData).faqs;

  const articles = await getArticles();

  return <LandingPageClient featuredCruises={featuredCruises} faqItems={faqItems} articles={articles} filterOptions={filterOptions} />;
}
