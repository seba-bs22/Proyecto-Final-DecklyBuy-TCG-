import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [user, setUser] = useState(null);
  const [postsRecientes, setPostsRecientes] = useState([]); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Obtener sesión del usuario
    fetch("https://localhost:8080/api/auth/me", {
      credentials: "include"
    })
      .then(async res => {
        const data = await res.json().catch(() => null);
        if (!res.ok) throw new Error(data?.message || "No autenticado");
        setUser(data.user);
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      })
      .catch(err => console.error("Error obteniendo usuario:", err));

    // 2. Obtener publicaciones reales de la base de datos para el bloque reciente
    const fetchPostsRecientes = async () => {
      try {
        const response = await fetch("https://localhost:8080/api/posts", {
          credentials: "include"
        });
        const result = await response.json();
        
        let dataArray = result.dataResponse || result.data || result || [];
        setPostsRecientes(dataArray.slice(0, 3)); 
      } catch (error) {
        console.error("Error cargando cartas recientes en Home:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostsRecientes();
  }, []);

  // Formateador chileno a CLP
  const formatCLP = (value) => {
    if (!value) return "$0 CLP";
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <main style={{ fontFamily: "sans-serif" }}>
      {user ? (
        <section style={{ textAlign: "center", marginTop: "25px", marginBottom: "15px" }}>
          <h2 style={{ color: "#1e293b", fontWeight: "700" }}>¡Bienvenido de vuelta, {user.nombreUsuario || user.nombre}!</h2>
        </section>
      ) : (
        <section style={{ textAlign: "center", marginTop: "25px", marginBottom: "15px" }}>
          <h2 style={{ color: "#64748b" }}>No hay sesión activa, inicia sesión para interactuar en el mercado</h2>
        </section>
      )}

      {/* BLOQUE PROMOS RESPETANDO TU MAQUETACIÓN */}
      <section className="bloque-promos">
        <div className="bloque-carta">
          <div className="carta-img">
            <img src="/img/promo1.jpg" alt="Imagen promocional 1" />
          </div>
          <div className="info-carta">
            <h2>Últimas novedades</h2>
          </div>
        </div>
        <div className="bloque-carta">
          <div className="carta-img">
            <img src="/img/promo2.jpg" alt="Imagen promocional 2" />
          </div>
          <div className="info-carta">
            <h2>Compra y vende de forma sencilla</h2>
          </div>
        </div>
      </section>

      {/* SECCIÓN ACTUALIZADA DE PUBLICADAS RECIENTEMENTE */}
      <section className="cartas-recientes" style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "left", borderBottom: "2px solid #f1f5f9", paddingBottom: "10px", marginBottom: "24px", color: "#0f172a" }}>
          🔥 Publicadas recientemente
        </h2>
        
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>🔄 Cargando últimas ofertas del mercado...</div>
        ) : postsRecientes.length === 0 ? (
          <div style={{ textAlign: "center", padding: "30px", color: "#94a3b8", background: "#f8fafc", borderRadius: "8px" }}>
            No hay publicaciones recientes en este momento.
          </div>
        ) : (
          /* Nueva cuadrícula nativa, responsiva y cuadrada */
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", 
            gap: "24px",
            width: "100%" 
          }}>
            {postsRecientes.map((post) => (
              <div 
                key={post.id}
                onClick={() => navigate(`/card/${post.cardId}`)} // <-- CORREGIDO: Redirección directa al template oficial
                style={{ 
                  border: "1px solid #e2e8f0", 
                  borderRadius: "12px", 
                  overflow: "hidden", 
                  background: "#ffffff", 
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.03)", 
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "left"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0,0,0,0.03)";
                }}
              >
                {/* Imagen de la Carta */}
                <div style={{ height: "240px", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", borderBottom: "1px solid #f1f5f9" }}>
                  <img 
                    src={post.cardImage || post.imagenUrl || "https://via.placeholder.com/200x280?text=No+Image"} 
                    alt={post.nombre} 
                    style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }} 
                  />
                </div>

                {/* Info Básica */}
                <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>
                      POKÉMON • {post.estadoDetectado || "NM"}
                    </span>
                    <h3 style={{ margin: "4px 0", fontSize: "16px", fontWeight: "700", color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {post.nombre}
                    </h3>
                    <p style={{ color: "#64748b", margin: "0 0 12px 0", fontSize: "13px" }}>
                      {post.edicion || "Colección"} • #{post.numero || post.cardId || "N/A"}
                    </p>
                  </div>
                  
                  {/* Fila de precio e IA Score */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: "12px" }}>
                    <span style={{ fontSize: "16px", fontWeight: "700", color: "#b91c1c" }}>
                      {formatCLP(post.precio)}
                    </span>
                    <span style={{ fontSize: "11px", fontWeight: "700", color: "#166534", background: "#dcfce7", padding: "4px 8px", borderRadius: "6px" }}>
                      ⭐ IA: {post.score || 0}/10
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Home;