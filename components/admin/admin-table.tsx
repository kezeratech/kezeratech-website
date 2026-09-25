'use client';

import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, type LucideIcon } from 'lucide-react';

interface AdminTableProps {
  title: string;
  description?: string;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  onAdd?: () => void;
  addLabel?: string;
  columns: { key: string; label: string; className?: string }[];
  rows: Record<string, ReactNode>[];
  emptyMessage?: string;
  emptyDescription?: string;
  actions?: (row: Record<string, unknown>) => ReactNode;
}

export function AdminTable({
  title,
  description,
  searchPlaceholder = 'Search...',
  onSearch,
  onAdd,
  addLabel = 'Add New',
  columns,
  rows,
  emptyMessage = 'No items found.',
  emptyDescription = 'Items will appear here once they are created.',
}: AdminTableProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {onSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                onChange={(e) => onSearch(e.target.value)}
                className="h-9 w-48 pl-10 md:w-64"
              />
            </div>
          )}
          {onAdd && (
            <Button onClick={onAdd} size="sm">
              <Plus className="mr-1.5 h-4 w-4" />
              {addLabel}
            </Button>
          )}
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground ${col.className ?? ''}`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-12 text-center">
                    <p className="text-sm font-medium">{emptyMessage}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{emptyDescription}</p>
                  </td>
                </tr>
              ) : (
                rows.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-border/50 transition-colors hover:bg-muted/30"
                  >
                    {columns.map((col) => (
                      <td key={col.key} className={`px-4 py-3 text-sm ${col.className ?? ''}`}>
                        {row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const colors: Record<string, string> = {
    published: 'bg-green-500/10 text-green-600 border-green-500/20',
    draft: 'bg-muted text-muted-foreground border-border',
    new: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    contacted: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
    'in-discussion': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    'proposal-sent': 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    won: 'bg-green-500/10 text-green-600 border-green-500/20',
    lost: 'bg-red-500/10 text-red-600 border-red-500/20',
    archived: 'bg-muted text-muted-foreground border-border',
    open: 'bg-green-500/10 text-green-600 border-green-500/20',
    closed: 'bg-red-500/10 text-red-600 border-red-500/20',
    coming_soon: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
    'in-development': 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    available: 'bg-green-500/10 text-green-600 border-green-500/20',
  };

  const className = colors[status] || colors.draft;

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${className}`}>
      {status.replace(/-/g, ' ')}
    </span>
  );
}
