import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyCode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state?.formData;

  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleVerify = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/register-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, code })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Código inválido");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/home");
    } catch (err) {
      setError("No se pudo conectar con el servidor");
    }
  };

  return (
    <main className="zona-contacto auth-page">
      <div className="formulario-contacto">
        <h1>Verificación de correo</h1>
        <p>Ingresa el código que enviamos a tu correo {formData?.email}</p>

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

        <button
          className="btn-secundario"
          onClick={() => navigate("/register", { state: { formData } })}
        >
          VOLVER ATRÁS
        </button>
      </div>
    </main>
  );
};

export default VerifyCode;
