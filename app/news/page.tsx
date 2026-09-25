'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Newspaper, Star } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { PageHero } from '@/components/page-hero';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  category: string;
  featured_image_url: string;
  publish_date: string;
  is_featured: boolean;
  tags: string[];
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filtered, setFiltered] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    supabase
      .from('news')
      .select('id, title, slug, excerpt, author, category, featured_image_url, publish_date, is_featured, tags')
      .eq('is_published', true)
      .order('publish_date', { ascending: false })
      .then(({ data }) => {
        const list = (data ?? []) as NewsItem[];
        setNews(list);
        setFiltered(list);
        setLoading(false);
      });
  }, []);

  const categories = ['All', ...Array.from(new Set(news.map((n) => n.category).filter(Boolean)))];

  function filterByCategory(cat: string) {
    setActiveCategory(cat);
    setFiltered(cat === 'All' ? news : news.filter((n) => n.category === cat));
  }

  const featured = news.find((n) => n.is_featured);
  const rest = filtered.filter((n) => !n.is_featured || activeCategory !== 'All');

  return (
    <main>
      <Navbar />
      <PageHero
        eyebrow="News"
        title="Latest from Kezera Tech."
        description="Company announcements, updates, events, and everything happening at Kezera Tech."
      />

      <section className="section-padding">
        <div className="container-kezera-wide">

          {/* Featured article */}
          {!loading && featured && activeCategory === 'All' && (
            <Link href={`/news/${featured.slug}`}>
              <article className="group mb-12 overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-accent/50">
                <div className="grid lg:grid-cols-2">
                  {featured.featured_image_url ? (
                    <div className="aspect-video overflow-hidden lg:aspect-auto">
                      <img
                        src={featured.featured_image_url}
                        alt={featured.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center bg-gradient-to-br from-accent/10 to-primary/10 lg:min-h-64">
                      <Newspaper className="h-16 w-16 text-accent/30" />
                    </div>
                  )}
                  <div className="flex flex-col justify-center p-8 md:p-10">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                        <Star className="h-3 w-3 fill-accent" /> Featured
                      </span>
                      {featured.category && (
                        <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                          {featured.category}
                        </span>
                      )}
                    </div>
                    <h2 className="mt-4 text-2xl font-bold leading-tight tracking-tight md:text-3xl">
                      {featured.title}
                    </h2>
                    {featured.excerpt && (
                      <p className="mt-3 text-sm leading-7 text-muted-foreground line-clamp-3">
                        {featured.excerpt}
                      </p>
                    )}
                    <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      {featured.publish_date && (
                        <span>{format(new Date(featured.publish_date), 'MMMM d, yyyy')}</span>
                      )}
                      {featured.author && <span>· {featured.author}</span>}
                    </div>
                    <span className="mt-6 inline-flex items-center text-sm font-medium text-accent">
                      Read article <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          )}

          {/* Category filter */}
          {categories.length > 1 && (
            <div className="mb-8 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => filterByCategory(cat)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                    activeCategory === cat
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border text-muted-foreground hover:border-accent/50 hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Articles grid */}
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl border border-border bg-card p-7">
                  <div className="h-3 w-24 rounded bg-muted" />
                  <div className="mt-6 h-5 w-full rounded bg-muted" />
                  <div className="mt-3 space-y-2">
                    <div className="h-3 w-full rounded bg-muted" />
                    <div className="h-3 w-3/4 rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-10 text-center md:p-16">
              <Newspaper className="mx-auto h-10 w-10 text-accent" />
              <h2 className="mt-6 text-2xl font-bold">No news yet.</h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
                Company announcements and updates will appear here.
              </p>
              <Button asChild variant="outline" className="mt-7">
                <Link href="/contact">Get in touch <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(activeCategory === 'All' ? rest : filtered).map((item) => (
                <Link key={item.id} href={`/news/${item.slug}`}>
                  <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-accent/50">
                    {item.featured_image_url ? (
                      <div className="aspect-video w-full overflow-hidden">
                        <img
                          src={item.featured_image_url}
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-accent/5 to-primary/5">
                        <Newspaper className="h-8 w-8 text-accent/30" />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex flex-wrap items-center gap-2">
                        {item.category && (
                          <span className="rounded-full border border-border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                            {item.category}
                          </span>
                        )}
                        {item.publish_date && (
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(item.publish_date), 'MMM d, yyyy')}
                          </span>
                        )}
                      </div>
                      <h2 className="mt-3 text-lg font-bold leading-snug tracking-tight">
                        {item.title}
                      </h2>
                      {item.excerpt && (
                        <p className="mt-2 text-sm leading-6 text-muted-foreground line-clamp-3">
                          {item.excerpt}
                        </p>
                      )}
                      <span className="mt-auto pt-5 inline-flex items-center text-sm font-medium text-accent">
                        Read more <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
