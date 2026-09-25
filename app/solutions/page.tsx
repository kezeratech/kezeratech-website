import { ArrowRight, Layers3, Workflow, Zap } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { PageHero } from '@/components/page-hero';
import { Button } from '@/components/ui/button';
const items = [{ icon: Layers3, title: 'Digital products', text: 'Bring a new idea from first principle to a useful, tested product.' }, { icon: Workflow, title: 'Connected operations', text: 'Replace disconnected tools and manual handoffs with clearer workflows.' }, { icon: Zap, title: 'Modern foundations', text: 'Upgrade legacy systems and create room for the next stage of growth.' }];
export default function SolutionsPage() { return <main><Navbar /><PageHero eyebrow="Solutions" title="Technology shaped around the problem." description="We do not start with a package. We start by understanding what needs to work better." /><section className="section-padding"><div className="container-kezera-wide grid gap-6 md:grid-cols-3">{items.map(({ icon: Icon, title, text }) => <div key={title} className="rounded-xl border border-border bg-card p-8"><Icon className="h-7 w-7 text-accent" /><h2 className="mt-8 text-xl font-bold">{title}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p></div>)}</div><div className="mt-14 text-center"><Button asChild><Link href="/request-a-quote">Explore a solution <ArrowRight className="ml-2 h-4 w-4" /></Link></Button></div></section><Footer /></main>; }
