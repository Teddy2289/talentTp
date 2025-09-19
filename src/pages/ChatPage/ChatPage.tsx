import React, { useState, useEffect, useRef, useCallback } from "react";
import { useConversation } from "../../contexts/ConversationContext";
import { useAuth } from "../../contexts/AuthContext";
import { useSocket } from "../../contexts/SocketContext";
import { Link } from "react-router-dom";
import {
  Plus,
  Phone,
  Video,
  MoreHorizontal,
  Smile,
  Paperclip,
  Send,
  User,
  Loader,
  Clock,
  CreditCard,
  Search,
} from "lucide-react";
import { modelService } from "../../services/modelService";
import { settingsApi } from "../../core/settingsApi";

// Types
interface Model {
  id: number;
  prenom: string;
  nom?: string;
  photo?: string;
}

interface Client {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  type: string;
  Conversation: Conversation[];
}

interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  isFromModel: boolean;
  content: string;
  created_at: string;
  sender: {
    id: number;
    first_name: string;
    last_name: string;
    type: string;
  };
}

interface Conversation {
  id: number;
  modelId: number;
  clientId: number;
  status: string;
  is_premium: boolean;
  paymentId: number | null;
  message_count: number;
  created_at: string;
  updated_at: string;
  messages: Message[];
  model?: Model;
  client?: Client;
}

