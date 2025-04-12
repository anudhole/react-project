
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { marked } from "marked";

interface TravelPlanDisplayProps {
  plan: string;
}

export function TravelPlanDisplay({ plan }: TravelPlanDisplayProps) {
  const [parsedPlan, setParsedPlan] = useState("");

  useEffect(() => {
    if (plan) {
      // Parse markdown content from the API response
      const parsed = marked.parse(plan);
      if (typeof parsed === 'string') {
        setParsedPlan(parsed);
      }
    }
  }, [plan]);

  return (
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
    </Card>
  );
}
