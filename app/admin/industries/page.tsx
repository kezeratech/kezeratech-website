'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AdminTable, StatusBadge } from '@/components/admin/admin-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Loader2, Pencil, Trash2 } from 'lucide-react';

interface Industry {
  id: string;
  name: string;
  icon: string;
  description: string;
  sort_order: number;
  is_published: boolean;
}

const EMPTY: Omit<Industry, 'id'> = {
  name: '', icon: '', description: '', sort_order: 0, is_published: false,
};

export default function AdminIndustriesPage() {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [filtered, setFiltered] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Industry, 'id'>>(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('industries').select('*').order('sort_order');
    const list = (data ?? []) as Industry[];
    setIndustries(list);
    setFiltered(list);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() { setForm(EMPTY); setEditId(null); setModalOpen(true); }
  function openEdit(ind: Industry) { const { id, ...rest } = ind; setForm(rest); setEditId(id); setModalOpen(true); }

  function set(field: keyof typeof EMPTY, value: string | boolean | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function save() {
    setSaving(true);
    if (editId) {
      await supabase.from('industries').update(form).eq('id', editId);
    } else {
      await supabase.from('industries').insert(form);
    }
    setSaving(false);
    setModalOpen(false);
    load();
  }

  async function deleteIndustry() {
    if (!deleteId) return;
    await supabase.from('industries').delete().eq('id', deleteId);
    setDeleteId(null);
    load();
  }

  async function togglePublish(ind: Industry) {
    await supabase.from('industries').update({ is_published: !ind.is_published }).eq('id', ind.id);
    load();
  }

  function search(q: string) {
    const lower = q.toLowerCase();
    setFiltered(industries.filter((i) => i.name.toLowerCase().includes(lower)));
  }

  const rows = filtered.map((ind) => ({
    name: <span className="font-medium">{ind.name}</span>,
    icon: ind.icon || <span className="text-muted-foreground">—</span>,
    status: <StatusBadge status={ind.is_published ? 'published' : 'draft'} />,
    order: ind.sort_order,
    actions: (
      <div className="flex items-center gap-2">
        <button onClick={() => togglePublish(ind)} className="text-xs text-muted-foreground hover:text-foreground underline">
          {ind.is_published ? 'Unpublish' : 'Publish'}
        </button>
        <button onClick={() => openEdit(ind)} className="text-muted-foreground hover:text-foreground">
          <Pencil className="h-4 w-4" />
        </button>
        <button onClick={() => setDeleteId(ind.id)} className="text-muted-foreground hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    ),
  }));

  return (
    <>
      <AdminTable
        title="Industries"
        description="Manage the industries displayed on your website."
        searchPlaceholder="Search industries..."
        addLabel="New Industry"
        onAdd={openAdd}
        onSearch={search}
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'icon', label: 'Icon' },
          { key: 'status', label: 'Status' },
          { key: 'order', label: 'Order' },
          { key: 'actions', label: '' },
        ]}
        rows={loading ? [] : rows}
        emptyMessage={loading ? 'Loading…' : 'No industries yet.'}
        emptyDescription="Add industries to show which sectors Kezera Tech serves."
      />

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit Industry' : 'New Industry'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Healthcare, Finance…" />
            </div>
            <div className="space-y-2">
              <Label>Icon (Lucide name or emoji)</Label>
              <Input value={form.icon} onChange={(e) => set('icon', e.target.value)} placeholder="heart-pulse, 💊, building-2…" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Short description…" />
            </div>
            <div className="space-y-2">
              <Label>Sort Order</Label>
              <Input type="number" value={form.sort_order} onChange={(e) => set('sort_order', Number(e.target.value))} />
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
              {editId ? 'Save Changes' : 'Create Industry'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this industry?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteIndustry} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
