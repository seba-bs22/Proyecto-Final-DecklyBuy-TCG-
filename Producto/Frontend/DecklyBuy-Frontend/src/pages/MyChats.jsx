import React, { useState, useEffect } from 'react';
import Chat from './Chat'; // Asegúrate de que apunte a tu Chat.jsx

const MyChats = ({ usuarioActualId }) => {
    const [salas, setSalas] = useState([]);
    const [salaSeleccionada, setSalaSeleccionada] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        if (!usuarioActualId) return;

        fetch(`https://localhost:8080/api/chat/usuario/${usuarioActualId}`)
            .then((res) => res.json())
            .then((data) => {
                setSalas(data);
                setCargando(false);
            })
            .catch((err) => {
                console.error("Error al cargar las salas de chat:", err);
                setCargando(false);
            });
    }, [usuarioActualId]);

    if (cargando) {
        return <div style={{ padding: '20px' }}>Loading conversations...</div>;
    }

    return (
        <div style={styles.container}>
            {/* Barra lateral Izquierda: Lista de Chats */}
            <div style={styles.sidebar}>
                <h3 style={styles.sidebarTitle}>Messages</h3>
                {salas.length === 0 ? (
                    <p style={styles.noChats}>No active chats yet.</p>
                ) : (
                    <div style={styles.listaSalas}>
                        {salas.map((sala) => {
                            const esComprador = sala.comprador.id === usuarioActualId;
                            const elOtroUsuario = esComprador ? sala.vendedor : sala.comprador;
                            const rol = esComprador ? "Seller" : "Buyer";

                            return (
                                <div
                                    key={sala.id}
                                    style={{
                                        ...styles.salaItem,
                                        ...(salaSeleccionada?.id === sala.id ? styles.salaActiva : {}),
                                    }}
                                    onClick={() => setSalaSeleccionada(sala)}
                                >
                                    <div style={styles.avatar}>
                                        {elOtroUsuario.username?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div style={styles.salaInfo}>
                                        <span style={styles.nombre}>{elOtroUsuario.username || 'User'}</span>
                                        <span style={styles.rolLabel}>{rol}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Lado Derecho: La ventana del Chat abierto */}
            <div style={styles.chatArea}>
                {salaSeleccionada ? (
                    <Chat 
                        salaId={salaSeleccionada.id} 
                        usuarioActualId={usuarioActualId} 
                    />
                ) : (
                    <div style={styles.placeholder}>
                        <p>Select a conversation from the list to start chatting.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', width: '850px', height: '550px', border: '1px solid #ddd', borderRadius: '12px', background: '#fff', overflow: 'hidden', margin: '20px auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
    sidebar: { width: '300px', borderRight: '1px solid #eee', background: '#f8f9fa', display: 'flex', flexDirection: 'column' },
    sidebarTitle: { padding: '15px 20px', margin: 0, borderBottom: '1px solid #eee', fontSize: '18px', color: '#333' },
    noChats: { padding: '20px', textAlign: 'center', color: '#777', fontSize: '14px' },
    listaSalas: { flex: 1, overflowY: 'auto' },
    salaItem: { display: 'flex', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid #f1f1f1', cursor: 'pointer', transition: 'background 0.2s' },
    salaActiva: { background: '#e7f1ff' },
    avatar: { width: '40px', height: '40px', borderRadius: '50%', background: '#007bff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginRight: '12px' },
    salaInfo: { display: 'flex', flexDirection: 'column', gap: '2px' },
    nombre: { fontWeight: '600', color: '#333', fontSize: '15px' },
    rolLabel: { fontSize: '11px', color: '#fff', background: '#6c757d', padding: '1px 6px', borderRadius: '10px', width: 'fit-content' },
    chatArea: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#fff' },
    placeholder: { color: '#888', textAlign: 'center', fontSize: '14px', padding: '20px' }
};

export default MyChats;