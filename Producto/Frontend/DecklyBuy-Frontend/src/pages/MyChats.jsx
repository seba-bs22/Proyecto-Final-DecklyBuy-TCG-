import React, { useState, useEffect } from 'react';
import Chat from '../components/Chat';

const MyChats = () => {
    // Captura directa de la URL sin depender del ciclo de renderizado de hooks externos
    const urlParams = new URLSearchParams(window.location.search);
    const urlSalaId = urlParams.get('salaId');

    const [usuarioId, setUsuarioId] = useState(null);
    const [salas, setSalas] = useState([]);
    const [salaSeleccionada, setSalaSeleccionada] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const inicializarChat = async () => {
            try {
                // 1. Identificar al usuario usando la cookie de sesión activa
                const authRespuesta = await fetch('https://localhost:8080/api/auth/me', {
                    method: 'GET',
                    credentials: 'include'
                });
                
                if (!authRespuesta.ok) throw new Error("Usuario no autenticado");
                
                const authData = await authRespuesta.json();
                const idReal = authData?.user?.id;
                setUsuarioId(idReal);

                if (idReal) {
                    // 2. Traer el listado de salas en las que participa el usuario
                    const resSalas = await fetch(`https://localhost:8080/api/chat/usuario/${idReal}`, {
                        method: 'GET',
                        credentials: 'include'
                    });
                    
                    if (resSalas.ok) {
                        const listaSalas = await resSalas.json();
                        setSalas(listaSalas || []);

                        // 3. Si hay un salaId en la URL, buscarlo en la lista para dejarlo activo
                        if (urlSalaId) {
                            const salaExistente = listaSalas.find(s => s.id.toString() === urlSalaId.toString());
                            if (salaExistente) {
                                setSalaSeleccionada(salaExistente);
                            }
                        }
                    }
                }
            } catch (err) {
                console.error("Error al inicializar la pantalla de chats:", err);
            } finally {
                setCargando(false);
            }
        };

        inicializarChat();
    }, [urlSalaId]);

    if (cargando) {
        return <div style={styles.fallback}>🔄 Cargando tus conversaciones...</div>;
    }

    // Determinamos la sala activa: la seleccionada por clic o la que viene por URL de forma forzada
    const salaActiva = salaSeleccionada || (urlSalaId ? { id: parseInt(urlSalaId) } : null);

    return (
        <div style={styles.container}>
            {/* Barra lateral Izquierda: Lista de Chats */}
            <div style={styles.sidebar}>
                <h3 style={styles.sidebarTitle}>Mensajes</h3>
                {salas.length === 0 ? (
                    <p style={styles.noChats}>No tienes chats activos aún.</p>
                ) : (
                    <div style={styles.listaSalas}>
                        {salas.map((sala) => {
                            if (!sala.comprador || !sala.vendedor) return null;

                            const esComprador = sala.comprador.id === usuarioId;
                            const elOtroUsuario = esComprador ? sala.vendedor : sala.comprador;
                            const rol = esComprador ? "Vendedor" : "Comprador";
                            const nombreMostrar = elOtroUsuario.nombreUsuario || elOtroUsuario.username || "Usuario";

                            const estaActivo = salaActiva?.id === sala.id;

                            return (
                                <div
                                    key={sala.id}
                                    style={{
                                        ...styles.salaItem,
                                        ...(estaActivo ? styles.salaActiva : {}),
                                    }}
                                    onClick={() => setSalaSeleccionada(sala)}
                                >
                                    <div style={styles.avatar}>
                                        {nombreMostrar.charAt(0).toUpperCase()}
                                    </div>
                                    <div style={styles.salaInfo}>
                                        <span style={styles.nombre}>{nombreMostrar}</span>
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
                {salaActiva ? (
                    <Chat 
                        salaId={salaActiva.id} 
                        usuarioActualId={usuarioId} 
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
    container: { display: 'flex', width: '900px', height: '600px', border: '1px solid #e2e8f0', borderRadius: '16px', background: '#fff', overflow: 'hidden', margin: '40px auto', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)', fontFamily: 'sans-serif' },
    sidebar: { width: '320px', borderRight: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', flexDirection: 'column' },
    sidebarTitle: { padding: '20px', margin: 0, borderBottom: '1px solid #f1f5f9', fontSize: '18px', fontWeight: '700', color: '#0f172a' },
    noChats: { padding: '30px 20px', textAlign: 'center', color: '#64748b', fontSize: '14px', margin: 0 },
    listaSalas: { flex: 1, overflowY: 'auto' },
    salaItem: { display: 'flex', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.2s ease' },
    salaActiva: { background: '#f0f7ff', borderLeft: '4px solid #2563eb' },
    avatar: { width: '42px', height: '42px', borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', marginRight: '14px', fontSize: '15px' },
    salaInfo: { display: 'flex', flexDirection: 'column', gap: '4px' },
    nombre: { fontWeight: '600', color: '#1e293b', fontSize: '14px' },
    rolLabel: { fontSize: '11px', color: '#2563eb', background: '#eff6ff', padding: '2px 8px', borderRadius: '6px', fontWeight: '600', width: 'fit-content' },
    chatArea: { flex: 1, display: 'flex', flexDirection: 'column', background: '#fff', height: '100%', width: '100%' },
    placeholder: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#64748b', fontSize: '14px', padding: '20px', background: '#fafafa' },
    fallback: { textAlign: 'center', padding: '50px', color: '#64748b', fontFamily: 'sans-serif', fontSize: '15px' }
};

export default MyChats;