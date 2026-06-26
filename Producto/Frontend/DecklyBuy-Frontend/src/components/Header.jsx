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

  const mensajesNoLeidos = 2; 

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

  useEffect(() => {
    if (!location.pathname.includes("/catalog")) {
      setBusqueda("");
    }
  }, [location.pathname]);

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
    <header style={styles.header}>
      <div className="bloque-buscador" style={styles.bloqueBuscador}>

        {/* 1. BUSCADOR (Mismo tamaño) */}
        <div className="buscador-container" ref={buscadorRef} style={styles.buscadorContainer}>
          <div style={styles.searchWrapper}>
            <div style={styles.searchIconLeft}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            
            <input 
              type="text" 
              placeholder="Busca cartas, ediciones, rarezas..." 
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setMostrarSugerencias(true);
              }}
              onFocus={() => setMostrarSugerencias(true)}
              onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
              style={styles.searchInput}
            />
          </div>

          {/* DESPLEGABLE FLOTANTE DE SUGERENCIAS */}
          {mostrarSugerencias && sugerencias.length > 0 && (
            <div className="sugerencias-dropdown" style={styles.sugerenciasDropdown}>
              {sugerencias.map((post) => (
                <div 
                  key={post.id}
                  onClick={() => handleSeleccionarSugerencia(post)}
                  style={styles.sugerenciaItem}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#ffffff"}
                >
                  <img 
                    src={post.cardImage || "https://via.placeholder.com/35x50?text=TCG"} 
                    alt={post.nombre} 
                    style={{ width: "32px", height: "45px", objectFit: "contain", borderRadius: "4px" }}
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

        {/* 2. LOGO AL CENTRO */}
        <div className="logo" onClick={() => navigate("/home")} style={styles.logoWrapper}>
          <img src="/logo.svg" alt="Logo DecklyBuyTCG" style={styles.logoImg} />
        </div>

        {/* 3. ACCIONES A LA DERECHA */}
        <div style={styles.rightActions}>
          
          {/* BOTÓN DE MENSAJES */}
          <Link 
            to="/messages" 
            style={styles.iconButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#ffffff";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#f1f5f9";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            {mensajesNoLeidos > 0 && (
              <span style={{ ...styles.badge, background: "#2563eb" }}>{mensajesNoLeidos}</span>
            )}
          </Link>

          {/* BOTÓN DE CARRITO */}
          <Link 
            to="/carrito" 
            style={styles.iconButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#ffffff";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#f1f5f9";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {getCartCount() > 0 && (
              <span style={{ ...styles.badge, background: "#ef4444" }}>{getCartCount()}</span>
            )}
          </Link>

          {/* COMPONENTE DE PERFIL */}
          <div className="perfil-container" ref={menuRef} style={{ position: "relative" }}>
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

      {/* NAV ORIGINAL */}
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

const styles = {
  header: {
    position: "relative",
    zIndex: 100,
    background: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.02)"
  },
  bloqueBuscador: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px 40px", // 🚨 Modificado: Subió de 10px a 24px arriba y abajo. Esto genera el gap blanco más amplio y elegante.
    gap: "20px"
  },
  buscadorContainer: {
    position: "relative", 
    flex: 1, 
    maxWidth: "420px",
    minWidth: "220px",
    zIndex: 10
  },
  searchWrapper: {
    position: "relative",
    width: "100%",
    display: "flex",
    alignItems: "center"
  },
  searchIconLeft: {
    position: "absolute",
    left: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none"
  },
  searchInput: {
    width: "100%",
    padding: "11px 16px 11px 42px",
    borderRadius: "24px",
    border: "1px solid #cbd5e1",
    background: "#f8fafc",
    fontSize: "14px",
    color: "#334155",
    outline: "none",
    transition: "all 0.2s ease"
  },
  logoWrapper: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute", 
    left: "50%",
    transform: "translateX(-50%)", 
    pointerEvents: "auto"
  },
  logoImg: {
    height: "85px", 
    width: "auto",
    objectFit: "contain"
  },
  rightActions: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    flex: 1,
    maxWidth: "420px", 
    justifyContent: "flex-end",
    zIndex: 10
  },
  iconButton: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    background: "#f1f5f9",
    borderRadius: "50%",
    textDecoration: "none",
    transition: "all 0.2s ease"
  },
  badge: {
    position: "absolute",
    top: "-2px",
    right: "-2px",
    color: "#ffffff",
    fontSize: "10px",
    borderRadius: "50%",
    width: "18px",
    height: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
  },
  sugerenciasDropdown: {
    position: "absolute",
    top: "115%",
    left: 0,
    width: "100%",
    background: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: "12px",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
    zIndex: 999,
    overflow: "hidden",
    textAlign: "left"
  },
  sugerenciaItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 14px",
    cursor: "pointer",
    borderBottom: "1px solid #f1f5f9",
    transition: "background 0.2s"
  }
};

export default Header;