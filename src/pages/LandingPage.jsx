import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Calculator, MessageCircle, Star, Users, Shield, Globe } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 via-white to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Plan Your Perfect
                <span className="gradient-text block">Adventure</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Discover amazing destinations, estimate your budget accurately, and get personalized 
                travel recommendations with our AI-powered travel planner.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link 
                  to="/signup"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link 
                  to="/login"
                  className="border border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-500 px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
            <div className="bounce-in">
              <div className="relative">
                <img 
                  src="https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Travel Planning" 
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
                <div className="absolute -top-4 -left-4 bg-white p-4 rounded-xl shadow-lg">
                  <MapPin className="h-8 w-8 text-blue-500" />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-xl shadow-lg">
                  <Calculator className="h-8 w-8 text-teal-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Plan
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From budget estimation to AI recommendations, we've got all the tools 
              you need for the perfect trip.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card-hover bg-white p-8 rounded-xl shadow-lg border">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Calculator className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Budget Estimator</h3>
              <p className="text-gray-600">
                Get accurate cost breakdowns for accommodation, food, activities, and transportation.
              </p>
            </div>

            <div className="card-hover bg-white p-8 rounded-xl shadow-lg border">
              <div className="bg-teal-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-teal-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Interactive Maps</h3>
              <p className="text-gray-600">
                Explore destinations with integrated Google Maps showing hotels, restaurants, and attractions.
              </p>
            </div>

            <div className="card-hover bg-white p-8 rounded-xl shadow-lg border">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Travel Assistant</h3>
              <p className="text-gray-600">
                Get personalized recommendations and travel tips from our intelligent chatbot.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="slide-up">
              <div className="text-4xl font-bold text-blue-500 mb-2">50k+</div>
              <div className="text-gray-600">Trips Planned</div>
            </div>
            <div className="slide-up">
              <div className="text-4xl font-bold text-teal-500 mb-2">25k+</div>
              <div className="text-gray-600">Happy Travelers</div>
            </div>
            <div className="slide-up">
              <div className="text-4xl font-bold text-purple-500 mb-2">190+</div>
              <div className="text-gray-600">Countries Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied travelers who trust us with their trip planning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                location: "New York, USA",
                rating: 5,
                comment: "The budget estimator was incredibly accurate! Helped me plan my European trip perfectly."
              },
              {
                name: "Mike Chen",
                location: "Toronto, Canada",
                rating: 5,
                comment: "Love the AI assistant feature. It gave me amazing recommendations for hidden gems."
              },
              {
                name: "Emma Davis",
                location: "London, UK",
                rating: 5,
                comment: "User-friendly interface and comprehensive planning tools. Highly recommend!"
              }
            ].map((testimonial, index) => (
              <div key={index} className="card-hover bg-white p-6 rounded-xl shadow-lg border">
                <div className="flex items-center mb-4">
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.comment}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-500 to-teal-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Planning?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who trust TravelPlanner for their perfect trips.
          </p>
          <Link 
            to="/signup"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold inline-flex items-center space-x-2 transition-colors"
          >
            <span>Get Started Today</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;