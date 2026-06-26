import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';

const Chat = ({ salaId, usuarioActualId }) => {
    const [mensajes, setMensajes] = useState([]);
    const [nuevoMensaje, setNuevoMensaje] = useState('');
    const [conectado, setConectado] = useState(false);
    const stompClientRef = useRef(null);
    const mensajesEndRef = useRef(null);

    // 1. Efecto para cargar historial (Agregado credentials: 'include')
    useEffect(() => {
        if (!salaId) return;

        fetch(`https://localhost:8080/api/chat/sala/${salaId}/historial`, {
            method: 'GET',
            credentials: 'include' // 🚨 CRÍTICO: Necesario para que Spring Security valide tu sesión
        })
            .then(res => {
                if (!res.ok) throw new Error("Error al obtener el historial");
                return res.json();
            })
            .then(data => setMensajes(data || []))
            .catch(err => console.error("Error al cargar historial:", err));
    }, [salaId]);

    // 2. Efecto para conectar el WebSocket
    useEffect(() => {
        if (!salaId) return;

        const client = new Client({
            // 🚨 CORRECCIÓN 1: Cambiado a 'wss://' porque tu servidor usa HTTPS (SSL local)
            brokerURL: `wss://localhost:8080/ws`, 
            reconnectDelay: 5000,
            
            // 🚨 CORRECCIÓN 2: Forzar WebSocket nativo sobre WSS para evitar intermediarios
            webSocketFactory: () => new WebSocket(`wss://localhost:8080/ws`),

            onConnect: () => {
                console.log("🚀 WebSocket conectado con éxito.");
                setConectado(true);
                
                // 🚨 CORRECCIÓN 3: Tu WebSocketConfig.java tiene configurado el broker en "/topic", no en "/queue"
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

        // 🚨 CORRECCIÓN 4: Sincronizado con el @MessageMapping de tu backend (`/chat.enviarMensaje/{salaId}`)
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
                    const esMio = msg.remitenteId === usuarioActualId || msg.remitente?.id === usuarioActualId;
                    return (
                        <div key={index} style={esMio ? styles.miMensajeRow : styles.otroMensajeRow}>
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
                <button type="submit" disabled={!conectado || !nuevoMensaje.trim()} style={styles.button}>
                    Enviar
                </button>
            </form>
        </div>
    );
};

const styles = {
    chatContainer: { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#f9f9f9', fontFamily: 'sans-serif' },
    header: { padding: '15px 20px', background: '#242424', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    online: { color: '#4caf50', fontSize: '13px', fontWeight: '600' },
    offline: { color: '#f44336', fontSize: '13px', fontWeight: '600' },
    messagesBox: { flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' },
    miMensajeRow: { display: 'flex', justifyContent: 'flex-end' },
    otroMensajeRow: { display: 'flex', justifyContent: 'flex-start' },
    miBurbuja: { background: '#007bff', color: 'white', padding: '8px 12px', borderRadius: '15px 15px 0px 15px', maxWidth: '70%', fontSize: '14px', wordBreak: 'break-word' },
    otraBurbuja: { background: '#e9ecef', color: '#333', padding: '8px 12px', borderRadius: '15px 15px 15px 0px', maxWidth: '70%', fontSize: '14px', wordBreak: 'break-word' },
    inputArea: { display: 'flex', padding: '15px', borderTop: '1px solid #ccc', gap: '8px', background: 'white' },
    input: { flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none', fontSize: '14px' },
    button: { padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }
};

export default Chat;