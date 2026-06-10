import React, { useState } from "react";
import { API_URL } from "../config/api";

const CreatePost = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    edicion: "",
    numero: "",
    precio: ""
  });

  const [analysisResult, setAnalysisResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [modal, setModal] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));

    // limpiar al cambiar imagen
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
      setModal({
        valid: false,
        mensaje: "Debes subir una imagen antes de analizarla."
      });
      return;
    }

    setAnalyzing(true);

    try {
      const data = new FormData();
      data.append("file", selectedImage);

      const response = await fetch(`${API_URL}/api/ia/detect-score`, {
        method: "POST",
        body: data
      });

      const result = await response.json();

      if (result.valid) {
        setAnalysisResult(result);
      } else {
        setAnalysisResult(null);
      }

      setModal({
        valid: result.valid,
        mensaje: result.mensaje
      });

    } catch (error) {
      console.error("Error al analizar imagen:", error);

      setAnalysisResult(null);

      setModal({
        valid: false,
        mensaje: "No se pudo conectar con el servicio de análisis. Intenta nuevamente."
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handlePublish = () => {
    if (!analysisResult) {
      setModal({
        valid: false,
        mensaje: "Debes analizar una imagen válida antes de publicar."
      });
      return;
    }

    console.log("Publicar:", {
      ...formData,
      imagen: selectedImage,
      analisis: analysisResult
    });
  };

  return (
    <main className="crear-publicacion-page">
      <h1 className="crear-publicacion-titulo">CREAR PUBLICACIÓN</h1>

      <section className="crear-publicacion-contenedor">
        <div className="imagen-publicacion-box">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Vista previa de la carta"
              className="imagen-preview"
            />
          ) : (
            <div className="imagen-placeholder">
              <p>Sube una imagen de la carta</p>
            </div>
          )}

          <label className="btn-subir-imagen">
            Seleccionar imagen
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
          </label>

          <button
            className="btn-analizar-imagen"
            onClick={handleAnalyze}
            disabled={analyzing}
          >
            {analyzing ? "Analizando..." : "Analizar imagen"}
          </button>
        </div>

        <div className="form-publicacion">
          <label>Nombre de la carta</label>
          <input
            type="text"
            name="nombre"
            placeholder="Ej: Charizard EX"
            value={formData.nombre}
            onChange={handleChange}
          />

          <label>Edición</label>
          <input
            type="text"
            name="edicion"
            placeholder="Ej: Scarlet & Violet 151"
            value={formData.edicion}
            onChange={handleChange}
          />

          <label>Número</label>
          <input
            type="text"
            name="numero"
            placeholder="Ej: 065/165"
            value={formData.numero}
            onChange={handleChange}
          />

          <label>Precio</label>
          <input
            type="number"
            name="precio"
            placeholder="Ej: 8000"
            value={formData.precio}
            onChange={handleChange}
          />

          <hr className="separador-analisis" />

          <label>Estado detectado</label>
          <input
            type="text"
            value={analysisResult?.estado || ""}
            placeholder="Ej: Lightly Played"
            readOnly
            className="input-readonly"
          />

          <label>Score</label>
          <input
            type="text"
            value={analysisResult ? `${analysisResult.score}/10` : ""}
            placeholder="Ej: 7/10"
            readOnly
            className="input-readonly"
          />

          <label>Confianza</label>
          <input
            type="text"
            value={analysisResult?.confidence || ""}
            placeholder="Ej: 85%"
            readOnly
            className="input-readonly"
          />
        </div>
      </section>

      <div className="publicar-contenedor">
        <button className="btn-publicar" onClick={handlePublish}>
          PUBLICAR
        </button>
      </div>

      {modal && (
        <div className="modal-analisis">
          <div className="modal-contenido">
            <div className={modal.valid ? "modal-icono ok" : "modal-icono error"}>
              {modal.valid ? "✓" : "✕"}
            </div>

            <p>{modal.mensaje}</p>

            <button onClick={() => setModal(null)}>
              Aceptar
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default CreatePost;