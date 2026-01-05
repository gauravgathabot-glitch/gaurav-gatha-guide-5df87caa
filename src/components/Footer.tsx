import { Link } from "react-router-dom";
import { Shield, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
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
                  Army Heritage Guide
                </p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your trusted AI guide to Indian Army heritage, border-area tourism, 
              and stories of valor.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-2">
              {["Heritage Sites", "Martyr Stories", "Battle History", "Local Tourism"].map((link) => (
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
              {["AI Guide", "Travel Tips", "Emergency Help", "Contact Admin"].map((link) => (
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

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-accent" />
                Karnah, Jammu & Kashmir
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-accent" />
                contact@gauravgatha.in
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-accent" />
                Emergency: 112
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Gaurav Gatha. A tribute to the Indian Armed Forces.
          </p>
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
