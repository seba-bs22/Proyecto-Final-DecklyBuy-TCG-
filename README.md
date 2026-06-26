<img width="100" height="100" alt="logo" src="https://github.com/user-attachments/assets/e1e0010c-5141-4b6f-ac20-7dc6cff44097" />


DecklyBuy-TCG es una plataforma web para la compra y venta de cartas Pokémon TCG. Permite a los usuarios registrarse, iniciar sesión, crear publicaciones y analizar automáticamente el estado de una carta mediante inteligencia artificial.

El proyecto está compuesto por un frontend en React, un backend en Spring Boot, un microservicio de IA en Python/FastAPI y una base de datos en Supabase. Su propósito es ofrecer un marketplace especializado, más confiable y transparente para vendedores y compradores de cartas Pokémon TCG.

///////////////////////////////////////////////////////////////////

Integrantes: Sebastián Bravo Silva, Cristóbal Cisternas Tillera, Sebastián Fernandez.

///////////////////////////////////////////////////////////////////

Ramas del repositorio: 

* main: Proyecto completo
* deploy: Configuración para despliegue
* develop: Desarrollo
* develop-mobile: Desarrollo mobile


///////////////////////////////////////////////////////////////////

## Descripción de los servicios y tecnologías utilizadas

DecklyBuy TCG está construido como una plataforma dividida en distintos servicios, cada uno encargado de una parte específica del sistema. Esta separación permite mantener una arquitectura más ordenada, escalable y fácil de mantener.

### Frontend Web

El frontend web corresponde a la interfaz principal de la plataforma para navegadores. Permite a los usuarios visualizar el catálogo de cartas, revisar publicaciones, iniciar sesión, administrar su perfil, consultar preguntas frecuentes y navegar por las distintas secciones del marketplace.

**Tecnologías utilizadas:**

* React
* Vite
* JavaScript
* React Router DOM
* CSS personalizado
* Fetch API para consumo de servicios REST

### Aplicación Mobile

La aplicación móvil permite adaptar la experiencia de DecklyBuy TCG a dispositivos móviles. Incluye pantallas como inicio, catálogo, carrito, perfil, lista de deseados, mis publicaciones y creación de publicaciones. Su objetivo es entregar una navegación más cómoda desde celulares, manteniendo una estructura similar a la versión web.

**Tecnologías utilizadas:**

* React Native
* Expo
* Expo Router
* TypeScript
* Expo Image Picker

### Backend

El backend centraliza la lógica principal del sistema. Se encarga de gestionar usuarios, autenticación, publicaciones, lista de deseados, carrito, carga de imágenes, conexión con la base de datos y comunicación con el servicio de inteligencia artificial.

**Tecnologías utilizadas:**

* Java
* Spring Boot
* Maven
* API REST
* Integración con servicios externos

### Base de datos y almacenamiento

DecklyBuy TCG utiliza Supabase como servicio de base de datos y almacenamiento. La base de datos permite guardar información de usuarios, publicaciones, cartas, favoritos y otros datos del sistema. El almacenamiento permite guardar imágenes asociadas a publicaciones y recursos necesarios para la plataforma.

**Tecnologías utilizadas:**

* Supabase
* PostgreSQL
* Supabase Storage

### Servicio de Inteligencia Artificial

El servicio de inteligencia artificial permite analizar imágenes de cartas para estimar su condición física. Este servicio funciona de forma independiente al backend principal y expone endpoints que permiten recibir una imagen, procesarla y devolver una clasificación junto con un puntaje referencial.

**Tecnologías utilizadas:**

* Python
* FastAPI
* Uvicorn
* Ultralytics YOLO
* PyTorch
* OpenCV
* Pillow
* NumPy

### Despliegue en la nube

El proyecto está preparado para desplegar sus servicios en la nube, separando frontend, backend, servicio de inteligencia artificial y base de datos. Esto permite que cada parte del sistema pueda mantenerse, actualizarse y escalarse de forma independiente.

**Servicios utilizados:**

* Vercel para el frontend web
* Render para el backend Spring Boot
* Render para el servicio de inteligencia artificial
* Supabase para base de datos y almacenamiento

