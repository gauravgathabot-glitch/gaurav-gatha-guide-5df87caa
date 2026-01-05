import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Send, 
  Mic, 
  Image, 
  Loader2,
  MicOff,
  X,
  Lightbulb
} from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

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

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 pb-20">
            {/* Welcome Message like ChatGPT */}
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Gaurav Gatha" className="w-12 h-12 object-contain rounded-xl" />
            </div>
            <h2 className="text-xl font-display font-semibold text-foreground mb-1">
              Gaurav Gatha
            </h2>
            <p className="text-sm text-muted-foreground mb-8">
              HII WHAT CAN I HELP YOU
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full overflow-hidden ${
                  message.role === "assistant" ? "bg-accent/20" : "bg-primary/20"
                }`}>
                  {message.role === "assistant" ? (
                    <img src={logo} alt="Bot" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary text-xs font-bold">
                      {user?.email?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                
                {/* Message Content */}
                <div className={`max-w-[80%] ${message.role === "user" ? "text-right" : ""}`}>
                  <p className="text-xs text-muted-foreground mb-1">
                    {message.role === "assistant" ? "Gaurav Gatha" : "You"}
                  </p>
                  <div className={`rounded-2xl px-4 py-2.5 ${
                    message.role === "user"
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted/50 text-foreground"
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-accent/20">
                  <img src={logo} alt="Bot" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Gaurav Gatha</p>
                  <div className="bg-muted/50 rounded-2xl px-4 py-2.5">
                    <Loader2 className="w-4 h-4 animate-spin text-accent" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="border-t border-border/30 bg-background p-4">
        <div className="max-w-3xl mx-auto">
          {/* Image Preview */}
          {imagePreview && (
            <div className="mb-3 relative inline-block">
              <img 
                src={imagePreview} 
                alt="Selected" 
                className="h-16 rounded-lg object-cover"
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          
          <div className="flex items-end gap-2 bg-muted/30 rounded-2xl border border-border/50 p-2">
            {/* Lightbulb placeholder */}
            <div className="p-2 text-accent">
              <Lightbulb className="w-5 h-5" />
            </div>

            {/* Text Input */}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='"Start typing... (Likhna shuru karein)"'
              className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-foreground placeholder:text-muted-foreground min-h-[24px] max-h-[200px] py-2"
              rows={1}
            />

            {/* Action buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleImageClick}
                className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
              >
                <Image className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleVoiceClick}
                disabled={isTranscribing}
                className={`p-2 rounded-lg transition-colors ${
                  isRecording 
                    ? "bg-destructive text-destructive-foreground animate-pulse" 
                    : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                {isTranscribing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isRecording ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Footer link */}
          <p className="text-xs text-center text-accent mt-3 font-medium">
            AGS HAJINAR
          </p>
        </div>
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
