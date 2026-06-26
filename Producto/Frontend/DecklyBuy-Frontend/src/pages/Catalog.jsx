import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const categoriasParam = searchParams.get("categorias");
  const estadoParam = searchParams.get("estado");
  const ordenarParam = searchParams.get("ordenar");
  const buscarParam = searchParams.get("buscar");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (categoriasParam) params.append("categorias", categoriasParam);
        if (estadoParam) params.append("estado", estadoParam);
        if (ordenarParam) params.append("ordenar", ordenarParam);
        if (buscarParam) params.append("buscar", buscarParam);

        const queryStr = params.toString();
        const url = queryStr 
          ? `https://localhost:8080/api/posts?${queryStr}`
          : "https://localhost:8080/api/posts";

        const response = await fetch(url, { credentials: "include" });
        const result = await response.json();

        if (response.ok) {
          const datosHeredados = (result.data || []).map((post) => ({
            ...post,
            card: post.card 
              ? { ...post.card, categoriaCarta: post.categoriaCarta } 
              : { categoriaCarta: post.categoriaCarta }
          }));

          setPosts(datosHeredados);
        } else {
          setError(result.message || "Error al cargar el catálogo.");
        }
      } catch (err) {
        console.error("Error en catálogo:", err);
        setError("No se pudo conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [categoriasParam, estadoParam, ordenarParam, buscarParam]);

  const handleFiltro = (clave, valor) => {
    const nuevosParams = new URLSearchParams(searchParams);
    if (valor === "TODOS") {
      nuevosParams.delete(clave);
    } else {
      nuevosParams.set(clave, valor);
    }
    setSearchParams(nuevosParams);
  };

  const limpiarTodosLosFiltros = () => {
    setSearchParams({});
  };

  const formatCLP = (value) => {
    if (!value) return "$0 CLP";
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0
    }).format(value);
  };

  const handleVerPublicaciones = (cardId) => {
    if (cardId) navigate(`/card/${cardId}`);
  };

  const getBtnEstilo = (activo) => ({
    ...estilos.btnFiltro,
    border: activo ? "1px solid #2563eb" : "1px solid #cbd5e1",
    background: activo ? "#2563eb" : "#ffffff",
    color: activo ? "#ffffff" : "#475569"
  });

  return (
    <main style={estilos.main}>
      <header style={estilos.header}>
        <h1 style={estilos.mainTitle}>MERCADO GLOBAL</h1>
        <p style={estilos.subtitle}>Busca cartas oficiales y explora las ofertas disponibles en la comunidad</p>
      </header>

      <div style={estilos.filterBar}>
        <div style={estilos.mb15}>
          <span style={estilos.filterLabel}>FILTRAR POR CLASIFICACIÓN:</span>
          <div style={estilos.flexWrapGap}>
            <button onClick={() => handleFiltro("categorias", "TODOS")} style={getBtnEstilo(!categoriasParam)}>✨ Todos</button>
            <button onClick={() => handleFiltro("categorias", "Basico")} style={getBtnEstilo(categoriasParam === "Basico")}>🃏 Básico</button>
            <button onClick={() => handleFiltro("categorias", "Fase 1")} style={getBtnEstilo(categoriasParam === "Fase 1")}>🔺 Fase 1</button>
            <button onClick={() => handleFiltro("categorias", "Fase 2")} style={getBtnEstilo(categoriasParam === "Fase 2")}>🔥 Fase 2</button>
            <button onClick={() => handleFiltro("categorias", "ex")} style={getBtnEstilo(categoriasParam === "ex")}>✨ ex</button>
            <button onClick={() => handleFiltro("categorias", "V")} style={getBtnEstilo(categoriasParam === "V")}>⚡ Pokémon V</button>
            <button onClick={() => handleFiltro("categorias", "VMAX")} style={getBtnEstilo(categoriasParam === "VMAX")}>💥 VMAX</button>
            <button onClick={() => handleFiltro("categorias", "Trainer")} style={getBtnEstilo(categoriasParam === "Trainer")}>🛡️ Entrenadores</button>
            <button onClick={() => handleFiltro("categorias", "Energia")} style={getBtnEstilo(categoriasParam === "Energia")}>🔋 Energías</button>
          </div>
        </div>

        <div style={estilos.flexDropdownsRow}>
          <div style={estilos.flexSelectContainer}>
            <label style={estilos.selectLabel}>ESTADO FISICO (IA):</label>
            <select 
              value={estadoParam || "TODOS"} 
              onChange={(e) => handleFiltro("estado", e.target.value)}
              style={estilos.select}
            >
              <option value="TODOS">Cualquier estado</option>
              <option value="Near Mint">Near Mint (NM)</option>
              <option value="Lightly Played">Lightly Played (LP)</option>
              <option value="Moderately Played">Moderately Played (MP)</option>
            </select>
          </div>

          <div style={estilos.flexSelectContainer}>
            <label style={estilos.selectLabel}>ORDENAR POR:</label>
            <select 
              value={ordenarParam || "TODOS"} 
              onChange={(e) => handleFiltro("ordenar", e.target.value)}
              style={estilos.select}
            >
              <option value="TODOS">Más recientes primero</option>
              <option value="precio_asc">Menor precio</option>
              <option value="precio_desc">Mayor precio</option>
              <option value="score_desc">Mejor valoración IA</option>
            </select>
          </div>
        </div>
      </div>

      {loading && <div style={estilos.loadingBox}>🔄 Sincronizando mercado global...</div>}
      {error && <div style={estilos.errorBox}>❌ {error}</div>}
      
      {!loading && !error && posts.length === 0 && (
        <div style={estilos.emptyBox}>
          <p style={estilos.emptyText}>No se encontraron cartas con los filtros seleccionados.</p>
          <button onClick={limpiarTodosLosFiltros} style={estilos.btnReset}>Restablecer filtros</button>
        </div>
      )}

      <section style={estilos.gridContainer}>
        {!loading && !error && posts.map((post) => {
          const imagenOficial = post.cardImage || "https://via.placeholder.com/200x280?text=No+Card+Image";
          
          return (
            <div 
              key={post.id} 
              onClick={() => handleVerPublicaciones(post.cardId)}
              style={estilos.cardContainer}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
              }}
            >
              <div style={estilos.cardImgBox}>
                <img src={imagenOficial} alt={post.nombre} style={estilos.cardImg} />
                <span style={estilos.tagCategory}>
                  {post.card?.categoriaCarta || "Pokémon"}
                </span>
              </div>

              <div style={estilos.cardBody}>
                <div>
                  <h3 style={estilos.cardTitle}>{post.nombre}</h3>
                  <p style={estilos.cardSubtitle}>
                    {post.edicion || "Base Set"} • #{post.numero || "N/A"}
                  </p>
                </div>
                
                <div style={estilos.cardFooter}>
                  <div style={estilos.priceBox}>
                    <span style={estilos.priceLabel}>DESDE:</span>
                    <span style={estilos.priceValue}>{formatCLP(post.precio)}</span>
                  </div>
                  <span style={estilos.tagScore}>
                    ⭐ IA: {post.score || 0}/10
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
};

const estilos = {
  main: { padding: "30px 20px", maxWidth: "1200px", margin: "0 auto", fontFamily: "sans-serif" },
  header: { textAlign: "center", marginBottom: "40px" },
  mainTitle: { fontSize: "2.3rem", fontWeight: "800", color: "#0f172a", letterSpacing: "0.5px", margin: 0 },
  subtitle: { color: "#64748b", marginTop: "8px", fontSize: "1rem" },
  filterBar: { background: "#f8fafc", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "35px" },
  mb15: { marginBottom: "15px" },
  filterLabel: { fontSize: "13px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "8px", textAlign: "left" },
  flexWrapGap: { display: "flex", gap: "10px", flexWrap: "wrap" },
  btnFiltro: { padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px", transition: "all 0.15s ease" },
  flexDropdownsRow: { display: "flex", gap: "20px", flexWrap: "wrap", borderTop: "1px solid #e2e8f0", paddingTop: "15px" },
  flexSelectContainer: { flex: "1", minWidth: "200px", textAlign: "left" },
  selectLabel: { fontSize: "13px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "6px" },
  select: { width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#fff", fontWeight: "500", fontSize: "14px", boxSizing: "border-box" },
  loadingBox: { textAlign: "center", padding: "40px", fontSize: "1.1rem", color: "#64748b" },
  errorBox: { textAlign: "center", padding: "15px", background: "#fef2f2", color: "#991b1b", borderRadius: "8px", border: "1px solid #fee2e2" },
  emptyBox: { textAlign: "center", padding: "50px", color: "#64748b", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" },
  emptyText: { fontSize: "1.1rem", margin: 0 },
  btnReset: { marginTop: "15px", padding: "10px 20px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
  gridContainer: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "24px" },
  cardContainer: { border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden", background: "#ffffff", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", transition: "transform 0.2s ease, box-shadow 0.2s ease", cursor: "pointer", display: "flex", flexDirection: "column" },
  cardImgBox: { height: "260px", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", position: "relative", borderBottom: "1px solid #f1f5f9" },
  cardImg: { maxHeight: "100%", maxWidth: "100%", objectFit: "contain" },
  tagCategory: { position: "absolute", bottom: "12px", left: "12px", fontSize: "10px", fontWeight: "700", color: "#1e40af", background: "#dbeafe", padding: "4px 8px", borderRadius: "6px" },
  cardBody: { padding: "16px", textAlign: "left", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" },
  cardTitle: { margin: "0 0 4px 0", fontSize: "16px", fontWeight: "700", color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  cardSubtitle: { color: "#64748b", margin: "0 0 12px 0", fontSize: "13px", fontWeight: "500" },
  cardFooter: { display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: "12px" },
  priceBox: { display: "flex", flexDirection: "column" },
  priceLabel: { fontSize: "11px", color: "#94a3b8", fontWeight: "600" },
  priceValue: { fontSize: "16px", fontWeight: "700", color: "#b91c1c" },
  tagScore: { fontSize: "11px", fontWeight: "700", color: "#166534", background: "#dcfce7", padding: "4px 8px", borderRadius: "6px" }
};

export default Catalog;