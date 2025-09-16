import { apiClient } from "../core/api";

export interface PaymentPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  credits: number;
  is_active: boolean;
  duration_days: number;
  features?: string[];
}

export interface CreateSessionResponse {
  sessionId: string;
  url: string;
}

export const paymentService = {
  // Récupérer les plans de paiement
  getPlans: async (): Promise<PaymentPlan[]> => {
    const response = await apiClient.get("/payment/plans");
    return response.data;
  },

  // Créer une session de checkout
  createCheckoutSession: async (
    planId: number,
    conversationId: number
  ): Promise<CreateSessionResponse> => {
    const response = await apiClient.post("/payment/create-checkout-session", {
      planId,
      conversationId,
    });
    return response.data;
  },

  // Vérifier le statut d'un paiement
  verifyPayment: async (
    sessionId: string,
    conversationId: number
  ): Promise<boolean> => {
    const response = await apiClient.post("/payment/verify", {
      sessionId,
      conversationId,
    });
    return response.data.success;
  },

  // Supprimer une session de paiement
  deleteSession: async (sessionId: string): Promise<void> => {
    await apiClient.delete(`/payment/sessions/${sessionId}`);
  },

  // Supprimer un plan de paiement
  deletePlan: async (planId: number): Promise<void> => {
    await apiClient.delete(`/payment/plans/${planId}`);
  },
};
