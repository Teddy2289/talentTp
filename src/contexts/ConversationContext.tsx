// contexts/ConversationContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { apiService } from "../core/payment/plans";
import { useAlert } from "./AlertContext";

interface Conversation {
  id: number;
  clientId: number;
  modelId: number;
  message_count: number;
  is_premium: boolean;
  paymentId: number | null;
  createdAt: string;
  updatedAt: string;
}

interface ConversationContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  createConversation: (clientId: number, modelId: number) => Promise<void>;
  getConversation: (id: number) => Promise<void>;
  checkAccess: (id: number) => Promise<boolean>;
  incrementMessage: (id: number) => Promise<void>;
  loading: boolean;
}

const ConversationContext = createContext<ConversationContextType | undefined>(
  undefined
);

export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error(
      "useConversation must be used within a ConversationProvider"
    );
  }
  return context;
};

interface ConversationProviderProps {
  children: ReactNode;
}

export const ConversationProvider: React.FC<ConversationProviderProps> = ({
  children,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(null);
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const createConversation = async (clientId: number, modelId: number) => {
    setLoading(true);
    try {
      const newConversation = await apiService.createConversation(
        clientId,
        modelId
      );
      setConversations((prev) => [...prev, newConversation]);
      setCurrentConversation(newConversation);
      showAlert("success", "Conversation créée avec succès");
    } catch (error: any) {
      showAlert("error", `Erreur lors de la création: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getConversation = async (id: number) => {
    setLoading(true);
    try {
      const conversation = await apiService.getConversation(id);
      setCurrentConversation(conversation);
    } catch (error: any) {
      showAlert("error", `Erreur lors du chargement: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const checkAccess = async (id: number): Promise<boolean> => {
    try {
      const result = await apiService.checkConversationAccess(id);
      return result.canChat;
    } catch (error: any) {
      if (error.message.includes("402")) {
        // Payment required
        return false;
      }
      showAlert("error", `Erreur de vérification: ${error.message}`);
      return false;
    }
  };

  const incrementMessage = async (id: number) => {
    try {
      await apiService.incrementMessageCount(id);
      // Mettre à jour localement le compteur
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === id
            ? { ...conv, message_count: conv.message_count + 1 }
            : conv
        )
      );
      if (currentConversation && currentConversation.id === id) {
        setCurrentConversation((prev) =>
          prev ? { ...prev, message_count: prev.message_count + 1 } : null
        );
      }
    } catch (error: any) {
      console.error("Erreur d'incrémentation:", error);
    }
  };

  const value = {
    conversations,
    currentConversation,
    createConversation,
    getConversation,
    checkAccess,
    incrementMessage,
    loading,
  };

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
};
