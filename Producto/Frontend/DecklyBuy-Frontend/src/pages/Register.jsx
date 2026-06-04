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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleRegister = async () => {
    if (
      !formData.nombre ||
      !formData.nombreUsuario ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Completa todos los campos obligatorios");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Error al registrar usuario");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));

      alert(data.message || "Usuario registrado correctamente");

      navigate("/home");

    } catch (error) {
      console.error("Error en registro:", error);
      alert("No se pudo conectar con el servidor");
    }
  };

  return (
    <main className="zona-contacto login-page">
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

        <h4>Apellido</h4>
        <input
          type="text"
          name="apellido"
          placeholder="Ej: Bustos"
          value={formData.apellido}
          onChange={handleChange}
        />

        <h4>Nombre de usuario</h4>
        <input
          type="text"
          name="nombreUsuario"
          placeholder="Ej: seba_bs22"
          value={formData.nombreUsuario}
          onChange={handleChange}
        />

        <h4>Número de contacto</h4>
        <input
          type="text"
          name="numeroContacto"
          placeholder="Ej: 912345678"
          value={formData.numeroContacto}
          onChange={handleChange}
        />

        <h4>Correo electrónico</h4>
        <input
          type="email"
          name="email"
          placeholder="Ej: usuario@correo.com"
          value={formData.email}
          onChange={handleChange}
        />

        <h4>Contraseña</h4>
        <input
          type="password"
          name="password"
          placeholder="Mínimo 6 caracteres"
          value={formData.password}
          onChange={handleChange}
        />

        <h4>Confirmar contraseña</h4>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Repite tu contraseña"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <button className="btn-enviar" onClick={handleRegister}>
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