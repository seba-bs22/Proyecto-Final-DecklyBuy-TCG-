import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  // Función encargada de pedir los datos al servidor seguro
  const fetchPosts = async () => {
    try {
      const response = await fetch("https://localhost:8080/api/posts", {
        method: "GET",
        credentials: "include" 
      });
      
      if (!response.ok) {
        console.error(`Error del servidor: ${response.status}`);
        return;
      }

      const result = await response.json();
      setPosts(result.dataResponse || result.data || []);
    } catch (error) {
      console.error("Error al conectar con el servidor de publicaciones:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Función lógica para eliminar el registro de PostgreSQL y el archivo de Supabase
  const handleDelete = async (postId) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar esta publicación? Esta acción no se puede deshacer.");
    if (!confirmar) return;

    try {
      const response = await fetch(`https://localhost:8080/api/posts/${postId}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (response.ok) {
        alert("Publicación eliminada con éxito.");
        // Remueve el elemento visual de inmediato sin refrescar la ventana
        setPosts(posts.filter(post => post.id !== postId));
      } else {
        alert("No se pudo eliminar la publicación.");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  // Redirección dinámica hacia el formulario EditPost
  const handleEdit = (post) => {
    navigate(`/edit-post/${post.id}`);
  };

  return (
    <main>
      <section className="cartas-recientes">
        <h2>Mis Publicaciones</h2>
        
        <div className="cartas">
          {posts.length === 0 ? (
            <p style={{ textAlign: "center", width: "100%", color: "#666" }}>
              No tienes publicaciones activas. ¡Crea una en el menú de perfil!
            </p>
          ) : (
            posts.map((post) => {
              const cardProps = {
                img: post.imagenUrl || "/img/placeholder.jpg",
                tipo: post.estadoDetectado ? `POKÉMON • ${post.estadoDetectado}` : "POKÉMON",
                nombre: post.nombre,
                descripcion: `(${post.numero}) [${post.edicion}] - $${post.precio} (IA: ${post.score || 0}/10)`
              };

              return (
                <div key={post.id} className="mis-publicaciones-wrapper" style={{ display: 'flex', flexDirection: 'column' }}>
                  {/* Tarjeta con los estilos e identidad visual de tu Home */}
                  <Card {...cardProps} />
                  
                  {/* Panel inferior con acciones CRUD */}
                  <div className="panel-acciones" style={{
                    display: 'flex',
                    gap: '10px',
                    padding: '10px',
                    background: '#f4f4f4',
                    borderBottomLeftRadius: '8px',
                    borderBottomRightRadius: '8px',
                    marginTop: '-5px',
                    border: '1px solid #ddd',
                    justifyContent: 'space-between'
                  }}>
                    <button 
                      onClick={() => handleEdit(post)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        background: '#0275d8',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      ✏️ Editar
                    </button>
                    
                    <button 
                      onClick={() => handleDelete(post.id)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        background: '#d9534f',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
};

export default Posts;