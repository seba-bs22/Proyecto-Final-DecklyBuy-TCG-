import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Completa todos los campos");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Error al iniciar sesión");
        return;
      }

      // Guardar usuario local en localStorage
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirigir a home
      navigate("/home");

    } catch (error) {
      console.error("Error en login:", error);
      alert("No se pudo conectar con el servidor");
    }
  };

  const handleGoogleLogin = () => {
    // REDIRECCIÓN AL BACKEND
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <main className="zona-contacto login-page">
      <div className="formulario-contacto">
        <h1>Iniciar sesión</h1>
        <p>Accede a tu cuenta para gestionar tus cartas TCG.</p>

        <h4>Correo electrónico</h4>
        <input
          type="email"
          placeholder="Ej: usuario@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <h4>Contraseña</h4>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn-enviar" onClick={handleLogin}>
          INGRESAR
        </button>

        <button className="btn-google" onClick={handleGoogleLogin}>
          <img src="/google-logo.png" alt="Google" className="google-icon" />
          Iniciar sesión con Google
        </button>

        <button
          className="btn-secundario"
          onClick={() => navigate("/register")}
        >
          REGISTRARSE
        </button>
      </div>
    </main>
  );
};

export default Login;