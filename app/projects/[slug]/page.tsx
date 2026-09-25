'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ExternalLink, Github, Loader2, Calendar } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';

interface Project {
  id: string;
  title: string;
  slug: string;
  client: string;
  industry: string;
  project_type: string;
  description: string;
  challenge: string;
  solution: string;
  result: string;
  technologies: string[];
  images: string[];
  project_url: string;
  github_url: string;
  completion_date: string;
  status: string;
  is_featured: boolean;
}

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound404, setNotFound404] = useState(false);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotFound404(true);
        } else {
          setProject(data as Project);
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

  if (notFound404 || !project) {
    return (
      <main>
        <Navbar />
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
          <p className="text-sm text-muted-foreground">This project is not available.</p>
          <Button asChild variant="outline">
            <Link href="/projects"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects</Link>
          </Button>
        </div>
        <Footer />
      </main>
    );
  }

  const technologies = Array.isArray(project.technologies) ? project.technologies : [];
  const images = Array.isArray(project.images) ? project.images : [];

  return (
    <main>
      <Navbar />
      <article className="pt-32 pb-20">
        <div className="container-kezera max-w-4xl">
          <Link href="/projects" className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to projects
          </Link>

          {/* Header */}
          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-2">
              {project.industry && (
                <span className="text-xs font-semibold uppercase tracking-wider text-accent">{project.industry}</span>
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
            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">{project.title}</h1>

            {/* Meta row */}
            <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
              {project.client && <span>Client: <strong className="text-foreground">{project.client}</strong></span>}
              {project.completion_date && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(project.completion_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              )}
            </div>

            {/* Links */}
            <div className="mt-5 flex flex-wrap gap-3">
              {project.project_url && (
                <a href={project.project_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">
                  <ExternalLink className="h-4 w-4" /> View Project
                </a>
              )}
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">
                  <Github className="h-4 w-4" /> GitHub
                </a>
              )}
            </div>
          </div>

          {/* Description */}
          {project.description && (
            <p className="mt-8 text-lg leading-8 text-muted-foreground">{project.description}</p>
          )}

          {/* Images */}
          {images.length > 0 && (
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {images.map((img, i) => (
                <div key={i} className="overflow-hidden rounded-xl border border-border">
                  <img src={img} alt={`${project.title} screenshot ${i + 1}`} className="w-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Challenge / Solution / Result */}
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {project.challenge && (
              <div className="rounded-xl border border-border bg-card p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">Challenge</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{project.challenge}</p>
              </div>
            )}
            {project.solution && (
              <div className="rounded-xl border border-border bg-card p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">Solution</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{project.solution}</p>
              </div>
            )}
            {project.result && (
              <div className="rounded-xl border border-border bg-card p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">Result</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{project.result}</p>
              </div>
            )}
          </div>

          {/* Technologies */}
          {technologies.length > 0 && (
            <div className="mt-10 border-t border-border pt-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">Technologies Used</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {technologies.map((tech, i) => (
                  <span key={i} className="rounded border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">{tech}</span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 flex items-center justify-between border-t border-border pt-8">
            <Link href="/projects" className="inline-flex items-center text-sm font-medium text-accent hover:underline">
              <ArrowLeft className="mr-2 h-4 w-4" /> All projects
            </Link>
            <Button asChild>
              <Link href="/request-a-quote">Start a project <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  );
}
