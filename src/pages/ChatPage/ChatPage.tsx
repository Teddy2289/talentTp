import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatStatus, setChatStatus] = useState("bot");
  const messagesEndRef = useRef(null);

  const botMessages = [
    "Bonjour ! Je suis là pour vous connecter avec un compagnon virtuel. 🌟",
    "Dites-moi ce que vous recherchez : une conversation détendue, un échange romantique, ou autre chose ?",
    "Parfait ! Je vous connecte avec une personne qui correspond à vos attentes...",
  ];

  useEffect(() => {
    const timers = [
      setTimeout(() => {
        addMessage(botMessages[0], "bot");
        setIsTyping(true);
      }, 800),

      setTimeout(() => {
        setIsTyping(false);
        addMessage(botMessages[1], "bot");
        setIsTyping(true);
      }, 2800),

      setTimeout(() => {
        setIsTyping(false);
        addMessage(botMessages[2], "bot");
        setIsTyping(true);
      }, 5000),

      setTimeout(() => {
        setIsTyping(false);
        addMessage(
          "Je transfère votre conversation à un vrai compagnon. ✨",
          "bot"
        );
        setChatStatus("human");

        setTimeout(() => {
          addMessage(
            "Bonjour ! Je suis ravi de discuter avec vous. Comment allez-vous aujourd'hui ?",
            "human"
          );
        }, 1200);
      }, 7500),
    ];

    return () => timers.forEach((timer) => clearTimeout(timer));
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
      if (chatStatus === "bot") {
        addMessage("C'est intéressant ! Dites-m'en plus.", "bot");
      } else {
        const responses = [
          "Je comprends parfaitement. Continuez, je vous écoute. 💫",
          "C'est fascinant ! Racontez-moi cela en détail.",
          "Je vois. Comment vous sentez-vous par rapport à cela ?",
          "Très intéressant. Que souhaiteriez-vous explorer ensuite ?",
        ];
        addMessage(
          responses[Math.floor(Math.random() * responses.length)],
          "human"
        );
      }
    }, 1200 + Math.random() * 1000);
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

  const getSenderColor = (sender) => {
    switch (sender) {
      case "user":
        return "from-[#e1af30] to-[#f3c754]";
      case "bot":
        return "from-gray-700 to-gray-600";
      case "human":
        return "from-[#6b21a8] to-[#8b5cf6]";
      default:
        return "from-gray-600 to-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[85vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl bg-gray-900/80 backdrop-blur-sm border border-gray-800/50">
        {/* En-tête du chat */}
        <motion.div
          className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700/50 p-5 flex items-center justify-between"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#6b21a8] to-[#8b5cf6] flex items-center justify-center text-white font-semibold text-lg">
                L
              </div>
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900"></div>
            </div>
            <div>
              <h2 className="font-semibold text-lg text-white">Léa</h2>
              <p className="text-gray-400 text-sm">
                {chatStatus === "bot" ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                    Connexion en cours...
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    En ligne • Écrit...
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2.5 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-colors text-gray-400 hover:text-white">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </motion.div>

        {/* Zone de messages */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-900/70 to-gray-900/50 p-5 space-y-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}>
                <div
                  className={`max-w-xs lg:max-w-md rounded-2xl p-4 relative
                  ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-[#e1af30] to-[#f3c754] text-gray-900 ml-10"
                      : "bg-gradient-to-r from-gray-800 to-gray-700 text-white mr-10"
                  }`}>
                  <p className="text-sm leading-relaxed">{message.text}</p>

                  <div
                    className={`flex items-center justify-between mt-2 text-xs ${
                      message.sender === "user"
                        ? "text-gray-700"
                        : "text-gray-400"
                    }`}>
                    <span>{getSenderName(message.sender)}</span>
                    <span>{message.timestamp}</span>
                  </div>

                  {/* Triangle indicateur */}
                  <div
                    className={`absolute top-3 w-3 h-3 rotate-45
                    ${
                      message.sender === "user"
                        ? "right-0 translate-x-1/2 bg-[#f3c754]"
                        : "left-0 -translate-x-1/2 bg-gray-700"
                    }`}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}>
              <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-4 ml-10">
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

          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* Zone de saisie */}
        <motion.form
          className="bg-gradient-to-r from-gray-900 to-gray-800 border-t border-gray-700/30 p-5"
          onSubmit={handleSendMessage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}>
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  chatStatus === "bot"
                    ? "Veuillez patienter pendant la connexion..."
                    : "Écrivez votre message..."
                }
                className="w-full bg-gray-800/50 border border-gray-700/30 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#e1af30]/30 focus:border-[#e1af30]/30 placeholder-gray-500 text-sm backdrop-blur-sm transition-all duration-200"
                disabled={chatStatus === "bot"}
              />
            </div>

            <button
              type="submit"
              disabled={inputMessage.trim() === "" || chatStatus === "bot"}
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

          {chatStatus === "bot" && (
            <motion.p
              className="text-center text-gray-500 text-xs mt-3 flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}>
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Connexion à votre compagnon en cours...
            </motion.p>
          )}
        </motion.form>
      </div>
    </div>
  );
};

export default ChatPage;
