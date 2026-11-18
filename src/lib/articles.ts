import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

/**
 * Articles are markdown files in content/articles.
 *
 * A file's URL slug is its frontmatter `slug` when the CMS sets one, otherwise
 * the filename. Both the listing and the detail route must agree on that, or
 * edited-in-CMS posts link to a slug that was never generated (404).
 */
export interface Article {
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

function fileSlug(file: string): string {
  return file.replace(/\.md$/, '');
}

function effectiveSlug(data: Record<string, unknown>, file: string): string {
  const raw = typeof data.slug === 'string' ? data.slug.trim() : '';
  return raw || fileSlug(file);
}

async function articleFiles(): Promise<string[]> {
  try {
    return (await fs.readdir(articlesDir)).filter((f) => f.endsWith('.md'));
  } catch (error) {
    console.error('Could not read articles directory:', error);
    return [];
  }
}

function toArticle(data: Record<string, unknown>, content: string, file: string): Article {
  return {
    slug: effectiveSlug(data, file),
    title: (data.title as string) || '',
    author: (data.author as string) || '',
    date: (data.date as string) || '',
    excerpt: (data.excerpt as string) || '',
    imageUrl: (data.imageUrl as string) || '',
    imageAlt: (data.imageAlt as string) || '',
    imageHint: (data.imageHint as string) || '',
    content,
  };
}

export async function getArticles(): Promise<Article[]> {
  const files = await articleFiles();
  const articles = await Promise.all(
    files.map(async (file) => {
      try {
        const raw = await fs.readFile(path.join(articlesDir, file), 'utf-8');
        const { data, content } = matter(raw);
        return toArticle(data as Record<string, unknown>, content, file);
      } catch (error) {
        console.error(`Failed to read article ${file}:`, error);
        return null;
      }
    })
  );

  return articles
    .filter((a): a is Article => a !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** Slugs to pre-render. Uses the same rule as the listing so links always resolve. */
export async function getArticleSlugs(): Promise<string[]> {
  const articles = await getArticles();
  return articles.map((a) => a.slug);
}

/**
 * Look up by URL slug. Matches the frontmatter slug first, but also accepts the
 * filename, so links made before a slug was added (or old bookmarks) still work.
 */
export async function getArticle(slug: string): Promise<Article | undefined> {
  const wanted = slug.replace(/^\/+|\/+$/g, '');
  const files = await articleFiles();

  for (const file of files) {
    try {
      const raw = await fs.readFile(path.join(articlesDir, file), 'utf-8');
      const { data, content } = matter(raw);
      if (effectiveSlug(data as Record<string, unknown>, file) === wanted || fileSlug(file) === wanted) {
        return toArticle(data as Record<string, unknown>, content, file);
      }
    } catch (error) {
      console.error(`Failed to read article ${file}:`, error);
    }
  }

  return undefined;
}
