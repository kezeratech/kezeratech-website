import { Code2, Cloud, Database, Palette, ShieldCheck, Smartphone } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { PageHero } from '@/components/page-hero';
import { TECH_CATEGORIES } from '@/lib/site-data';
const icons = [Code2, Database, Smartphone, Cloud, ShieldCheck, Palette];
export default function TechnologyPage() { return <main><Navbar /><PageHero eyebrow="Engineering" title="Practical technology, carefully applied." description="We choose tools based on the product, the people operating it, and the future it needs to support." /><section className="section-padding"><div className="container-kezera-wide grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{TECH_CATEGORIES.slice(0, 6).map((group, index) => { const Icon = icons[index]; return <div key={group.category} className="rounded-xl border border-border bg-card p-7"><Icon className="h-6 w-6 text-accent" /><h2 className="mt-6 font-bold">{group.category}</h2><div className="mt-4 flex flex-wrap gap-2">{group.technologies.map((tech) => <span key={tech} className="rounded border border-border px-3 py-1.5 text-xs text-muted-foreground">{tech}</span>)}</div></div>; })}</div></section><Footer /></main>; }
