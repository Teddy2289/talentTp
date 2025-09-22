import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useSocket } from "../../contexts/SocketContext";
import { moderatorService } from "../../services/moderatorService";
import { CheckCircle, Loader, Send } from "lucide-react";

interface PendingConversation {
  id: number;
  client: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  model: {
    id: number;
    prenom: string;
  };
  lastMessage: {
    content: string;
    created_at: string;
  };
  message_count: number;
}

const ModeratorInterface: React.FC = () => {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const [conversations, setConversations] = useState<PendingConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<
    number | null
  >(null);
  const [responseText, setResponseText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (user && user.type === "Agent") {
      loadConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const data = await moderatorService.getAssignedConversations(user.id);
      setConversations(data);
    } catch (error) {
      console.error("Error loading conversations:", error);
      setStatusMessage("Erreur lors du chargement des conversations");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendResponse = async (conversationId: number) => {
    if (!responseText.trim()) return;

    try {
      setIsLoading(true);
      await moderatorService.sendModeratorResponse(
        conversationId,
        responseText
      );

      setResponseText("");
      setStatusMessage("Réponse envoyée avec succès");

      // Émettre un événement socket pour informer le client
      if (socket) {
        socket.emit("moderator_response", {
          conversationId,
          moderatorId: user.id,
        });
      }

      // Recharger la liste des conversations
      setTimeout(() => loadConversations(), 1000);
    } catch (error) {
      console.error("Error sending response:", error);
      setStatusMessage("Erreur lors de l'envoi de la réponse");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsProcessed = async (conversationId: number) => {
    try {
      await moderatorService.markAsProcessed(conversationId);
      setStatusMessage("Conversation marquée comme traitée");
      loadConversations();
    } catch (error) {
      console.error("Error marking as processed:", error);
      setStatusMessage("Erreur lors du traitement");
    }
  };

  if (user?.type !== "Agent") {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        Accès réservé aux modérateurs
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Interface Modérateur</h2>

      {statusMessage && (
        <div
          className={`p-3 mb-4 rounded-lg ${
            statusMessage.includes("Erreur")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}>
          {statusMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liste des conversations */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            Conversations en attente
          </h3>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader className="animate-spin text-blue-600" size={24} />
            </div>
          ) : conversations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Aucune conversation en attente
            </p>
          ) : (
            <div className="space-y-3">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedConversation === conv.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedConversation(conv.id)}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">
                        {conv.client.first_name} {conv.client.last_name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {conv.client.email}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {conv.message_count} message(s)
                      </p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      En attente
                    </span>
                  </div>

                  {conv.lastMessage && (
                    <div className="mt-2 p-2 bg-white rounded border text-sm">
                      <p className="text-gray-700 truncate">
                        {conv.lastMessage.content}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(
                          conv.lastMessage.created_at
                        ).toLocaleTimeString()}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Zone de réponse */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Répondre</h3>

          {selectedConversation ? (
            <>
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Tapez votre réponse ici..."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />

              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => handleSendResponse(selectedConversation)}
                  disabled={isLoading || !responseText.trim()}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                  {isLoading ? (
                    <Loader className="animate-spin mr-2" size={16} />
                  ) : (
                    <Send size={16} className="mr-2" />
                  )}
                  Envoyer la réponse
                </button>

                <button
                  onClick={() => handleMarkAsProcessed(selectedConversation)}
                  disabled={isLoading}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
                  <CheckCircle size={16} className="mr-2" />
                  Marquer comme traité
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Sélectionnez une conversation pour répondre
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModeratorInterface;
