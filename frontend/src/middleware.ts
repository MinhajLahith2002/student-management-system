import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Use the same key as in constants.ts
  const token = request.cookies.get('studentManagementToken')?.value || 
                // Fallback for some clients that might not send cookies but we handle logic in client mostly
                // Note: localStorage isn't accessible here, so middleware protection is basic.
                // We rely on AuthContext for actual client-side protection.
                null;

  const isAuthPage = request.nextUrl.pathname.startsWith('/login');
  
  // Since we are using localStorage for JWT (as per initial plan), Next.js middleware 
  // can't read it natively if it's not in a cookie. 
  // To make this fully work, we would need to store the JWT in cookies.
  // For now, we will let the client-side AuthContext handle the redirect if it's purely localStorage.
  
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
