import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Plane, Users, Mail, MessageSquare, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

// Contact data
const contactData = {
  title: "Get in Touch",
  description:
    "Have questions or need help with your travel plans? Reach out to the WanderPlan team, and we’ll get back to you as soon as possible.",
  contactOptions: [
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us your inquiries or support requests.",
      action: {
        type: "link",
        value: "mailto:sakibmulla0209@gmail.com",
        label: "sakibmulla0209@gmail.com",
      },
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Reach us for immediate assistance.",
      action: {
        type: "link",
        value: "tel:+918530854866",
        label: "+918530854866",
      },
    },
    {
      icon: MessageSquare,
      title: "WhatsApp Us",
      description: "Message us for quick support via WhatsApp.",
      action: {
        type: "link",
        value: "https://wa.me/918530854866",
        label: "+918530854866",
      },
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "WanderPlan HQ, Mumbai, India",
      action: null,
    },
  ],
  cta: {
    title: "Ready to Plan?",
    description: "Start your next adventure with WanderPlan’s AI-powered travel planning.",
    buttonText: "Plan Your Trip",
    link: "/plan",
  },
};

// Header Component
const Header = () => (
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
);

// Contact Section Component
const ContactSection = ({ title, description }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="text-center mb-16"
  >
    <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">{description}</p>
  </motion.section>
);

// Contact Option Component
const ContactOption = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center">
    <Icon className="w-12 h-12 text-blue-600 mb-4" aria-hidden="true" />
    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
    <p className="text-gray-600 text-sm mb-2">{description}</p>
    {action && action.type === "link" && (
      <a href={action.value} className="text-blue-600 hover:underline">
        {action.label}
      </a>
    )}
    {action && action.type === "button" && (
      <Button className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">
        {action.label}
      </Button>
    )}
  </div>
);

// Contact Options Component
const ContactOptions = ({ options }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    className="grid md:grid-cols-4 gap-6 mb-16"
  >
    {options.map((option, index) => (
      <ContactOption key={index} {...option} />
    ))}
  </motion.section>
);

// CTA Section Component
const CTASection = ({ title, description, buttonText, link }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.4 }}
    className="text-center"
  >
    <h3 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h3>
    <p className="text-gray-600 mb-6">{description}</p>
    <Link to={link}>
      <Button className="px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 text-lg">
        {buttonText}
      </Button>
    </Link>
  </motion.section>
);

// Footer Component
const Footer = () => (
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
);

// Main Contact Component
const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <main className="max-w-7xl mx-auto py-16 px-6">
        <ContactSection title={contactData.title} description={contactData.description} />
        <ContactOptions options={contactData.contactOptions} />
        <CTASection
          title={contactData.cta.title}
          description={contactData.cta.description}
          buttonText={contactData.cta.buttonText}
          link={contactData.cta.link}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Contact;