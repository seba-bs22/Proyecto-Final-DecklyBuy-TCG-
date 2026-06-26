import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext'; 

const Header = () => {
  const [open, setOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [sugerencias, setSugerencias] = useState([]); 
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false); 
  
  const { getCartCount } = useCart(); 
  
  const menuRef = useRef(null);
  const buscadorRef = useRef(null); 
  const navigate = useNavigate();
  const location = useLocation();

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userName = storedUser?.nombreUsuario || storedUser?.nombre || storedUser?.name || "Invitado";
  const userImage = storedUser?.fotoPerfil || storedUser?.picture || "/user.png";

  // 1. Cerrar dropdowns al hacer click fuera de sus respectivos contenedores
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
      if (buscadorRef.current && !buscadorRef.current.contains(event.target)) {
        setMostrarSugerencias(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // 2. Limpiar el input si cambiamos de página fuera del catálogo
  useEffect(() => {
    if (!location.pathname.includes("/catalog")) {
      setBusqueda("");
    }
  }, [location.pathname]);

  // 3. EFECTO DE BÚSQUEDA EN TIEMPO REAL (Autocompletado)
  useEffect(() => {
    const obtenerSugerencias = async () => {
      if (busqueda.trim().length < 2) {
        setSugerencias([]);
        return;
      }

      try {
        const response = await fetch(`https://localhost:8080/api/posts?buscar=${encodeURIComponent(busqueda.trim())}`, {
          credentials: "include"
        });
        const result = await response.json();
        
        const listaPosts = result.data || result || [];

        const cartasUnicas = [];
        const nombresVistos = new Set();

        for (const post of listaPosts) {
          if (post.nombre && !nombresVistos.has(post.nombre.toLowerCase())) {
            nombresVistos.add(post.nombre.toLowerCase());
            cartasUnicas.push(post);
          }
          if (cartasUnicas.length === 4) break; 
        }

        setSugerencias(cartasUnicas);
      } catch (error) {
        console.error("Error obtuvo sugerencias dinámicas:", error);
      }
    };

    const timeoutId = setTimeout(obtenerSugerencias, 300);
    return () => clearTimeout(timeoutId);
  }, [busqueda]);

  const handleBuscar = (e) => {
    if (e) e.preventDefault();
    setMostrarSugerencias(false);
    
    if (busqueda.trim() === "") {
      navigate("/catalog");
    } else {
      navigate(`/catalog?buscar=${encodeURIComponent(busqueda.trim())}`);
    }
  };

  const handleSeleccionarSugerencia = (post) => {
    setBusqueda(post.nombre);
    setMostrarSugerencias(false);
    navigate(`/catalog?buscar=${encodeURIComponent(post.nombre)}`);
  };

  const handleLogout = async () => {
    try {
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
    <header style={{ position: "relative", zIndex: 100 }}>
      <div className="bloque-buscador">

        {/* LOGO */}
        <div className="logo" onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
          <img src="/logo.svg" alt="Logo DecklyBuyTCG" />
        </div>

        {/* BUSCADOR CON AUTOCOMPLETADO */}
        <div className="buscador-container" ref={buscadorRef} style={{ position: "relative", width: "40%", minWidth: "280px" }}>
          <div className="buscador" style={{ display: "flex", gap: "6px", width: "100%" }}>
            <input 
              type="text" 
              placeholder="BUSCA TU CARTA" 
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setMostrarSugerencias(true);
              }}
              onFocus={() => setMostrarSugerencias(true)}
              onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
              style={{ width: "100%" }}
            />
            <button onClick={handleBuscar}>Buscar</button>
          </div>

          {/* DESPLEGABLE FLOTANTE DE SUGERENCIAS */}
          {mostrarSugerencias && sugerencias.length > 0 && (
            <div className="sugerencias-dropdown" style={{
              position: "absolute",
              top: "105%",
              left: 0,
              width: "100%",
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              zIndex: 999,
              overflow: "hidden",
              textAlign: "left"
            }}>
              {sugerencias.map((post) => (
                <div 
                  key={post.id}
                  onClick={() => handleSeleccionarSugerencia(post)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 14px",
                    cursor: "pointer",
                    borderBottom: "1px solid #f1f5f9",
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#ffffff"}
                >
                  <img 
                    src={post.cardImage || "https://via.placeholder.com/35x50?text=TCG"} 
                    alt={post.nombre} 
                    style={{ width: "30px", height: "42px", objectFit: "contain", borderRadius: "2px" }}
                  />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a" }}>{post.nombre}</span>
                    <span style={{ fontSize: "11px", color: "#64748b" }}>{post.edicion || "Colección"} • #{post.numero || "N/A"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>


        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Link 
            to="/carrito" 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "6px", 
              textDecoration: "none", 
              color: "#1e293b", 
              fontWeight: "bold",
              fontSize: "14px",
              background: "#f1f5f9",
              padding: "8px 14px",
              borderRadius: "20px",
              transition: "background 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#e2e8f0"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#f1f5f9"}
          >
            <span>🛒</span>
            {getCartCount() > 0 && (
              <span style={{
                background: "#ef4444",
                color: "#ffffff",
                fontSize: "11px",
                borderRadius: "50%",
                width: "18px",
                height: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold"
              }}>
                {getCartCount()}
              </span>
            )}
          </Link>

          {/* COMPONENTE DE PERFIL ORIGINAL */}
          <div className="perfil-container" ref={menuRef}>
            <button className="perfil-btn" onClick={(e) => { e.stopPropagation(); setOpen(!open); }}>
              <img src={userImage} alt="perfil" className="perfil-img" />
              <span>{userName}</span>
            </button>

            {open && (
              <div className="perfil-dropdown">
                <Link to="/account">Ver mi perfil</Link>
                <Link to="/create-post">Crear publicación</Link>
                <Link to="/posts">Mis publicaciones</Link>
                <Link to="/wishlist">Lista de deseos</Link>
                <button onClick={handleLogout} className="logout-btn">Cerrar sesión</button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* NAV ORIGINAL (Vuelve a sus 4 puntos limpios, sin superposiciones) */}
      <nav>
        <ul className="barra-navegacion">
          <li><Link to="/home" className={location.pathname === "/home" ? "active" : ""}>INICIO</Link></li>
          <li><Link to="/catalog" className={location.pathname.includes("/catalog") ? "active" : ""}>CATÁLOGO</Link></li>
          <li><Link to="/offers" className={location.pathname === "/offers" ? "active" : ""}>OFERTAS</Link></li>
          <li><Link to="/contact" className={location.pathname === "/contact" ? "active" : ""}>FAQ</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;