import Link from 'next/link';
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PageHero({
  eyebrow,
  title,
  description,
  cta,
  backHref,
  backLabel,
}: {
  eyebrow: string;
  title: string;
  description: string;
  cta?: { label: string; href: string };
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border pt-36 pb-20 md:pt-44 md:pb-28">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute -right-32 top-16 h-72 w-72 rounded-full bg-accent/10 blur-[100px]" />
      <div className="container-kezera relative z-10">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/" className="transition-colors hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3 shrink-0" />
          <span className="text-foreground">{eyebrow}</span>
        </nav>

        {/* Back button — only shown when explicitly provided */}
        {backHref && (
          <Link
            href={backHref}
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel ?? 'Back'}
          </Link>
        )}

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
        <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight tracking-[-0.035em] md:text-6xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">{description}</p>
        {cta && <Button asChild className="mt-8"><Link href={cta.href}>{cta.label}<ArrowRight className="ml-2 h-4 w-4" /></Link></Button>}
      </div>
    </section>
  );
}
