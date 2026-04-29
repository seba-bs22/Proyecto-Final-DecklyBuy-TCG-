import React from "react";

export default function CategorySection({ titulo, onBack }) {
  return (
    <section className="categoria-contenedor">
      <button className="btn-volver" onClick={onBack}>
        ← VOLVER
      </button>

      <h2>{titulo}</h2>

      <div className="opciones-container">
        <div className="opcion">
          <h3>Opción 1</h3>
          <button className="btn btn-primary">Ver más</button>
        </div>

        <div className="opcion">
          <h3>Opción 2</h3>
          <button className="btn btn-primary">Ver más</button>
        </div>

        <div className="opcion">
          <h3>Opción 3</h3>
          <button className="btn btn-primary">Ver más</button>
        </div>

        <div className="opcion">
          <h3>Opción 4</h3>
          <button className="btn btn-primary">Ver más</button>
        </div>
      </div>
    </section>
  );
}