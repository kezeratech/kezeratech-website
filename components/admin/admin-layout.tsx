'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Boxes,
  Package,
  Building2,
  Mail,
  ClipboardList,
  Users,
  Image as ImageIcon,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  MessageSquare,
  UsersRound,
  Megaphone,
  Newspaper,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { KezeraMark } from '@/components/kezera-logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  children?: { label: string; href: string }[];
}

const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: '',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Content',
    items: [
      {
        label: 'Content',
        href: '/admin/blog',
        icon: FileText,
        children: [
          { label: 'Blog Posts', href: '/admin/blog' },
          { label: 'FAQs', href: '/admin/faqs' },
          { label: 'Testimonials', href: '/admin/testimonials' },
          { label: 'News', href: '/admin/news' },
        ],
      },
    ],
  },
  {
    label: 'Marketing',
    items: [
      {
        label: 'Advertisements',
        href: '/admin/advertisements',
        icon: Megaphone,
      },
    ],
  },
  {
    label: 'Business',
    items: [
      {
        label: 'Services',
        href: '/admin/services',
        icon: Briefcase,
      },
      {
        label: 'Projects',
        href: '/admin/projects',
        icon: Boxes,
      },
      {
        label: 'Products',
        href: '/admin/products',
        icon: Package,
      },
      {
        label: 'Industries',
        href: '/admin/industries',
        icon: Building2,
      },
    ],
  },
  {
    label: 'Communication',
    items: [
      {
        label: 'Messages',
        href: '/admin/messages',
        icon: Mail,
      },
      {
        label: 'Quote Requests',
        href: '/admin/quotes',
        icon: ClipboardList,
      },
      {
        label: 'Newsletter',
        href: '/admin/newsletter',
        icon: Users,
      },
      {
        label: 'Job Applications',
        href: '/admin/applications',
        icon: Users,
      },
    ],
  },
  {
    label: 'System',
    items: [
      {
        label: 'Media Library',
        href: '/admin/media',
        icon: ImageIcon,
      },
      {
        label: 'Settings',
        href: '/admin/settings',
        icon: Settings,
      },
    ],
  },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push('/admin/login');
  };

  const isLoginPage = pathname === '/admin/login';

  // Always render login page without any layout or auth checks
  if (isLoginPage) return <>{children}</>;

  // Show loading spinner while auth state is being determined
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse">
          <KezeraMark size={48} />
        </div>
      </div>
    );
  }

  // Not authenticated — redirect to login
  if (!user) {
    router.replace('/admin/login');
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse">
          <KezeraMark size={48} />
        </div>
      </div>
    );
  }

  const isActive = (href: string) =>
    pathname === href || (href !== '/admin' && pathname.startsWith(href));

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <Link href="/admin" className="flex items-center gap-2.5">
            <KezeraMark size={28} />
            <span className="font-heading text-sm font-bold tracking-tight">
              Kezera<span className="text-accent">Tech</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <nav className="flex h-[calc(100vh-4rem)] flex-col overflow-y-auto px-3 py-4">
          {NAV_GROUPS.map((group, gi) => (
            <div key={gi} className={cn(gi > 0 && 'mt-6')}>
              {group.label && (
                <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </p>
              )}
              {group.items.map((item) => {
                const active = isActive(item.href);
                const hasChildren = !!item.children;
                const isExpanded = expanded === item.href;
                return (
                  <div key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() =>
                        hasChildren &&
                        setExpanded(isExpanded ? null : item.href)
                      }
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        active
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {hasChildren && (
                        <ChevronDown
                          className={cn(
                            'h-3.5 w-3.5 transition-transform',
                            isExpanded && 'rotate-180'
                          )}
                        />
                      )}
                    </Link>
                    {hasChildren && isExpanded && (
                      <div className="mt-1 ml-7 space-y-0.5">
                        {item.children!.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              'block rounded-md px-3 py-2 text-xs transition-colors',
                              pathname === child.href
                                ? 'text-accent'
                                : 'text-muted-foreground hover:text-foreground'
                            )}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          <div className="mt-auto pt-4">
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content area */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-md md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="h-9 w-64 pl-10"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {user.email?.[0]?.toUpperCase() ?? 'A'}
              </div>
              <span className="hidden text-sm text-muted-foreground md:block">
                {user.email}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
