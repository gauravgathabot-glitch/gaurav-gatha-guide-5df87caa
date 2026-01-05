import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  MoreHorizontal, 
  Settings, 
  User, 
  LogIn, 
  LogOut, 
  Plus, 
  History,
  Palette,
  ChevronRight
} from "lucide-react";
import ChatInterface from "@/components/ChatInterface";
import AdminSettings from "@/components/AdminSettings";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { useTheme } from "@/hooks/useTheme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/logo.png";

const Chat = () => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const { theme, setTheme, themes } = useTheme();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);

  const handleNewChat = () => {
    window.location.reload();
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header - Like ChatGPT with logo left, menu right */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border/30">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Gaurav Gatha" className="h-8 w-8 object-contain rounded" />
          <span className="font-display text-lg font-bold text-gradient-gold">
            Gaurav Gatha
          </span>
        </Link>
        
        {/* 3-dots Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <MoreHorizontal className="w-5 h-5 text-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-card border-border">
            {/* New Chat */}
            <DropdownMenuItem onClick={handleNewChat} className="cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </DropdownMenuItem>
            
            {/* Chat History - Only for logged in users */}
            {user && (
              <DropdownMenuItem className="cursor-pointer">
                <History className="w-4 h-4 mr-2" />
                Chat History
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator />
            
            {/* Theme Selector */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="cursor-pointer">
                <Palette className="w-4 h-4 mr-2" />
                Theme
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="bg-card border-border">
                  {themes.map((t) => (
                    <DropdownMenuItem
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`cursor-pointer ${theme === t.id ? "bg-accent/20" : ""}`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{t.name}</span>
                        {theme === t.id && (
                          <div className="w-2 h-2 rounded-full bg-accent" />
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            
            <DropdownMenuSeparator />
            
            {user ? (
              <>
                {/* Admin Settings */}
                {isAdmin && (
                  <DropdownMenuItem 
                    onClick={() => setShowSettings(true)} 
                    className="cursor-pointer"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Admin Settings
                  </DropdownMenuItem>
                )}
                
                {/* Account Info */}
                <DropdownMenuItem className="cursor-pointer">
                  <User className="w-4 h-4 mr-2" />
                  <span className="truncate">{user.email}</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                {/* Logout */}
                <DropdownMenuItem 
                  onClick={signOut} 
                  className="cursor-pointer text-destructive"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem 
                  onClick={() => navigate("/auth")} 
                  className="cursor-pointer"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate("/auth?signup=true")} 
                  className="cursor-pointer"
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign Up
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
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
