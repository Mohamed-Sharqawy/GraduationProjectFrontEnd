export interface ChatMessage {
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface ChatbotWelcomeResponse {
  message: string;
}

export interface ChatbotAskRequest {
  message: string;
  sessionId?: string | null; // For continuing conversations
}

export interface ChatbotAskResponse {
    message: string; // Backend returns 'message'
    properties?: any[]; // For property suggestions in chat
    success?: boolean;
    sessionId?: string; // Session ID for conversation continuity
}

export interface SimilarPropertiesResponse {
    success: boolean;
    similarProperties: any[];
    count: number;
}
