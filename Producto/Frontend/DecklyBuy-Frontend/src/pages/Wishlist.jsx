import React, { useEffect, useState } from "react";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const response = await fetch("https://localhost:8080/api/wishlist", {
        method: "GET",
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        setWishlistItems(data || []);
      }
    } catch (error) {
      console.error("Error conectando con el endpoint de wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemoveFavorite = async (postId) => {
    try {
      const response = await fetch(`https://localhost:8080/api/wishlist/remove/${postId}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (response.ok) {
        setWishlistItems(prev => prev.filter(item => item.post?.id !== postId));
      } else {
        alert("No se pudo quitar de la lista de deseos.");
      }
    } catch (error) {
      console.error("Error al remover de la lista de deseos:", error);
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
    return <p style={{ textAlign: "center", marginTop: "50px", fontFamily: "sans-serif", color: "#64748b" }}>Cargando tu lista de deseos...</p>;
  }

  return (
    <main style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <section className="cartas-recientes">
        <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "24px", color: "#111111", borderBottom: "2px solid #f0f0f0", paddingBottom: "12px", textAlign: "left" }}>
          Mi Lista de Deseos ❤️
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "24px", width: "100%" }}>
          {wishlistItems.length === 0 ? (
            <p style={{ textAlign: "left", color: "#777", padding: "20px 0" }}>
              Aún no tienes cartas guardadas en tu lista de deseos.
            </p>
          ) : (
            wishlistItems.map((item) => {
              const post = item.post;
              if (!post) return null;

              const cardName = post.nombre || "Carta Desconocida";
              const cardIdLocal = post.cardId || post.numero || "N/A";
              const cardEdition = post.edicion || "Colección Base";
              const estado = post.estadoDetectado || post.estado || "NM";

              return (
                <div key={item.id} style={estilos.card}>
                  <div style={estilos.imgContainer}>
                    <img 
                      src={post.imagenUrl || "/img/placeholder.jpg"} 
                      alt={cardName} 
                      style={estilos.img} 
                    />
                  </div>

                  <div style={{ padding: "16px 16px 8px 16px", textAlign: "left" }}>
                    <span style={estilos.tag}>POKÉMON • {estado.toUpperCase()}</span>
                    <h3 style={estilos.title}>{cardName}</h3>
                  </div>

                  <div style={estilos.infoContainer}>
                    <div style={estilos.row}>
                      <span style={{ color: "#64748b" }}>Set:</span>
                      <span style={estilos.rowVal}>{cardEdition}</span>
                    </div>

                    <div style={estilos.row}>
                      <span style={{ color: "#64748b" }}>Código:</span>
                      <span style={{ fontFamily: "monospace", fontWeight: "600", color: "#0f172a" }}>#{cardIdLocal}</span>
                    </div>

                    <div style={estilos.row}>
                      <span style={{ color: "#64748b" }}>IA Score:</span>
                      <span style={{ 
                        backgroundColor: post.score >= 8 ? "#dcfce7" : "#fef9c3", 
                        color: post.score >= 8 ? "#15803d" : "#a16207",
                        padding: "1px 6px", borderRadius: "4px", fontSize: "11px", fontWeight: "700"
                      }}>{post.score || 0}/10</span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "4px" }}>
                      <span style={{ fontWeight: "700", color: "#0f172a" }}>Precio:</span>
                      <span style={{ color: "#b91c1c", fontWeight: "700", fontSize: "16px" }}>{formatCLP(post.precio)}</span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
                    <button 
                      onClick={() => handleRemoveFavorite(post.id)}
                      style={estilos.btnDelete}
                      onMouseEnter={(e) => e.target.style.background = '#fee2e2'}
                      onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                      💔 Quitar de la Lista de Deseos
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
  card: { display: 'flex', flexDirection: 'column', background: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #e2e8f0', boxSizing: 'border-box', width: '100%' },
  imgContainer: { padding: "16px", background: "#f8fafc", display: "flex", justifyContent: "center", alignItems: "center", borderBottom: "1px solid #e2e8f0", height: "220px" },
  img: { maxHeight: "100%", maxWidth: "100%", objectFit: "contain", borderRadius: "6px" },
  tag: { fontSize: "11px", fontWeight: "700", color: "#64748b", letterSpacing: "0.5px", display: "block", marginBottom: "4px" },
  title: { margin: 0, fontSize: "18px", fontWeight: "700", color: "#0f172a" },
  infoContainer: { display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "#334155", textAlign: "left", padding: "0 16px 16px 16px", flex: 1, justifyContent: "flex-end" },
  row: { display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "6px" },
  rowVal: { fontWeight: "600", color: "#0f172a", maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  btnDelete: { flex: 1, padding: '14px', background: 'transparent', color: '#dc2626', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '13px', transition: 'background 0.2s, color 0.2s' }
};

export default Wishlist;