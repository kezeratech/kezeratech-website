'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Tag, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string;
  author: string;
  tags: string[];
  publish_date: string;
  is_published: boolean;
}

export default function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound404, setNotFound404] = useState(false);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotFound404(true);
        } else {
          setPost(data as BlogPost);
        }
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <main>
        <Navbar />
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
        <Footer />
      </main>
    );
  }

  if (notFound404 || !post) {
    return (
      <main>
        <Navbar />
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
          <p className="text-sm text-muted-foreground">This article is not available.</p>
          <Button asChild variant="outline">
            <Link href="/blog"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Insights</Link>
          </Button>
        </div>
        <Footer />
      </main>
    );
  }

  const tags = Array.isArray(post.tags) ? post.tags : [];

  return (
    <main>
      <Navbar />
      <article className="pt-32 pb-20">
        <div className="container-kezera max-w-3xl">
          <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to insights
          </Link>

          {/* Meta */}
          <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {post.publish_date && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {format(new Date(post.publish_date), 'MMMM d, yyyy')}
              </span>
            )}
            {post.author && (
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" /> {post.author}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">{post.title}</h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="mt-6 text-lg leading-8 text-muted-foreground">{post.excerpt}</p>
          )}

          {/* Featured image */}
          {post.featured_image_url && (
            <div className="mt-10 overflow-hidden rounded-xl border border-border">
              <img
                src={post.featured_image_url}
                alt={post.title}
                className="w-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          {post.content ? (
            <div className="prose prose-neutral dark:prose-invert mt-10 max-w-none text-sm leading-8">
              {post.content.split('\n').map((paragraph, i) =>
                paragraph.trim() ? <p key={i}>{paragraph}</p> : <br key={i} />
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

          {/* Back link */}
          <div className="mt-12 border-t border-border pt-8">
            <Link href="/blog" className="inline-flex items-center text-sm font-medium text-accent hover:underline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to all insights
            </Link>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  );
}
