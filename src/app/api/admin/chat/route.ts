import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
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
        const isTargetAdmin = session.user.email === 'Mawuo247@gmail.com';

        if (!isAdmin || !isTargetAdmin) {
            return NextResponse.json({ error: 'Forbidden. Admin credentials required.' }, { status: 403 });
        }

        const { messages } = await req.json();
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: SYSTEM_INSTRUCTION
        });

        // Convert messages to Gemini format
        const history = messages.slice(0, -1).map((m: any) => ({
            role: m.role === 'admin' ? 'user' : 'model',
            parts: [{ text: m.text }],
        }));

        const chat = model.startChat({ history });
        const lastMessage = messages[messages.length - 1].text;

        const result = await chat.sendMessage(lastMessage);
        const responseText = result.response.text();

        return NextResponse.json({ text: responseText });
    } catch (error: any) {
        console.error('Admin API Error:', error);
        return NextResponse.json({ error: 'System error processing request.' }, { status: 500 });
    }
}
