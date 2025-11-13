import { SignIn } from "@clerk/clerk-react";
import { Plane, ArrowLeft } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion"; // Added for animations

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get("redirectUrl");

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-100/50 to-purple-100/50">
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
              <h1 className="text-2xl font-extrabold text-blue-900 tracking-tight">WanderPlan</h1>
              <p className="text-blue-700 text-xs font-medium">Your AI Travel Companion</p>
            </div>
          </div>
          <Link
            to="/"
            className="group flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            aria-label="Return to homepage"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span>Return Home</span>
          </Link>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-8"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">Welcome Back</h2>
          <p className="text-gray-600 text-sm mb-6 text-center">
            Sign in to plan your next adventure with WanderPlan.
          </p>
          <SignIn
            appearance={{
              elements: {
                formButtonPrimary:
                  "bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg py-3 transition-all duration-200",
                footerActionLink:
                  "text-blue-600 hover:text-blue-800 font-medium transition-colors",
                card: "shadow-none bg-transparent",
                formFieldInput:
                  "text-sm border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all",
                formFieldLabel: "text-sm font-medium text-gray-700",
                formFieldAction: "text-sm text-blue-600 hover:text-blue-800",
                identityPreviewText: "text-sm text-gray-600",
                identityPreviewEditButton: "text-sm text-blue-600 hover:text-blue-800",
                headerTitle: "hidden", // Hidden since we have custom title
                headerSubtitle: "hidden", // Hidden since we have custom subtitle
                socialButtonsBlockButton:
                  "text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center",
                formFieldErrorText: "text-xs text-red-600",
                footer: "text-sm text-gray-600",
                main: "space-y-4",
              },
            }}
            path="/login"
            routing="path"
            afterSignInUrl="/plan"
          />
          <noscript>
            <p className="text-sm text-red-600 mt-4 text-center">
              JavaScript is required to sign in. Please enable it in your browser settings.
            </p>
          </noscript>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="py-6 px-6 bg-gray-900 text-gray-200 text-center text-sm"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Plane className="w-5 h-5 mr-2 text-blue-400" aria-hidden="true" />
            <span>WanderPlan © {new Date().getFullYear()}</span>
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
      </motion.footer>
    </div>
  );
}