const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const { currentConversation, createConversation, getConversation } =
    useConversation();

  const [inputMessage, setInputMessage] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState<
    number | null
  >(null);
  const [model, setModel] = useState<Model | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [loadingModel, setLoadingModel] = useState(true);
  const [loadingClients, setLoadingClients] = useState(false);
  const [conversationMessages, setConversationMessages] = useState<Message[]>(
    []
  );
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [conversationMessages, scrollToBottom]);

  // Écouter les nouveaux messages via Socket.io
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: Message) => {
      setConversationMessages((prev) => [...prev, message]);
    };

    const handleConversationHistory = (messages: Message[]) => {
      setConversationMessages(messages);
      setLoadingMessages(false);
    };

    const handleAccessDenied = (data: { error: string }) => {
      console.error("Access denied:", data.error);
      setLoadingMessages(false);
    };

    socket.on("new_message", handleNewMessage);
    socket.on("conversation_history", handleConversationHistory);
    socket.on("access_denied", handleAccessDenied);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("conversation_history", handleConversationHistory);
      socket.off("access_denied", handleAccessDenied);
    };
  }, [socket]);

  // Rejoindre une conversation quand elle est sélectionnée
  // Rejoindre une conversation quand elle est sélectionnée
  useEffect(() => {
    if (socket && selectedConversationId && user) {
      setLoadingMessages(true);

      // Timeout pour éviter le loading infini
      const timeoutId = setTimeout(() => {
        setLoadingMessages(false);
      }, 10000); // 10 secondes timeout

      socket.emit("join_conversation", {
        conversationId: selectedConversationId,
        userId: user.id,
      });

      return () => {
        clearTimeout(timeoutId);
      };
    }

    return () => {
      if (socket && selectedConversationId) {
        socket.emit("leave_conversation", selectedConversationId);
      }
    };
  }, [socket, selectedConversationId, user]);

  // Charger le modèle depuis les settings
  useEffect(() => {
    const fetchModel = async () => {
      try {
        setLoadingModel(true);
        const response = await settingsApi.getFrontendSettings();
        const frontendSettings = response.data.data;
        if (frontendSettings?.general?.model) {
          setModel(frontendSettings.general.model);
        }
      } catch (error) {
        console.error("Erreur récupération settings:", error);
      } finally {
        setLoadingModel(false);
      }
    };
    fetchModel();
  }, []);

  // Charger les clients du modèle
  useEffect(() => {
    const fetchClients = async () => {
      if (!model?.id) return;
      try {
        setLoadingClients(true);
        const clientsData = await modelService.getModelClients(model.id);
        setClients(clientsData);
        setFilteredClients(clientsData);
      } catch (error) {
        console.error("Erreur récupération clients:", error);
      } finally {
        setLoadingClients(false);
      }
    };
    fetchClients();
  }, [model]);

  // Filtrer les clients selon la recherche
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredClients(clients);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = clients.filter(
        (client) =>
          client.first_name.toLowerCase().includes(query) ||
          client.last_name.toLowerCase().includes(query) ||
          client.email.toLowerCase().includes(query)
      );
      setFilteredClients(filtered);
    }
  }, [searchQuery, clients]);

  const handleSelectConversation = async (id: number) => {
    setSelectedConversationId(id);
    await getConversation(id);
  };

  const handleNewConversation = async () => {
    if (!user || !model?.id) return;
    const newConv = await createConversation(user.id, model.id);
    if (newConv?.id) {
      setSelectedConversationId(newConv.id);
      setSelectedClientId(user.id);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (
      !inputMessage.trim() ||
      !user ||
      !selectedConversationId ||
      !socket ||
      !isConnected
    )
      return;

    setIsSending(true);

    try {
      // Envoyer le message via Socket.io
      socket.emit("send_message", {
        conversationId: selectedConversationId,
        senderId: user.id,
        content: inputMessage,
        isFromModel: false,
      });

      setInputMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleSelectClient = (clientId: number) => {
    setSelectedClientId(clientId);
    const client = clients.find((c) => c.id === clientId);
    if (client && client.Conversation.length > 0) {
      const conversation = client.Conversation[0];
      setSelectedConversationId(conversation.id);
      getConversation(conversation.id);
    }
  };

  // Formater la date
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pt-24 pb-10 px-4">
      <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Sidebar clients */}
        <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col bg-gray-800 border-r border-gray-700">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <div className="flex items-center">
              <h3 className="font-semibold text-lg flex items-center text-white">
                <User className="mr-2" size={20} /> Conversations
              </h3>
              <div
                className={`ml-2 w-3 h-3 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
                title={isConnected ? "Connecté" : "Déconnecté"}
              />
            </div>
            <button
              onClick={handleNewConversation}
              title="Nouvelle conversation"
              className="p-2 bg-yellow-600 hover:bg-yellow-700 rounded-full transition-colors">
              <Plus size={18} className="text-white" />
            </button>
          </div>

          {/* Barre recherche */}
          <div className="p-3 border-b border-gray-700">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Rechercher un client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingClients ? (
              <div className="p-4 flex justify-center">
                <Loader className="animate-spin text-yellow-600" />
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="p-4 text-center text-gray-400">Aucun client</div>
            ) : (
              filteredClients.map((client) => (
                <div key={client.id} className="border-b border-gray-700">
                  <div
                    onClick={() => handleSelectClient(client.id)}
                    className={`p-3 cursor-pointer transition-colors ${
                      selectedClientId === client.id
                        ? "bg-gradient-to-r from-yellow-900/30 to-gray-800"
                        : "hover:bg-gray-700"
                    }`}>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-md">
                        {client.first_name?.charAt(0) || "C"}
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <h4 className="font-medium text-white truncate">
                          {client.first_name} {client.last_name}
                        </h4>
                        <p className="text-sm text-gray-400 truncate">
                          {client.email}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {client.Conversation.length} conversation(s)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Liste conversations */}
                  {selectedClientId === client.id &&
                    client.Conversation.map((conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() =>
                          handleSelectConversation(conversation.id)
                        }
                        className={`pl-14 pr-3 py-2 cursor-pointer transition-colors text-sm ${
                          selectedConversationId === conversation.id
                            ? "bg-yellow-800/40 text-white"
                            : "hover:bg-gray-700 text-gray-300"
                        }`}>
                        <div className="flex justify-between items-center">
                          <span className="truncate">
                            Conversation #{conversation.id}
                          </span>
                          <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">
                            {conversation.message_count}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 flex items-center mt-1">
                          <Clock size={12} className="mr-1" />
                          {new Date(
                            conversation.updated_at
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat principal */}
        <div className="flex-1 flex flex-col bg-gray-900">
          <div className="px-6 py-4 flex justify-between items-center border-b border-gray-700 bg-gray-800">
            <div className="flex items-center">
              {currentConversation?.model && (
                <>
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-md">
                    {currentConversation.model.prenom?.charAt(0) || "S"}
                  </div>
                  <div className="ml-4">
                    <h2 className="font-semibold text-white">
                      {currentConversation.model.prenom}{" "}
                      {currentConversation.model.nom}
                    </h2>
                    <p className="text-sm text-gray-400">En ligne</p>
                  </div>
                </>
              )}
            </div>
            <div className="flex space-x-3">
              <Link
                to="/plans"
                title="Acheter des crédits"
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors">
                <CreditCard size={20} className="text-yellow-500" />
              </Link>
              <button
                title="Appel vocal"
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors">
                <Phone size={20} className="text-gray-300" />
              </button>
              <button
                title="Appel vidéo"
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors">
                <Video size={20} className="text-gray-300" />
              </button>
              <button
                title="Plus d'options"
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors">
                <MoreHorizontal size={20} className="text-gray-300" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-900 to-gray-800">
            {loadingMessages ? (
              <div className="flex justify-center items-center h-full">
                <Loader className="animate-spin text-yellow-600" size={32} />
              </div>
            ) : (
              <div className="space-y-4">
                {conversationMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.isFromModel ? "justify-start" : "justify-end"
                    }`}>
                    <div
                      className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl p-4 shadow-md ${
                        msg.isFromModel
                          ? "bg-gray-800 text-gray-100"
                          : "bg-gradient-to-r from-yellow-600 to-yellow-700 text-white"
                      }`}>
                      <div className="text-sm mb-1">{msg.content}</div>
                      <div
                        className={`text-xs flex items-center justify-end ${
                          msg.isFromModel ? "text-gray-400" : "text-yellow-100"
                        }`}>
                        <Clock size={10} className="mr-1" />
                        {formatTime(msg.created_at)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Zone de saisie */}
          <div className="p-4 flex items-center bg-gray-800 border-t border-gray-700">
            <button
              title="Emoji"
              className="p-2 text-gray-400 hover:text-yellow-500 mx-1 transition-colors">
              <Smile size={24} />
            </button>
            <button
              title="Pièce jointe"
              className="p-2 text-gray-400 hover:text-yellow-500 mx-1 transition-colors">
              <Paperclip size={24} />
            </button>
            <form onSubmit={handleSendMessage} className="flex-1 flex mx-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  isConnected
                    ? "Tapez votre message..."
                    : "Connexion en cours..."
                }
                disabled={isSending || !isConnected}
                className="flex-1 px-5 py-3 bg-gray-700 text-white rounded-full border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:opacity-50"
              />
            </form>
            <button
              onClick={handleSendMessage}
              disabled={isSending || !inputMessage.trim() || !isConnected}
              className="p-3 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-full hover:from-yellow-700 hover:to-yellow-800 disabled:opacity-50 transition-all shadow-md mx-1">
              {isSending ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
