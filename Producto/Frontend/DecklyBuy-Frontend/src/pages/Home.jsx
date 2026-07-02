import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [user, setUser] = useState(null);
  const [postsRecientes, setPostsRecientes] = useState([]); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://localhost:8080/api/auth/me", { credentials: "include" })
      .then(async res => {
        const data = await res.json().catch(() => null);
        if (!res.ok) throw new Error(data?.message || "No autenticado");
        setUser(data.user);
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      })
      .catch(err => console.error("Error obteniendo usuario:", err));

    const fetchPostsRecientes = async () => {
      try {
        const response = await fetch("https://localhost:8080/api/posts", { credentials: "include" });
        const result = await response.json();
        const dataArray = result.dataResponse || result.data || result || [];
        setPostsRecientes(dataArray.slice(0, 8)); 
      } catch (error) {
        console.error("Error cargando cartas recientes en Home:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostsRecientes();
  }, []);

  const formatCLP = (value) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0
    }).format(value || 0);
  };

  return (
    <main style={{ fontFamily: "sans-serif" }}>
      <section style={estilos.headerSection}>
        <h2 style={user ? estilos.welcomeActive : estilos.welcomeInactive}>
          {user ? `¡Bienvenido de vuelta, ${user.nombreUsuario || user.nombre}!` : "No hay sesión activa, inicia sesión para interactuar en el mercado"}
        </h2>
      </section>

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

      <section className="cartas-recientes" style={estilos.container}>
        <h2 style={estilos.sectionTitle}>🔥 Publicadas recientemente</h2>
        
        {loading ? (
          <div style={estilos.fallbackText}>🔄 Cargando últimas ofertas del mercado...</div>
        ) : postsRecientes.length === 0 ? (
          <div style={estilos.emptyBox}>No hay publicaciones recientes en este momento.</div>
        ) : (
          <div style={estilos.grid}>
            {postsRecientes.map((post) => (
              <div 
                key={post.id}
                onClick={() => navigate(`/card/${post.cardId}`)}
                style={estilos.card}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0,0,0,0.03)";
                }}
              >
                <div style={estilos.imgBox}>
                  <img 
                    src={post.cardImage || post.imagenUrl || "https://via.placeholder.com/200x280?text=No+Image"} 
                    alt={post.nombre} 
                    style={estilos.img} 
                  />
                </div>

                <div style={estilos.infoBox}>
                  <div>
                    <span style={estilos.badge}>POKÉMON • {post.estadoDetectado || "NM"}</span>
                    <h3 style={estilos.cardTitle}>{post.nombre}</h3>
                    <p style={estilos.subtitle}>
                      {post.edicion || "Colección"} • #{post.numero || post.cardId || "N/A"}
                    </p>
                  </div>
                  
                  {/* Regresamos el texto informativo del precio */}
                  <div style={estilos.footerRow}>
                    <span style={estilos.priceLabel}>Desde:</span>
                    <span style={estilos.price}>{formatCLP(post.precio)}</span>
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

const estilos = {
  headerSection: { textAlign: "center", marginTop: "25px", marginBottom: "15px" },
  welcomeActive: { color: "#1e293b", fontWeight: "700" },
  welcomeInactive: { color: "#64748b" },
  container: { padding: "20px", maxWidth: "1200px", margin: "0 auto" },
  sectionTitle: { textAlign: "left", borderBottom: "2px solid #f1f5f9", paddingBottom: "10px", marginBottom: "24px", color: "#0f172a" },
  fallbackText: { textAlign: "center", padding: "40px", color: "#64748b" },
  emptyBox: { textAlign: "center", padding: "30px", color: "#94a3b8", background: "#f8fafc", borderRadius: "8px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "24px", width: "100%" },
  card: { border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden", background: "#ffffff", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.03)", transition: "transform 0.2s ease, box-shadow 0.2s ease", cursor: "pointer", display: "flex", flexDirection: "column", textAlign: "left" },
  imgBox: { height: "240px", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", borderBottom: "1px solid #f1f5f9" },
  img: { maxHeight: "100%", maxWidth: "100%", objectFit: "contain" },
  infoBox: { padding: "16px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" },
  badge: { fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" },
  cardTitle: { margin: "4px 0", fontSize: "16px", fontWeight: "700", color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  subtitle: { color: "#64748b", margin: "0 0 12px 0", fontSize: "13px" },
  footerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: "12px" },
  priceLabel: { fontSize: "13px", color: "#64748b", fontWeight: "500" }, // Estilo para el label "Desde:"
  price: { fontSize: "16px", fontWeight: "700", color: "#b91c1c" }
};

export default Home;