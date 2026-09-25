'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { notFound, useParams } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

interface Service {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  benefits: string[];
  technologies: string[];
  process: { step: string; description: string }[];
  cta_label: string;
  cta_href: string;
  seo_title: string;
  seo_description: string;
}

export default function ServicePage() {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound404, setNotFound404] = useState(false);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from('services')
      .select('*')
      .eq('slug', slug)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotFound404(true);
        } else {
          setService(data as Service);
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

  if (notFound404 || !service) {
    return (
      <main>
        <Navbar />
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
          <p className="text-sm text-muted-foreground">This service page is not available.</p>
          <Button asChild variant="outline">
            <Link href="/services"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Services</Link>
          </Button>
        </div>
        <Footer />
      </main>
    );
  }

  const benefits = Array.isArray(service.benefits) ? service.benefits : [];
  const technologies = Array.isArray(service.technologies) ? service.technologies : [];
  const process = Array.isArray(service.process) ? service.process : [];

  return (
    <main>
      <Navbar />
      <section className="relative overflow-hidden border-b border-border pt-36 pb-20 md:pt-44 md:pb-28">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute -right-32 top-16 h-72 w-72 rounded-full bg-accent/10 blur-[100px]" />
        <div className="container-kezera relative z-10">
          <Link href="/services" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Services
          </Link>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent">Service</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight tracking-[-0.035em] md:text-6xl">
            {service.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            {service.full_description || service.short_description}
          </p>
          <Button asChild className="mt-8">
            {service.cta_href && service.cta_href.includes('@') ? (
              <a href={`mailto:${service.cta_href}`}>
                {service.cta_label || 'Discuss your project'} <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            ) : (
              <Link href={service.cta_href || '/request-a-quote'}>
                {service.cta_label || 'Discuss your project'} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            )}
          </Button>
        </div>
      </section>

      {benefits.length > 0 && (
        <section className="section-padding">
          <div className="container-kezera-wide grid gap-14 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">What you get</p>
              <h2 className="mt-4 text-3xl font-bold">A considered foundation for the work ahead.</h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    <span className="text-sm font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {technologies.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Technology considerations</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {technologies.map((tech, i) => (
                    <span key={i} className="rounded border border-border px-3 py-2 text-sm text-muted-foreground">{tech}</span>
                  ))}
                </div>
                <p className="mt-8 text-sm leading-6 text-muted-foreground">
                  The final stack is selected around the product, team, budget, and long-term operating needs.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {process.length > 0 && (
        <section className="section-padding border-t border-border bg-card/20">
          <div className="container-kezera-wide">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">How we work</p>
            <h2 className="mt-4 text-3xl font-bold">Our process</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {process.map((step, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-6">
                  <span className="font-heading text-sm font-bold text-accent">0{i + 1}</span>
                  <h3 className="mt-4 font-semibold">{step.step}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-border py-20 text-center">
        <h2 className="text-3xl font-bold">Have a challenge in mind?</h2>
        <Button asChild className="mt-7">
          <Link href="/request-a-quote">Start a project <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </section>
      <Footer />
    </main>
  );
}
