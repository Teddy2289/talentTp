import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function SuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const session_id = searchParams.get("session_id");
  const conversation_id = searchParams.get("conversation_id");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!session_id || !conversation_id) return;

      try {
        const response = await fetch(
          "http://localhost:3000/api/payment/verify",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId: session_id,
              conversationId: conversation_id,
            }),
          }
        );

        const data = await response.json();

        if (data.success) {
          setTimeout(() => {
            navigate(`/chat?conversation=${conversation_id}`);
          }, 3000);
        } else {
          setError("Erreur de vérification du paiement");
          setLoading(false);
        }
      } catch (err) {
        console.error("Error verifying payment:", err);
        setError("Une erreur est survenue");
        setLoading(false);
      }
    };

    verifyPayment();
  }, [session_id, conversation_id, navigate]);

  if (loading && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Vérification de votre paiement...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800">
            Erreur de paiement
          </h1>
          <p className="text-gray-600 mt-2">{error}</p>
          <button
            onClick={() => navigate("/chat")}
            className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
            Retour au chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="text-green-500 text-4xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-gray-800">Paiement réussi !</h1>
        <p className="text-gray-600 mt-2">
          Vous allez être redirigé vers votre conversation...
        </p>
      </div>
    </div>
  );
}
