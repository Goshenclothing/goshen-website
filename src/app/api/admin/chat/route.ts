import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_INSTRUCTION = `
You are the Goshen Admin Agent, a high-level fashion business consultant and store manager for Goshen Clothing.

CAPABILITIES:
1. PRODUCT MANAGEMENT: You can help draft metadata (Name, Description, Tags) for products. When the admin mentions a new product, provide the JSON structure or text they need to paste into the Products tab.
2. COLLECTION LOOKBOOKS: You are responsible for the creative direction of "Lookbooks" (Collections). You suggest which items belong in which "Album" (Casual vs Evening vs Signature).
3. CONTENT EDITING: Help the admin decide on the best aesthetic for product photos.

TONE: Professional, sophisticated, brand-focused.
CONTEXT: Based in Accra, Ghana. Luxury contemporary African fashion.
`;

const TIMEOUT_MS = 30000;

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();

        // SECURE SERVER-SIDE SUPABASE CLIENT (READ-ONLY)
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

        // AUTHENTICATION CHECK
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
        }

        // AUTHORIZATION (ROLE & EMAIL) CHECK
        const isAdmin = session.user.app_metadata?.role === 'admin';
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@example.com';
        const isTargetAdmin = session.user.email === adminEmail;

        if (!isAdmin || !isTargetAdmin) {
            return NextResponse.json({ error: 'Forbidden. Admin credentials required.' }, { status: 403 });
        }

        const { messages } = await req.json();

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json(
                { error: 'Invalid request: messages array is required' },
                { status: 400 }
            );
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: SYSTEM_INSTRUCTION
        });

        // Convert messages to Gemini format
        interface MessageParam {
            role: string;
            text: string;
        }
        const history = messages.slice(0, -1).map((m: MessageParam) => ({
            role: m.role === 'admin' ? 'user' : 'model',
            parts: [{ text: m.text }],
        }));

        const chat = model.startChat({ history });
        const lastMessage = messages[messages.length - 1].text;

        if (!lastMessage || typeof lastMessage !== 'string') {
            return NextResponse.json(
                { error: 'Invalid request: last message must be a string' },
                { status: 400 }
            );
        }

        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

        let result;
        try {
            result = await chat.sendMessage(lastMessage);
        } finally {
            clearTimeout(timeoutId);
        }

        const responseText = result.response.text();

        return NextResponse.json({ text: responseText }, { status: 200 });
    } catch (error) {
        const err = error as Error & { name?: string };
        console.error('Admin API Error:', err);

        // Handle timeout specifically
        if (err.name === 'AbortError') {
            return NextResponse.json(
                { error: 'Request took too long. Please try a shorter message.' },
                { status: 504 }
            );
        }

        return NextResponse.json({ error: 'System error processing request.' }, { status: 500 });
    }
}
