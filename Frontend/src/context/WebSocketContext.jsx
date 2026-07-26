import React, { createContext, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState(null);
    const stompClientRef = useRef(null);
    const broadcastChannelRef = useRef(null);

    useEffect(() => {
        const wsUrl = import.meta.env.VITE_WS_URL || 'https://sales-kiosk-app-3.onrender.com/ws-kiosk';

        const client = new Client({
            webSocketFactory: () => new SockJS(wsUrl),
            reconnectDelay: 3000,
            //  Add STOMP level heartbeats (10 seconds) for Render Proxy
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
            debug: (str) => console.log('[STOMP / SockJS]', str),
        });

        client.onConnect = () => {
            setIsConnected(true);
            console.log('Connected to live websocket Server');
            client.subscribe('/topic/sync', (message) => {
                if (message.body) {
                    try {
                        const parsedBody = JSON.parse(message.body);
                        if (parsedBody.type === 'PING' || parsedBody.type === 'PONG') {
                            return;
                        }
                        setLastMessage(parsedBody);
                    } catch (err) {
                        console.error('STOMP Parse Error:', err);
                    }
                }
            });
        };

        client.onDisconnect = () => {
            setIsConnected(false);
        };

        client.onStompError = (frame) => {
            console.error('STOMP Error Frame:', frame);
        };

        client.activate();
        stompClientRef.current = client;

        // 10-Second Keep-Alive Ping Interval for Render
        const pingInterval = setInterval(() => {
            if (stompClientRef.current && stompClientRef.current.connected) {
                stompClientRef.current.publish({
                    destination: '/app/sync',
                    body: JSON.stringify({ type: 'PING', sender: "FRONTEND" }),
                });
            }
        }, 10000);

        return () => {
            clearInterval(pingInterval);
            client.deactivate();
            stompClientRef.current = null;
        };

    }, []);

    //  Consistent Payload Delivery 
    const publishMirrorState = useCallback((state) => {
        const payload = { type: 'SYNC_MIRROR', mirrorState: state, sender: "FRONTEND", ...state };

        if (stompClientRef.current && stompClientRef.current.connected) {
            stompClientRef.current.publish({
                destination: '/app/sync',
                body: JSON.stringify(payload),
            });
        } else {
            console.warn('⚠️ Cannot publish state: STOMP client not connected');
        }

    }, []);

    const contextValue = useMemo(() => ({
        isConnected,
        publishMirrorState,
        lastMessage
    }), [isConnected, publishMirrorState, lastMessage]);

    return (
        <WebSocketContext.Provider value={contextValue}>
            {children}
        </WebSocketContext.Provider>
    );
};