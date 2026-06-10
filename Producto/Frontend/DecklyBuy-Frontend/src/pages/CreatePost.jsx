import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    edicion: "",
    numero: "",
    precio: "",
    descripcion: ""
  });

  const [analysisResult, setAnalysisResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [modal, setModal] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setAnalysisResult(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
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
      const response = await fetch("http://localhost:8080/api/ia/detect-score", {
        method: "POST",
        body: data,
        credentials: "include" // 🔑 enviar cookie de sesión
      });
      const result = await response.json();
      setAnalysisResult(result.valid ? result : null);
      setModal({ valid: result.valid, mensaje: result.mensaje });
    } catch (error) {
      console.error("Error al analizar imagen:", error);
      setAnalysisResult(null);
      setModal({ valid: false, mensaje: "No se pudo conectar con el servicio de análisis." });
    } finally {
      setAnalyzing(false);
    }
  };

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
      // Paso 1: subir la imagen
      const data = new FormData();
      data.append("file", selectedImage);
      const uploadResponse = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        body: data,
        credentials: "include" // 🔑 enviar cookie de sesión
      });
      const { url } = await uploadResponse.json();

      // Paso 2: crear el post
      const postData = {
        ...formData,
        estadoDetectado: analysisResult.estado,
        score: analysisResult.score,
        confidence: analysisResult.confidence,
        imagenUrl: url
      };

      const response = await fetch("http://localhost:8080/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
        credentials: "include" // 🔑 enviar cookie de sesión
      });

      if (response.ok) {
        setModal({ valid: true, mensaje: "Publicación creada con éxito." });
        navigate("/posts");
      } else {
        setModal({ valid: false, mensaje: "Error al crear la publicación." });
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
