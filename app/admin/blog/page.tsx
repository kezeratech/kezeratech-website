'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { AdminTable, StatusBadge } from '@/components/admin/admin-table';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  author: string;
  excerpt: string;
  is_published: boolean;
  status: string;
  publish_date: string | null;
  created_at: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filtered, setFiltered] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('blog_posts')
      .select('id, title, slug, author, excerpt, is_published, status, publish_date, created_at')
      .order('created_at', { ascending: false });
    const list = (data ?? []) as BlogPost[];
    setPosts(list);
    setFiltered(list);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function deletePost() {
    if (!deleteId) return;
    await supabase.from('blog_posts').delete().eq('id', deleteId);
    setDeleteId(null);
    load();
  }

  async function togglePublish(p: BlogPost) {
    await supabase.from('blog_posts').update({
      is_published: !p.is_published,
      status: !p.is_published ? 'published' : 'draft',
    }).eq('id', p.id);
    load();
  }

  function search(q: string) {
    const lower = q.toLowerCase();
    setFiltered(posts.filter((p) => p.title.toLowerCase().includes(lower) || (p.author ?? '').toLowerCase().includes(lower)));
  }

  const rows = filtered.map((p) => ({
    title: <span className="font-medium">{p.title}</span>,
    author: p.author || <span className="text-muted-foreground">—</span>,
    status: <StatusBadge status={p.is_published ? 'published' : 'draft'} />,
    date: p.publish_date
      ? format(new Date(p.publish_date), 'MMM d, yyyy')
      : <span className="text-muted-foreground">—</span>,
    actions: (
      <div className="flex items-center gap-2">
        <button onClick={() => togglePublish(p)} className="text-xs text-muted-foreground hover:text-foreground underline">
          {p.is_published ? 'Unpublish' : 'Publish'}
        </button>
        <Link href={`/admin/blog/${p.id}/edit`} className="text-muted-foreground hover:text-foreground">
          <Pencil className="h-4 w-4" />
        </Link>
        <button onClick={() => setDeleteId(p.id)} className="text-muted-foreground hover:text-destructive">
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
            <h1 className="font-heading text-2xl font-bold tracking-tight">Blog Posts</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Create and manage articles for your insights section.
            </p>
          </div>
          <Button asChild size="sm">
            <Link href="/admin/blog/new">
              <Plus className="mr-1.5 h-4 w-4" />
              New Article
            </Link>
          </Button>
        </div>
        <AdminTable
          title=""
          description=""
          searchPlaceholder="Search posts..."
          onSearch={search}
          columns={[
            { key: 'title', label: 'Title' },
            { key: 'author', label: 'Author' },
            { key: 'status', label: 'Status' },
            { key: 'date', label: 'Publish Date' },
            { key: 'actions', label: '' },
          ]}
          rows={loading ? [] : rows}
          emptyMessage={loading ? 'Loading…' : 'No articles yet.'}
          emptyDescription="Create blog posts to share insights."
        />
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deletePost} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
