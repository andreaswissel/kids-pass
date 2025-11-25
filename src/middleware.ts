import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
    const isAppRoute = req.nextUrl.pathname.startsWith("/app");

    // Check admin access
    if (isAdminRoute && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/app", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAuthPage =
          req.nextUrl.pathname.startsWith("/login") ||
          req.nextUrl.pathname.startsWith("/signup");

        // Allow access to auth pages without token
        if (isAuthPage) {
          return true;
        }

        // Require token for protected routes
        const isProtectedRoute =
          req.nextUrl.pathname.startsWith("/app") ||
          req.nextUrl.pathname.startsWith("/admin");

        if (isProtectedRoute) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/app/:path*", "/admin/:path*"],
};

