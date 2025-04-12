
import { useState } from "react";
import { TravelForm } from "@/components/TravelForm";
import { TravelPlanDisplay } from "@/components/TravelPlanDisplay";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { TravziLogo } from "@/components/TravziLogo";
import { generateTravelPlan } from "@/lib/gemini";
import { TravelFormData } from "@/types";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [travelPlan, setTravelPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: TravelFormData) => {
    setIsLoading(true);
    setTravelPlan(null);

    try {
      const plan = await generateTravelPlan(data);
      setTravelPlan(plan);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate travel plan. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <TravziLogo />
          </div>
          <p className="mt-2 text-xl text-gray-600">
            AI-Powered Travel Planner
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr_2fr] gap-6">
          <div>
            <TravelForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
          <div>
            {isLoading ? (
              <LoadingSkeleton />
            ) : travelPlan ? (
              <TravelPlanDisplay plan={travelPlan} />
            ) : (
              <div className="h-full flex items-center justify-center text-center">
                <div className="p-6 bg-white/50 rounded-lg border border-gray-200">
                  <p className="text-gray-600">
                    Enter your travel details to generate a personalized itinerary
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="text-center text-sm text-gray-500 pt-8">
          <p>
            Powered by Gemini AI • Built with React & ShadCN UI
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
