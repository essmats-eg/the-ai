import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Send, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  onVoice: () => void;
  onImage: () => void;
  isLoading: boolean;
  isRecording?: boolean;
}

export const ChatInput = ({ onSend, onVoice, onImage, isLoading, isRecording }: ChatInputProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-end gap-2 p-4 rounded-3xl bg-card/40 backdrop-blur-xl border border-border/50">
        <Button
          type="button"
          onClick={onImage}
          size="icon"
          variant="ghost"
          className="shrink-0 hover:bg-primary/20 hover:text-primary transition-all"
          disabled={isLoading}
        >
          <ImageIcon className="h-5 w-5" />
        </Button>
        
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything..."
          className="min-h-[60px] max-h-[200px] resize-none bg-transparent border-0 focus-visible:ring-0 text-base"
          disabled={isLoading}
        />
        
        <div className="flex gap-2 shrink-0">
          <Button
            type="button"
            onClick={onVoice}
            size="icon"
            variant="ghost"
            className={cn(
              "hover:bg-accent/20 hover:text-accent transition-all",
              isRecording && "bg-accent/20 text-accent animate-pulse"
            )}
            disabled={isLoading}
          >
            <Mic className="h-5 w-5" />
          </Button>
          
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </form>
  );
};