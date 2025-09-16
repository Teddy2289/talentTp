import { useAlert } from "../../contexts/AlertContext";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

class ApiService {
  private alert = useAlert;
  private getToken() {
    return localStorage.getItem("token");
  }
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error: any) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Méthodes pour les paiements
  async createCheckoutSession(
    planId: number,
    conversationId: number,
    userId: number
  ) {
    return this.request("/payments/create-checkout-session", {
      method: "POST",
      body: JSON.stringify({ planId, conversationId, userId }),
    });
  }

  async getPaymentPlans() {
    return this.request("/payments/plans");
  }

  async verifyPayment(sessionId: string, conversationId: number) {
    return this.request("/payments/verify", {
      method: "POST",
      body: JSON.stringify({ sessionId, conversationId }),
    });
  }

  // Méthodes pour les conversations
  async createConversation(clientId: number, modelId: number) {
    return this.request("/conversations", {
      method: "POST",
      body: JSON.stringify({ clientId, modelId }),
    });
  }

  async checkConversationAccess(conversationId: number) {
    return this.request(`/conversations/${conversationId}/check-access`);
  }

  async getConversation(conversationId: number) {
    return this.request(`/conversations/${conversationId}`);
  }

  async incrementMessageCount(conversationId: number) {
    return this.request(`/conversations/${conversationId}/increment-message`, {
      method: "POST",
    });
  }

  async chatWithAI(
    message: string,
    conversationId: number | null,
    history: any[],
    modelData: any,
    userId: number
  ) {
    return this.request("/ai/chat", {
      method: "POST",
      body: JSON.stringify({
        message,
        conversationId,
        history,
        modelData,
        userId,
      }),
    });
  }
}

export const apiService = new ApiService();
