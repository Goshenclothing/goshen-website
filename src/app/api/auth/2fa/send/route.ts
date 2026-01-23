import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { EmailService } from '@/lib/emailService';

export async function POST(req: Request) {
    try {
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

        // Generate 4-digit PIN
        const pin = Math.floor(1000 + Math.random() * 9000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

        // Check if user is blocked
        const { data: current2fa } = await supabase
            .from('two_factor')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (current2fa && current2fa.attempts >= 5) {
            const lastUpdated = new Date(current2fa.updated_at);
            const blockExpiry = new Date(lastUpdated.getTime() + 15 * 60 * 1000);
            if (new Date() < blockExpiry) {
                return NextResponse.json({
                    error: 'Account temporarily locked due to too many failed attempts. Try again in 15 minutes.'
                }, { status: 429 });
            } else {
                // Unblock after 15 mins
                await supabase
                    .from('two_factor')
                    .update({ attempts: 0, updated_at: new Date() })
                    .eq('user_id', user.id);
            }
        }

        // Save PIN to database
        // We use upsert to create or update the record
        const { error: dbError } = await supabase
            .from('two_factor')
            .upsert({
                user_id: user.id,
                pin: pin,
                expires_at: expiresAt.toISOString(),
                attempts: 0,
                is_verified: false,
                updated_at: new Date().toISOString()
            });

        if (dbError) throw dbError;

        // SEND EMAIL via centralized Service
        await EmailService.send2FAPin(user.email!, pin);

        return NextResponse.json({ message: 'A 4-digit PIN has been sent to your email.' });

    } catch (err: any) {
        console.error('2FA Send Error:', err);
        return NextResponse.json({ error: err.message || 'Failed to send 2FA PIN.' }, { status: 500 });
    }
}
