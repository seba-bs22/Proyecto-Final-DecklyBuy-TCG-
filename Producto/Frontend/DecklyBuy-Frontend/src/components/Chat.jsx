import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const Chat = ({ salaId, usuarioActualId }) => {
    const [mensajes, setMensajes] = useState([]);
    const [nuevoMensaje, setNuevoMensaje] = useState('');
    const [conectado, setConectado] = useState(false);
    const stompClientRef = useRef(null);
    const mensajesEndRef = useRef(null);

    // 1. Cargar el historial de mensajes antiguos (HTTP REST)
    useEffect(() => {
        fetch(`https://localhost:8080/api/chat/sala/${salaId}/historial`)
            .then(res => res.json())
            .then(data => setMensajes(data))
            .catch(err => console.error("Error al cargar historial:", err));
    }, [salaId]);

    // 2. Conectarse al WebSocket en tiempo real al abrir el componente
    useEffect(() => {
        // Configuramos la conexión usando SockJS hacia el endpoint /ws del Backend
        const socket = new SockJS('https://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000, // Se reconecta automáticamente si se cae el servidor
            onConnect: () => {
                setConectado(true);
                // Nos suscribimos al canal de esta sala específica para recibir mensajes
                client.subscribe(`/queue/sala/${salaId}`, (message) => {
                    const mensajeRecibido = JSON.parse(message.body);
                    // Agregamos el mensaje que llegó en tiempo real al estado
                    setMensajes((prev) => [...prev, mensajeRecibido]);
                });
            },
            onDisconnect: () => {
                setConectado(false);
            }
        });

        client.activate();
        stompClientRef.current = client;

        // Limpieza: Desconectarse cuando el usuario cierre el chat
        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, [salaId]);

    // Auto-scroll al último mensaje enviado o recibido
    useEffect(() => {
        mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [mensajes]);

    // 3. Enviar un mensaje (A través del WebSocket)
    const manejarEnviar = (e) => {
        e.preventDefault();
        if (!nuevoMensaje.trim() || !conectado) return;

        const payload = {
            remitenteId: usuarioActualId,
            contenido: nuevoMensaje
        };

        // Enviamos el mensaje al endpoint del controlador de Java
        stompClientRef.current.publish({
            destination: `/app/chat.enviar.${salaId}`,
            body: JSON.stringify(payload)
        });

        setNuevoMensaje(''); // Limpiar la barra de texto
    };

    return (
        <div style={styles.chatContainer}>
            <div style={styles.header}>
                <h4>Chat de Negociación (Sala #{salaId})</h4>
                <span style={conectado ? styles.online : styles.offline}>
                    {conectado ? '● En línea' : '○ Desconectado'}
                </span>
            </div>

            {/* Ventana de burbujas de conversación */}
            <div style={styles.messagesBox}>
                {mensajes.map((msg, index) => {
                    // Verificamos si el mensaje lo envié yo o la otra persona
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

            {/* Barra inferior para escribir */}
            <form onSubmit={manejarEnviar} style={styles.inputArea}>
                <input
                    type="text"
                    placeholder={conectado ? "Escribe un mensaje..." : "Conectando al servidor..."}
                    value={nuevoMensaje}
                    onChange={(e) => setNuevoMensaje(e.target.value)}
                    disabled={!conectado}
                    style={styles.input}
                />
                <button type="submit" disabled={!conectado} style={styles.button}>
                    Enviar
                </button>
            </form>
        </div>
    );
};

// Estilos básicos en línea para que se vea ordenado de inmediato
const styles = {
    chatContainer: { width: '400px', height: '500px', border: '1px solid #ccc', borderRadius: '8px', display: 'flex', flexDirection: 'column', background: '#f9f9f9', fontFamily: 'sans-serif' },
    header: { padding: '10px', background: '#242424', color: 'white', borderTopLeftRadius: '7px', borderTopRightRadius: '7px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    online: { color: '#4caf50', fontSize: '12px' },
    offline: { color: '#f44336', fontSize: '12px' },
    messagesBox: { flex: 1, padding: '10px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' },
    miMensajeRow: { display: 'flex', justifyContent: 'flex-end' },
    otroMensajeRow: { display: 'flex', justifyContent: 'flex-start' },
    miBurbuja: { background: '#007bff', color: 'white', padding: '8px 12px', borderRadius: '15px 15px 0px 15px', maxWidth: '70%' },
    otraBurbuja: { background: '#e9ecef', color: '#333', padding: '8px 12px', borderRadius: '15px 15px 15px 0px', maxWidth: '70%' },
    inputArea: { display: 'flex', padding: '10px', borderTop: '1px solid #ccc', gap: '5px' },
    input: { flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc', outline: 'none' },
    button: { padding: '8px 15px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};

export default Chat;