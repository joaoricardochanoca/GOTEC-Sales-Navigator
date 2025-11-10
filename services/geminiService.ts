import { GoogleGenAI } from "@google/genai";
import { KNOWLEDGE_BASE } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this environment, we assume it's set.
  console.warn("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const handleError = (error: unknown) => {
    console.error("Error interacting with Gemini:", error);
    if (error instanceof Error) {
        return `An error occurred while contacting the AI assistant: ${error.message}`;
    }
    return "An unknown error occurred while contacting the AI assistant.";
}

export const generateText = async (prompt: string): Promise<string> => {
  if (!API_KEY) {
    return "Error: Gemini API key is not configured. Please set the API_KEY environment variable.";
  }

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
            systemInstruction: KNOWLEDGE_BASE,
        },
    });

    return response.text;
  } catch (error) {
    return handleError(error);
  }
};


export const generateGroundedText = async (prompt: string, userLocation: { latitude: number; longitude: number }): Promise<{ text: string, sources: any[] }> => {
  if (!API_KEY) {
    return { text: "Error: Gemini API key is not configured. Please set the API_KEY environment variable.", sources: [] };
  }
  
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
            systemInstruction: KNOWLEDGE_BASE,
            tools: [{googleMaps: {}}],
            toolConfig: {
              retrievalConfig: {
                latLng: userLocation
              }
            }
        },
    });
    
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];

    return { text: response.text, sources };

  } catch (error) {
     return { text: handleError(error), sources: [] };
  }
}