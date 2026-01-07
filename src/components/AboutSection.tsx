import { useState, useEffect, useRef } from "react";
import { 
  Shield, 
  Users, 
  Instagram, 
  MapPin, 
  School, 
  Heart, 
  Mountain, 
  Star,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const founders = [
    {
      name: "Ubaid ur Rehman",
      role: "Co-Founder & Developer",
      icon: Star,
    },
    {
      name: "Fazdha Mushtaq",
      role: "Co-Founder & Developer",
      icon: Star,
    },
  ];

  const features = [
    {
      icon: Mountain,
      title: "Karnah Valley Heritage",
      description: "Preserving the rich history of border regions",
    },
    {
      icon: Shield,
      title: "Army Heritage",
      description: "Honoring the sacrifices of our brave soldiers",
    },
    {
      icon: Heart,
      title: "Responsible Tourism",
      description: "Promoting respectful travel experiences",
    },
    {
      icon: Sparkles,
      title: "AI-Powered Guide",
      description: "24/7 intelligent assistance for visitors",
    },
  ];

  const socialLinks = [
    {
      name: "AI Dev Studio",
      handle: "@aidevstudio.team",
      url: "https://www.instagram.com/aidevstudio.team?igsh=YnhsdmV3b3dkMDJv",
      description: "Tech & Development Updates",
    },
    {
      name: "Rooh-e-Karnah",
      handle: "@rooh_e_karnah",
      url: "https://www.instagram.com/rooh_e_karnah?igsh=MW9oamhrejM4MjJ6eQ==",
      description: "Culture & Heritage Content",
    },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen py-20 overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 military-pattern opacity-30" />
      
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-accent/30 mb-6">
            <Shield className="w-4 h-4 text-accent" />
            <span className="text-sm text-accent font-medium">About Gaurav Gatha</span>
          </div>
          
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-foreground">Story of</span>{" "}
            <span className="text-gradient-gold">Valor</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A digital heritage, history, and tourism guidance platform focused on 
            Karnah Valley and border regions of Jammu & Kashmir.
          </p>
        </div>

        {/* Platform Identity Card */}
        <div className={`max-w-4xl mx-auto mb-16 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="glass-card rounded-2xl p-8 border border-accent/20">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center border border-accent/30">
                  <Shield className="w-16 h-16 text-accent" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-display text-3xl font-bold text-foreground mb-2">
                  Gaurav Gatha
                </h3>
                <p className="text-accent font-medium mb-3">गौरव गाथा • "Veerata Ki Kahani"</p>
                <p className="text-muted-foreground leading-relaxed">
                  "Gaurav" means pride/honor, "Gatha" means story/epic. Together, Gaurav Gatha 
                  represents the "Story of Valor" - a tribute to the brave soldiers who protect 
                  our borders and the rich heritage of the Karnah Valley region.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card rounded-xl p-6 border border-border/50 hover:border-accent/30 transition-all duration-300 group hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <feature.icon className="w-6 h-6 text-accent" />
              </div>
              <h4 className="font-display font-semibold text-foreground mb-2">
                {feature.title}
              </h4>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Founders Section */}
        <div className={`mb-16 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-4">
              <Users className="w-4 h-4 text-accent" />
              <span className="text-sm text-accent">Founders</span>
            </div>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Meet the Team
            </h3>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            {founders.map((founder, index) => (
              <div
                key={founder.name}
                className="glass-card rounded-2xl p-8 border border-border/50 hover:border-accent/30 transition-all duration-300 text-center group hover:-translate-y-2"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <founder.icon className="w-10 h-10 text-accent" />
                </div>
                <h4 className="font-display text-xl font-bold text-foreground mb-1">
                  {founder.name}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {founder.role}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Institution */}
        <div className={`max-w-2xl mx-auto mb-16 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="glass-card rounded-2xl p-8 border border-accent/20 text-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <School className="w-8 h-8 text-accent" />
            </div>
            <p className="text-sm text-accent font-medium mb-2">Developed By</p>
            <h4 className="font-display text-xl md:text-2xl font-bold text-foreground mb-2">
              Students of Army Goodwill Higher Secondary School
            </h4>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4 text-accent" />
              <span>Hajinar, Kupwara, Jammu & Kashmir</span>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className={`transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-4">
              <Instagram className="w-4 h-4 text-accent" />
              <span className="text-sm text-accent">Follow Us</span>
            </div>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Connect With Us
            </h3>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 max-w-2xl mx-auto">
            {socialLinks.map((social, index) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 w-full glass-card rounded-xl p-6 border border-border/50 hover:border-accent/50 transition-all duration-300 group hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Instagram className="w-6 h-6 text-pink-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      {social.name}
                      <ExternalLink className="w-3 h-3 text-muted-foreground" />
                    </h4>
                    <p className="text-sm text-accent">{social.handle}</p>
                    <p className="text-xs text-muted-foreground">{social.description}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
