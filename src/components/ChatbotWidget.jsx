import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User } from 'lucide-react';

const ChatbotWidget = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! I'm your AI travel assistant. I can help you with destination recommendations, travel tips, best times to visit places, and much more. What would you like to know?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const predefinedResponses = {
    'hello': "Hello! I'm here to help you plan your perfect trip. What destination are you interested in?",
    'budget': "For budget planning, consider these factors: accommodation (30-40% of budget), food (20-25%), activities (15-20%), transportation (15-20%), and emergency fund (10-15%). Would you like specific advice for a destination?",
    'paris': "Paris is amazing! Best time to visit is April-June or September-October. Must-see: Eiffel Tower, Louvre, Notre-Dame area, Montmartre. Budget around $100-150/day for mid-range travel. Try local bistros and walk along the Seine!",
    'tokyo': "Tokyo is incredible! Best time is March-May or September-November. Must-do: Shibuya crossing, Senso-ji Temple, Tsukiji Market, Harajuku. Budget $80-120/day. Don't miss the convenience stores and try different neighborhoods!",
    'italy': "Italy is beautiful! Rome for history, Florence for art, Venice for romance, Milan for fashion. Spring and fall are ideal. Budget varies by region - south is cheaper. Always try local cuisine and book accommodations early!",
    'safety': "Travel safety tips: Research your destination, keep copies of documents, stay aware of surroundings, use reputable transport, have emergency contacts, get travel insurance, and trust your instincts. What specific safety concerns do you have?",
    'packing': "Packing essentials: Check weather, roll clothes to save space, pack versatile items, bring comfortable walking shoes, essential medications, portable charger, and copies of documents. Pack light - you can buy things there!"
  };

  const getResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    for (const [key, response] of Object.entries(predefinedResponses)) {
      if (input.includes(key)) {
        return response;
      }
    }
    
    // Default responses for common travel queries
    if (input.includes('where') || input.includes('destination')) {
      return "There are so many amazing destinations! Are you looking for beaches, cities, mountains, or cultural experiences? I can recommend places based on your interests and budget.";
    }
    
    if (input.includes('when') || input.includes('time')) {
      return "The best time to travel depends on your destination and preferences. Generally, shoulder seasons (spring/fall) offer good weather and fewer crowds. Which destination are you considering?";
    }
    
    if (input.includes('cost') || input.includes('price') || input.includes('money')) {
      return "Travel costs vary greatly by destination and travel style. I can help you estimate costs if you tell me where you're planning to go and your accommodation preferences.";
    }
    
    if (input.includes('food') || input.includes('eat')) {
      return "Food is one of the best parts of travel! I recommend trying local street food, visiting local markets, and asking locals for recommendations. Which cuisine are you excited to try?";
    }
    
    return "That's a great question! I'd love to help you with more specific travel advice. Could you tell me more about your destination or what aspect of travel planning you need help with?";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const response = getResponse(input);
      const botMessage = {
        id: Date.now() + 1,
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    'Budget tips for Europe',
    'Best time to visit Japan',
    'Safety tips for solo travel',
    'What to pack for a week trip'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Bot className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">AI Travel Assistant</h2>
              <p className="text-sm text-gray-500">Always here to help plan your trip</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex items-start space-x-2 max-w-[80%] ${
                  message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === 'user'
                      ? 'bg-blue-500'
                      : 'bg-gray-100'
                  }`}
                >
                  {message.sender === 'user' ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-gray-600" />
                  )}
                </div>
                <div
                  className={`px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-gray-600" />
                </div>
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="px-4 pb-4">
            <p className="text-sm text-gray-600 mb-2">Quick questions to get started:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInput(question)}
                  className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about travel..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotWidget;