'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { PageHero } from '@/components/page-hero';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function QuotePage() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company_name: '', industry: '',
    website: '', project_type: '', description: '', goals: '',
    desired_features: '', budget_range: '', expected_timeline: '',
  });

  function set(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from('quote_requests').insert({
      ...form,
      status: 'new',
      is_read: false,
    });
    setSubmitting(false);
    if (error) {
      toast.error('Something went wrong. Please try again.');
      return;
    }
    setSent(true);
  }

  return (
    <main>
      <Navbar />
      <PageHero
        eyebrow="Start a project"
        title="Tell us what you want to make possible."
        description="The more context you share, the more useful our first conversation can be. There is no need to have everything figured out yet."
      />
      <section className="section-padding">
        <div className="container-kezera max-w-3xl">
          <div className="rounded-xl border border-border bg-card p-7 md:p-10">
            {sent ? (
              <div className="py-16 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-accent" />
                <h2 className="mt-6 text-2xl font-bold">Your project brief is in.</h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                  We will review the details and follow up with a clear next step.
                </p>
                <Button variant="outline" className="mt-7" onClick={() => {
                  setSent(false);
                  setForm({
                    name: '', email: '', phone: '', company_name: '', industry: '',
                    website: '', project_type: '', description: '', goals: '',
                    desired_features: '', budget_range: '', expected_timeline: '',
                  });
                }}>
                  Submit another request
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-7">
                <div>
                  <h2 className="text-xl font-bold">Project details</h2>
                  <p className="mt-2 text-sm text-muted-foreground">Start with the essentials. We can explore the rest together.</p>
                </div>

                {/* Contact info */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="q-name">Name *</Label>
                    <Input id="q-name" required placeholder="Your name" value={form.name} onChange={(e) => set('name', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="q-email">Email *</Label>
                    <Input id="q-email" type="email" required placeholder="you@company.com" value={form.email} onChange={(e) => set('email', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="q-phone">Phone</Label>
                    <Input id="q-phone" placeholder="+251 ..." value={form.phone} onChange={(e) => set('phone', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="q-company">Company</Label>
                    <Input id="q-company" placeholder="Company name" value={form.company_name} onChange={(e) => set('company_name', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="q-industry">Industry</Label>
                    <Input id="q-industry" placeholder="Healthcare, Finance, Retail…" value={form.industry} onChange={(e) => set('industry', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="q-website">Current Website</Label>
                    <Input id="q-website" placeholder="https://…" value={form.website} onChange={(e) => set('website', e.target.value)} />
                  </div>
                </div>

                {/* Project info */}
                <div className="space-y-2">
                  <Label htmlFor="q-type">Project Type *</Label>
                  <Input id="q-type" required placeholder="Website, mobile app, custom software…" value={form.project_type} onChange={(e) => set('project_type', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="q-desc">What are you trying to achieve? *</Label>
                  <Textarea id="q-desc" required placeholder="Describe the challenge, idea, or opportunity…" className="min-h-36" value={form.description} onChange={(e) => set('description', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="q-goals">Goals & Success Metrics</Label>
                  <Textarea id="q-goals" placeholder="What does success look like for this project?" className="min-h-24" value={form.goals} onChange={(e) => set('goals', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="q-features">Desired Features</Label>
                  <Textarea id="q-features" placeholder="Key features or functionality you have in mind…" className="min-h-24" value={form.desired_features} onChange={(e) => set('desired_features', e.target.value)} />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="q-budget">Budget Range</Label>
                    <Input id="q-budget" placeholder="e.g. $5,000 – $10,000" value={form.budget_range} onChange={(e) => set('budget_range', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="q-timeline">Expected Timeline</Label>
                    <Input id="q-timeline" placeholder="e.g. 3 months" value={form.expected_timeline} onChange={(e) => set('expected_timeline', e.target.value)} />
                  </div>
                </div>

                <Button type="submit" size="lg" disabled={submitting}>
                  {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {submitting ? 'Submitting…' : 'Submit project brief'}
                  {!submitting && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
