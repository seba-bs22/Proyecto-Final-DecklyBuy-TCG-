import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const MAPA_IDIOMAS = {
  "Español": "🇪🇸 Español",
  "Inglés": "🇺🇸 Inglés",
  "Japonés": "🇯🇵 Japonés",
  "Alemán": "🇩🇪 Alemán",
  "Francés": "🇫🇷 Francés",
  "Italiano": "🇮🇹 Italiano",
  "Coreano": "🇰🇷 Coreano",
  "Chino": "🇨🇳 Chino",
  "Portugués": "🇧🇷 Portugués"
};

const SellerProfile = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [vendedor, setVendedor] = useState(null);
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerfilVendedor = async () => {
      if (!vendorId) return;
      setLoading(true);
      try {
        const [resUsuario, resPosts] = await Promise.all([
          fetch(`https://localhost:8080/api/users/${vendorId}`, { credentials: "include" }),
          fetch(`https://localhost:8080/api/posts/user/${vendorId}`, { credentials: "include" })
        ]);

        if (resUsuario?.ok) {
          const userData = await resUsuario.json();
          setVendedor(userData.user || userData.data || userData);
        }

        if (resPosts.ok) {
          const postsData = await resPosts.json();
          const listaPosts = postsData.data || postsData || [];
          setPublicaciones(Array.isArray(listaPosts) ? listaPosts : []);
        }
      } catch (error) {
        console.error("Error al cargar el perfil en el frontend:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerfilVendedor();
  }, [vendorId]);

  const formatCLP = (value) => {
    return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 }).format(value || 0);
  };

  const nombreAMostrar = vendedor?.nombreUsuario || vendedor?.nombre || "Vendedor Deckly";

  if (loading) {
    return <div style={{ textAlign: "center", padding: "50px", color: "#64748b", fontFamily: "sans-serif" }}>🔄 Cargando perfil de Deckly...</div>;
  }

  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "30px 20px", fontFamily: "sans-serif", textAlign: "left" }}>
      <section style={estilos.header}>
        <div style={estilos.avatar}>
          {vendedor?.fotoPerfil ? (
            <img 
              src={vendedor.fotoPerfil.replace("http://", "https://")} 
              alt={nombreAMostrar}
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement.innerText = nombreAMostrar.charAt(0).toUpperCase();
              }}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            nombreAMostrar.charAt(0).toUpperCase()
          )}
        </div>

        <div>
          <h1 style={{ fontSize: "1.8rem", margin: "0 0 4px 0", color: "#0f172a", fontWeight: "800" }}>{nombreAMostrar}</h1>
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>📍 Miembro de Deckly | 📦 {publicaciones.length} Cartas en catálogo</p>
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: "1.4rem", color: "#0f172a", marginBottom: "20px", fontWeight: "700" }}>📋 Catálogo de cartas activas</h2>
        
        <div style={{ border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden", background: "#fff" }}>
          {publicaciones.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>Este vendedor no dispone de publicaciones activas en este momento.</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                    <th style={estilos.th}>Carta</th>
                    <th style={estilos.th}>Expansión</th>
                    <th style={estilos.th}>Idioma</th>
                    <th style={estilos.th}>Condición (IA)</th>
                    <th style={estilos.th}>Precio</th>
                    <th style={{ ...estilos.th, textAlign: "center" }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {publicaciones.map((post) => (
                    <tr 
                      key={post.id} 
                      style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.2s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#f8fafc"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
                    >
                      <td style={estilos.td}>
                        <Link to={`/posts/${post.id}`} style={{ fontWeight: "600", color: "#2563eb", textDecoration: "none" }}>
                          {post.card?.nombre || post.nombre || "Carta Pokémon"}
                        </Link>
                        <div style={{ fontSize: "12px", color: "#64748b" }}>#{post.card?.numero || post.numero || "N/A"}</div>
                      </td>
                      
                      <td style={estilos.td}>
                        <span style={{ color: "#475569", fontWeight: "500" }}>{post.card?.edicion || post.edicion || "Base Set"}</span>
                      </td>

                      <td style={estilos.td}>
                        <span style={{ fontWeight: "600", color: "#334155" }}>{MAPA_IDIOMAS[post.idioma] || `🌐 ${post.idioma}`}</span>
                      </td>

                      <td style={estilos.td}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "13px", fontWeight: "700", color: "#1e293b" }}>{post.estadoDetectado || "NM"}</span>
                          <span style={{ fontSize: "11px", fontWeight: "700", color: "#166534", background: "#dcfce7", padding: "2px 6px", borderRadius: "4px" }}>
                            Score: {post.score || 0}/10
                          </span>
                        </div>
                      </td>

                      <td style={{ ...estilos.td, fontSize: "16px", fontWeight: "700", color: "#b91c1c" }}>
                        {formatCLP(post.precio)}
                      </td>

                      <td style={{ ...estilos.td, textAlign: "center" }}>
                        <button 
                          onClick={() => navigate(`/posts/${post.id}`)}
                          style={estilos.btn}
                        >
                          Ver Detalles
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

const estilos = {
  header: { background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)", padding: "30px", borderRadius: "16px", border: "1px solid #e2e8f0", marginBottom: "40px", display: "flex", alignItems: "center", gap: "20px" },
  avatar: { width: "70px", height: "70px", borderRadius: "50%", background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", color: "#fff", fontWeight: "700", overflow: "hidden", flexShrink: 0 },
  th: { padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "#475569", textTransform: "uppercase" },
  td: { padding: "14px 16px", fontSize: "14px", verticalAlign: "middle" },
  btn: { background: "#f1f5f9", color: "#1e293b", border: "1px solid #cbd5e1", padding: "6px 12px", borderRadius: "6px", fontWeight: "600", cursor: "pointer", fontSize: "13px" }
};

export default SellerProfile;