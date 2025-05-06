import { Card, CardContent } from "@/components/ui/card";
import { Compass, MapPin, Coffee, Utensils, Camera, TreePalm, Music } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface NearbyAttractionsDisplayProps {
  content: string;
  location: string;
}

// Categories and their icons
const categoryIcons: Record<string, any> = {
  "Food": Utensils,
  "Restaurant": Utensils,
  "Café": Coffee,
  "Cafe": Coffee,
  "Coffee": Coffee,
  "Culture": Camera,
  "Museum": Camera,
  "Art": Camera,
  "Nature": TreePalm,
  "Park": TreePalm,
  "Garden": TreePalm,
  "Entertainment": Music,
  "Music": Music,
  "Default": Compass
};

export function NearbyAttractionsDisplay({ content, location }: NearbyAttractionsDisplayProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Improved parsing function to handle various formats and clean up unwanted characters
  const parseContent = () => {
    // First, clean the input content
    const cleanedContent = content
      .replace(/\*\*/g, "") // Remove asterisks
      .replace(/^\s*\d+\.\s*/gm, "- ") // Convert numbered lists to bullet points
      .replace(/^\s*\*\s*/gm, "- "); // Normalize bullet points
    
    const lines = cleanedContent.split('\n');
    let currentCategory = "";
    const categories: Record<string, Array<{ name: string, description: string }>> = {};
    
    // Process each line to extract categories and attractions
    for (let i = 0; i < lines.length; i++) {
      const trimmedLine = lines[i].trim();
      
      // Skip empty lines
      if (!trimmedLine) continue;
      
      // Check if line is a category header (ends with a colon or matches known categories)
      if (trimmedLine.match(/^([A-Za-z&\s]+):$/i)) {
        const match = trimmedLine.match(/^([A-Za-z&\s]+):$/i);
        if (match) {
          currentCategory = match[1].trim();
          if (!categories[currentCategory]) {
            categories[currentCategory] = [];
          }
        }
      }
      // Special handling for known categories without colons
      else if (trimmedLine.match(/^(Food|Entertainment\/Relaxation|Nature & Culture|Important Tips)$/i)) {
        currentCategory = trimmedLine;
        if (!categories[currentCategory]) {
          categories[currentCategory] = [];
        }
      }
      // Check if line starts with a bullet point or dash, indicating an attraction
      else if (trimmedLine.match(/^[-•]\s+/) && currentCategory) {
        // Extract attraction name and description
        const parts = trimmedLine.replace(/^[-•]\s+/, "").split(" - ");
        
        if (parts.length >= 2) {
          categories[currentCategory].push({
            name: parts[0].trim(),
            description: parts.slice(1).join(" - ").trim()
          });
        } else {
          // If no description separator found, use the whole line as the name
          categories[currentCategory].push({
            name: parts[0].trim(),
            description: ""
          });
        }
      }
      // If line contains a location pattern like "Something (Location)" without bullet
      else if (currentCategory && trimmedLine.match(/(.+?)\s+\((.+?)\)$/)) {
        const match = trimmedLine.match(/(.+?)\s+\((.+?)\)$/);
        if (match) {
          categories[currentCategory].push({
            name: match[1].trim(),
            description: `Located in ${match[2].trim()}`
          });
        }
      }
      // If it's not any of the above and we're in a category, it might be a standalone item
      else if (currentCategory && !trimmedLine.match(/^(Here are|Important)/i)) {
        // Check if it's not a repeated header or instruction text
        if (!trimmedLine.match(/opening hours|call ahead|keeping in mind/i)) {
          categories[currentCategory].push({
            name: trimmedLine,
            description: ""
          });
        }
      }
    }
    
    // Filter out empty categories and handle special cases
    Object.keys(categories).forEach(category => {
      // Remove categories with no attractions
      if (categories[category].length === 0) {
        delete categories[category];
      }
      
      // Handle "Important Considerations" - rename to "Important Tips" for better UX
      if (category.includes("Considerations")) {
        const newCategory = "Important Tips";
        categories[newCategory] = categories[category];
        delete categories[category];
      }
    });
    
    return categories;
  };
  
  const categories = parseContent();
  const categoryNames = Object.keys(categories);
  
  // Determine icon for a category
  const getCategoryIcon = (category: string) => {
    for (const [key, Icon] of Object.entries(categoryIcons)) {
      if (category.toLowerCase().includes(key.toLowerCase())) {
        return Icon;
      }
    }
    return categoryIcons.Default;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
        <div className="flex items-center space-x-3 mb-4">
          <MapPin className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Nearby Attractions in {location}</h2>
        </div>
        
        <p className="text-gray-700 mb-6">
          Here are some interesting places to visit right now in your area, based on your current location.
        </p>
        
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categoryNames.map((category) => {
            const Icon = getCategoryIcon(category);
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(activeCategory === category ? null : category)}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category 
                    ? 'bg-blue-100 text-blue-800 shadow-inner' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {category}
              </button>
            );
          })}
        </div>
        
        {/* Attractions list */}
        <div className="space-y-4">
          {categoryNames
            .filter(category => activeCategory === null || category === activeCategory)
            .map((category) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  {(() => {
                    const IconComponent = getCategoryIcon(category);
                    return <IconComponent className="w-5 h-5 mr-2 text-blue-600" />;
                  })()}
                  {category}
                </h3>
                
                <div className="grid gap-3 md:grid-cols-2">
                  {categories[category].map((attraction, index) => (
                    <Card key={`${category}-${index}`} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <h4 className="font-medium text-blue-800">{attraction.name}</h4>
                        {attraction.description && (
                          <p className="text-sm text-gray-600 mt-1">{attraction.description}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
}