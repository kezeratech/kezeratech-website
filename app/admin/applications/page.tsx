'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AdminTable, StatusBadge } from '@/components/admin/admin-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye, Mail, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

interface Application {
  id: string;
  name: string;
  email: string;
  phone: string;
  cv_url: string;
  portfolio_url: string;
  linkedin_url: string;
  cover_letter: string;
  status: string;
  is_read: boolean;
  created_at: string;
  job_position_id: string | null;
  job_positions?: { title: string } | null;
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filtered, setFiltered] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Application | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('job_applications')
      .select('*, job_positions(title)')
      .order('created_at', { ascending: false });
    const list = (data ?? []) as Application[];
    setApplications(list);
    setFiltered(list);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function open(a: Application) {
    setSelected(a);
    if (!a.is_read) {
      await supabase.from('job_applications').update({ is_read: true, status: a.status === 'new' ? 'reviewing' : a.status }).eq('id', a.id);
      load();
    }
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('job_applications').update({ status }).eq('id', id);
    setSelected((prev) => prev ? { ...prev, status } : prev);
    load();
  }

  function search(q: string) {
    const lower = q.toLowerCase();
    setFiltered(applications.filter((a) =>
      a.name.toLowerCase().includes(lower) || a.email.toLowerCase().includes(lower)
    ));
  }

  const rows = filtered.map((a) => ({
    name: (
      <span className={`font-medium ${!a.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>
        {!a.is_read && <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-indigo-500" />}
        {a.name}
      </span>
    ),
    position: a.job_positions?.title || <span className="text-muted-foreground">—</span>,
    email: a.email,
    status: <StatusBadge status={a.status} />,
    date: format(new Date(a.created_at), 'MMM d, yyyy'),
    actions: (
      <button onClick={() => open(a)} className="text-muted-foreground hover:text-foreground">
        <Eye className="h-4 w-4" />
      </button>
    ),
  }));

  return (
    <>
      <AdminTable
        title="Job Applications"
        description="Applications submitted through your careers page."
        searchPlaceholder="Search applications..."
        onSearch={search}
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'position', label: 'Position' },
          { key: 'email', label: 'Email' },
          { key: 'status', label: 'Status' },
          { key: 'date', label: 'Applied' },
          { key: 'actions', label: '' },
        ]}
        rows={loading ? [] : rows}
        emptyMessage={loading ? 'Loading…' : 'No applications yet.'}
        emptyDescription="Job applications will appear here when candidates apply."
      />

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        {selected && (
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Application — {selected.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3 rounded-lg border border-border p-4">
                <div><p className="text-xs text-muted-foreground">Email</p><p>{selected.email}</p></div>
                {selected.phone && <div><p className="text-xs text-muted-foreground">Phone</p><p>{selected.phone}</p></div>}
                {selected.job_positions?.title && <div><p className="text-xs text-muted-foreground">Position</p><p>{selected.job_positions.title}</p></div>}
                <div><p className="text-xs text-muted-foreground">Applied</p><p>{format(new Date(selected.created_at), 'MMM d, yyyy')}</p></div>
              </div>
              <div className="flex flex-wrap gap-2">
                {selected.cv_url && (
                  <a href={selected.cv_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-muted">
                    <ExternalLink className="h-3.5 w-3.5" /> View CV
                  </a>
                )}
                {selected.portfolio_url && (
                  <a href={selected.portfolio_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-muted">
                    <ExternalLink className="h-3.5 w-3.5" /> Portfolio
                  </a>
                )}
                {selected.linkedin_url && (
                  <a href={selected.linkedin_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-muted">
                    <ExternalLink className="h-3.5 w-3.5" /> LinkedIn
                  </a>
                )}
              </div>
              {selected.cover_letter && (
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">Cover Letter</p>
                  <p className="whitespace-pre-wrap rounded-lg border border-border p-3">{selected.cover_letter}</p>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                <p className="w-full text-xs text-muted-foreground">Update status:</p>
                {['new', 'reviewing', 'shortlisted', 'interviewed', 'hired', 'rejected'].map((s) => (
                  <Button key={s} size="sm" variant={selected.status === s ? 'default' : 'outline'} onClick={() => updateStatus(selected.id, s)} className="capitalize text-xs">
                    {s}
                  </Button>
                ))}
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
