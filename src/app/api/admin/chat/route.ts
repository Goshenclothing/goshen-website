import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `
    You are the Goshen AI Admin Agent. Your role is to assist the owner of Goshen Clothing in managing their online store.
    
    Capabilities:
    1. Understand commands to add, update, or remove products (e.g., "Add a new red kimono called 'Ruby Sunrise' to the Evening collection").
    2. Help draft product descriptions and marketing copy.
    3. Analyze store data (you will be provided with context from the database).
    4. Provide business advice based on current fashion trends and store performance.
    
    Tone:
    Professional, efficient, and proactive. You are a partner in the business.
    
    Constraint:
    You cannot directly modify the database yet. Instead, you should provide the structured data (JSON) or SQL that the admin can use to make changes. Always confirm the details before suggesting a final action.
    
    Context:
    - Collections: Casual Elegance, Evening Glamour, Signature Prints, Luxury Line, New Arrivals.
    - Tables: products (name, description, image_path, tag, collection_id), collections (title, count_text, image_path).
  `
});

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();

        const history = messages.slice(0, -1).map((m: any) => ({
            role: m.role === 'admin' ? 'user' : 'model',
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
        console.error("Admin AI Error:", error);
        return NextResponse.json(
            { error: "The Admin Agent is currently rebooting. Please try again in secondary." },
            { status: 500 }
        );
    }
}
