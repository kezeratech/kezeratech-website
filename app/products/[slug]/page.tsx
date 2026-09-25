'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ExternalLink, Download, BookOpen, Sparkles, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  long_description: string;
  logo_url: string;
  category: string;
  availability: string;
  pricing_info: string;
  website_url: string;
  download_url: string;
  documentation_url: string;
  features: string[];
  technologies: string[];
  screenshots: string[];
}

const availabilityLabel: Record<string, string> = {
  available: 'Available',
  coming_soon: 'Coming Soon',
  'in-development': 'In Development',
};

const availabilityColor: Record<string, string> = {
  available: 'text-green-500 bg-green-500/10 border-green-500/20',
  coming_soon: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
  'in-development': 'text-orange-500 bg-orange-500/10 border-orange-500/20',
};

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound404, setNotFound404] = useState(false);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotFound404(true);
        } else {
          setProduct(data as Product);
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

  if (notFound404 || !product) {
    return (
      <main>
        <Navbar />
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
          <p className="text-sm text-muted-foreground">This product is not available.</p>
          <Button asChild variant="outline">
            <Link href="/products"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Products</Link>
          </Button>
        </div>
        <Footer />
      </main>
    );
  }

  const features = Array.isArray(product.features) ? product.features : [];
  const technologies = Array.isArray(product.technologies) ? product.technologies : [];
  const screenshots = Array.isArray(product.screenshots) ? product.screenshots : [];

  return (
    <main>
      <Navbar />
      <article className="pt-32 pb-20">
        <div className="container-kezera max-w-4xl">
          <Link href="/products" className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to products
          </Link>

          {/* Header */}
          <div className="mt-8 flex items-start gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
              {product.logo_url ? (
                <img src={product.logo_url} alt={product.name} className="h-10 w-10 object-contain" />
              ) : (
                <Sparkles className="h-7 w-7" />
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-4xl font-bold tracking-tight">{product.name}</h1>
                {product.availability && (
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${availabilityColor[product.availability] ?? availabilityColor.coming_soon}`}>
                    {availabilityLabel[product.availability] ?? product.availability}
                  </span>
                )}
              </div>
              {product.category && (
                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{product.category}</p>
              )}
              {product.pricing_info && (
                <p className="mt-2 text-sm font-medium text-foreground">{product.pricing_info}</p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            {product.website_url && (
              <a href={product.website_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">
                <ExternalLink className="h-4 w-4" /> Visit Website
              </a>
            )}
            {product.download_url && (
              <a href={product.download_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">
                <Download className="h-4 w-4" /> Download
              </a>
            )}
            {product.documentation_url && (
              <a href={product.documentation_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">
                <BookOpen className="h-4 w-4" /> Documentation
              </a>
            )}
          </div>

          {/* Description */}
          {(product.long_description || product.description) && (
            <p className="mt-8 text-lg leading-8 text-muted-foreground">
              {product.long_description || product.description}
            </p>
          )}

          {/* Screenshots */}
          {screenshots.length > 0 && (
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {screenshots.map((img, i) => (
                <div key={i} className="overflow-hidden rounded-xl border border-border">
                  <img src={img} alt={`${product.name} screenshot ${i + 1}`} className="w-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Features */}
          {features.length > 0 && (
            <div className="mt-12">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">Features</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                    <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technologies */}
          {technologies.length > 0 && (
            <div className="mt-10 border-t border-border pt-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">Built With</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {technologies.map((tech, i) => (
                  <span key={i} className="rounded border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">{tech}</span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 flex items-center justify-between border-t border-border pt-8">
            <Link href="/products" className="inline-flex items-center text-sm font-medium text-accent hover:underline">
              <ArrowLeft className="mr-2 h-4 w-4" /> All products
            </Link>
            <Button asChild>
              <Link href="/contact">Get in touch <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  );
}
