import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CardDetail = () => {
  const { cardId } = useParams();
  const navigate = useNavigate();

  // Estados de datos
  const [cartaOficial, setCartaOficial] = useState(null);
  const [ofertasOriginales, setOfertasOriginales] = useState([]);
  const [ofertasFiltradas, setOfertasFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados de filtros locales (Idioma, Estado e IA Score)
  const [filtroIdioma, setFiltroIdioma] = useState("TODOS");
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [ordenPrecio, setOrdenPrecio] = useState("precio_asc"); // Por defecto, la más barata primero

  useEffect(() => {
    const fetchDatosCarta = async () => {
      setLoading(true);
      try {
        // 1. Aquí idealmente pegas al endpoint que te da la info oficial de la carta
        // (Si no tienes uno exclusivo, puedes rescatar post.nombre, post.cardImage del primer elemento que encuentres)
        
        // 2. Traer todas las publicaciones/ofertas de usuarios asociadas a esta cardId
        const response = await fetch(`https://localhost:8080/api/posts/card/${cardId}`, { 
          credentials: "include" 
        });
        const result = await response.json();
        const listaOfertas = result.data || result || [];

        setOfertasOriginales(listaOfertas);
        setOfertasFiltradas(listaOfertas);

        if (listaOfertas.length > 0) {
          // Simulamos o extraemos la info oficial del primer registro para el Header de la página
          setCartaOficial({
            nombre: listaOfertas[0].nombre,
            cardImage: listaOfertas[0].cardImage,
            edicion: listaOfertas[0].edicion,
            numero: listaOfertas[0].numero,
            categoriaCarta: listaOfertas[0].categoriaCarta
          });
        }
      } catch (error) {
        console.error("Error cargando detalles de la carta:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDatosCarta();
  }, [cardId]);

  // Lógica de filtrado dinámico en tiempo real (Frontend Side)
  useEffect(() => {
    let resultado = [...ofertasOriginales];

    // Filtro por Idioma
    if (filtroIdioma !== "TODOS") {
      resultado = resultado.filter(o => o.idioma === filtroIdioma);
    }

    // Filtro por Estado (IA o manual)
    if (filtroEstado !== "TODOS") {
      resultado = resultado.filter(o => o.estadoDetectado === filtroEstado || o.estado === filtroEstado);
    }

    // Ordenación por precio
    if (ordenPrecio === "precio_asc") {
      resultado.sort((a, b) => a.precio - b.precio);
    } else if (ordenPrecio === "precio_desc") {
      resultado.sort((a, b) => b.precio - a.precio);
    }

    setOfertasFiltradas(resultado);
  }, [filtroIdioma, filtroEstado, ordenPrecio, ofertasOriginales]);

  // Formateador CLP
  const formatCLP = (value) => {
    if (!value) return "$0 CLP";
    return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 }).format(value);
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "50px", color: "#64748b" }}>🔄 Desplegando hoja de datos e inventario...</div>;
  }

  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "30px 20px", fontFamily: "sans-serif", textAlign: "left" }}>
      
      {/* SECCIÓN 1: INFORMACIÓN OFICIAL DE LA CARTA */}
      {cartaOficial && (
        <section style={{ display: "flex", gap: "40px", flexWrap: "wrap", background: "#f8fafc", padding: "30px", borderRadius: "16px", border: "1px solid #e2e8f0", marginBottom: "40px" }}>
          <div style={{ width: "220px", height: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src={cartaOficial.cardImage} alt={cartaOficial.nombre} style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }} />
          </div>
          <div style={{ flex: 1, minWidth: "280px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#2563eb", background: "#dbeafe", padding: "4px 10px", borderRadius: "20px", width: "fit-content", marginBottom: "12px" }}>
              {cartaOficial.categoriaCarta || "Pokémon"}
            </span>
            <h1 style={{ fontSize: "2.2rem", margin: "0 0 10px 0", color: "#0f172a", fontWeight: "800" }}>{cartaOficial.nombre}</h1>
            <p style={{ fontSize: "1.1rem", color: "#475569", margin: "0 0 6px 0" }}>🌐 Expansión: <strong>{cartaOficial.edicion || "Base set"}</strong></p>
            <p style={{ fontSize: "1rem", color: "#64748b", margin: 0 }}>🔢 Número de Colección: #{cartaOficial.numero || "N/A"}</p>
          </div>
        </section>
      )}

      {/* SECCIÓN 2: BARRA DE FILTROS EXCLUSIVA PARA LAS OFERTAS DE ESTA CARTA */}
      <section style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "1.4rem", color: "#0f172a", marginBottom: "15px", fontWeight: "700" }}>🛒 Ofertas disponibles en el mercado</h2>
        
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", background: "#ffffff", padding: "15px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
          
          {/* Filtro Idioma */}
          <div style={{ flex: 1, minWidth: "150px" }}>
            <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "4px" }}>IDIOMA</label>
            <select value={filtroIdioma} onChange={(e) => setFiltroIdioma(e.target.value)} style={selectEstilo}>
              <option value="TODOS">Cualquier idioma</option>
              <option value="Español">Español 🇪🇸</option>
              <option value="Inglés">Inglés 🇺🇸</option>
              <option value="Japonés">Japonés 🇯🇵</option>
            </select>
          </div>

          {/* Filtro Estado */}
          <div style={{ flex: 1, minWidth: "150px" }}>
            <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "4px" }}>ESTADO DE LA CARTA</label>
            <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} style={selectEstilo}>
              <option value="TODOS">Cualquier estado</option>
              <option value="Near Mint">Near Mint (NM)</option>
              <option value="Lightly Played">Lightly Played (LP)</option>
              <option value="Moderately Played">Moderately Played (MP)</option>
            </select>
          </div>

          {/* Ordenar por precio */}
          <div style={{ flex: 1, minWidth: "150px" }}>
            <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "4px" }}>ORDENAR PRECIO</label>
            <select value={ordenPrecio} onChange={(e) => setOrdenPrecio(e.target.value)} style={selectEstilo}>
              <option value="precio_asc">Más barato primero</option>
              <option value="precio_desc">Más caro primero</option>
            </select>
          </div>

        </div>
      </section>

      {/* SECCIÓN 3: TABLA / LISTADO DE PUBLICACIONES FILTRADAS */}
      <section style={{ border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden", background: "#fff" }}>
        {ofertasFiltradas.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
            No hay vendedores ofreciendo esta carta con los filtros seleccionados actualmente.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                  <th style={thEstilo}>Vendedor</th>
                  <th style={thEstilo}>Idioma</th>
                  <th style={thEstilo}>Condición (IA)</th>
                  <th style={thEstilo}>Precio Unitario</th>
                  <th style={{ ...thEstilo, textAlign: "center" }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {ofertasFiltradas.map((oferta) => (
                  <tr key={oferta.id} style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"} onMouseLeave={(e) => e.currentTarget.style.background = "none"}>
                    
                    {/* Nombre Vendedor */}
                    <td style={tdEstilo}>
                      <div style={{ fontWeight: "600", color: "#0f172a" }}>{oferta.usuarioNombre || "Vendedor Deckly"}</div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>Chile</div>
                    </td>

                    {/* Idioma */}
                    <td style={tdEstilo}>
                      <span style={{ fontWeight: "600", color: "#334155" }}>
                        {oferta.idioma === "Español" ? "🇪🇸 Español" : oferta.idioma === "Japonés" ? "🇯🇵 Japonés" : "🇺🇸 Inglés"}
                      </span>
                    </td>

                    {/* Condición + Score */}
                    <td style={tdEstilo}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "13px", fontWeight: "700", color: "#1e293b" }}>{oferta.estadoDetectado || "NM"}</span>
                        <span style={{ fontSize: "11px", fontWeight: "700", color: "#166534", background: "#dcfce7", padding: "2px 6px", borderRadius: "4px" }}>
                          ⭐ IA: {oferta.score || 0}/10
                        </span>
                      </div>
                    </td>

                    {/* Precio CLP */}
                    <td style={{ ...tdEstilo, fontSize: "16px", fontWeight: "700", color: "#b91c1c" }}>
                      {formatCLP(oferta.precio)}
                    </td>

                    {/* Botón comprar / Contactar */}
                    <td style={{ ...tdEstilo, textAlign: "center" }}>
                      <button 
                        onClick={() => navigate(`/checkout/${oferta.id}`)}
                        style={{ background: "#2563eb", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: "600", cursor: "pointer", fontSize: "13px" }}
                      >
                        Comprar
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </main>
  );
};

// Estilos rápidos limpios inline
const selectEstilo = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: "6px",
  border: "1px solid #cbd5e1",
  background: "#fff",
  fontSize: "13px",
  fontWeight: "500",
  marginTop: "4px"
};

const thEstilo = {
  padding: "12px 16px",
  textAlign: "left",
  fontSize: "12px",
  fontWeight: "700",
  color: "#475569",
  textTransform: "uppercase"
};

const tdEstilo = {
  padding: "14px 16px",
  fontSize: "14px",
  verticalAlign: "middle"
};

export default CardDetail;