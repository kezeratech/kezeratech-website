'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { PageHero } from '@/components/page-hero';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  featured_image_url: string;
  publish_date: string;
  tags: string[];
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, author, featured_image_url, publish_date, tags')
      .eq('is_published', true)
      .order('publish_date', { ascending: false })
      .then(({ data }) => {
        setPosts((data ?? []) as BlogPost[]);
        setLoading(false);
      });
  }, []);

  return (
    <main>
      <Navbar />
      <PageHero
        eyebrow="Insights"
        title="Practical thinking for a digital world."
        description="Notes, perspectives, and lessons from the work of building useful products and dependable technology."
      />
      <section className="section-padding">
        <div className="container-kezera-wide">
          {loading ? (
            <div className="grid gap-6 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl border border-border bg-card p-7">
                  <div className="h-3 w-24 rounded bg-muted" />
                  <div className="mt-8 h-6 w-full rounded bg-muted" />
                  <div className="mt-3 space-y-2">
                    <div className="h-3 w-full rounded bg-muted" />
                    <div className="h-3 w-3/4 rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-10 text-center md:p-16">
              <BookOpen className="mx-auto h-10 w-10 text-accent" />
              <h2 className="mt-6 text-2xl font-bold">Insights are coming soon.</h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
                The journal will share practical ideas about product thinking, engineering,
                design, and digital transformation.
              </p>
              <Button asChild variant="outline" className="mt-7">
                <Link href="/contact">
                  Talk to our team <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <article className="group flex h-full flex-col rounded-xl border border-border bg-card transition-colors hover:border-accent/50">
                    {post.featured_image_url && (
                      <div className="aspect-video w-full overflow-hidden rounded-t-xl">
                        <img
                          src={post.featured_image_url}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-7">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        {post.publish_date && (
                          <span>{format(new Date(post.publish_date), 'MMM d, yyyy')}</span>
                        )}
                        {post.author && (
                          <>
                            <span>·</span>
                            <span>{post.author}</span>
                          </>
                        )}
                      </div>
                      <h2 className="mt-4 text-xl font-bold tracking-tight leading-snug">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="mt-3 text-sm leading-6 text-muted-foreground line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}
                      {Array.isArray(post.tags) && post.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="mt-auto pt-6 inline-flex items-center text-sm font-medium text-accent">
                        Read article <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
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
