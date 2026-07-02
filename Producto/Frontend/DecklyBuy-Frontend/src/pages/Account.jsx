import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://localhost:8080"; 

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

  const [fotoPerfil, setFotoPerfil] = useState("");
  const [fotoError, setFotoError] = useState(false); // 🔥 NUEVO: Estado para bloquear re-intentos
  const [loading, setLoading] = useState(true);
  const [isGoogleAccount, setIsGoogleAccount] = useState(false);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          method: "GET",
          credentials: "include"
        });

        const dataResponse = await response.json();
        console.log("=== DATOS RECIBIDOS ===", dataResponse);

        if (!response.ok) {
          localStorage.removeItem("user");
          navigate("/login", { replace: true });
          return;
        }

        const user = dataResponse.user || dataResponse.data || dataResponse;
        localStorage.setItem("user", JSON.stringify(user));

        setFormData({
          nombre: user.nombre || user.name || user.firstName || "",
          apellido: user.apellido || user.lastName || user.surname || "",
          nombreUsuario: user.nombreUsuario || user.username || "", 
          numeroContacto: user.numeroContacto || user.phoneNumber || user.telefono || "",
          email: user.email || "",
          password: "",
          confirmPassword: ""
        });

        const urlFoto = user.fotoPerfil || user.profilePicture || user.avatarUrl;
        
        if (urlFoto && urlFoto !== "null" && urlFoto !== null && String(urlFoto).trim() !== "") {
          if (urlFoto.startsWith("http")) {
            setFotoPerfil(urlFoto);
          } else {
            const rutaLimpia = urlFoto.startsWith("/") ? urlFoto : `/${urlFoto}`;
            setFotoPerfil(`${API_BASE_URL}${rutaLimpia}`);
          }
        } else {
          setFotoError(true); // Si es null, activamos el flag de error de inmediato para usar /user.png
        }

        if (user.googleId) {
          setIsGoogleAccount(true);
        }
      } catch (error) {
        console.error("Error cargando perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.nombre || !formData.nombreUsuario) {
      setModal({ valid: false, mensaje: "Nombre y nombre de usuario son obligatorios" });
      return;
    }

    if (!isGoogleAccount && (formData.password || formData.confirmPassword)) {
      if (formData.password !== formData.confirmPassword) {
        setModal({ valid: false, mensaje: "Las contraseñas no coinciden" });
        return;
      }
      if (formData.password.length < 6) {
        setModal({ valid: false, mensaje: "La contraseña debe tener al menos 6 caracteres" });
        return;
      }
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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
        setModal({ valid: false, mensaje: data.message || "Error al actualizar perfil" });
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      setModal({ valid: true, mensaje: data.message || "Perfil actualizado correctamente" });

      setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
    } catch (error) {
      console.error("Error guardando perfil:", error);
      setModal({ valid: false, mensaje: "No se pudo conectar con el servidor" });
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

        {/* CONTENEDOR DE FOTO ULTRA SEGURO */}
        <div className="perfil-foto-container">
          <img 
            src={fotoError ? "/user.png" : (fotoPerfil || "/user.png")} 
            alt="Foto de perfil" 
            className="perfil-foto-grande" 
            onError={() => setFotoError(true)} // Si falla, cambia el booleano y React renderiza directamente /user.png sin reintentar
          />
        </div>

        <h4>Nombre</h4>
        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} />

        <h4>Apellido</h4>
        <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} />

        <h4>Nombre de usuario</h4>
        <input type="text" name="nombreUsuario" value={formData.nombreUsuario} onChange={handleChange} />

        <h4>Número de contacto</h4>
        <input type="text" name="numeroContacto" value={formData.numeroContacto} onChange={handleChange} />

        <h4>Correo electrónico</h4>
        <input type="email" name="email" value={formData.email} readOnly className="input-readonly" />

        {!isGoogleAccount && (
          <>
            <h4>Nueva contraseña</h4>
            <input
              type="password"
              name="password"
              placeholder="Opcional (Dejar en blanco para mantener actual)"
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
          <button className="btn-secundario" onClick={() => navigate(-1)}>VOLVER</button>
          <button className="btn-enviar" onClick={handleSave}>GUARDAR</button>
        </div>
      </div>

      {modal && (
        <div className="modal-analisis">
          <div className="modal-contenido">
            <div className={modal.valid ? "modal-icono ok" : "modal-icono error"}>
              {modal.valid ? "✓" : "✕"}
            </div>
            <p>{modal.mensaje}</p>
            <button onClick={() => setModal(null)}>Aceptar</button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Account;