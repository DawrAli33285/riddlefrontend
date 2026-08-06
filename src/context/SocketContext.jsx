import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { BASE_URL } from "../baseurl";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    const syncToken = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", syncToken);
    window.addEventListener("auth-changed", syncToken);
    return () => {
      window.removeEventListener("storage", syncToken);
      window.removeEventListener("auth-changed", syncToken);
    };
  }, []);

  useEffect(() => {
    if (!token) {
      setSocket(null);
      return;
    }
    const newSocket = io(BASE_URL);
    newSocket.emit("user_connected", { token });
    newSocket.on('payment_success', ({ token }) => {
      localStorage.setItem('token', token)
      window.dispatchEvent(new Event('auth-changed'))
      window.dispatchEvent(new Event('payment-success'))
    })
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, [token]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}