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
}

export interface ChatbotAskResponse {
    response: string;
    properties?: any[]; // For property suggestions in chat
}

export interface SimilarPropertiesResponse {
    success: boolean;
    similarProperties: any[];
    count: number;
}
