'use client';

import { useState, useEffect } from 'react';
import React from 'react';
import Link from 'next/link';
import { Linkedin, Send, Facebook, Instagram, Youtube, Twitter, Github, ArrowRight, Mail, Phone, MapPin } from 'lucide-react';
import { Logo } from '@/components/kezera-logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FOOTER_LINKS } from '@/lib/site-data';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

const SOCIAL_ICONS: Record<string, { icon: typeof Linkedin | React.FC<React.SVGProps<SVGSVGElement>>; label: string }> = {
  linkedin:  { icon: Linkedin,  label: 'LinkedIn'    },
  github:    { icon: Github,    label: 'GitHub'      },
  telegram:  { icon: Send,      label: 'Telegram'    },
  facebook:  { icon: Facebook,  label: 'Facebook'    },
  instagram: { icon: Instagram, label: 'Instagram'   },
  youtube:   { icon: Youtube,   label: 'YouTube'     },
  twitter:   { icon: Twitter,   label: 'X / Twitter' },
  tiktok:    { icon: TikTokIcon, label: 'TikTok'     },
};

// TikTok SVG icon (not in Lucide — custom)
function TikTokIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
    </svg>
  );
}

export function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<{ title: string; slug: string }[]>([]);
  const [siteInfo, setSiteInfo] = useState<{
    email: string; phone: string; address: string; social_links: Record<string, string>;
    company_name: string; tagline: string;
  }>({ email: '', phone: '', address: '', social_links: {}, company_name: 'Kezera Tech', tagline: '' });

  useEffect(() => {
    // Load site settings and published services in parallel
    Promise.all([
      supabase
        .from('site_settings')
        .select('email, phone, address, social_links, company_name, tagline')
        .limit(1)
        .single(),
      supabase
        .from('services')
        .select('title, slug')
        .eq('is_published', true)
        .order('sort_order')
        .limit(6),
    ]).then(([settingsRes, servicesRes]) => {
      if (settingsRes.data) {
        setSiteInfo({
          email: settingsRes.data.email ?? '',
          phone: settingsRes.data.phone ?? '',
          address: settingsRes.data.address ?? '',
          social_links: (settingsRes.data.social_links as Record<string, string>) ?? {},
          company_name: settingsRes.data.company_name ?? 'Kezera Tech',
          tagline: settingsRes.data.tagline ?? '',
        });
      }
      setServices((servicesRes.data ?? []) as { title: string; slug: string }[]);
    });
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        toast.success('You are subscribed. Welcome to the Kezera Tech community.');
        setEmail('');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="relative border-t border-border bg-card/30">
      <div className="container-kezera-wide py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <Logo size="md" />
            <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
              {siteInfo.tagline || 'Designing the Future Through Technology. We build innovative software, digital products, and technology solutions that solve real-world problems.'}
            </p>
            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
              {siteInfo.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-accent" />
                  <a href={`mailto:${siteInfo.email}`} className="hover:text-accent transition-colors">{siteInfo.email}</a>
                </div>
              )}
              {siteInfo.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-accent" />
                  <a href={`tel:${siteInfo.phone.replace(/\s/g, '')}`} className="hover:text-accent transition-colors">{siteInfo.phone}</a>
                </div>
              )}
              {siteInfo.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-accent" />
                  <span>{siteInfo.address}</span>
                </div>
              )}
            </div>
            <div className="mt-6 flex gap-3">
              {Object.entries(SOCIAL_ICONS)
                .filter(([key]) => siteInfo.social_links[key])
                .map(([key, { icon: Icon, label }]) => (
                  <a
                    key={key}
                    href={siteInfo.social_links[key]}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                    aria-label={label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold mb-4">Services</h3>
            <ul className="space-y-3">
              {services.length > 0
                ? services.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/services/${s.slug}`}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {s.title}
                      </Link>
                    </li>
                  ))
                : FOOTER_LINKS.services.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3">Newsletter</h4>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-9"
                  required
                />
                <Button type="submit" size="sm" disabled={loading} className="shrink-0">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {siteInfo.company_name || 'Kezera Tech'}. All rights reserved.
          </p>
          <div className="flex gap-6">
            {FOOTER_LINKS.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
