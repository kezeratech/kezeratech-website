'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AdminTable, StatusBadge } from '@/components/admin/admin-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Eye, Mail } from 'lucide-react';
import { format } from 'date-fns';

interface Quote {
  id: string;
  name: string;
  email: string;
  phone: string;
  company_name: string;
  industry: string;
  website: string;
  project_type: string;
  description: string;
  goals: string;
  desired_features: string;
  budget_range: string;
  expected_timeline: string;
  status: string;
  internal_notes: string;
  is_read: boolean;
  created_at: string;
}

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filtered, setFiltered] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Quote | null>(null);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('quote_requests')
      .select('*')
      .order('created_at', { ascending: false });
    const list = (data ?? []) as Quote[];
    setQuotes(list);
    setFiltered(list);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function open(q: Quote) {
    setSelected(q);
    setNotes(q.internal_notes ?? '');
    if (!q.is_read) {
      await supabase.from('quote_requests').update({ is_read: true, status: q.status === 'new' ? 'read' : q.status }).eq('id', q.id);
      load();
    }
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('quote_requests').update({ status }).eq('id', id);
    setSelected((prev) => prev ? { ...prev, status } : prev);
    load();
  }

  async function saveNotes() {
    if (!selected) return;
    setSavingNotes(true);
    await supabase.from('quote_requests').update({ internal_notes: notes }).eq('id', selected.id);
    setSavingNotes(false);
    setSelected((prev) => prev ? { ...prev, internal_notes: notes } : prev);
  }

  function search(q: string) {
    const lower = q.toLowerCase();
    setFiltered(quotes.filter((r) =>
      r.name.toLowerCase().includes(lower) ||
      (r.company_name ?? '').toLowerCase().includes(lower)
    ));
  }

  const rows = filtered.map((q) => ({
    name: (
      <span className={`font-medium ${!q.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>
        {!q.is_read && <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-cyan-500" />}
        {q.name}
      </span>
    ),
    company: q.company_name || <span className="text-muted-foreground">—</span>,
    projectType: q.project_type || <span className="text-muted-foreground">—</span>,
    budget: q.budget_range || <span className="text-muted-foreground">—</span>,
    status: <StatusBadge status={q.status} />,
    actions: (
      <button onClick={() => open(q)} className="text-muted-foreground hover:text-foreground">
        <Eye className="h-4 w-4" />
      </button>
    ),
  }));

  return (
    <>
      <AdminTable
        title="Quote Requests"
        description="Project inquiries submitted through the quote form."
        searchPlaceholder="Search quote requests..."
        onSearch={search}
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'company', label: 'Company' },
          { key: 'projectType', label: 'Project Type' },
          { key: 'budget', label: 'Budget' },
          { key: 'status', label: 'Status' },
          { key: 'actions', label: '' },
        ]}
        rows={loading ? [] : rows}
        emptyMessage={loading ? 'Loading…' : 'No quote requests yet.'}
        emptyDescription="Project inquiries will appear here."
      />

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        {selected && (
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Quote Request — {selected.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3 rounded-lg border border-border p-4">
                <div><p className="text-xs text-muted-foreground">Email</p><p>{selected.email}</p></div>
                {selected.phone && <div><p className="text-xs text-muted-foreground">Phone</p><p>{selected.phone}</p></div>}
                {selected.company_name && <div><p className="text-xs text-muted-foreground">Company</p><p>{selected.company_name}</p></div>}
                {selected.industry && <div><p className="text-xs text-muted-foreground">Industry</p><p>{selected.industry}</p></div>}
                {selected.project_type && <div><p className="text-xs text-muted-foreground">Project Type</p><p>{selected.project_type}</p></div>}
                {selected.budget_range && <div><p className="text-xs text-muted-foreground">Budget</p><p>{selected.budget_range}</p></div>}
                {selected.expected_timeline && <div><p className="text-xs text-muted-foreground">Timeline</p><p>{selected.expected_timeline}</p></div>}
                {selected.website && <div><p className="text-xs text-muted-foreground">Website</p><p>{selected.website}</p></div>}
                <div><p className="text-xs text-muted-foreground">Submitted</p><p>{format(new Date(selected.created_at), 'MMM d, yyyy HH:mm')}</p></div>
              </div>
              {selected.description && (
                <div><p className="mb-1 text-xs text-muted-foreground">Description</p>
                  <p className="whitespace-pre-wrap rounded-lg border border-border p-3">{selected.description}</p>
                </div>
              )}
              {selected.goals && (
                <div><p className="mb-1 text-xs text-muted-foreground">Goals</p>
                  <p className="whitespace-pre-wrap rounded-lg border border-border p-3">{selected.goals}</p>
                </div>
              )}
              {selected.desired_features && (
                <div><p className="mb-1 text-xs text-muted-foreground">Desired Features</p>
                  <p className="whitespace-pre-wrap rounded-lg border border-border p-3">{selected.desired_features}</p>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                <p className="w-full text-xs text-muted-foreground">Update status:</p>
                {['new', 'contacted', 'in-discussion', 'proposal-sent', 'won', 'lost', 'archived'].map((s) => (
                  <Button key={s} size="sm" variant={selected.status === s ? 'default' : 'outline'} onClick={() => updateStatus(selected.id, s)} className="capitalize text-xs">
                    {s.replace(/-/g, ' ')}
                  </Button>
                ))}
              </div>
              <div className="space-y-2">
                <Label>Internal Notes</Label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add private notes about this lead…" />
                <Button size="sm" onClick={saveNotes} disabled={savingNotes}>
                  {savingNotes ? 'Saving…' : 'Save Notes'}
                </Button>
              </div>
              <a href={`mailto:${selected.email}`} className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline">
                <Mail className="h-3.5 w-3.5" /> Reply via email
              </a>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
