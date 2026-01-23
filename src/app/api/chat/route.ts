import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Validate API key at startup
if (!process.env.GEMINI_API_KEY) {
    console.warn("⚠️ GEMINI_API_KEY is not configured. Chat AI will not work.");
}

// Initialize the Gemini SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `
    You are the Goshen Clothing Fashion Assistant, a sophisticated AI agent for Goshen Clothing, an authentic African fashion brand based in Accra, Ghana.
    
    Your goals:
    1. Help users discover our handcrafted kimonos and contemporary African designs.
    2. Provide styling advice using African prints.
    3. Answer questions about our location (Accra), hours (Mon-Sat 9AM-6PM), and brand heritage.
    4. Maintain a premium, helpful, and elegant tone.
    
    Knowledge Base:
    - Products: Vibrant Heritage Kimono, Sunset Blaze Kimono, Rainbow Fusion Kimono, Classic XO Print Kimono, Ocean Wave Kimono, Royal Purple Elegance, Tropical Garden Kimono, Earthy Tribal Kimono.
    - Collections: Casual Elegance, Evening Glamour, Signature Prints, Luxury Line, New Arrivals.
    - Location: Showroom in Accra, Ghana.
    - Contact: WhatsApp +233 540 402 935.
    
    Guidelines:
    - If a user asks about social media, refer to our Instagram (@goshenclothing_gh) and Facebook.
    - Be proactive in suggesting specific products based on the user's needs (e.g., if they want something for a wedding, suggest the 'Royal Purple Elegance').
    - If the message is from an Admin (indicated in the request), you can assist with site management tasks, otherwise stay in "Customer Assistant" mode.
  `
});

// 30 second timeout for AI requests
const TIMEOUT_MS = 30000;

interface ChatRequest {
    messages: Array<{ role: string; text: string }>;
    imageData?: string;
}

interface ChatResponse {
    text?: string;
    error?: string;
}

export async function POST(req: NextRequest): Promise<NextResponse<ChatResponse>> {
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY not configured");
            return NextResponse.json(
                { error: 'AI service is not configured. Please contact support.' },
                { status: 503 }
            );
        }

        const body: ChatRequest = await req.json();
        const { messages, imageData } = body;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json(
                { error: 'Invalid request: messages array is required' },
                { status: 400 }
            );
        }

        // Normalize history to Gemini format
        const history = messages.slice(0, -1).map((m: any) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
        }));

        const lastMessage = messages[messages.length - 1].text;

        if (!lastMessage || typeof lastMessage !== 'string') {
            return NextResponse.json(
                { error: 'Invalid request: last message must be a string' },
                { status: 400 }
            );
        }

        const chat = model.startChat({
            history: history,
        });

        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

        let result;
        try {
            if (imageData) {
                // If image is provided, we send a multimodal message
                const parts: any[] = [{ text: lastMessage }];

                if (imageData.startsWith('data:')) {
                    const mimeType = imageData.split(';')[0].split(':')[1];
                    const base64Data = imageData.split(',')[1];
                    parts.push({
                        inline_data: {
                            mime_type: mimeType,
                            data: base64Data
                        }
                    });
                }

                result = await chat.sendMessage(parts);
            } else {
                result = await chat.sendMessage(lastMessage);
            }
        } finally {
            clearTimeout(timeoutId);
        }

        const responseText = result.response.text();
        return NextResponse.json({ text: responseText }, { status: 200 });
    } catch (error: any) {
        const errorMessage = error?.message || String(error);
        console.error("[Chat API]", errorMessage);
        
        // Handle timeout specifically
        if (error?.name === 'AbortError') {
            return NextResponse.json(
                { error: 'Request took too long. Please try a shorter message.' },
                { status: 504 }
            );
        }

        // Don't expose internal error details to client
        return NextResponse.json(
            { error: "I'm having trouble connecting. Please try again later!" },
            { status: 500 }
        );
    }
}
