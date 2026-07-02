import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';

const ChatWindow = ({ sala, usuarioActual }) => {
    // Extraemos de forma segura los IDs que tu lógica interna ya utiliza
    const salaId = sala?.id;
    const usuarioActualId = usuarioActual?.id;
    // Extraer el ID de la publicación desde el objeto sala
    const postId = sala?.postId || sala?.post?.id;

    const [mensajes, setMensajes] = useState([]);
    const [nuevoMensaje, setNuevoMensaje] = useState('');
    const [conectado, setConectado] = useState(false);
    const [postInfo, setPostInfo] = useState(null); // 🃏 Estado para guardar los datos de la carta
    const stompClientRef = useRef(null);
    const mensajesEndRef = useRef(null);

    // 🃏 NUEVO: Efecto para cargar los detalles de la carta vinculada al chat
    useEffect(() => {
        if (!postId) return;

        fetch(`https://localhost:8080/api/posts/${postId}`, {
            method: 'GET',
            credentials: 'include'
        })
            .then(res => res.ok ? res.json() : null)
            .then(result => {
                if (result) {
                    // Mapeo seguro según la estructura que use tu backend
                    setPostInfo(result.data || result.dataResponse || result);
                }
            })
            .catch(err => console.error("Error al cargar la info de la carta en el chat:", err));
    }, [postId]);

    // 1. Efecto para cargar historial (Se mantiene igual)
    useEffect(() => {
        if (!salaId) return;

        fetch(`https://localhost:8080/api/chat/sala/${salaId}/historial`, {
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

    // 2. Efecto para conectar el WebSocket (Se mantiene igual)
    useEffect(() => {
        if (!salaId) return;

        const client = new Client({
            brokerURL: `wss://localhost:8080/ws`, 
            reconnectDelay: 5000,
            webSocketFactory: () => new WebSocket(`wss://localhost:8080/ws`),

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

    const idMiUsuario = String(usuarioActualId || "").toLowerCase();
    const idCompradorSala = String(sala?.comprador?.id || sala?.compradorId || "").toLowerCase();
    const soyComprador = idMiUsuario === idCompradorSala;

    const obtenerNombreContraparte = () => {
        if (!usuarioActualId || !sala) return "Usuario";
        
        if (soyComprador) {
            return sala.vendedor?.nombreUsuario || sala.vendedor?.nombre || "Vendedor Deckly";
        } else {
            return sala.comprador?.nombreUsuario || sala.comprador?.nombre || "Comprador Deckly";
        }
    };

    const formatCLP = (value) => {
        return new Intl.NumberFormat("es-CL", {
            style: "currency",
            currency: "CLP",
            minimumFractionDigits: 0
        }).format(value || 0);
    };

    const interlocutorUsername = obtenerNombreContraparte();

    return (
        <div style={styles.chatContainer}>
            
            {/* Cabecera Limpia */}
            <div style={styles.header}>
                <div style={styles.headerInfo}>
                    <h4 style={styles.headerTitle}>{interlocutorUsername}</h4>
                    <span style={soyComprador ? styles.badgeVendedor : styles.badgeComprador}>
                        {soyComprador ? 'Vendedor Certificado' : 'Comprador Interesado'}
                    </span>
                </div>
                <div style={styles.headerStatus}>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Negociación Activa</span>
                </div>
            </div>

            {/* 🃏 NUEVO: Barra informativa del Post / Carta Pokemon que se está tratando */}
            {postInfo && (
                <div style={styles.cardInfoBar}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                            src={postInfo.imagenUrl || "/img/placeholder.jpg"} 
                            alt={postInfo.card?.nombre || postInfo.nombre || "Carta"} 
                            style={styles.cardBarImg}
                        />
                        <div>
                            <div style={styles.cardBarTitle}>
                                {postInfo.card?.nombre || postInfo.nombre || "Carta Pokémon"}
                            </div>
                            <div style={styles.cardBarSubtitle}>
                                Edición: {postInfo.card?.edicion || postInfo.edicion || "Colección Base"} • 
                                Condición: <span style={{fontWeight: '700'}}>{(postInfo.estadoDetectado || postInfo.estado || "NM").toUpperCase()}</span>
                            </div>
                        </div>
                    </div>
                    <div style={styles.cardBarPrice}>
                        {formatCLP(postInfo.precio)}
                    </div>
                </div>
            )}

            {/* Caja de mensajes */}
            <div style={styles.messagesBox}>
                {mensajes.map((msg, index) => {
                    const idRemitenteMsg = String(msg.remitenteId || msg.remitente?.id || "").toLowerCase();
                    const esMio = idRemitenteMsg === idMiUsuario;

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

            {/* Input y área de envío */}
            <form onSubmit={manejarEnviar} style={styles.inputArea}>
                <input
                    type="text"
                    placeholder={conectado ? "Escribe un mensaje para negociar..." : "Conectando al servidor de DecklyBuy..."}
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
    chatContainer: { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#f8fafc', fontFamily: 'sans-serif' },
    header: { padding: '16px 24px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    headerInfo: { display: 'flex', flexDirection: 'column', gap: '4px' },
    headerTitle: { margin: 0, fontSize: '16px', fontWeight: '600', color: '#0f172a' },
    badgeVendedor: { padding: '2px 8px', borderRadius: '12px', background: '#fef3c7', color: '#d97706', fontSize: '11px', fontWeight: '600', width: 'fit-content' },
    badgeComprador: { padding: '2px 8px', borderRadius: '12px', background: '#dbeafe', color: '#2563eb', fontSize: '11px', fontWeight: '600', width: 'fit-content' },
    headerStatus: { display: 'flex', alignItems: 'center' },
    
    // 🎨 Estilos para la nueva barra de la Carta
    cardInfoBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '10px 24px', borderBottom: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' },
    cardBarImg: { width: '40px', height: '55px', objectFit: 'contain', background: '#f8fafc', borderRadius: '4px', border: '1px solid #e2e8f0' },
    cardBarTitle: { fontSize: '14px', fontWeight: '700', color: '#0f172a' },
    cardBarSubtitle: { fontSize: '12px', color: '#64748b', marginTop: '2px' },
    cardBarPrice: { fontSize: '15px', fontWeight: '800', color: '#b91c1c' },
    
    messagesBox: { flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', background: '#f1f5f9' },
    miMensajeRow: { display: 'flex', justifyContent: 'flex-end' },
    otroMensajeRow: { display: 'flex', justifyContent: 'flex-start' },
    miBurbuja: { background: '#2563eb', color: 'white', padding: '10px 14px', borderRadius: '16px 16px 0px 16px', maxWidth: '65%', fontSize: '14px', wordBreak: 'break-word', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
    otraBurbuja: { background: '#ffffff', color: '#1e293b', padding: '10px 14px', borderRadius: '16px 16px 16px 0px', maxWidth: '65%', fontSize: '14px', wordBreak: 'break-word', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
    
    inputArea: { display: 'flex', padding: '16px', borderTop: '1px solid #e2e8f0', gap: '12px', background: '#ffffff' },
    input: { flex: 1, padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', transition: 'border-color 0.2s', background: '#f8fafc' },
    button: { padding: '12px 24px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', transition: 'background 0.2s' }
};

export default ChatWindow;