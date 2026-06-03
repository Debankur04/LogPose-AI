import { NextResponse } from 'next/server';

// Protect pages: allow only public routes without token
// Public routes: main page and auth pages
const PUBLIC_PATHS = ['/', '/login', '/signup', '/auth/callback', '/Terms', '/Privacy', '/AboutUs', '/Contact', '/Blog', '/favicon.ico'];

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Allow Next internals and api routes
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.startsWith('/static')) {
    return NextResponse.next();
  }

  // Allow public pages
  for (const p of PUBLIC_PATHS) {
    if (pathname === p || pathname.startsWith(p + '/')) {
      return NextResponse.next();
    }
  }

  // Check for token in cookies (frontend uses localStorage, but if a cookie is present we'll honor it)
  const tokenCookie = req.cookies.get('access_token') || req.cookies.get('token');
  const token = tokenCookie ? tokenCookie.value : null;

  if (!token) {
    // Redirect to auth page
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
