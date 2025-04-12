
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { marked } from "marked";
import { FileText, Loader2 } from "lucide-react";
import { GEMINI_API_URL, GEMINI_API_KEY } from "@/lib/gemini";

interface TravelPlanDisplayProps {
  plan: string;
}

export function TravelPlanDisplay({ plan }: TravelPlanDisplayProps) {
  const [parsedPlan, setParsedPlan] = useState("");
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  useEffect(() => {
    if (plan) {
      // Parse markdown content from the API response
      const parsed = marked.parse(plan);
      if (typeof parsed === 'string') {
        setParsedPlan(parsed);
      }
      // Reset summary when new plan is loaded
      setSummary(null);
    }
  }, [plan]);

  const handleSummarize = async () => {
    if (isSummarizing) return;
    
    setIsSummarizing(true);
    try {
      // Create a prompt to summarize the travel plan
      const prompt = `Summarize the following travel plan in the shortest format possible, keeping only the most essential information. Create a concise bullet-point list that someone could quickly read:\n\n${plan}`;
      
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
            temperature: 0.3, // Lower temperature for more concise output
            maxOutputTokens: 1024, // Shorter response
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to summarize travel plan");
      }

      const responseData = await response.json();
      const summaryText = responseData.candidates[0].content.parts[0].text;
      setSummary(summaryText);
    } catch (error) {
      console.error("Error summarizing travel plan:", error);
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <>
      <Card className="w-full mt-6">
        <CardHeader>
          <CardTitle>Your Travel Itinerary</CardTitle>
        </CardHeader>
        <CardContent className="max-h-[70vh] overflow-auto">
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: parsedPlan }}
          />
        </CardContent>
        <CardFooter className="flex justify-end border-t pt-4">
          <Button 
            onClick={handleSummarize} 
            disabled={isSummarizing}
            variant="outline"
          >
            {isSummarizing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Summarizing...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" /> 
                Summarize Itinerary
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {summary && (
        <Card className="w-full mt-4 bg-blue-50 border border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center text-blue-700">
              <FileText className="mr-2 h-5 w-5" /> Quick Summary
            </CardTitle>
            <p className="text-xs text-blue-600 mt-1">AI-generated brief version of your itinerary</p>
          </CardHeader>
          <CardContent>
            <div 
              className="prose prose-sm max-w-none prose-headings:text-blue-700 prose-li:my-0.5 prose-p:my-1"
              dangerouslySetInnerHTML={{ __html: marked.parse(summary) }}
            />
          </CardContent>
        </Card>
      )}
    </>
  );
}
