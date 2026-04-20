import { apiClient } from '../lib/api';

/**
 * Service to handle Telegram Bot API integration
 */
export const telegramService = {
  /**
   * Send a notification to the support bot
   */
  notifySupport: async (message: string, userId: string) => {
    return apiClient('/support/telegram/notify', {
      method: 'POST',
      body: JSON.stringify({ 
        message, 
        userId,
        timestamp: new Date().toISOString()
      })
    });
  },

  /**
   * Create a direct support ticket linked to Telegram
   */
  initiateChat: async (userId: string) => {
    return apiClient('/support/telegram/chat', {
      method: 'POST',
      body: JSON.stringify({ userId })
    });
  }
};
