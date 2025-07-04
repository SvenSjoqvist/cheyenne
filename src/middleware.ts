import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // Enhanced Security Headers
  function middleware() {
    const response = NextResponse.next();

    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set(
      "Permissions-Policy",
      "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), interest-cohort=()"
    );
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; " +
        "script-src 'self' 'unsafe-eval' 'unsafe-inline' https:; " +
        "style-src 'self' 'unsafe-inline' https:; " +
        "img-src 'self' data: https:; " +
        "font-src 'self' https://fonts.gstatic.com https:; " +
        "connect-src 'self' https:; " +
        "frame-src 'self' https://open.spotify.com https://www.youtube.com https://www.google.com; " +
        "frame-ancestors 'none'; " +
        "base-uri 'self'; " +
        "form-action 'self'; " +
        "upgrade-insecure-requests; " +
        "block-all-mixed-content"
    );

    return response;
  },
  {
    callbacks: {
      async authorized({ req }) {
        const { pathname } = req.nextUrl;

        // Allow access to admin login page
        if (pathname.startsWith("/admin/login")) {
          return true;
        }

        // All other admin/dashboard routes require authentication
        return !!req.headers.get("cookie")?.includes("next-auth.session-token");
      },
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

export const config = {
  matcher: [
    // Only run middleware on dashboard and admin routes
    "/dashboard/:path*",
    "/admin/:path*",
    // Protect admin API routes
    "/api/admin/:path*",
  ],
};
