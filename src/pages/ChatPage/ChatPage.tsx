import React, { useState, useEffect, useRef, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Types
interface Message {
  id: number;
  text: string;
  sender: "bot" | "human" | "user" | "system";
  timestamp: string;
}

interface ModelData {
  id: number;
  prenom: string;
  age: number;
  nationalite: string;
  passe_temps: string;
  citation: string;
  domicile: string;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [modelData, setModelData] = useState<ModelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [botReplyCount, setBotReplyCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll automatique
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages, isTyping]);

  // Fonction utilitaire pour ajouter un message
  const addMessage = (text: string, sender: Message["sender"]) => {
    setMessages((prev) => [
      ...prev,
      {
        text,
        sender,
        id: Date.now() + Math.random(),
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  // Charger données modèle
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const fetchModelData = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:3000/api/settings/frontend");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const model = data?.data?.general?.model;

        if (data.success && model) {
          setModelData(model);
          timer = setTimeout(() => {
            addMessage(
              `👋 Bonjour ! Je suis ${model.prenom}, prêt(e) à discuter avec toi ?`,
              "bot"
            );
          }, 1200);
        } else {
          throw new Error("Modèle introuvable");
        }
      } catch {
        timer = setTimeout(() => {
          addMessage(
            "👋 Bonjour ! Prêt(e) à discuter avec ton compagnon virtuel ?",
            "bot"
          );
        }, 1200);
      } finally {
        setLoading(false);
      }
    };

    fetchModelData();
    return () => clearTimeout(timer);
  }, []);

  // API Chat
  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    addMessage(inputMessage, "user");
    const messageText = inputMessage;
    setInputMessage("");

    // Vérifier limite gratuite
    if (botReplyCount >= 2) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addMessage("💎 Abonnez-vous pour continuer la discussion !", "system");
      }, 1500);
      return;
    }

    setIsTyping(true);
    try {
      const response = await fetch("http://localhost:3000/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          history: messages.map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
          modelData,
        }),
      });

      const data = await response.json();
      if (data.success) {
        addMessage(data.reply, "human");
        setBotReplyCount((prev) => prev + 1);

        if (botReplyCount === 1) {
          setTimeout(() => {
            addMessage("🔒 Passez en premium pour plus d'exper .", "system");
          }, 800);
        }
      } else {
        addMessage(
          "❌ Une erreur est survenue, réessayez plus tard.",
          "system"
        );
      }
    } catch {
      addMessage("⚠️ Service indisponible.", "system");
    } finally {
      setIsTyping(false);
    }
  };

  // Utilitaires (avatars & noms)
  const getSenderName = (sender: Message["sender"]) => {
    if (sender === "human") return modelData?.prenom || "Léa";
    if (sender === "user") return "Vous";
    return "Système";
  };

  const getAvatar = (sender: Message["sender"]) => {
    const circle = (bg: string, content: React.ReactNode) => (
      <div
        className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center text-white font-semibold text-lg`}>
        {content}
      </div>
    );

    switch (sender) {
      case "human":
        return circle(
          "bg-gradient-to-r from-purple-500 to-pink-500",
          modelData?.prenom.charAt(0) || "L"
        );
      case "user":
        return circle("bg-gradient-to-r from-blue-500 to-cyan-400", "V");
      case "system":
        return circle("bg-gradient-to-r from-gray-600 to-gray-400", "⚙️");
      default:
        return circle("bg-gradient-to-r from-green-500 to-emerald-400", "S");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100 flex flex-col items-center py-20">
      {/* Hero */}
      <motion.div
        className="text-center max-w-2xl mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl md:text-5xl font-light leading-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#e1af30] via-[#f3c754] to-[#e1af30]">
            Discutez avec {modelData?.prenom || "notre modèle"}
          </span>
          <br />
          <span className="text-gray-300 text-2xl md:text-3xl">
            Des conversations authentiques, 24/7
          </span>
        </h1>
        {modelData && (
          <p className="text-gray-400 mt-4">
            {modelData.age} ans • {modelData.nationalite} • {modelData.domicile}
          </p>
        )}
      </motion.div>

      {/* Chat */}
      <div className="w-full max-w-3xl h-[80vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl bg-gray-900/80 backdrop-blur-md border border-gray-800/50">
        {/* Header */}
        <motion.div
          className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700/50 p-5 flex items-center justify-between"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-4">
            {getAvatar("human")}
            <div>
              <h2 className="font-semibold text-lg text-white">
                {modelData?.prenom || "Léa"}
              </h2>
              <p className="text-gray-400 text-sm">
                {botReplyCount < 2 ? "En ligne" : "Premium requis"}
              </p>
            </div>
          </div>
          {botReplyCount >= 2 && (
            <div className="bg-amber-500/20 text-amber-300 text-xs px-3 py-1 rounded-full border border-amber-500/30">
              Premium requis
            </div>
          )}
        </motion.div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-900/70 to-gray-900/50 p-5 space-y-4 scrollbar-thin scrollbar-thumb-gray-700">
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                className={`flex ${
                  m.sender === "user" ? "justify-end" : "justify-start"
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}>
                {m.sender !== "user" && (
                  <div className="mr-3 self-end">{getAvatar(m.sender)}</div>
                )}
                <div
                  className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-3 shadow-md ${
                    m.sender === "user"
                      ? "bg-gradient-to-r from-[#e1af30] to-[#f3c754] text-gray-900 ml-10"
                      : m.sender === "system"
                      ? "bg-gradient-to-r from-purple-900/70 to-purple-800/70 text-gray-100 border border-purple-700/30"
                      : "bg-gray-800/90 text-gray-100 mr-10"
                  }`}>
                  <p className="text-sm leading-relaxed">{m.text}</p>
                  <div
                    className={`flex justify-between mt-2 text-xs ${
                      m.sender === "user" ? "text-gray-800" : "text-gray-400"
                    }`}>
                    <span>{getSenderName(m.sender)}</span>
                    <span>{m.timestamp}</span>
                  </div>
                </div>
                {m.sender === "user" && (
                  <div className="ml-3 self-end">{getAvatar("user")}</div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}>
              <div className="mr-3 self-end">{getAvatar("human")}</div>
              <div className="bg-gray-800/90 rounded-2xl px-4 py-3 mr-10">
                <div className="flex space-x-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} className="h-6" />
        </div>

        {/* Input */}
        <motion.form
          onSubmit={handleSendMessage}
          className="bg-gradient-to-r from-gray-900 to-gray-800 border-t border-gray-700/30 p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}>
          <div className="flex gap-3 items-center">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                botReplyCount >= 2
                  ? "Abonnez-vous pour continuer..."
                  : "Écrivez votre message..."
              }
              disabled={botReplyCount >= 2}
              className="flex-1 bg-gray-800/50 border border-gray-700/30 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#e1af30]/30 placeholder-gray-500 text-sm disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || botReplyCount >= 2}
              className="bg-gradient-to-r from-[#e1af30] to-[#f3c754] text-gray-900 rounded-xl w-12 h-12 flex items-center justify-center disabled:opacity-40">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>

          {botReplyCount >= 2 && (
            <div className="mt-3 text-center">
              <button
                type="button"
                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-5 py-2 rounded-full">
                S'abonner au Premium
              </button>
            </div>
          )}
        </motion.form>
      </div>
    </div>
  );
};

export default ChatPage;
