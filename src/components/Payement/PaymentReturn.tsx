import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { paymentService } from "../../services/paymentService";

const PaymentReturn: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const sessionId = searchParams.get("session_id");
  const conversationId = searchParams.get("conversation_id");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId || !conversationId) {
        setStatus("error");
        return;
      }

      try {
        const success = await paymentService.verifyPayment(
          sessionId,
          parseInt(conversationId)
        );

        if (success) {
          setStatus("success");
          // Rediriger après un délai
          setTimeout(() => {
            window.location.href = `/chat/${conversationId}`;
          }, 3000);
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setStatus("error");
      }
    };

    verifyPayment();
  }, [sessionId, conversationId]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-2xl text-center max-w-md">
        {status === "loading" && (
          <>
            <div className="w-16 h-16 border-4 border-[#e1af30] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Vérification du paiement
            </h2>
            <p className="text-gray-400">
              Nous vérifions votre paiement, merci de patienter...
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Paiement réussi !
            </h2>
            <p className="text-gray-400">
              Votre abonnement a été activé. Redirection vers la conversation...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Erreur de paiement
            </h2>
            <p className="text-gray-400 mb-4">
              Une erreur s'est produite lors du traitement de votre paiement.
            </p>
            <button
              onClick={() => (window.location.href = `/chat/${conversationId}`)}
              className="bg-[#e1af30] text-gray-900 px-6 py-2 rounded-xl font-semibold">
              Retour à la conversation
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentReturn;
