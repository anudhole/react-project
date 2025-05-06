import { useClerk } from "@clerk/clerk-react";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SSOCallbackLoading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100/50 to-purple-100/50">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" aria-hidden="true" />
        <p className="text-gray-700 text-sm">Completing your sign-in...</p>
      </div>
    </div>
  );
};

const AuthErrorComponent = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100/50 to-purple-100/50">
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-semibold text-red-600">Authentication Error</h2>
      <p className="text-gray-700">
        Something went wrong during sign-in. Please try again.
      </p>
      <a
        href="/login"
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
      >
        Back to Login
      </a>
    </div>
  </div>
);

const SSOCallback = () => {
  const { handleRedirectCallback } = useClerk();
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const result = await handleRedirectCallback({});
        
        // Type assertion to access createdSessionId safely
        const typedResult = result as { createdSessionId?: string };
        
        // Redirect to plan page regardless of whether user signed up or signed in
        navigate("/plan");
      } catch (error) {
        console.error("Error during OAuth callback:", error);
        setError(true);
      }
    };

    handleCallback();
  }, [handleRedirectCallback, navigate]);

  if (error) {
    return <AuthErrorComponent />;
  }

  return <SSOCallbackLoading />;
};

export default SSOCallback;