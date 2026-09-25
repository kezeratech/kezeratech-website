import { NextRequest, NextResponse } from 'next/server';

// Paths that are ALWAYS accessible even in maintenance mode
const BYPASS_PATHS = [
  '/admin',           // Admin dashboard
  '/api/maintenance', // The maintenance check API itself
  '/api/',            // All API routes
  '/maintenance',     // The maintenance page itself
  '/_next',           // Next.js internal assets
  '/favicon',         // Favicon
  '/robots',          // Robots.txt
  '/sitemap',         // Sitemap
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow bypass paths
  const isBypassed = BYPASS_PATHS.some((p) => pathname.startsWith(p));
  if (isBypassed) return NextResponse.next();

  try {
    // Check maintenance status from the API route
    const baseUrl = request.nextUrl.origin;
    const res = await fetch(`${baseUrl}/api/maintenance`, {
      cache: 'no-store', // never use a cached response
      signal: AbortSignal.timeout(3000),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.maintenance_mode === true) {
        // Redirect all public traffic to /maintenance
        return NextResponse.redirect(new URL('/maintenance', request.url));
      }
    }
  } catch {
    // If the check fails, let the request through — never block visitors due to a DB error
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware on all routes except static files and Next.js internals
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)',
  ],
};
