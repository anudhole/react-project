import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Plane, Users, MapPin, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
//about page
const About = () => {

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="py-4 px-6 bg-white/95 backdrop-blur-sm shadow-sm"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 text-white p-2 rounded-full">
              <Plane className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">WanderPlan</h1>
              <p className="text-blue-600 text-xs font-medium">Your AI Travel Companion</p>
            </div>
          </div>
          <nav className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton aria-label="Sign in to WanderPlan" mode="modal">
                <Button className="flex items-center px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  <Users className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9 border-2 border-blue-200 hover:border-blue-400",
                  },
                }}
              />
            </SignedIn>
            <Link to="/plan">
              <Button className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">
                Plan Your Trip
              </Button>
            </Link>
          </nav>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-16 px-6">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">About WanderPlan</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            WanderPlan is an AI-powered travel companion designed to make trip planning simple, personalized, and delightful. Founded in 2023 in India, we combine cutting-edge technology with a passion for exploration to craft tailored itineraries for any destination—whether it’s a bustling city or a tranquil retreat.
          </p>
          <Link to="/plan">
            <Button className="px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 text-lg">
              Start Planning Now
            </Button>
          </Link>
        </motion.section>

        {/* Mission Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                At WanderPlan, we aim to empower travelers with seamless, AI-driven planning tools that save time and uncover hidden gems. Whether you’re a solo adventurer, a family on vacation, or a professional on a business trip, we’re here to make every journey unforgettable.
              </p>
            </div>
            <div className="flex justify-center">
              <MapPin className="w-32 h-32 text-blue-500 opacity-20" aria-hidden="true" />
            </div>
          </div>
        </motion.section>

     

        {/* Why WanderPlan Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="text-2xl font-semibold text-gray-900 text-center mb-8">Why Choose WanderPlan?</h3>
          <div className="grid md:grid-cols-2 gap-6 text-center">
            <div className="flex flex-col items-center">
              <Compass className="w-12 h-12 text-blue-600 mb-4" aria-hidden="true" />
              <h4 className="text-lg font-medium text-gray-900">Personalized Plans</h4>
              <p className="text-gray-600 text-sm">Get itineraries tailored to your interests, schedule, and destination.</p>
            </div>
            <div className="flex flex-col items-center">
              <MapPin className="w-12 h-12 text-blue-600 mb-4" aria-hidden="true" />
              <h4 className="text-lg font-medium text-gray-900">Global Reach</h4>
              <p className="text-gray-600 text-sm">Explore any destination with plans that include local insights and hidden gems.</p>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-900 text-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-blue-400" aria-hidden="true" />
            <span>WanderPlan © {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6">
            <Link to="/about" className="hover:text-blue-400">About</Link>
            <Link to="/contact" className="hover:text-blue-400">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;