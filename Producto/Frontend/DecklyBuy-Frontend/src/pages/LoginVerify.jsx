import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const LoginVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const formData = location.state?.formData;
  const query = new URLSearchParams(location.search);
  const email = formData?.email || query.get("email");

  const handleVerify = async () => {
    try {
      const response = await fetch("https://localhost:8080/api/auth/login-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: formData?.password,
          code: code.trim()
        }),
        credentials: "include"
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.message || "Código inválido");
        return;
      }

      navigate("/home", { replace: true });
    } catch (err) {
      setError("No se pudo conectar con el servidor");
    }
  };

  return (
    <main className="zona-contacto auth-page">
      <div className="formulario-contacto">
        <h1>Verificación de login</h1>
        <p>Ingresa el código que enviamos a tu correo {email}</p>

        <input
          type="text"
          placeholder="Código de verificación"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        {error && <p className="error-message">{error}</p>}

        <button className="btn-enviar" onClick={handleVerify}>
          VERIFICAR
        </button>

        {formData && (
          <button
            className="btn-secundario"
            onClick={() => navigate("/login", { state: { formData } })}
          >
            VOLVER ATRÁS
          </button>
        )}
      </div>
    </main>
  );
};

export default LoginVerify;