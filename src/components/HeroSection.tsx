import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle, MapPin, CalendarDays, ChevronDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/50 to-charcoal" />
        <div className="absolute inset-0 military-pattern" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-accent/30 mb-8 animate-fade-in">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse-gold" />
            <span className="text-sm text-accent font-medium tracking-wide">
              Digital Border Guide
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-slide-up">
            <span className="text-foreground">Explore History.</span>
            <br />
            <span className="text-gradient-gold">Respect Sacrifice.</span>
            <br />
            <span className="text-foreground">Travel Responsibly.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            Your AI-powered guide to Indian Army heritage sites, border-area tourism, 
            and stories of unmatched bravery. One platform. One purpose.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <Link to="/chat">
              <Button variant="hero" size="xl" className="gap-3">
                <MessageCircle className="w-5 h-5" />
                Ask the Guide
              </Button>
            </Link>
            <Link to="/explore">
              <Button variant="military" size="xl" className="gap-3">
                <MapPin className="w-5 h-5" />
                Explore Places
              </Button>
            </Link>
            <Link to="/heritage">
              <Button variant="glass" size="xl" className="gap-3">
                <CalendarDays className="w-5 h-5" />
                Plan Your Visit
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto animate-fade-in" style={{ animationDelay: "0.7s" }}>
            {[
              { value: "50+", label: "Heritage Sites" },
              { value: "100+", label: "Martyr Stories" },
              { value: "24/7", label: "AI Guide" },
            ].map((stat, index) => (
              <div key={index} className="glass-card rounded-xl p-4">
                <div className="text-2xl md:text-3xl font-display font-bold text-accent">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 p-3 rounded-full glass-card border border-accent/30 hover:border-accent/60 transition-colors animate-float cursor-pointer"
      >
        <ChevronDown className="w-5 h-5 text-accent" />
      </button>
    </section>
  );
};

export default HeroSection;
