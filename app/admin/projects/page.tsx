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

interface Project {
  id: string;
  title: string;
  slug: string;
  client: string;
  industry: string;
  project_type: string;
  description: string;
  challenge: string;
  solution: string;
  result: string;
  project_url: string;
  github_url: string;
  completion_date: string;
  status: string;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
  seo_title: string;
  seo_description: string;
}

const EMPTY: Omit<Project, 'id'> = {
  title: '', slug: '', client: '', industry: '', project_type: '',
  description: '', challenge: '', solution: '', result: '',
  project_url: '', github_url: '', completion_date: '',
  status: 'completed', is_featured: false, is_published: false,
  sort_order: 0, seo_title: '', seo_description: '',
};

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filtered, setFiltered] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Project, 'id'>>(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('projects').select('*').order('sort_order');
    const list = (data ?? []) as Project[];
    setProjects(list);
    setFiltered(list);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() { setForm(EMPTY); setEditId(null); setModalOpen(true); }
  function openEdit(p: Project) { const { id, ...rest } = p; setForm(rest); setEditId(id); setModalOpen(true); }

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
      await supabase.from('projects').update(form).eq('id', editId);
    } else {
      await supabase.from('projects').insert(form);
    }
    setSaving(false);
    setModalOpen(false);
    load();
  }

  async function deleteProject() {
    if (!deleteId) return;
    await supabase.from('projects').delete().eq('id', deleteId);
    setDeleteId(null);
    load();
  }

  async function togglePublish(p: Project) {
    await supabase.from('projects').update({ is_published: !p.is_published }).eq('id', p.id);
    load();
  }

  function search(q: string) {
    const lower = q.toLowerCase();
    setFiltered(projects.filter((p) => p.title.toLowerCase().includes(lower) || (p.client ?? '').toLowerCase().includes(lower)));
  }

  const rows = filtered.map((p) => ({
    title: <span className="font-medium">{p.title}</span>,
    client: p.client || <span className="text-muted-foreground">—</span>,
    status: <StatusBadge status={p.is_published ? 'published' : 'draft'} />,
    featured: p.is_featured ? <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> : <span className="text-muted-foreground">—</span>,
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
        title="Projects"
        description="Manage your portfolio and case studies."
        searchPlaceholder="Search projects..."
        addLabel="New Project"
        onAdd={openAdd}
        onSearch={search}
        columns={[
          { key: 'title', label: 'Title' },
          { key: 'client', label: 'Client' },
          { key: 'status', label: 'Status' },
          { key: 'featured', label: 'Featured' },
          { key: 'actions', label: '' },
        ]}
        rows={loading ? [] : rows}
        emptyMessage={loading ? 'Loading…' : 'No projects yet.'}
        emptyDescription="Add projects to build your portfolio."
      />

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit Project' : 'New Project'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Project name" />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={form.slug} onChange={(e) => set('slug', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Client</Label>
              <Input value={form.client} onChange={(e) => set('client', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Industry</Label>
              <Input value={form.industry} onChange={(e) => set('industry', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Project Type</Label>
              <Input value={form.project_type} onChange={(e) => set('project_type', e.target.value)} placeholder="Web App, Mobile, etc." />
            </div>
            <div className="space-y-2">
              <Label>Completion Date</Label>
              <Input type="date" value={form.completion_date} onChange={(e) => set('completion_date', e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => set('description', e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Challenge</Label>
              <Textarea value={form.challenge} onChange={(e) => set('challenge', e.target.value)} placeholder="What problem were you solving?" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Solution</Label>
              <Textarea value={form.solution} onChange={(e) => set('solution', e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Result</Label>
              <Textarea value={form.result} onChange={(e) => set('result', e.target.value)} placeholder="Measurable outcomes…" />
            </div>
            <div className="space-y-2">
              <Label>Project URL</Label>
              <Input value={form.project_url} onChange={(e) => set('project_url', e.target.value)} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>GitHub URL</Label>
              <Input value={form.github_url} onChange={(e) => set('github_url', e.target.value)} placeholder="https://github.com/..." />
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
              {editId ? 'Save Changes' : 'Create Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this project?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteProject} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
