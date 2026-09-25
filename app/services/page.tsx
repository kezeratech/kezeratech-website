'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { PageHero } from '@/components/page-hero';
import { DynamicIcon } from '@/components/dynamic-icon';
import { supabase } from '@/lib/supabase';

interface Service {
  id: string;
  title: string;
  slug: string;
  icon: string;
  short_description: string;
  sort_order: number;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('services')
      .select('id, title, slug, icon, short_description, sort_order')
      .eq('is_published', true)
      .order('sort_order')
      .then(({ data }) => {
        setServices((data ?? []) as Service[]);
        setLoading(false);
      });
  }, []);

  return (
    <main>
      <Navbar />
      <PageHero
        eyebrow="Capabilities"
        title="Technology services with a point of view."
        description="From product design to production software, we bring the strategy, craft, and engineering needed to make digital work useful."
      />
      <section className="section-padding">
        <div className="container-kezera-wide">
          {loading ? (
            <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-card p-8 animate-pulse">
                  <div className="h-6 w-6 rounded bg-muted" />
                  <div className="mt-8 h-5 w-2/3 rounded bg-muted" />
                  <div className="mt-3 space-y-2">
                    <div className="h-3 w-full rounded bg-muted" />
                    <div className="h-3 w-4/5 rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-10 text-center md:p-16">
              <p className="text-sm font-medium">No services published yet.</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Add and publish services from the admin dashboard.
              </p>
            </div>
          ) : (
            <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className="group bg-card p-8 transition-colors hover:bg-muted"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-accent/20 bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                      <DynamicIcon name={service.icon} className="h-5 w-5" />
                    </div>
                    <span className="font-heading text-xs text-muted-foreground">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h2 className="mt-8 text-xl font-semibold">{service.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {service.short_description}
                  </p>
                  <div className="mt-6 flex items-center text-sm font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                    Explore service <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
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
