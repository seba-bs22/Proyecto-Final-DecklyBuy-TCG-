import React from "react";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const navigate = useNavigate();

  // Configuración de categorías mapeadas con sus valores reales de la Base de Datos
  const categoriasConfig = [
    {
      titulo: "Pokémon básicos, Fase 1/2",
      claseBg: "bg-pokemon",
      valoresBD: ["Basico", "Fase 1", "Fase 2"]
    },
    {
      titulo: "Pokémon Ex, V, VMAX",
      claseBg: "bg-especiales",
      valoresBD: ["ex", "V", "VMAX"]
    },
    {
      titulo: "Cartas de entrenador",
      claseBg: "bg-entrenador",
      valoresBD: ["Trainer"]
    },
    {
      titulo: "Cartas de energía",
      claseBg: "bg-energia",
      valoresBD: ["Energia"]
    }
  ];

  // Al hacer clic, viajamos al catálogo público enviando los filtros por la URL
  const handleCategoryClick = (valoresBD) => {
    const queryParams = valoresBD.join(",");
    
    // Apunta exactamente a tu nueva ruta protegida /catalog
    navigate(`/catalog?categorias=${queryParams}`);
  };

  return (
    <main>
      <section className="programada">
        <h2>Elige una opción</h2>
      </section>

      <section className="bloque-promos">
        {categoriasConfig.map((cat, i) => (
          <div
            key={i}
            className={`bloque-carta bloque-carta-categorias opcion-click bg-categoria ${cat.claseBg}`}
            onClick={() => handleCategoryClick(cat.valoresBD)}
          >
            <div className="info-carta">
              <h3>{cat.titulo}</h3>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Categories;