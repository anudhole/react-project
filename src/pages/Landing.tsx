import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Plane,
  MapPin,
  Briefcase,
  FileText,
  User,
  Calendar,
  Compass,
  Globe,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
const Landing = () => {
  const features = [
    {
      icon: MapPin,
      title: "Personalized Itineraries",
      description:
        "Enter your destination and preferences to get a tailored travel plan with daily activities and local tips.",
    },
    {
      icon: Briefcase,
      title: "Business Travel Mode",
      description:
        "Optimize your work trips with schedules that balance meetings, networking, and downtime.",
    },
    {
      icon: FileText,
      title: "Quick Summaries",
      description:
        "Get concise overviews of your itinerary at a glance, perfect for busy travelers.",
    },
    {
      icon: Globe,
      title: "Explore Any Destination",
      description:
        "From Paris to Patagonia, Travzi crafts plans for any location with hidden gems included.",
    },
  ];
  const testimonials = [
    {
      name: "Sneha Patil",
      quote:
        "Travzi simplified my Konkan family trip planning! The itinerary included perfect homestays and local seafood spots we’d have missed otherwise.",
      role: "Homemaker & Travel Lover",
    },
    {
      name: "Vikram Deshmukh",
      quote:
        "Business mode helped me manage my Pune work trip so well! I got time for meetings and even visited Shaniwar Wada in the evening.",
      role: "IT Professional",
    },
    {
      name: "Anjali Kulkarni",
      quote:
        "The quick summary feature is a lifesaver! For our Mahabaleshwar trip, Travzi gave us a plan in minutes, saving me so much effort.",
      role: "Teacher & Weekend Explorer",
    },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100/50 to-purple-100/50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="py-4 px-6 bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-700 text-white p-2 rounded-full">
              <Plane className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-blue-900 tracking-tight">
                Travzi
              </h1>
              <p className="text-blue-700 text-xs font-medium">
                Your AI Travel Companion
              </p>
            </div>
          </div>
          <nav className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton
                aria-label="Sign in to Travzi"
                mode="modal"
              >
                <Button className="group flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
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
            <Link to="/plan">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 py-2 transition-all"
                aria-label="Start planning your trip"
              >
                Plan Your Trip
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </nav>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight mb-6"
          >
            Discover Your Perfect Adventure with Travzi
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed"
          >
            Let our AI craft personalized travel itineraries tailored to your
            destination, style, and schedule. Start planning in seconds!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link to="/plan">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                aria-label="Get started with Travzi"
              >
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-semibold text-gray-900 text-center mb-12"
          >
            Why Choose Travzi?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-white/90 backdrop-blur-md border border-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <feature.icon
                      className="h-8 w-8 text-blue-600 mb-2"
                      aria-hidden="true"
                    />
                    <CardTitle className="text-lg font-semibold text-blue-900">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-semibold text-gray-900 text-center mb-12"
          >
            See Travzi in Action
          </motion.h2>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-semibold text-blue-900">
                Effortless Planning
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Fill out a simple form with your destination, travel duration, and
                preferences. Travzi’s AI generates a detailed itinerary in
                seconds, complete with daily plans and local insights.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                  Choose your travel dates and duration.
                </li>
                <li className="flex items-center">
                  <Compass className="h-5 w-5 text-blue-600 mr-2" />
                  Add preferences for food, culture, or adventure.
                </li>
                <li className="flex items-center">
                  <FileText className="h-5 w-5 text-blue-600 mr-2" />
                  Get a full plan or a quick summary instantly.
                </li>
              </ul>
              <Link to="/plan">
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 transition-all"
                  aria-label="Try Travzi now"
                >
                  Try It Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-gray-100"
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Plane className="h-5 w-5 text-blue-600" />
                  <h4 className="text-lg font-medium text-blue-900">
                    Sample Itinerary: Paris
                  </h4>
                </div>
                <div className="prose prose-sm text-gray-700">
                  <p>
                    <strong>Day 1:</strong> Explore the Louvre Museum, enjoy a
                    Seine River cruise, and dine at a cozy Parisian café.
                  </p>
                  <p>
                    <strong>Day 2:</strong> Visit the Eiffel Tower, stroll through
                    Montmartre, and catch a cabaret show at Moulin Rouge.
                  </p>
                  <p className="text-blue-600 italic">
                    Generated by Travzi’s AI in seconds!
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-6 bg-blue-50/50">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-semibold text-gray-900 text-center mb-12"
          >
            Loved by Travelers
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-white/90 backdrop-blur-md border border-gray-100 rounded-2xl shadow-lg">
                  <CardContent className="pt-6">
                    <p className="text-gray-700 italic leading-relaxed mb-4">
                      “{testimonial.quote}”
                    </p>
                    <div className="flex items-center">
                      <User
                        className="h-8 w-8 text-blue-600 mr-2"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-sm font-medium text-blue-900">
                          {testimonial.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Ready to Plan Your Next Trip?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Join thousands of travelers who trust Travzi to create unforgettable
            adventures. Start now and see the magic of AI-powered planning!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link to="/plan">
              <Button
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                aria-label="Plan your trip with Travzi"
              >
                Plan Your Trip Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-900 text-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="flex items-center mb-4 md:mb-0">
            <Plane className="w-5 h-5 mr-2 text-blue-400" aria-hidden="true" />
            <span>Travzi © {new Date().getFullYear()}</span>
          </div>
          <div className="flex space-x-6">
           
            <Link
              to="/about"
              className="hover:text-blue-400 transition-colors"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="hover:text-blue-400 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;