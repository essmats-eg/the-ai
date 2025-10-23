import { useState } from 'react';
import { Settings as SettingsIcon, Plus, Trash2, Key, Plug, Palette, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Settings, CustomApi, AIProvider, MCPServer, AI_PROVIDERS } from '@/types/chat';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface SettingsDialogProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

export function SettingsDialog({ settings, onSettingsChange }: SettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [newApi, setNewApi] = useState({ name: '', endpoint: '', type: 'text' as const, apiKey: '' });
  const [newMCP, setNewMCP] = useState({ name: '', endpoint: '', description: '', capabilities: '' });

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    onSettingsChange({ ...settings, [key]: value });
    toast.success("Settings updated");
  };

  const updateCustomization = <K extends keyof Settings['customization']>(
    key: K,
    value: Settings['customization'][K]
  ) => {
    updateSetting('customization', { ...settings.customization, [key]: value });
  };

  const updatePuterIntegration = <K extends keyof Settings['puterIntegration']>(
    key: K,
    value: Settings['puterIntegration'][K]
  ) => {
    updateSetting('puterIntegration', { ...settings.puterIntegration, [key]: value });
  };

  const addCustomApi = () => {
    if (!newApi.name || !newApi.endpoint) return;
    const api: CustomApi = {
      id: Math.random().toString(36).substr(2, 9),
      ...newApi,
      enabled: true,
    };
    updateSetting('customApis', [...settings.customApis, api]);
    setNewApi({ name: '', endpoint: '', type: 'text', apiKey: '' });
  };

  const removeCustomApi = (id: string) => {
    updateSetting('customApis', settings.customApis.filter(api => api.id !== id));
  };

  const toggleCustomApi = (id: string) => {
    updateSetting(
      'customApis',
      settings.customApis.map(api => api.id === id ? { ...api, enabled: !api.enabled } : api)
    );
  };

  const addMCPServer = () => {
    if (!newMCP.name || !newMCP.endpoint) return;
    const mcp: MCPServer = {
      id: Math.random().toString(36).substr(2, 9),
      name: newMCP.name,
      endpoint: newMCP.endpoint,
      description: newMCP.description,
      capabilities: newMCP.capabilities.split(',').map(c => c.trim()).filter(Boolean),
      enabled: true,
    };
    updateSetting('mcpServers', [...settings.mcpServers, mcp]);
    setNewMCP({ name: '', endpoint: '', description: '', capabilities: '' });
  };

  const removeMCPServer = (id: string) => {
    updateSetting('mcpServers', settings.mcpServers.filter(mcp => mcp.id !== id));
  };

  const toggleMCPServer = (id: string) => {
    updateSetting(
      'mcpServers',
      settings.mcpServers.map(mcp => mcp.id === id ? { ...mcp, enabled: !mcp.enabled } : mcp)
    );
  };

  const toggleAIProvider = (providerId: string) => {
    const existing = settings.aiProviders.find(p => p.id === providerId);
    if (existing) {
      updateSetting(
        'aiProviders',
        settings.aiProviders.map(p => p.id === providerId ? { ...p, enabled: !p.enabled } : p)
      );
    } else {
      const providerInfo = AI_PROVIDERS[providerId as keyof typeof AI_PROVIDERS];
      if (providerInfo) {
        const newProvider: AIProvider = {
          id: providerId,
          name: providerInfo.name,
          enabled: true,
          models: providerInfo.models as any,
          type: providerInfo.type,
          requiresAuth: providerId !== 'pollinations' && providerId !== 'puter' && providerId !== 'lovable',
        };
        updateSetting('aiProviders', [...settings.aiProviders, newProvider]);
      }
    }
  };

  const updateProviderApiKey = (providerId: string, apiKey: string) => {
    updateSetting(
      'aiProviders',
      settings.aiProviders.map(p => p.id === providerId ? { ...p, apiKey } : p)
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl hover:bg-card/50 transition-all"
          title="Settings"
        >
          <SettingsIcon className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-card/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Settings
          </DialogTitle>
          <DialogDescription>
            Customize your AI chat experience with advanced options
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="providers">Providers</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="apis">Custom APIs</TabsTrigger>
            <TabsTrigger value="mcp">MCP</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select value={settings.theme} onValueChange={(v) => updateSetting('theme', v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Font Size</Label>
              <Select value={settings.fontSize} onValueChange={(v) => updateSetting('fontSize', v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Animation Speed</Label>
              <Select value={settings.animationSpeed} onValueChange={(v) => updateSetting('animationSpeed', v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slow">Slow</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="fast">Fast</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label>Reduce Motion</Label>
              <Switch
                checked={settings.reduceMotion}
                onCheckedChange={(v) => updateSetting('reduceMotion', v)}
              />
            </div>

            <div className="space-y-2">
              <Label>Default Provider</Label>
              <Select value={settings.defaultProvider} onValueChange={(v) => updateSetting('defaultProvider', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(AI_PROVIDERS).map(([id, provider]) => (
                    <SelectItem key={id} value={id}>{provider.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Customization
              </Label>
            </div>

            <div className="space-y-2">
              <Label>Chat Width</Label>
              <Select value={settings.chatWidth} onValueChange={(v) => updateSetting('chatWidth', v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">Compact (800px)</SelectItem>
                  <SelectItem value="medium">Medium (1000px)</SelectItem>
                  <SelectItem value="wide">Wide (1200px)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Message Bubble Shape</Label>
              <Select value={settings.bubbleShape} onValueChange={(v) => updateSetting('bubbleShape', v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rounded">Rounded</SelectItem>
                  <SelectItem value="square">Square</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Message Spacing</Label>
              <Select 
                value={settings.customization.messageSpacing} 
                onValueChange={(v) => updateCustomization('messageSpacing', v as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="relaxed">Relaxed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Code Theme</Label>
              <Select 
                value={settings.customization.codeTheme} 
                onValueChange={(v) => updateCustomization('codeTheme', v as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="github">GitHub</SelectItem>
                  <SelectItem value="monokai">Monokai</SelectItem>
                  <SelectItem value="dracula">Dracula</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Primary Color</Label>
              <Input
                type="color"
                value={settings.customization.primaryColor}
                onChange={(e) => updateCustomization('primaryColor', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Accent Color</Label>
              <Input
                type="color"
                value={settings.customization.accentColor}
                onChange={(e) => updateCustomization('accentColor', e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Show Timestamps</Label>
              <Switch
                checked={settings.showTimestamps}
                onCheckedChange={(v) => updateSetting('showTimestamps', v)}
              />
            </div>
          </TabsContent>

          <TabsContent value="providers" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Plug className="w-4 h-4" />
                AI Providers
              </Label>
              <p className="text-sm text-muted-foreground">
                Enable and configure multiple AI providers
              </p>
            </div>

            <div className="space-y-3">
              {Object.entries(AI_PROVIDERS).map(([id, provider]) => {
                const existingProvider = settings.aiProviders.find(p => p.id === id);
                const isEnabled = existingProvider?.enabled || false;
                const requiresAuth = id !== 'pollinations' && id !== 'puter' && id !== 'lovable';

                return (
                  <div key={id} className="border border-border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{provider.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {provider.type === 'both' ? 'Text & Image' : provider.type === 'text' ? 'Text Only' : 'Image Only'}
                        </p>
                      </div>
                      <Switch
                        checked={isEnabled}
                        onCheckedChange={() => toggleAIProvider(id)}
                      />
                    </div>
                    
                    {isEnabled && requiresAuth && (
                      <div className="space-y-2">
                        <Label className="text-xs flex items-center gap-1">
                          <Key className="w-3 h-3" />
                          API Key
                        </Label>
                        <Input
                          type="password"
                          placeholder="Enter API key"
                          value={existingProvider?.apiKey || ''}
                          onChange={(e) => updateProviderApiKey(id, e.target.value)}
                        />
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-1">
                      {provider.models.map((model) => (
                        <span key={model} className="text-xs bg-secondary px-2 py-1 rounded">
                          {model}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                Puter Integration
              </Label>
              <p className="text-sm text-muted-foreground">
                Enable Puter cloud features for enhanced functionality
              </p>
            </div>

            <div className="space-y-3 border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Puter Integration</Label>
                  <p className="text-xs text-muted-foreground">Use Puter cloud services</p>
                </div>
                <Switch
                  checked={settings.puterIntegration.enabled}
                  onCheckedChange={(v) => updatePuterIntegration('enabled', v)}
                />
              </div>

              {settings.puterIntegration.enabled && (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>KV Storage</Label>
                      <p className="text-xs text-muted-foreground">Store settings in cloud</p>
                    </div>
                    <Switch
                      checked={settings.puterIntegration.useKVStorage}
                      onCheckedChange={(v) => updatePuterIntegration('useKVStorage', v)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>File System</Label>
                      <p className="text-xs text-muted-foreground">Save chats to Puter Drive</p>
                    </div>
                    <Switch
                      checked={settings.puterIntegration.useFileSystem}
                      onCheckedChange={(v) => updatePuterIntegration('useFileSystem', v)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Puter AI</Label>
                      <p className="text-xs text-muted-foreground">Use Puter's AI models</p>
                    </div>
                    <Switch
                      checked={settings.puterIntegration.useAI}
                      onCheckedChange={(v) => updatePuterIntegration('useAI', v)}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="space-y-2">
              <Label>Pollinations Endpoints</Label>
              <div className="space-y-2">
                <div>
                  <Label className="text-xs">Text API</Label>
                  <Input
                    value={settings.textApiEndpoint}
                    onChange={(e) => updateSetting('textApiEndpoint', e.target.value)}
                    placeholder="https://text.pollinations.ai"
                  />
                </div>
                <div>
                  <Label className="text-xs">Image API</Label>
                  <Input
                    value={settings.imageApiEndpoint}
                    onChange={(e) => updateSetting('imageApiEndpoint', e.target.value)}
                    placeholder="https://image.pollinations.ai/prompt"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="apis" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Custom API Endpoints</Label>
              <p className="text-sm text-muted-foreground">
                Add your own API endpoints for custom functionality
              </p>
            </div>

            <div className="space-y-2 border border-border rounded-lg p-3">
              <Input
                placeholder="API Name"
                value={newApi.name}
                onChange={(e) => setNewApi({ ...newApi, name: e.target.value })}
              />
              <Input
                placeholder="Endpoint URL"
                value={newApi.endpoint}
                onChange={(e) => setNewApi({ ...newApi, endpoint: e.target.value })}
              />
              <Input
                type="password"
                placeholder="API Key (optional)"
                value={newApi.apiKey}
                onChange={(e) => setNewApi({ ...newApi, apiKey: e.target.value })}
              />
              <Select value={newApi.type} onValueChange={(v) => setNewApi({ ...newApi, type: v as any })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text Generation</SelectItem>
                  <SelectItem value="image">Image Generation</SelectItem>
                  <SelectItem value="mcp">MCP Server</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={addCustomApi} className="w-full" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Custom API
              </Button>
            </div>

            {settings.customApis.length > 0 && (
              <div className="space-y-2">
                {settings.customApis.map(api => (
                  <div key={api.id} className="flex items-center gap-2 border border-border rounded-lg p-3">
                    <div className="flex-1">
                      <p className="font-medium">{api.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{api.endpoint}</p>
                      <span className="text-xs bg-secondary px-2 py-1 rounded">{api.type}</span>
                    </div>
                    <Switch
                      checked={api.enabled}
                      onCheckedChange={() => toggleCustomApi(api.id)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCustomApi(api.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="mcp" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Model Context Protocol (MCP) Servers</Label>
              <p className="text-sm text-muted-foreground">
                Connect to MCP servers for extended AI capabilities
              </p>
            </div>

            <div className="space-y-2 border border-border rounded-lg p-3">
              <Input
                placeholder="Server Name"
                value={newMCP.name}
                onChange={(e) => setNewMCP({ ...newMCP, name: e.target.value })}
              />
              <Input
                placeholder="Server Endpoint"
                value={newMCP.endpoint}
                onChange={(e) => setNewMCP({ ...newMCP, endpoint: e.target.value })}
              />
              <Textarea
                placeholder="Description (optional)"
                value={newMCP.description}
                onChange={(e) => setNewMCP({ ...newMCP, description: e.target.value })}
                rows={2}
              />
              <Input
                placeholder="Capabilities (comma-separated)"
                value={newMCP.capabilities}
                onChange={(e) => setNewMCP({ ...newMCP, capabilities: e.target.value })}
              />
              <Button onClick={addMCPServer} className="w-full" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add MCP Server
              </Button>
            </div>

            {settings.mcpServers.length > 0 && (
              <div className="space-y-2">
                {settings.mcpServers.map(mcp => (
                  <div key={mcp.id} className="border border-border rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <p className="font-medium">{mcp.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{mcp.endpoint}</p>
                        {mcp.description && (
                          <p className="text-xs text-muted-foreground mt-1">{mcp.description}</p>
                        )}
                      </div>
                      <Switch
                        checked={mcp.enabled}
                        onCheckedChange={() => toggleMCPServer(mcp.id)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMCPServer(mcp.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    {mcp.capabilities.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {mcp.capabilities.map((cap, idx) => (
                          <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {cap}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
