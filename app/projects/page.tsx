'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, FolderKanban } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { PageHero } from '@/components/page-hero';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

interface Project {
  id: string;
  title: string;
  slug: string;
  client: string;
  industry: string;
  project_type: string;
  description: string;
  is_featured: boolean;
  og_image_url: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('projects')
      .select('id, title, slug, client, industry, project_type, description, is_featured, og_image_url')
      .eq('is_published', true)
      .order('sort_order')
      .then(({ data }) => {
        setProjects((data ?? []) as Project[]);
        setLoading(false);
      });
  }, []);

  return (
    <main>
      <Navbar />
      <PageHero
        eyebrow="Portfolio"
        title="Work that earns its place in the real world."
        description="Case studies published here are completed, reviewed, and approved for sharing."
      />
      <section className="section-padding">
        <div className="container-kezera-wide">
          {loading ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl border border-border bg-card p-8 min-h-[280px]">
                  <div className="h-3 w-24 rounded bg-muted" />
                  <div className="mt-8 h-7 w-3/4 rounded bg-muted" />
                  <div className="mt-4 space-y-2">
                    <div className="h-3 w-full rounded bg-muted" />
                    <div className="h-3 w-5/6 rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-10 text-center md:p-16">
              <FolderKanban className="mx-auto h-10 w-10 text-accent" />
              <h2 className="mt-6 text-2xl font-bold">Projects are on the way.</h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
                This portfolio is ready for verified case studies. No client, result, or project
                information will be published without approval.
              </p>
              <Button asChild className="mt-7">
                <Link href="/request-a-quote">
                  Build something worth sharing <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {projects.map((project) => (
                <Link key={project.id} href={`/projects/${project.slug}`}>
                  <article className="group relative min-h-[300px] overflow-hidden rounded-xl border border-border bg-card p-8 transition-colors hover:border-accent/50 md:p-10">
                    <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-accent/10 blur-3xl transition-transform duration-700 group-hover:scale-150" />
                    <div className="relative flex h-full flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          {project.industry && (
                            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                              {project.industry}
                            </span>
                          )}
                          {project.project_type && (
                            <span className="rounded-full border border-border px-3 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                              {project.project_type}
                            </span>
                          )}
                          {project.is_featured && (
                            <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[10px] uppercase tracking-wider text-accent">
                              Featured
                            </span>
                          )}
                        </div>
                        <h3 className="mt-6 text-2xl font-bold tracking-tight">{project.title}</h3>
                        {project.client && (
                          <p className="mt-1 text-sm text-muted-foreground">Client: {project.client}</p>
                        )}
                        {project.description && (
                          <p className="mt-4 text-sm leading-6 text-muted-foreground line-clamp-3">
                            {project.description}
                          </p>
                        )}
                      </div>
                      <div className="mt-8 inline-flex items-center text-sm font-medium text-accent">
                        View case study <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
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
