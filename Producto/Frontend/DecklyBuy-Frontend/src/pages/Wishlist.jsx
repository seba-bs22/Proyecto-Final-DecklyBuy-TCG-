import React, { useEffect, useState } from "react";
import Card from "../components/Card";

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Cargar los favoritos desde el Backend seguro usando la sesión
  const fetchWishlist = async () => {
    try {
      const response = await fetch("https://localhost:8080/api/wishlist", {
        method: "GET",
        credentials: "include"
      });

      if (!response.ok) {
        console.error(`Error al obtener favoritos: ${response.status}`);
        return;
      }

      const data = await response.json();
      // Recordar que el backend devuelve una lista de objetos Wishlist, 
      // donde cada elemento contiene el objeto ".post" dentro.
      setWishlistItems(data || []);
    } catch (error) {
      console.error("Error conectando con el endpoint de wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // 2. Función para eliminar de favoritos directamente desde esta lista
  const handleRemoveFavorite = async (postId) => {
    try {
      const response = await fetch(`https://localhost:8080/api/wishlist/remove/${postId}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (response.ok) {
        // Remueve el post de la pantalla inmediatamente sin recargar la página
        setWishlistItems(wishlistItems.filter(item => item.post.id !== postId));
      } else {
        alert("No se pudo quitar de favoritos.");
      }
    } catch (error) {
      console.error("Error al remover favorito:", error);
    }
  };

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Cargando tus favoritos...</p>;
  }

  return (
    <main>
      <section className="cartas-recientes">
        <h2>Mi Lista de Deseos ❤️</h2>

        <div className="cartas">
          {wishlistItems.length === 0 ? (
            <p style={{ textAlign: "center", width: "100%", color: "#666" }}>
              Aún no tienes cartas guardadas en tu lista de deseos.
            </p>
          ) : (
            wishlistItems.map((item) => {
              const post = item.post; // Extraemos el Post asociado
              if (!post) return null;

              const cardProps = {
                img: post.imagenUrl || "/img/placeholder.jpg",
                tipo: post.estadoDetectado ? `POKÉMON • ${post.estadoDetectado}` : "POKÉMON",
                nombre: post.nombre,
                descripcion: `(${post.numero}) [${post.edicion}] - $${post.precio} (IA: ${post.score || 0}/10)`
              };

              return (
                <div key={item.id} className="mis-publicaciones-wrapper" style={{ display: 'flex', flexDirection: 'column' }}>
                  {/* Reutiliza tu tarjeta exacta */}
                  <Card {...cardProps} />

                  {/* Panel inferior para quitarlo rápido */}
                  <div className="panel-acciones" style={{
                    display: 'flex',
                    padding: '10px',
                    background: '#f4f4f4',
                    borderBottomLeftRadius: '8px',
                    borderBottomRightRadius: '8px',
                    marginTop: '-5px',
                    border: '1px solid #ddd',
                    justifyContent: 'center'
                  }}>
                    <button
                      onClick={() => handleRemoveFavorite(post.id)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        background: '#d9534f',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      💔 Quitar de Favoritos
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

export default WishlistPage;