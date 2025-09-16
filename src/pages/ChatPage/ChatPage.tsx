import React, { useState, useEffect, useRef, useCallback } from "react";
import { useConversation } from "../../contexts/ConversationContext";
import { useAIChat } from "../../contexts/useAIChat";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Phone,
  Video,
  MoreHorizontal,
  Smile,
  Paperclip,
  Send,
  MessageCircle,
  User,
  Loader,
  Clock,
} from "lucide-react";
import { modelService } from "../../services/modelService";
import { settingsApi } from "../../core/settingsApi";
import { conversationService } from "../../services/chatService";

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
  const {
    conversations,
    currentConversation,
    createConversation,
    getConversation,
    incrementMessage,
    loading: convLoading,
  } = useConversation();
  const { messages, isLoading, sendMessage } = useAIChat();

  const [inputMessage, setInputMessage] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState<
    number | null
  >(null);
  const [model, setModel] = useState<Model | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [loadingModel, setLoadingModel] = useState(true);
  const [loadingClients, setLoadingClients] = useState(false);
  const [conversationMessages, setConversationMessages] = useState<Message[]>(
    []
  );
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, conversationMessages, scrollToBottom]);

  // 👉 Charger le modèle depuis les settings
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

  // 👉 Charger les clients du modèle unique
  useEffect(() => {
    const fetchClients = async () => {
      if (!model?.id) return;
      try {
        setLoadingClients(true);
        const clientsData = await modelService.getModelClients(model.id);
        setClients(clientsData);
      } catch (error) {
        console.error("Erreur récupération clients:", error);
      } finally {
        setLoadingClients(false);
      }
    };
    fetchClients();
  }, [model]);

  // 👉 Charger les messages d'une conversation
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversationId) return;

      try {
        setLoadingMessages(true);
        const response = await conversationService.getConversationMessages(
          selectedConversationId
        );
        if (response.success) {
          setConversationMessages(response.data);
        }
      } catch (error) {
        console.error("Erreur récupération messages:", error);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedConversationId]);

  const handleSelectConversation = async (id: number) => {
    setSelectedConversationId(id);
    await getConversation(id);
  };

  const handleNewConversation = async () => {
    if (!user || !model?.id) return;
    const newConv = await createConversation(user.id, model.id);
    if (newConv?.id) setSelectedConversationId(newConv.id);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputMessage.trim() || !user || !currentConversation) return;

    const response = await sendMessage(
      inputMessage,
      currentConversation.model,
      user.id
    );

    if (response?.requiresPayment) {
      setInputMessage("");
      return;
    }

    await incrementMessage(currentConversation.id);
    setInputMessage("");

    // Recharger les messages après envoi
    if (selectedConversationId) {
      const updatedMessages = await conversationService.getConversationMessages(
        selectedConversationId
      );
      if (updatedMessages.success) {
        setConversationMessages(updatedMessages.data);
      }
    }
  };

  const handleSelectClient = (clientId: number) => {
    setSelectedClientId(clientId);
    const client = clients.find((c) => c.id === clientId);
    if (client && client.Conversation.length > 0) {
      setSelectedConversationId(client.Conversation[0].id);
      getConversation(client.Conversation[0].id);
    }
  };

  // Formater la date pour l'affichage
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="container h-[calc(80vh-5rem)] mt-5 bg-gray-900 rounded-xl shadow-lg overflow-hidden text-gray-100">
      <div className="flex h-full">
        {/* Sidebar modèle unique */}
        <div className="w-1/4 border-r border-gray-700 flex flex-col bg-gray-800">
          <div className="p-4 border-b border-gray-700">
            <h3 className="font-semibold text-lg flex items-center">
              Modèle sélectionné
            </h3>
          </div>
          <div className="flex-1 flex items-center justify-center">
            {loadingModel ? (
              <Loader className="animate-spin" />
            ) : model ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto font-bold text-xl">
                  {model.prenom?.charAt(0) || "M"}
                </div>
                <h4 className="mt-2 font-medium">
                  {model.prenom} {model.nom}
                </h4>
              </div>
            ) : (
              <p className="text-gray-400">Aucun modèle configuré</p>
            )}
          </div>
        </div>

        {/* Sidebar des clients avec leurs conversations */}
        <div className="w-1/4 border-r border-gray-700 flex flex-col bg-gray-800">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h3 className="font-semibold text-lg flex items-center">
              <User className="mr-2" size={20} /> Clients
            </h3>
            <button
              onClick={handleNewConversation}
              title="Nouvelle conversation"
              className="text-gray-400 hover:text-gray-200">
              <Plus size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingClients ? (
              <div className="p-4 flex justify-center">
                <Loader className="animate-spin" />
              </div>
            ) : clients.length === 0 ? (
              <div className="p-4 text-gray-400">Aucun client</div>
            ) : (
              clients.map((client) => (
                <div key={client.id} className="border-b border-gray-700">
                  <div
                    onClick={() => handleSelectClient(client.id)}
                    className={`p-3 cursor-pointer hover:bg-gray-700 ${
                      selectedClientId === client.id ? "bg-gray-700" : ""
                    }`}>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                        {client.first_name?.charAt(0) || "C"}
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <h4 className="font-medium truncate">
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

                  {/* Liste des conversations du client */}
                  {selectedClientId === client.id &&
                    client.Conversation.map((conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() =>
                          handleSelectConversation(conversation.id)
                        }
                        className={`pl-12 pr-3 py-2 cursor-pointer hover:bg-gray-700 text-sm ${
                          selectedConversationId === conversation.id
                            ? "bg-yellow-900"
                            : ""
                        }`}>
                        <div className="flex justify-between items-center">
                          <span className="truncate">
                            Conversation #{conversation.id}
                          </span>
                          <span className="text-xs text-gray-400">
                            {conversation.message_count} messages
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

        {/* Section de chat principale */}
        <div className="flex-1 flex flex-col">
          <div className="px-4 py-3 flex justify-between items-center border-b border-gray-700 bg-gray-800">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center font-bold text-lg">
                {currentConversation?.model?.prenom?.charAt(0) || "S"}
              </div>
              <div className="ml-3">
                <h2 className="font-semibold">
                  {currentConversation?.model?.prenom ||
                    "Sélectionnez une conversation"}
                </h2>
                <p className="text-xs text-gray-400">
                  {selectedConversationId ? "En ligne" : "Hors ligne"}
                </p>
              </div>
            </div>
            <div className="flex space-x-4 text-gray-400">
              <button title="Appel vocal" className="hover:text-gray-200">
                <Phone size={20} />
              </button>
              <button title="Appel vidéo" className="hover:text-gray-200">
                <Video size={20} />
              </button>
              <button title="Plus d'options" className="hover:text-gray-200">
                <MoreHorizontal size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-gray-900">
            {loadingMessages ? (
              <div className="flex justify-center items-center h-full">
                <Loader className="animate-spin" />
              </div>
            ) : conversationMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-4 shadow-md">
                  <MessageCircle size={48} className="text-yellow-600" />
                </div>
                <p className="text-lg font-medium">
                  {selectedConversationId
                    ? "Envoyez un message pour commencer"
                    : "Sélectionnez une conversation"}
                </p>
                <p className="text-sm mt-2 max-w-md">
                  Les messages sont sécurisés avec un chiffrement de bout en
                  bout
                </p>
              </div>
            ) : (
              conversationMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex mb-4 ${
                    msg.isFromModel ? "justify-start" : "justify-end"
                  }`}>
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl p-3 ${
                      msg.isFromModel
                        ? "bg-gray-800 text-gray-100 shadow-sm"
                        : "bg-yellow-600 text-gray-100 font-medium"
                    }`}>
                    <div className="text-sm">{msg.content}</div>
                    <div className="text-xs text-gray-400 flex items-center justify-end mt-1">
                      <Clock size={10} className="mr-1" />
                      {formatTime(msg.created_at)}
                    </div>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start mb-2">
                <div className="bg-gray-800 text-gray-100 rounded-2xl p-3 max-w-xs md:max-w-md shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}></div>
                    <div
                      className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 flex items-center bg-gray-800">
            <button
              title="Emoji"
              className="p-2 text-gray-400 hover:text-gray-200 mx-1">
              <Smile size={20} />
            </button>
            <button
              title="Pièce jointe"
              className="p-2 text-gray-400 hover:text-gray-200 mx-1">
              <Paperclip size={20} />
            </button>
            <form onSubmit={handleSendMessage} className="flex-1 flex mx-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  selectedConversationId
                    ? "Tapez un message"
                    : "Sélectionnez une conversation"
                }
                disabled={isLoading || !selectedConversationId}
                className="flex-1 px-4 py-2 bg-gray-700 rounded-full border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:opacity-50 text-gray-100"
              />
            </form>
            <button
              onClick={handleSendMessage}
              disabled={
                isLoading || !inputMessage.trim() || !selectedConversationId
              }
              className="p-2 bg-yellow-600 text-white rounded-full hover:bg-yellow-700 disabled:opacity-50 transition-colors mx-1">
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
