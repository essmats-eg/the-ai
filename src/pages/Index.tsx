import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { SettingsDialog, AppSettings } from "@/components/SettingsDialog";
import { useAIChat } from "@/hooks/useAIChat";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { usePollinationsImageGeneration } from "@/hooks/usePollinationsImage";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { messages, sendMessage, isLoading } = useAIChat();
  const { isRecording, startRecording, stopRecording } = useVoiceInput();
  const { generateImage: generatePollinationsImage, isGenerating: isPollinationsGenerating } = usePollinationsImageGeneration();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [settings, setSettings] = useState<AppSettings>({
    usePollinationsForImages: true,
    imageModel: "flux",
    chatModel: "gemini-2.5-flash",
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleVoiceInput = async () => {
    if (isRecording) {
      toast.info("Processing voice input...");
      const audioBase64 = await stopRecording();
      if (audioBase64) {
        toast.info("Voice feature coming soon!");
      }
    } else {
      await startRecording();
    }
  };

  const handleImageGeneration = async () => {
    if (!imagePrompt.trim()) return;
    
    setGeneratingImage(true);
    try {
      if (settings.usePollinationsForImages) {
        // Use Pollinations.ai (free, unlimited)
        const imageUrl = await generatePollinationsImage(imagePrompt, {
          model: settings.imageModel,
          width: 1024,
          height: 1024,
        });
        setGeneratedImage(imageUrl);
        toast.success("Image generated with Pollinations!");
      } else {
        // Use Lovable AI edge function
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-image`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({ prompt: imagePrompt }),
          }
        );

        if (!response.ok) throw new Error("Failed to generate image");
        
        const data = await response.json();
        setGeneratedImage(data.imageUrl);
        toast.success("Image generated!");
      }
    } catch (error) {
      console.error("Image generation error:", error);
      toast.error("Failed to generate image");
    } finally {
      setGeneratingImage(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-xl bg-card/30 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent animate-pulse-glow">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Cosmic AI
              </h1>
              <p className="text-xs text-muted-foreground">Your Advanced Intelligence Companion</p>
            </div>
          </div>
          <SettingsDialog settings={settings} onSettingsChange={setSettings} />
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in fade-in duration-1000">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse-glow rounded-full" />
              <Sparkles className="h-24 w-24 text-primary relative z-10 animate-float" />
            </div>
            <div className="space-y-2">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Welcome to Cosmic AI
              </h2>
              <p className="text-muted-foreground text-lg max-w-md">
                I can help you with anything - from creative ideas to complex problems. 
                Let's start a conversation!
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mt-8">
              {[
                { emoji: "💡", text: "Generate creative ideas" },
                { emoji: "🎨", text: "Create stunning images" },
                { emoji: "🗣️", text: "Voice conversations" },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-card/40 backdrop-blur-xl border border-border/50 hover:border-primary/50 transition-all hover:scale-105 cursor-pointer"
                >
                  <div className="text-3xl mb-2">{feature.emoji}</div>
                  <p className="text-sm text-muted-foreground">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <ChatMessage key={index} {...message} />
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Input Area */}
      <div className="border-t border-border/50 backdrop-blur-xl bg-card/30 sticky bottom-0">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <ChatInput
            onSend={sendMessage}
            onVoice={handleVoiceInput}
            onImage={() => setShowImageDialog(true)}
            isLoading={isLoading}
            isRecording={isRecording}
          />
        </div>
      </div>

      {/* Image Generation Dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Image</DialogTitle>
            <DialogDescription>
              Describe the image you want to create
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="A cosmic nebula with stars..."
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleImageGeneration()}
            />
            <Button 
              onClick={handleImageGeneration} 
              disabled={generatingImage || isPollinationsGenerating || !imagePrompt.trim()}
              className="w-full"
            >
              {(generatingImage || isPollinationsGenerating) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                `Generate Image ${settings.usePollinationsForImages ? '(Pollinations)' : '(AI)'}`
              )}
            </Button>
            {generatedImage && (
              <div className="rounded-lg overflow-hidden border border-border">
                <img src={generatedImage} alt="Generated" className="w-full" />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;