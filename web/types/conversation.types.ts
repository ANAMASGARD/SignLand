/**
 * Conversation Message Types
 */

export interface ConversationMessage {
  id: string;
  type: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export interface ConversationStats {
  wordCount: number;
  sentenceCount: number;
  sessionStart: Date;
  accuracyRate: number;
}
