import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const navigate = useNavigate();

  // Estados de carga de archivos y vista previa
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Estados del formulario de la carta
  const [formData, setFormData] = useState({
    nombre: "",
    edicion: "",
    numero: "",
    precio: "",
    descripcion: ""
  });

  // Estados del servicio de inteligencia artificial y modales
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [modal, setModal] = useState(null);

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
    if (!formData.nombre || !formData.edicion || !formData.numero || !formData.precio || !formData.descripcion) {
      setModal({ valid: false, mensaje: "Todos los campos son obligatorios." });
      return;
    }
    if (!analysisResult) {
      setModal({ valid: false, mensaje: "Debes analizar la imagen antes de publicar." });
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
        // MEJORA: Prioriza mostrar el mensaje de error explícito detallado por el Backend
        setModal({ valid: false, mensaje: uploadErr.error || uploadErr.mensaje || "Error al subir la imagen al servidor." });
        return;
      }

      const uploadJson = await uploadResponse.json();
      const imageUrl = uploadJson.url; 

      const postData = {
        ...formData,
        estadoDetectado: analysisResult.estado,
        score: analysisResult.score,
        confidence: analysisResult.confidence,
        imagenUrl: imageUrl
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
        const errData = await response.json();
        setModal({ valid: false, mensaje: errData.error || errData.mensaje || "Error al crear la publicacion." });
      }
    } catch (error) {
      console.error("Error al publicar:", error);
      setModal({ valid: false, mensaje: "No se pudo conectar con el backend." });
    }
  };

  return (
    <main className="crear-publicacion-page">
      <h1 className="crear-publicacion-titulo">CREAR PUBLICACIÓN</h1>

      <section className="crear-publicacion-contenedor">
        <div className="imagen-publicacion-box">
          {imagePreview ? (
            <img src={imagePreview} alt="Vista previa" className="imagen-preview" />
          ) : (
            <div className="imagen-placeholder"><p>Sube una imagen de la carta</p></div>
          )}
          <label className="btn-subir-imagen">
            Seleccionar imagen
            <input type="file" accept="image/*" onChange={handleImageChange} hidden required />
          </label>
          <button className="btn-analizar-imagen" onClick={handleAnalyze} disabled={analyzing}>
            {analyzing ? "Analizando..." : "Analizar imagen"}
          </button>
        </div>

        <div className="form-publicacion">
          <label>Nombre de la carta</label>
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />

          <label>Edición</label>
          <input type="text" name="edicion" value={formData.edicion} onChange={handleChange} required />

          <label>Número</label>
          <input type="text" name="numero" value={formData.numero} onChange={handleChange} required />

          <label>Precio</label>
          <input type="number" name="precio" value={formData.precio} onChange={handleChange} required />

          <label>Descripción</label>
          <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} required />

          <hr className="separador-analisis" />

          <label>Estado detectado</label>
          <input type="text" value={analysisResult?.estado || ""} disabled />

          <label>Score</label>
          <input type="text" value={analysisResult ? `${analysisResult.score}/10` : ""} disabled />

          <label>Confianza</label>
          <input type="text" value={analysisResult?.confidence || ""} disabled />
        </div>
      </section>

      <div className="publicar-contenedor">
        <button className="btn-publicar" onClick={handlePublish}>PUBLICAR</button>
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

export default CreatePost;