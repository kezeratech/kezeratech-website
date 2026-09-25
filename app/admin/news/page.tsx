'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { AdminTable, StatusBadge } from '@/components/admin/admin-table';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { format } from 'date-fns';

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  category: string;
  is_published: boolean;
  is_featured: boolean;
  publish_date: string;
  created_at: string;
}

export default function AdminNewsPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [filtered, setFiltered] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('news')
      .select('id, title, slug, excerpt, author, category, is_published, is_featured, publish_date, created_at')
      .order('created_at', { ascending: false });
    const list = (data ?? []) as NewsItem[];
    setItems(list);
    setFiltered(list);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function deleteNews() {
    if (!deleteId) return;
    await supabase.from('news').delete().eq('id', deleteId);
    setDeleteId(null);
    load();
  }

  async function togglePublish(item: NewsItem) {
    await supabase.from('news').update({ is_published: !item.is_published }).eq('id', item.id);
    load();
  }

  async function toggleFeatured(item: NewsItem) {
    await supabase.from('news').update({ is_featured: !item.is_featured }).eq('id', item.id);
    load();
  }

  function search(q: string) {
    const lower = q.toLowerCase();
    setFiltered(items.filter((n) =>
      n.title.toLowerCase().includes(lower) ||
      (n.category ?? '').toLowerCase().includes(lower)
    ));
  }

  const rows = filtered.map((item) => ({
    title: <span className="font-medium">{item.title}</span>,
    category: item.category
      ? <span className="rounded-full border border-border px-2.5 py-0.5 text-xs">{item.category}</span>
      : <span className="text-muted-foreground">—</span>,
    author: item.author || <span className="text-muted-foreground">—</span>,
    status: <StatusBadge status={item.is_published ? 'published' : 'draft'} />,
    featured: item.is_featured
      ? <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      : <span className="text-muted-foreground">—</span>,
    date: item.publish_date
      ? format(new Date(item.publish_date), 'MMM d, yyyy')
      : <span className="text-muted-foreground">—</span>,
    actions: (
      <div className="flex items-center gap-2">
        <button onClick={() => togglePublish(item)} className="text-xs text-muted-foreground hover:text-foreground underline">
          {item.is_published ? 'Unpublish' : 'Publish'}
        </button>
        <button onClick={() => toggleFeatured(item)} className="text-xs text-muted-foreground hover:text-foreground underline">
          {item.is_featured ? 'Unfeature' : 'Feature'}
        </button>
        <Link href={`/admin/news/${item.id}/edit`} className="text-muted-foreground hover:text-foreground">
          <Pencil className="h-4 w-4" />
        </Link>
        <button onClick={() => setDeleteId(item.id)} className="text-muted-foreground hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    ),
  }));

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight">News</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Publish company news, announcements, and updates.
            </p>
          </div>
          <Button asChild size="sm">
            <Link href="/admin/news/new">
              <Plus className="mr-1.5 h-4 w-4" /> New Article
            </Link>
          </Button>
        </div>

        <AdminTable
          title=""
          description=""
          searchPlaceholder="Search news..."
          onSearch={search}
          columns={[
            { key: 'title', label: 'Title' },
            { key: 'category', label: 'Category' },
            { key: 'author', label: 'Author' },
            { key: 'status', label: 'Status' },
            { key: 'featured', label: 'Featured' },
            { key: 'date', label: 'Date' },
            { key: 'actions', label: '' },
          ]}
          rows={loading ? [] : rows}
          emptyMessage={loading ? 'Loading…' : 'No news articles yet.'}
          emptyDescription="Create news articles to share company updates and announcements."
        />
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this news article?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteNews} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
