import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    nombreUsuario: "",
    numeroContacto: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({
    nombre: "",
    apellido: "",
    nombreUsuario: "",
    numeroContacto: "",
    email: "",
    password: "",
    confirmPassword: "",
    backend: ""
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{9}$/; // ejemplo: 9 dígitos en Chile

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    let msg = "";
    if (name === "nombre" && !value) msg = "El campo nombre no puede quedar vacío";
    if (name === "apellido" && !value) msg = "El campo apellido no puede quedar vacío";
    if (name === "nombreUsuario" && !value) msg = "El campo usuario no puede quedar vacío";
    if (name === "email") {
      if (!value) msg = "El campo correo no puede quedar vacío";
      else if (!emailRegex.test(value)) msg = "Debes ingresar un correo válido. Ejemplo: usuario@correo.com";
    }
    if (name === "password") {
      if (!value) msg = "El campo contraseña no puede quedar vacío";
      else if (value.length < 6) msg = "La contraseña debe tener al menos 6 caracteres";
    }
    if (name === "confirmPassword") {
      if (!value) msg = "Debes confirmar la contraseña";
      else if (value !== formData.password) msg = "Las contraseñas no coinciden";
    }
    if (name === "numeroContacto") {
      if (!value) msg = "El campo número de contacto no puede quedar vacío";
      else if (!phoneRegex.test(value)) msg = "El número debe tener 9 dígitos";
    }

    setErrors({ ...errors, [name]: msg, backend: "" });
  };

  // En vez de crear usuario directo, enviamos correo a /register-init
  const handleRegisterInit = async () => {
    const hasErrors = Object.values(errors).some((err) => err);
    if (hasErrors) return;

    try {
      const response = await fetch("http://localhost:8080/api/auth/register-init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email })
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ ...errors, backend: data.message || "Error al crear una cuenta" });
        return;
      }

      // Navegar a la página de verificación con todos los datos
      navigate("/verify-code", { state: { formData } });
    } catch (error) {
      console.error("Error en registro:", error);
      setErrors({ ...errors, backend: "No se pudo conectar con el servidor" });
    }
  };

  return (
    <main className="zona-contacto auth-page">
      <div className="formulario-contacto">
        <h1>Registrarse</h1>
        <p>Crea tu cuenta para publicar y gestionar tus cartas TCG.</p>

        <h4>Nombre</h4>
        <input
          type="text"
          name="nombre"
          placeholder="Ej: Sebastian"
          value={formData.nombre}
          onChange={handleChange}
        />
        {errors.nombre && <p className="error-message">{errors.nombre}</p>}

        <h4>Apellido</h4>
        <input
          type="text"
          name="apellido"
          placeholder="Ej: Bustos"
          value={formData.apellido}
          onChange={handleChange}
        />
        {errors.apellido && <p className="error-message">{errors.apellido}</p>}

        <h4>Nombre de usuario</h4>
        <input
          type="text"
          name="nombreUsuario"
          placeholder="Ej: seba_bs22"
          value={formData.nombreUsuario}
          onChange={handleChange}
        />
        {errors.nombreUsuario && <p className="error-message">{errors.nombreUsuario}</p>}

        <h4>Número de contacto</h4>
        <input
          type="text"
          name="numeroContacto"
          placeholder="Ej: 912345678"
          value={formData.numeroContacto}
          onChange={handleChange}
        />
        {errors.numeroContacto && <p className="error-message">{errors.numeroContacto}</p>}

        <h4>Correo electrónico</h4>
        <input
          type="email"
          name="email"
          placeholder="Ej: usuario@correo.com"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error-message">{errors.email}</p>}

        <h4>Contraseña</h4>
        <input
          type="password"
          name="password"
          placeholder="Mínimo 6 caracteres"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <p className="error-message">{errors.password}</p>}

        <h4>Confirmar contraseña</h4>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Repite tu contraseña"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}

        {errors.backend && <p className="error-message">{errors.backend}</p>}

        <button className="btn-enviar" onClick={handleRegisterInit}>
          CREAR CUENTA
        </button>

        <button
          className="btn-secundario btn-register"
          onClick={() => navigate("/login")}
        >
          YA TENGO CUENTA
        </button>
      </div>
    </main>
  );
};

export default Register;
