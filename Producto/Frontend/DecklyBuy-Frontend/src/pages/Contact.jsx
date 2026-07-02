import React, { useState } from "react";

const faqData = [
  {
    id: 1,
    pregunta: "¿Cómo se define la condición de una carta en DecklyBuyTCG?",
    contenido: (
      <div className="faq-contenido-condicion">
        <p className="faq-introduccion">
          En DecklyBuyTCG, la condición de una carta se define a partir del
          estado físico visible de la carta. Esta evaluación ayuda a los usuarios
          a comparar publicaciones y tener una referencia más clara antes de
          comprar.
        </p>

        <div className="faq-condicion-detalle">
          <div className="faq-imagen-referencial">
            <img
              src="/faq-condicion-carta.jpg"
              alt="Ejemplo referencial de condición de carta"
            />
          </div>

          <div className="faq-explicacion-imagen">
            <h4>Aspectos que se revisan</h4>

            <p>
              <strong>Superficie:</strong> se observan rayones, manchas,
              marcas visibles o desgaste en el frente y reverso de la carta.
            </p>

            <p>
              <strong>Esquinas:</strong> se revisa si existen dobleces,
              puntas gastadas, golpes o daños visibles.
            </p>

            <p>
              <strong>Bordes:</strong> se analiza el desgaste lateral,
              pérdida de color, marcas blancas o deterioro alrededor de la carta.
            </p>
          </div>
        </div>

        <div className="faq-explicacion-general">
          <h4>Evaluación de condición</h4>

          <p>
            La condición de una carta se evalúa observando su estado físico
            general. Para esto se revisan detalles visibles como la superficie,
            las esquinas, los bordes, posibles marcas, rayones, dobleces o
            señales de desgaste. Esta evaluación ayuda a entregar una referencia
            más clara sobre el estado real de la carta antes de que otro usuario
            revise una publicación.
          </p>

          <p>
            El objetivo es que cada publicación entregue información visual y
            descriptiva suficiente para que los compradores puedan comparar
            cartas de forma más segura y tomar una decisión con mayor confianza.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    pregunta: "¿Qué clasificación de condición utiliza DecklyBuyTCG?",
    contenido: (
      <div className="faq-contenido-clasificacion">
        <p className="faq-introduccion">
          DecklyBuyTCG utiliza un sistema de clasificación para representar el
          estado físico general de una carta. Esta clasificación permite que los
          usuarios puedan comparar publicaciones de forma más clara y entender
          mejor el nivel de conservación de cada carta.
        </p>

        <p>Las condiciones utilizadas dentro de la plataforma son:</p>

        <ol className="faq-lista-clasificacion">
          <li>
            <strong>Mint:</strong>
            <p>Carta sin daños visibles.</p>
          </li>

          <li>
            <strong>Near Mint:</strong>
            <p>Carta con pequeños daños en bordes o esquinas.</p>
          </li>

          <li>
            <strong>Lightly Played:</strong>
            <p>Bordes y esquinas desgastados ligeramente.</p>
          </li>

          <li>
            <strong>Moderately Played:</strong>
            <p>
              Carta usada regularmente, con desgastes visibles tanto en bordes
              como esquinas.
            </p>
          </li>

          <li>
            <strong>Heavily Played:</strong>
            <p>
              Carta muy usada que presenta serios desgastes en bordes y esquinas.
            </p>
          </li>

          <li>
            <strong>Damaged:</strong>
            <p>
              Carta que presenta serios daños en bordes y esquinas, además de
              decoloración en la ilustración.
            </p>
          </li>
        </ol>

        <p className="faq-texto-imagen">
          La siguiente imagen muestra una referencia visual de cómo puede variar
          la condición de una carta según su desgaste, desde un estado más
          conservado hasta uno con daño evidente.
        </p>

        <div className="faq-imagen-clasificacion">
          <img
            src="/faq-clasificacion-condicion.jpg"
            alt="Ejemplo de clasificación de condición de cartas"
          />
        </div>
      </div>
    ),
  },
  {
    id: 3,
    pregunta: "¿Cómo utiliza DecklyBuyTCG la inteligencia artificial?",
    contenido: (
      <div className="faq-contenido-ia">
        <p className="faq-introduccion">
          DecklyBuyTCG utiliza un modelo de inteligencia artificial basado en{" "}
          <strong>YOLO</strong>, una tecnología de visión por computador que
          permite analizar imágenes de manera rápida y eficiente.
        </p>

        <p>
          En la plataforma, este modelo se utiliza como apoyo para analizar la
          imagen de una carta publicada por el usuario. Para lograrlo, se trabaja
          con un <strong>dataset</strong> compuesto por imágenes organizadas en
          carpetas y etiquetadas según el estado visual de cada carta.
        </p>

        <p>
          Durante el entrenamiento, el modelo aprende a reconocer patrones
          visuales presentes en las cartas, como desgaste, marcas, bordes,
          esquinas o daños visibles. Luego, cuando un usuario sube una imagen, el
          sistema puede entregar una estimación automática que sirve como
          referencia dentro de la publicación.
        </p>

        <p className="faq-texto-imagen">
          Las siguientes imágenes muestran una referencia de cómo se organiza la
          data usada para el entrenamiento y el modelo YOLO utilizado como base
          para el análisis visual.
        </p>

        <div className="faq-imagenes-ia">
          <div className="faq-imagen-ia-box">
            <img
              src="/faq-dataset-ia.jpg"
              alt="Organización del dataset de entrenamiento"
            />
          </div>

          <div className="faq-imagen-ia-box">
            <img src="/faq-yolo-logo.png" alt="Logo de YOLO" />
          </div>
        </div>
      </div>
    ),
  },
];

const Contact = () => {
  const [preguntaAbierta, setPreguntaAbierta] = useState(null);

  const togglePregunta = (id) => {
    setPreguntaAbierta((actual) => (actual === id ? null : id));
  };

  return (
    /* 🛠️ AJUSTE: Limitamos el ancho de la zona del FAQ y añadimos margin auto para centrarla en la pantalla */
    <main className="zona-faq" style={{ maxWidth: '950px', margin: '40px auto', padding: '0 20px', width: '100%', boxSizing: 'border-box' }}>
      <section className="faq-header">
        <h1>Preguntas frecuentes</h1>
        <p>
          Encuentra orientación básica para usar DecklyBuyTCG, entender las
          publicaciones y conocer cómo se evalúan las cartas dentro de la
          plataforma.
        </p>
      </section>

      <section className="faq-lista">
        {faqData.map((item) => (
          <article
            key={item.id}
            className={`faq-item ${
              preguntaAbierta === item.id ? "faq-item-abierto" : ""
            }`}
          >
            <button
              className="faq-pregunta"
              onClick={() => togglePregunta(item.id)}
              style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span>{item.pregunta}</span>
              <span className="faq-icono">
                {preguntaAbierta === item.id ? "−" : "+"}
              </span>
            </button>

            {preguntaAbierta === item.id && (
              <div className="faq-respuesta">{item.contenido}</div>
            )}
          </article>
        ))}
      </section>
    </main>
  );
};

export default Contact;