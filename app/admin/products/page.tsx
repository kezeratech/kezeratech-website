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
import { Loader2, Pencil, Trash2 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  long_description: string;
  category: string;
  availability: string;
  pricing_info: string;
  website_url: string;
  download_url: string;
  documentation_url: string;
  is_published: boolean;
  sort_order: number;
  seo_title: string;
  seo_description: string;
}

const EMPTY: Omit<Product, 'id'> = {
  name: '', slug: '', description: '', long_description: '',
  category: '', availability: 'coming_soon', pricing_info: '',
  website_url: '', download_url: '', documentation_url: '',
  is_published: false, sort_order: 0, seo_title: '', seo_description: '',
};

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Product, 'id'>>(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('sort_order');
    const list = (data ?? []) as Product[];
    setProducts(list);
    setFiltered(list);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() { setForm(EMPTY); setEditId(null); setModalOpen(true); }
  function openEdit(p: Product) { const { id, ...rest } = p; setForm(rest); setEditId(id); setModalOpen(true); }

  function set(field: keyof typeof EMPTY, value: string | boolean | number) {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'name') updated.slug = slugify(value as string);
      return updated;
    });
  }

  async function save() {
    setSaving(true);
    if (editId) {
      await supabase.from('products').update(form).eq('id', editId);
    } else {
      await supabase.from('products').insert(form);
    }
    setSaving(false);
    setModalOpen(false);
    load();
  }

  async function deleteProduct() {
    if (!deleteId) return;
    await supabase.from('products').delete().eq('id', deleteId);
    setDeleteId(null);
    load();
  }

  async function togglePublish(p: Product) {
    await supabase.from('products').update({ is_published: !p.is_published }).eq('id', p.id);
    load();
  }

  function search(q: string) {
    const lower = q.toLowerCase();
    setFiltered(products.filter((p) => p.name.toLowerCase().includes(lower)));
  }

  const rows = filtered.map((p) => ({
    name: <span className="font-medium">{p.name}</span>,
    category: p.category || <span className="text-muted-foreground">—</span>,
    availability: <StatusBadge status={p.availability} />,
    status: <StatusBadge status={p.is_published ? 'published' : 'draft'} />,
    actions: (
      <div className="flex items-center gap-2">
        <button onClick={() => togglePublish(p)} className="text-xs text-muted-foreground hover:text-foreground underline">
          {p.is_published ? 'Unpublish' : 'Publish'}
        </button>
        <button onClick={() => openEdit(p)} className="text-muted-foreground hover:text-foreground"><Pencil className="h-4 w-4" /></button>
        <button onClick={() => setDeleteId(p.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
      </div>
    ),
  }));

  return (
    <>
      <AdminTable
        title="Products"
        description="Manage your product catalog."
        searchPlaceholder="Search products..."
        addLabel="New Product"
        onAdd={openAdd}
        onSearch={search}
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'category', label: 'Category' },
          { key: 'availability', label: 'Availability' },
          { key: 'status', label: 'Status' },
          { key: 'actions', label: '' },
        ]}
        rows={loading ? [] : rows}
        emptyMessage={loading ? 'Loading…' : 'No products yet.'}
        emptyDescription="Add products to showcase them on your website."
      />

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit Product' : 'New Product'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Product name" />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={form.slug} onChange={(e) => set('slug', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="SaaS, Mobile App, etc." />
            </div>
            <div className="space-y-2">
              <Label>Availability</Label>
              <select
                value={form.availability}
                onChange={(e) => set('availability', e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
              >
                <option value="coming_soon">Coming Soon</option>
                <option value="in-development">In Development</option>
                <option value="available">Available</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Short Description</Label>
              <Textarea value={form.description} onChange={(e) => set('description', e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Full Description</Label>
              <Textarea className="min-h-24" value={form.long_description} onChange={(e) => set('long_description', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Pricing Info</Label>
              <Input value={form.pricing_info} onChange={(e) => set('pricing_info', e.target.value)} placeholder="Free, $9/mo, etc." />
            </div>
            <div className="space-y-2">
              <Label>Website URL</Label>
              <Input value={form.website_url} onChange={(e) => set('website_url', e.target.value)} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>Download URL</Label>
              <Input value={form.download_url} onChange={(e) => set('download_url', e.target.value)} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>Documentation URL</Label>
              <Input value={form.documentation_url} onChange={(e) => set('documentation_url', e.target.value)} placeholder="https://..." />
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving || !form.name}>
              {saving && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
              {editId ? 'Save Changes' : 'Create Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this product?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteProduct} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
