'use client';

import { useEffect, useState } from 'react';
import { KezeraMark } from '@/components/kezera-logo';
import { Clock, Mail } from 'lucide-react';

export default function MaintenancePage() {
  const [message, setMessage] = useState('We are improving the future. Kezera Tech will be back shortly.');
  const [dots, setDots] = useState('');

  useEffect(() => {
    // Load the custom maintenance message from the API
    fetch('/api/maintenance')
      .then((r) => r.json())
      .then((data) => {
        if (data.maintenance_message) setMessage(data.maintenance_message);
      })
      .catch(() => {});

    // Animated dots effect
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4">
      {/* Background effects */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-accent/10 blur-[80px]" />

      <div className="relative z-10 text-center">
        {/* Logo */}
        <KezeraMark size={72} className="mx-auto" />

        {/* Brand name */}
        <p className="mt-6 font-heading text-2xl font-bold tracking-tight">
          Kezera<span className="text-accent">Tech</span>
        </p>

        {/* Status badge */}
        <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/5 px-4 py-2 text-xs font-medium uppercase tracking-widest text-accent">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          Under Maintenance
        </div>

        {/* Headline */}
        <h1 className="mt-8 max-w-xl text-3xl font-bold leading-tight tracking-tight md:text-4xl">
          We will be back soon{dots}
        </h1>

        {/* Message */}
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted-foreground">
          {message}
        </p>

        {/* Info row */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-accent" />
            <span>We'll be back shortly</span>
          </div>
          <a
            href="mailto:kezeratech@gmail.com"
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Mail className="h-4 w-4 text-accent" />
            <span>kezeratech@gmail.com</span>
          </a>
        </div>

        {/* Footer note */}
        <p className="mt-12 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Kezera Tech. All rights reserved.
        </p>
      </div>
    </div>
  );
}
