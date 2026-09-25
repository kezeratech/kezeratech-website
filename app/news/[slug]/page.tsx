'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Tag, Newspaper, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string;
  author: string;
  category: string;
  tags: string[];
  publish_date: string;
  is_published: boolean;
}

export default function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [item, setItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [related, setRelated] = useState<NewsItem[]>([]);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from('news')
      .select('*')
      .eq('slug', slug)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotFound(true);
        } else {
          setItem(data as NewsItem);
          // Fetch related articles from same category
          if (data.category) {
            supabase
              .from('news')
              .select('id, title, slug, excerpt, category, publish_date, featured_image_url')
              .eq('is_published', true)
              .eq('category', data.category)
              .neq('slug', slug)
              .limit(3)
              .then(({ data: rel }) => setRelated((rel ?? []) as NewsItem[]));
          }
        }
        setLoading(false);
      });
  }, [slug]);

  if (loading) return (
    <main><Navbar />
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
      <Footer />
    </main>
  );

  if (notFound || !item) return (
    <main><Navbar />
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <Newspaper className="h-10 w-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">This news article is not available.</p>
        <Button asChild variant="outline">
          <Link href="/news"><ArrowLeft className="mr-2 h-4 w-4" /> Back to News</Link>
        </Button>
      </div>
      <Footer />
    </main>
  );

  const tags = Array.isArray(item.tags) ? item.tags : [];

  return (
    <main>
      <Navbar />
      <article className="pt-32 pb-20">
        <div className="container-kezera max-w-3xl">

          {/* Back */}
          <Link href="/news" className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to news
          </Link>

          {/* Meta */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {item.category && (
              <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {item.category}
              </span>
            )}
            {item.publish_date && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                {format(new Date(item.publish_date), 'MMMM d, yyyy')}
              </span>
            )}
            {item.author && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <User className="h-3.5 w-3.5" /> {item.author}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl leading-tight">
            {item.title}
          </h1>

          {/* Excerpt */}
          {item.excerpt && (
            <p className="mt-5 text-lg leading-8 text-muted-foreground">{item.excerpt}</p>
          )}

          {/* Featured image */}
          {item.featured_image_url && (
            <div className="mt-10 overflow-hidden rounded-2xl border border-border">
              <img src={item.featured_image_url} alt={item.title} className="w-full object-cover" />
            </div>
          )}

          {/* Content */}
          {item.content ? (
            <div className="mt-10 space-y-4 text-sm leading-8 text-muted-foreground">
              {item.content.split('\n').map((paragraph, i) =>
                paragraph.trim()
                  ? <p key={i} className="text-foreground/80">{paragraph}</p>
                  : <br key={i} />
              )}
            </div>
          ) : (
            <div className="mt-10 rounded-xl border border-dashed border-border p-8 text-center">
              <p className="text-sm text-muted-foreground">No content has been added to this article yet.</p>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-border pt-8">
              <Tag className="h-4 w-4 text-muted-foreground" />
              {tags.map((tag) => (
                <span key={tag} className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Back */}
          <div className="mt-12 border-t border-border pt-8">
            <Link href="/news" className="inline-flex items-center text-sm font-medium text-accent hover:underline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to all news
            </Link>
          </div>
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <div className="container-kezera-wide mt-20 border-t border-border pt-16">
            <h2 className="font-heading text-xl font-bold">More from {item.category}</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link key={r.id} href={`/news/${r.slug}`}>
                  <article className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-accent/50">
                    {r.featured_image_url && (
                      <div className="mb-4 aspect-video overflow-hidden rounded-lg">
                        <img src={r.featured_image_url} alt={r.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                    )}
                    {r.publish_date && (
                      <p className="text-xs text-muted-foreground">{format(new Date(r.publish_date), 'MMM d, yyyy')}</p>
                    )}
                    <h3 className="mt-2 font-semibold leading-snug">{r.title}</h3>
                    <span className="mt-4 inline-flex items-center text-xs font-medium text-accent">
                      Read more <ArrowLeft className="ml-1.5 h-3 w-3 rotate-180 transition-transform group-hover:translate-x-1" />
                    </span>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
      <Footer />
    </main>
  );
}
