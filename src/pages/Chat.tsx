import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, LogIn, Settings, LogOut } from "lucide-react";
import ChatInterface from "@/components/ChatInterface";
import AdminSettings from "@/components/AdminSettings";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Chat = () => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Minimal Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border/30">
        <div className="flex items-center gap-3">
          <Link 
            to="/" 
            className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <img src={logo} alt="Gaurav Gatha" className="h-8 w-8 object-contain rounded" />
            <span className="font-display text-lg font-bold text-gradient-gold hidden sm:inline">
              Gaurav Gatha
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent font-medium">
              AI Guide
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(true)}
                  className="gap-2"
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Settings</span>
                </Button>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="hidden sm:inline">{user.email?.split("@")[0]}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="gap-2">
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Login</span>
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-hidden">
        <ChatInterface />
      </main>

      {/* Admin Settings Panel */}
      <AdminSettings isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
};

export default Chat;
