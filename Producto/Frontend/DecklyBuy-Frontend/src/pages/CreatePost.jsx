import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [apiSets, setApiSets] = useState([]);
  const [apiCards, setApiCards] = useState([]);
  const [selectedSetId, setSelectedSetId] = useState("");
  const [currentSetDetails, setCurrentSetDetails] = useState(null);
  const [apiImagePreview, setApiImagePreview] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [modal, setModal] = useState(null);
  const [cardDataForBackend, setCardDataForBackend] = useState(null);

  const [formData, setFormData] = useState({
    precio: "",
    categoriaCarta: "", 
    descripcion: "",
    idioma: "" 
  });

  const [uiFields, setUiFields] = useState({
    nombre: "",
    edicion: "",
    numero: ""
  });

  useEffect(() => {
    fetch("https://api.tcgdex.net/v2/es/sets")
      .then((res) => res.json())
      .then((data) => setApiSets(data))
      .catch((err) => console.error("Error al obtener sets de la API:", err));
  }, []);

  useEffect(() => {
    if (!selectedSetId) {
      setApiCards([]);
      setCurrentSetDetails(null);
      setApiImagePreview(null);
      return;
    }
    
    fetch(`https://api.tcgdex.net/v2/en/sets/${selectedSetId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Error en respuesta: ${res.status}`);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setAnalysisResult(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

  const handlePublish = async () => {
    if (!selectedImage) {
      setModal({ valid: false, mensaje: "Debes subir una imagen antes de publicar." });
      return;
    }
    if (!formData.precio || !formData.categoriaCarta || !formData.descripcion || !formData.idioma) {
      setModal({ valid: false, mensaje: "Todos los campos de la publicación, incluyendo el idioma, son obligatorios." });
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

      const postData = {
        precio: parseFloat(formData.precio), 
        categoriaCarta: formData.categoriaCarta,
        descripcion: formData.descripcion,
        idioma: formData.idioma, 
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
        setTimeout(() => navigate("/posts"), 1500);
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
    <main style={estilos.main}>
      <h1 style={estilos.mainTitle}>CREAR PUBLICACIÓN</h1>

      <fieldset style={estilos.fieldsetCatalog}>
        <legend style={estilos.legendCatalog}>1. Información del Catálogo Oficial</legend>
        <div style={estilos.flexRow}>
          <div style={estilos.imgBoxCatalog}>
            {apiImagePreview ? (
              <img src={apiImagePreview} alt="Carta Oficial" style={estilos.imgCatalog} />
            ) : (
              <div style={estilos.placeholderBox}>
                <p style={estilos.placeholderIcon}>🎴</p>
                <p>Selecciona una carta para ver la ilustración oficial</p>
              </div>
            )}
          </div>

          <div className="form-publicacion" style={estilos.flexFields}>
            <label style={estilos.labelCatalog}>Buscar Expansión Oficial</label>
            <select
              value={selectedSetId}
              onChange={(e) => {
                setSelectedSetId(e.target.value);
                setCardDataForBackend(null);
                setUiFields({ nombre: "", edicion: "", numero: "" });
              }}
              className="select-categoria-carta"
              style={estilos.select}
            >
              <option value="">-- Elige una expansión --</option>
              {apiSets.map((set) => (
                <option key={set.id} value={set.id}>{set.name}</option>
              ))}
            </select>

            <label style={estilos.labelCatalog}>Seleccionar Carta Oficial</label>
            <select
              disabled={!selectedSetId}
              onChange={(e) => handleCardSelection(e.target.value)}
              className="select-categoria-carta"
              style={estilos.select}
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

            <div style={estilos.gridHalf}>
              <div>
                <label>Nombre de la carta</label>
                <input type="text" value={uiFields.nombre} disabled style={estilos.disabledInput} />
              </div>
              <div>
                <label>Edición</label>
                <input type="text" value={uiFields.edicion} disabled style={estilos.disabledInput} />
              </div>
            </div>
            <div style={estilos.mt15}>
              <label>Número de Colección</label>
              <input type="text" value={uiFields.numero} disabled style={estilos.disabledInput} />
            </div>
          </div>
        </div>
      </fieldset>

      <fieldset style={estilos.fieldsetSeller}>
        <legend style={estilos.legendSeller}>2. Tu Publicación y Análisis de Calidad</legend>
        <div style={estilos.flexRow}>
          <div className="imagen-publicacion-box" style={estilos.flexImageSeller}>
            <div style={estilos.imgBoxSeller}>
              {imagePreview ? (
                <img src={imagePreview} alt="Tu Foto Real" style={estilos.imgCatalog} />
              ) : (
                <div style={estilos.placeholderBox}>
                  <p style={estilos.placeholderIcon}>📸</p>
                  <p>Sube una imagen real de tu carta</p>
                </div>
              )}
            </div>
            
            <label style={estilos.btnUploadImage}>
              Seleccionar foto real
              <input type="file" accept="image/*" onChange={handleImageChange} hidden required />
            </label>
            
            <button 
              className="btn-analizar-imagen" 
              onClick={handleAnalyze} 
              disabled={analyzing} 
              style={{ ...estilos.btnAnalyze, background: analyzing ? "#ccc" : "#e0115f" }}
            >
              {analyzing ? "Analizando bordes..." : "🔍 Analizar con IA"}
            </button>
          </div>

          <div className="form-publicacion" style={estilos.flexFields}>
            <div style={estilos.gridThird}>
              <div>
                <label>Precio de Venta ($)</label>
                <input type="number" name="precio" value={formData.precio} onChange={handleChange} required style={estilos.textInput} />
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
                  style={estilos.selectSeller}
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

              <div>
                <label htmlFor="idioma">Idioma Oficial</label>
                <select 
                  id="idioma"
                  name="idioma" 
                  value={formData.idioma} 
                  onChange={handleChange} 
                  required
                  style={estilos.selectSeller}
                >
                  <option value="">-- Selecciona --</option>
                  <option value="Español">Español 🇪🇸</option>
                  <option value="Inglés">Inglés 🇺🇸</option>
                  <option value="Japonés">Japonés 🇯🇵</option>
                  <option value="Alemán">Alemán 🇩🇪</option>
                  <option value="Francés">Francés 🇫🇷</option>
                  <option value="Italiano">Italiano 🇮🇹</option>
                  <option value="Coreano">Coreano 🇰🇷</option>
                </select>
              </div>
            </div>

            <div style={estilos.mt15}>
              <label>Descripción del Estado de la Carta</label>
              <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} required style={estilos.textarea} />
            </div>

            <div style={estilos.yoloPanel}>
              <h4 style={estilos.yoloTitle}>Resultados del Escaneo YOLO</h4>
              <div style={estilos.gridThird}>
                <div>
                  <label style={estilos.yoloLabel}>Estado Detectado</label>
                  <input type="text" value={analysisResult?.estado || "Esperando..."} disabled style={estilos.yoloInput} />
                </div>
                <div>
                  <label style={estilos.yoloLabel}>Puntuación</label>
                  <input type="text" value={analysisResult ? `${analysisResult.score}/10` : "Esperando..."} disabled style={estilos.yoloInput} />
                </div>
                <div>
                  <label style={estilos.yoloLabel}>Confianza IA</label>
                  <input type="text" value={analysisResult?.confidence || "Esperando..."} disabled style={estilos.yoloInput} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </fieldset>

      <div className="publicar-contenedor" style={estilos.submitContainer}>
        <button className="btn-publicar" onClick={handlePublish} style={estilos.btnPublish}>
          PUBLICAR EN EL MARKETPLACE
        </button>
      </div>

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

const estilos = {
  main: { maxWidth: "1200px", margin: "0 auto", padding: "20px", fontFamily: "sans-serif" },
  mainTitle: { textAlign: "center", marginBottom: "30px", color: "#0f172a" },
  fieldsetCatalog: { border: "2px solid #e0115f", borderRadius: "8px", padding: "20px", marginBottom: "30px", background: "#fff" },
  legendCatalog: { fontWeight: "bold", color: "#e0115f", padding: "0 10px", fontSize: "1.2rem" },
  flexRow: { display: "flex", gap: "30px", flexWrap: "wrap" },
  imgBoxCatalog: { flex: "1", minWidth: "250px", display: "flex", justifyContent: "center", alignItems: "center", background: "#f5f5f5", borderRadius: "8px", padding: "10px", minHeight: "300px" },
  imgCatalog: { maxHeight: "300px", objectFit: "contain", borderRadius: "8px" },
  placeholderBox: { textAlign: "center", color: "#888" },
  placeholderIcon: { fontSize: "1.5rem", marginBottom: "5px" },
  flexFields: { flex: "2", minWidth: "300px" },
  labelCatalog: { fontWeight: "bold", color: "#e0115f" },
  select: { width: "100%", padding: "10px", marginBottom: "15px", background: "#f9f9f9", border: "1px solid #ccc", borderRadius: "4px" },
  gridHalf: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "15px" },
  disabledInput: { width: "100%", padding: "8px", background: "#f0f0f0", color: "#666", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" },
  mt15: { marginTop: "15px" },
  fieldsetSeller: { border: "2px solid #2575fc", borderRadius: "8px", padding: "20px", marginBottom: "30px", background: "#fff" },
  legendSeller: { fontWeight: "bold", color: "#2575fc", padding: "0 10px", fontSize: "1.2rem" },
  flexImageSeller: { flex: "1", minWidth: "250px", display: "flex", flexDirection: "column", gap: "15px" },
  imgBoxSeller: { background: "#f5f5f5", borderRadius: "8px", padding: "10px", minHeight: "300px", display: "flex", justifyContent: "center", alignItems: "center" },
  btnUploadImage: { display: "block", textAlign: "center", padding: "10px", background: "#2575fc", color: "#fff", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" },
  btnAnalyze: { width: "100%", padding: "10px", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" },
  gridThird: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" },
  textInput: { width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" },
  selectSeller: { width: "100%", padding: "9px", borderRadius: "4px", border: "1px solid #ccc", background: "white", color: "#333", fontSize: "14px", boxSizing: "border-box" },
  textarea: { width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px", minHeight: "80px", boxSizing: "border-box", resize: "none" },
  yoloPanel: { marginTop: "20px", padding: "15px", background: "#f4f7fe", borderRadius: "6px", border: "1px dashed #2575fc" },
  yoloTitle: { margin: "0 0 10px 0", color: "#2575fc" },
  yoloLabel: { fontSize: "0.85rem", color: "#555" },
  yoloInput: { width: "100%", padding: "6px", textAlign: "center", fontWeight: "bold", border: "1px solid #ccc", borderRadius: "4px", background: "#fff", boxSizing: "border-box" },
  submitContainer: { display: "flex", justifyContent: "center", marginTop: "20px" },
  btnPublish: { padding: "15px 60px", fontSize: "1.2rem", fontWeight: "bold", borderRadius: "30px", cursor: "pointer", background: "#2e7d32", color: "#fff", border: "none" }
};

export default CreatePost;