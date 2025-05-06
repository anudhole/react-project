import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Plane, Calendar, Loader2, Info, Train, Bus, MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TravelFormData } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface TravelFormProps {
  onSubmit: (data: TravelFormData) => void;
  isLoading: boolean;
}

export function TravelForm({ onSubmit, isLoading }: TravelFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<TravelFormData>({
    defaultValues: {
      destination: "",
      departureCity: "",
      days: 5,
      transportMode: "",
      additionalInfo: "",
      businessMode: false,
    },
  });

  const [days, setDays] = useState("5");
  const [transportMode, setTransportMode] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [businessMode, setBusinessMode] = useState(false);

  // Watch for destination to validate form
  const destinationValue = watch("destination");

  const handleFormSubmit = (data: Partial<TravelFormData>) => {
    onSubmit({
      destination: data.destination ?? "",
      departureCity: data.departureCity ?? "",
      days: parseInt(days),
      transportMode: transportMode,
      additionalInfo,
      businessMode,
    });
  };

  // Form validation logic
  const isFormValid = () => {
    return !!destinationValue?.trim();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-md shadow-lg border border-gray-100 rounded-2xl">
        <CardHeader className="p-6 border-b border-gray-100">
          <CardTitle className="text-2xl font-semibold text-blue-900 flex items-center">
            <Plane className="mr-2 h-6 w-6 text-blue-600" aria-hidden="true" />
            Plan Your Adventure
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6 pb-8">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
            {/* Destination */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Label
                htmlFor="destination"
                className="flex items-center text-sm font-medium text-gray-700"
              >
                <span>Destination</span>
                <AnimatePresence>
                  {errors.destination && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="ml-auto text-xs text-red-600"
                      role="alert"
                    >
                      Required
                    </motion.span>
                  )}
                </AnimatePresence>
              </Label>
              <div className="relative">
                <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
                <Input
                  id="destination"
                  placeholder="e.g., Paris, Tokyo, New York"
                  className={`pl-10 rounded-md border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    errors.destination ? "border-red-500" : ""
                  }`}
                  aria-invalid={!!errors.destination}
                  aria-describedby={errors.destination ? "destination-error" : undefined}
                  {...register("destination", { required: "Destination is required" })}
                />
              </div>
            </motion.div>

            {/* Departure City */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Label
                htmlFor="departureCity"
                className="flex items-center text-sm font-medium text-gray-700"
              >
                <MapPin className="mr-2 h-4 w-4 text-gray-500" aria-hidden="true" />
                Departure City
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
                <Input
                  id="departureCity"
                  placeholder="e.g., Pune, Mumbai, Kolhapur"
                  className="pl-10 rounded-md border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  {...register("departureCity")}
                />
              </div>
            </motion.div>

            {/* Number of Days */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Label
                htmlFor="days"
                className="flex items-center text-sm font-medium text-gray-700"
              >
                <Calendar className="mr-2 h-4 w-4 text-gray-500" aria-hidden="true" />
                Number of Days
              </Label>
              <Select value={days} onValueChange={setDays} aria-label="Number of travel days">
                <SelectTrigger className="rounded-md border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue placeholder="Select days" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(14)].map((_, i) => (
                    <SelectItem key={i + 1} value={`${i + 1}`}>
                      {i + 1} {i + 1 === 1 ? "Day" : "Days"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            {/* Mode of Transport */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
            >
              <Label
                htmlFor="transportMode"
                className="flex items-center text-sm font-medium text-gray-700"
              >
                <Bus className="mr-2 h-4 w-4 text-gray-500" aria-hidden="true" />
                Mode of Transport
              </Label>
              <Select
                value={transportMode}
                onValueChange={setTransportMode}
                aria-label="Mode of transport"
              >
                <SelectTrigger className="rounded-md border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue placeholder="Select transport" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flight">Flight</SelectItem>
                  <SelectItem value="train">Train</SelectItem>
                  <SelectItem value="bus">Bus</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            {/* Business Mode */}
            <motion.div
              className="space-y-2 hidden"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="businessMode"
                  checked={businessMode}
                  onChange={(e) => setBusinessMode(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Label
                  htmlFor="businessMode"
                  className="text-sm font-medium text-gray-700 cursor-pointer"
                >
                  Business Travel Mode
                </Label>
              </div>
              {businessMode && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-gray-500"
                >
                  Optimizes schedule with business-appropriate activities and nearby locations
                </motion.p>
              )}
            </motion.div>

            {/* Additional Information */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
            >
              <Label
                htmlFor="additionalInfo"
                className="flex items-center text-sm font-medium text-gray-700"
              >
                <Info className="mr-2 h-4 w-4 text-gray-500" aria-hidden="true" />
                Additional Information
              </Label>
              <Textarea
                id="additionalInfo"
                placeholder="e.g., I love food tours, prefer museums, or want a relaxing beach day"
                className="min-h-[100px] rounded-md border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-y"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                aria-describedby="additionalInfo-help"
              />
              <p id="additionalInfo-help" className="text-xs text-gray-500 mt-1">
                Share preferences or must-visit spots for a tailored plan.
              </p>
            </motion.div>
          </form>
        </CardContent>

        <CardFooter className="border-t border-gray-100 p-6 bg-gray-50/50">
          <Button
            type="submit"
            className={`w-full ${
              isFormValid()
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-400 cursor-not-allowed"
            } text-white rounded-lg py-3 font-medium transition-all`}
            onClick={handleSubmit(handleFormSubmit)}
            disabled={isLoading || !isFormValid()}
            aria-label={isLoading ? "Generating travel plan" : "Plan my trip"}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Generating Plan...
              </>
            ) : (
              <>Plan My Trip</>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}