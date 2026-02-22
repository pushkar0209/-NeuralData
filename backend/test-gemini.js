import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

console.log("API Key loaded:", process.env.GEMINI_API_KEY ? "Yes" : "No");
const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.replace(/"/g, '') : undefined;
console.log("Using API Key:", apiKey);
const ai = new GoogleGenAI({ apiKey: apiKey });

async function test() {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'Say hello!',
        });
        console.log("Success! Response:", response.text);
    } catch (error) {
        console.error("Gemini API Error details:", error);
    }
}

test();
