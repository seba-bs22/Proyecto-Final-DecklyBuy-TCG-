import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Account = () => {
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

  const [fotoPerfil, setFotoPerfil] = useState("/user.png");
  const [loading, setLoading] = useState(true);
  const [isGoogleAccount, setIsGoogleAccount] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch("https://localhost:8080/api/auth/me", {
          method: "GET",
          credentials: "include"
        });

        const user = await response.json();

        if (!response.ok) {
          localStorage.removeItem("user");
          navigate("/login", { replace: true });
          return;
        }

        localStorage.setItem("user", JSON.stringify(user));

        setFormData({
          nombre: user.nombre || "",
          apellido: user.apellido || "",
          nombreUsuario: user.nombreUsuario || "",
          numeroContacto: user.numeroContacto || "",
          email: user.email || "",
          password: "",
          confirmPassword: ""
        });

        setFotoPerfil(user.fotoPerfil || "/user.png");

        if (user.googleId) {
          setIsGoogleAccount(true);
        }
      } catch (error) {
        console.error("Error cargando perfil:", error);
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.nombre || !formData.nombreUsuario) {
      alert("Nombre y nombre de usuario son obligatorios");
      return;
    }

    if (!isGoogleAccount && (formData.password || formData.confirmPassword)) {
      if (formData.password !== formData.confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
      }

      if (formData.password.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres");
        return;
      }
    }

    try {
      const response = await fetch("https://localhost:8080/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          nombreUsuario: formData.nombreUsuario,
          numeroContacto: formData.numeroContacto,
          password: isGoogleAccount ? null : formData.password,
          confirmPassword: isGoogleAccount ? null : formData.confirmPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Error al actualizar perfil");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      alert(data.message || "Perfil actualizado correctamente");

      setFormData(prev => ({
        ...prev,
        password: "",
        confirmPassword: ""
      }));
    } catch (error) {
      console.error("Error guardando perfil:", error);
      alert("No se pudo conectar con el servidor");
    }
  };

  if (loading) {
    return (
      <main className="zona-contacto login-page">
        <div className="formulario-contacto">
          <h1>Cargando perfil...</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="zona-contacto login-page">
      <div className="formulario-contacto perfil-formulario">
        <h1>Ver mi perfil</h1>
        <p>Revisa y actualiza los datos de tu cuenta DecklyBuy.</p>

        <div className="perfil-foto-container">
          <img src={fotoPerfil} alt="Foto de perfil" className="perfil-foto-grande" />
        </div>

        <h4>Nombre</h4>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
        />

        <h4>Apellido</h4>
        <input
          type="text"
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
        />

        <h4>Nombre de usuario</h4>
        <input
          type="text"
          name="nombreUsuario"
          value={formData.nombreUsuario}
          onChange={handleChange}
        />

        <h4>Número de contacto</h4>
        <input
          type="text"
          name="numeroContacto"
          value={formData.numeroContacto}
          onChange={handleChange}
        />

        <h4>Correo electrónico</h4>
        <input
          type="email"
          name="email"
          value={formData.email}
          readOnly
          className="input-readonly"
        />

        {!isGoogleAccount && (
          <>
            <h4>Nueva contraseña</h4>
            <input
              type="password"
              name="password"
              placeholder="Opcional"
              value={formData.password}
              onChange={handleChange}
            />

            <h4>Confirmar contraseña</h4>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Repite la nueva contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </>
        )}

        <div className="perfil-botones">
          <button className="btn-secundario" onClick={() => navigate(-1)}>
            VOLVER
          </button>

          <button className="btn-enviar" onClick={handleSave}>
            GUARDAR
          </button>
        </div>
      </div>
    </main>
  );
};

export default Account;