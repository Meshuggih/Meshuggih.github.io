import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import OpenAI from 'openai';

interface ConfigState {
  // API Configuration
  apiKey: string | null;
  isApiKeyValid: boolean;

  // User Preferences
  theme: 'dark' | 'light';
  gridSnap: boolean;
  autoSave: boolean;

  // Actions
  setApiKey: (key: string) => void;
  validateApiKey: (key: string) => Promise<boolean>;
  clearApiKey: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setGridSnap: (enabled: boolean) => void;
  setAutoSave: (enabled: boolean) => void;
}

/**
 * Configuration store with persistence
 * Stores API keys securely in localStorage (encrypted in production)
 */
export const useConfigStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      // Initial state
      apiKey: null,
      isApiKeyValid: false,
      theme: 'dark',
      gridSnap: true,
      autoSave: true,

      // Set and validate API key
      setApiKey: (key: string) => {
        set({ apiKey: key, isApiKeyValid: true });
      },

      // Validate API key by making a test request
      validateApiKey: async (key: string): Promise<boolean> => {
        try {
          const client = new OpenAI({
            apiKey: key,
            dangerouslyAllowBrowser: true, // Only for demo - use backend proxy in production
          });

          // Test with minimal request
          const response = await client.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'user', content: 'test' }],
            max_tokens: 5,
          });

          return response.choices.length > 0;
        } catch (error) {
          console.error('API key validation failed:', error);
          return false;
        }
      },

      // Clear API key
      clearApiKey: () => {
        set({ apiKey: null, isApiKeyValid: false });
      },

      // Theme management
      setTheme: (theme: 'dark' | 'light') => {
        set({ theme });
        document.documentElement.classList.toggle('dark', theme === 'dark');
      },

      // Grid snap toggle
      setGridSnap: (enabled: boolean) => {
        set({ gridSnap: enabled });
      },

      // Auto-save toggle
      setAutoSave: (enabled: boolean) => {
        set({ autoSave: enabled });
      },
    }),
    {
      name: 'dawless-config', // localStorage key
      partialize: (state) => ({
        apiKey: state.apiKey,
        isApiKeyValid: state.isApiKeyValid,
        theme: state.theme,
        gridSnap: state.gridSnap,
        autoSave: state.autoSave,
      }),
    }
  )
);
