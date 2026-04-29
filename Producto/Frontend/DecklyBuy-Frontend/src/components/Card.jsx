import React from "react";

const Card = ({ img, nombre, tipo, descripcion }) => (
  <div className="bloque-carta">
    <div className="carta-img">
      <img src={img} alt={`Carta ${nombre}`} />
    </div>
    <div className="info-carta">
      <div className="tipo-tcg">{tipo}</div>
      <div className="nombre-carta">{nombre}</div>
      <div className="descripcion-carta">{descripcion}</div>
    </div>
  </div>
);

export default Card;