import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { marked } from "marked";
import { FileText, Loader2, MapPin, Calendar, Clock, List, Copy } from "lucide-react";
import { GEMINI_API_URL, GEMINI_API_KEY } from "@/lib/gemini";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion"; // Added for animations
import { useToast } from "@/components/ui/use-toast"; // Added for copy feedback
import { toast } from "sonner";

interface TravelPlanDisplayProps {
  plan: string;
}

export function TravelPlanDisplay({ plan }: TravelPlanDisplayProps) {
  const [parsedPlan, setParsedPlan] = useState("");
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("full");

  useEffect(() => {
    if (plan) {
      // Parse markdown content asynchronously
      marked.parse(plan, { async: true })
        .then((parsed) => {
          if (typeof parsed === "string") {
            setParsedPlan(parsed);
          }
        })
        .catch((error) => console.error("Error parsing markdown:", error));
      setSummary(null);
      setActiveTab("full");
    }
  }, [plan]);

  const handleSummarize = async () => {
    if (isSummarizing) return;

    setIsSummarizing(true);
    try {
      const prompt = `Summarize the following travel plan in a concise bullet-point list, keeping only essential information for quick reading:\n\n${plan}`;

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1024,
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
      setActiveTab("summary");
      toast.success("Summary Generated", {
        description: "Your quick summary is ready to view!",
      });
    } catch (error) {
      console.error("Error summarizing travel plan:", error);
      toast.error("Error", {
        description: "Failed to generate summary. Please try again.",
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleCopyPlan = useCallback(() => {
    const textToCopy = activeTab === "summary" && summary ? summary : plan;
    navigator.clipboard.writeText(textToCopy).then(() => {
      toast.success("Copied!", {
        description: `${activeTab === "summary" ? "Summary" : "Full itinerary"} copied to clipboard.`,
      });
    }).catch(() => {
      toast.error("Error", {
        description: "Failed to copy text. Please try again.",
      });
    });
  }, [activeTab, plan, summary]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full bg-white/90 backdrop-blur-md shadow-xl border border-gray-100 rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-semibold text-blue-900 flex items-center">
                <MapPin className="mr-2 h-6 w-6 text-blue-600" aria-hidden="true" />
                Your Travel Itinerary
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1 flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-1" aria-hidden="true" />
                Created {new Date().toLocaleDateString()}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 flex items-center">
              <Clock className="mr-1 h-4 w-4" aria-hidden="true" />
              Ready to Explore
            </Badge>
          </div>
        </CardHeader>

        <AnimatePresence mode="wait">
          {summary ? (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
              aria-label="Travel plan view options"
            >
              <div className="px-6 pt-4 pb-2 border-b border-gray-100">
                <TabsList className="grid grid-cols-2 w-full max-w-xs mx-auto bg-gray-100/50 rounded-lg p-1">
                  <TabsTrigger
                    value="full"
                    className="rounded-md py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
                  >
                    <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
                    Full Itinerary
                  </TabsTrigger>
                  <TabsTrigger
                    value="summary"
                    className="rounded-md py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
                  >
                    <List className="mr-2 h-4 w-4" aria-hidden="true" />
                    Quick Summary
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="full" className="m-0">
                <motion.div
                  key="full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardContent className="max-h-[50vh] overflow-auto p-6">
                    <div
                      className="prose max-w-none prose-headings:text-blue-900 prose-headings:font-semibold prose-h2:border-b prose-h2:pb-2 prose-h2:border-blue-200 prose-p:leading-relaxed prose-li:leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: parsedPlan }}
                    />
                  </CardContent>
                </motion.div>
              </TabsContent>

              <TabsContent value="summary" className="m-0">
                <motion.div
                  key="summary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardContent className="p-6">
                    <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-blue-100 shadow-sm">
                      <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                        <List className="mr-2 h-5 w-5 text-blue-600" aria-hidden="true" />
                        Quick Summary
                      </h3>
                      <div
                        className="prose prose-sm max-w-none prose-headings:text-blue-900 prose-li:my-1 prose-p:my-1 prose-ul:pl-4"
                        dangerouslySetInnerHTML={{ __html: marked.parse(summary) }}
                      />
                    </div>
                    <p className="text-xs text-blue-600 mt-3 flex items-center italic">
                      <FileText className="mr-1 h-3 w-3" aria-hidden="true" />
                      AI-generated summary
                    </p>
                  </CardContent>
                </motion.div>
              </TabsContent>
            </Tabs>
          ) : (
            <motion.div
              key="full-only"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="max-h-[60vh] overflow-auto p-6">
                <div
                  className="prose max-w-none prose-headings:text-blue-900 prose-headings:font-semibold prose-h2:border-b prose-h2:pb-2 prose-h2:border-blue-200 prose-p:leading-relaxed prose-li:leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: parsedPlan }}
                />
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>

        <CardFooter className="flex justify-between items-center border-t border-gray-100 p-6 bg-gray-50/50">
          <Button
            onClick={handleCopyPlan}
            variant="outline"
            className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 transition-all"
          >
            <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
            Copy {activeTab === "summary" ? "Summary" : "Itinerary"}
          </Button>
          {!summary ? (
            <Button
              onClick={handleSummarize}
              disabled={isSummarizing}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 py-2 transition-all"
            >
              {isSummarizing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  Summarizing...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
                  Create Quick Summary
                </>
              )}
            </Button>
          ) : (
            <span className="text-sm text-blue-600 italic">
              Use tabs to switch views
            </span>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}