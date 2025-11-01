import OpenAI from 'openai';
import { useConfigStore } from '@stores/configStore';
import systemPromptTemplate from '@data/prompts/system_prompt.md?raw';
import { RUNTIME } from '@/config/runtime';


/**
 * GPT Action Interface - Structured commands that GPT can execute
 */
export interface GPTAction {
  type: string;
  parameters: Record<string, any>;
  requires_confirmation: boolean;
  description: string;
}

/**
 * GPT Response Interface - Optimized structured output
 */
export interface GPTResponse {
  message: string;
  actions: GPTAction[];
  suggestions: Array<{
    label: string;
    action: string;
    parameters: Record<string, any>;
  }>;
  metadata: {
    confidence: number;
    reasoning?: string;
    mode: 'jam_buddy' | 'mixing_engineer' | 'sound_designer' | 'sensei';
  };
}

/**
 * Project State Interface - Complete snapshot of the studio
 */
export interface ProjectState {
  tempo: number;
  time_signature: string;
  key: string;
  instruments: Array<{
    id: string;
    type: string;
    role: string;
    parameters: Record<string, number>;
  }>;
  patterns: any[];
  timeline: any[];
  routing: any[];
  // Add more as needed
}

/**
 * Available Actions Registry
 * Maps action names to their TypeScript signatures
 */
const AVAILABLE_ACTIONS = {
  set_parameter: {
    params: ['instrument_id: string', 'parameter: string', 'value: number'],
    description: 'Modify a synthesizer parameter',
  },
  create_pattern: {
    params: ['track_id: string', 'notes: Note[]', 'length: number'],
    description: 'Generate a MIDI pattern',
  },
  add_automation: {
    params: ['track_id: string', 'cc_number: number', 'curve_data: Point[]'],
    description: 'Draw automation curve',
  },
  suggest_chord_progression: {
    params: ['key: string', 'mood: string', 'genre: string'],
    description: 'Suggest harmonic progressions',
  },
  analyze_mix: {
    params: [],
    description: 'Analyze frequency balance and conflicts',
  },
  route_cable: {
    params: ['from: string', 'to: string', 'type: CableType'],
    description: 'Connect instruments',
  },
  apply_scale: {
    params: ['track_id: string', 'scale: string', 'root_note: string'],
    description: 'Quantize notes to musical scale',
  },
  generate_variation: {
    params: ['pattern_id: string', 'mutation_type: string'],
    description: 'Create pattern variation',
  },
  set_tempo: {
    params: ['bpm: number'],
    description: 'Change project tempo',
  },
  add_marker: {
    params: ['position: number', 'label: string', 'type: string'],
    description: 'Add timeline marker',
  },
};

/**
 * Knowledge Base Statistics (loaded dynamically)
 */
interface KnowledgeBaseStats {
  CHORD_DB_SIZE: number;
  SCALES_DB_SIZE: number;
  SOUND_DESIGN_DB_SIZE: number;
  PRODUCTION_DB_SIZE: number;
  HARDWARE_DB_SIZE: number;
}

/**
 * GPT Service Class
 * Handles all communication with OpenAI API
 * Implements optimized prompt engineering for total program integration
 */
export class GPTService {
  private client: OpenAI | null = null;
  private conversationHistory: OpenAI.Chat.ChatCompletionMessageParam[] = [];
  private knowledgeBaseStats: KnowledgeBaseStats;

  constructor() {
    this.initializeClient();
    this.knowledgeBaseStats = this.loadKnowledgeBaseStats();
  }

