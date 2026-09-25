'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Briefcase,
  Boxes,
  Package,
  Mail,
  ClipboardList,
  Users,
  UsersRound,
  TrendingUp,
  ArrowUpRight,
  Loader2,
  type LucideIcon,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/admin/admin-table';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

// ---------------------------------------------------------------------------
// Stat cards config
// ---------------------------------------------------------------------------
const STAT_CONFIG = [
  { label: 'Contact Messages',  table: 'contact_messages',       href: '/admin/messages',     icon: Mail,          color: 'text-blue-500'   },
  { label: 'Quote Requests',    table: 'quote_requests',          href: '/admin/quotes',       icon: ClipboardList, color: 'text-cyan-500'   },
  { label: 'Services',          table: 'services',                href: '/admin/services',     icon: Briefcase,     color: 'text-green-500'  },
  { label: 'Projects',          table: 'projects',                href: '/admin/projects',     icon: Boxes,         color: 'text-purple-500' },
  { label: 'Products',          table: 'products',                href: '/admin/products',     icon: Package,       color: 'text-orange-500' },
  { label: 'Blog Posts',        table: 'blog_posts',              href: '/admin/blog',         icon: FileText,      color: 'text-pink-500'   },
  { label: 'Newsletter',        table: 'newsletter_subscribers',  href: '/admin/newsletter',   icon: Users,         color: 'text-teal-500'   },
  { label: 'Job Applications',  table: 'job_applications',        href: '/admin/applications', icon: UsersRound,    color: 'text-indigo-500' },
] as const;

type TableName = typeof STAT_CONFIG[number]['table'];

// ---------------------------------------------------------------------------
// Types for recent panels
// ---------------------------------------------------------------------------
interface RecentMessage {
  id: string;
  name: string;
  email: string;
  company: string;
  status: string;
  is_read: boolean;
  created_at: string;
}

interface RecentQuote {
  id: string;
  name: string;
  company_name: string;
  project_type: string;
  budget_range: string;
  status: string;
  is_read: boolean;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function AdminDashboard() {
  const [counts, setCounts] = useState<Record<TableName, number | null>>(
    Object.fromEntries(STAT_CONFIG.map((s) => [s.table, null])) as Record<TableName, number | null>
  );
  const [messages, setMessages] = useState<RecentMessage[]>([]);
  const [quotes, setQuotes] = useState<RecentQuote[]>([]);
  const [recentLoading, setRecentLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchAll() {
      try {
        // Counts + recent data in parallel
        const [countResults, messagesRes, quotesRes] = await Promise.all([
          Promise.all(
            STAT_CONFIG.map(({ table }) =>
              supabase.from(table).select('*', { count: 'exact', head: true })
            )
          ),
          supabase
            .from('contact_messages')
            .select('id, name, email, company, status, is_read, created_at')
            .order('created_at', { ascending: false })
            .limit(5),
          supabase
            .from('quote_requests')
            .select('id, name, company_name, project_type, budget_range, status, is_read, created_at')
            .order('created_at', { ascending: false })
            .limit(5),
        ]);

        // Update counts
        const updated = { ...counts };
        countResults.forEach((res, i) => {
          const table = STAT_CONFIG[i].table;
          updated[table] = res.error ? -1 : (res.count ?? 0);
        });
        setCounts(updated);

        // Update recent panels
        setMessages((messagesRes.data ?? []) as RecentMessage[]);
        setQuotes((quotesRes.data ?? []) as RecentQuote[]);
      } catch {
        setError(true);
      } finally {
        setRecentLoading(false);
      }
    }

    fetchAll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function formatCount(value: number | null): React.ReactNode {
    if (value === null) return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />;
    if (value === -1) return <span className="text-destructive text-sm">Error</span>;
    return value.toLocaleString();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your website activity and content.
        </p>
      </div>

      {error && (
        <p className="text-sm text-destructive">
          Could not reach the database. Check your Supabase environment variables.
        </p>
      )}

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CONFIG.map((stat) => {
          const value = counts[stat.table];
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="group flex items-center justify-between p-5 transition-colors hover:border-accent/50">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                  <p className="mt-2 font-heading text-2xl font-bold">{formatCount(value)}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Recent activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Messages */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold">Recent Messages</h2>
            <Link href="/admin/messages" className="flex items-center text-xs text-accent hover:underline">
              View all <ArrowUpRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
          <div className="mt-4 space-y-2">
            {recentLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : messages.length === 0 ? (
              <div className="rounded-lg border border-dashed p-4 text-center">
                <p className="text-sm text-muted-foreground">No messages yet.</p>
                <p className="mt-1 text-xs text-muted-foreground">Contact form submissions will appear here.</p>
              </div>
            ) : (
              messages.map((m) => (
                <Link key={m.id} href="/admin/messages">
                  <div className="flex items-center justify-between rounded-lg border border-border/50 px-4 py-3 transition-colors hover:bg-muted/40">
                    <div className="flex items-center gap-2 min-w-0">
                      {!m.is_read && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{m.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{m.email}</p>
                      </div>
                    </div>
                    <div className="ml-3 flex shrink-0 flex-col items-end gap-1">
                      <StatusBadge status={m.status} />
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(m.created_at), 'MMM d')}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </Card>

        {/* Recent Quote Requests */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold">Recent Quote Requests</h2>
            <Link href="/admin/quotes" className="flex items-center text-xs text-accent hover:underline">
              View all <ArrowUpRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
          <div className="mt-4 space-y-2">
            {recentLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : quotes.length === 0 ? (
              <div className="rounded-lg border border-dashed p-4 text-center">
                <p className="text-sm text-muted-foreground">No quote requests yet.</p>
                <p className="mt-1 text-xs text-muted-foreground">Project inquiries will appear here.</p>
              </div>
            ) : (
              quotes.map((q) => (
                <Link key={q.id} href="/admin/quotes">
                  <div className="flex items-center justify-between rounded-lg border border-border/50 px-4 py-3 transition-colors hover:bg-muted/40">
                    <div className="flex items-center gap-2 min-w-0">
                      {!q.is_read && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-cyan-500" />
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{q.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {q.company_name || q.project_type || 'No details'}
                        </p>
                      </div>
                    </div>
                    <div className="ml-3 flex shrink-0 flex-col items-end gap-1">
                      <StatusBadge status={q.status} />
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(q.created_at), 'MMM d')}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <Card className="p-6">
        <h2 className="font-heading text-lg font-semibold">Quick Actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin/blog/new" className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">
            <FileText className="h-4 w-4" /> New Blog Post
          </Link>
          <Link href="/admin/services" className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">
            <Briefcase className="h-4 w-4" /> Manage Services
          </Link>
          <Link href="/admin/projects" className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">
            <Boxes className="h-4 w-4" /> Add Project
          </Link>
          <Link href="/admin/settings" className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">
            <TrendingUp className="h-4 w-4" /> Site Settings
          </Link>
        </div>
      </Card>
    </div>
  );
}
