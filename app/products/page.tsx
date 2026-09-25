'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { PageHero } from '@/components/page-hero';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  availability: string;
  logo_url: string;
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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('products')
      .select('id, name, slug, description, category, availability, logo_url')
      .eq('is_published', true)
      .order('sort_order')
      .then(({ data }) => {
        setProducts((data ?? []) as Product[]);
        setLoading(false);
      });
  }, []);

  return (
    <main>
      <Navbar />
      <PageHero
        eyebrow="Products"
        title="Tools designed to make progress easier."
        description="Kezera Tech products — each with a clear status, purpose, and path forward."
      />
      <section className="section-padding">
        <div className="container-kezera-wide">
          {loading ? (
            <div className="grid gap-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl border border-border bg-card p-8 min-h-[200px]">
                  <div className="h-7 w-7 rounded bg-muted" />
                  <div className="mt-8 h-6 w-48 rounded bg-muted" />
                  <div className="mt-4 space-y-2">
                    <div className="h-3 w-full rounded bg-muted" />
                    <div className="h-3 w-3/4 rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <article className="rounded-xl border border-border bg-card p-8 md:p-12">
              <Sparkles className="h-7 w-7 text-accent" />
              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-accent">Coming soon</p>
              <h2 className="mt-4 text-3xl font-bold">Products are on the way.</h2>
              <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
                Product details, availability, features, and documentation will appear here once
                they are ready to be shared.
              </p>
              <Button asChild className="mt-8">
                <Link href="/contact">
                  Stay connected <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </article>
          ) : (
            <div className="grid gap-6">
              {products.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`}>
                  <article className="group flex flex-col justify-between gap-6 rounded-xl border border-border bg-card p-8 transition-colors hover:border-accent/50 md:flex-row md:items-center md:p-10">
                    <div className="flex items-start gap-5">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                        {product.logo_url ? (
                          <img src={product.logo_url} alt={product.name} className="h-8 w-8 object-contain" />
                        ) : (
                          <Sparkles className="h-6 w-6" />
                        )}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-xl font-bold">{product.name}</h2>
                          {product.availability && (
                            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${availabilityColor[product.availability] ?? availabilityColor.coming_soon}`}>
                              {availabilityLabel[product.availability] ?? product.availability}
                            </span>
                          )}
                        </div>
                        {product.category && (
                          <p className="mt-1 text-xs text-muted-foreground uppercase tracking-wider">{product.category}</p>
                        )}
                        {product.description && (
                          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">{product.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0">
                      <span className="inline-flex items-center text-sm font-medium text-accent">
                        Learn more <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
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
