import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginSuccess = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Validar la sesión contra el backend
    fetch("https://localhost:8080/api/auth/session", {
      credentials: "include" // 🔑 envía la cookie JSESSIONID
    })
      .then((res) => {
        if (res.ok) {
          // Sesión válida → redirigir a home
          navigate("/home", { replace: true });
        } else {
          // Sesión inválida → volver al login con error
          navigate("/login?error=session", { replace: true });
        }
      })
      .catch(() => {
        // Error de red → volver al login
        navigate("/login?error=network", { replace: true });
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <main className="login-success">
      <div className="loader-container">
        <img
          src="/loading.gif"
          alt="Cargando..."
          className="loader-gif"
        />
        <h2>{loading ? "Iniciando sesión..." : "Redirigiendo..."}</h2>
      </div>
    </main>
  );
};

export default LoginSuccess;
