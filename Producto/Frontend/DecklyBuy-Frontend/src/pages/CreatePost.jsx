import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const navigate = useNavigate();

  // Estados de carga de archivos y vista previa
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Estados para almacenar la información directa de la API de TCGDex
  const [apiSets, setApiSets] = useState([]);
  const [apiCards, setApiCards] = useState([]);
  const [selectedSetId, setSelectedSetId] = useState("");
  const [currentSetDetails, setCurrentSetDetails] = useState(null);

  // Estado para la vista previa de la imagen oficial de la API
  const [apiImagePreview, setApiImagePreview] = useState(null);

  // Estados del formulario de la carta (Campos propios de la oferta de venta)
  const [formData, setFormData] = useState({
    precio: "",
    categoriaCarta: "", 
    descripcion: ""
  });

  // Estados espejo solo para pintar la interfaz visualmente
  const [uiFields, setUiFields] = useState({
    nombre: "",
    edicion: "",
    numero: ""
  });

  // Estado para empaquetar el objeto relacional 'card' que espera el Backend
  const [cardDataForBackend, setCardDataForBackend] = useState(null);

  // Estados del servicio de inteligencia artificial y modales
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [modal, setModal] = useState(null);

  // Cargar expansiones (Sets) al abrir la página por primera vez
  useEffect(() => {
    fetch("https://api.tcgdex.net/v2/es/sets")
      .then((res) => res.json())
      .then((data) => setApiSets(data))
      .catch((err) => console.error("Error al obtener sets de la API:", err));
  }, []);

  // Cargar cartas automáticamente cuando el usuario seleccione un set
  useEffect(() => {
    if (!selectedSetId) {
      setApiCards([]);
      setCurrentSetDetails(null);
      setApiImagePreview(null);
      return;
    }
    
    fetch(`https://api.tcgdex.net/v2/en/sets/${selectedSetId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error en respuesta: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.cards) {
          setApiCards(data.cards);
          setCurrentSetDetails(data);
        } else {
          setApiCards([]);
          setCurrentSetDetails(null);
        }
      })
      .catch((err) => {
        console.error("Error al obtener cartas del set:", err);
        setApiCards([]);
        setCurrentSetDetails(null);
      });
  }, [selectedSetId]);

  // Manejo de seleccion de archivos
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setAnalysisResult(null);
  };

  // Manejo de cambios en los inputs del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Manejar la selección final de la carta específica en el dropdown
  const handleCardSelection = (cardId) => {
    if (!cardId) {
      setCardDataForBackend(null);
      setApiImagePreview(null);
      setUiFields({ nombre: "", edicion: "", numero: "" });
      return;
    }

    const cardBrief = apiCards.find((c) => c.id === cardId);
    const currentSetBrief = apiSets.find((s) => s.id === selectedSetId);

    if (cardBrief) {
      const numeroBase = cardBrief.localId || cardBrief.id.split("-").pop();
      const totalCartas = currentSetDetails?.cardCount?.official || currentSetDetails?.cardCount || "";
      const numeroCombinado = totalCartas ? `${numeroBase}/${totalCartas}` : numeroBase;
      
      const oficialImgUrl = cardBrief.image ? `${cardBrief.image}/high.png` : null;
      setApiImagePreview(oficialImgUrl);

      setUiFields({
        nombre: cardBrief.name,
        edicion: currentSetBrief ? currentSetBrief.name : "",
        numero: numeroCombinado
      });

      setCardDataForBackend({
        id: cardBrief.id,
        name: cardBrief.name,
        edicion: currentSetBrief ? currentSetBrief.name : "",
        localId: numeroCombinado,
        image: oficialImgUrl || ""
      });
    }
  };

  // Peticion al servicio de analisis de IA
  const handleAnalyze = async () => {
    if (!selectedImage) {
      setModal({ valid: false, mensaje: "Debes subir una imagen antes de analizarla." });
      return;
    }
    setAnalyzing(true);
    try {
      const data = new FormData();
      data.append("file", selectedImage);
      
      const response = await fetch("https://localhost:5000/api/ia/detect-score", {
        method: "POST",
        body: data,
        credentials: "include"
      });
      
      const result = await response.json();
      
      if (response.ok && result.valid) {
        setAnalysisResult(result);
        setModal({ valid: true, mensaje: result.mensaje || "Analisis completado con exito." });
      } else {
        setAnalysisResult(null);
        setModal({ valid: false, mensaje: result.mensaje || "La imagen no pudo ser validada por la IA." });
      }
    } catch (error) {
      console.error("Error al analizar imagen:", error);
      setAnalysisResult(null);
      setModal({ valid: false, mensaje: "No se pudo conectar con el servicio de analisis." });
    } finally {
      setAnalyzing(false);
    }
  };

  // Proceso de subida de imagen e impacto en base de datos
  const handlePublish = async () => {
    if (!selectedImage) {
      setModal({ valid: false, mensaje: "Debes subir una imagen antes de publicar." });
      return;
    }
    
    if (!formData.precio || !formData.categoriaCarta || !formData.descripcion) {
      setModal({ valid: false, mensaje: "Todos los campos de la publicación son obligatorios." });
      return;
    }
    
    if (!analysisResult) {
      setModal({ valid: false, mensaje: "Debes analizar la imagen antes de publicar." });
      return;
    }

    if (!cardDataForBackend) {
      setModal({ valid: false, mensaje: "Debes seleccionar una carta válida de la lista oficial." });
      return;
    }

    try {
      const data = new FormData();
      data.append("file", selectedImage);
      
      const uploadResponse = await fetch("https://localhost:8080/api/upload", {
        method: "POST",
        body: data,
        credentials: "include"
      });

      if (!uploadResponse.ok) {
        const uploadErr = await uploadResponse.json();
        setModal({ valid: false, mensaje: uploadErr.error || uploadErr.mensaje || "Error al subir la imagen al servidor." });
        return;
      }

      const uploadJson = await uploadResponse.json();
      const imageUrl = uploadJson.url; 

      // ─── OBJETO SINCRONIZADO CON LOS TIPOS DE DATOS EXACTOS DE JAVA ───
      const postData = {
        precio: parseFloat(formData.precio), 
        categoriaCarta: formData.categoriaCarta,
        descripcion: formData.descripcion,
        estadoDetectado: analysisResult.estado ? String(analysisResult.estado) : null,
        score: analysisResult.score ? parseInt(analysisResult.score, 10) : null, 
        confidence: analysisResult.confidence ? parseFloat(analysisResult.confidence) : null, 
        imagenUrl: imageUrl,
        card: {
          id: String(cardDataForBackend.id),
          name: String(cardDataForBackend.name),
          edicion: cardDataForBackend.edicion ? String(cardDataForBackend.edicion) : null,
          localId: cardDataForBackend.localId ? String(cardDataForBackend.localId) : null,
          image: cardDataForBackend.image ? String(cardDataForBackend.image) : null
        }
      };

      const response = await fetch("https://localhost:8080/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
        credentials: "include"
      });

      if (response.ok) {
        setModal({ valid: true, mensaje: "Publicacion creada con exito." });
        setTimeout(() => {
          navigate("/posts");
        }, 1500);
      } else {
        const textData = await response.text();
        let errorMessage = "Error al crear la publicacion.";
        try {
          const errJson = JSON.parse(textData);
          errorMessage = errJson.error || errJson.mensaje || errorMessage;
        } catch (e) {
          if (textData) errorMessage = textData;
        }
        setModal({ valid: false, mensaje: errorMessage });
      }
    } catch (error) {
      console.error("Error al publicar:", error);
      setModal({ valid: false, mensaje: "No se pudo conectar con el backend." });
    }
  };

  return (
    <main className="crear-publicacion-page" style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h1 className="crear-publicacion-titulo" style={{ textAlign: "center", marginBottom: "30px" }}>CREAR PUBLICACIÓN</h1>

      {/* ─── BLOQUE 1: INFORMACIÓN OFICIAL DE LA API (FILA SUPERIOR) ─── */}
      <fieldset style={{ border: "2px solid #e0115f", borderRadius: "8px", padding: "20px", marginBottom: "30px", background: "#fff" }}>
        <legend style={{ fontWeight: "bold", color: "#e0115f", padding: "0 10px", fontSize: "1.2rem" }}>1. Información del Catálogo Oficial</legend>
        
        <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
          {/* Lado Izquierdo: Imagen de la API */}
          <div style={{ flex: "1", minWidth: "250px", display: "flex", justifyContent: "center", alignItems: "center", background: "#f5f5f5", borderRadius: "8px", padding: "10px", minHeight: "300px" }}>
            {apiImagePreview ? (
              <img src={apiImagePreview} alt="Carta Oficial" style={{ maxHeight: "300px", objectFit: "contain", borderRadius: "8px" }} />
            ) : (
              <div style={{ textAlign: "center", color: "#888" }}>
                <p style={{ fontSize: "1.5rem", marginBottom: "5px" }}>🎴</p>
                <p>Selecciona una carta para ver la ilustración oficial</p>
              </div>
            )}
          </div>

          {/* Lado Derecho: Desplegables y campos espejo de la API */}
          <div className="form-publicacion" style={{ flex: "2", minWidth: "300px" }}>
            <label style={{ fontWeight: "bold", color: "#e0115f" }}>Buscar Expansión Oficial</label>
            <select
              value={selectedSetId}
              onChange={(e) => {
                setSelectedSetId(e.target.value);
                setCardDataForBackend(null);
                setUiFields({ nombre: "", edicion: "", numero: "" });
              }}
              className="select-categoria-carta"
              style={{ width: "100%", padding: "10px", marginBottom: "15px", background: "#f9f9f9" }}
            >
              <option value="">-- Elige una expansión --</option>
              {apiSets.map((set) => (
                <option key={set.id} value={set.id}>{set.name}</option>
              ))}
            </select>

            <label style={{ fontWeight: "bold", color: "#e0115f" }}>Seleccionar Carta Oficial</label>
            <select
              disabled={!selectedSetId}
              onChange={(e) => handleCardSelection(e.target.value)}
              className="select-categoria-carta"
              style={{ width: "100%", padding: "10px", marginBottom: "15px", background: "#f9f9f9" }}
            >
              <option value="">-- Elige la carta --</option>
              {apiCards.map((carta) => {
                const numBase = carta.localId || carta.id.split("-").pop();
                return (
                  <option key={carta.id} value={carta.id}>
                    N° {numBase} - {carta.name}
                  </option>
                );
              })}
            </select>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "15px" }}>
              <div>
                <label>Nombre de la carta</label>
                <input type="text" value={uiFields.nombre} disabled style={{ width: "100%", padding: "8px", background: "#f0f0f0", color: "#666", border: "1px solid #ccc", borderRadius: "4px" }} />
              </div>
              <div>
                <label>Edición</label>
                <input type="text" value={uiFields.edicion} disabled style={{ width: "100%", padding: "8px", background: "#f0f0f0", color: "#666", border: "1px solid #ccc", borderRadius: "4px" }} />
              </div>
            </div>
            <div style={{ marginTop: "15px" }}>
              <label>Número de Colección</label>
              <input type="text" value={uiFields.numero} disabled style={{ width: "100%", padding: "8px", background: "#f0f0f0", color: "#666", border: "1px solid #ccc", borderRadius: "4px" }} />
            </div>
          </div>
        </div>
      </fieldset>

      {/* ─── BLOQUE 2: DATOS DEL VENDEDOR E IA YOLO (FILA INFERIOR) ─── */}
      <fieldset style={{ border: "2px solid #2575fc", borderRadius: "8px", padding: "20px", marginBottom: "30px", background: "#fff" }}>
        <legend style={{ fontWeight: "bold", color: "#2575fc", padding: "0 10px", fontSize: "1.2rem" }}>2. Tu Publicación y Análisis de Calidad</legend>
        
        <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
          {/* Lado Izquierdo: Tu Foto y Botón de Escaneo */}
          <div className="imagen-publicacion-box" style={{ flex: "1", minWidth: "250px", display: "flex", flexDirection: "column", gap: "15px" }}>
            <div style={{ background: "#f5f5f5", borderRadius: "8px", padding: "10px", minHeight: "300px", display: "flex", justifyContent: "center", alignItems: "center" }}>
              {imagePreview ? (
                <img src={imagePreview} alt="Tu Foto Real" style={{ maxHeight: "300px", objectFit: "contain", borderRadius: "8px" }} />
              ) : (
                <div className="imagen-placeholder" style={{ textAlign: "center", color: "#888" }}>
                  <p style={{ fontSize: "1.5rem" }}>📸</p>
                  <p>Sube una imagen real de tu carta</p>
                </div>
              )}
            </div>
            
            <label className="btn-subir-imagen" style={{ display: "block", textAlign: "center", padding: "10px", background: "#2575fc", color: "#fff", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
              Seleccionar foto real
              <input type="file" accept="image/*" onChange={handleImageChange} hidden required />
            </label>
            
            <button className="btn-analizar-imagen" onClick={handleAnalyze} disabled={analyzing} style={{ width: "100%", padding: "10px", background: analyzing ? "#ccc" : "#e0115f", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}>
              {analyzing ? "Analizando bordes..." : "🔍 Analizar con IA"}
            </button>
          </div>

          {/* Lado Derecho: Campos editables del Post + Outputs de la IA */}
          <div className="form-publicacion" style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <div>
                <label>Precio de Venta ($)</label>
                <input type="number" name="precio" value={formData.precio} onChange={handleChange} required style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
              </div>
              <div>
                <label htmlFor="categoriaCarta">Clasificación Interna</label>
                <select 
                  id="categoriaCarta"
                  name="categoriaCarta" 
                  value={formData.categoriaCarta} 
                  onChange={handleChange} 
                  required
                  className="select-categoria-carta"
                  style={{ width: "100%", padding: "9px", borderRadius: "4px", border: "1px solid #ccc", background: "white", color: "#333" }}
                >
                  <option value="">-- Elige opción --</option>
                  <optgroup label="Pokémon (Línea Estándar)">
                    <option value="Basico">Pokémon Básico</option>
                    <option value="Fase 1">Pokémon Fase 1</option>
                    <option value="Fase 2">Pokémon Fase 2</option>
                  </optgroup>
                  <optgroup label="Pokémon (Especiales / Ultra Raros)">
                    <option value="ex">Pokémon ex</option>
                    <option value="V">Pokémon V</option>
                    <option value="VMAX">Pokémon VMAX</option>
                  </optgroup>
                  <optgroup label="Otros Tipos de Carta">
                    <option value="Trainer">Carta Trainer (Entrenador)</option>
                    <option value="Energia">Energía</option>
                  </optgroup>
                </select>
              </div>
            </div>

            <div style={{ marginTop: "15px" }}>
              <label>Descripción del Estado de la Carta</label>
              <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} required style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px", minHeight: "80px" }} />
            </div>

            {/* Sub-panel interno con los datos devueltos por YOLO */}
            <div style={{ marginTop: "20px", padding: "15px", background: "#f4f7fe", borderRadius: "6px", border: "1px dashed #2575fc" }}>
              <h4 style={{ margin: "0 0 10px 0", color: "#2575fc" }}>Resultados del Escaneo YOLO</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "0.85rem", color: "#555" }}>Estado Detectado</label>
                  <input type="text" value={analysisResult?.estado || "Esperando..."} disabled style={{ width: "100%", padding: "6px", textAlign: "center", fontWeight: "bold" }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.85rem", color: "#555" }}>Puntuación</label>
                  <input type="text" value={analysisResult ? `${analysisResult.score}/10` : "Esperando..."} disabled style={{ width: "100%", padding: "6px", textAlign: "center", fontWeight: "bold" }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.85rem", color: "#555" }}>Confianza IA</label>
                  <input type="text" value={analysisResult?.confidence || "Esperando..."} disabled style={{ width: "100%", padding: "6px", textAlign: "center", fontWeight: "bold" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </fieldset>

      {/* Botón Principal de Envío */}
      <div className="publicar-contenedor" style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <button className="btn-publicar" onClick={handlePublish} style={{ padding: "15px 60px", fontSize: "1.2rem", fontWeight: "bold", borderRadius: "30px", cursor: "pointer" }}>
          PUBLICAR EN EL MARKETPLACE
        </button>
      </div>

      {/* Modal de Respuestas de Alerta */}
      {modal && (
        <div className="modal-analisis">
          <div className="modal-contenido">
            <div className={modal.valid ? "modal-icono ok" : "modal-icono error"}>
              {modal.valid ? "✓" : "✕"}
            </div>
            <p>{modal.mensaje}</p>
            <button onClick={() => setModal(null)}>Aceptar</button>
          </div>
        </div>
      )}
    </main>
  );
};

export default CreatePost;