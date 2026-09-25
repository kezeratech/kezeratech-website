'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { PageHero } from '@/components/page-hero';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('faqs')
      .select('id, question, answer, category, sort_order')
      .eq('is_published', true)
      .order('sort_order')
      .then(({ data }) => {
        setFaqs((data ?? []) as FAQ[]);
        setLoading(false);
      });
  }, []);

  // Group by category
  const categories = Array.from(new Set(faqs.map((f) => f.category || 'General')));

  return (
    <main>
      <Navbar />
      <PageHero
        eyebrow="FAQ"
        title="Straight answers to common questions."
        description="A simple starting point for understanding how Kezera Tech works."
      />
      <section className="section-padding">
        <div className="container-kezera max-w-3xl">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : faqs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-10 text-center">
              <p className="text-sm font-medium">No FAQs published yet.</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Add and publish FAQs from the admin dashboard.
              </p>
            </div>
          ) : categories.length > 1 ? (
            // Show grouped by category if multiple categories exist
            <div className="space-y-10">
              {categories.map((category) => (
                <div key={category}>
                  <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                    {category}
                  </h2>
                  <Accordion type="single" collapsible className="w-full">
                    {faqs
                      .filter((f) => (f.category || 'General') === category)
                      .map((faq, index) => (
                        <AccordionItem key={faq.id} value={`${category}-${index}`}>
                          <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                          <AccordionContent className="leading-7 text-muted-foreground">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                  </Accordion>
                </div>
              ))}
            </div>
          ) : (
            // Simple list when all in one category
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={faq.id} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="leading-7 text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
