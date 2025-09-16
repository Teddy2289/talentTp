const API_URL = "http://localhost:3000/api";

const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token manquant");
  return token;
};

export const conversationService = {
  // Récupérer les messages d'une conversation
  async getConversationMessages(conversationId: number) {
    const res = await fetch(
      `${API_URL}/clients/conversations/${conversationId}/messages`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
    return res.json();
  },

  // Récupérer une conversation spécifique
  async getConversation(conversationId: number) {
    const res = await fetch(`${API_URL}/conversations/${conversationId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
    return res.json();
  },

  // Créer une nouvelle conversation
  async createConversation(modelId: number, clientId: number) {
    const res = await fetch(`${API_URL}/conversations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ modelId, clientId }),
    });

    if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
    return res.json();
  },

  // Incrémenter le compteur de messages
  async incrementMessageCount(conversationId: number) {
    const res = await fetch(
      `${API_URL}/conversations/${conversationId}/increment`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
    return res.json();
  },
};
