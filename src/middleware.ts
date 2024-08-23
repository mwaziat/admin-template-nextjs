import { jwtDecode } from "jwt-decode";
import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
    const token = request.headers.get('Authorization');

    if (!token && request.nextUrl.pathname.startsWith('/api')) {
      return NextResponse.json({status: 0, message: "Unauthorized"}, {status: 401})
      // return NextResponse.redirect(new URL('/', request.url));
    }

    const cookies = request.cookies.get('Authorization')?.value;
    const currentTimeInSeconds = Math.floor(Date.now());

    if(cookies !== undefined){
      const expJwt = jwtDecode(cookies!).exp! * 1000
      if(currentTimeInSeconds > expJwt) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }
    }

    if (!cookies && request.nextUrl.pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    } else if (cookies && request.nextUrl.pathname.startsWith('/admin')) {
      const expJwt = jwtDecode(cookies).exp! * 1000
      if(currentTimeInSeconds > expJwt) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }
    }
    
    return NextResponse.next();
}

export const config = {
  matcher: [
    // Mengecualikan '/api/auth/login' tetapi termasuk semua rute API lainnya
    '/((?!api/auth/login|api/auth/register|_next/static|_next/image|favicon.ico|robots.txt).*)',
  ],
};