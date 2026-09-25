'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { PageHero } from '@/components/page-hero';
import { Button } from '@/components/ui/button';
import { DynamicIcon } from '@/components/dynamic-icon';
import { supabase } from '@/lib/supabase';

interface Industry {
  id: string;
  name: string;
  icon: string;
  description: string;
  sort_order: number;
}

export default function IndustriesPage() {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('industries')
      .select('id, name, icon, description, sort_order')
      .eq('is_published', true)
      .order('sort_order')
      .then(({ data }) => {
        setIndustries((data ?? []) as Industry[]);
        setLoading(false);
      });
  }, []);

  return (
    <main>
      <Navbar />
      <PageHero
        eyebrow="Industries"
        title="Context makes technology useful."
        description="The right solution respects the industry, people, and operating reality around the problem."
      />
      <section className="section-padding">
        <div className="container-kezera-wide">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl border border-border bg-card p-8">
                  <div className="h-6 w-6 rounded bg-muted" />
                  <div className="mt-7 h-5 w-2/3 rounded bg-muted" />
                  <div className="mt-3 space-y-2">
                    <div className="h-3 w-full rounded bg-muted" />
                    <div className="h-3 w-4/5 rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : industries.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-10 text-center md:p-16">
              <p className="text-sm font-medium">No industries published yet.</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Add and publish industries from the admin dashboard.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {industries.map((industry) => (
                <div key={industry.id} className="rounded-xl border border-border bg-card p-8">
                  {industry.icon && (
                    <DynamicIcon name={industry.icon} className="h-6 w-6 text-accent" />
                  )}
                  <h2 className="mt-7 text-xl font-bold">{industry.name}</h2>
                  {industry.description && (
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {industry.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-14 text-center">
            <Button asChild>
              <Link href="/contact">
                Talk about your industry <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
