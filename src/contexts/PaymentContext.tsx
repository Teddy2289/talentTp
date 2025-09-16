// contexts/PaymentContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { loadStripe } from "@stripe/stripe-js";
import { apiService } from "../core/payment/plans";
import { useAlert } from "./AlertContext";

const stripePromise = loadStripe(
  import.meta.env.VITE_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface PaymentPlan {
  id: number;
  name: string;
  price: number;
  currency: string;
  credits: number;
  is_active: boolean;
}

interface PaymentContextType {
  plans: PaymentPlan[];
  loading: boolean;
  getPlans: () => Promise<void>;
  createCheckout: (
    planId: number,
    conversationId: number,
    userId: number
  ) => Promise<void>;
  verifyPayment: (sessionId: string, conversationId: number) => Promise<void>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }
  return context;
};

interface PaymentProviderProps {
  children: ReactNode;
}

export const PaymentProvider: React.FC<PaymentProviderProps> = ({
  children,
}) => {
  const [plans, setPlans] = useState<PaymentPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const getPlans = async () => {
    setLoading(true);
    try {
      const plansData = await apiService.getPaymentPlans();
      setPlans(plansData);
    } catch (error: any) {
      showAlert("error", `Erreur de chargement des plans: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createCheckout = async (
    planId: number,
    conversationId: number,
    userId: number
  ) => {
    setLoading(true);
    try {
      const { id: sessionId } = await apiService.createCheckoutSession(
        planId,
        conversationId,
        userId
      );
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error("Stripe n'a pas pu être initialisé");
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        showAlert("error", `Erreur de redirection Stripe: ${error.message}`);
      }
    } catch (error: any) {
      showAlert("error", `Erreur de création de session: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (sessionId: string, conversationId: number) => {
    try {
      const result = await apiService.verifyPayment(sessionId, conversationId);
      if (result.success) {
        showAlert("success", "Paiement vérifié avec succès!");
      } else {
        showAlert("warning", "Paiement non complété");
      }
      return result.success;
    } catch (error: any) {
      showAlert("error", `Erreur de vérification: ${error.message}`);
      return false;
    }
  };

  const value = {
    plans,
    loading,
    getPlans,
    createCheckout,
    verifyPayment,
  };

  return (
    <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>
  );
};
