import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Diccionario optimizado para banderas e idiomas
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

const CardDetail = () => {
  const { cardId } = useParams();
  const navigate = useNavigate();

  // Estados de datos
  const [cartaOficial, setCartaOficial] = useState(null);
  const [ofertasOriginales, setOfertasOriginales] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados de filtros locales
  const [filtroIdioma, setFiltroIdioma] = useState("TODOS");
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [ordenPrecio, setOrdenPrecio] = useState("precio_asc");

  useEffect(() => {
    const fetchDatosCarta = async () => {
      setLoading(true);
      try {
        const [resOfertas, resApiOficial] = await Promise.all([
          fetch(`https://localhost:8080/api/posts/card/${cardId}`, { credentials: "include" }),
          fetch(`https://api.tcgdex.net/v2/en/cards/${cardId}`)
        ]);

        const resultOfertas = await resOfertas.json();
        const listaOfertas = resultOfertas.data || resultOfertas || [];
        setOfertasOriginales(listaOfertas);

        if (resApiOficial.ok) {
          const dataOficial = await resApiOficial.json();
          setCartaOficial({
            nombre: dataOficial.name,
            cardImage: dataOficial.image,
            edicion: dataOficial.set?.name || "Base Set",
            numero: dataOficial.localId,
            categoriaCarta: dataOficial.category,
            rarity: dataOficial.rarity,
            illustrator: dataOficial.illustrator,
            hp: dataOficial.hp,
            types: dataOficial.types || [],
            stage: dataOficial.stage,
            attacks: dataOficial.attacks || [],
            description: dataOficial.description,
            effect: dataOficial.effect 
          });
        } else if (listaOfertas.length > 0) {
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
      } finally { // <-- CORREGIDO AQUÍ (con doble 'l')
        setLoading(false);
      }
    };

    fetchDatosCarta();
  }, [cardId]);

  // Lógica de filtrado dinámico optimizada con useMemo (Evita renders duplicados)
  const ofertasFiltradas = useMemo(() => {
    let resultado = [...ofertasOriginales];

    if (filtroIdioma !== "TODOS") {
      resultado = resultado.filter(o => o.idioma === filtroIdioma);
    }

    if (filtroEstado !== "TODOS") {
      resultado = resultado.filter(o => o.estadoDetectado === filtroEstado || o.estado === filtroEstado);
    }

    if (ordenPrecio === "precio_asc") {
      resultado.sort((a, b) => a.precio - b.precio);
    } else if (ordenPrecio === "precio_desc") {
      resultado.sort((a, b) => b.precio - a.precio);
    }

    return resultado;
  }, [filtroIdioma, filtroEstado, ordenPrecio, ofertasOriginales]);

  const formatCLP = (value) => {
    if (!value) return "$0 CLP";
    return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 }).format(value);
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "50px", color: "#64748b" }}>🔄 Desplegando hoja de datos e inventario...</div>;
  }

  const esTrainer = cartaOficial?.categoriaCarta !== "Pokemon";

  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "30px 20px", fontFamily: "sans-serif", textAlign: "left" }}>
      
      {/* SECCIÓN 1: INFORMACIÓN OFICIAL COMPLETA DE LA CARTA */}
      {cartaOficial && (
        <section style={{ display: "flex", gap: "40px", flexWrap: "wrap", background: "#f8fafc", padding: "30px", borderRadius: "16px", border: "1px solid #e2e8f0", marginBottom: "40px" }}>
          <div style={{ width: "220px", height: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src={`${cartaOficial.cardImage}/high.png`} alt={cartaOficial.nombre} style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }} onError={(e) => { e.target.src = cartaOficial.cardImage }} />
          </div>
          
          <div style={{ flex: 1, minWidth: "280px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#2563eb", background: "#dbeafe", padding: "4px 10px", borderRadius: "20px" }}>
                {cartaOficial.categoriaCarta || "Pokémon"}
              </span>
              {cartaOficial.stage && (
                <span style={{ fontSize: "12px", fontWeight: "700", color: "#16a34a", background: "#dcfce7", padding: "4px 10px", borderRadius: "20px" }}>
                  {cartaOficial.stage}
                </span>
              )}
            </div>

            <h1 style={{ fontSize: "2.2rem", margin: "0 0 10px 0", color: "#0f172a", fontWeight: "800" }}>{cartaOficial.nombre}</h1>
            
            <p style={{ fontSize: "1.1rem", color: "#475569", margin: "0 0 6px 0" }}>🌐 Expansión: <strong>{cartaOficial.edicion}</strong></p>
            <p style={{ fontSize: "1rem", color: "#64748b", margin: "0 0 6px 0" }}>🔢 Número de Colección: #{cartaOficial.numero}</p>
            
            {cartaOficial.hp && (
              <p style={{ fontSize: "1rem", color: "#475569", margin: "0 0 6px 0" }}>
                ❤️ HP: <strong style={{ color: "#dc2626" }}>{cartaOficial.hp}</strong> 
                {cartaOficial.types?.length > 0 && ` | 🧬 Tipo: ${cartaOficial.types.join(", ")}`}
              </p>
            )}
            
            {cartaOficial.rarity && (
              <p style={{ fontSize: "1rem", color: "#475569", margin: "0 0 12px 0" }}>
                ✨ Rareza: <strong>{cartaOficial.rarity}</strong> | 🎨 Ilustrador: <em>{cartaOficial.illustrator || "Desconocido"}</em>
              </p>
            )}

            {/* EFECTO DIRECTO (Para cartas Trainer / Energy de TCGdex) */}
            {cartaOficial.effect && (
              <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #e2e8f0" }}>
                <strong style={{ display: "block", fontSize: "0.85rem", color: "#475569", marginBottom: "6px", textTransform: "uppercase" }}>📜 Efecto de la Carta:</strong>
                <p style={{ fontSize: "0.95rem", color: "#334155", background: "#f1f5f9", padding: "12px", borderRadius: "8px", borderLeft: "4px solid #cbd5e1", margin: 0, lineHeight: "1.4" }}>
                  {cartaOficial.effect}
                </p>
              </div>
            )}

            {/* TEXTO DE DESCRIPCIÓN OFICIAL (Flavor text de Pokémon) */}
            {cartaOficial.description && (
              <div style={{ margin: "15px 0 0 0", paddingTop: "15px", borderTop: !cartaOficial.effect ? "1px solid #e2e8f0" : "none" }}>
                <strong style={{ display: "block", fontSize: "0.85rem", color: "#475569", marginBottom: "4px", textTransform: "uppercase" }}>📝 Descripción Pokédex:</strong>
                <p style={{ fontSize: "0.95rem", color: "#334155", fontStyle: "italic", background: "#f1f5f9", padding: "12px", borderRadius: "8px", borderLeft: "4px solid #cbd5e1", margin: 0, lineHeight: "1.4" }}>
                  "{cartaOficial.description}"
                </p>
              </div>
            )}

            {/* ATAQUES / MOVIMIENTOS (Para Pokémon) */}
            {cartaOficial.attacks?.length > 0 && (
              <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #e2e8f0" }}>
                <h4 style={{ margin: "0 0 10px 0", fontSize: "0.95rem", color: "#1e293b", fontWeight: "700" }}>⚔️ Movimientos Oficiales:</h4>
                <div style={{ display: "grid", gap: "10px", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
                  {cartaOficial.attacks.map((atk, index) => (
                    <div key={index} style={{ background: "#ffffff", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", color: "#334155", fontSize: "0.95rem", marginBottom: "4px" }}>
                        <span>{atk.name || `Efecto de ${cartaOficial.nombre}`}</span>
                        {atk.damage && <span style={{ color: "#dc2626" }}>💥 {atk.damage}</span>}
                      </div>
                      {atk.effect && (
                        <div style={{ fontSize: "0.85rem", color: "#475569", lineHeight: "1.4" }}>
                          {atk.effect}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* SECCIÓN 2: BARRA DE FILTROS EXCLUSIVA */}
      <section style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "1.4rem", color: "#0f172a", marginBottom: "15px", fontWeight: "700" }}>🛒 Ofertas disponibles en el mercado</h2>
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", background: "#ffffff", padding: "15px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
          
          <div style={{ flex: 1, minWidth: "160px" }}>
            <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "4px" }}>IDIOMA</label>
            <select value={filtroIdioma} onChange={(e) => setFiltroIdioma(e.target.value)} style={selectEstilo}>
              <option value="TODOS">Cualquier idioma</option>
              <option value="Español">Español 🇪🇸</option>
              <option value="Inglés">Inglés 🇺🇸</option>
              <option value="Japonés">Japonés 🇯🇵</option>
              <option value="Alemán">Alemán 🇩🇪</option>
              <option value="Francés">Francés 🇫🇷</option>
              <option value="Italiano">Italiano 🇮🇹</option>
              <option value="Coreano">Coreano 🇰🇷</option>
              <option value="Chino">Chino 🇨🇳</option>
              <option value="Portugués">Portugués 🇧🇷</option>
            </select>
          </div>

          <div style={{ flex: 1, minWidth: "150px" }}>
            <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "4px" }}>ESTADO DE LA CARTA</label>
            <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} style={selectEstilo}>
              <option value="TODOS">Cualquier estado</option>
              <option value="Near Mint">Near Mint (NM)</option>
              <option value="Lightly Played">Lightly Played (LP)</option>
              <option value="Moderately Played">Moderately Played (MP)</option>
            </select>
          </div>

          <div style={{ flex: 1, minWidth: "150px" }}>
            <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "4px" }}>ORDENAR PRECIO</label>
            <select value={ordenPrecio} onChange={(e) => setOrdenPrecio(e.target.value)} style={selectEstilo}>
              <option value="precio_asc">Más barato primero</option>
              <option value="precio_desc">Más caro primero</option>
            </select>
          </div>

        </div>
      </section>

      {/* SECCIÓN 3: LISTADO DE PUBLICACIONES FILTRADAS */}
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
                    
                    <td style={tdEstilo}>
                      <div style={{ fontWeight: "600", color: "#0f172a" }}>{oferta.usuarioNombre || "Vendedor Deckly"}</div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>Chile</div>
                    </td>

                    <td style={tdEstilo}>
                      <span style={{ fontWeight: "600", color: "#334155" }}>
                        {MAPA_IDIOMAS[oferta.idioma] || `🌐 ${oferta.idioma}`}
                      </span>
                    </td>

                    <td style={tdEstilo}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "13px", fontWeight: "700", color: "#1e293b" }}>{oferta.estadoDetectado || "NM"}</span>
                        <span style={{ fontSize: "11px", fontWeight: "700", color: "#166534", background: "#dcfce7", padding: "2px 6px", borderRadius: "4px" }}>
                          Imágenes IA: {oferta.score || 0}/10
                        </span>
                      </div>
                    </td>

                    <td style={{ ...tdEstilo, fontSize: "16px", fontWeight: "700", color: "#b91c1c" }}>
                      {formatCLP(oferta.precio)}
                    </td>

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

// Estilos estáticos
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