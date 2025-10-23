import { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface SettingsDialogProps {
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
}

export interface AppSettings {
  usePollinationsForImages: boolean;
  imageModel: string;
  chatModel: string;
}

export const SettingsDialog = ({ settings, onSettingsChange }: SettingsDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleSettingChange = (key: keyof AppSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    onSettingsChange(newSettings);
    toast.success("Settings updated");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl hover:bg-card/50 transition-all"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Settings
          </DialogTitle>
          <DialogDescription>
            Customize your AI experience
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Image Generation Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Image Generation</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="pollinations" className="text-sm font-medium">
                  Use Pollinations.ai
                </Label>
                <p className="text-xs text-muted-foreground">
                  Free, unlimited AI image generation
                </p>
              </div>
              <Switch
                id="pollinations"
                checked={settings.usePollinationsForImages}
                onCheckedChange={(checked) =>
                  handleSettingChange("usePollinationsForImages", checked)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image-model" className="text-sm font-medium">
                Image Model
              </Label>
              <Select
                value={settings.imageModel}
                onValueChange={(value) => handleSettingChange("imageModel", value)}
              >
                <SelectTrigger id="image-model" className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flux">Flux (Fast)</SelectItem>
                  <SelectItem value="flux-pro">Flux Pro (Quality)</SelectItem>
                  <SelectItem value="turbo">Turbo (Speed)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Chat Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Chat Model</h3>
            
            <div className="space-y-2">
              <Label htmlFor="chat-model" className="text-sm font-medium">
                AI Model
              </Label>
              <Select
                value={settings.chatModel}
                onValueChange={(value) => handleSettingChange("chatModel", value)}
              >
                <SelectTrigger id="chat-model" className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini-2.5-flash">Gemini 2.5 Flash</SelectItem>
                  <SelectItem value="gemini-2.5-pro">Gemini 2.5 Pro</SelectItem>
                  <SelectItem value="gpt-5-mini">GPT-5 Mini</SelectItem>
                  <SelectItem value="gpt-5">GPT-5</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
