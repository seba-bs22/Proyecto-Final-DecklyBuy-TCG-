import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Ya no necesitamos leer parámetros de la URL.
    // El backend guarda la sesión y Home.jsx se encargará de obtener el usuario.
    const timer = setTimeout(() => {
      navigate("/home");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="login-success">
      <div className="loader-container">
        <img
          src="/loading.gif"
          alt="Cargando..."
          className="loader-gif"
        />
        <h2>Iniciando sesión...</h2>
      </div>
    </main>
  );
};

export default LoginSuccess;
