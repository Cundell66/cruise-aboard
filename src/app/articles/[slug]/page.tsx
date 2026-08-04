
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Article {
  slug: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  imageUrl: string;
  imageAlt: string;
  imageHint: string;
  content: string;
}

const articlesDir = path.join(process.cwd(), 'content', 'articles');

// This function tells Next.js which slugs to pre-render at build time.
export async function generateStaticParams() {
  try {
    const files = (await fs.readdir(articlesDir)).filter((f) => f.endsWith('.md'));
    return files.map((file) => ({
      slug: file.replace(/\.md$/, ''),
    }));
  } catch (error) {
    console.error('Could not read articles for static params:', error);
    return [];
  }
}

async function getArticle(slug: string): Promise<Article | undefined> {
  const filePath = path.join(articlesDir, `${slug}.md`);
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    const { data, content } = matter(raw);
    return {
      slug: data.slug || slug,
      title: data.title || '',
      author: data.author || '',
      date: data.date || '',
      excerpt: data.excerpt || '',
      imageUrl: data.imageUrl || '',
      imageAlt: data.imageAlt || '',
      imageHint: data.imageHint || '',
      content,
    };
  } catch (error) {
    console.error('Failed to read article:', error);
    return undefined;
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);

  if (!article) {
    notFound();
  }

  const html = marked.parse(article.content);

  return (
    <main className="container mx-auto max-w-4xl p-4 md:p-8">
      <Card className="overflow-hidden">
        <CardHeader className="p-0">
          <div className="relative w-full aspect-[16/9]">
            <Image
              src={article.imageUrl}
              alt={article.imageAlt}
              fill
              className="object-cover"
              data-ai-hint={article.imageHint}
              priority
            />
          </div>
          <div className="p-6 pb-2">
            <CardTitle className="font-headline text-3xl md:text-4xl">
              {article.title}
            </CardTitle>
            <CardDescription className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-base">
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <time dateTime={article.date}>
                    {format(new Date(article.date), 'MMMM d, yyyy')}
                    </time>
                </div>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div
            className="prose prose-lg max-w-none text-muted-foreground prose-h3:font-headline prose-h3:text-foreground prose-strong:text-foreground"
            dangerouslySetInnerHTML={{ __html: html }}
          />
           <div className="mt-8 pt-6 border-t">
             <Button asChild variant="outline">
                <Link href="/articles">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Articles
                </Link>
             </Button>
           </div>
        </CardContent>
      </Card>
    </main>
  );
}
