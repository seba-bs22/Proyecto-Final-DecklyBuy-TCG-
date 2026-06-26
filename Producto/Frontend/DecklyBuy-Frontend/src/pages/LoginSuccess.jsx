import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginSuccess = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://localhost:8080/api/auth/session", {
      credentials: "include"
    })
      .then(async (res) => {
        if (res.ok) {
          const jsonResponse = await res.json().catch(() => null);
          const userData = jsonResponse?.user; 

          if (userData) {
            localStorage.setItem("user", JSON.stringify(userData));

            const isComplete = userData.perfilCompleto ?? userData.perfil_completo;
            const username = (userData.nombreUsuario || userData.nombre_usuario || "").trim();
            const phone = (userData.numeroContacto || userData.numero_contacto || "").trim();

            // Si el backend dice que no está completo, o los campos vienen nulos/vacíos
            if (isComplete === false || !username || !phone) {
              navigate("/completar-perfil", { replace: true });
            } else {
              navigate("/home", { replace: true });
            }
          } else {
            navigate("/login?error=session", { replace: true });
          }
        } else {
          navigate("/login?error=session", { replace: true });
        }
      })
      .catch(() => {
        navigate("/login?error=network", { replace: true });
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <main className="login-success">
      <div className="loader-container">
        <img src="/loading.gif" alt="Cargando..." className="loader-gif" />
        <h2>{loading ? "Iniciando sesión..." : "Redirigiendo..."}</h2>
      </div>
    </main>
  );
};

export default LoginSuccess;