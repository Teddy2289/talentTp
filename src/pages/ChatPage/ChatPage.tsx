import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatStatus, setChatStatus] = useState("bot");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // ✅ Un seul message d’intro
    const timer = setTimeout(() => {
      addMessage(
        "👋 Bonjour ! Prêt(e) à discuter avec ton compagnon virtuel ?",
        "bot"
      );
      setChatStatus("human");
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const addMessage = (text, sender) => {
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

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;

    addMessage(inputMessage, "user");
    setInputMessage("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "Ravi de t’écouter 💫",
        "Ça m’intéresse, continue ✨",
        "Je comprends… et toi, comment tu le ressens ?",
        "Très bien dit 👍 raconte-moi plus.",
      ];
      addMessage(
        responses[Math.floor(Math.random() * responses.length)],
        "human"
      );
    }, 1200 + Math.random() * 800);
  };

  const getSenderName = (sender) => {
    switch (sender) {
      case "bot":
        return "Système";
      case "human":
        return "Léa";
      case "user":
        return "Vous";
      default:
        return sender;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100 flex flex-col items-center py-20">
      {/* Hero texte */}
      <motion.div
        className="text-center max-w-2xl mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl md:text-5xl font-light leading-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#e1af30] via-[#f3c754] to-[#e1af30]">
            Discutez en direct
          </span>{" "}
          <br />
          <span className="text-gray-300 text-2xl md:text-3xl">
            Des conversations authentiques, 24/7
          </span>
        </h1>
      </motion.div>

      {/* Chat container */}
      <div className="w-full max-w-3xl h-[80vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl bg-gray-900/80 backdrop-blur-md border border-gray-800/50">
        {/* Header */}
        <motion.div
          className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700/50 p-5 flex items-center justify-between"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#6b21a8] to-[#8b5cf6] flex items-center justify-center text-white font-semibold text-lg">
                L
              </div>
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-gray-900"></div>
            </div>
            <div>
              <h2 className="font-semibold text-lg text-white">Léa</h2>
              <p className="text-gray-400 text-sm">En ligne</p>
            </div>
          </div>
        </motion.div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-900/70 to-gray-900/50 p-5 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}>
                <div
                  className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-3 relative shadow-md ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-[#e1af30] to-[#f3c754] text-gray-900 ml-10"
                      : "bg-gray-800/90 text-gray-100 mr-10"
                  }`}>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <div
                    className={`flex items-center justify-between mt-2 text-xs ${
                      message.sender === "user"
                        ? "text-gray-800"
                        : "text-gray-400"
                    }`}>
                    <span>{getSenderName(message.sender)}</span>
                    <span>{message.timestamp}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Animation "typing" */}
          {isTyping && (
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}>
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
          className="bg-gradient-to-r from-gray-900 to-gray-800 border-t border-gray-700/30 p-4"
          onSubmit={handleSendMessage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}>
          <div className="flex gap-3 items-center">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Écrivez votre message..."
              className="flex-1 bg-gray-800/50 border border-gray-700/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#e1af30]/30 focus:border-[#e1af30]/30 placeholder-gray-500 text-sm backdrop-blur-sm transition-all duration-200"
            />
            <button
              type="submit"
              disabled={inputMessage.trim() === ""}
              className="bg-gradient-to-r from-[#e1af30] to-[#f3c754] text-gray-900 font-medium rounded-xl w-12 h-12 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95">
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
        </motion.form>
      </div>
    </div>
  );
};

export default ChatPage;
