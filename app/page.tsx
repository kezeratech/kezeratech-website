'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowDownRight,
  ArrowRight,
  ChevronRight,
  Handshake,
  Sparkles,
  Zap,
  Star,
  Newspaper,
  type LucideIcon,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { HeroAnimation } from '@/components/hero-animation';
import { SectionHeading } from '@/components/section-heading';
import { KezeraMark } from '@/components/kezera-logo';
import { Button } from '@/components/ui/button';
import { APPROACH_STEPS, TECH_CATEGORIES, WHY_KEZERA } from '@/lib/site-data';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

// WHY_KEZERA and APPROACH_STEPS are company philosophy — kept static (not CMS-managed)
// TECH_CATEGORIES kept static — curated tech stack display

interface Service  { id: string; title: string; slug: string; icon: string; short_description: string; sort_order: number }
interface Project  { id: string; title: string; slug: string; client: string; industry: string; project_type: string; description: string; is_featured: boolean }
interface Product  { id: string; name: string; slug: string; description: string; availability: string; logo_url: string }
interface BlogPost { id: string; title: string; slug: string; excerpt: string; publish_date: string; author: string; tags: string[] }
interface Industry { id: string; name: string; icon: string }
interface Testimonial { id: string; client_name: string; position: string; company: string; profile_image_url: string; testimonial: string; rating: number }
interface Advertisement { id: string; title: string; subtitle: string; description: string; image_url: string; cta_label: string; cta_href: string; badge_text: string; bg_color: string; sort_order: number }

import { DynamicIcon } from '@/components/dynamic-icon';
// Fallback icon map for WHY_KEZERA which uses Lucide icon names
import { Brain, Boxes, Briefcase, Building2, Code2, Database, Factory, Globe, GraduationCap, HeartPulse, Landmark, Layers, Lightbulb, Palette, Rocket, ShieldCheck, ShoppingCart, Smartphone, Store, TrendingUp, Users, Workflow, Wrench, Dumbbell } from 'lucide-react';
const iconMap: Record<string, LucideIcon> = { Globe, Smartphone, Code2, Palette, Boxes, Workflow, Database, Dumbbell, Lightbulb, Rocket, Brain, Users, Wrench, Layers, ShieldCheck, Handshake, TrendingUp, Building2, GraduationCap, HeartPulse, ShoppingCart, Landmark, Factory, Briefcase, Store };

