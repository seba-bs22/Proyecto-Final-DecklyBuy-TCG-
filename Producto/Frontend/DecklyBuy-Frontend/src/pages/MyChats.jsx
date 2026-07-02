import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ChatWindow from "../components/ChatWindow";

const MyChats = () => {
    const location = useLocation();
    const [usuarioActual, setUsuarioActual] = useState(null);
    const [salas, setSalas] = useState([]);
    const [salaSeleccionada, setSalaSeleccionada] = useState(null);
    const [cargando, setCargando] = useState(true);

    // PASO 1: Obtener el usuario autenticado real
    useEffect(() => {
        const obtenerUsuario = async () => {
            try {
                const response = await fetch('https://localhost:8080/api/auth/me', {
                    method: 'GET',
                    credentials: 'include'
                });
                if (response.ok) {
                    const data = await response.json();
                    const usuario = data?.user || data;
                    setUsuarioActual(usuario);
                }
            } catch (error) {
                console.error("Error al verificar autenticación:", error);
            }
        };
        obtenerUsuario();
    }, []);

    // PASO 2: Traer las salas desde el Backend
    useEffect(() => {
        if (!usuarioActual?.id) return;

        const cargarSalas = async () => {
            try {
                const response = await fetch(`https://localhost:8080/api/chat/usuario/${usuarioActual.id}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (response.ok) {
                    const dataBruta = await response.json();
                    // Soportamos si el backend envuelve la lista en una propiedad data
                    const listaSalas = Array.isArray(dataBruta) ? dataBruta : (dataBruta?.data || []);
                    setSalas(listaSalas);

                    const queryParams = new URLSearchParams(location.search);
                    const salaIdDesdeUrl = queryParams.get('salaId');

                    if (salaIdDesdeUrl && listaSalas.length > 0) {
                        const salaEncontrada = listaSalas.find(s => String(s?.id) === String(salaIdDesdeUrl));
                        if (salaEncontrada) {
                            setSalaSeleccionada(salaEncontrada);
                        }
                    }
                }
            } catch (error) {
                console.error("Error al traer las salas de chat:", error);
            } finally {
                setCargando(false);
            }
        };

        cargarSalas();
    }, [usuarioActual, location.search]);

    // 🛠️ FUNCIÓN OPTIMIZADA: Compara los UUIDs normalizados a minúsculas de forma segura
    const obtenerNombreContraparte = (sala) => {
        if (!usuarioActual?.id || !sala) return "Usuario";
        
        const idMiUsuario = String(usuarioActual.id).toLowerCase();
        const idComprador = String(sala.comprador?.id || sala.compradorId || "").toLowerCase();
        
        if (idMiUsuario === idComprador) {
            return sala.vendedor?.nombreUsuario || sala.vendedor?.nombre || `Vendedor_#${sala.vendedor?.id || 'Anónimo'}`;
        } else {
            return sala.comprador?.nombreUsuario || sala.comprador?.nombre || `Comprador_#${sala.comprador?.id || 'Anónimo'}`;
        }
    };

    if (cargando) {
        return <div style={{ ...styles.container, justifyContent: 'center', alignItems: 'center' }}>🔄 Cargando tus mensajes...</div>;
    }

    return (
        <div style={styles.container}>
            
            {/* BARRA LATERAL IZQUIERDA: LISTA DE CHATS */}
            <div style={styles.sidebar}>
                <h3 style={styles.sidebarTitle}>Mis Mensajes</h3>
                <div style={styles.listaSalas}>
                    {salas.length === 0 ? (
                        <p style={{ padding: '20px', color: '#64748b', fontSize: '14px', textAlign: 'center' }}>
                            No tienes conversaciones activas todavía.
                        </p>
                    ) : (
                        salas.map((sala) => {
                            if (!sala) return null;
                            
                            const usernameVisual = obtenerNombreContraparte(sala);
                            const idMiUsuario = String(usuarioActual?.id || "").toLowerCase();
                            const idComprador = String(sala.comprador?.id || sala.compradorId || "").toLowerCase();
                            const soyComprador = idMiUsuario === idComprador;
                            
                            return (
                                <div 
                                    key={sala.id} 
                                    onClick={() => setSalaSeleccionada(sala)}
                                    style={{
                                        ...styles.salaItem,
                                        background: salaSeleccionada?.id === sala.id ? '#e2e8f0' : 'transparent',
                                        fontWeight: salaSeleccionada?.id === sala.id ? '600' : 'normal'
                                    }}
                                >
                                    <div style={styles.avatarMini}>
                                        {usernameVisual.charAt(0).toUpperCase()}
                                    </div>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                        <span style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                            {usernameVisual}
                                        </span>
                                        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '400' }}>
                                            {soyComprador ? 'Vendedor' : 'Comprador'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* LADO DERECHO: VENTANA DEL CHAT PROTEGIDA */}
            <div style={styles.chatArea}>
                {salaSeleccionada ? (
                    <ChatWindow 
                        key={salaSeleccionada.id} 
                        sala={salaSeleccionada} 
                        usuarioActual={usuarioActual} 
                    />
                ) : (
                    <div style={styles.placeholder}>
                        <p>Selecciona una conversación de la lista para empezar a chatear.</p>
                    </div>
                )}
            </div>

        </div>
    );
};

const styles = {
    container: { display: 'flex', width: '950px', height: '600px', border: '1px solid #e2e8f0', borderRadius: '16px', background: '#fff', overflow: 'hidden', margin: '40px auto', fontFamily: 'sans-serif', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' },
    sidebar: { width: '320px', borderRight: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', flexDirection: 'column' },
    sidebarTitle: { padding: '20px', margin: 0, borderBottom: '1px solid #f1f5f9', fontSize: '18px', color: '#0f172a', fontWeight: '700' },
    listaSalas: { flex: 1, overflowY: 'auto' },
    salaItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.2s', fontSize: '14px', color: '#334155' },
    avatarMini: { width: '32px', height: '32px', borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', flexShrink: 0 },
    chatArea: { flex: 1, display: 'flex', flexDirection: 'column', background: '#fafafa' },
    placeholder: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#64748b', fontSize: '14px' }
};

export default MyChats;