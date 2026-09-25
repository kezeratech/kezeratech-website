'use client';

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { KezeraMark } from '@/components/kezera-logo';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />

      <div className="relative z-10 text-center">
        <KezeraMark size={64} className="mx-auto" />
        <p className="mt-8 font-heading text-7xl font-bold tracking-tighter text-gradient-brand md:text-8xl">
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">
          Looks like this page took a different route.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
          The page you are looking for may have moved or no longer exists. Let&apos;s get you back on track.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Contact Us
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
