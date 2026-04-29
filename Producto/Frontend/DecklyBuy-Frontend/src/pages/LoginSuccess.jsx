import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const LoginSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userParam = params.get("user");

    if (userParam) {
      const user = JSON.parse(decodeURIComponent(userParam));

      // guardar usuario
      localStorage.setItem("user", JSON.stringify(user));

      // delay de 2 segundos antes de ir a home
      setTimeout(() => {
        navigate("/home");
      }, 2000);
    } else {
      navigate("/login");
    }
  }, [location, navigate]);

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