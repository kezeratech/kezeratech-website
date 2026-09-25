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

interface Testimonial {
  id: string;
  client_name: string;
  position: string;
  company: string;
  profile_image_url: string;
  testimonial: string;
  rating: number;
  is_visible: boolean;
  sort_order: number;
}

const EMPTY: Omit<Testimonial, 'id'> = {
  client_name: '',
  position: '',
  company: '',
  profile_image_url: '',
  testimonial: '',
  rating: 5,
  is_visible: false,
  sort_order: 0,
};

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [filtered, setFiltered] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Testimonial, 'id'>>(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .order('sort_order');
    const list = (data ?? []) as Testimonial[];
    setTestimonials(list);
    setFiltered(list);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() { setForm(EMPTY); setEditId(null); setModalOpen(true); }
  function openEdit(t: Testimonial) {
    const { id, ...rest } = t;
    setForm(rest);
    setEditId(id);
    setModalOpen(true);
  }

  function set(field: keyof typeof EMPTY, value: string | boolean | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function save() {
    setSaving(true);
    if (editId) {
      await supabase.from('testimonials').update(form).eq('id', editId);
    } else {
      await supabase.from('testimonials').insert(form);
    }
    setSaving(false);
    setModalOpen(false);
    load();
  }

  async function deleteTestimonial() {
    if (!deleteId) return;
    await supabase.from('testimonials').delete().eq('id', deleteId);
    setDeleteId(null);
    load();
  }

  async function toggleVisible(t: Testimonial) {
    await supabase.from('testimonials').update({ is_visible: !t.is_visible }).eq('id', t.id);
    load();
  }

  function search(q: string) {
    const lower = q.toLowerCase();
    setFiltered(testimonials.filter((t) =>
      t.client_name.toLowerCase().includes(lower) ||
      (t.company ?? '').toLowerCase().includes(lower)
    ));
  }

  // Star rating display
  function Stars({ rating }: { rating: number }) {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
          />
        ))}
      </div>
    );
  }

  const rows = filtered.map((t) => ({
    client: (
      <div className="flex items-center gap-3">
        {t.profile_image_url ? (
          <img src={t.profile_image_url} alt={t.client_name} className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
            {t.client_name[0]?.toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-medium text-sm">{t.client_name}</p>
          {(t.position || t.company) && (
            <p className="text-xs text-muted-foreground">
              {[t.position, t.company].filter(Boolean).join(', ')}
            </p>
          )}
        </div>
      </div>
    ),
    rating: <Stars rating={t.rating} />,
    testimonial: (
      <p className="max-w-xs text-xs text-muted-foreground line-clamp-2">{t.testimonial}</p>
    ),
    status: <StatusBadge status={t.is_visible ? 'published' : 'draft'} />,
    actions: (
      <div className="flex items-center gap-2">
        <button
          onClick={() => toggleVisible(t)}
          className="text-xs text-muted-foreground hover:text-foreground underline"
        >
          {t.is_visible ? 'Hide' : 'Show'}
        </button>
        <button onClick={() => openEdit(t)} className="text-muted-foreground hover:text-foreground">
          <Pencil className="h-4 w-4" />
        </button>
        <button onClick={() => setDeleteId(t.id)} className="text-muted-foreground hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    ),
  }));

  return (
    <>
      <AdminTable
        title="Testimonials"
        description="Manage client testimonials displayed on your website."
        searchPlaceholder="Search by name or company..."
        addLabel="New Testimonial"
        onAdd={openAdd}
        onSearch={search}
        columns={[
          { key: 'client', label: 'Client' },
          { key: 'rating', label: 'Rating' },
          { key: 'testimonial', label: 'Testimonial' },
          { key: 'status', label: 'Visibility' },
          { key: 'actions', label: '' },
        ]}
        rows={loading ? [] : rows}
        emptyMessage={loading ? 'Loading…' : 'No testimonials yet.'}
        emptyDescription="Add client testimonials to build trust with your visitors."
      />

      {/* Add / Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit Testimonial' : 'New Testimonial'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Client Name *</Label>
                <Input
                  value={form.client_name}
                  onChange={(e) => set('client_name', e.target.value)}
                  placeholder="e.g. Abebe Girma"
                />
              </div>
              <div className="space-y-2">
                <Label>Position / Title</Label>
                <Input
                  value={form.position}
                  onChange={(e) => set('position', e.target.value)}
                  placeholder="e.g. CEO"
                />
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                <Input
                  value={form.company}
                  onChange={(e) => set('company', e.target.value)}
                  placeholder="e.g. ABC Company"
                />
              </div>
              <div className="space-y-2">
                <Label>Profile Image URL</Label>
                <Input
                  value={form.profile_image_url}
                  onChange={(e) => set('profile_image_url', e.target.value)}
                  placeholder="https://... (upload in Media first)"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Testimonial *</Label>
              <Textarea
                value={form.testimonial}
                onChange={(e) => set('testimonial', e.target.value)}
                placeholder="What the client said about working with Kezera Tech…"
                className="min-h-28"
              />
            </div>
            <div className="space-y-2">
              <Label>Rating (1–5)</Label>
              <div className="flex items-center gap-3">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => set('rating', n)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 transition-colors ${
                        n <= form.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted-foreground hover:text-yellow-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-sm text-muted-foreground">{form.rating}/5</span>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Sort Order</Label>
                <Input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => set('sort_order', Number(e.target.value))}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={form.is_visible}
                onCheckedChange={(v) => set('is_visible', v)}
                id="visible"
              />
              <Label htmlFor="visible">Visible on website</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving || !form.client_name || !form.testimonial}>
              {saving && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
              {editId ? 'Save Changes' : 'Add Testimonial'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this testimonial?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteTestimonial}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
