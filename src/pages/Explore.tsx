import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Building2, 
  Store, 
  UtensilsCrossed, 
  Phone,
  Star,
  Navigation,
  Clock
} from "lucide-react";

const categories = [
  { id: "places", label: "Heritage Sites", icon: MapPin },
  { id: "hotels", label: "Hotels", icon: Building2 },
  { id: "shops", label: "Shops", icon: Store },
  { id: "restaurants", label: "Restaurants", icon: UtensilsCrossed },
  { id: "emergency", label: "Emergency", icon: Phone },
];

const mockListings = [
  {
    id: 1,
    category: "places",
    name: "Sadhna Top",
    description: "A strategic mountain pass at 12,000 feet with stunning views and historical significance.",
    rating: 4.8,
    distance: "15 km",
    openHours: "Sunrise - Sunset",
  },
  {
    id: 2,
    category: "places",
    name: "Teetwal War Memorial",
    description: "A solemn tribute to the brave soldiers who defended this border region.",
    rating: 4.9,
    distance: "8 km",
    openHours: "6 AM - 6 PM",
  },
  {
    id: 3,
    category: "hotels",
    name: "Border View Resort",
    description: "Comfortable accommodation with panoramic mountain views and local hospitality.",
    rating: 4.2,
    distance: "2 km",
    openHours: "24 Hours",
  },
  {
    id: 4,
    category: "hotels",
    name: "Heritage Stay Karnah",
    description: "Traditional homestay experience with authentic local cuisine.",
    rating: 4.5,
    distance: "5 km",
    openHours: "24 Hours",
  },
  {
    id: 5,
    category: "restaurants",
    name: "Himalayan Kitchen",
    description: "Authentic Kashmiri cuisine with fresh mountain ingredients.",
    rating: 4.3,
    distance: "1 km",
    openHours: "8 AM - 10 PM",
  },
  {
    id: 6,
    category: "emergency",
    name: "Army Medical Post",
    description: "24/7 medical assistance for tourists and locals.",
    rating: 5.0,
    distance: "3 km",
    openHours: "24 Hours",
  },
];

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "places";

  const filteredListings = mockListings.filter(
    (listing) => listing.category === activeCategory
  );

  const handleCategoryChange = (categoryId: string) => {
    setSearchParams({ category: categoryId });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Explore <span className="text-gradient-gold">Karnah Region</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Discover verified local businesses, heritage sites, and essential services
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              return (
                <Button
                  key={category.id}
                  variant={isActive ? "hero" : "glass"}
                  size="sm"
                  onClick={() => handleCategoryChange(category.id)}
                  className="gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </Button>
              );
            })}
          </div>

          {/* Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredListings.map((listing) => (
              <div
                key={listing.id}
                className="glass-card rounded-xl overflow-hidden hover:border-accent/50 transition-all duration-300 group"
              >
                {/* Placeholder Image */}
                <div className="h-40 bg-gradient-to-br from-olive/30 to-muted flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-muted-foreground/50" />
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                      {listing.name}
                    </h3>
                    <div className="flex items-center gap-1 text-accent">
                      <Star className="w-4 h-4 fill-accent" />
                      <span className="text-sm font-medium">{listing.rating}</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {listing.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Navigation className="w-3.5 h-3.5" />
                      {listing.distance}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {listing.openHours}
                    </div>
                  </div>

                  <Button variant="military" size="sm" className="w-full mt-4">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredListings.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                No listings found in this category. Check back soon!
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Explore;
