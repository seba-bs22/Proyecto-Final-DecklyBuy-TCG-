import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditPost = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nombre: "",
    edicion: "",
    numero: "",
    precio: "",
    descripcion: ""
  });
  const [loading, setLoading] = useState(true);

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
          setFormData({
            nombre: data.nombre || "",
            edicion: data.edicion || "",
            numero: data.numero || "",
            precio: data.precio || "",
            descripcion: data.descripcion || ""
          });
        } else {
          alert("No se pudo cargar la información de la publicación.");
          navigate("/posts");
        }
      } catch (error) {
        console.error("Error al obtener post para edición:", error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://localhost:8080/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include"
      });

      if (response.ok) {
        alert("¡Publicación actualizada con éxito!");
        navigate("/posts"); 
      } else {
        alert("Error al guardar los cambios en el servidor.");
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  if (loading) return <p style={estilos.loading}>Cargando datos de la carta...</p>;

  return (
    <main style={estilos.container}>
      <h2 style={estilos.title}>Editar Publicación</h2>
      
      <form onSubmit={handleSubmit} style={estilos.form}>
        <label style={estilos.label}>
          <strong>Nombre de la Carta:</strong>
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required style={estilos.input} />
        </label>

        <label style={estilos.label}>
          <strong>Edición / Set:</strong>
          <input type="text" name="edicion" value={formData.edicion} onChange={handleChange} required style={estilos.input} />
        </label>

        <label style={estilos.label}>
          <strong>Número de Carta:</strong>
          <input type="text" name="numero" value={formData.numero} onChange={handleChange} required style={estilos.input} />
        </label>

        <label style={estilos.label}>
          <strong>Precio ($):</strong>
          <input type="number" name="precio" value={formData.precio} onChange={handleChange} required style={estilos.input} />
        </label>

        <label style={estilos.label}>
          <strong>Descripción:</strong>
          <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows="4" style={estilos.textarea} />
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
    </main>
  );
};

const estilos = {
  loading: { textAlign: "center", marginTop: "50px", fontFamily: "sans-serif", color: "#64748b" },
  container: { maxWidth: "500px", margin: "40px auto", padding: "20px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", fontFamily: "sans-serif" },
  title: { textAlign: "center", marginBottom: "20px", color: "#0f172a" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  label: { display: "flex", flexDirection: "column", fontSize: "14px", color: "#334155" },
  input: { width: "100%", padding: "8px", marginTop: "5px", border: "1px solid #e2e8f0", borderRadius: "4px", boxSizing: "border-box" },
  textarea: { width: "100%", padding: "8px", marginTop: "5px", border: "1px solid #e2e8f0", borderRadius: "4px", resize: "none", boxSizing: "border-box" },
  buttonGroup: { display: "flex", gap: "10px", marginTop: "10px" },
  btnSubmit: { flex: 1, padding: "10px", background: "#2e7d32", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" },
  btnCancel: { flex: 1, padding: "10px", background: "#757575", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }
};

export default EditPost;