import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, BookOpen, ArrowRight } from "lucide-react";

const stories = [
  {
    title: "The Battle of Sadhna Top",
    excerpt: "A tale of extraordinary courage at 12,000 feet",
    category: "Battle History",
    readTime: "5 min read",
  },
  {
    title: "Guardians of Teetwal",
    excerpt: "How a small post held against impossible odds",
    category: "Martyr Story",
    readTime: "8 min read",
  },
  {
    title: "The Karnah Legacy",
    excerpt: "Military contributions to local development",
    category: "Heritage",
    readTime: "6 min read",
  },
];

const HeritageShowcase = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-xs text-accent font-medium uppercase tracking-wider">
                Featured Stories
              </span>
            </div>

            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Stories of{" "}
              <span className="text-gradient-gold">Unmatched Bravery</span>
            </h2>

            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Discover the untold stories of Indian Army's valor, sacrifice, 
              and their lasting contributions to border communities. Each story 
              is a testament to the indomitable spirit of our soldiers.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/heritage">
                <Button variant="hero" size="lg" className="gap-2">
                  <BookOpen className="w-5 h-5" />
                  Explore Heritage
                </Button>
              </Link>
              <Button variant="glass" size="lg" className="gap-2">
                <Play className="w-5 h-5" />
                Watch Stories
              </Button>
            </div>
          </div>

          {/* Right Content - Story Cards */}
          <div className="space-y-4">
            {stories.map((story, index) => (
              <Link
                key={index}
                to={`/heritage/${index}`}
                className="group block glass-card rounded-xl p-5 hover:border-accent/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2 py-0.5 rounded-md bg-olive/30 text-xs font-medium text-olive-light">
                        {story.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {story.readTime}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-accent transition-colors mb-1">
                      {story.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {story.excerpt}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeritageShowcase;
