'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Users, Mail, Download, Search, Loader2 } from 'lucide-react';
import { format, startOfMonth } from 'date-fns';

interface Subscriber {
  id: string;
  email: string;
  name: string;
  is_active: boolean;
  created_at: string;
}

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [filtered, setFiltered] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('created_at', { ascending: false });
    const list = (data ?? []) as Subscriber[];
    setSubscribers(list);
    setFiltered(list);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function search(q: string) {
    setQuery(q);
    const lower = q.toLowerCase();
    setFiltered(subscribers.filter((s) =>
      s.email.toLowerCase().includes(lower) || (s.name ?? '').toLowerCase().includes(lower)
    ));
  }

  async function toggleActive(s: Subscriber) {
    await supabase.from('newsletter_subscribers').update({ is_active: !s.is_active }).eq('id', s.id);
    load();
  }

  function exportCSV() {
    const header = 'Email,Name,Active,Subscribed\n';
    const rows = subscribers.map((s) =>
      `${s.email},${s.name ?? ''},${s.is_active},${format(new Date(s.created_at), 'yyyy-MM-dd')}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter-subscribers.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  const total = subscribers.length;
  const active = subscribers.filter((s) => s.is_active).length;
  const thisMonth = subscribers.filter((s) => new Date(s.created_at) >= startOfMonth(new Date())).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Newsletter</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your newsletter subscribers.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Total Subscribers</p>
              <p className="mt-2 font-heading text-3xl font-bold">{loading ? '—' : total}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Users className="h-5 w-5 text-teal-500" />
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Active</p>
              <p className="mt-2 font-heading text-3xl font-bold">{loading ? '—' : active}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Mail className="h-5 w-5 text-blue-500" />
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">This Month</p>
              <p className="mt-2 font-heading text-3xl font-bold">{loading ? '—' : thisMonth}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Users className="h-5 w-5 text-green-500" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-border p-4">
          <h2 className="font-heading text-lg font-semibold">Subscriber List</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search…"
                value={query}
                onChange={(e) => search(e.target.value)}
                className="h-9 w-48 pl-10"
              />
            </div>
            <Button variant="outline" size="sm" onClick={exportCSV} disabled={loading || total === 0}>
              <Download className="mr-1.5 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <p className="text-sm font-medium">No subscribers yet.</p>
            <p className="mt-1 text-xs text-muted-foreground">Newsletter signups from your website will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subscribed</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="px-4 py-3 text-sm">{s.email}</td>
                    <td className="px-4 py-3 text-sm">{s.name || <span className="text-muted-foreground">—</span>}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{format(new Date(s.created_at), 'MMM d, yyyy')}</td>
                    <td className="px-4 py-3">
                      <Switch checked={s.is_active} onCheckedChange={() => toggleActive(s)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
