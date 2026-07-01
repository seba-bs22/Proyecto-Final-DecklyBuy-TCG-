import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { googleLoginUrl } from "../config/api";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "", backend: "" });
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://localhost:8080/api/auth/session", { credentials: "include" })
      .then((res) => {
        if (res.ok) {
          navigate("/home", { replace: true });
        } else {
          setCheckingSession(false);
        }
      })
      .catch(() => setCheckingSession(false));
  }, [navigate]);

  const validarCampo = (name, value) => {
    let errorMsg = "";

    if (!value) {
      errorMsg =
        name === "email"
          ? "El campo correo no puede quedar vacío"
          : "El campo contraseña no puede quedar vacío";
    } else if (name === "email") {
      if (!EMAIL_REGEX.test(value)) {
        errorMsg = "Debes ingresar un correo válido. Ejemplo: usuario@correo.com";
      } else if (value.length > 100) {
        errorMsg = "El correo es demasiado largo";
      }
    } else if (name === "password" && value.length > 128) {
      errorMsg = "La contraseña excede el límite permitido";
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg, backend: "" }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const cleanValue = name === "email" ? value.replace(/\s/g, "") : value;

    setFormData((prev) => ({ ...prev, [name]: cleanValue }));
    validarCampo(name, cleanValue);
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();

    if (!formData.email || !formData.password || errors.email || errors.password) {
      setErrors((prev) => ({
        ...prev,
        email: !formData.email ? "El campo correo no puede quedar vacío" : prev.email,
        password: !formData.password
          ? "El campo contraseña no puede quedar vacío"
          : prev.password,
      }));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://localhost:8080/api/auth/login-init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
        }),
        credentials: "include",
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setErrors((prev) => ({
          ...prev,
          backend: data?.message || "Error al iniciar sesión",
        }));
        return;
      }

      navigate("/login-verify", {
        state: {
          formData: {
            email: formData.email,
            password: formData.password,
          },
        },
      });
    } catch (error) {
      console.error("Error en login:", error);
      setErrors((prev) => ({
        ...prev,
        backend: "No se pudo conectar con el servidor",
      }));
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) return <p>Verificando sesión...</p>;

  const finalMessage =
    errors.email && errors.password
      ? "Debes ingresar correo y contraseña"
      : errors.email || errors.password || errors.backend;

  const isButtonDisabled = loading || !!errors.email || !!errors.password;

  return (
    <main className="zona-contacto auth-page">
      <div className="formulario-contacto">
        <h1>Iniciar sesión</h1>
        <p>Accede a tu cuenta para gestionar tus cartas TCG.</p>

        <form onSubmit={handleLogin} style={{ width: "100%", display: "contents" }}>
          <h4>Correo electrónico</h4>
          <input
            type="email"
            name="email"
            placeholder="Ej: usuario@correo.com"
            value={formData.email}
            onChange={handleChange}
            maxLength={100}
            disabled={loading}
            required
          />

          <h4>Contraseña</h4>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            maxLength={128}
            disabled={loading}
            required
          />

          <div className="forgot-password">
            <span onClick={() => !loading && navigate("/forgot-password")}>
              ¿Olvidaste tu contraseña?
            </span>
          </div>

          {finalMessage && <p className="error-message">{finalMessage}</p>}

          <button
            type="submit"
            className="btn-enviar"
            disabled={isButtonDisabled}
            style={{ opacity: isButtonDisabled ? 0.6 : 1 }}
          >
            {loading ? "PROCESANDO..." : "INGRESAR"}
          </button>

          <a
            href={loading ? "#" : googleLoginUrl}
            className="btn-google"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: loading ? 0.5 : 1,
              pointerEvents: loading ? "none" : "auto",
            }}
          >
            <img src="/google-logo.png" alt="Google" className="google-icon" />
            Iniciar sesión con Google
          </a>

          <button
            type="button"
            className="btn-secundario"
            onClick={() => !loading && navigate("/register")}
            disabled={loading}
          >
            REGISTRARSE
          </button>
        </form>
      </div>
    </main>
  );
};

export default Login;