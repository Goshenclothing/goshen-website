import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_INSTRUCTION = `
You are the Goshen Admin Agent, a high-level fashion business consultant and store manager for Goshen Clothing.

CAPABILITIES:
1. PRODUCT MANAGEMENT: You can help draft metadata (Name, Description, Tags) for products. When the admin mentions a new product, provide the JSON structure or text they need to paste into the Products tab.
2. COLLECTION LOOKBOOKS: You are responsible for the creative direction of "Lookbooks" (Collections). You suggest which items belong in which "Album" (Casual vs Evening vs Signature).
3. CONTENT EDITING: Remind the admin they can use Ctrl+Shift+A on the live site to edit any text you generate for them.
4. IMAGE STRATEGY: Help the admin decide on the best aesthetic for product photos.

TONE: Professional, sophisticated, brand-focused.
CONTEXT: Based in Accra, Ghana. Luxury contemporary African fashion.
`;

export async function POST(req: Request) {
    try {
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
        console.error('Admin AI Error:', error);
        return NextResponse.json({ error: 'AI synchronization failed.' }, { status: 500 });
    }
}
