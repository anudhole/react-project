import { TravelFormData } from "../types";

export const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent";
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function generateTravelPlan(formData: TravelFormData): Promise<string> {
  try {
    const { destination, currentLocation, departureCity, days = 1, transportMode, businessMode, additionalInfo } = formData;
    
    // Determine if this is an "explore nearby" request
    const isExploreNearby = !!currentLocation && !destination;
    
    // Create the prompt based on user inputs
    let prompt = "";
    
    if (isExploreNearby) {
      // Create a prompt specifically for exploring nearby locations
      prompt = `I'm currently at ${currentLocation} and looking for interesting places to visit right now.
      
Please provide:
- 5-7 specific nearby attractions, organized by category (food, culture, nature, entertainment)
- Include exact names of places, not generic suggestions
- For each suggestion, add a brief 1-2 sentence description of why it's worth visiting
- Include a mix of popular spots and hidden gems
- Suggest places that can be visited within the next few hours
- Consider the current time of day for appropriate suggestions

Additional context: ${additionalInfo || "Looking for interesting places to explore in the immediate area"}`;
    } else {
      // Standard travel planning prompt
      prompt = `Generate a travel plan for ${destination} for ${days} days, traveling from ${departureCity || "unspecified departure city"} via ${transportMode || "any transport mode"}.
Include:
- Day 1: Departure from ${departureCity || "your city"} to ${destination} with travel details
- Day 2: Arrival and initial activities in ${destination}
${days > 2 ? `- Day 3-${days-1}: 2-3 famous nearby attractions each day` : ""}
${days > 1 ? `- Day ${days}: Return to ${departureCity || "your city"}` : ""}

Business Travel Mode: ${businessMode ? "ON" : "OFF"}
${businessMode ? "Suggest short, professional, nearby visits suitable for business trips, with time for meetings." : "Include a mix of popular attractions and local experiences."}

Additional Information: ${additionalInfo || "No specific preferences provided."}`;
    }

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
          temperature: isExploreNearby ? 0.9 : 0.7,
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

export async function getLocationNameFromCoords(lat: number, lng: number): Promise<string> {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
    
    if (!response.ok) {
      throw new Error("Failed to get location name");
    }
    
    const data = await response.json();
    
    const city = data.address.city || data.address.town || data.address.village || "";
    const district = data.address.suburb || data.address.district || data.address.neighborhood || "";
    const regionName = city ? (district ? `${district}, ${city}` : city) : data.display_name;
    
    return regionName;
  } catch (error) {
    console.error("Error getting location name:", error);
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
}