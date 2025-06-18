import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    // Add security headers to all responses
    const response = NextResponse.next();
    
    // Security headers
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    
    // Content Security Policy - More permissive for external connections
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com https:; connect-src 'self' https:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
    );
    
    return response;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to login page and public routes
        if (req.nextUrl.pathname.startsWith('/admin/login') || 
            req.nextUrl.pathname === '/') {
          return true;
        }
        
        // Require authentication for dashboard and API routes
        if (req.nextUrl.pathname.startsWith('/dashboard') || 
            req.nextUrl.pathname.startsWith('/api/admin')) {
          return !!token;
        }
        
        return true;
      },
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

export const config = {
  matcher: [
    // Protect dashboard routes
    "/dashboard/:path*",
    // Protect admin API routes
    "/api/admin/:path*",
    // Apply security headers to all routes
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}; 