import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const USERNAME_REGEX = /^[a-z0-9_.]+$/;
const PHONE_REGEX = /^\+?[0-9]{8,15}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CONFIG_VALIDACIONES = {
  nombre: (v) => v.length < 2 ? "El nombre es demasiado corto (mínimo 2 letras)" : "",
  apellido: (v) => v.length < 2 ? "El apellido es demasiado corto (mínimo 2 letras)" : "",
  nombreUsuario: (v) => v.length < 3 ? "El nombre de usuario debe tener al menos 3 caracteres" : v.length > 20 ? "El nombre de usuario no puede superar los 20 caracteres" : !USERNAME_REGEX.test(v) ? "Usa solo minúsculas, números, puntos (.) o guiones bajos (_)" : "",
  numeroContacto: (v) => v && !PHONE_REGEX.test(v) ? "Formato inválido. Usa entre 8 y 15 números (Ej: +56912345678)" : "",
  email: (v) => !EMAIL_REGEX.test(v) ? "Debes ingresar un correo válido. Ejemplo: usuario@correo.com" : "",
  password: (v) => v.length < 6 ? "La contraseña debe tener al menos 6 caracteres" : ""
};

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "", apellido: "", nombreUsuario: "", numeroContacto: "", email: "", password: "", confirmPassword: ""
  });

  const [errors, setErrors] = useState({
    nombre: "", apellido: "", nombreUsuario: "", numeroContacto: "", email: "", password: "", confirmPassword: "", backend: ""
  });

  const validarCampo = (name, value, currentPassword) => {
    let errorMsg = "";
    const cleanValue = value.trim();

    if (!cleanValue && name !== "numeroContacto") {
      errorMsg = "Este campo es obligatorio y no puede contener solo espacios";
    } else if (CONFIG_VALIDACIONES[name]) {
      errorMsg = CONFIG_VALIDACIONES[name](cleanValue);
    } else if (name === "confirmPassword" && value !== currentPassword) {
      errorMsg = "Las contraseñas no coinciden";
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg, backend: "" }));
    return errorMsg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let cleanValue = value;

    if (name === "nombreUsuario") cleanValue = value.replace(/\s/g, "").toLowerCase();
    if (name === "numeroContacto") cleanValue = value.replace(/[^0-9+]/g, "");
    if (name === "email") cleanValue = value.trim();

    setFormData((prev) => {
      const updatedData = { ...prev, [name]: cleanValue };
      validarCampo(name, cleanValue, updatedData.password);
      return updatedData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const datosLimpios = {
      nombre: formData.nombre.trim(),
      apellido: formData.apellido.trim(),
      nombreUsuario: formData.nombreUsuario.trim(),
      numeroContacto: formData.numeroContacto.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      confirmPassword: formData.confirmPassword
    };

    const nuevosErrores = {};
    Object.keys(datosLimpios).forEach((key) => {
      const msg = validarCampo(key, datosLimpios[key], datosLimpios.password);
      if (msg) nuevosErrores[key] = msg;
    });

    if (Object.keys(nuevosErrores).length > 0) {
      setErrors((prev) => ({ ...prev, ...nuevosErrores }));
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://localhost:8080/api/auth/register-init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: datosLimpios.email })
      });

      const result = await response.json().catch(() => null);

      if (response.ok) {
        navigate("/verify-code", { state: { formData: datosLimpios } });
      } else {
        setErrors((prev) => ({
          ...prev,
          backend: result?.message || "Error al iniciar el registro. Comprueba los datos."
        }));
      }
    } catch (error) {
      console.error("Error en registro:", error);
      setErrors((prev) => ({ ...prev, backend: "No se pudo establecer conexión con el servidor" }));
    } finally {
      setLoading(false);
    }
  };

  const tieneErrores = Object.values(errors).some((msg) => msg && msg !== errors.backend);

  return (
    <main className="zona-contacto auth-page">
      <div className="formulario-contacto">
        <h1>Registrarse</h1>
        <p>Crea tu cuenta para publicar y gestionar tus cartas TCG.</p>

        <form onSubmit={handleSubmit} style={{ width: "100%", display: "contents" }}>
          <h4>Nombre</h4>
          <input type="text" name="nombre" placeholder="Ej: Sebastian" value={formData.nombre} onChange={handleChange} maxLength={50} required />
          {errors.nombre && <p className="error-message-inline">{errors.nombre}</p>}

          <h4>Apellido</h4>
          <input type="text" name="apellido" placeholder="Ej: Bustos" value={formData.apellido} onChange={handleChange} maxLength={50} required />
          {errors.apellido && <p className="error-message-inline">{errors.apellido}</p>}

          <h4>Nombre de usuario</h4>
          <input type="text" name="nombreUsuario" placeholder="Ej: seba_bs22" value={formData.nombreUsuario} onChange={handleChange} maxLength={20} required />
          {errors.nombreUsuario && <p className="error-message-inline">{errors.nombreUsuario}</p>}

          <h4>Número de contacto (Opcional)</h4>
          <input type="text" name="numeroContacto" placeholder="Ej: +56912345678" value={formData.numeroContacto} onChange={handleChange} maxLength={16} />
          {errors.numeroContacto && <p className="error-message-inline">{errors.numeroContacto}</p>}

          <h4>Correo electrónico</h4>
          <input type="email" name="email" placeholder="Ej: usuario@correo.com" value={formData.email} onChange={handleChange} required />
          {errors.email && <p className="error-message-inline">{errors.email}</p>}

          <h4>Contraseña</h4>
          <input type="password" name="password" placeholder="Mínimo 6 caracteres" value={formData.password} onChange={handleChange} required />
          {errors.password && <p className="error-message-inline">{errors.password}</p>}

          <h4>Confirmar contraseña</h4>
          <input type="password" name="confirmPassword" placeholder="Repite tu contraseña" value={formData.confirmPassword} onChange={handleChange} required />
          {errors.confirmPassword && <p className="error-message-inline">{errors.confirmPassword}</p>}

          {errors.backend && <p className="error-message-backend">{errors.backend}</p>}

          <button type="submit" className="btn-enviar" disabled={loading || tieneErrores} style={{ opacity: loading || tieneErrores ? 0.6 : 1 }}>
            {loading ? "PROCESANDO..." : "CREAR CUENTA"}
          </button>

          <button type="button" className="btn-secundario btn-register" onClick={() => navigate("/login")}>
            YA TENGO CUENTA
          </button>
        </form>
      </div>
    </main>
  );
};

export default Register;