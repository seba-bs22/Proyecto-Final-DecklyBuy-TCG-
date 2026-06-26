import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    fetch("https://localhost:8080/api/auth/me", {
      credentials: "include"
    })
      .then(async (res) => {
        if (res.ok) {
          const jsonResponse = await res.json().catch(() => null);
          const user = jsonResponse?.user; 
          
          if (user) {
            setAuthenticated(true);
            setUserProfile(user);
            // Sincronizamos por si acaso en el localStorage
            localStorage.setItem("user", JSON.stringify(user));
          } else {
            setAuthenticated(false);
          }
        } else {
          setAuthenticated(false);
        }
      })
      .catch(() => setAuthenticated(false))
      .finally(() => setChecking(false));
  }, [location.pathname]); // Se dispara al cambiar de ruta para validar en tiempo real

  if (checking) {
    return (
      <div className="loader-container">
        <p>Verificando sesión...</p>
      </div>
    );
  }

  // 1. Si no está autenticado en el backend, directo al login
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  const isComplete = userProfile?.perfilCompleto ?? userProfile?.perfil_completo;

  // 2. Si el perfil está incompleto y el usuario intenta navegar por la app (/home, /posts, etc.)
  if (isComplete === false && location.pathname !== "/completar-perfil") {
    return <Navigate to="/completar-perfil" replace />;
  }

  // 3. Si el perfil YA está completo e intenta volver a ingresar de vivo a "/completar-perfil"
  if (isComplete === true && location.pathname === "/completar-perfil") {
    return <Navigate to="/home" replace />;
  }

  // Si pasa todos los filtros de seguridad, renderiza la ruta correspondiente
  return <Outlet />;
};

export default ProtectedRoute;