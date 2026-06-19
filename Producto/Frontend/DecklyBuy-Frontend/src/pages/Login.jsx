import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [backendError, setBackendError] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);

  const navigate = useNavigate();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 🔑 Verificar sesión activa al entrar a /login
  useEffect(() => {
    fetch("https://localhost:8080/api/auth/session", { credentials: "include" })
      .then(res => {
        if (res.ok) {
          // Sesión activa → redirigir a home
          navigate("/home", { replace: true });
        } else {
          // No hay sesión → mostrar login
          setCheckingSession(false);
        }
      })
      .catch(() => setCheckingSession(false));
  }, [navigate]);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (!value) {
      setEmailError("El campo correo no puede quedar vacío");
    } else if (!emailRegex.test(value)) {
      setEmailError("Debes ingresar un correo válido. Ejemplo: usuario@correo.com");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (!value) {
      setPasswordError("El campo contraseña no puede quedar vacío");
    } else {
      setPasswordError("");
    }
  };

  const handleLogin = async () => {
    if (emailError || passwordError) return;

    try {
      const response = await fetch("https://localhost:8080/api/auth/login-init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include" // 🔑 guarda la cookie JSESSIONID
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setBackendError(data?.message || "Error al iniciar sesión");
        return;
      }

      // Redirigir a la página de verificación con los datos
      navigate("/login-verify", { state: { formData: { email, password } } });
    } catch (error) {
      console.error("Error en login:", error);
      setBackendError("No se pudo conectar con el servidor");
    }
  };

  let finalMessage = "";
  if (emailError && passwordError) {
    finalMessage = "Debes ingresar correo y contraseña";
  } else {
    finalMessage = emailError || passwordError || backendError;
  }

  if (checkingSession) {
    return <p>Verificando sesión...</p>;
  }

  return (
    <main className="zona-contacto auth-page">
      <div className="formulario-contacto">
        <h1>Iniciar sesión</h1>
        <p>Accede a tu cuenta para gestionar tus cartas TCG.</p>

        <h4>Correo electrónico</h4>
        <input
          type="email"
          placeholder="Ej: usuario@correo.com"
          value={email}
          onChange={handleEmailChange}
        />

        <h4>Contraseña</h4>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={handlePasswordChange}
        />

        <div className="forgot-password">
          <span onClick={() => navigate("/forgot-password")}>
            ¿Olvidaste tu contraseña?
          </span>
        </div>

        {finalMessage && <p className="error-message">{finalMessage}</p>}

        <button className="btn-enviar" onClick={handleLogin}>
          INGRESAR
        </button>

        <button
          className="btn-google"
          onClick={() =>
            (window.location.href =
              "https://localhost:8080/oauth2/authorization/google")
          }
        >
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
