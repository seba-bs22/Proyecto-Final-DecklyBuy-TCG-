import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyCode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state?.formData;

  // 🔑 Si vienes desde Google, el email llega en la URL
  const query = new URLSearchParams(location.search);
  const emailFromUrl = query.get("email");

  const email = formData?.email || emailFromUrl;

  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleVerify = async () => {
    try {
      // 🔑 Armar payload según el flujo
      const payload = formData?.password
        ? {
            email: email.trim().toLowerCase(),
            password: formData.password,
            nombre: formData.nombre,
            nombreUsuario: formData.nombreUsuario,
            apellido: formData.apellido,
            numeroContacto: formData.numeroContacto,
            code: code.trim()
          }
        : {
            email: email.trim().toLowerCase(),
            code: code.trim()
          };

      const response = await fetch("https://localhost:8080/api/auth/register-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include"
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.message || "Código inválido");
        return;
      }

      // ✅ Ya no usamos localStorage, confiamos en la cookie de sesión
      navigate("/home", { replace: true });
    } catch (err) {
      setError("No se pudo conectar con el servidor");
    }
  };

  return (
    <main className="zona-contacto auth-page">
      <div className="formulario-contacto">
        <h1>Verificación de correo</h1>
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

        {/* Solo tiene sentido volver atrás si venías del registro tradicional */}
        {formData && (
          <button
            className="btn-secundario"
            onClick={() => navigate("/register", { state: { formData } })}
          >
            VOLVER ATRÁS
          </button>
        )}
      </div>
    </main>
  );
};

export default VerifyCode;
