import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Play, BookOpen, Medal, Sword, Flag, Users } from "lucide-react";

const heritageItems = [
  {
    id: 1,
    title: "The Battle of Sadhna Top",
    category: "Battle History",
    excerpt: "In 1947, a small group of soldiers defended this strategic pass against overwhelming odds, securing a crucial victory that shaped the region's history.",
    icon: Sword,
    hasVideo: true,
    hasAudio: true,
  },
  {
    id: 2,
    title: "Guardians of Teetwal",
    category: "Martyr Stories",
    excerpt: "The brave men who gave their lives defending the Teetwal sector, their sacrifice remembered through generations of grateful citizens.",
    icon: Medal,
    hasVideo: false,
    hasAudio: true,
  },
  {
    id: 3,
    title: "Operation Karnah Shield",
    category: "Military Operations",
    excerpt: "A comprehensive look at the military operations that ensured peace and stability in the Karnah region over the decades.",
    icon: Flag,
    hasVideo: true,
    hasAudio: false,
  },
  {
    id: 4,
    title: "Army & Community Partnership",
    category: "Development",
    excerpt: "How the Indian Army has contributed to local infrastructure, education, and healthcare, building bridges with border communities.",
    icon: Users,
    hasVideo: false,
    hasAudio: true,
  },
];

const Heritage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-accent/30 mb-6">
              <Medal className="w-4 h-4 text-accent" />
              <span className="text-sm text-accent font-medium">Army Heritage</span>
            </div>

            <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              Stories of <span className="text-gradient-gold">Valor & Sacrifice</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Discover the rich military heritage of the Karnah region through documented 
              stories, videos, and audio narratives curated with respect and authenticity.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="hero" size="lg" className="gap-2">
                <Play className="w-5 h-5" />
                Watch Documentary
              </Button>
              <Button variant="glass" size="lg" className="gap-2">
                <BookOpen className="w-5 h-5" />
                Read Stories
              </Button>
            </div>
          </div>

          {/* Heritage Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {heritageItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="glass-card rounded-xl p-6 hover:border-accent/50 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-olive/30 border border-olive-light/20 group-hover:bg-accent/20 group-hover:border-accent/30 transition-colors">
                      <Icon className="w-6 h-6 text-olive-light group-hover:text-accent transition-colors" />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-medium text-accent uppercase tracking-wider">
                        {item.category}
                      </span>
                      <h3 className="font-display text-xl font-semibold text-foreground mt-1 mb-2 group-hover:text-accent transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {item.excerpt}
                      </p>

                      <div className="flex items-center gap-3">
                        {item.hasVideo && (
                          <Button variant="military" size="sm" className="gap-2">
                            <Play className="w-4 h-4" />
                            Watch
                          </Button>
                        )}
                        {item.hasAudio && (
                          <Button variant="glass" size="sm" className="gap-2">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                              />
                            </svg>
                            Listen
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          Read More
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Timeline Teaser */}
          <div className="mt-20 text-center">
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">
              Historical <span className="text-gradient-gold">Timeline</span>
            </h2>
            <p className="text-muted-foreground mb-6">
              Explore key events that shaped the military history of this region
            </p>
            <div className="flex justify-center">
              <div className="glass-card rounded-xl p-8 max-w-md">
                <p className="text-sm text-muted-foreground">
                  🔒 Login required to access the complete historical timeline, 
                  interactive maps, and detailed battle analyses.
                </p>
                <Button variant="hero" size="sm" className="mt-4">
                  Login to Explore
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Heritage;
