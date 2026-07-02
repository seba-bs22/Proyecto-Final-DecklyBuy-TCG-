import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Offers = () => {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchYCalcularOfertas = async () => {
      try {
        const response = await fetch("https://localhost:8080/api/posts", { credentials: "include" });
        const result = await response.json();
        
        // Obtenemos el array de datos de forma segura
        const posts = result.dataResponse || result.data || result || [];

        if (!Array.isArray(posts)) {
          console.error("Los datos recibidos no son un listado válido:", posts);
          setOfertas([]);
          return;
        }

        // FILTRADO SEGURO POR REBAJA PROPIA:
        const postsEnOferta = posts.filter(post => {
          if (!post) return false;
          
          // Si el precioOriginal viene del backend lo usamos; si viene null (por ser registro viejo), usamos su precio actual como base
          const precioBase = post.precioOriginal !== undefined && post.precioOriginal !== null 
            ? post.precioOriginal 
            : post.precio;
          
          // Es oferta real si el precio actual bajó respecto a su precio original
          return post.precio < precioBase;
        }).map(post => {
          const precioAntes = post.precioOriginal !== undefined && post.precioOriginal !== null 
            ? post.precioOriginal 
            : post.precio;
            
          // Evitamos división por cero por si acaso
          const porcentaje = precioAntes > 0 
            ? Math.round(((precioAntes - post.precio) / precioAntes) * 100) 
            : 0;
          
          return {
            ...post,
            precioPromedio: precioAntes, // Guardamos el precio original aquí para mostrarlo en la tarjeta
            descuento: `${porcentaje}% OFF`
          };
        });

        setOfertas(postsEnOferta);
      } catch (error) {
        console.error("Error al procesar las ofertas reales:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchYCalcularOfertas();
  }, []);

  const formatCLP = (value) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0
    }).format(value || 0);
  };

  return (
    <main style={{ fontFamily: "sans-serif", padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <section style={estilos.headerSection}>
        <h2 style={estilos.mainTitle}>🔥 Liquidaciones y Ofertas</h2>
        <p style={estilos.subtitle}>Publicaciones con precios inferiores al precio original del vendedor.</p>
      </section>

      <section className="cartas-oferta">
        {loading ? (
          <div style={estilos.fallbackText}>🔄 Analizando rebajas en tiempo real...</div>
        ) : ofertas.length === 0 ? (
          <div style={estilos.emptyBox}>No se encontraron publicaciones con rebajas respecto al precio original.</div>
        ) : (
          <div style={estilos.grid}>
            {ofertas.map((post) => (
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
                {/* Badge de Descuento Real */}
                <div style={estilos.discountBadge}>{post.descuento}</div>

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
                    <p style={estilos.cardSubtitle}>
                      {post.edicion || "Colección"} • #{post.numero || post.cardId || "N/A"}
                    </p>
                  </div>
                  
                  {/* Bloque comparador de precios */}
                  <div style={estilos.priceContainer}>
                    <div style={estilos.priceRow}>
                      <span style={estilos.priceLabel}>Antes:</span>
                      <span style={estilos.normalPrice}>{formatCLP(post.precioPromedio)}</span>
                    </div>
                    <div style={estilos.priceRow}>
                      <span style={estilos.priceLabel}>Oferta:</span>
                      <span style={estilos.price}>{formatCLP(post.precio)}</span>
                    </div>
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
  headerSection: { textAlign: "left", borderBottom: "2px solid #f1f5f9", paddingBottom: "10px", marginBottom: "24px" },
  mainTitle: { fontSize: "24px", color: "#0f172a", margin: "0 0 6px 0", fontWeight: "700" },
  subtitle: { fontSize: "14px", color: "#64748b", margin: 0 },
  fallbackText: { textAlign: "center", padding: "40px", color: "#64748b" },
  emptyBox: { textAlign: "center", padding: "30px", color: "#94a3b8", background: "#f8fafc", borderRadius: "8px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "24px", width: "100%" },
  card: { border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden", background: "#ffffff", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.03)", transition: "transform 0.2s ease, box-shadow 0.2s ease", cursor: "pointer", display: "flex", flexDirection: "column", textAlign: "left", position: "relative" },
  discountBadge: { position: "absolute", top: "10px", right: "10px", background: "#ef4444", color: "#fff", padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "750", zIndex: 2 },
  imgBox: { height: "240px", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", borderBottom: "1px solid #f1f5f9" },
  img: { maxHeight: "100%", maxWidth: "100%", objectFit: "contain" },
  infoBox: { padding: "16px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" },
  badge: { fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" },
  cardTitle: { margin: "4px 0", fontSize: "16px", fontWeight: "700", color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  cardSubtitle: { color: "#64748b", margin: "0 0 12px 0", fontSize: "13px" },
  priceContainer: { background: "#fef2f2", padding: "8px 12px", borderRadius: "8px", border: "1px solid #fee2e2" },
  priceRow: { display: "flex", justifyContent: "space-between", alignItems: "center", margin: "2px 0" },
  priceLabel: { fontSize: "12px", color: "#64748b" },
  normalPrice: { fontSize: "13px", color: "#94a3b8", textDecoration: "line-through" },
  price: { fontSize: "15px", fontWeight: "700", color: "#b91c1c" }
};

// Con esto solucionas el error de carga de Vite
export default Offers;