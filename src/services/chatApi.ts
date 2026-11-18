import api from './api';

export interface ChatMessagePayload {
  role: 'user' | 'model';
  text: string;
}

export interface SendChatResponse {
  status: 'success' | 'error';
  data?: {
    reply: string;
  };
  message?: string;
}

export const chatApi = {
  sendMessage: async (
    message: string,
    history: ChatMessagePayload[] = []
  ): Promise<string> => {
    const res = await api.post<SendChatResponse>('/chat', {
      message,
      history,
    });

    if (res.data && res.data.status === 'success' && res.data.data?.reply) {
      return res.data.data.reply;
    }

    throw new Error(
      res.data?.message || 'Unexpected response from Foodied AI assistant.'
    );
  },
};

