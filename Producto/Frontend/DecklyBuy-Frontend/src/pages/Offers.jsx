import React from 'react';
import OfferCard from '../components/OfferCard';

const ofertas = [
  {
    img: '/img/pikachu.jpg',
    tipo: 'POKÉMON',
    nombre: 'Pikachu',
    descripcion: 'Celebrations 25th Anniversary',
    precioOriginal: '$7.000',
    precioOferta: '$3.500',
    tiempo: '⌛ 23h 12m 30s',
    programada: false
  }, 
  {
    img: '/img/charizard.jpg',
    tipo: 'POKÉMON',
    nombre: 'Charizard',
    descripcion: 'XY Evolutions Holo Card',
    tiempo: '📅 FECHA: 22/10 - 02/11',
    programada: true
  },
  {
    img: '/img/reshiram.jpg',
    tipo: 'POKÉMON',
    nombre: 'Reshiram',
    descripcion: '(113/114) [Black & White: Base Set]',
    precioOriginal: '$13.000',
    precioOferta: '$7.000',
    tiempo: '⌛ 03h 05m 25s',
    programada: false
  }
];

const Offers = () => (
  <main>
    <h2>Ofertas actuales</h2>
    <div className="cartas">
      {ofertas.map((carta, index) => (
        <OfferCard key={index} {...carta} />
      ))}
    </div>
  </main>
);

export default Offers;