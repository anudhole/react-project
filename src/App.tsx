import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut, SignInButton, useAuth } from "@clerk/clerk-react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { Button } from "./components/ui/button";
import { ArrowRight } from "lucide-react";

const queryClient = new QueryClient();
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY environment variable");
}

const PlanPage = () => {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <SignedIn>
        <Index />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn redirectUrl="/" />
      </SignedOut>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster closeButton />
      <BrowserRouter>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/plan" element={<PlanPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ClerkProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;