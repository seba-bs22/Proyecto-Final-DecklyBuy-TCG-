import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import { apiUrl, WS_BASE_URL } from "../config/api";

const Chat = ({ salaId, usuarioActualId }) => {
    const [mensajes, setMensajes] = useState([]);
    const [nuevoMensaje, setNuevoMensaje] = useState('');
    const [conectado, setConectado] = useState(false);
    const stompClientRef = useRef(null);
    const mensajesEndRef = useRef(null);

    // 1. Cargar historial de mensajes
    useEffect(() => {
        if (!salaId) return;

        fetch(apiUrl(`/api/chat/sala/${salaId}/historial`), {
            method: 'GET',
            credentials: 'include'
        })
            .then(res => {
                if (!res.ok) throw new Error("Error al obtener el historial");
                return res.json();
            })
            .then(data => setMensajes(data || []))
            .catch(err => console.error("Error al cargar historial:", err));
    }, [salaId]);

    // 2. Conectar WebSocket
    useEffect(() => {
        if (!salaId) return;

        const wsUrl = `${WS_BASE_URL}/ws`;

        const client = new Client({
            brokerURL: wsUrl,
            reconnectDelay: 5000,

            webSocketFactory: () => new WebSocket(wsUrl),

            onConnect: () => {
                console.log("🚀 WebSocket conectado con éxito.");
                setConectado(true);

                client.subscribe(`/topic/sala/${salaId}`, (message) => {
                    const mensajeRecibido = JSON.parse(message.body);
                    setMensajes((prev) => [...prev, mensajeRecibido]);
                });
            },

            onDisconnect: () => {
                console.log("🔌 WebSocket desconectado.");
                setConectado(false);
            },

            onStompError: (frame) => {
                console.error('STOMP Error:', frame.headers['message']);
                console.error('Detalles STOMP:', frame.body);
            },

            onWebSocketError: (error) => {
                console.error("Error en WebSocket:", error);
                setConectado(false);
            },

            onWebSocketClose: () => {
                console.log("WebSocket cerrado.");
                setConectado(false);
            }
        });

        client.activate();
        stompClientRef.current = client;

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, [salaId]);

    useEffect(() => {
        mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [mensajes]);

    const manejarEnviar = (e) => {
        e.preventDefault();

        if (!nuevoMensaje.trim() || !conectado || !stompClientRef.current) return;

        const payload = {
            salaId: salaId,
            remitenteId: usuarioActualId,
            contenido: nuevoMensaje.trim(),
            fechaEnvio: new Date().toISOString()
        };

        stompClientRef.current.publish({
            destination: `/app/chat.enviarMensaje/${salaId}`,
            body: JSON.stringify(payload)
        });

        setNuevoMensaje('');
    };

    return (
        <div style={styles.chatContainer}>
            <div style={styles.header}>
                <h4>Chat de Negociación (Sala #{salaId})</h4>
                <span style={conectado ? styles.online : styles.offline}>
                    {conectado ? '● En línea' : '○ Desconectado'}
                </span>
            </div>

            <div style={styles.messagesBox}>
                {mensajes.map((msg, index) => {
                    const esMio =
                        msg.remitenteId === usuarioActualId ||
                        msg.remitente?.id === usuarioActualId;

                    return (
                        <div
                            key={index}
                            style={esMio ? styles.miMensajeRow : styles.otroMensajeRow}
                        >
                            <div style={esMio ? styles.miBurbuja : styles.otraBurbuja}>
                                <p style={{ margin: 0 }}>{msg.contenido}</p>
                            </div>
                        </div>
                    );
                })}
                <div ref={mensajesEndRef} />
            </div>

            <form onSubmit={manejarEnviar} style={styles.inputArea}>
                <input
                    type="text"
                    placeholder={conectado ? "Escribe un mensaje..." : "Conectando al servidor..."}
                    value={nuevoMensaje}
                    onChange={(e) => setNuevoMensaje(e.target.value)}
                    disabled={!conectado}
                    style={styles.input}
                />
                <button
                    type="submit"
                    disabled={!conectado || !nuevoMensaje.trim()}
                    style={{
                        ...styles.button,
                        opacity: !conectado || !nuevoMensaje.trim() ? 0.6 : 1,
                        cursor: !conectado || !nuevoMensaje.trim() ? 'not-allowed' : 'pointer'
                    }}
                >
                    Enviar
                </button>
            </form>
        </div>
    );
};

const styles = {
    chatContainer: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#f9f9f9',
        fontFamily: 'sans-serif'
    },
    header: {
        padding: '15px 20px',
        background: '#242424',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    online: {
        color: '#4caf50',
        fontSize: '13px',
        fontWeight: '600'
    },
    offline: {
        color: '#f44336',
        fontSize: '13px',
        fontWeight: '600'
    },
    messagesBox: {
        flex: 1,
        padding: '20px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    miMensajeRow: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    otroMensajeRow: {
        display: 'flex',
        justifyContent: 'flex-start'
    },
    miBurbuja: {
        background: '#007bff',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '15px 15px 0px 15px',
        maxWidth: '70%',
        fontSize: '14px',
        wordBreak: 'break-word'
    },
    otraBurbuja: {
        background: '#e9ecef',
        color: '#333',
        padding: '8px 12px',
        borderRadius: '15px 15px 15px 0px',
        maxWidth: '70%',
        fontSize: '14px',
        wordBreak: 'break-word'
    },
    inputArea: {
        display: 'flex',
        padding: '15px',
        borderTop: '1px solid #ccc',
        gap: '8px',
        background: 'white'
    },
    input: {
        flex: 1,
        padding: '10px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        outline: 'none',
        fontSize: '14px'
    },
    button: {
        padding: '10px 20px',
        background: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontWeight: '600',
        fontSize: '14px'
    }
};

export default Chat;