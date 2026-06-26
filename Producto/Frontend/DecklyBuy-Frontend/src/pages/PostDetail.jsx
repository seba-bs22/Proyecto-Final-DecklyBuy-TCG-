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

const PostDetail = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enviandoChat, setEnviandoChat] = useState(false); // Estado para evitar doble clic

  // 🔎 OJO: Aquí debes obtener el ID real del usuario que está navegando (comprador)
  // Puedes traerlo de tu AuthContext o localStorage. Dejo un fallback por si acaso:
  const usuarioActualId = localStorage.getItem("userId") || "TU_UUID_LOGUEADO_AQUI";

  useEffect(() => {
    const fetchPostDetail = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://localhost:8080/api/posts/${id}`, {
          method: "GET",
          credentials: "include"
        });

        if (!response.ok) {
          navigate("/"); 
          return;
        }

        const result = await response.json();
        setPost(result.data || result.dataResponse || result);
      } catch (error) {
        console.error("Error al conectar con el servidor:", error);
      } finally {
        loading && setLoading(false);
      }
    };

    if (id) fetchPostDetail();
  }, [id, navigate]);

  // 🚀 NUEVA FUNCIÓN: Abre o crea el chat e interactúa con tu backend de Java
  const handleContactarVendedor = async () => {
    if (!idVendedorFinal) {
      alert("No se pudo identificar al vendedor.");
      return;
    }
    
    if (usuarioActualId === idVendedorFinal) {
      alert("¡No puedes abrir un chat contigo mismo!");
      return;
    }

    setEnviandoChat(true);
    try {
      const response = await fetch('http://localhost:8080/api/chat/sala', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          compradorId: usuarioActualId,
          vendedorId: idVendedorFinal
        }),
      });

      if (response.ok) {
        // Redirige directo a la bandeja de entrada que acabamos de armar
        navigate('/messages');
      } else {
        console.error("Error del servidor al crear la sala");
      }
    } catch (error) {
      console.error("Error de red al crear la sala de chat:", error);
    } finally {
      setEnviandoChat(false);
    }
  };

  const formatCLP = (value) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0
    }).format(value || 0);
  };

  if (loading) return <div style={estilos.fallback}>🔄 Cargando detalles de la publicación...</div>;
  if (!post) return <div style={estilos.fallback}>⚠️ No se encontró la publicación.</div>;

  const cardName = post.card?.nombre || post.nombre || "Carta Pokémon";
  const cardIdLocal = post.card?.id || post.cardId || "N/A";
  const cardEdition = post.card?.edicion || post.edicion || "Colección Base";
  const cardNumero = post.card?.numero || post.numero || "N/A";
  const estado = post.estadoDetectado || "NM";
  
  const idVendedorFinal = post.userId || post.user?.id || post.vendedor?.id;
  const nombreVendedor = post.nombreUsuario || post.user?.nombreUsuario || "Vendedor Deckly";
  const fotoVendedor = post.fotoPerfil || post.user?.fotoPerfil;

  return (
    <main style={{ padding: "30px 20px", maxWidth: "1100px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <button onClick={() => navigate(-1)} style={estilos.btnVolver}>
        ← Volver al listado
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "40px", alignItems: "start" }}>
        <div style={estilos.imgContainer}>
          <img 
            src={post.imagenUrl || "/img/placeholder.jpg"} 
            alt={cardName} 
            style={estilos.img} 
          />
        </div>

        <div style={{ textAlign: "left" }}>
          <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
            <span style={estilos.badgeCategory}>POKÉMON • {post.categoriaCarta?.toUpperCase() || "TCG"}</span>
            <span style={estilos.badgeCondition}>CONDICIÓN: {estado.toUpperCase()}</span>
          </div>

          <h1 style={estilos.mainTitle}>{cardName}</h1>
          <p style={estilos.subtitle}>Edición: <strong>{cardEdition}</strong> (#{cardNumero})</p>

          <div style={estilos.priceBox}>
            <span style={{ fontSize: "13px", color: "#991b1b", fontWeight: "600", display: "block", marginBottom: "4px" }}>Precio de Venta</span>
            <span style={{ fontSize: "2rem", fontWeight: "800", color: "#b91c1c" }}>{formatCLP(post.precio)}</span>
          </div>

          <div style={{ marginBottom: "28px" }}>
            <h3 style={estilos.sectionTitle}>Descripción del vendedor</h3>
            <p style={estilos.descriptionText}>
              {post.descripcion || "El vendedor no ha añadido una descripción para esta publicación."}
            </p>
          </div>

          <div style={{ border: "1px solid #e2e8f0", borderRadius: "12px", padding: "16px", marginBottom: "28px" }}>
            <h3 style={estilos.sectionTitle}>Ficha de Verificación</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px" }}>
              <div style={estilos.row}>
                <span style={{ color: "#64748b" }}>Idioma:</span>
                <span style={{ fontWeight: "600", color: "#0f172a" }}>{MAPA_IDIOMAS[post.idioma] || post.idioma}</span>
              </div>
              <div style={estilos.row}>
                <span style={{ color: "#64748b" }}>Código de Catálogo:</span>
                <span style={{ fontFamily: "monospace", fontWeight: "600", color: "#0f172a" }}>{cardIdLocal}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#64748b" }}>Puntuación de Estado (IA Centering):</span>
                <span style={{ 
                  backgroundColor: post.score >= 8 ? "#dcfce7" : "#fef9c3", 
                  color: post.score >= 8 ? "#15803d" : "#a16207", 
                  padding: "2px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "700" 
                }}>{post.score || 0} / 10</span>
              </div>
            </div>
          </div>

          <div style={estilos.vendorBox}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={estilos.avatar}>
                {fotoVendedor ? (
                  <img 
                    src={fotoVendedor.replace("http://", "https://")} 
                    alt={nombreVendedor} 
                    referrerPolicy="no-referrer" 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement.innerText = nombreVendedor.charAt(0).toUpperCase();
                    }}
                  />
                ) : (
                  nombreVendedor.charAt(0).toUpperCase()
                )}
              </div>
              
              <div>
                <span style={{ fontSize: "12px", color: "#64748b", display: "block" }}>Publicado por</span>
                <Link to={`/vendedor/${idVendedorFinal}`} style={{ fontSize: "15px", fontWeight: "700", color: "#2563eb", textDecoration: "none" }}>
                  {nombreVendedor}
                </Link>
              </div>
            </div>
            
            {/* 🛠️ CAMBIO AQUÍ: Ahora es un botón controlado por React que inicia el chat interno */}
            <button 
              onClick={handleContactarVendedor}
              disabled={enviandoChat}
              style={estilos.btnChatInterno}
            >
              {enviandoChat ? "⏳ Creando sala..." : "💬 Chat Interno"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

const estilos = {
  fallback: { textAlign: "center", padding: "50px", color: "#64748b" },
  btnVolver: { background: "none", border: "none", color: "#2563eb", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px", fontSize: "14px" },
  imgContainer: { background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "24px", display: "flex", justifyContent: "center", alignItems: "center", height: "450px", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" },
  img: { maxHeight: "100%", maxWidth: "100%", objectFit: "contain", borderRadius: "8px" },
  badgeCategory: { fontSize: "11px", fontWeight: "700", color: "#64748b", background: "#f1f5f9", padding: "4px 8px", borderRadius: "4px", letterSpacing: "0.5px" },
  badgeCondition: { fontSize: "11px", fontWeight: "700", color: "#1e293b", background: "#fef9c3", padding: "4px 8px", borderRadius: "4px" },
  mainTitle: { fontSize: "2.2rem", fontWeight: "800", color: "#0f172a", margin: "0 0 8px 0" },
  subtitle: { fontSize: "15px", color: "#64748b", margin: "0 0 24px 0" },
  priceBox: { background: "#fef2f2", padding: "16px 20px", borderRadius: "12px", border: "1px solid #fee2e2", marginBottom: "24px" },
  sectionTitle: { fontSize: "15px", color: "#0f172a", fontWeight: "700", margin: "0 0 12px 0" },
  descriptionText: { fontSize: "14px", color: "#334155", lineHeight: "1.6", background: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0", margin: 0, whiteSpace: "pre-line" },
  row: { display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "6px" },
  vendorBox: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" },
  avatar: { width: "45px", height: "45px", borderRadius: "50%", background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", color: "#fff", fontWeight: "700", overflow: "hidden", flexShrink: 0 },
  // Estilo del botón del chat (reutiliza el color azul de Deckly para que combine impecable)
  btnChatInterno: { background: "#2563eb", color: "#fff", padding: "10px 16px", borderRadius: "8px", fontWeight: "600", border: "none", cursor: "pointer", fontSize: "14px", display: "inline-block", transition: "background 0.2s" }
};

export default PostDetail;