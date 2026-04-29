import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

const Header = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation(); // 👈 clave

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userName = storedUser?.name || "Invitado";
  const userImage = storedUser?.picture || "/user.png";

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

  // logout simple
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
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
              <Link to="/account">Mi cuenta</Link>
              <Link to="/posts">Mis publicaciones</Link>
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