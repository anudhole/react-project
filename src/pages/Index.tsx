import { useState, useEffect } from "react";
import { TravelForm } from "@/components/TravelForm";
import { TravelPlanDisplay } from "@/components/TravelPlanDisplay";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { generateTravelPlan, getLocationNameFromCoords } from "@/lib/gemini";
import { TravelFormData } from "@/types";
import { Plane, MapPin, GlobeIcon, Compass, User, Map, Bell, BellOff } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { NearbyAttractionsDisplay } from "@/components/NearByAttractions";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [travelPlan, setTravelPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [exploreMode, setExploreMode] = useState(false);
  const [currentLocationName, setCurrentLocationName] = useState<string>("");
  const [notificationInterval, setNotificationInterval] = useState<number | null>(null);
  const [lastLocation, setLastLocation] = useState<{ lat: number, lng: number } | null>(null);

  useEffect(() => {
    return () => {
      if (notificationInterval) {
        clearInterval(notificationInterval);
      }
    };
  }, [notificationInterval]);

  useEffect(() => {
    let watchId: number | null = null;

    if (exploreMode) {
      watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          if (!lastLocation || calculateDistance(
            lastLocation.lat,
            lastLocation.lng,
            latitude,
            longitude
          ) > 0.1) {
            try {
              const locationName = await getLocationNameFromCoords(latitude, longitude);
              setCurrentLocationName(locationName);
              setLastLocation({ lat: latitude, lng: longitude });

              toast.info("Location Updated", {
                description: `You're now exploring near ${locationName}`,
                icon: <MapPin className="h-5 w-5 text-blue-600" />,
              });
            } catch (error) {
              console.error("Error updating location:", error);
            }
          }
        },
        (error) => console.error("Location watch error:", error),
        { enableHighAccuracy: true, maximumAge: 30000 }
      );
    }

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [exploreMode, lastLocation]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180);
  };

  const handleSubmit = async (data: TravelFormData) => {
    setIsLoading(true);
    setTravelPlan(null);

    try {
      const plan = await generateTravelPlan(data);
      setTravelPlan(plan);
      toast.success("Success!", {
        description: `Your travel plan for ${data.destination || data.currentLocation} is ready!`,
      });
    } catch (error) {
      toast.error("Oops!", {
        description: "Something went wrong. Please try again.",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationError = (error: any) => {
    console.error("Location error:", error);
    if (error instanceof GeolocationPositionError) {
      if (error.code === error.PERMISSION_DENIED) {
        toast.error("Location access denied", {
          description: "Please enable location access or enter your location manually.",
        });
      } else {
        toast.error("Unable to get location", {
          description: "Please check your connection or enter your location manually.",
          action: {
            label: "Enter Manually",
            onClick: () => promptForManualLocation(),
          },
        });
      }
    } else {
      toast.error("Something went wrong", {
        description: "Please try again or enter your location manually.",
        action: {
          label: "Enter Manually",
          onClick: () => promptForManualLocation(),
        },
      });
    }
  };

  const getUserLocation = async (retryCount = 3, timeout = 10000): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      const attemptLocation = (attemptsLeft: number) => {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve(position),
          (error) => {
            console.error(`Geolocation attempt ${4 - attemptsLeft}/${retryCount} failed:`, error);
            if (attemptsLeft <= 1) {
              reject(error);
              return;
            }
            setTimeout(() => attemptLocation(attemptsLeft - 1), 1000);
          },
          { enableHighAccuracy: true, timeout: timeout, maximumAge: 0 }
        );
      };
      attemptLocation(retryCount);
    });
  };

  const processLocationForTravelPlan = async (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;
    setLastLocation({ lat: latitude, lng: longitude });
    try {
      const locationName = await getLocationNameFromCoords(latitude, longitude);
      setCurrentLocationName(locationName);
      return locationName;
    } catch (error) {
      console.error("Error in getLocationNameFromCoords:", error);
      const fallbackName = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      setCurrentLocationName(fallbackName);
      toast.warning("Using coordinates as location", {
        description: "Could not resolve location name. Using coordinates instead.",
      });
      return fallbackName;
    }
  };

  const generateNearbyPlan = async (locationName: string) => {
    console.log("Generating plan for location:", locationName);
    const data: TravelFormData = {
      currentLocation: locationName,
      destination: "",
      departureCity: "",
      days: 1,
      transportMode: "",
      additionalInfo: `Current time is ${new Date().toLocaleTimeString()}. Looking for interesting places to visit right now in this area.`,
      businessMode: false,
    };
    try {
      const plan = await generateTravelPlan(data);
      setTravelPlan(plan);
      toast.success("Ready to explore!", {
        description: `Discover interesting places near ${locationName}`,
      });
    } catch (error) {
      console.error("Error generating travel plan:", error);
      toast.error("Failed to generate recommendations", {
        description: "Please try again or enter a different location.",
        action: {
          label: "Enter Manually",
          onClick: () => promptForManualLocation(),
        },
      });
      throw error;
    }
  };

  useEffect(() => {
    let watchId: number | null = null;
    if (exploreMode) {
      watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          if (!lastLocation || calculateDistance(lastLocation.lat, lastLocation.lng, latitude, longitude) > 0.1) {
            try {
              const locationName = await getLocationNameFromCoords(latitude, longitude);
              setCurrentLocationName(locationName);
              setLastLocation({ lat: latitude, lng: longitude });
              toast.info("Location Updated", {
                description: `You're now exploring near ${locationName}`,
                icon: <MapPin className="h-5 w-5 text-blue-600" />,
              });
            } catch (error) {
              console.error("Error updating location in watchPosition:", error);
              toast.error("Failed to update location", {
                description: "Please check your connection or enter your location manually.",
                action: {
                  label: "Enter Manually",
                  onClick: () => promptForManualLocation(),
                },
              });
            }
          }
        },
        (error) => {
          console.error("Location watch error:", error);
          handleLocationError(error);
        },
        { enableHighAccuracy: true, maximumAge: 30000 }
      );
    }
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [exploreMode, lastLocation]);

  const handleToggleExploreMode = async (checked: boolean) => {
    if (checked) {
      try {
        const position = await getUserLocation();
        const { latitude, longitude } = position.coords;
        setLastLocation({ lat: latitude, lng: longitude });

        const locationName = await processLocationForTravelPlan(position);

        const intervalId = window.setInterval(() => {
          toast("Explore Nearby", {
            description: `Discover interesting places near ${locationName}`,
            icon: <MapPin className="h-5 w-5 text-blue-600" />,
            action: {
              label: "Explore",
              onClick: () => handleCurrentLocation(),
            },
          });
        }, 60000);

        setNotificationInterval(intervalId);
        setExploreMode(true);

        toast("Explore Nearby Mode Activated", {
          description: `You'll receive suggestions for ${locationName} every minute`,
          icon: <MapPin className="h-5 w-5 text-green-600" />,
          action: {
            label: "Explore Now",
            onClick: () => handleCurrentLocation(),
          },
        });
      } catch (error) {
        handleLocationError(error);
        setExploreMode(false);
      }
    } else {
      if (notificationInterval) {
        clearInterval(notificationInterval);
        setNotificationInterval(null);
      }
      setExploreMode(false);
      toast("Explore Nearby Mode Deactivated", {
        description: "Notifications have been turned off.",
        icon: <BellOff className="h-5 w-5 text-gray-600" />,
      });
    }
  };

  const promptForManualLocation = async () => {
    const manualLocation = prompt("Please enter your current location (e.g., city or neighborhood):");
    if (!manualLocation) {
      toast.error("Location required", {
        description: "Please provide a location to get nearby recommendations.",
      });
      return;
    }

    setIsLoading(true);
    try {
      await generateNearbyPlan(manualLocation);
    } catch (error) {
      toast.error("Oops!", {
        description: "Something went wrong generating recommendations. Please try again.",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCurrentLocation = async () => {
    setIsLoading(true);
    setTravelPlan(null);

    try {
      const position = await getUserLocation();
      const locationName = await processLocationForTravelPlan(position);
      await generateNearbyPlan(locationName);
    } catch (error) {
      handleLocationError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100/50 to-purple-100/50">
      {/* Header */}
      <header className="py-4 px-6 bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-700 text-white p-2 rounded-full">
              <Plane className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-blue-900 tracking-tight">Travzi</h1>
              <p className="text-blue-700 text-xs font-medium">Your AI Travel Companion</p>
            </div>
          </div>
          <nav className="flex items-center space-x-4">
            {/* Explore Nearby Mode Toggle */}
            <div className="flex items-center space-x-2 bg-white/80 rounded-lg px-3 py-1.5 border border-gray-200 shadow-sm">
              <Switch
                id="explore-mode"
                checked={exploreMode}
                onCheckedChange={handleToggleExploreMode}
                className="data-[state=checked]:bg-green-600"
              />
              <Label htmlFor="explore-mode" className="text-sm font-medium flex items-center">
                {exploreMode ? (
                  <>
                    <Bell className="w-3.5 h-3.5 mr-1.5 text-green-600" />
                    <span>Explore Mode: <span className="text-green-600 font-semibold">ON</span></span>
                  </>
                ) : (
                  <>
                    <BellOff className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
                    <span>Explore Mode</span>
                  </>
                )}
              </Label>
            </div>

            <button
              onClick={handleCurrentLocation}
              className="group flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
              aria-label="Explore current location"
              disabled={isLoading}
            >
              <Map className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              Explore Nearby
            </button>
            <SignedOut>
              <SignInButton
                mode="modal"
                aria-label="Sign in to Travzi"
              >
                <Button
                  className="group flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <User className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10 border-2 border-blue-200 hover:border-blue-400 transition-colors",
                  },
                }}
              />
            </SignedIn>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Explore Mode Indicator - Only show when active */}
          {exploreMode && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-green-100 border border-green-200 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center">
                <Bell className="w-5 h-5 text-green-600 mr-3 animate-pulse" />
                <div>
                  <h3 className="font-medium text-green-800">Explore Nearby Mode Active</h3>
                  <p className="text-sm text-green-700">
                    Currently exploring: {currentLocationName || "Loading location..."}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleCurrentLocation()}
                className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-1.5 rounded-md transition-colors"
              >
                Get Recommendations
              </button>
            </motion.div>
          )}

          {/* Feature Highlight */}
          <AnimatePresence>
            {!travelPlan && !isLoading && !exploreMode && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-12 text-center max-w-3xl mx-auto"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
                  Craft Your Dream Adventure
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Share your destination and preferences, or explore nearby spots instantly with Travzi's AI.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-[450px_1fr] gap-8">
            {/* Left Column - Form and Benefits */}
            <motion.div
              className="lg:sticky lg:top-8 self-start space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-gray-100">
                <TravelForm onSubmit={handleSubmit} isLoading={isLoading} />
              </div>

              {/* Benefits Section */}
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-gray-100 hidden lg:block">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Choose Travzi?</h3>
                <ul className="space-y-4 text-sm text-gray-700">
                  <li className="flex items-start">
                    <MapPin className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Tailored itineraries or instant nearby suggestions</span>
                  </li>
                  <li className="flex items-start">
                    <GlobeIcon className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Personalized to your unique travel style</span>
                  </li>
                  <li className="flex items-start">
                    <Compass className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Discover hidden gems and local secrets</span>
                  </li>
                  <li className="flex items-start">
                    <Bell className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Explore Mode sends timely recommendations</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Right Column - Dynamic Content */}
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <LoadingSkeleton />
                </motion.div>
              ) : travelPlan ? (
                <motion.div
                  key="plan"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {!travelPlan.includes("Day") && currentLocationName ? (
                    <NearbyAttractionsDisplay
                      content={travelPlan}
                      location={currentLocationName}
                    />
                  ) : (
                    <TravelPlanDisplay plan={travelPlan} />
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex items-center justify-center p-8"
                >
                  <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-blue-200 shadow-xl p-8 max-w-lg text-center">
                    <div className="bg-blue-100 p-4 rounded-full inline-flex mb-6">
                      <Plane className="w-10 h-10 text-blue-600" aria-hidden="true" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                      Where Will You Go Next?
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Enter your travel details or use your current location to unlock custom suggestions.
                    </p>
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                      <button
                        onClick={() => document.querySelector("form")?.scrollIntoView({ behavior: "smooth" })}
                        className="inline-flex items-center px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-full sm:w-auto justify-center"
                      >
                        Plan a Trip
                      </button>
                      <button
                        onClick={handleCurrentLocation}
                        className="inline-flex items-center px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all w-full sm:w-auto justify-center"
                      >
                        <Map className="w-4 h-4 mr-2" />
                        Explore Nearby
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-900 text-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="flex items-center mb-4 md:mb-0">
            <Plane className="w-5 h-5 mr-2 text-blue-400" aria-hidden="true" />
            <span>Travzi © {new Date().getFullYear()}</span>
          </div>
          <div className="flex space-x-6">
            <Link to="/about" className="hover:text-blue-400 transition-colors">
              About
            </Link>
            <Link to="/contact" className="hover:text-blue-400 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;