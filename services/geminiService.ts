
import { GoogleGenAI } from "@google/genai";

export const generatePropertyDescription = async (details: {
  title: string;
  location: string;
  bedrooms: number;
  sqft: number;
}) => {
  try {
    // Fixed: Initializing GoogleGenAI using the exact pattern from guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Write a compelling real estate description for a ${details.title} located at ${details.location}. 
    It has ${details.bedrooms} bedrooms and is approximately ${details.sqft} sqft. 
    Make it sound modern, luxury, and professional for the Reach App.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 300,
        thinkingConfig: { thinkingBudget: 0 }
      },
    });

    return response.text;
  } catch (error) {
    console.error("AI Generation Error:", error);
    return null;
  }
};
