'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Briefcase, MapPin, Clock, Loader2, Send } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface JobPosition {
  id: string;
  title: string;
  department: string;
  employment_type: string;
  location: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  preferred_skills: string[];
  deadline: string;
  status: string;
}

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [job, setJob] = useState<JobPosition | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    cv_url: '', portfolio_url: '', linkedin_url: '', cover_letter: '',
  });

  useEffect(() => {
    if (!id) return;
    supabase
      .from('job_positions')
      .select('*')
      .eq('id', id)
      .eq('is_published', true)
      .eq('status', 'open')
      .single()
      .then(({ data, error }) => {
        if (error || !data) setNotFound(true);
        else setJob(data as JobPosition);
        setLoading(false);
      });
  }, [id]);

  function set(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from('job_applications').insert({
      job_position_id: id,
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      cv_url: form.cv_url || null,
      portfolio_url: form.portfolio_url || null,
      linkedin_url: form.linkedin_url || null,
      cover_letter: form.cover_letter || null,
      status: 'new',
      is_read: false,
    });
    setSubmitting(false);
    if (error) {
      toast.error('Something went wrong. Please try again.');
      return;
    }
    setSubmitted(true);
  }

  if (loading) return (
    <main><Navbar />
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
      <Footer />
    </main>
  );

  if (notFound || !job) return (
    <main><Navbar />
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-sm text-muted-foreground">This position is not available.</p>
        <Button asChild variant="outline">
          <Link href="/careers"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Careers</Link>
        </Button>
      </div>
      <Footer />
    </main>
  );

  const responsibilities = Array.isArray(job.responsibilities) ? job.responsibilities : [];
  const requirements = Array.isArray(job.requirements) ? job.requirements : [];
  const preferred = Array.isArray(job.preferred_skills) ? job.preferred_skills : [];

  return (
    <main>
      <Navbar />
      <div className="pt-32 pb-20">
        <div className="container-kezera max-w-4xl">
          <Link href="/careers" className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to careers
          </Link>

          <div className="mt-8">
            <h1 className="text-4xl font-bold tracking-tight">{job.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {job.department && <span className="font-medium text-foreground">{job.department}</span>}
              {job.location && <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{job.location}</span>}
              {job.employment_type && <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" />{job.employment_type}</span>}
              {job.deadline && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  Apply by {new Date(job.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              )}
            </div>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
            {/* Job details */}
            <div className="space-y-8">
              {job.description && (
                <div>
                  <h2 className="text-lg font-semibold">About the role</h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{job.description}</p>
                </div>
              )}
              {responsibilities.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold">Responsibilities</h2>
                  <ul className="mt-3 space-y-2">
                    {responsibilities.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {requirements.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold">Requirements</h2>
                  <ul className="mt-3 space-y-2">
                    {requirements.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {preferred.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold">Preferred Skills</h2>
                  <ul className="mt-3 space-y-2">
                    {preferred.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Application form */}
            <div className="rounded-xl border border-border bg-card p-6">
              {submitted ? (
                <div className="py-8 text-center">
                  <Send className="mx-auto h-8 w-8 text-accent" />
                  <h3 className="mt-4 text-lg font-bold">Application submitted!</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Thank you for applying. We will be in touch if your profile is a good fit.
                  </p>
                  <Button variant="outline" size="sm" className="mt-6" onClick={() => router.push('/careers')}>
                    Back to careers
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="font-semibold">Apply for this role</h2>
                  <div className="space-y-2">
                    <Label htmlFor="app-name">Full Name *</Label>
                    <Input id="app-name" required value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="app-email">Email *</Label>
                    <Input id="app-email" type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@email.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="app-phone">Phone</Label>
                    <Input id="app-phone" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+251..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="app-cv">CV / Resume URL</Label>
                    <Input id="app-cv" value={form.cv_url} onChange={(e) => set('cv_url', e.target.value)} placeholder="Google Drive, Dropbox link..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="app-portfolio">Portfolio URL</Label>
                    <Input id="app-portfolio" value={form.portfolio_url} onChange={(e) => set('portfolio_url', e.target.value)} placeholder="https://..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="app-linkedin">LinkedIn</Label>
                    <Input id="app-linkedin" value={form.linkedin_url} onChange={(e) => set('linkedin_url', e.target.value)} placeholder="https://linkedin.com/in/..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="app-cover">Cover Letter</Label>
                    <Textarea id="app-cover" value={form.cover_letter} onChange={(e) => set('cover_letter', e.target.value)} placeholder="Tell us why you'd be a great fit..." className="min-h-28" />
                  </div>
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {submitting ? 'Submitting…' : 'Submit Application'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
