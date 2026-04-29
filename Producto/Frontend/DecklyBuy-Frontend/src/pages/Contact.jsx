import React from 'react';

const Contact = () => (
  <main className="zona-contacto">
    <div className="info-contacto">
      <h3>
        En <span>DecklyBuyTCG</span> es seguro y confiable
      </h3>
      <p>
        Puedes encontrar: Singles, Lote de cartas, Productos sellados, Colección, Cartas Gradeadas y otros artículos relacionados a TCG.
      </p>
    </div>

    <div className="formulario-contacto">
      <h1>¿No lo encuentras?</h1>
      <p>
        Escríbenos y nos contactaremos <br /> contigo a la brevedad.
      </p>

      <h4>Nombre completo</h4>
      <input type="text" placeholder="Ej: Sebastián González" />

      <h4>Correo electrónico</h4>
      <input type="email" placeholder="Ej: ejemplo@correo.com" />

      <h4>Carta</h4>
      <input type="text" placeholder="Nombre de la carta que buscas" />

      {/* Campo para subir imágenes (comentado por estar en desarrollo) */}
      {/*
      <h5>
        Foto del artículo que deseas comprar <br />
        Puedes subir hasta 3 imágenes (PNG, JPG, JPEG de hasta 10 MB)
      </h5>
      <button className="btn-elegir">Elegir archivos</button> BOTÓN NO FUNCIONAL, W.I.P.
      */}

      <div id="mensaje-formulario" className="mensaje-formulario"></div>

      <button className="btn-enviar">ENVIAR</button>
    </div>
  </main>
);

export default Contact;