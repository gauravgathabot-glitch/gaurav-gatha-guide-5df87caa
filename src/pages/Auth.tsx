import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Mail, Lock, User, ArrowLeft, Eye, EyeOff } from "lucide-react";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsSignup(searchParams.get("signup") === "true");
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Placeholder for auth logic (will be connected to Supabase later)
    setTimeout(() => {
      setIsLoading(false);
      alert("Authentication requires Lovable Cloud to be enabled. This is a demo.");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-hero-pattern flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Auth Card */}
        <div className="glass-card rounded-2xl p-8 shadow-elevated">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-accent/10 border border-accent/30">
              <Shield className="w-8 h-8 text-accent" />
            </div>
            <div className="text-left">
              <h1 className="font-display text-xl font-bold text-foreground">
                Gaurav Gatha
              </h1>
              <p className="text-xs text-muted-foreground">Army Heritage Guide</p>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">
              {isSignup ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isSignup
                ? "Sign up to access voice, image, and full heritage content"
                : "Sign in to continue your heritage exploration"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full bg-muted/50 border border-border/50 rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 transition-colors"
                    required={isSignup}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                  className="w-full bg-muted/50 border border-border/50 rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  className="w-full bg-muted/50 border border-border/50 rounded-xl pl-10 pr-12 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isSignup && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-xs text-accent hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading
                ? "Please wait..."
                : isSignup
                ? "Create Account"
                : "Sign In"}
            </Button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isSignup ? "Already have an account?" : "Don't have an account?"}
              <button
                onClick={() => setIsSignup(!isSignup)}
                className="ml-2 text-accent hover:underline font-medium"
              >
                {isSignup ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>

          {/* Access Info */}
          <div className="mt-8 p-4 rounded-xl bg-olive/10 border border-olive/20">
            <p className="text-xs text-muted-foreground text-center">
              <strong className="text-foreground">Why sign up?</strong> Get access to voice 
              interactions, image queries, video content, and the complete heritage archive.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
