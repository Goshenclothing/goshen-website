import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    });
                },
            },
        }
    );

    // This will refresh the session if it's expired
    const { data: { session } } = await supabase.auth.getSession();

    // Protect all /admin routes except /admin/login
    if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
        if (!session) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        // Role-based and Email-based authorization
        const isAdmin = session.user.app_metadata?.role === 'admin';
        const isTargetAdmin = session.user.email === 'Mawuo247@gmail.com';

        if (!isAdmin || !isTargetAdmin) {
            // Log entry attempt
            console.warn(`Unauthorized access attempt to ${request.nextUrl.pathname} by ${session.user.email}`);
            // Redirect unauthorized users to home
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // Protect all /account routes
    if (request.nextUrl.pathname.startsWith('/account')) {
        if (!session) {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }

        // 2FA Gating
        // For performance, we'll check if the 2FA is verified in the database
        // This is done on every /account request, which is secure.
        const { data: twoFactor } = await supabase
            .from('two_factor')
            .select('is_verified')
            .eq('user_id', session.user.id)
            .single();

        if (!twoFactor?.is_verified && !request.nextUrl.pathname.startsWith('/auth/2fa')) {
            return NextResponse.redirect(new URL('/auth/2fa', request.url));
        }
    }

    // Redirect authenticated users away from auth pages (except 2FA)
    if (session && request.nextUrl.pathname.startsWith('/auth') && !request.nextUrl.pathname.startsWith('/auth/2fa')) {
        // If 2FA is not complete, let them stay on auth pages or 2fa
        // But if they are trying to go to login/signup while already logged in, redirect to account
        const { data: twoFactor } = await supabase
            .from('two_factor')
            .select('is_verified')
            .eq('user_id', session.user.id)
            .single();

        if (twoFactor?.is_verified) {
            return NextResponse.redirect(new URL('/account', request.url));
        }
    }

    return response;
}

export const config = {
    matcher: ['/admin/:path*', '/account/:path*', '/auth/:path*'],
};
