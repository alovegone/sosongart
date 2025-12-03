import { GoogleGenAI, Type } from "@google/genai";
import { CanvasNode, NodeType } from "../types";

const API_KEY = process.env.API_KEY || '';

// Safely initialize the client only when needed to avoid crashes if key is missing initially
const getClient = () => new GoogleGenAI({ apiKey: API_KEY });

export const generateBrainstormIdeas = async (
  contextNode: CanvasNode
): Promise<{ content: string; type: NodeType; colorKey: string }[]> => {
  if (!API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = getClient();
  
  const prompt = `
    I am using an infinite canvas brainstorming tool.
    I have a node with the text: "${contextNode.content}".
    Generate 3 distinct, brief, and creative related ideas or sub-tasks that could branch off from this node.
    Keep the content short (under 10 words).
    Return the result as a JSON array.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              content: { type: Type.STRING },
              colorSuggestion: { 
                type: Type.STRING, 
                enum: ['yellow', 'green', 'blue', 'purple', 'red'],
                description: "A color theme for the sticky note"
              }
            },
            required: ['content', 'colorSuggestion']
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    const parsed = JSON.parse(text);
    
    // Map response to our internal structure
    return parsed.map((item: any) => ({
      content: item.content,
      type: 'sticky' as NodeType,
      colorKey: item.colorSuggestion || 'yellow'
    }));

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
