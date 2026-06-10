import React, { useEffect, useState } from "react";

const Posts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/posts");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error al cargar publicaciones:", error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <main className="posts-page">
      <h1>Publicaciones</h1>
      <section className="posts-list">
        {posts.length === 0 ? (
          <p>No hay publicaciones aún.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post-card">
              <img src={post.imagenUrl} alt={post.nombre} className="post-image" />
              <h2>{post.nombre}</h2>
              <p><strong>Edición:</strong> {post.edicion}</p>
              <p><strong>Número:</strong> {post.numero}</p>
              <p><strong>Precio:</strong> ${post.precio}</p>
              <p><strong>Estado:</strong> {post.estadoDetectado}</p>
              <p><strong>Score:</strong> {post.score}/10</p>
              <p><strong>Confianza:</strong> {post.confidence}%</p>
              <p><strong>Descripción:</strong> {post.descripcion}</p>
            </div>
          ))
        )}
      </section>
    </main>
  );
};

export default Posts;
