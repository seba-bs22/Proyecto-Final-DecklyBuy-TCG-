<img width="100" height="100" alt="logo" src="https://github.com/user-attachments/assets/e1e0010c-5141-4b6f-ac20-7dc6cff44097" />


DecklyBuy-TCG es una plataforma web para la compra y venta de cartas Pokémon TCG. Permite a los usuarios registrarse, iniciar sesión, crear publicaciones y analizar automáticamente el estado de una carta mediante inteligencia artificial.

El proyecto está compuesto por un frontend en React, un backend en Spring Boot, un microservicio de IA en Python/FastAPI y una base de datos en Supabase. Su propósito es ofrecer un marketplace especializado, más confiable y transparente para vendedores y compradores de cartas Pokémon TCG.

Configuracion inicial para iniciar el proyecto y sus servicios.

///////////////////////////////////////////////////////////////////
1. API DE IA

-Ubicarse en la carpeta del servicio (Ej: "cd "C:\Users\...\Proyecto Final DecklyBuy-TCG\Producto\DecklyBuy-IA"")

-Crear el entorno virtual (SOLO si no existe): "python -m venv venv"

-Activar entorno virtual: ".\venv\Scripts\Activate"

-Instalar dependencias (SOLO primera vez o si cambia requirements.txt): "pip install -r requirements.txt"

-Iniciar API: "uvicorn main:app --reload --port 5000"

-Enlaces para pruebas: 

API IA funcionando:
http://localhost:5000

Swagger/FastAPI Docs:
http://localhost:5000/docs

-Endpoint principal: "POST http://localhost:5000/detect-score"


///////////////////////////////////////////////////////////////////

2. BACKEND SPRING BOOT

-Ubicarse en la carpeta de backend (Ej: "cd "C:\Users\...\Proyecto Final DecklyBuy-TCG\Producto\Backend"")

-Instalar dependencias y compilar sin test: "mvn clean install -DskipTests"

-Iniciar backend: "mvn spring-boot:run"

-Swagger:

http://localhost:8080/swagger-ui/index.html

-Endpoints principales:
GET  /api/users
POST /api/auth/register
POST /api/auth/login
POST /api/ia/detect-score


///////////////////////////////////////////////////////////////////

3. FRONTEND REACT

-Ubicarse en la carpeta (Ej: "cd "C:\Users\...\Proyecto Final DecklyBuy-TCG\Producto\Frontend\DecklyBuy-Frontend"")

-Instalar dependencias o si cambia package.json: "npm install"

-Iniciar frontend: "npm run dev"

-Enlace principal: http://localhost:5173


///////////////////////////////////////////////////////////////////

4. NOTAS IMPORTANTES

-Debe existir el archivo "application.properties" con las credenciales:

Supabase PostgreSQL
Google OAuth
configuración multipart

-Debe existir el modelo entrenado de ia: "Producto/DecklyBuy-IA/models/decklybuy_condition_v2.pt"
