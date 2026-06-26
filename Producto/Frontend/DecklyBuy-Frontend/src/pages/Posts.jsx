import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMisPublicaciones = async () => {
      setLoading(true);
      try {
        const usuarioLocal = localStorage.getItem("user") || localStorage.getItem("usuario");
        if (usuarioLocal) {
          const objetoUsuario = JSON.parse(usuarioLocal);
          const miUserId = objetoUsuario?.id || objetoUsuario?._id || objetoUsuario?.data?.id;

          if (miUserId) {
            const resPosts = await fetch(`https://localhost:8080/api/posts/user/${miUserId}`, { credentials: "include" });
            if (resPosts.ok) {
              const postsData = await resPosts.json();
              const listaPosts = postsData.data || postsData.dataResponse || postsData || [];
              setPosts(Array.isArray(listaPosts) ? listaPosts : []);
            }
          }
        }
      } catch (error) {
        console.error("Error al cargar tus publicaciones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMisPublicaciones();
  }, []);

  const handleDelete = async (postId) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta publicación? Esta acción no se puede deshacer.")) return;

    try {
      const response = await fetch(`https://localhost:8080/api/posts/${postId}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (response.ok) {
        alert("Publicación eliminada con éxito.");
        setPosts(prev => prev.filter(post => post.id !== postId));
      } else {
        alert("No se pudo eliminar la publicación.");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const formatCLP = (value) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0
    }).format(value || 0);
  };

  if (loading) {
    return <div style={estilos.loadingMessage}>🔄 Cargando tus publicaciones personales...</div>;
  }

  return (
    <main style={estilos.main}>
      <section className="cartas-recientes">
        <h2 style={estilos.sectionTitle}>
          Mis Publicaciones
        </h2>
        
        <div style={estilos.grid}>
          {posts.length === 0 ? (
            <p style={estilos.emptyText}>
              No tienes publicaciones activas. ¡Crea una en el menú de perfil!
            </p>
          ) : (
            posts.map((post) => {
              const cardName = post.card?.nombre || post.nombre || "Carta Pokémon";
              const cardIdLocal = post.card?.numero || post.numero || "N/A";
              const cardEdition = post.card?.edicion || post.edicion || "Colección Base";
              const estado = post.estadoDetectado || "NM";
              const esScoreAlto = (post.score || 0) >= 8;

              return (
                <div key={post.id} style={estilos.card}>
                  <div style={estilos.imgContainer}>
                    <img 
                      src={post.imagenUrl || "/img/placeholder.jpg"} 
                      alt={cardName} 
                      style={estilos.img} 
                    />
                  </div>

                  <div style={estilos.cardHeader}>
                    <span style={estilos.tag}>POKÉMON • {estado.toUpperCase()}</span>
                    <h3 style={estilos.title}>{cardName}</h3>
                  </div>

                  <div style={estilos.infoContainer}>
                    <div style={estilos.row}>
                      <span style={estilos.label}>Set:</span>
                      <span style={estilos.rowVal}>{cardEdition}</span>
                    </div>

                    <div style={estilos.row}>
                      <span style={estilos.label}>Código:</span>
                      <span style={estilos.codeVal}>#{cardIdLocal}</span>
                    </div>

                    <div style={estilos.row}>
                      <span style={estilos.label}>IA Score:</span>
                      <span style={{
                        ...estilos.scoreBadge,
                        backgroundColor: esScoreAlto ? "#dcfce7" : "#fef9c3", 
                        color: esScoreAlto ? "#15803d" : "#a16207"
                      }}>{post.score || 0}/10</span>
                    </div>

                    <div style={estilos.priceRow}>
                      <span style={estilos.priceLabel}>Precio:</span>
                      <span style={estilos.priceVal}>{formatCLP(post.precio)}</span>
                    </div>
                  </div>
                  
                  <div style={estilos.actionsBar}>
                    <button 
                      onClick={() => navigate(`/edit-post/${post.id}`)}
                      style={estilos.btnEdit}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(post.id)}
                      style={estilos.btnDelete}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#fee2e2'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
};

const estilos = {
  loadingMessage: { textAlign: "center", padding: "50px", color: "#64748b", fontFamily: "sans-serif" },
  main: { padding: "20px", maxWidth: "1200px", margin: "0 auto", fontFamily: "sans-serif" },
  sectionTitle: { fontSize: "22px", fontWeight: "700", marginBottom: "24px", color: "#111111", borderBottom: "2px solid #f0f0f0", paddingBottom: "12px", textAlign: "left" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "24px", width: "100%" },
  emptyText: { textAlign: "left", color: "#777", padding: "20px 0" },
  card: { display: 'flex', flexDirection: 'column', background: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #e2e8f0', boxSizing: 'border-box', width: '100%' },
  imgContainer: { padding: "16px", background: "#f8fafc", display: "flex", justifyContent: "center", alignItems: "center", borderBottom: "1px solid #e2e8f0", height: "220px" },
  img: { maxHeight: "100%", maxWidth: "100%", objectFit: "contain", borderRadius: "6px" },
  cardHeader: { padding: "16px 16px 8px 16px", textAlign: "left" },
  tag: { fontSize: "11px", fontWeight: "700", color: "#64748b", letterSpacing: "0.5px", display: "block", marginBottom: "4px" },
  title: { margin: 0, fontSize: "18px", fontWeight: "700", color: "#0f172a" },
  infoContainer: { display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "#334155", textAlign: "left", padding: "0 16px 16px 16px", flex: 1, justifyContent: "flex-end" },
  row: { display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "6px" },
  label: { color: "#64748b" },
  rowVal: { fontWeight: "600", color: "#0f172a", maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  codeVal: { fontFamily: "monospace", fontWeight: "600", color: "#0f172a" },
  scoreBadge: { padding: "1px 6px", borderRadius: "4px", fontSize: "11px", fontWeight: "700" },
  priceRow: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "4px" },
  priceLabel: { fontWeight: "700", color: "#0f172a" },
  priceVal: { color: "#b91c1c", fontWeight: "700", fontSize: "16px" },
  actionsBar: { display: 'flex', borderTop: '1px solid #e2e8f0', background: '#f8fafc' },
  btnBase: { flex: 1, padding: '12px', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '13px', transition: 'background 0.2s' },
  get btnEdit() { return { ...this.btnBase, color: '#2563eb', borderRight: '1px solid #e2e8f0' } },
  get btnDelete() { return { ...this.btnBase, color: '#dc2626' } }
};

export default Posts;