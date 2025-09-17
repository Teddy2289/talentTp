import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { apiService } from "../../core/payment/plans";
import { settingsApi } from "../../core/settingsApi"; // Import des settings
import { useAuth } from "../../contexts/AuthContext";
import { useAlert } from "../../contexts/AlertContext";
import { Crown, Star, CheckCircle2, Loader2 } from "lucide-react";

const stripePromise = loadStripe(
  import.meta.env.VITE_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface PaymentPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  credits: number;
  is_active: boolean;
}

interface FrontendSettings {
  general: {
    model?: {
      id: number;
      prenom: string;
      nom?: string;
      photo?: string;
    };
  };
}

const PaymentPlansPage: React.FC = () => {
  const [plans, setPlans] = useState<PaymentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);
  const [modelId, setModelId] = useState<number | null>(null); // État pour modelId
  const { user } = useAuth();
  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Récupérer les plans de paiement
        const plansData = await apiService.getPaymentPlans();
        setPlans(plansData);

        // Récupérer les settings pour obtenir le modelId
        const settingsResponse = await settingsApi.getFrontendSettings();
        const frontendSettings: FrontendSettings = settingsResponse.data.data;

        if (frontendSettings.general?.model?.id) {
          setModelId(frontendSettings.general.model.id);
        } else {
          showAlert("error", "Aucun modèle configuré dans les paramètres");
        }
      } catch (error: any) {
        showAlert("error", "Impossible de charger les données");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePurchase = async (planId: number) => {
    try {
      if (!modelId) {
        showAlert("error", "Aucun modèle sélectionné");
        return;
      }

      setProcessing(planId);
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe n'a pas pu être initialisé");

      // Créer une conversation avant le paiement
      let conversationId = 0;

      try {
        const conversation = await apiService.createConversation(
          user?.id || 0,
          modelId
        );
        conversationId = conversation.id;
        console.log("Conversation créée:", conversationId);
      } catch (error: any) {
        console.error("Erreur création conversation:", error);
        // Si la création échoue, on peut quand même procéder sans conversationId
        // ou gérer l'erreur différemment selon votre logique métier
      }

      const response = await apiService.createCheckoutSession(
        planId,
        conversationId, // Utiliser l'ID de conversation réel (ou 0 si échec)
        user?.id || 0
      );

      const { id: sessionId } = response;
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        showAlert("error", `Erreur de redirection: ${error.message}`);
      }
    } catch (error: any) {
      showAlert("error", `Erreur: ${error.message}`);
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        <Loader2 className="animate-spin mr-2" /> Chargement des plans...
      </div>
    );
  }

  if (!modelId) {
    return (
      <div
        className="container mx-auto px-4 py-12 text-center"
        style={{ marginTop: "80px" }}>
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Configuration manquante
        </h2>
        <p className="text-gray-600">
          Aucun modèle n'est configuré dans les paramètres du site. Veuillez
          contacter l'administrateur.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12" style={{ marginTop: "80px" }}>
      <h1 className="text-4xl font-extrabold text-center mb-4 text-white">
        Choisissez votre plan
      </h1>
      <p className="text-center text-gray-200 mb-12 max-w-2xl mx-auto">
        Boostez vos conversations avec nos formules flexibles adaptées à vos
        besoins. Profitez d’avantages exclusifs et d’un support premium.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => {
          const isPopular = plan.name.toLowerCase().includes("premium");
          const isVip = plan.name.toLowerCase().includes("vip");

          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg border border-gray-200 p-8 flex flex-col transition transform hover:scale-105 hover:shadow-xl ${
                isPopular ? "border-indigo-500" : ""
              }`}>
              {/* Badge */}
              {isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                  ⭐ Populaire
                </span>
              )}
              {isVip && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                  👑 VIP
                </span>
              )}

              <div className="flex items-center justify-center mb-4">
                {isVip ? (
                  <Crown className="w-10 h-10 text-yellow-500" />
                ) : isPopular ? (
                  <Star className="w-10 h-10 text-indigo-600" />
                ) : (
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                )}
              </div>

              <h2 className="text-2xl font-bold text-center text-gray-900">
                {plan.name}
              </h2>
              <p className="text-center text-gray-600 mt-2">
                {plan.description}
              </p>

              <div className="mt-6 text-center">
                <span className="text-4xl font-extrabold text-gray-900">
                  {plan.price}€
                </span>
                <span className="text-gray-500"> / {plan.duration} jours</span>
              </div>

              <p className="text-center text-gray-700 mt-4 font-medium">
                {plan.credits} crédits inclus
              </p>

              <ul className="mt-6 space-y-2 text-gray-600">
                <li className="flex items-center">
                  <CheckCircle2 className="text-green-500 mr-2 w-5 h-5" />
                  Accès illimité aux conversations
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="text-green-500 mr-2 w-5 h-5" />
                  Support prioritaire 24/7
                </li>
                {isVip && (
                  <li className="flex items-center">
                    <CheckCircle2 className="text-green-500 mr-2 w-5 h-5" />
                    Avantages exclusifs réservés VIP
                  </li>
                )}
              </ul>

              <button
                onClick={() => handlePurchase(plan.id)}
                disabled={processing === plan.id}
                className={`mt-8 w-full py-3 px-6 rounded-lg font-semibold transition ${
                  processing === plan.id
                    ? "bg-gray-400 cursor-not-allowed"
                    : isVip
                    ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                    : isPopular
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}>
                {processing === plan.id ? "Redirection..." : "Choisir ce plan"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentPlansPage;
