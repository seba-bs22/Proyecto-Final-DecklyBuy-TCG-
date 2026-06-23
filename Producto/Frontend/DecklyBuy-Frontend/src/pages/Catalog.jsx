import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Capturamos la categoría que viene de la URL
  const categoriasParam = searchParams.get("categorias");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        // LÓGICA INTELIGENTE: Si hay filtro en la URL, lo enviamos. Si no, pide TODO.
        const url = categoriasParam 
          ? `https://localhost:8080/api/posts?categorias=${categoriasParam}`
          : "https://localhost:8080/api/posts";

        const response = await fetch(url, { credentials: "include" });
        const result = await response.json();

        if (response.ok) {
          // Guardamos las publicaciones ordenadas por fecha desde el backend
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
  }, [categoriasParam]); // Se reactiva automáticamente al cambiar los filtros en caliente

  // FUNCIÓN DE LIMPIEZA Y CAMBIO DE FILTROS EN CALIENTE
  const handleFiltroRapido = (valoresBDString) => {
    if (valoresBDString === "TODOS") {
      setSearchParams({}); // Limpia la URL -> Se activa el useEffect -> Trae todo desde la más reciente
    } else {
      setSearchParams({ categorias: valoresBDString }); // Cambia el filtro sin recargar la página
    }
  };

  return (
    <main className="catalog-page" style={{ padding: "30px 20px", maxWidth: "1200px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <header style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#1a202c", letterSpacing: "1px" }}>MERCADO GLOBAL</h1>
        <p style={{ color: "#718096", marginTop: "5px" }}>Explora las cartas publicadas por la comunidad</p>
      </header>

      {/* BOTONERA DE FILTROS RÁPIDOS */}
      <section className="filtros-rapidos" style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "40px" }}>
        <button onClick={() => handleFiltroRapido("TODOS")} style={btnEstilo(!categoriasParam)}>✨ Todos los posts</button>
        <button onClick={() => handleFiltroRapido("Basico,Fase 1,Fase 2")} style={btnEstilo(categoriasParam === "Basico,Fase 1,Fase 2")}>🃏 Básicos / Fases</button>
        <button onClick={() => handleFiltroRapido("ex,V,VMAX")} style={btnEstilo(categoriasParam === "ex,V,VMAX")}>🔥 ex / V / VMAX</button>
        <button onClick={() => handleFiltroRapido("Trainer")} style={btnEstilo(categoriasParam === "Trainer")}>🛡️ Entrenadores</button>
        <button onClick={() => handleFiltroRapido("Energia")} style={btnEstilo(categoriasParam === "Energia")}>⚡ Energías</button>
      </section>

      {/* ESTADOS DE CARGA Y ERRORES */}
      {loading && (
        <div style={{ textAlign: "center", padding: "40px", fontSize: "1.2rem", color: "#4a5568" }}>
          🔄 Sincronizando con el mercado global...
        </div>
      )}
      
      {error && (
        <div style={{ textAlign: "center", padding: "20px", background: "#fff5f5", color: "#c53030", borderRadius: "8px", border: "1px solid #feb2b2" }}>
          ❌ {error}
        </div>
      )}
      
      {!loading && !error && posts.length === 0 && (
        <div style={{ textAlign: "center", padding: "50px", color: "#718096", background: "#f7fafc", borderRadius: "8px" }}>
          <p style={{ fontSize: "1.2rem" }}>No hay cartas activas en esta categoría en este momento.</p>
          <button onClick={() => handleFiltroRapido("TODOS")} style={{ marginTop: "15px", padding: "8px 16px", background: "#2b6cb0", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>Ver todas las cartas</button>
        </div>
      )}

      {/* CUADRÍCULA DEL CATÁLOGO */}
      <section className="catalog-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "30px" }}>
        {posts.map((post) => (
          <div key={post.id} className="card-item" style={{ border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden", background: "#fff", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", transition: "transform 0.2s" }}>
            
            {/* Imagen de la carta */}
            <div style={{ height: "280px", background: "#edf2f7", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
              <img 
                src={post.imagenUrl || "https://via.placeholder.com/200x280?text=Sin+Imagen"} 
                alt={post.nombre} 
                style={{ height: "100%", width: "100%", objectFit: "contain", padding: "10px" }} 
              />
              <span style={{ position: "absolute", top: "10px", right: "10px", fontSize: "0.75rem", textTransform: "uppercase", fontWeight: "bold", color: "#2b6cb0", background: "#ebf8ff", padding: "4px 8px", borderRadius: "20px", border: "1px solid #bee3f8" }}>
                {post.categoriaCarta}
              </span>
            </div>

            {/* Información de la carta */}
            <div style={{ padding: "20px" }}>
              <h3 style={{ margin: "0 0 6px 0", fontSize: "1.2rem", fontWeight: "bold", color: "#2d3748", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {post.nombre}
              </h3>
              <p style={{ color: "#718096", margin: "0 0 15px 0", fontSize: "0.9rem", fontWeight: "500" }}>
                {post.edicion} • #{post.numero}
              </p>
              
              {/* Precios e Inteligencia Artificial */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #edf2f7", paddingTop: "12px" }}>
                <span style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#2b6cb0" }}>
                  ${post.precio}
                </span>
                <span style={{ fontSize: "0.8rem", fontWeight: "bold", color: "#2f855a", background: "#f0fff4", padding: "4px 8px", borderRadius: "6px", border: "1px solid #c6f6d5" }}>
                  ⭐ IA: {post.score}/10
                </span>
              </div>
            </div>

          </div>
        ))}
      </section>
    </main>
  );
};

// Helper dinámico para los estilos de los botones
const btnEstilo = (activo) => ({
  padding: "10px 20px",
  borderRadius: "25px",
  border: activo ? "2px solid #2b6cb0" : "1px solid #cbd5e0",
  background: activo ? "#2b6cb0" : "#fff",
  color: activo ? "#fff" : "#4a5568",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "0.95rem",
  transition: "all 0.2s ease",
  boxShadow: activo ? "0 4px 6px -1px rgba(43,108,176,0.4)" : "none"
});

export default Catalog;