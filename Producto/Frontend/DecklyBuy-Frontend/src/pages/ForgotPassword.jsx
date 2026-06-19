import React, { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("El campo correo no puede quedar vacío");
      return;
    }
    if (!emailRegex.test(email)) {
      setError("Debes ingresar un correo válido. Ejemplo: usuario@correo.com");
      return;
    }

    setError("");

    try {
      const response = await fetch("https://localhost:8080/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Error al enviar el correo de recuperación");
        return;
      }

      setMessage("Te enviamos un correo con instrucciones para restablecer tu contraseña.");
    } catch (err) {
      console.error("Error en recuperación:", err);
      setError("No se pudo conectar con el servidor");
    }
  };

  return (
    <main className="zona-contacto auth-page">
      <div className="formulario-contacto">
        <h1>Recuperar contraseña</h1>
        <p>Ingresa tu correo electrónico para recibir un enlace de recuperación.</p>

        <form onSubmit={handleSubmit}>
          <h4>Correo electrónico</h4>
          <input
            type="email"
            placeholder="Ej: usuario@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}

          <button type="submit" className="btn-enviar">
            RECUPERAR
          </button>
        </form>
      </div>
    </main>
  );
};

export default ForgotPassword;
