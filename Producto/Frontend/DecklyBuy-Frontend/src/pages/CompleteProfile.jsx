import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const USERNAME_REGEX = /^[a-z0-9_.]+$/;
const PHONE_REGEX = /^\+?[0-9]{8,15}$/;

const CompleteProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    nombreUsuario: "",
    contacto: ""
  });

  const [errors, setErrors] = useState({
    nombre: "",
    apellido: "",
    nombreUsuario: "",
    contacto: "",
    backend: ""
  });

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      const parsedUser = JSON.parse(localUser);
      setFormData({
        nombre: parsedUser.nombre || "",
        apellido: parsedUser.apellido || "",
        nombreUsuario: parsedUser.nombreUsuario || "",
        contacto: parsedUser.numeroContacto || "" 
      });
    }
  }, []);

  const validarCampo = (name, value) => {
    let errorMsg = "";
    const cleanValue = value.trim();

    if (name === "contacto" && !cleanValue) {
      errorMsg = ""; 
    } else if (!cleanValue && name !== "contacto") {
      errorMsg = "Este campo es obligatorio y no puede contener solo espacios";
    } else {
      switch (name) {
        case "nombre":
        case "apellido":
          if (cleanValue.length < 2) errorMsg = `El ${name} es demasiado corto (mínimo 2 letras)`;
          break;
        case "nombreUsuario":
          if (cleanValue.length < 3) {
            errorMsg = "El nombre de usuario debe tener al menos 3 caracteres";
          } else if (cleanValue.length > 20) {
            errorMsg = "El nombre de usuario no puede superar los 20 caracteres";
          } else if (!USERNAME_REGEX.test(cleanValue)) {
            errorMsg = "Usa solo minúsculas, números, puntos (.) o guiones bajos (_)";
          }
          break;
        case "contacto":
          if (!PHONE_REGEX.test(cleanValue)) {
            errorMsg = "Formato inválido. Usa entre 8 y 15 números (Ej: +56912345678)";
          }
          break;
        default:
          break;
      }
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg, backend: "" }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let cleanValue = value;
    
    if (name === "nombreUsuario") {
      cleanValue = value.replace(/\s/g, "").toLowerCase();
    } else if (name === "contacto") {
      cleanValue = value.replace(/[^0-9+]/g, "");
    }
    
    setFormData((prev) => ({ ...prev, [name]: cleanValue }));
    validarCampo(name, cleanValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const datosLimpios = {
      nombre: formData.nombre ? formData.nombre.trim() : "",
      apellido: formData.apellido ? formData.apellido.trim() : "",
      nombreUsuario: formData.nombreUsuario ? formData.nombreUsuario.trim() : "",
      contacto: formData.contacto ? formData.contacto.trim() : ""
    };

    const nuevosErrores = {
      nombre: "",
      apellido: "",
      nombreUsuario: "",
      contacto: "",
      backend: ""
    };

    let flagErrores = false;

    if (!datosLimpios.nombre) { nuevosErrores.nombre = "Este campo es requerido"; flagErrores = true; }
    if (!datosLimpios.apellido) { nuevosErrores.apellido = "Este campo es requerido"; flagErrores = true; }
    if (!datosLimpios.nombreUsuario) { nuevosErrores.nombreUsuario = "Este campo es requerido"; flagErrores = true; }

    if (datosLimpios.nombreUsuario && !USERNAME_REGEX.test(datosLimpios.nombreUsuario)) {
      nuevosErrores.nombreUsuario = "Nombre de usuario inválido";
      flagErrores = true;
    }
    
    if (datosLimpios.contacto && !PHONE_REGEX.test(datosLimpios.contacto)) {
      nuevosErrores.contacto = "Número de teléfono inválido";
      flagErrores = true;
    }

    if (flagErrores) {
      setErrors(nuevosErrores);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://localhost:8080/api/auth/complete-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosLimpios),
        credentials: "include"
      });

      const result = await response.json();

      if (response.ok) {
        if (result.data) {
          localStorage.setItem("user", JSON.stringify(result.data));
        }
        navigate("/home", { replace: true });
      } else {
        setErrors((prev) => ({
          ...prev,
          backend: result.message || "Error al actualizar el perfil. Comprueba los datos."
        }));
      }
    } catch (err) {
      setErrors((prev) => ({ ...prev, backend: "No se pudo establecer conexión con el servidor" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="zona-contacto auth-page">
      <div className="formulario-contacto">
        <h1>🎯 ¡Ya casi estás!</h1>
        <p>Completa tus datos obligatorios para continuar en Deckly.</p>

        <form onSubmit={handleSubmit} style={estilos.form}>
          
          <h4>Nombre</h4>
          <input
            type="text"
            name="nombre"
            placeholder="Tu nombre"
            value={formData.nombre}
            onChange={handleChange}
            maxLength={50}
            required
          />
          {errors.nombre && <p className="error-message-inline">{errors.nombre}</p>}

          <h4>Apellido</h4>
          <input
            type="text"
            name="apellido"
            placeholder="Tu apellido"
            value={formData.apellido}
            onChange={handleChange}
            maxLength={50}
            required
          />
          {errors.apellido && <p className="error-message-inline">{errors.apellido}</p>}

          <h4>Nombre de Usuario (Único)</h4>
          <input
            type="text"
            name="nombreUsuario"
            placeholder="Ej: red_kanto"
            value={formData.nombreUsuario}
            onChange={handleChange}
            maxLength={20}
            required
          />
          {errors.nombreUsuario && <p className="error-message-inline">{errors.nombreUsuario}</p>}

          <h4>Teléfono o WhatsApp (Opcional)</h4>
          <input
            type="text"
            name="contacto"
            placeholder="Ej: +56912345678"
            value={formData.contacto}
            onChange={handleChange}
            maxLength={16}
            autoComplete="off"
          />
          {errors.contacto && <p className="error-message-inline">{errors.contacto}</p>}

          {errors.backend && <p className="error-message-backend">{errors.backend}</p>}

          <button 
            type="submit" 
            className="btn-enviar" 
            disabled={loading}
            style={{ opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "GUARDANDO..." : "COMPLETAR REGISTRO"}
          </button>
        </form>
      </div>
    </main>
  );
};

const estilos = {
  form: { width: "100%", display: "contents" }
};

export default CompleteProfile;