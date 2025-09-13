import React, { useState } from 'react';
import { X, Calculator, Users, Calendar, Home, Utensils, MapPin, Plane } from 'lucide-react';

const BudgetEstimator = ({ onClose }) => {
  const [formData, setFormData] = useState({
    destination: '',
    days: 7,
    people: 2,
    accommodation: 'mid-range',
    meals: 'mix',
    activities: 'moderate',
    transportation: 'public'
  });
  const [breakdown, setBreakdown] = useState(null);
  const [loading, setLoading] = useState(false);

  const accommodationRates = {
    'budget': { name: 'Budget (Hostels, Budget Hotels)', rate: 30 },
    'mid-range': { name: 'Mid-range (3-star Hotels)', rate: 80 },
    'luxury': { name: 'Luxury (4-5 star Hotels)', rate: 200 }
  };

  const mealRates = {
    'budget': { name: 'Street Food & Local Restaurants', rate: 15 },
    'mix': { name: 'Mix of Local & Tourist Restaurants', rate: 35 },
    'fine-dining': { name: 'Fine Dining & Tourist Areas', rate: 75 }
  };

  const activityRates = {
    'minimal': { name: 'Free & Low-cost Activities', rate: 10 },
    'moderate': { name: 'Mix of Paid & Free Activities', rate: 40 },
    'extensive': { name: 'Tours, Shows & Premium Experiences', rate: 100 }
  };

  const transportationRates = {
    'walking': { name: 'Walking & Minimal Transport', rate: 5 },
    'public': { name: 'Public Transportation', rate: 20 },
    'taxi-uber': { name: 'Taxis & Ride-sharing', rate: 50 },
    'rental': { name: 'Car Rental', rate: 80 }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateBudget = () => {
    setLoading(true);
    
    setTimeout(() => {
      const dailyAccommodation = accommodationRates[formData.accommodation].rate;
      const dailyMeals = mealRates[formData.meals].rate * formData.people;
      const dailyActivities = activityRates[formData.activities].rate;
      const dailyTransportation = transportationRates[formData.transportation].rate;
      
      const totalAccommodation = dailyAccommodation * formData.days;
      const totalMeals = dailyMeals * formData.days;
      const totalActivities = dailyActivities * formData.days;
      const totalTransportation = dailyTransportation * formData.days;
      
      // Add flight estimate (simplified)
      const flightEstimate = 500 * formData.people;
      
      const subtotal = totalAccommodation + totalMeals + totalActivities + totalTransportation + flightEstimate;
      const contingency = subtotal * 0.1; // 10% contingency
      const total = subtotal + contingency;

      setBreakdown({
        accommodation: totalAccommodation,
        meals: totalMeals,
        activities: totalActivities,
        transportation: totalTransportation,
        flights: flightEstimate,
        contingency: contingency,
        total: total
      });
      
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Calculator className="h-6 w-6 text-blue-500" />
            <span>Budget Estimator</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="space-y-6">
              <div>
                <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
                  Destination
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="destination"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Where are you traveling?"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="days" className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Days
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="days"
                      name="days"
                      value={formData.days}
                      onChange={handleChange}
                      min="1"
                      max="365"
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="people" className="block text-sm font-medium text-gray-700 mb-2">
                    Number of People
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="people"
                      name="people"
                      value={formData.people}
                      onChange={handleChange}
                      min="1"
                      max="20"
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Home className="h-4 w-4 inline mr-1" />
                  Accommodation Type
                </label>
                <select
                  name="accommodation"
                  value={formData.accommodation}
                  onChange={handleChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(accommodationRates).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.name} (${value.rate}/night)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Utensils className="h-4 w-4 inline mr-1" />
                  Dining Style
                </label>
                <select
                  name="meals"
                  value={formData.meals}
                  onChange={handleChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(mealRates).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.name} (${value.rate}/day)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Level
                </label>
                <select
                  name="activities"
                  value={formData.activities}
                  onChange={handleChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(activityRates).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.name} (${value.rate}/day)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Plane className="h-4 w-4 inline mr-1" />
                  Transportation
                </label>
                <select
                  name="transportation"
                  value={formData.transportation}
                  onChange={handleChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(transportationRates).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.name} (${value.rate}/day)
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={calculateBudget}
                disabled={loading || !formData.destination}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Calculator className="h-5 w-5" />
                    <span>Calculate Budget</span>
                  </>
                )}
              </button>
            </div>

            {/* Results */}
            <div>
              {breakdown ? (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Budget Breakdown for {formData.destination}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {formData.days} days • {formData.people} {formData.people === 1 ? 'person' : 'people'}
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-700">Accommodation ({formData.days} nights)</span>
                      <span className="font-semibold">${breakdown.accommodation.toFixed(0)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-700">Meals ({formData.days} days)</span>
                      <span className="font-semibold">${breakdown.meals.toFixed(0)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-700">Activities ({formData.days} days)</span>
                      <span className="font-semibold">${breakdown.activities.toFixed(0)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-700">Transportation ({formData.days} days)</span>
                      <span className="font-semibold">${breakdown.transportation.toFixed(0)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-700">Flights (estimated)</span>
                      <span className="font-semibold">${breakdown.flights.toFixed(0)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-700">Contingency (10%)</span>
                      <span className="font-semibold">${breakdown.contingency.toFixed(0)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 bg-blue-100 px-4 rounded-lg">
                      <span className="text-lg font-bold text-blue-900">Total Budget</span>
                      <span className="text-2xl font-bold text-blue-900">${breakdown.total.toFixed(0)}</span>
                    </div>
                    
                    <div className="text-center mt-4">
                      <p className="text-sm text-gray-600">
                        That's approximately <strong>${(breakdown.total / formData.people).toFixed(0)} per person</strong>
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-12 rounded-lg text-center">
                  <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Calculate?</h3>
                  <p className="text-gray-600">
                    Fill in the details on the left to get your personalized budget estimate.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetEstimator;