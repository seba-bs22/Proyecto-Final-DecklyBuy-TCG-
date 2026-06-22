import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

const Header = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const storedUser = JSON.parse(localStorage.getItem("user"));

  const userName =
    storedUser?.nombreUsuario ||
    storedUser?.nombre ||
    storedUser?.name ||
    "Invitado";

  const userImage =
    storedUser?.fotoPerfil ||
    storedUser?.picture ||
    "/user.png";

  // cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // logout 
  const handleLogout = async () => {
    try {
      // CORREGIDO: Cambiado a HTTPS para evitar bloqueos CORS al cerrar sesión
      await fetch("https://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });
    } catch (error) {
      console.error("Error cerrando sesión en backend:", error);
    }

    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <header>
      <div className="bloque-buscador">

        {/* LOGO */}
        <div className="logo">
          <img src="/logo.svg" alt="Logo DecklyBuyTCG" />
        </div>

        {/* BUSCADOR */}
        <div className="buscador">
          <input type="text" placeholder="BUSCA TU CARTA" />
          <button>Buscar</button>
        </div>

        {/* PERFIL */}
        <div className="perfil-container" ref={menuRef}>
          <button 
            className="perfil-btn"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
          >
            <img 
              src={userImage} 
              alt="perfil" 
              className="perfil-img"
            />
            <span>{userName}</span>
          </button>

          {open && (
            <div className="perfil-dropdown">
              <Link to="/account">Ver mi perfil</Link>
              <Link to="/create-post">Crear publicación</Link>
              <Link to="/posts">Mis publicaciones</Link>
              
              {/* ACCESO DIRECTO A LA LISTA DE DESEOS */}
              <Link to="/wishlist">Lista de deseos ❤️</Link>
              
              <button onClick={handleLogout} className="logout-btn">
                Cerrar sesión
              </button>
            </div>
          )}
        </div>

      </div>

      {/* NAV */}
      <nav>
        <ul className="barra-navegacion">

          <li>
            <Link 
              to="/home" 
              className={location.pathname === "/home" ? "active" : ""}
            >
              INICIO
            </Link>
          </li>

          <li>
            <Link 
              to="/categories" 
              className={location.pathname === "/categories" ? "active" : ""}
            >
              CATEGORÍAS
            </Link>
          </li>

          <li>
            <Link 
              to="/offers" 
              className={location.pathname === "/offers" ? "active" : ""}
            >
              OFERTAS
            </Link>
          </li>

          <li>
            <Link 
              to="/contact" 
              className={location.pathname === "/contact" ? "active" : ""}
            >
              CONTACTO
            </Link>
          </li>

        </ul>
      </nav>
    </header>
  );
};

export default Header;