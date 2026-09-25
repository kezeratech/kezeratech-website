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

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  is_published: boolean;
}

const EMPTY: Omit<FAQ, 'id'> = {
  question: '', answer: '', category: '', sort_order: 0, is_published: false,
};

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [filtered, setFiltered] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<FAQ, 'id'>>(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('faqs').select('*').order('sort_order');
    const list = (data ?? []) as FAQ[];
    setFaqs(list);
    setFiltered(list);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() { setForm(EMPTY); setEditId(null); setModalOpen(true); }
  function openEdit(f: FAQ) { const { id, ...rest } = f; setForm(rest); setEditId(id); setModalOpen(true); }

  function set(field: keyof typeof EMPTY, value: string | boolean | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function save() {
    setSaving(true);
    if (editId) {
      await supabase.from('faqs').update(form).eq('id', editId);
    } else {
      await supabase.from('faqs').insert(form);
    }
    setSaving(false);
    setModalOpen(false);
    load();
  }

  async function deleteFaq() {
    if (!deleteId) return;
    await supabase.from('faqs').delete().eq('id', deleteId);
    setDeleteId(null);
    load();
  }

  async function togglePublish(f: FAQ) {
    await supabase.from('faqs').update({ is_published: !f.is_published }).eq('id', f.id);
    load();
  }

  function search(q: string) {
    const lower = q.toLowerCase();
    setFiltered(faqs.filter((f) => f.question.toLowerCase().includes(lower)));
  }

  const rows = filtered.map((f) => ({
    question: <span className="font-medium line-clamp-1">{f.question}</span>,
    category: f.category || <span className="text-muted-foreground">—</span>,
    status: <StatusBadge status={f.is_published ? 'published' : 'draft'} />,
    order: f.sort_order,
    actions: (
      <div className="flex items-center gap-2">
        <button onClick={() => togglePublish(f)} className="text-xs text-muted-foreground hover:text-foreground underline">
          {f.is_published ? 'Unpublish' : 'Publish'}
        </button>
        <button onClick={() => openEdit(f)} className="text-muted-foreground hover:text-foreground"><Pencil className="h-4 w-4" /></button>
        <button onClick={() => setDeleteId(f.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
      </div>
    ),
  }));

  return (
    <>
      <AdminTable
        title="FAQs"
        description="Manage frequently asked questions."
        addLabel="New FAQ"
        onAdd={openAdd}
        onSearch={search}
        columns={[
          { key: 'question', label: 'Question' },
          { key: 'category', label: 'Category' },
          { key: 'status', label: 'Status' },
          { key: 'order', label: 'Order' },
          { key: 'actions', label: '' },
        ]}
        rows={loading ? [] : rows}
        emptyMessage={loading ? 'Loading…' : 'No FAQs yet.'}
        emptyDescription="Add frequently asked questions to help visitors."
      />

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit FAQ' : 'New FAQ'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Question *</Label>
              <Input value={form.question} onChange={(e) => set('question', e.target.value)} placeholder="Frequently asked question…" />
            </div>
            <div className="space-y-2">
              <Label>Answer *</Label>
              <Textarea className="min-h-28" value={form.answer} onChange={(e) => set('answer', e.target.value)} placeholder="Your answer…" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Input value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="General, Pricing…" />
              </div>
              <div className="space-y-2">
                <Label>Sort Order</Label>
                <Input type="number" value={form.sort_order} onChange={(e) => set('sort_order', Number(e.target.value))} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_published} onCheckedChange={(v) => set('is_published', v)} id="pub" />
              <Label htmlFor="pub">Published</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving || !form.question || !form.answer}>
              {saving && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
              {editId ? 'Save Changes' : 'Create FAQ'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this FAQ?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteFaq} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
