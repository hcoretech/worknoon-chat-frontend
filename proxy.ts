import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isChatRoute = pathname.startsWith('/chat');
  const isAuthRoute = pathname === '/auth';


  const token = request.cookies.get('token')?.value;


  if (isChatRoute && !token) {
    const loginRedirectUrl = new URL('/auth', request.url);

    loginRedirectUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginRedirectUrl);
  }


  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/chat', request.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    '/chat/:path*', 
    '/auth'
  ],
};
