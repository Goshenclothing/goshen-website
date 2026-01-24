import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { pin } = await req.json();
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                },
            }
        );

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch the PIN and status
        const { data: twoFactor, error: fetchError } = await supabase
            .from('two_factor')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (fetchError || !twoFactor) {
            return NextResponse.json({ error: 'Invalid verification request. Please request a new PIN.' }, { status: 400 });
        }

        // SECURITY: Verify the 2FA record belongs to current authenticated user
        if (twoFactor.user_id !== user.id) {
            console.warn(`[SECURITY] 2FA bypass attempt detected for user ${user.id}`);
            return NextResponse.json({ error: 'Invalid verification request.' }, { status: 401 });
        }

        // Check expiry
        if (new Date() > new Date(twoFactor.expires_at)) {
            return NextResponse.json({ error: 'PIN expired. Please request a new one.' }, { status: 400 });
        }

        // Check if locked
        if (twoFactor.attempts >= 5) {
            const lastUpdated = new Date(twoFactor.updated_at);
            const blockExpiry = new Date(lastUpdated.getTime() + 15 * 60 * 1000);
            if (new Date() < blockExpiry) {
                return NextResponse.json({
                    error: 'Account locked for 15 minutes due to too many attempts.'
                }, { status: 429 });
            }
        }

        // Verify PIN
        if (twoFactor.pin === pin) {
            // Success!
            await supabase
                .from('two_factor')
                .update({
                    is_verified: true,
                    attempts: 0,
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', user.id);

            return NextResponse.json({ message: '2FA verification successful.' });
        } else {
            // Increment attempts
            const newAttempts = twoFactor.attempts + 1;
            await supabase
                .from('two_factor')
                .update({
                    attempts: newAttempts,
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', user.id);

            const remaining = 5 - newAttempts;
            return NextResponse.json({
                error: `Incorrect PIN. ${remaining > 0 ? `${remaining} attempts remaining.` : 'Account locked.'}`
            }, { status: 400 });
        }

    } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.error('2FA Verify Error:', error);
        return NextResponse.json({ error: error.message || 'Verification failed.' }, { status: 500 });
    }
}
