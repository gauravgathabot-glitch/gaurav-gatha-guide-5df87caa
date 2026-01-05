import { MapPin, Mountain, Shield, Building, Phone } from "lucide-react";

interface ChatSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

const suggestions = [
  {
    icon: Mountain,
    text: "Sadhna Top ke baare mein batao",
    label: "Sadhna Top",
  },
  {
    icon: MapPin,
    text: "Karnah valley ki history kya hai?",
    label: "Karnah History",
  },
  {
    icon: Shield,
    text: "Teetwal aur Indian Army ki kahani",
    label: "Teetwal & Army",
  },
  {
    icon: Building,
    text: "Karnah mein hotels aur stay options",
    label: "Hotels & Stay",
  },
  {
    icon: Phone,
    text: "Emergency contacts Karnah area",
    label: "Emergency",
  },
];

const ChatSuggestions = ({ onSuggestionClick }: ChatSuggestionsProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center px-4 mb-4">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSuggestionClick(suggestion.text)}
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-muted/50 hover:bg-accent/20 border border-border/50 hover:border-accent/50 transition-all text-sm text-muted-foreground hover:text-foreground group"
        >
          <suggestion.icon className="w-4 h-4 text-accent group-hover:text-accent" />
          <span>{suggestion.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ChatSuggestions;
