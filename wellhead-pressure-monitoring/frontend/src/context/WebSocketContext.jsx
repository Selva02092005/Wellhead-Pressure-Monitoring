import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [liveData, setLiveData] = useState({});
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (!isAuthenticated) return;

    let socket;
    let retryInterval;

    const connect = () => {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host || 'localhost:8000';
        const defaultWsUrl = `${protocol}//${host}/ws/live`;
        const wsUrl = import.meta.env.VITE_WS_URL || defaultWsUrl;
        socket = new WebSocket(wsUrl);

        socket.onopen = () => {
            console.log("WebSocket Connected");
            if (retryInterval) clearInterval(retryInterval);
        };
        
        socket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                if (message.well_id) {
                    setLiveData(prev => ({
                        ...prev,
                        [message.well_id]: {
                            ...(prev[message.well_id] || {}),
                            [message.sensor]: message.pressure,
                            timestamp: message.timestamp
                        }
                    }));
                }
            } catch (e) {
                console.error("WS parse error", e);
            }
        };
        
        socket.onclose = () => {
            console.log("WebSocket Disconnected, retrying in 3s...");
            retryInterval = setTimeout(connect, 3000);
        };
    };

    connect();

    return () => {
      if (socket) socket.close();
      if (retryInterval) clearTimeout(retryInterval);
    };
  }, [isAuthenticated]);

  return (
    <WebSocketContext.Provider value={{ liveData }}>
      {children}
    </WebSocketContext.Provider>
  );
};
