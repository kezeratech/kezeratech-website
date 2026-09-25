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
import { Loader2, Pencil, Trash2, Eye } from 'lucide-react';

interface Advertisement {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
  cta_label: string;
  cta_href: string;
  badge_text: string;
  bg_color: string;
  is_active: boolean;
  sort_order: number;
  starts_at: string;
  ends_at: string;
}

const EMPTY: Omit<Advertisement, 'id'> = {
  title: '',
  subtitle: '',
  description: '',
  image_url: '',
  cta_label: '',
  cta_href: '',
  badge_text: '',
  bg_color: 'from-accent/20 to-primary/20',
  is_active: false,
  sort_order: 0,
  starts_at: '',
  ends_at: '',
};

const BG_PRESETS = [
  { label: 'Blue Accent',    value: 'from-accent/20 to-primary/20' },
  { label: 'Purple',         value: 'from-purple-500/20 to-pink-500/20' },
  { label: 'Green',          value: 'from-green-500/20 to-emerald-500/20' },
  { label: 'Orange',         value: 'from-orange-500/20 to-yellow-500/20' },
  { label: 'Red',            value: 'from-red-500/20 to-rose-500/20' },
  { label: 'Teal',           value: 'from-teal-500/20 to-cyan-500/20' },
  { label: 'Dark Solid',     value: 'from-card to-muted' },
];

export default function AdminAdvertisementsPage() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [filtered, setFiltered] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Advertisement, 'id'>>(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('advertisements')
      .select('*')
      .order('sort_order');
    const list = (data ?? []) as Advertisement[];
    setAds(list);
    setFiltered(list);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() { setForm(EMPTY); setEditId(null); setModalOpen(true); }
  function openEdit(a: Advertisement) {
    const { id, ...rest } = a;
    setForm({
      ...rest,
      starts_at: rest.starts_at ? rest.starts_at.slice(0, 16) : '',
      ends_at: rest.ends_at ? rest.ends_at.slice(0, 16) : '',
    });
    setEditId(id);
    setModalOpen(true);
  }

  function set(field: keyof typeof EMPTY, value: string | boolean | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function save() {
    setSaving(true);
    const payload = {
      ...form,
      starts_at: form.starts_at || null,
      ends_at: form.ends_at || null,
    };
    if (editId) {
      await supabase.from('advertisements').update(payload).eq('id', editId);
    } else {
      await supabase.from('advertisements').insert(payload);
    }
    setSaving(false);
    setModalOpen(false);
    load();
  }

  async function deleteAd() {
    if (!deleteId) return;
    await supabase.from('advertisements').delete().eq('id', deleteId);
    setDeleteId(null);
    load();
  }

  async function toggleActive(a: Advertisement) {
    await supabase.from('advertisements').update({ is_active: !a.is_active }).eq('id', a.id);
    load();
  }

  function search(q: string) {
    const lower = q.toLowerCase();
    setFiltered(ads.filter((a) => a.title.toLowerCase().includes(lower)));
  }

  const rows = filtered.map((a) => ({
    preview: (
      <div className={`flex h-10 w-24 items-center justify-center rounded-lg bg-gradient-to-r ${a.bg_color} text-xs font-medium`}>
        {a.badge_text || 'Ad'}
      </div>
    ),
    title: (
      <div>
        <p className="font-medium">{a.title}</p>
        {a.subtitle && <p className="text-xs text-muted-foreground">{a.subtitle}</p>}
      </div>
    ),
    cta: a.cta_label
      ? <span className="text-xs text-accent">{a.cta_label} → {a.cta_href}</span>
      : <span className="text-muted-foreground">—</span>,
    status: <StatusBadge status={a.is_active ? 'published' : 'draft'} />,
    order: a.sort_order,
    actions: (
      <div className="flex items-center gap-2">
        <button onClick={() => toggleActive(a)} className="text-xs text-muted-foreground hover:text-foreground underline">
          {a.is_active ? 'Deactivate' : 'Activate'}
        </button>
        <button onClick={() => openEdit(a)} className="text-muted-foreground hover:text-foreground">
          <Pencil className="h-4 w-4" />
        </button>
        <button onClick={() => setDeleteId(a.id)} className="text-muted-foreground hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    ),
  }));

  return (
    <>
      <AdminTable
        title="Advertisements"
        description="Manage promotional banners displayed on the homepage."
        searchPlaceholder="Search advertisements..."
        addLabel="New Advertisement"
        onAdd={openAdd}
        onSearch={search}
        columns={[
          { key: 'preview', label: 'Preview' },
          { key: 'title', label: 'Title' },
          { key: 'cta', label: 'CTA' },
          { key: 'status', label: 'Status' },
          { key: 'order', label: 'Order' },
          { key: 'actions', label: '' },
        ]}
        rows={loading ? [] : rows}
        emptyMessage={loading ? 'Loading…' : 'No advertisements yet.'}
        emptyDescription="Create advertisements to display promotional banners on your homepage."
      />

      {/* Add / Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit Advertisement' : 'New Advertisement'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Special Launch Offer" />
            </div>
            <div className="space-y-2">
              <Label>Subtitle</Label>
              <Input value={form.subtitle} onChange={(e) => set('subtitle', e.target.value)} placeholder="Short tagline under the title" />
            </div>
            <div className="space-y-2">
              <Label>Badge Text</Label>
              <Input value={form.badge_text} onChange={(e) => set('badge_text', e.target.value)} placeholder="e.g. NEW, LIMITED, 50% OFF" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Short promotional message shown to visitors…" className="min-h-20" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Image URL</Label>
              <Input value={form.image_url} onChange={(e) => set('image_url', e.target.value)} placeholder="https://… (upload in Media Library first)" />
              <p className="text-xs text-muted-foreground">Upload image in Admin → Media, copy the URL and paste it here.</p>
            </div>
            <div className="space-y-2">
              <Label>CTA Button Label</Label>
              <Input value={form.cta_label} onChange={(e) => set('cta_label', e.target.value)} placeholder="e.g. Learn More, Get Started" />
            </div>
            <div className="space-y-2">
              <Label>CTA Button Link</Label>
              <Input value={form.cta_href} onChange={(e) => set('cta_href', e.target.value)} placeholder="/request-a-quote or https://..." />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Background Color</Label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {BG_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => set('bg_color', preset.value)}
                    className={`flex h-10 items-center justify-center rounded-lg bg-gradient-to-r ${preset.value} text-xs font-medium border-2 transition-all ${form.bg_color === preset.value ? 'border-accent' : 'border-transparent'}`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Start Date (optional)</Label>
              <Input type="datetime-local" value={form.starts_at} onChange={(e) => set('starts_at', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>End Date (optional)</Label>
              <Input type="datetime-local" value={form.ends_at} onChange={(e) => set('ends_at', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Sort Order</Label>
              <Input type="number" value={form.sort_order} onChange={(e) => set('sort_order', Number(e.target.value))} />
            </div>
            <div className="flex items-center gap-3 self-end pb-1">
              <Switch checked={form.is_active} onCheckedChange={(v) => set('is_active', v)} id="active" />
              <Label htmlFor="active">Active (visible on homepage)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving || !form.title}>
              {saving && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
              {editId ? 'Save Changes' : 'Create Advertisement'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this advertisement?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteAd} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
