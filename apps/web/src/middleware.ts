import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { resolveCampusFromHost } from '@school-cms/theme';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  // Skip static assets, internal paths, and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Resolve campus from hostname (subdomain or custom domain)
  const branchSlug = resolveCampusFromHost(hostname);

  if (branchSlug) {
    // If accessing root '/' on a campus subdomain (e.g. bienhoa.school.edu.vn),
    // rewrite internally to /co-so/[branchSlug] without changing browser URL
    if (pathname === '/') {
      const url = request.nextUrl.clone();
      url.pathname = `/co-so/${branchSlug}`;
      const response = NextResponse.rewrite(url);
      response.headers.set('x-school-branch-slug', branchSlug);
      response.headers.set('x-school-branch-host', hostname);
      return response;
    }

    // Set campus header on downstream requests
    const response = NextResponse.next();
    response.headers.set('x-school-branch-slug', branchSlug);
    response.headers.set('x-school-branch-host', hostname);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
