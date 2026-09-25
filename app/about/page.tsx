'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Compass, Eye, Heart, Shield, Users, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { PageHero } from '@/components/page-hero';
import { SectionHeading } from '@/components/section-heading';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

interface SiteInfo {
  company_name: string;
  description: string;
  mission: string;
  vision: string;
}

const values = [
  { icon: Compass, title: 'Clarity over noise',     text: 'We make complex technology easier to understand, use, and improve.' },
  { icon: Users,   title: 'People at the center',   text: 'The best products respect the people who depend on them.' },
  { icon: Shield,  title: 'Engineering with care',  text: 'Reliable foundations matter as much as polished interfaces.' },
  { icon: Heart,   title: 'Useful by default',      text: 'We focus on outcomes that create meaningful value in the real world.' },
];

export default function AboutPage() {
  const [info, setInfo] = useState<SiteInfo | null>(null);

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('company_name, description, mission, vision')
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) setInfo(data as SiteInfo);
      });
  }, []);

  const companyName = info?.company_name || 'Kezera Tech';
  const description = info?.description || 'Kezera Tech exists to help businesses and organizations turn real challenges into innovative digital products and scalable software solutions.';
  const mission = info?.mission || 'Our mission is to design and build practical, innovative technology solutions that solve real-world problems, empower businesses, and create lasting value through technology.';
  const vision = info?.vision || 'To become a trusted technology company that transforms ideas into impactful digital products and solutions, starting from Ethiopia and reaching a global audience.';

  return (
    <main>
      <Navbar />
      <PageHero
        eyebrow={`About ${companyName}`}
        title="A technology partner for ideas that deserve to move forward."
        description={description}
        cta={{ label: 'Work with us', href: '/request-a-quote' }}
      />

      {/* What we believe */}
      <section className="section-padding">
        <div className="container-kezera-wide grid gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">What we believe</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              Technology is a tool for making progress visible.
            </h2>
          </div>
          <div className="space-y-5 text-base leading-8 text-muted-foreground">
            <p>
              We approach technology with equal respect for the big picture and the small details.
              That means listening carefully, choosing deliberately, and building with a clear
              understanding of the people and processes involved.
            </p>
            <p>
              Founded in 2026 and based in Addis Ababa, Ethiopia, {companyName} is building its
              story one useful product, thoughtful interaction, and reliable system at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding border-y border-border bg-card/20">
        <div className="container-kezera-wide">
          <SectionHeading
            eyebrow="Our values"
            title="The standards behind the work."
            description="These principles guide how we think, collaborate, and build."
          />
          <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, text }) => (
              <div key={title} className="bg-card p-7">
                <Icon className="h-6 w-6 text-accent" />
                <h3 className="mt-6 font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding">
        <div className="container-kezera-wide grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Mission</p>
            <h2 className="mt-4 text-3xl font-bold">Design and build practical, innovative technology solutions.</h2>
            <p className="mt-5 max-w-2xl leading-7 text-muted-foreground">{mission}</p>
          </div>
          <div className="rounded-xl border border-border p-8">
            <Eye className="h-6 w-6 text-accent" />
            <p className="mt-5 font-semibold">Our Vision</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{vision}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border py-20 text-center">
        <h2 className="text-3xl font-bold">Let&apos;s shape what comes next.</h2>
        <Button asChild className="mt-7">
          <Link href="/contact">Start a conversation <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </section>

      <Footer />
    </main>
  );
}
