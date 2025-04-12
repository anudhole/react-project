
import { TravelFormData } from "../types";

export const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent";
export const GEMINI_API_KEY = "AIzaSyA2DO4hKwB-_R6N4j5y--4x3MF_brE0KLU";

export async function generateTravelPlan(formData: TravelFormData): Promise<string> {
  try {
    const { destination, days, businessMode } = formData;
    
    // Create the prompt based on user inputs
    const prompt = `Generate a travel plan for ${destination} for ${days} days.
Include:
- Day 1: Departure
- Day 2: Arrival
${days > 2 ? `- Day 3-${days-1}: 2-3 famous nearby attractions each day` : ""}
${days > 1 ? `- Day ${days}: Return` : ""}

Business Travel Mode: ${businessMode ? "ON" : "OFF"}
${businessMode ? "Suggest short, professional, nearby visits suitable for business trips." : ""}`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to generate travel plan");
    }

    const responseData = await response.json();
    const travelPlan = responseData.candidates[0].content.parts[0].text;
    return travelPlan;
  } catch (error) {
    console.error("Error generating travel plan:", error);
    throw error;
  }
}
