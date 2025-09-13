import React, { useState } from 'react';
import { X, Search, MapPin, Star, Navigation } from 'lucide-react';

const MapView = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Mock data for demonstration
  const mockLocations = [
    {
      id: 1,
      name: "Eiffel Tower",
      type: "landmark",
      city: "Paris, France",
      rating: 4.6,
      description: "Iconic iron lattice tower and symbol of Paris",
      coordinates: { lat: 48.8584, lng: 2.2945 }
    },
    {
      id: 2,
      name: "Le Comptoir de Relais",
      type: "restaurant",
      city: "Paris, France",
      rating: 4.3,
      description: "Traditional French bistro with excellent wine selection",
      coordinates: { lat: 48.8534, lng: 2.3390 }
    },
    {
      id: 3,
      name: "Hotel des Grands Boulevards",
      type: "hotel",
      city: "Paris, France",
      rating: 4.5,
      description: "Boutique hotel in the heart of Paris",
      coordinates: { lat: 48.8714, lng: 2.3430 }
    }
  ];

  const [locations, setLocations] = useState(mockLocations);
  const [filteredLocations, setFilteredLocations] = useState(mockLocations);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredLocations(locations);
    } else {
      const filtered = locations.filter(location => 
        location.name.toLowerCase().includes(query.toLowerCase()) ||
        location.city.toLowerCase().includes(query.toLowerCase()) ||
        location.type.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredLocations(filtered);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'landmark':
        return <MapPin className="h-4 w-4 text-red-500" />;
      case 'restaurant':
        return <div className="w-4 h-4 bg-orange-500 rounded-full" />;
      case 'hotel':
        return <div className="w-4 h-4 bg-blue-500 rounded-full" />;
      default:
        return <MapPin className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'landmark':
        return 'border-red-200 bg-red-50';
      case 'restaurant':
        return 'border-orange-200 bg-orange-50';
      case 'hotel':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl h-[700px] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <MapPin className="h-6 w-6 text-blue-500" />
            <span>Explore Destinations</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-1/3 border-r bg-gray-50 overflow-y-auto">
            <div className="p-4">
              {/* Search */}
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search destinations, hotels, restaurants..."
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex space-x-2 mb-4">
                <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  All
                </button>
                <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors">
                  Hotels
                </button>
                <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors">
                  Restaurants
                </button>
                <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors">
                  Attractions
                </button>
              </div>

              {/* Location List */}
              <div className="space-y-3">
                {filteredLocations.map((location) => (
                  <div
                    key={location.id}
                    onClick={() => setSelectedLocation(location)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedLocation?.id === location.id
                        ? 'border-blue-500 bg-blue-50'
                        : `${getTypeColor(location.type)} hover:border-gray-300`
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(location.type)}
                        <h3 className="font-semibold text-gray-900">{location.name}</h3>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{location.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{location.city}</p>
                    <p className="text-sm text-gray-700">{location.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map Area */}
          <div className="flex-1 relative">
            {/* Mock Map - In a real app, you'd integrate Google Maps or another mapping service */}
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 relative overflow-hidden">
              {/* Mock map background */}
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 400 300">
                  <path d="M0,150 Q100,50 200,150 T400,150" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path d="M50,0 Q150,100 250,0 T450,0" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path d="M-50,300 Q50,200 150,300 T350,300" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </div>

              {/* Mock markers */}
              <div className="absolute top-1/4 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-8 h-8 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
              </div>

              <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-6 h-6 bg-orange-500 rounded-full border-2 border-white shadow-lg"></div>
              </div>

              <div className="absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-1/2">
                <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
              </div>

              {/* Map Controls */}
              <div className="absolute top-4 right-4 space-y-2">
                <button className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <Navigation className="h-5 w-5 text-gray-600" />
                </button>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <button className="block w-full p-2 hover:bg-gray-50 transition-colors border-b">
                    <span className="text-lg font-bold">+</span>
                  </button>
                  <button className="block w-full p-2 hover:bg-gray-50 transition-colors">
                    <span className="text-lg font-bold">−</span>
                  </button>
                </div>
              </div>

              {/* Selected Location Info */}
              {selectedLocation && (
                <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getTypeIcon(selectedLocation.type)}
                        <h3 className="text-lg font-semibold text-gray-900">
                          {selectedLocation.name}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{selectedLocation.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{selectedLocation.city}</p>
                      <p className="text-sm text-gray-700">{selectedLocation.description}</p>
                    </div>
                    <div className="ml-4 space-x-2">
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Get Directions
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Map Instructions */}
              {!selectedLocation && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
                    <MapPin className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Explore Amazing Places
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Click on any location in the sidebar to see it on the map and get more details.
                    </p>
                    <p className="text-sm text-gray-500">
                      In the full version, this would show an interactive Google Maps view with real locations, routes, and street view integration.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;