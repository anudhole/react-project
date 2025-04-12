
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TravelFormData } from "@/types";

interface TravelFormProps {
  onSubmit: (data: TravelFormData) => void;
  isLoading: boolean;
}

export function TravelForm({ onSubmit, isLoading }: TravelFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<TravelFormData>();
  const [businessMode, setBusinessMode] = useState(false);
  const [days, setDays] = useState("5");

  const handleFormSubmit = (data: any) => {
    onSubmit({
      destination: data.destination,
      days: parseInt(days),
      businessMode,
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              placeholder="e.g., Goa, Paris, New York"
              {...register("destination", { required: "Destination is required" })}
            />
            {errors.destination && (
              <p className="text-sm text-red-500">{errors.destination.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="days">Number of Days</Label>
            <Select value={days} onValueChange={setDays}>
              <SelectTrigger>
                <SelectValue placeholder="Select days" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 14 }, (_, i) => i + 1).map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? "day" : "days"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="business-mode">Business Travel Mode</Label>
            <Switch
              id="business-mode"
              checked={businessMode}
              onCheckedChange={setBusinessMode}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Generating Plan..." : "Generate Travel Plan"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
