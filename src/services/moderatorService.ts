import api from "../core/api";

export const moderatorService = {
  // Récupérer les conversations assignées à un modérateur
  getAssignedConversations: async (moderatorId: number) => {
    const response = await api.get(`/moderators/${moderatorId}/conversations`);
    return response.data.data; // Notez le .data.data pour accéder aux données
  },

  // Envoyer une réponse en tant que modérateur
  sendModeratorResponse: async (conversationId: number, content: string) => {
    const response = await api.post(`/messages/model`, {
      conversationId,
      content,
    });
    return response.data;
  },

  // Marquer une conversation comme traitée
  markAsProcessed: async (conversationId: number) => {
    const response = await api.patch(
      `/conversations/${conversationId}/status`,
      {
        status: "processed",
      }
    );
    return response.data;
  },

  // Récupérer l'historique des messages modérateur
  getModeratorMessages: async (moderatorId: number, page = 1, limit = 50) => {
    const response = await api.get(
      `/moderators/${moderatorId}/messages?page=${page}&limit=${limit}`
    );
    return response.data;
  },
};
