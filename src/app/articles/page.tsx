
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Newspaper, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { getArticles } from '@/lib/articles';

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <main className="container mx-auto max-w-5xl p-4 md:p-8">
      <div className="text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary/90 flex items-center justify-center gap-3">
            <Newspaper className="w-10 h-10" />
            Cruise Articles
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
            Tips, guides, and inspiration for your next cruise adventure.
        </p>
      </div>

      {articles.length > 0 ? (
        <div className="space-y-8">
          {articles.map((article) => (
            <Link key={article.slug} href={`/articles/${article.slug}`} className="block group">
              <Card className="flex flex-col md:flex-row overflow-hidden shadow-lg hover:shadow-primary/20 transition-all duration-300 group-hover:border-primary/40">
                <div className="md:w-1/3 relative h-60 md:h-auto">
                   <Image
                    src={article.imageUrl}
                    alt={article.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                    data-ai-hint={article.imageHint}
                  />
                </div>
                <div className="md:w-2/3 flex flex-col">
                  <CardHeader>
                    <CardTitle className="font-headline text-2xl group-hover:text-primary transition-colors">
                      {article.title}
                    </CardTitle>
                    <CardDescription>
                      <span>By {article.author}</span> | <span>{format(new Date(article.date), 'MMMM d, yyyy')}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground">{article.excerpt}</p>
                  </CardContent>
                   <div className="p-6 pt-0">
                     <Button variant="link" className="p-0 h-auto text-primary font-bold">
                       Read More <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                     </Button>
                   </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">No articles found. Check back soon!</p>
        </div>
      )}
    </main>
  );
}
