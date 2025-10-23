import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export const ChatMessage = ({ role, content }: ChatMessageProps) => {
  const isUser = role === "user";
  
  return (
    <div className={cn(
      "flex w-full gap-4 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] rounded-2xl px-6 py-4 backdrop-blur-xl",
        isUser 
          ? "bg-primary/20 border border-primary/30 text-foreground ml-auto" 
          : "bg-card/40 border border-border/50 text-foreground"
      )}>
        <div className="prose prose-invert prose-sm max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};