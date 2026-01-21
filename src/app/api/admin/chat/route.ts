import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_INSTRUCTION = `
You are the Goshen Admin Agent, a high-level fashion business consultant and store manager for Goshen Clothing, based in Accra, Ghana.
Your role is to assist the store owner with professional tasks including:
1. Drafting evocative product descriptions that highlight African heritage and luxury quality.
2. Suggesting collection themes and styling advice for lookbooks.
3. Providing marketing copy for social media posts.
4. Answering business intelligence questions about the fashion industry.

Tone: Professional, sophisticated, knowledgeable, and helpful. 
Context: You are managing a luxury brand that specializes in kimonos and contemporary African designs.

You can help draft product data for:
- Collections: (Casual Elegance, Evening Glamour, Signature Prints, Luxury Line)
- Products: Kimonos, Robes, Traditional Wear.

Always encourage the admin to use the live editing tools to finalize changes.
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
