import { Link } from "react-router-dom";
import { Shield, Mail, MapPin, Phone, Instagram, Users } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & About */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-accent/10 border border-accent/30">
                <Shield className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">
                  Gaurav Gatha
                </h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                  Karnah Border Heritage
                </p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              A digital heritage, history, and tourism guidance platform focused on 
              Karnah Valley and border regions of Jammu & Kashmir.
            </p>
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="flex items-center gap-2">
                <Users className="w-3 h-3 text-accent" />
                <span className="font-medium">Founders:</span> Ubaid ur Rehman & Fazdha Mushtaq
              </p>
              <p className="text-muted-foreground/80">
                Developed by Students of AGS Hajinar
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-2">
              {["Heritage Sites", "Karnah Valley", "Sadhna Top", "Teetwal History"].map((link) => (
                <li key={link}>
                  <Link
                    to="/explore"
                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-2">
              {["AI Guide", "Travel Tips", "Emergency Help", "AGS Hajinar"].map((link) => (
                <li key={link}>
                  <Link
                    to="/chat"
                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              Connect
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-accent" />
                Karnah, Kupwara, J&K
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-accent" />
                Emergency: 112
              </li>
              <li>
                <a 
                  href="https://www.instagram.com/aidevstudio.team" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  <Instagram className="w-4 h-4 text-accent" />
                  @aidevstudio.team
                </a>
              </li>
              <li>
                <a 
                  href="https://www.instagram.com/rooh_e_karnah" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  <Instagram className="w-4 h-4 text-accent" />
                  @rooh_e_karnah
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Gaurav Gatha. Preserving Heritage, Honoring Valor.
            </p>
            <p className="text-[10px] text-muted-foreground/70 mt-1">
              Army Goodwill Higher Secondary School, Hajinar
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-accent transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-accent transition-colors">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
