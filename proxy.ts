import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Next.js expects the handler function to be named "middleware" explicitly
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Syncing route detection rules with your split dashboard layouts
  const isDashboardRoute = pathname.startsWith('/dashboard');

  const isAuthRoute = pathname === '/auth';

  // Read cookies directly during execution
  const token = request.cookies.get('token')?.value;

  // Guard Clause 1: Intercept unauthorized attempts to access communication decks
  if ((isDashboardRoute ) && !token) {
    const loginRedirectUrl = new URL('/auth', request.url);
    loginRedirectUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginRedirectUrl);
  }

  // Guard Clause 2: Prevent logged-in users from accessing login screens
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // 🟢 Enhanced matchers to capture deep routes targeting the administrative window
  matcher: [
    '/dashboard/:path*', 
    '/auth'
  ],
};
