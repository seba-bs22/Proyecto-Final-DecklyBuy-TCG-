import React, { useEffect, useState } from 'react';
import Card from '../components/Card';

const cartas = [
  {
    img: '/img/reshiram.jpg',
    tipo: 'POKÉMON',
    nombre: 'Reshiram',
    descripcion: '(113/114) [Black & White: Base Set]'
  },
  {
    img: '/img/charizard-ex.jpg',
    tipo: 'POKÉMON',
    nombre: 'Charizard EX',
    descripcion: '(065/165) [Scarlet & Violet 151]'
  },
  {
    img: '/img/charizard.jpg',
    tipo: 'POKÉMON',
    nombre: 'Charizard',
    descripcion: '(4/102) [Base Set]'
  }
];

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/user", {
      credentials: "include" // 🔥 clave para sesión
    })
      .then(res => res.json())
      .then(data => {
        console.log("Usuario:", data);
        setUser(data);

        // guardar para el Header
        localStorage.setItem("user", JSON.stringify(data));
      })
      .catch(err => console.error("Error obteniendo usuario:", err));
  }, []);

  return (
    <main>

      {/* 👇 Mensaje dinámico */}
      {user && (
        <section style={{ textAlign: "center", marginTop: "20px" }}>
          <h2>Bienvenido, {user.name}</h2>
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