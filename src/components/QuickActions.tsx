import { Link } from "react-router-dom";
import { 
  History, 
  MapPin, 
  Building2, 
  Store, 
  UtensilsCrossed, 
  Phone,
  ArrowRight
} from "lucide-react";

const actions = [
  {
    icon: History,
    title: "Army History",
    description: "Explore stories of valor and sacrifice",
    color: "from-olive to-olive-light",
    link: "/chat?topic=history",
  },
  {
    icon: MapPin,
    title: "Places to Visit",
    description: "Discover heritage sites and landmarks",
    color: "from-secondary to-secondary/80",
    link: "/explore?category=places",
  },
  {
    icon: Building2,
    title: "Nearby Hotels",
    description: "Find verified accommodations",
    color: "from-olive-dark to-olive",
    link: "/explore?category=hotels",
  },
  {
    icon: Store,
    title: "Shops & Essentials",
    description: "Local shops and supplies",
    color: "from-secondary/90 to-secondary/70",
    link: "/explore?category=shops",
  },
  {
    icon: UtensilsCrossed,
    title: "Restaurants",
    description: "Local dining options",
    color: "from-olive-light to-olive",
    link: "/explore?category=restaurants",
  },
  {
    icon: Phone,
    title: "Emergency Help",
    description: "Quick access to help points",
    color: "from-destructive/80 to-destructive/60",
    link: "/explore?category=emergency",
  },
];

const QuickActions = () => {
  return (
    <section id="features" className="py-20 bg-hero-pattern">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Quick <span className="text-gradient-gold">Actions</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Everything you need for your border-area visit, all in one place
          </p>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.link}
                className="group glass-card rounded-xl p-6 hover:border-accent/50 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color} shadow-lg`}>
                    <Icon className="w-6 h-6 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-semibold text-foreground mb-1 group-hover:text-accent transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default QuickActions;
