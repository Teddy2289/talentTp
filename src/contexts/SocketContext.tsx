// contexts/SocketContext.tsx - CORRIGÉ
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const API_URL =
      import.meta.env.VITE_API_URL_BASE || "http://localhost:3000";
    console.log("Connecting to Socket.io server:", API_URL);

    const newSocket = io(API_URL, {
      transports: ["websocket", "polling"], // Ajouter polling comme fallback
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("✅ Connected to server");
      setIsConnected(true);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("❌ Disconnected from server:", reason);
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("🔥 Connection error:", error.message);
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      console.log("Cleaning up socket connection");
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
