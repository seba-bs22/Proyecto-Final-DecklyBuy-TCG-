import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditPost = () => {
  const { id } = useParams(); // Captura el ID de la carta desde la URL
  const navigate = useNavigate();
  
  // Estados para los campos del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    edicion: "",
    numero: "",
    precio: "",
    descripcion: ""
  });
  const [loading, setLoading] = useState(true);

  // 1. Cargar los datos actuales de esta carta específica al entrar
  useEffect(() => {
    const fetchPostActual = async () => {
      try {
        const response = await fetch(`https://localhost:8080/api/posts/${id}`, {
          method: "GET",
          credentials: "include"
        });
        if (response.ok) {
          const result = await response.json();
          // Rellenamos el estado con lo que ya está guardado en la BD
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

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 2. Enviar los datos actualizados mediante PUT
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://localhost:8080/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
        credentials: "include"
      });

      if (response.ok) {
        alert("¡Publicación actualizada con éxito!");
        navigate("/posts"); // Volvemos a la vitrina
      } else {
        alert("Error al guardar los cambios en el servidor.");
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Cargando datos de la carta...</p>;

  return (
    <main style={{ maxWidth: "500px", margin: "40px auto", padding: "20px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Editar Publicación</h2>
      
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <label>
          <strong>Nombre de la Carta:</strong>
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required style={{ width: "100%", padding: "8px", marginTop: "5px" }} />
        </label>

        <label>
          <strong>Edición / Set:</strong>
          <input type="text" name="edicion" value={formData.edicion} onChange={handleChange} required style={{ width: "100%", padding: "8px", marginTop: "5px" }} />
        </label>

        <label>
          <strong>Número de Carta:</strong>
          <input type="text" name="numero" value={formData.numero} onChange={handleChange} required style={{ width: "100%", padding: "8px", marginTop: "5px" }} />
        </label>

        <label>
          <strong>Precio ($):</strong>
          <input type="number" name="precio" value={formData.precio} onChange={handleChange} required style={{ width: "100%", padding: "8px", marginTop: "5px" }} />
        </label>

        <label>
          <strong>Descripción:</strong>
          <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows="4" style={{ width: "100%", padding: "8px", marginTop: "5px", resize: "none" }} />
        </label>

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button type="submit" style={{ flex: 1, padding: "10px", background: "#2e7d32", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
            Guardar Cambios
          </button>
          <button type="button" onClick={() => navigate("/posts")} style={{ flex: 1, padding: "10px", background: "#757575", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
            Cancelar
          </button>
        </div>
      </form>
    </main>
  );
};

export default EditPost;