import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

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

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();

        // We expect an array of { role: 'user' | 'model', parts: [{ text: string }] }
        // but the client might send { role: 'user' | 'bot', text: string }
        // Normalize to Gemini format
        const history = messages.slice(0, -1).map((m: any) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
        }));

        const currentMessage = messages[messages.length - 1].text;

        const chat = model.startChat({
            history: history,
        });

        const result = await chat.sendMessage(currentMessage);
        const responseText = result.response.text();

        return NextResponse.json({ text: responseText });
    } catch (error: any) {
        console.error("AI Error:", error);
        return NextResponse.json(
            { error: "I'm having trouble connecting to my creative circuits. Please try again later!" },
            { status: 500 }
        );
    }
}
