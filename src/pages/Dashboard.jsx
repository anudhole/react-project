import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, MapPin, Calendar, DollarSign, Edit, Trash2, MessageCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import TripForm from '../components/TripForm';
import BudgetEstimator from '../components/BudgetEstimator';
import ChatbotWidget from '../components/ChatbotWidget';
import MapView from '../components/MapView';

const Dashboard = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [showTripForm, setShowTripForm] = useState(false);
  const [showBudgetEstimator, setShowBudgetEstimator] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      // Mock data for demonstration
      setTrips([
        {
          id: 1,
          title: "Paris Adventure",
          destination: "Paris, France",
          startDate: "2024-03-15",
          endDate: "2024-03-22",
          budget: 2500,
          description: "Exploring the city of lights with museums, cafes, and architecture."
        },
        {
          id: 2,
          title: "Tokyo Experience",
          destination: "Tokyo, Japan",
          startDate: "2024-05-10",
          endDate: "2024-05-18",
          budget: 3200,
          description: "Cultural immersion in Japan's vibrant capital city."
        }
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch trips:', error);
      setLoading(false);
    }
  };

  const handleDeleteTrip = (tripId) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      setTrips(trips.filter(trip => trip.id !== tripId));
    }
  };

  const handleEditTrip = (trip) => {
    setEditingTrip(trip);
    setShowTripForm(true);
  };

  const handleTripSubmit = (tripData) => {
    if (editingTrip) {
      setTrips(trips.map(trip => trip.id === editingTrip.id ? { ...trip, ...tripData } : trip));
    } else {
      const newTrip = {
        id: Date.now(),
        ...tripData
      };
      setTrips([...trips, newTrip]);
    }
    setShowTripForm(false);
    setEditingTrip(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600">Plan your next adventure and manage your trips</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <button
              onClick={() => setShowTripForm(true)}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500"
            >
              <Plus className="h-8 w-8 text-blue-500 mb-2" />
              <h3 className="font-semibold text-gray-900">New Trip</h3>
              <p className="text-sm text-gray-600">Plan your next adventure</p>
            </button>

            <button
              onClick={() => setShowBudgetEstimator(true)}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-teal-500"
            >
              <DollarSign className="h-8 w-8 text-teal-500 mb-2" />
              <h3 className="font-semibold text-gray-900">Budget Estimator</h3>
              <p className="text-sm text-gray-600">Calculate trip costs</p>
            </button>

            <button
              onClick={() => setShowMap(true)}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-purple-500"
            >
              <MapPin className="h-8 w-8 text-purple-500 mb-2" />
              <h3 className="font-semibold text-gray-900">Explore Map</h3>
              <p className="text-sm text-gray-600">Discover destinations</p>
            </button>

            <button
              onClick={() => setShowChatbot(true)}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-orange-500"
            >
              <MessageCircle className="h-8 w-8 text-orange-500 mb-2" />
              <h3 className="font-semibold text-gray-900">AI Assistant</h3>
              <p className="text-sm text-gray-600">Get travel advice</p>
            </button>
          </div>

          {/* Trips Grid */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Trips</h2>
              <span className="text-gray-600">{trips.length} trips planned</span>
            </div>

            {trips.length === 0 ? (
              <div className="bg-white p-12 rounded-lg shadow-md text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No trips yet</h3>
                <p className="text-gray-600 mb-4">Start planning your first adventure!</p>
                <button
                  onClick={() => setShowTripForm(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Create Your First Trip
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trips.map((trip) => (
                  <div key={trip.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{trip.title}</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditTrip(trip)}
                          className="text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTrip(trip.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="text-sm">{trip.destination}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="text-sm">
                          {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="h-4 w-4 mr-2" />
                        <span className="text-sm">${trip.budget}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4">{trip.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {Math.ceil((new Date(trip.startDate) - new Date()) / (1000 * 60 * 60 * 24))} days to go
                      </span>
                      <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showTripForm && (
        <TripForm
          trip={editingTrip}
          onSubmit={handleTripSubmit}
          onClose={() => {
            setShowTripForm(false);
            setEditingTrip(null);
          }}
        />
      )}

      {showBudgetEstimator && (
        <BudgetEstimator
          onClose={() => setShowBudgetEstimator(false)}
        />
      )}

      {showChatbot && (
        <ChatbotWidget
          onClose={() => setShowChatbot(false)}
        />
      )}

      {showMap && (
        <MapView
          onClose={() => setShowMap(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;