// ---------------------------------------------------------------------------
// News preview — separate component so it fetches independently
// ---------------------------------------------------------------------------
function NewsPreviewSection() {
  const [news, setNews] = useState<{ id: string; title: string; slug: string; excerpt: string; category: string; publish_date: string; featured_image_url: string }[]>([]);

  useEffect(() => {
    supabase
      .from('news')
      .select('id, title, slug, excerpt, category, publish_date, featured_image_url')
      .eq('is_published', true)
      .order('publish_date', { ascending: false })
      .limit(3)
      .then(({ data }) => setNews(data ?? []));
  }, []);

  if (news.length === 0) return null;

  return (
    <section className="section-padding border-y border-border bg-card/20">
      <div className="container-kezera-wide">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="News"
            title="What's happening at Kezera Tech."
            description="Latest announcements, updates, and company news."
            align="left"
          />
          <Button asChild variant="link" className="h-auto p-0 text-accent">
            <Link href="/news">All news <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {news.map((item) => (
            <Link key={item.id} href={`/news/${item.slug}`}>
              <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-accent/50">
                {item.featured_image_url ? (
                  <div className="aspect-video w-full overflow-hidden">
                    <img src={item.featured_image_url} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                ) : (
                  <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-accent/5 to-primary/5">
                    <Newspaper className="h-8 w-8 text-accent/20" />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {item.category && <span className="font-medium text-accent">{item.category}</span>}
                    {item.publish_date && <span>· {format(new Date(item.publish_date), 'MMM d, yyyy')}</span>}
                  </div>
                  <h3 className="mt-3 font-bold leading-snug tracking-tight">{item.title}</h3>
                  {item.excerpt && (
                    <p className="mt-2 text-sm leading-6 text-muted-foreground line-clamp-2">{item.excerpt}</p>
                  )}
                  <span className="mt-auto pt-5 inline-flex items-center text-xs font-medium text-accent">
                    Read more <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [services,      setServices]      = useState<Service[]>([]);
  const [projects,      setProjects]      = useState<Project[]>([]);
  const [products,      setProducts]      = useState<Product[]>([]);
  const [blogPosts,     setBlogPosts]     = useState<BlogPost[]>([]);
  const [industries,    setIndustries]    = useState<Industry[]>([]);
  const [testimonials,  setTestimonials]  = useState<Testimonial[]>([]);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [siteInfo,      setSiteInfo]      = useState({ company_name: 'Kezera Tech', tagline: '', description: '' });

  useEffect(() => {
    Promise.all([
      supabase.from('services').select('id,title,slug,icon,short_description,sort_order').eq('is_published', true).order('sort_order').limit(6),
      supabase.from('projects').select('id,title,slug,client,industry,project_type,description,is_featured').eq('is_published', true).order('sort_order').limit(4),
      supabase.from('products').select('id,name,slug,description,availability,logo_url').eq('is_published', true).order('sort_order').limit(3),
      supabase.from('blog_posts').select('id,title,slug,excerpt,publish_date,author,tags').eq('is_published', true).order('publish_date', { ascending: false }).limit(3),
      supabase.from('industries').select('id,name,icon').eq('is_published', true).order('sort_order').limit(10),
      supabase.from('site_settings').select('company_name,tagline,description').limit(1).single(),
      supabase.from('testimonials').select('id,client_name,position,company,profile_image_url,testimonial,rating').eq('is_visible', true).order('sort_order').limit(6),
      supabase.from('advertisements').select('id,title,subtitle,description,image_url,cta_label,cta_href,badge_text,bg_color,sort_order').eq('is_active', true).order('sort_order').limit(5),
    ]).then(([s, p, pr, b, i, si, t, ads]) => {
      setServices((s.data ?? []) as Service[]);
      setProjects((p.data ?? []) as Project[]);
      setProducts((pr.data ?? []) as Product[]);
      setBlogPosts((b.data ?? []) as BlogPost[]);
      setIndustries((i.data ?? []) as Industry[]);
      if (si.data) setSiteInfo(si.data as typeof siteInfo);
      setTestimonials((t.data ?? []) as Testimonial[]);
      setAdvertisements((ads.data ?? []) as Advertisement[]);
    });
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative flex min-h-[720px] items-center overflow-hidden border-b border-border pt-24 md:min-h-[820px] md:pt-20">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-accent/5 to-transparent" />
        <HeroAnimation />
        <div className="container-kezera-wide relative z-10">
          <div className="max-w-3xl animate-fade-in-up">
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-accent/25 bg-accent/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-accent">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Technology that moves ideas forward
            </div>
            <h1 className="max-w-4xl text-5xl font-bold leading-[1.04] tracking-[-0.045em] text-balance sm:text-6xl md:text-7xl lg:text-[5.25rem]">
              Designing the{' '}
              <span className="text-gradient-brand">future</span>{' '}
              through technology.
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
              From ideas to digital products, Kezera Tech combines engineering, design,
              and technology to create solutions built for real-world impact and long-term growth.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="group h-12 px-6">
                <Link href="/request-a-quote">
                  Start a Project <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-6">
                <Link href="/projects">Explore Our Work <ArrowDownRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
          <div className="mt-16 grid max-w-2xl grid-cols-3 gap-6 border-t border-border/60 pt-6 animate-fade-in-up [animation-delay:200ms] md:mt-20">
            {[['01','Ideas'],['02','Technology'],['03','Impact']].map(([num, label]) => (
              <div key={num}>
                <p className="font-heading text-2xl font-bold text-foreground">{num}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-7 right-8 hidden items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground lg:flex">
          <span>Scroll to explore</span>
          <ChevronRight className="h-3 w-3 rotate-90" />
        </div>
      </section>

      {/* Advertisements */}
      {advertisements.length > 0 && (
        <section className="border-b border-border bg-background py-8 md:py-10">
          <div className="container-kezera-wide space-y-4">
            {advertisements.map((ad) => (
              <div
                key={ad.id}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${ad.bg_color} border border-border`}
              >
                <div className="flex flex-col items-start justify-between gap-6 p-6 md:flex-row md:items-center md:p-8">
                  {/* Left — text */}
                  <div className="flex flex-1 items-start gap-5">
                    {ad.image_url && (
                      <img
                        src={ad.image_url}
                        alt={ad.title}
                        className="h-14 w-14 shrink-0 rounded-xl object-cover shadow-md"
                      />
                    )}
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        {ad.badge_text && (
                          <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-accent">
                            {ad.badge_text}
                          </span>
                        )}
                        <h3 className="text-lg font-bold tracking-tight">{ad.title}</h3>
                      </div>
                      {ad.subtitle && (
                        <p className="mt-0.5 text-sm font-medium text-muted-foreground">{ad.subtitle}</p>
                      )}
                      {ad.description && (
                        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{ad.description}</p>
                      )}
                    </div>
                  </div>
                  {/* Right — CTA */}
                  {ad.cta_label && ad.cta_href && (
                    <div className="shrink-0">
                      {ad.cta_href.startsWith('http') ? (
                        <a
                          href={ad.cta_href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
                        >
                          {ad.cta_label} <ArrowRight className="h-4 w-4" />
                        </a>
                      ) : (
                        <Link
                          href={ad.cta_href}
                          className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
                        >
                          {ad.cta_label} <ArrowRight className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* About snippet */}
      <section className="border-b border-border bg-card/20 py-20 md:py-28">
        <div className="container-kezera-wide grid items-center gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
          <div>
            <div className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              <KezeraMark size={24} /> Who we are
            </div>
            <h2 className="max-w-xl text-3xl font-bold leading-tight tracking-tight md:text-4xl">
              Technology should make difficult things feel possible.
            </h2>
          </div>
          <div>
            <p className="text-lg leading-8 text-muted-foreground">
              {siteInfo.description || 'Kezera Tech is a technology company focused on building innovative software, digital products, and technology solutions that solve real-world problems.'}
            </p>
            <Button asChild variant="link" className="mt-6 h-auto p-0 text-accent">
              <Link href="/about">Learn about {siteInfo.company_name || 'Kezera Tech'} <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding" id="services">
        <div className="container-kezera-wide">
          <SectionHeading eyebrow="What we do" title="From first sketch to lasting software." description="A focused set of capabilities for building digital products, modernizing operations, and creating experiences people want to use." />
          {services.length === 0 ? (
            <div className="mt-14 rounded-xl border border-dashed border-border p-10 text-center">
              <p className="text-sm text-muted-foreground">Services will appear here once published from the admin panel.</p>
            </div>
          ) : (
            <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <Link key={service.id} href={`/services/${service.slug}`} className="group relative bg-card p-7 transition-colors hover:bg-muted/70 md:p-8">
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-accent/20 bg-accent/10 text-accent text-lg transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                      <DynamicIcon name={service.icon} className="h-5 w-5" />
                    </div>
                    <span className="font-heading text-xs text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="mt-7 text-lg font-semibold">{service.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{service.short_description}</p>
                  <div className="mt-6 flex items-center text-sm font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                    Explore service <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link href="/services">View all services <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="section-padding border-y border-border bg-card/20">
        <div className="container-kezera-wide">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading eyebrow="Featured projects" title="Work worth building on." description="A growing portfolio of products and platforms shaped around real goals." align="left" />
            <Button asChild variant="link" className="h-auto p-0 text-accent">
              <Link href="/projects">View all projects <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {projects.length === 0 ? (
              <>
                {[{ title: 'Project showcase coming soon', category: 'Featured work', desc: 'Featured case studies will appear here as Kezera Tech projects are added through the content system.', tag: 'CMS controlled' },
                  { title: 'Build something worth sharing', category: 'Your next product', desc: "Have a product idea or a business process to improve? Let's turn it into a considered digital experience.", tag: 'Start a conversation' }
                ].map((p, i) => (
                  <article key={p.title} className={cn('group relative min-h-[320px] overflow-hidden rounded-xl border border-border bg-card p-8 md:p-10', i === 0 && 'lg:min-h-[420px]')}>
                    <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-accent/10 blur-3xl transition-transform duration-700 group-hover:scale-150" />
                    <div className="relative flex h-full flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold uppercase tracking-wider text-accent">{p.category}</span>
                          <span className="rounded-full border border-border px-3 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">{p.tag}</span>
                        </div>
                        <h3 className="mt-24 max-w-md text-2xl font-bold tracking-tight md:text-3xl">{p.title}</h3>
                        <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">{p.desc}</p>
                      </div>
                      <Link href="/projects" className="mt-8 inline-flex items-center text-sm font-medium text-accent">Explore the work <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
                    </div>
                  </article>
                ))}
              </>
            ) : (
              projects.slice(0, 4).map((project, i) => (
                <Link key={project.id} href={`/projects/${project.slug}`}>
                  <article className={cn('group relative min-h-[320px] overflow-hidden rounded-xl border border-border bg-card p-8 transition-colors hover:border-accent/50 md:p-10', i === 0 && 'lg:min-h-[420px]')}>
                    <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-accent/10 blur-3xl transition-transform duration-700 group-hover:scale-150" />
                    <div className="relative flex h-full flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          {project.industry && <span className="text-xs font-semibold uppercase tracking-wider text-accent">{project.industry}</span>}
                          {project.project_type && <span className="rounded-full border border-border px-3 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">{project.project_type}</span>}
                        </div>
                        <h3 className="mt-16 max-w-md text-2xl font-bold tracking-tight md:text-3xl">{project.title}</h3>
                        {project.client && <p className="mt-1 text-xs text-muted-foreground">Client: {project.client}</p>}
                        {project.description && <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground line-clamp-2">{project.description}</p>}
                      </div>
                      <span className="mt-8 inline-flex items-center text-sm font-medium text-accent">View case study <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                    </div>
                  </article>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Why Kezera Tech */}
      <section className="section-padding">
        <div className="container-kezera-wide">
          <SectionHeading eyebrow="Why Kezera Tech" title="Built for the long term." description="Good technology is not just about what ships today. It is about creating a foundation that keeps creating value tomorrow." />
          <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_KEZERA.map((item) => {
              const Icon = iconMap[item.icon];
              return (
                <div key={item.title} className="group">
                  {Icon && <Icon className="h-6 w-6 text-accent transition-transform group-hover:-translate-y-1" />}
                  <h3 className="mt-5 font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="section-padding border-y border-border bg-card/20">
        <div className="container-kezera-wide">
          <SectionHeading eyebrow="Our approach" title="A clear path from idea to impact." description="We keep the process collaborative, transparent, and focused on making meaningful progress at every step." />
          <div className="mt-16 grid gap-8 md:grid-cols-7">
            {APPROACH_STEPS.map((step, index) => (
              <div key={step.number} className="relative">
                <div className="flex items-center gap-3 md:block">
                  <span className="font-heading text-sm font-bold text-accent">{step.number}</span>
                  <h3 className="mt-0 text-lg font-semibold md:mt-4">{step.title}</h3>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</p>
                {index < APPROACH_STEPS.length - 1 && (
                  <div className="absolute -right-5 top-2 hidden text-border md:block">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="section-padding">
        <div className="container-kezera-wide grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <SectionHeading eyebrow="Technology" title="The right tools for the right problem." description="Our technology choices stay practical, modern, and aligned with the product we are building." align="left" />
          <div className="grid gap-8 sm:grid-cols-2">
            {TECH_CATEGORIES.map((group) => (
              <div key={group.category} className="border-l border-accent/40 pl-5">
                <h3 className="text-sm font-semibold">{group.category}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {group.technologies.map((tech) => (
                    <span key={tech} className="rounded border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">{tech}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="section-padding border-y border-border bg-card/20">
        <div className="container-kezera-wide">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading eyebrow="Products" title="Ideas becoming products." description="Explore Kezera Tech products as they move from concept through development and into the hands of users." align="left" />
            <Button asChild variant="outline">
              <Link href="/products">Explore products <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="mt-12">
            {products.length === 0 ? (
              <article className="group flex min-h-[220px] flex-col justify-between rounded-xl border border-border bg-card p-8 md:p-10">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-accent">Coming soon</span>
                    <h3 className="mt-4 text-2xl font-bold tracking-tight">Products are on the way.</h3>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">Kezera Tech products will be introduced here as they move from concept to release.</p>
                  </div>
                  <div className="hidden h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent sm:flex">
                    <Sparkles className="h-6 w-6" />
                  </div>
                </div>
                <Link href="/products" className="mt-8 inline-flex items-center text-sm font-medium text-accent">See what is next <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
              </article>
            ) : (
              <div className="grid gap-4">
                {products.map((product) => (
                  <Link key={product.id} href={`/products/${product.slug}`}>
                    <article className="group flex min-h-[160px] items-center justify-between gap-6 rounded-xl border border-border bg-card p-8 transition-colors hover:border-accent/50 md:p-10">
                      <div className="flex items-center gap-5">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                          {product.logo_url ? <img src={product.logo_url} alt={product.name} className="h-8 w-8 object-contain" /> : <Sparkles className="h-6 w-6" />}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{product.name}</h3>
                          {product.description && <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground line-clamp-2">{product.description}</p>}
                        </div>
                      </div>
                      <span className="shrink-0 inline-flex items-center text-sm font-medium text-accent">Learn more <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="section-padding">
        <div className="container-kezera-wide">
          <SectionHeading eyebrow="Industries" title="Technology with context." description="We learn the environment around a problem so the solution fits the people, process, and industry it serves." />
          {industries.length === 0 ? (
            <div className="mt-14 rounded-xl border border-dashed border-border p-10 text-center">
              <p className="text-sm text-muted-foreground">Industries will appear here once published from the admin panel.</p>
            </div>
          ) : (
            <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3 lg:grid-cols-5">
              {industries.map((industry) => (
                <Link href="/industries" key={industry.id} className="group flex min-h-32 flex-col items-center justify-center gap-3 bg-card px-4 text-center transition-colors hover:bg-muted">
                  {industry.icon && (
                    <DynamicIcon name={industry.icon} className="h-6 w-6 text-accent transition-transform group-hover:scale-110" />
                  )}
                  <span className="text-sm font-medium">{industry.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding">
        <div className="container-kezera-wide">
          <SectionHeading
            eyebrow="Testimonials"
            title="Real words from real partners."
            description="What clients say about working with Kezera Tech."
          />
          {testimonials.length === 0 ? (
            <div className="mt-14 grid gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
              <div />
              <div className="rounded-xl border border-dashed border-border p-8 md:p-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Handshake className="h-5 w-5" />
                </div>
                <p className="mt-6 text-lg font-medium">Authentic experiences belong here.</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  No testimonials have been published yet. Add them from Admin → Content → Testimonials.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <div key={t.id} className="flex flex-col rounded-xl border border-border bg-card p-7">
                  {/* Stars */}
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < t.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                      />
                    ))}
                  </div>
                  {/* Quote */}
                  <p className="mt-5 flex-1 text-sm leading-7 text-muted-foreground">
                    &ldquo;{t.testimonial}&rdquo;
                  </p>
                  {/* Client */}
                  <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                    {t.profile_image_url ? (
                      <img
                        src={t.profile_image_url}
                        alt={t.client_name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
                        {t.client_name[0]?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold">{t.client_name}</p>
                      {(t.position || t.company) && (
                        <p className="text-xs text-muted-foreground">
                          {[t.position, t.company].filter(Boolean).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Blog */}
      <section className="section-padding border-y border-border bg-card/20">
        <div className="container-kezera-wide">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading eyebrow="Insights" title="Ideas in progress." description="Notes on building useful products, choosing technology, and making digital work better." align="left" />
            <Button asChild variant="link" className="h-auto p-0 text-accent">
              <Link href="/blog">Read the journal <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {blogPosts.length === 0 ? (
              <Link href="/blog" className="group rounded-xl border border-border bg-card p-7 transition-colors hover:border-accent/50">
                <span className="text-xs font-semibold uppercase tracking-wider text-accent">Kezera Tech journal</span>
                <h3 className="mt-8 text-xl font-bold tracking-tight">Insights are coming soon.</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">Practical notes on product thinking, engineering, design, and building with technology.</p>
                <span className="mt-8 inline-flex items-center text-sm font-medium text-accent">Visit insights <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
              </Link>
            ) : (
              blogPosts.map((post) => (
                <Link href={`/blog/${post.slug}`} key={post.id} className="group rounded-xl border border-border bg-card p-7 transition-colors hover:border-accent/50">
                  {post.publish_date && <span className="text-xs text-muted-foreground">{format(new Date(post.publish_date), 'MMM d, yyyy')}</span>}
                  <h3 className="mt-4 text-xl font-bold tracking-tight">{post.title}</h3>
                  {post.excerpt && <p className="mt-3 text-sm leading-6 text-muted-foreground line-clamp-3">{post.excerpt}</p>}
                  <span className="mt-8 inline-flex items-center text-sm font-medium text-accent">Read article <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* News preview */}
      <NewsPreviewSection />

      {/* CTA */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-[#061d48]" />
        <div className="absolute right-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-accent/10 blur-[100px]" />
        <div className="container-kezera-wide relative z-10 text-center">
          <Zap className="mx-auto h-8 w-8 text-accent" />
          <h2 className="mx-auto mt-7 max-w-2xl text-4xl font-bold tracking-tight text-white md:text-5xl">Have an idea? Let&apos;s build it.</h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/70">Tell us what you are trying to achieve. We will help you find the clearest path forward.</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 bg-accent px-7 text-accent-foreground hover:bg-accent/90">
              <Link href="/request-a-quote">Start a Project <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 border-white/30 bg-transparent px-7 text-white hover:bg-white/10 hover:text-white">
              <Link href="/contact">Contact Kezera Tech</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
