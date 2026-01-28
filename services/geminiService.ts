import { GoogleGenAI } from "@google/genai";
import { Match } from "../types";

// Initialize Gemini AI
// NOTE: This relies on process.env.API_KEY being set in the environment.
const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getMatchInsight = async (match: Match): Promise<string> => {
  if (!ai) {
    return "AI service is currently unavailable. Please check your API Key configuration.";
  }

  try {
    const prompt = `
      Analyze the following sports match and provide a short, exciting betting insight (max 2 sentences).
      Sport: ${match.sport}
      League: ${match.league}
      Match: ${match.homeTeam} vs ${match.awayTeam}
      Status: ${match.status}
      Odds: Home ${match.odds.home}, Away ${match.odds.away} ${match.odds.draw ? `, Draw ${match.odds.draw}` : ''}
      ${match.score ? `Current Score: ${match.homeTeam} ${match.score.home} - ${match.score.away} ${match.awayTeam}` : ''}
      
      Focus on value or momentum.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "No insight available.";
  } catch (error) {
    console.error("Error fetching AI insight:", error);
    return "Could not retrieve AI insight at this time.";
  }
};
