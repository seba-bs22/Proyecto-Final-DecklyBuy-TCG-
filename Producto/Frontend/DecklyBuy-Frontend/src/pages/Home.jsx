import React, { useEffect, useState } from 'react';
import Card from '../components/Card';

const cartas = [
  { img: '/img/reshiram.jpg', tipo: 'POKÉMON', nombre: 'Reshiram', descripcion: '(113/114) [Black & White: Base Set]' },
  { img: '/img/charizard-ex.jpg', tipo: 'POKÉMON', nombre: 'Charizard EX', descripcion: '(065/165) [Scarlet & Violet 151]' },
  { img: '/img/charizard.jpg', tipo: 'POKÉMON', nombre: 'Charizard', descripcion: '(4/102) [Base Set]' }
];

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("https://localhost:8080/api/auth/me", {
      credentials: "include" // importante para enviar cookies de sesión
    })
      .then(async res => {
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(data?.message || "No autenticado");
        }
        // siempre usar data.user
        setUser(data.user);
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      })
      .catch(err => console.error("Error obteniendo usuario:", err));
  }, []);

  return (
    <main>
      {user ? (
        <section style={{ textAlign: "center", marginTop: "20px" }}>
          <h2>Bienvenido, {user.nombreUsuario || user.nombre}</h2>
        </section>
      ) : (
        <section style={{ textAlign: "center", marginTop: "20px" }}>
          <h2>No hay sesión activa, inicia sesión para continuar</h2>
        </section>
      )}

      <section className="bloque-promos">
        <div className="bloque-carta">
          <div className="carta-img">
            <img src="/img/promo1.jpg" alt="Imagen promocional 1" />
          </div>
          <div className="info-carta">
            <h2>Últimas novedades</h2>
          </div>
        </div>
        <div className="bloque-carta">
          <div className="carta-img">
            <img src="/img/promo2.jpg" alt="Imagen promocional 2" />
          </div>
          <div className="info-carta">
            <h2>Compra y vende de forma sencilla</h2>
          </div>
        </div>
      </section>

      <section className="cartas-recientes">
        <h2>Publicadas recientemente</h2>
        <div className="cartas">
          {cartas.map((carta, index) => (
            <Card key={index} {...carta} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
