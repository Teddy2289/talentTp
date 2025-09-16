import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import ChatPage from "./../../pages/ChatPage/ChatPage";
import PaymentWall from "./PaymentModal";
import { useAuth } from "../../contexts/AuthContext";
import { apiClient } from "../../core/api";

const stripePromise = loadStripe(
  import.meta.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface ChatWithPaymentProps {
  modelId: number;
}

const ChatWithPayment: React.FC<ChatWithPaymentProps> = ({ modelId }) => {
  const { user, token } = useAuth();
  const [showPaymentWall, setShowPaymentWall] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeConversation = async () => {
      if (!user || !token) {
        setError("Utilisateur non connecté");
        setLoading(false);
        return;
      }

      try {
        // Créer ou récupérer une conversation
        const response = await apiClient.post("/conversations", {
          modelId,
          clientId: user.id,
        });

        const conversation = response.data;
        setConversationId(conversation.id);
        setIsPremium(conversation.is_premium);

        // Vérifier si le paiement est nécessaire
        if (!conversation.is_premium && conversation.message_count >= 2) {
          setShowPaymentWall(true);
        }
      } catch (error: any) {
        console.error("Error initializing conversation:", error);
        setError(
          error.response?.data?.error || "Erreur lors de l'initialisation"
        );
      } finally {
        setLoading(false);
      }
    };

    initializeConversation();
  }, [user, token, modelId]);

  const handlePaymentSuccess = () => {
    setShowPaymentWall(false);
    setIsPremium(true);
    // Recharger la conversation pour avoir les données à jour
    if (conversationId) {
      apiClient.get(`/conversations/${conversationId}`).then((response) => {
        setIsPremium(response.data.is_premium);
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de la conversation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800">Erreur</h1>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!conversationId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800">Erreur</h1>
          <p className="text-gray-600 mt-2">Aucune conversation disponible</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ChatPage
        conversationId={conversationId}
        isPremium={isPremium}
        onPaymentRequired={() => setShowPaymentWall(true)}
      />

      {showPaymentWall && (
        <Elements stripe={stripePromise}>
          <PaymentWall
            conversationId={conversationId}
            onSuccess={handlePaymentSuccess}
            onClose={() => setShowPaymentWall(false)}
          />
        </Elements>
      )}
    </>
  );
};

export default ChatWithPayment;
