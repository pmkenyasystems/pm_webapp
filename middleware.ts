import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to login page and /admin route without authentication
        if (req.nextUrl.pathname === '/admin/login' || req.nextUrl.pathname === '/admin') {
          return true
        }
        // All authenticated users (any role) can access admin routes.
        // Access to specific modules is enforced per-page and per-API via hasModuleAccess().
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return !!token
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*'],
}

