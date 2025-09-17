// core/payment/plans.ts
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

class ApiService {
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

    // Ajouter le body si présent (sauf pour les requêtes GET/HEAD)
    if (options.body && !["GET", "HEAD"].includes(options.method || "GET")) {
      config.body = options.body;
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            errorData.message ||
            `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
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

  async getActivePlans() {
    return this.request("/payments/active-plans");
  }

  async verifyPayment(sessionId: string, conversationId: number) {
    return this.request("/payments/verify-payment", {
      // Correction du endpoint
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
