import React from 'react';

const OfferCard = ({ img, tipo, nombre, descripcion, precioOriginal, precioOferta, tiempo, programada }) => (
  <div className="bloque-carta">
    <div className="carta-img">
      <img src={img} alt={`Carta ${nombre}`} />
    </div>
    <div className="info-carta">
      {programada ? (
        <div className="programada">
          <div className="tipo-tcg">{tipo}</div>
          <div className="nombre-carta">{nombre}</div>
          <div className="descripcion-carta">{descripcion}</div>
        </div>
      ) : (
        <>
          <div className="tipo-tcg">{tipo}</div>
          <div className="nombre-carta">{nombre}</div>
          <div className="descripcion-carta">{descripcion}</div>
          <div className="precio-oferta">
            <span className="etiqueta">Precio original:</span>
            <span className="valor">{precioOriginal}</span>
          </div>
          <div className="precio-oferta">
            <span className="etiqueta">Oferta actual:</span>
            <span className="valor">{precioOferta}</span>
          </div>
        </>
      )}
      <div className="tiempo-oferta">{tiempo}</div>
    </div>
  </div>
);

export default OfferCard;