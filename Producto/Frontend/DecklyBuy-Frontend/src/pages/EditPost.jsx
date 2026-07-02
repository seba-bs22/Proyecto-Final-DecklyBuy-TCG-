import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditPost = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  // 1. Datos informativos de la carta para la vista (Solo Lectura)
  const [cardInfo, setCardInfo] = useState({
    nombre: "",
    edicion: "",
    numero: "",
    imagenUrl: "",
    estadoDetectado: "",
    score: ""
  });

  // 2. Únicos campos editables por el usuario
  const [formData, setFormData] = useState({
    precio: "",
    descripcion: ""
  });
  
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // <-- Estado de tu modal agregado

  useEffect(() => {
    const fetchPostActual = async () => {
      try {
        const response = await fetch(`https://localhost:8080/api/posts/${id}`, {
          method: "GET",
          credentials: "include"
        });
        if (response.ok) {
          const result = await response.json();
          const data = result.data || result;
          
          setCardInfo({
            nombre: data.nombre || "Desconocido",
            edicion: data.edicion || "Colección",
            numero: data.numero || data.cardId || "N/A",
            imagenUrl: data.imagenUrl || "",
            estadoDetectado: data.estadoDetectado || "NM",
            score: data.score || null
          });

          setFormData({
            precio: data.precio || "",
            descripcion: data.descripcion || ""
          });
        } else {
          // Reemplazo de alerta nativa por modal personalizado
          setModal({ 
            valid: false, 
            mensaje: "No se pudo cargar la información de la publicación.",
            onClose: () => navigate("/posts") // Redirecciona al cerrar el modal
          });
        }
      } catch (error) {
        console.error("Error al obtener post para edición:", error);
        setModal({ 
          valid: false, 
          mensaje: "Error de red al intentar obtener los datos del servidor.",
          onClose: () => navigate("/posts")
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPostActual();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleModalClose = () => {
    // Si el modal guardaba una acción específica al cerrarse (como redirigir), la ejecuta
    if (modal?.onClose) {
      modal.onClose();
    }
    setModal(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        precio: parseFloat(formData.precio),
        descripcion: formData.descripcion
      };

      const response = await fetch(`https://localhost:8080/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include"
      });

      if (response.ok) {
        setModal({ 
          valid: true, 
          mensaje: "¡Publicación actualizada con éxito!",
          onClose: () => navigate("/posts") 
        });
      } else {
        const errResult = await response.json();
        setModal({ 
          valid: false, 
          mensaje: `Error: ${errResult.message || "No se pudieron guardar los cambios."}` 
        });
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      setModal({ 
        valid: false, 
        mensaje: "Hubo un problema de conexión para guardar los cambios." 
      });
    }
  };

  if (loading) return <p style={estilos.loading}>Cargando datos de la carta...</p>;

  return (
    <main style={estilos.container}>
      <h2 style={estilos.title}>Editar Publicación</h2>

      {/* Vista de la carta de solo lectura */}
      <div style={estilos.cardSummary}>
        {cardInfo.imagenUrl && (
          <img src={cardInfo.imagenUrl} alt={cardInfo.nombre} style={estilos.thumbnail} />
        )}
        <div style={estilos.summaryDetails}>
          <span style={estilos.badge}>POKÉMON • {cardInfo.estadoDetectado} {cardInfo.score ? `(${cardInfo.score}/10)` : ''}</span>
          <h3 style={estilos.cardTitle}>{cardInfo.nombre}</h3>
          <p style={estilos.cardSubtitle}>{cardInfo.edicion} • #{cardInfo.numero}</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} style={estilos.form}>
        <div style={estilos.disabledGroup}>
          <label style={estilos.label}>
            <strong>Nombre de la Carta:</strong>
            <input type="text" value={cardInfo.nombre} disabled style={estilos.disabledInput} />
          </label>

          <label style={estilos.label}>
            <strong>Edición / Set:</strong>
            <input type="text" value={cardInfo.edicion} disabled style={estilos.disabledInput} />
          </label>
        </div>

        {/* Únicos Inputs Activos */}
        <label style={estilos.label}>
          <strong style={estilos.activeLabel}>Nuevo Precio de Venta ($):</strong>
          <input 
            type="number" 
            name="precio" 
            value={formData.precio} 
            onChange={handleChange} 
            required 
            style={estilos.input} 
            min="1"
          />
        </label>

        <label style={estilos.label}>
          <strong style={estilos.activeLabel}>Modificar Descripción:</strong>
          <textarea 
            name="descripcion" 
            value={formData.descripcion} 
            onChange={handleChange} 
            required 
            rows="4" 
            style={estilos.textarea} 
          />
        </label>

        <div style={estilos.buttonGroup}>
          <button type="submit" style={estilos.btnSubmit}>
            Guardar Cambios
          </button>
          <button type="button" onClick={() => navigate("/posts")} style={estilos.btnCancel}>
            Cancelar
          </button>
        </div>
      </form>

      {/* Renderizado de tu Modal Estético */}
      {modal && (
        <div className="modal-analisis">
          <div className="modal-contenido">
            <div className={modal.valid ? "modal-icono ok" : "modal-icono error"}>
              {modal.valid ? "✓" : "✕"}
            </div>
            <p>{modal.mensaje}</p>
            <button onClick={handleModalClose}>Aceptar</button>
          </div>
        </div>
      )}
    </main>
  );
};

const estilos = {
  loading: { textAlign: "center", marginTop: "50px", fontFamily: "sans-serif", color: "#64748b" },
  container: { maxWidth: "550px", margin: "40px auto", padding: "24px", background: "#fff", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.08)", fontFamily: "sans-serif" },
  title: { textAlign: "left", marginBottom: "20px", color: "#0f172a", fontSize: "22px", fontWeight: "700" },
  cardSummary: { display: "flex", gap: "15px", background: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "20px", alignItems: "center" },
  thumbnail: { width: "65px", height: "90px", objectFit: "contain", borderRadius: "4px", background: "#fff", border: "1px solid #e2e8f0" },
  summaryDetails: { display: "flex", flexDirection: "column", gap: "2px" },
  badge: { fontSize: "11px", fontWeight: "700", color: "#2575fc", textTransform: "uppercase" },
  cardTitle: { margin: 0, fontSize: "16px", fontWeight: "700", color: "#0f172a" },
  cardSubtitle: { margin: 0, fontSize: "13px", color: "#64748b" },
  form: { display: "flex", flexDirection: "column", gap: "18px" },
  disabledGroup: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", opacity: 0.7 },
  label: { display: "flex", flexDirection: "column", fontSize: "13px", color: "#475569", gap: "5px" },
  activeLabel: { color: "#0f172a", fontSize: "14px" },
  input: { width: "100%", padding: "10px", border: "2px solid #cbd5e1", borderRadius: "6px", boxSizing: "border-box", fontSize: "15px", outline: "none" },
  disabledInput: { width: "100%", padding: "10px", border: "1px solid #e2e8f0", background: "#f1f5f9", color: "#94a3b8", borderRadius: "6px", boxSizing: "border-box", cursor: "not-allowed" },
  textarea: { width: "100%", padding: "10px", border: "2px solid #cbd5e1", borderRadius: "6px", resize: "none", boxSizing: "border-box", fontSize: "14px" },
  buttonGroup: { display: "flex", gap: "12px", marginTop: "10px" },
  btnSubmit: { flex: 1, padding: "12px", background: "#2575fc", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "14px" },
  btnCancel: { flex: 1, padding: "12px", background: "#64748b", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "14px" }
};

export default EditPost;