'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Briefcase, MapPin, Clock, UsersRound } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { PageHero } from '@/components/page-hero';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

interface JobPosition {
  id: string;
  title: string;
  department: string;
  employment_type: string;
  location: string;
  description: string;
  deadline: string;
  status: string;
}

export default function CareersPage() {
  const [jobs, setJobs] = useState<JobPosition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('job_positions')
      .select('id, title, department, employment_type, location, description, deadline, status')
      .eq('is_published', true)
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setJobs((data ?? []) as JobPosition[]);
        setLoading(false);
      });
  }, []);

  return (
    <main>
      <Navbar />
      <PageHero
        eyebrow="Careers"
        title="Make useful things with thoughtful people."
        description="We are building a company that values curiosity, care, and the craft of making technology work well."
      />
      <section className="section-padding">
        <div className="container-kezera-wide">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl border border-border bg-card p-7">
                  <div className="h-5 w-48 rounded bg-muted" />
                  <div className="mt-3 flex gap-3">
                    <div className="h-3 w-20 rounded bg-muted" />
                    <div className="h-3 w-20 rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-10 text-center md:p-16">
              <UsersRound className="mx-auto h-10 w-10 text-accent" />
              <h2 className="mt-6 text-2xl font-bold">No open positions yet.</h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
                When roles are available, you will find the team, expectations, and application
                details here.
              </p>
              <Button asChild className="mt-7">
                <Link href="/contact">
                  Introduce yourself <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {jobs.length} open {jobs.length === 1 ? 'position' : 'positions'}
              </p>
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="group rounded-xl border border-border bg-card p-7 transition-colors hover:border-accent/50"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold">{job.title}</h2>
                        {job.department && (
                          <Badge variant="secondary" className="text-xs">
                            {job.department}
                          </Badge>
                        )}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        {job.location && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" /> {job.location}
                          </span>
                        )}
                        {job.employment_type && (
                          <span className="flex items-center gap-1.5">
                            <Briefcase className="h-3.5 w-3.5" /> {job.employment_type}
                          </span>
                        )}
                        {job.deadline && (
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" /> Apply by{' '}
                            {new Date(job.deadline).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        )}
                      </div>
                      {job.description && (
                        <p className="mt-4 text-sm leading-6 text-muted-foreground line-clamp-2">
                          {job.description}
                        </p>
                      )}
                    </div>
                    <Button asChild size="sm" className="shrink-0">
                      <Link href={`/careers/${job.id}`}>
                        Apply now <ArrowRight className="ml-1.5 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