  /**
   * Initialize OpenAI client with API key from config store
   */
  private initializeClient() {
    const { apiKey } = useConfigStore.getState();
    if (apiKey) {
      this.client = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true, // Use backend proxy in production
      });
    }
  }

  /**
   * Load knowledge base statistics for prompt template
   */
  private loadKnowledgeBaseStats(): KnowledgeBaseStats {
    // TODO: Load actual stats from data files
    return {
      CHORD_DB_SIZE: 50,
      SCALES_DB_SIZE: 19,
      SOUND_DESIGN_DB_SIZE: 100,
      PRODUCTION_DB_SIZE: 75,
      HARDWARE_DB_SIZE: 1,
    };
  }

  /**
   * Build optimized system prompt with current context
   */
  private buildSystemPrompt(projectState: ProjectState): string {
    let prompt = systemPromptTemplate;

    // Replace template variables
    prompt = prompt.replace('{{PROJECT_STATE}}', JSON.stringify(projectState, null, 2));
    prompt = prompt.replace(
      '{{AVAILABLE_ACTIONS}}',
      JSON.stringify(AVAILABLE_ACTIONS, null, 2)
    );

    // Inject knowledge base stats
    Object.entries(this.knowledgeBaseStats).forEach(([key, value]) => {
      prompt = prompt.replace(`{{${key}}}`, value.toString());
    });

    return prompt;
  }

  /**
   * Build user message with rich context
   */
  private buildUserMessage(
    message: string,
    projectState: ProjectState,
    context: {
      current_instrument?: string;
      selected_track?: string;
      playback_position?: number;
      is_playing?: boolean;
    }
  ): string {
    const enrichedMessage = {
      user_message: message,
      project_state: projectState,
      context,
      timestamp: new Date().toISOString(),
    };

    return JSON.stringify(enrichedMessage, null, 2);
  }

  /**
   * Parse GPT response into structured format
   */
  private parseGPTResponse(content: string): GPTResponse {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(content);
      return parsed as GPTResponse;
    } catch {
      // Fallback: treat as plain text message
      return {
        message: content,
        actions: [],
        suggestions: [],
        metadata: {
          confidence: 0.5,
          mode: 'sensei',
        },
      };
    }
  }

  /**
   * Send message to GPT and get structured response
   */
  async sendMessage(
    message: string,
    projectState: ProjectState,
    context: {
      current_instrument?: string;
      selected_track?: string;
      playback_position?: number;
      is_playing?: boolean;
    } = {}
  ): Promise<
    if (RUNTIME.demoMode) {
      // TODO [ ] Affiner les réponses simulées (modes Jam/Mix/Sound/Sensei)
      // [X] Ne pas appeler d'API externe en mode Démo
      return {
        message: 'Mode Démo activé : aucune requête réseau. Voici une suggestion simulée.',
        actions: [],
        suggestions: [],
        metadata: {
          confidence: 0,
          mode: 'jam_buddy',
        },
      } as GPTRResponse;
    }
> {
    if (!this.client) {
      throw new Error('GPT client not initialized. Please configure API key.');
    }

    // Build system prompt with current project state
    const systemPrompt = this.buildSystemPrompt(projectState);

    // Build enriched user message
    const userMessage = this.buildUserMessage(message, projectState, context);

    // Add to conversation history
    this.conversationHistory.push({
      role: 'user',
      content: userMessage,
    });

    try {
      // Call OpenAI API with optimized parameters
      const completion = await this.client.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          ...this.conversationHistory,
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: 'json_object' }, // Force JSON output
      });

      const responseContent = completion.choices[0]?.message?.content || '{}';

      // Parse response
      const parsedResponse = this.parseGPTResponse(responseContent);

      // Add to history
      this.conversationHistory.push({
        role: 'assistant',
        content: responseContent,
      });

      // Limit history to last 10 messages to avoid token limits
      if (this.conversationHistory.length > 10) {
        this.conversationHistory = this.conversationHistory.slice(-10);
      }

      return parsedResponse;
    } catch (error) {
      console.error('GPT API error:', error);
      throw error;
    }
  }

  /**
   * Stream response for real-time feedback
   */
  async *streamMessage(
    message: string,
    projectState: ProjectState,
    context: Record<string, any> = {}
  ): AsyncGenerator<string, void, unknown> {
    if (!this.client) {
      throw new Error('GPT client not initialized. Please configure API key.');
    }

    const systemPrompt = this.buildSystemPrompt(projectState);
    const userMessage = this.buildUserMessage(message, projectState, context);

    this.conversationHistory.push({
      role: 'user',
      content: userMessage,
    });

    const stream = await this.client.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...this.conversationHistory,
      ],
      temperature: 0.7,
      max_tokens: 2000,
      stream: true,
    });

    let fullResponse = '';

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      fullResponse += content;
      yield content;
    }

    // Add complete response to history
    this.conversationHistory.push({
      role: 'assistant',
      content: fullResponse,
    });
  }

  /**
   * Clear conversation history
   */
  clearHistory() {
    this.conversationHistory = [];
  }

  /**
   * Get conversation history (for debugging)
   */
  getHistory() {
    return [...this.conversationHistory];
  }
}

// Singleton instance
export const gptService = new GPTService();
