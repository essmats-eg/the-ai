export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface CustomApi {
  id: string;
  name: string;
  endpoint: string;
  type: 'text' | 'image' | 'mcp';
  apiKey?: string;
  enabled: boolean;
}

export interface MCPServer {
  id: string;
  name: string;
  endpoint: string;
  description?: string;
  capabilities: string[];
  enabled: boolean;
}

export interface AIProvider {
  id: string;
  name: string;
  enabled: boolean;
  models: string[];
  type: 'text' | 'image' | 'both';
  requiresAuth: boolean;
  apiKey?: string;
}

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  animationSpeed: 'slow' | 'normal' | 'fast';
  reduceMotion: boolean;
  chatWidth: 'compact' | 'medium' | 'wide';
  bubbleShape: 'rounded' | 'square';
  showTimestamps: boolean;
  defaultProvider: string;
  textApiEndpoint: string;
  imageApiEndpoint: string;
  customApis: CustomApi[];
  mcpServers: MCPServer[];
  aiProviders: AIProvider[];
  customization: {
    messageSpacing: 'compact' | 'normal' | 'relaxed';
    codeTheme: 'github' | 'monokai' | 'dracula';
    primaryColor: string;
    accentColor: string;
  };
  puterIntegration: {
    enabled: boolean;
    useKVStorage: boolean;
    useFileSystem: boolean;
    useAI: boolean;
  };
}

export const AI_PROVIDERS = {
  pollinations: {
    name: 'Pollinations',
    type: 'both' as const,
    models: ['flux', 'flux-pro', 'turbo'],
  },
  lovable: {
    name: 'Lovable AI',
    type: 'both' as const,
    models: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gpt-5-mini', 'gpt-5'],
  },
  openai: {
    name: 'OpenAI',
    type: 'both' as const,
    models: ['gpt-5', 'gpt-5-mini', 'gpt-5-nano', 'dall-e-3'],
  },
  anthropic: {
    name: 'Anthropic',
    type: 'text' as const,
    models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
  },
  puter: {
    name: 'Puter AI',
    type: 'both' as const,
    models: ['gpt-4o', 'claude-3', 'llama-3'],
  },
} as const;

export const MODELS = {
  'gemini-2.5-flash': 'Gemini 2.5 Flash',
  'gemini-2.5-pro': 'Gemini 2.5 Pro',
  'gpt-5-mini': 'GPT-5 Mini',
  'gpt-5': 'GPT-5',
  'gpt-5-nano': 'GPT-5 Nano',
} as const;

export const DEFAULT_SETTINGS: Settings = {
  theme: 'dark',
  fontSize: 'medium',
  animationSpeed: 'normal',
  reduceMotion: false,
  chatWidth: 'medium',
  bubbleShape: 'rounded',
  showTimestamps: false,
  defaultProvider: 'pollinations',
  textApiEndpoint: 'https://text.pollinations.ai',
  imageApiEndpoint: 'https://image.pollinations.ai/prompt',
  customApis: [],
  mcpServers: [],
  aiProviders: [
    {
      id: 'pollinations',
      name: 'Pollinations',
      enabled: true,
      models: ['flux', 'flux-pro', 'turbo'],
      type: 'both',
      requiresAuth: false,
    },
    {
      id: 'lovable',
      name: 'Lovable AI',
      enabled: true,
      models: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gpt-5-mini', 'gpt-5'],
      type: 'both',
      requiresAuth: false,
    },
  ],
  customization: {
    messageSpacing: 'normal',
    codeTheme: 'github',
    primaryColor: '#8B5CF6',
    accentColor: '#D946EF',
  },
  puterIntegration: {
    enabled: false,
    useKVStorage: false,
    useFileSystem: false,
    useAI: false,
  },
};
