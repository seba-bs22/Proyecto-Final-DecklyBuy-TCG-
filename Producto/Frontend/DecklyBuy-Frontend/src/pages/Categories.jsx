import React from "react";

const Categories = () => {
  const opciones = [
    "Pokémon básicos, Fase 1/2",
    "Pokémon Ex, V, VMAX",
    "Cartas de entrenador",
    "Cartas de energía"
  ];

  // función para asignar clase según categoría
  const getClaseFondo = (opcion) => {
    switch (opcion) {
      case "Pokémon básicos, Fase 1/2":
        return "bg-pokemon";
      case "Pokémon Ex, V, VMAX":
        return "bg-especiales";
      case "Cartas de entrenador":
        return "bg-entrenador";
      case "Cartas de energía":
        return "bg-energia";
      default:
        return "";
    }
  };

  return (
    <main>
      <section className="programada">
        <h2>Elige una opción</h2>
      </section>

      <section className="bloque-promos">
        {opciones.map((opcion, i) => (
          <div
            key={i}
            className={`bloque-carta bloque-carta-categorias opcion-click bg-categoria ${getClaseFondo(opcion)}`}
            onClick={() => console.log(opcion)}
          >
            <div className="info-carta">
              <h3>{opcion}</h3>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Categories;