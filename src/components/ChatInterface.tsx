import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Send, 
  Mic, 
  Image, 
  Loader2,
  Sparkles,
  Plus,
  MicOff,
  X,
  User
} from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const suggestions = [
  "Tell me about the Kargil War",
  "Find nearby hotels",
  "Emergency contacts",
  "Heritage sites to visit",
];

const ChatInterface = () => {
  const { messages, isLoading, sendMessage, clearMessages } = useChat();
  const { isRecording, isTranscribing, startRecording, stopRecording } = useVoiceRecording();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;
    if (isLoading) return;

    const messageContent = input.trim();
    setInput("");
    setSelectedImage(null);
    setImagePreview(null);
    
    await sendMessage(messageContent, selectedImage || undefined);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceClick = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to use voice input",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    try {
      if (isRecording) {
        const text = await stopRecording();
        if (text) setInput(prev => prev + " " + text);
      } else {
        await startRecording();
      }
    } catch (error) {
      toast({
        title: "Voice Error",
        description: "Could not access microphone",
        variant: "destructive",
      });
    }
  };

  const handleImageClick = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to use image queries",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    fileInputRef.current?.click();
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(",")[1];
      setSelectedImage(base64);
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-background" />
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
              Jai Hind!
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              I'm your Gaurav Gatha AI Guide. Ask me about Indian Army heritage, local tourism, or get travel help.
            </p>
            
            <div className="grid grid-cols-2 gap-3 w-full max-w-md">
              {suggestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestion(suggestion)}
                  className="p-3 text-left text-sm rounded-xl border border-border/50 bg-card/50 hover:bg-card hover:border-accent/30 transition-all text-muted-foreground hover:text-foreground"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-accent" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted/50"
                  }`}
                >
                  <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
                {message.role === "user" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-accent" />
                </div>
                <div className="bg-muted/50 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-accent" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border/30">
        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-3 relative inline-block">
            <img 
              src={imagePreview} 
              alt="Selected" 
              className="h-20 rounded-lg object-cover"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        <div className="flex items-end gap-2 bg-muted/30 rounded-2xl border border-border/50 p-2">
          {/* Action buttons */}
          <div className="flex gap-1">
            <button
              onClick={handleImageClick}
              className="p-2 rounded-xl hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
              title={user ? "Attach image" : "Login to attach images"}
            >
              <Image className="w-5 h-5" />
            </button>
          </div>

          {/* Text Input */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Gaurav Gatha..."
            className="flex-1 bg-transparent border-none outline-none resize-none text-sm md:text-base text-foreground placeholder:text-muted-foreground min-h-[24px] max-h-[200px] py-2"
            rows={1}
          />

          {/* Voice & Send buttons */}
          <div className="flex gap-1">
            <button
              onClick={handleVoiceClick}
              disabled={isTranscribing}
              className={`p-2 rounded-xl transition-colors ${
                isRecording 
                  ? "bg-destructive text-destructive-foreground animate-pulse" 
                  : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
              }`}
              title={user ? (isRecording ? "Stop recording" : "Start voice input") : "Login for voice input"}
            >
              {isTranscribing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isRecording ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>
            
            <Button
              onClick={handleSend}
              disabled={(!input.trim() && !selectedImage) || isLoading}
              size="icon"
              className="rounded-xl h-10 w-10 bg-accent hover:bg-accent/90"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-3">
          Gaurav Gatha AI may make mistakes. Verify important information.
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
      />
    </div>
  );
};

export default ChatInterface;
