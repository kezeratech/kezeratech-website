'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export default function NewNewsPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '',
    featured_image_url: '', author: '', category: '',
    tags: '', seo_title: '', seo_description: '',
    publish_date: '', is_featured: false,
  });

  function set(field: keyof typeof form, value: string | boolean) {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'title') updated.slug = slugify(value as string);
      return updated;
    });
  }

  async function submit(publish: boolean) {
    if (!form.title.trim()) return;
    setSaving(true);
    const { error } = await supabase.from('news').insert({
      title: form.title,
      slug: form.slug || slugify(form.title),
      excerpt: form.excerpt,
      content: form.content,
      featured_image_url: form.featured_image_url || null,
      author: form.author,
      category: form.category,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()) : [],
      seo_title: form.seo_title,
      seo_description: form.seo_description,
      publish_date: form.publish_date || new Date().toISOString(),
      is_published: publish,
      is_featured: form.is_featured,
    });
    setSaving(false);
    if (error) {
      toast.error('Failed to save. Please try again.');
      return;
    }
    router.push('/admin/news');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/news">
          <Button variant="ghost" size="sm"><ArrowLeft className="mr-1.5 h-4 w-4" />Back</Button>
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">New News Article</h1>
          <p className="mt-1 text-sm text-muted-foreground">Create a company news article or announcement.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="space-y-5 p-6">
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="News article title…" />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="news-article-slug" />
          </div>
          <div className="space-y-2">
            <Label>Excerpt</Label>
            <Textarea value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} placeholder="Short summary shown in news listings…" className="min-h-20" />
          </div>
          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea value={form.content} onChange={(e) => set('content', e.target.value)} placeholder="Write the full article here…" className="min-h-64" />
          </div>
          <div className="space-y-2">
            <Label>Featured Image URL</Label>
            <Input value={form.featured_image_url} onChange={(e) => set('featured_image_url', e.target.value)} placeholder="https://… (upload in Media Library first)" />
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="space-y-4 p-6">
            <h2 className="font-heading text-sm font-semibold uppercase tracking-wider">Publish</h2>
            <div className="space-y-2">
              <Label>Author</Label>
              <Input value={form.author} onChange={(e) => set('author', e.target.value)} placeholder="Author name or Kezera Tech" />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="e.g. Announcement, Update, Event" />
            </div>
            <div className="space-y-2">
              <Label>Tags (comma separated)</Label>
              <Input value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="technology, announcement" />
            </div>
            <div className="space-y-2">
              <Label>Publish Date</Label>
              <Input type="datetime-local" value={form.publish_date} onChange={(e) => set('publish_date', e.target.value)} />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_featured} onCheckedChange={(v) => set('is_featured', v)} id="feat" />
              <Label htmlFor="feat">Featured Article</Label>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" disabled={saving || !form.title} onClick={() => submit(false)}>
                {saving && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                Save Draft
              </Button>
              <Button size="sm" disabled={saving || !form.title} onClick={() => submit(true)}>
                {saving && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                Publish
              </Button>
            </div>
          </Card>

          <Card className="space-y-4 p-6">
            <h2 className="font-heading text-sm font-semibold uppercase tracking-wider">SEO</h2>
            <div className="space-y-2">
              <Label>SEO Title</Label>
              <Input value={form.seo_title} onChange={(e) => set('seo_title', e.target.value)} placeholder="SEO title…" />
            </div>
            <div className="space-y-2">
              <Label>SEO Description</Label>
              <Textarea value={form.seo_description} onChange={(e) => set('seo_description', e.target.value)} placeholder="Meta description…" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
