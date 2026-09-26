import { NextRequest, NextResponse } from 'next/server';

// Paths that are ALWAYS accessible even in maintenance mode
const BYPASS_PATHS = [
  '/admin',        // Admin dashboard
  '/api/',         // All API routes
  '/maintenance',  // The maintenance page itself
  '/_next',        // Next.js internal assets
  '/favicon',      // Favicon
  '/robots',       // Robots.txt
  '/sitemap',      // Sitemap
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow bypass paths
  const isBypassed = BYPASS_PATHS.some((p) => pathname.startsWith(p));
  if (isBypassed) return NextResponse.next();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) return NextResponse.next();

  try {
    // Query Supabase REST API directly — no internal fetch, works on Vercel Edge
    const res = await fetch(
      `${supabaseUrl}/rest/v1/site_settings?select=maintenance_mode,maintenance_message&limit=1`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Cache-Control': 'no-store',
        },
        signal: AbortSignal.timeout(3000),
      }
    );

    if (res.ok) {
      const data = await res.json();
      const row = Array.isArray(data) ? data[0] : data;

      if (row?.maintenance_mode === true) {
        return NextResponse.redirect(new URL('/maintenance', request.url));
      }
    }
  } catch {
    // If Supabase is unreachable, let visitors through — never block due to a DB error
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)',
  ],
};
