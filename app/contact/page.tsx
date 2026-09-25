'use client';

import { useState, useEffect } from 'react';
import { Mail, MapPin, Phone, Clock, Send, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { PageHero } from '@/components/page-hero';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface SiteInfo {
  email: string;
  phone: string;
  address: string;
  business_hours: string;
}

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [siteInfo, setSiteInfo] = useState<SiteInfo>({
    email: '', phone: '', address: '', business_hours: '',
  });
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '', message: '',
  });

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('email, phone, address, business_hours')
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) setSiteInfo(data as SiteInfo);
      });
  }, []);

  function set(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from('contact_messages').insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      company: form.company || null,
      message: form.message,
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
        eyebrow="Contact"
        title="Let's talk about what you are building."
        description="Share a little about the challenge, opportunity, or idea on your mind. We will get back to you with a thoughtful next step."
      />
      <section className="section-padding">
        <div className="container-kezera-wide grid gap-14 lg:grid-cols-[0.7fr_1.3fr]">
          {/* Contact info — loaded from site_settings */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Reach out</p>
            <div className="mt-7 space-y-6">
              {siteInfo.email && (
                <div className="flex gap-4">
                  <Mail className="mt-1 h-5 w-5 shrink-0 text-accent" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a href={`mailto:${siteInfo.email}`} className="mt-1 text-sm text-muted-foreground hover:text-accent transition-colors">
                      {siteInfo.email}
                    </a>
                  </div>
                </div>
              )}
              {siteInfo.phone && (
                <div className="flex gap-4">
                  <Phone className="mt-1 h-5 w-5 shrink-0 text-accent" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <a href={`tel:${siteInfo.phone.replace(/\s/g, '')}`} className="mt-1 text-sm text-muted-foreground hover:text-accent transition-colors">
                      {siteInfo.phone}
                    </a>
                  </div>
                </div>
              )}
              {siteInfo.address && (
                <div className="flex gap-4">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-accent" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="mt-1 text-sm text-muted-foreground">{siteInfo.address}</p>
                  </div>
                </div>
              )}
              {siteInfo.business_hours && (
                <div className="flex gap-4">
                  <Clock className="mt-1 h-5 w-5 shrink-0 text-accent" />
                  <div>
                    <p className="font-medium">Business Hours</p>
                    <p className="mt-1 text-sm text-muted-foreground">{siteInfo.business_hours}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form */}
          <div className="rounded-xl border border-border bg-card p-7 md:p-9">
            {sent ? (
              <div className="py-12 text-center">
                <Send className="mx-auto h-8 w-8 text-accent" />
                <h2 className="mt-5 text-2xl font-bold">Message received.</h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  Thank you for reaching out. We will be in touch soon.
                </p>
                <Button
                  variant="outline"
                  className="mt-7"
                  onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', company: '', message: '' }); }}
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input id="name" required placeholder="Your name" value={form.name} onChange={(e) => set('name', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" required placeholder="you@company.com" value={form.email} onChange={(e) => set('email', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="+251 ..." value={form.phone} onChange={(e) => set('phone', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" placeholder="Company name" value={form.company} onChange={(e) => set('company', e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">How can we help? *</Label>
                  <Textarea id="message" required placeholder="Tell us about your goals or challenge..." className="min-h-36" value={form.message} onChange={(e) => set('message', e.target.value)} />
                </div>
                <Button type="submit" disabled={submitting}>
                  {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  {submitting ? 'Sending…' : 'Send message'}
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
