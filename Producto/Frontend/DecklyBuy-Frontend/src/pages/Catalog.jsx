import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Capturamos los diferentes parámetros de la URL
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
          setPosts(result.data || []);
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

  // Manejo de filtros rápidos combinados
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

  // Formateador chileno a CLP
  const formatCLP = (value) => {
    if (!value) return "$0 CLP";
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0
    }).format(value);
  };

  // CORREGIDO: Redirección directa al template oficial de la app
  const handleVerPublicaciones = (cardId) => {
    if (cardId) {
      navigate(`/card/${cardId}`); // <-- Ruta limpia del frontend
    }
  };

  return (
    <main className="catalog-page" style={{ padding: "30px 20px", maxWidth: "1200px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <header style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "2.3rem", fontWeight: "800", color: "#0f172a", letterSpacing: "0.5px", margin: 0 }}>MERCADO GLOBAL</h1>
        <p style={{ color: "#64748b", marginTop: "8px", fontSize: "1rem" }}>Busca cartas oficiales y explora las ofertas disponibles en la comunidad</p>
      </header>

      {/* BARRA DE FILTROS AVANZADOS Y COMBINADOS */}
      <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "35px" }}>
        {/* 1. Categorías de Cartas */}
        <div style={{ marginBottom: "15px" }}>
          <span style={{ fontSize: "13px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "8px", textAlign: "left" }}>FILTRAR POR TIPO/FASE:</span>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button onClick={() => handleFiltro("categorias", "TODOS")} style={btnEstilo(!categoriasParam)}>✨ Todos</button>
            <button onClick={() => handleFiltro("categorias", "Basico,Fase 1,Fase 2")} style={btnEstilo(categoriasParam === "Basico,Fase 1,Fase 2")}>🃏 Básicos / Fases</button>
            <button onClick={() => handleFiltro("categorias", "ex,V,VMAX")} style={btnEstilo(categoriasParam === "ex,V,VMAX")}>🔥 ex / V / VMAX</button>
            <button onClick={() => handleFiltro("categorias", "Trainer")} style={btnEstilo(categoriasParam === "Trainer")}>🛡️ Entrenadores</button>
          </div>
        </div>

        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", borderTop: "1px solid #e2e8f0", paddingTop: "15px" }}>
          {/* 2. Filtro por Estado de IA */}
          <div style={{ flex: "1", minWidth: "200px", textAlign: "left" }}>
            <label style={{ fontSize: "13px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "6px" }}>ESTADO FISICO (IA):</label>
            <select 
              value={estadoParam || "TODOS"} 
              onChange={(e) => handleFiltro("estado", e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#fff", fontWeight: "500", fontSize: "14px" }}
            >
              <option value="TODOS">Cualquier estado</option>
              <option value="Near Mint">Near Mint (NM)</option>
              <option value="Lightly Played">Lightly Played (LP)</option>
              <option value="Moderately Played">Moderately Played (MP)</option>
            </select>
          </div>

          {/* 3. Filtro por Ordenación de Precio */}
          <div style={{ flex: "1", minWidth: "200px", textAlign: "left" }}>
            <label style={{ fontSize: "13px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "6px" }}>ORDENAR POR:</label>
            <select 
              value={navbarParam => ordenarParam || "TODOS"} 
              onChange={(e) => handleFiltro("ordenar", e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#fff", fontWeight: "500", fontSize: "14px" }}
            >
              <option value="TODOS">Más recientes primero</option>
              <option value="precio_asc">Menor precio</option>
              <option value="precio_desc">Mayor precio</option>
              <option value="score_desc">Mejor valoración IA</option>
            </select>
          </div>
        </div>
      </div>

      {/* ESTADOS DE CARGA Y ERRORES */}
      {loading && <div style={{ textAlign: "center", padding: "40px", fontSize: "1.1rem", color: "#64748b" }}>🔄 Sincronizando mercado global...</div>}
      {error && <div style={{ textAlign: "center", padding: "15px", background: "#fef2f2", color: "#991b1b", borderRadius: "8px", border: "1px solid #fee2e2" }}>❌ {error}</div>}
      
      {!loading && !error && posts.length === 0 && (
        <div style={{ textAlign: "center", padding: "50px", color: "#64748b", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
          <p style={{ fontSize: "1.1rem", margin: 0 }}>No se encontraron cartas con los filtros seleccionados.</p>
          <button onClick={limpiarTodosLosFiltros} style={{ marginTop: "15px", padding: "10px 20px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>Restablecer filtros</button>
        </div>
      )}

      {/* CUADRÍCULA CUADRADA DEL CATÁLOGO RESPONSIVO */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "24px" }}>
        {!loading && !error && posts.map((post) => {
          const imagenOficial = post.cardImage || "https://via.placeholder.com/200x280?text=No+Card+Image";
          
          return (
            <div 
              key={post.id} 
              onClick={() => handleVerPublicaciones(post.cardId)}
              style={{ 
                border: "1px solid #e2e8f0", 
                borderRadius: "12px", 
                overflow: "hidden", 
                background: "#ffffff", 
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)", 
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
              }}
            >
              {/* Contenedor imagen oficial */}
              <div style={{ height: "260px", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", position: "relative", borderBottom: "1px solid #f1f5f9" }}>
                <img 
                  src={imagenOficial} 
                  alt={post.nombre} 
                  style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }} 
                />
                <span style={{ position: "absolute", bottom: "12px", left: "12px", fontSize: "10px", fontWeight: "700", color: "#1e40af", background: "#dbeafe", padding: "4px 8px", borderRadius: "6px" }}>
                  {post.categoriaCarta || "Pokémon"}
                </span>
              </div>

              {/* Contenido alineado */}
              <div style={{ padding: "16px", textAlign: "left", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: "700", color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {post.nombre}
                  </h3>
                  <p style={{ color: "#64748b", margin: "0 0 12px 0", fontSize: "13px", fontWeight: "500" }}>
                    {post.edicion || "Base Set"} • #{post.numero || "N/A"}
                  </p>
                </div>
                
                {/* Precios locales e IA */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: "12px" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600" }}>DESDE:</span>
                    <span style={{ fontSize: "16px", fontWeight: "700", color: "#b91c1c" }}>
                      {formatCLP(post.precio)}
                    </span>
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "#166534", background: "#dcfce7", padding: "4px 8px", borderRadius: "6px" }}>
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

const btnEstilo = (activo) => ({
  padding: "8px 16px",
  borderRadius: "8px",
  border: activo ? "1px solid #2563eb" : "1px solid #cbd5e1",
  background: activo ? "#2563eb" : "#ffffff",
  color: activo ? "#ffffff" : "#475569",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "13px",
  transition: "all 0.15s ease"
});

export default Catalog;