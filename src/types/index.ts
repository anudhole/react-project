
export interface TravelFormData {
  destination?: string;
  currentLocation?: string;
  days?: number;
  businessMode?: boolean;
  additionalInfo?: string;
  departureCity: string;
  transportMode: string;
}


export interface TravelPlan {
  content: string;
}
