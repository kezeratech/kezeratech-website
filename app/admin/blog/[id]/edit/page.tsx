'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export default function EditBlogPostPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '',
    featured_image_url: '', author: '', category: '', tags: '',
    seo_title: '', seo_description: '', canonical_url: '',
    publish_date: '', is_published: false,
  });

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('blog_posts').select('*').eq('id', id).single();
      if (data) {
        setForm({
          title: data.title ?? '',
          slug: data.slug ?? '',
          excerpt: data.excerpt ?? '',
          content: data.content ?? '',
          featured_image_url: data.featured_image_url ?? '',
          author: data.author ?? '',
          category: data.category ?? '',
          tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
          seo_title: data.seo_title ?? '',
          seo_description: data.seo_description ?? '',
          canonical_url: data.canonical_url ?? '',
          publish_date: data.publish_date ? data.publish_date.slice(0, 16) : '',
          is_published: data.is_published ?? false,
        });
      }
      setLoading(false);
    }
    load();
  }, [id]);

  function set(field: keyof typeof form, value: string | boolean) {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'title') updated.slug = slugify(value as string);
      return updated;
    });
  }

  async function submit(publish: boolean) {
    setSaving(true);
    const { error } = await supabase.from('blog_posts').update({
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt || null,
      content: form.content || null,
      featured_image_url: form.featured_image_url.trim() || null,
      author: form.author || null,
      category: form.category || null,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
      canonical_url: form.canonical_url || null,
      publish_date: form.publish_date || null,
      is_published: publish,
      status: publish ? 'published' : 'draft',
    }).eq('id', id);
    setSaving(false);
    if (error) {
      toast.error(`Failed to save: ${error.message}`);
      return;
    }
    router.push('/admin/blog');
  }

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/blog">
          <Button variant="ghost" size="sm"><ArrowLeft className="mr-1.5 h-4 w-4" />Back</Button>
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Edit Article</h1>
          <p className="mt-1 text-sm text-muted-foreground">Update this blog post.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="space-y-5 p-6">
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input value={form.title} onChange={(e) => set('title', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input value={form.slug} onChange={(e) => set('slug', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Excerpt</Label>
            <Textarea value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea value={form.content} onChange={(e) => set('content', e.target.value)} className="min-h-64" />
          </div>
          <div className="space-y-2">
            <Label>Featured Image URL</Label>
            <Input value={form.featured_image_url} onChange={(e) => set('featured_image_url', e.target.value)} placeholder="https://…" />
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="space-y-4 p-6">
            <h2 className="font-heading text-sm font-semibold uppercase tracking-wider">Publish</h2>
            <div className="space-y-2">
              <Label>Author</Label>
              <Input value={form.author} onChange={(e) => set('author', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="e.g. Technology, Design" />
            </div>
            <div className="space-y-2">
              <Label>Tags (comma separated)</Label>
              <Input value={form.tags} onChange={(e) => set('tags', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Publish Date</Label>
              <Input type="datetime-local" value={form.publish_date} onChange={(e) => set('publish_date', e.target.value)} />
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" disabled={saving} onClick={() => submit(false)}>
                {saving && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                Save Draft
              </Button>
              <Button size="sm" disabled={saving} onClick={() => submit(true)}>
                {saving && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                {form.is_published ? 'Update' : 'Publish'}
              </Button>
            </div>
          </Card>

          <Card className="space-y-4 p-6">
            <h2 className="font-heading text-sm font-semibold uppercase tracking-wider">SEO</h2>
            <div className="space-y-2">
              <Label>SEO Title</Label>
              <Input value={form.seo_title} onChange={(e) => set('seo_title', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>SEO Description</Label>
              <Textarea value={form.seo_description} onChange={(e) => set('seo_description', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Canonical URL</Label>
              <Input value={form.canonical_url} onChange={(e) => set('canonical_url', e.target.value)} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
