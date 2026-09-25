'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AdminTable, StatusBadge } from '@/components/admin/admin-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Loader2, Pencil, Trash2, Star } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  slug: string;
  icon: string;
  short_description: string;
  full_description: string;
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
  cta_label: string;
  cta_href: string;
  seo_title: string;
  seo_description: string;
}

const EMPTY: Omit<Service, 'id'> = {
  title: '', slug: '', icon: '', short_description: '', full_description: '',
  is_published: false, is_featured: false, sort_order: 0,
  cta_label: '', cta_href: '', seo_title: '', seo_description: '',
};

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [filtered, setFiltered] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Service, 'id'>>(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('services').select('*').order('sort_order');
    const list = (data ?? []) as Service[];
    setServices(list);
    setFiltered(list);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setForm(EMPTY);
    setEditId(null);
    setModalOpen(true);
  }

  function openEdit(s: Service) {
    const { id, ...rest } = s;
    setForm(rest);
    setEditId(id);
    setModalOpen(true);
  }

  function set(field: keyof typeof EMPTY, value: string | boolean | number) {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'title') updated.slug = slugify(value as string);
      return updated;
    });
  }

  async function save() {
    setSaving(true);
    if (editId) {
      await supabase.from('services').update(form).eq('id', editId);
    } else {
      await supabase.from('services').insert(form);
    }
    setSaving(false);
    setModalOpen(false);
    load();
  }

  async function deleteService() {
    if (!deleteId) return;
    await supabase.from('services').delete().eq('id', deleteId);
    setDeleteId(null);
    load();
  }

  async function togglePublish(s: Service) {
    await supabase.from('services').update({ is_published: !s.is_published }).eq('id', s.id);
    load();
  }

  function search(q: string) {
    const lower = q.toLowerCase();
    setFiltered(services.filter((s) => s.title.toLowerCase().includes(lower)));
  }

  const rows = filtered.map((s) => ({
    title: <span className="font-medium">{s.title}</span>,
    status: <StatusBadge status={s.is_published ? 'published' : 'draft'} />,
    featured: s.is_featured ? <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> : <span className="text-muted-foreground">—</span>,
    order: s.sort_order,
    actions: (
      <div className="flex items-center gap-2">
        <button onClick={() => togglePublish(s)} className="text-xs text-muted-foreground hover:text-foreground underline">
          {s.is_published ? 'Unpublish' : 'Publish'}
        </button>
        <button onClick={() => openEdit(s)} className="text-muted-foreground hover:text-foreground"><Pencil className="h-4 w-4" /></button>
        <button onClick={() => setDeleteId(s.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
      </div>
    ),
  }));

  return (
    <>
      <AdminTable
        title="Services"
        description="Manage the services displayed on your website."
        searchPlaceholder="Search services..."
        addLabel="New Service"
        onAdd={openAdd}
        onSearch={search}
        columns={[
          { key: 'title', label: 'Title' },
          { key: 'status', label: 'Status' },
          { key: 'featured', label: 'Featured' },
          { key: 'order', label: 'Order' },
          { key: 'actions', label: '' },
        ]}
        rows={loading ? [] : rows}
        emptyMessage={loading ? 'Loading…' : 'No services yet.'}
        emptyDescription="Create services to display them on your website."
      />

      {/* Add / Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit Service' : 'New Service'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Web Development" />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="web-development" />
            </div>
            <div className="space-y-2">
              <Label>Icon (Lucide name or emoji)</Label>
              <Input value={form.icon} onChange={(e) => set('icon', e.target.value)} placeholder="code-2" />
            </div>
            <div className="space-y-2">
              <Label>Sort Order</Label>
              <Input type="number" value={form.sort_order} onChange={(e) => set('sort_order', Number(e.target.value))} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Short Description</Label>
              <Textarea value={form.short_description} onChange={(e) => set('short_description', e.target.value)} placeholder="Brief summary shown on cards…" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Full Description</Label>
              <Textarea className="min-h-28" value={form.full_description} onChange={(e) => set('full_description', e.target.value)} placeholder="Detailed description for the service page…" />
            </div>
            <div className="space-y-2">
              <Label>CTA Label</Label>
              <Input value={form.cta_label} onChange={(e) => set('cta_label', e.target.value)} placeholder="Get Started" />
            </div>
            <div className="space-y-2">
              <Label>CTA Link</Label>
              <Input value={form.cta_href} onChange={(e) => set('cta_href', e.target.value)} placeholder="/contact" />
            </div>
            <div className="space-y-2">
              <Label>SEO Title</Label>
              <Input value={form.seo_title} onChange={(e) => set('seo_title', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>SEO Description</Label>
              <Input value={form.seo_description} onChange={(e) => set('seo_description', e.target.value)} />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_published} onCheckedChange={(v) => set('is_published', v)} id="pub" />
              <Label htmlFor="pub">Published</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_featured} onCheckedChange={(v) => set('is_featured', v)} id="feat" />
              <Label htmlFor="feat">Featured</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving || !form.title}>
              {saving && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
              {editId ? 'Save Changes' : 'Create Service'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this service?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteService} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
