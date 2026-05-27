import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Middleware to protect administrative routes under `/admin/*`.
 * Automatically redirects unauthenticated users to `/admin/login`
 * and logged-in admins to `/admin/dashboard` from `/admin/login`.
 */
export default async function middleware(request: NextRequest) {
  // Initialize the response structure
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Create the Supabase client tailored for middleware context
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Sync cookies with the request to make them accessible during matching
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));

          // Re-create the next response object with updated request cookies
          supabaseResponse = NextResponse.next({
            request,
          });

          // Set all updated cookies to the final response
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Retrieve user session and handle exceptions gracefully as unauthenticated
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (error) {
    // Treat database/network/token parse errors as unauthenticated
    user = null;
  }

  const { pathname } = request.nextUrl;

  // 1. If path starts with /admin and is NOT /admin/login:
  //    Redirect to /admin/login if the user is unauthenticated
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      
      const redirectResponse = NextResponse.redirect(url);
      
      // Copy cookies from supabaseResponse to the redirect response so token changes persist
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
      });
      
      return redirectResponse;
    }
  }

  // 2. If path is exactly /admin/login:
  //    Redirect authenticated admins straight to /admin/dashboard
  if (pathname === '/admin/login') {
    if (user) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/dashboard';
      
      const redirectResponse = NextResponse.redirect(url);
      
      // Copy cookies from supabaseResponse to the redirect response so session changes persist
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
      });
      
      return redirectResponse;
    }
  }

  // Always return the response object configured with Supabase context/cookies
  return supabaseResponse;
}

export const config = {
  matcher: ['/admin/:path*'],
};
