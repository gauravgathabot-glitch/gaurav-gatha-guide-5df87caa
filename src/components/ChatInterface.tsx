import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Send, 
  Mic, 
  Image, 
  History, 
  MapPin, 
  Building2, 
  Store,
  Loader2,
  Bot
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const quickPrompts = [
  { icon: History, label: "Army History", prompt: "Tell me about the army history of this region" },
  { icon: MapPin, label: "Places", prompt: "What are the must-visit places nearby?" },
  { icon: Building2, label: "Hotels", prompt: "Show me nearby hotels and accommodations" },
  { icon: Store, label: "Shops", prompt: "Where can I find essential supplies?" },
];

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Jai Hind! I'm your Gaurav Gatha AI Guide. I can help you explore Indian Army heritage, find local tourism information, and answer questions about this border region. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn] = useState(false); // This will be connected to auth later

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response (will be connected to Lovable AI later)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Thank you for your question! To provide you with accurate information about army heritage and local tourism, please connect this platform to Lovable Cloud. This will enable real-time AI responses and access to the complete knowledge base.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="flex flex-col h-full bg-card-gradient rounded-2xl border border-border/50 overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border/50">
        <div className="p-2 rounded-xl bg-accent/10 border border-accent/30">
          <Bot className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-foreground">AI Guide</h3>
          <p className="text-xs text-muted-foreground">Always ready to assist</p>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-muted-foreground">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                message.role === "user"
                  ? "bg-accent text-accent-foreground rounded-br-md"
                  : "glass-card rounded-bl-md"
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="glass-card rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-accent" />
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="p-4 border-t border-border/50">
        <div className="flex flex-wrap gap-2 mb-4">
          {quickPrompts.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => handleQuickPrompt(item.prompt)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card hover:border-accent/50 transition-colors text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Input Area */}
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about heritage, places, or travel tips..."
              className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 pr-20 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 transition-colors"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {isLoggedIn ? (
                <>
                  <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground">
                    <Image className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground">
                    <Mic className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <span className="text-[10px] text-muted-foreground mr-2">
                  Login for voice & image
                </span>
              )}
            </div>
          </div>
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            variant="hero"
            size="icon"
            className="rounded-xl h-12 w-12"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
