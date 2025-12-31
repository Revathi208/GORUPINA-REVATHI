
import { GoogleGenAI } from "@google/genai";
import { DailyReport, FocusSession } from "../types";

export const analyzeProductivity = async (sessions: FocusSession[]): Promise<string> => {
  // Always use process.env.API_KEY directly in the constructor
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const sessionSummary = sessions.map(s => ({
    task: s.taskName,
    category: s.category,
    durationMinutes: Math.floor(s.duration / 60),
    distractions: s.distractions
  }));

  const prompt = `
    As a world-class productivity coach, analyze the following study session data for a student.
    Sessions: ${JSON.stringify(sessionSummary)}
    
    Provide:
    1. A concise evaluation of their focus (0-100 score).
    2. Specific advice on how to reduce distractions based on their data.
    3. A suggested Pomodoro adjustment (e.g., 50/10 vs 25/5) based on their average session length.
    
    Keep the tone encouraging, professional, and data-driven. Use markdown formatting.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      },
    });

    // Extract text output using the .text property as per guidelines
    return response.text || "Unable to generate insights at this time.";
  } catch (error) {
    console.error("Gemini analysis error:", error);
    return "Error connecting to AI advisor. Please check your connectivity.";
  }
};
