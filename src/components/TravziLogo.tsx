
export function TravziLogo() {
  return (
    <div className="flex items-center justify-center">
      <div className="bg-purple-600 text-white p-3 rounded-xl shadow-lg transform -rotate-3">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="lucide lucide-plane"
        >
          <path d="M17.8 19.2 16 11l3.5-7.3c.4-.8-.4-1.7-1.3-1.4L5.5 6.7C5 6.8 4.6 7.2 4.5 7.8L3 15c-.1.6.4 1.2 1.1 1.2l3.3.2 1.7 5c.2.6.8.8 1.3.5l1.8-1.1c.2-.1.3-.2.3-.4l.1-2 2.1-1.3c.2-.1.3-.3.4-.5l.7-3.6 3.7 5.1c.4.5 1.2.5 1.6 0l1.3-1.6c.4-.5.3-1.1-.2-1.5z"/>
        </svg>
      </div>
      <span className="text-4xl font-bold ml-2 text-purple-900">Travzi</span>
    </div>
  );
}
