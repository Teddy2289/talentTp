// pages/PaymentPlansPage.tsx
import React, { useEffect } from "react";
import { usePayment } from "../../contexts/PaymentContext";
import { useAuth } from "../../contexts/AuthContext";
import { useAlert } from "../../contexts/AlertContext";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  import.meta.env.VITE_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const PaymentPlansPage: React.FC = () => {
  const { plans, loading, getPlans } = usePayment();
  const { user } = useAuth();
  const { showAlert } = useAlert();

  useEffect(() => {
    getPlans();
  }, []);

  const handlePurchase = async (planId: number) => {
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe n'a pas pu être initialisé");

      // Appel à votre API pour créer une session de checkout
      const response = await fetch("/api/payments/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ planId, userId: user?.id }),
      });

      const { id: sessionId } = await response.json();

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        showAlert("error", `Erreur de redirection: ${error.message}`);
      }
    } catch (error: any) {
      showAlert("error", `Erreur: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Chargement des plans...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Choisissez votre plan
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
            <p className="text-3xl font-bold text-indigo-600 mb-4">
              {plan.price} {plan.currency}
            </p>
            <p className="text-gray-600 mb-4">
              {plan.credits} crédits de conversation
            </p>
            <ul className="mb-6">
              <li className="flex items-center mb-2">
                <svg
                  className="w-5 h-5 text-green-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"></path>
                </svg>
                Accès prioritaire
              </li>
              <li className="flex items-center mb-2">
                <svg
                  className="w-5 h-5 text-green-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"></path>
                </svg>
                Support 24/7
              </li>
            </ul>
            <button
              onClick={() => handlePurchase(plan.id)}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
              Choisir ce plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentPlansPage;
