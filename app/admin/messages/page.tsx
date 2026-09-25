'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AdminTable, StatusBadge } from '@/components/admin/admin-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Mail } from 'lucide-react';
import { format } from 'date-fns';

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  budget: string;
  message: string;
  status: string;
  is_read: boolean;
  created_at: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filtered, setFiltered] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    const list = (data ?? []) as Message[];
    setMessages(list);
    setFiltered(list);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function open(m: Message) {
    setSelected(m);
    if (!m.is_read) {
      await supabase.from('contact_messages').update({ is_read: true, status: m.status === 'new' ? 'read' : m.status }).eq('id', m.id);
      load();
    }
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('contact_messages').update({ status }).eq('id', id);
    setSelected((prev) => prev ? { ...prev, status } : prev);
    load();
  }

  function search(q: string) {
    const lower = q.toLowerCase();
    setFiltered(messages.filter((m) =>
      m.name.toLowerCase().includes(lower) ||
      m.email.toLowerCase().includes(lower) ||
      (m.company ?? '').toLowerCase().includes(lower)
    ));
  }

  const rows = filtered.map((m) => ({
    name: (
      <span className={`font-medium ${!m.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>
        {!m.is_read && <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-blue-500" />}
        {m.name}
      </span>
    ),
    email: m.email,
    company: m.company || <span className="text-muted-foreground">—</span>,
    status: <StatusBadge status={m.status} />,
    date: format(new Date(m.created_at), 'MMM d, yyyy'),
    actions: (
      <button onClick={() => open(m)} className="text-muted-foreground hover:text-foreground">
        <Eye className="h-4 w-4" />
      </button>
    ),
  }));

  return (
    <>
      <AdminTable
        title="Contact Messages"
        description="Messages submitted through your contact form."
        searchPlaceholder="Search messages..."
        onSearch={search}
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'company', label: 'Company' },
          { key: 'status', label: 'Status' },
          { key: 'date', label: 'Received' },
          { key: 'actions', label: '' },
        ]}
        rows={loading ? [] : rows}
        emptyMessage={loading ? 'Loading…' : 'No messages yet.'}
        emptyDescription="Contact form submissions will appear here."
      />

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        {selected && (
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Message from {selected.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3 rounded-lg border border-border p-4">
                <div><p className="text-xs text-muted-foreground">Email</p><p>{selected.email}</p></div>
                {selected.phone && <div><p className="text-xs text-muted-foreground">Phone</p><p>{selected.phone}</p></div>}
                {selected.company && <div><p className="text-xs text-muted-foreground">Company</p><p>{selected.company}</p></div>}
                {selected.service && <div><p className="text-xs text-muted-foreground">Service</p><p>{selected.service}</p></div>}
                {selected.budget && <div><p className="text-xs text-muted-foreground">Budget</p><p>{selected.budget}</p></div>}
                <div><p className="text-xs text-muted-foreground">Received</p><p>{format(new Date(selected.created_at), 'MMM d, yyyy HH:mm')}</p></div>
              </div>
              <div>
                <p className="mb-1 text-xs text-muted-foreground">Message</p>
                <p className="whitespace-pre-wrap rounded-lg border border-border p-3">{selected.message}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <p className="w-full text-xs text-muted-foreground">Update status:</p>
                {['new', 'read', 'contacted', 'archived'].map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={selected.status === s ? 'default' : 'outline'}
                    onClick={() => updateStatus(selected.id, s)}
                    className="capitalize"
                  >
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
