import { useState } from "react";
import { apiService } from "../core/payment/plans";
import { useAlert } from "../contexts/AlertContext";
import { useConversation } from "../contexts/ConversationContext";

export const useAIChat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const { showAlert } = useAlert();
  const { incrementMessage, currentConversation } = useConversation();

  const sendMessage = async (
    message: string,
    modelData: any,
    userId: number
  ) => {
    if (!message.trim()) return;

    setIsLoading(true);

    const userMessage = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await apiService.chatWithAI(
        message,
        currentConversation?.id || null,
        messages,
        modelData,
        userId
      );

      const aiMessage = { role: "assistant", content: response.response };
      setMessages((prev) => [...prev, aiMessage]);

      if (currentConversation) {
        await incrementMessage(currentConversation.id);
      }

      return response;
    } catch (error: any) {
      console.error("Erreur de chat:", error);

      // Gestion du paiement requis
      if (
        error.message.includes("402") ||
        error.message.includes("Payment required")
      ) {
        const paymentMessage = {
          role: "system",
          content:
            "Vous devez souscrire à un abonnement pour continuer à discuter.",
          requiresPayment: true,
        };
        setMessages((prev) => [...prev, paymentMessage]);
        showAlert(
          "warning",
          "Vous devez souscrire à un abonnement pour continuer à discuter",
          5000
        );
        return { requiresPayment: true };
      } else {
        showAlert("error", `Erreur de communication: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => setMessages([]);

  return { messages, isLoading, sendMessage, clearMessages };
};
