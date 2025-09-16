import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  paymentService,
  type PaymentPlan,
} from "../../services/paymentService";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId: number;
  onPaymentSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  conversationId,
  onPaymentSuccess,
}) => {
  const [plans, setPlans] = useState<PaymentPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setError(null);
        const plansData = await paymentService.getPlans();
        setPlans(plansData);
        if (plansData.length > 0) {
          setSelectedPlan(plansData[0]);
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
        setError("Impossible de charger les plans d'abonnement");
      }
    };

    if (isOpen) {
      fetchPlans();
    }
  }, [isOpen]);

  const handlePayment = async () => {
    if (!selectedPlan) return;

    setLoading(true);
    setError(null);
    try {
      const response = await paymentService.createCheckoutSession(
        selectedPlan.id,
        conversationId
      );

      // Rediriger vers Stripe Checkout
      window.location.href = response.url;
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      setError(
        error.response?.data?.message ||
          "Erreur lors de la création de la session de paiement"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                Choisissez votre abonnement
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white text-xl">
                ✕
              </button>
            </div>

            {error && (
              <div className="bg-red-500/20 text-red-300 p-3 rounded-xl mb-4 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4 mb-6">
              {plans.length === 0 && !error && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 border-4 border-[#e1af30] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400">Chargement des plans...</p>
                </div>
              )}

              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedPlan?.id === plan.id
                      ? "border-[#e1af30] bg-[#e1af30]/10"
                      : "border-gray-700 hover:border-gray-600"
                  }`}
                  onClick={() => setSelectedPlan(plan)}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{plan.name}</h3>
                      <p className="text-gray-400 text-sm mt-1">
                        {plan.description}
                      </p>
                      {plan.features && plan.features.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {plan.features.map((feature, index) => (
                            <li
                              key={index}
                              className="text-xs text-gray-400 flex items-center">
                              <span className="text-[#e1af30] mr-1">✓</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="text-right pl-4">
                      <div className="text-[#e1af30] font-bold text-lg">
                        {plan.price}€
                      </div>
                      <div className="text-gray-400 text-sm">
                        {plan.credits} messages
                      </div>
                      <div className="text-gray-500 text-xs">
                        {plan.duration_days} jours
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handlePayment}
              disabled={!selectedPlan || loading}
              className="w-full bg-gradient-to-r from-[#e1af30] to-[#f3c754] text-gray-900 font-semibold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed">
              {loading
                ? "Chargement..."
                : `Payer ${selectedPlan?.price}€ maintenant`}
            </button>

            <p className="text-gray-400 text-xs text-center mt-4">
              Paiement sécurisé par Stripe - Aucune information bancaire n'est
              stockée sur nos serveurs
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
