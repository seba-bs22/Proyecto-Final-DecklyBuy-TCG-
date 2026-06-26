import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://localhost:8080/api/cart";

const Cart = () => {
  const [cartData, setCartData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [pagando, setPagando] = useState(false); // <-- Estado para Mercado Pago
  const navigate = useNavigate();

  const obtenerCarrito = async () => {
    try {
      setCargando(true);
      const res = await fetch(API_URL, { credentials: "include" });
      
      if (res.status === 401) {
        throw new Error("Debes iniciar sesión para ver tu carrito.");
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al cargar el carrito.");
      }

      setCartData(data);
      setError(null);
    } catch (err) {
      console.error("Error al obtener el carrito:", err);
      setError(err.message || "Ocurrió un error de red al conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerCarrito();
  }, []);

  const removeFromCart = async (cartItemId) => {
    try {
      const res = await fetch(`${API_URL}/remove/${cartItemId}`, {
        method: "DELETE",
        credentials: "include"
      });
      
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al eliminar el producto.");
      }

      setCartData(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== cartItemId)
      }));
    } catch (err) {
      alert(err.message);
    }
  };

  const formatCLP = (value) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0
    }).format(value || 0);
  };

  const getCartTotal = () => {
    if (!cartData || !cartData.items) return 0;
    return cartData.items.reduce((total, item) => {
      const precio = item.post?.precio || 0;
      return total + (precio * item.cantidad);
    }, 0);
  };

  // Lógica unificada para procesar el pago real-simulado
  const handleCheckout = async () => {
    const total = getCartTotal();
    if (total <= 0) return;

    try {
      setPagando(true);
      
      // Conexión con tu backend de Spring Boot
      const response = await fetch("https://localhost:8080/api/mercadopago/crear-preferencia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ total: Number(total) }) // Nos aseguramos de que viaje como número estricto
      });

      const data = await response.json();

      if (data.url) {
        // Redirección directa al Sandbox de Mercado Pago
        window.location.href = data.url;
      } else {
        alert("No se pudo generar la pasarela de pago.");
      }
    } catch (err) {
      console.error("Error al conectar con Mercado Pago:", err);
      alert("Hubo un error de red al intentar procesar el pago.");
    } finally {
      setPagando(false);
    }
  };

  if (cargando) {
    return <div style={estilos.stateMessage}>Cargando tu carrito... 🛒</div>;
  }

  if (error) {
    return (
      <div style={estilos.centeredWrapper}>
        <h2 style={estilos.errorTitle}>Ups! Algo salió mal</h2>
        <p style={estilos.errorText}>{error}</p>
        <button onClick={() => navigate("/login")} style={estilos.btnPrimary}>Ir al Login</button>
      </div>
    );
  }

  const items = cartData?.items || [];

  if (items.length === 0) {
    return (
      <div style={estilos.centeredWrapper}>
        <h2 style={estilos.emptyTitle}>Tu carrito está vacío 🛒</h2>
        <p style={estilos.errorText}>Explora el mercado y añade las mejores cartas a tu colección.</p>
        <button onClick={() => navigate("/catalog")} style={estilos.btnCatalog}>
          Volver al Catálogo
        </button>
      </div>
    );
  }

  return (
    <div style={estilos.container}>
      
      <div style={estilos.leftSection}>
        <h2 style={estilos.sectionTitle}>Tu Carrito de Compras</h2>
        
        {items.map((item) => (
          <div key={item.id} style={estilos.cartItemRow}>
            <img 
              src={item.post?.imagenUrl || "https://via.placeholder.com/80x110?text=TCG"} 
              alt={item.post?.titulo} 
              style={estilos.itemImg}
            />
            
            <div style={estilos.itemDetails}>
              <h4 style={estilos.itemTitle}>{item.post?.titulo || "Carta TCG"}</h4>
              <p style={estilos.itemStateText}>
                Estado: <span style={estilos.itemStateBadge}>{item.post?.estado || "NM"}</span>
              </p>
              <p style={estilos.itemQuantity}>Cantidad: {item.cantidad}</p>
            </div>
            
            <div style={estilos.itemPriceBlock}>
              <span style={estilos.itemPrice}>{formatCLP(item.post?.precio)}</span>
              <button onClick={() => removeFromCart(item.id)} style={estilos.btnDelete}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={estilos.rightSection}>
        <h3 style={estilos.summaryTitle}>Resumen de Pedido</h3>
        
        <div style={estilos.summaryRow}>
          <span>Artículos ({items.length}):</span>
          <span>{formatCLP(getCartTotal())}</span>
        </div>
        
        <div style={estilos.totalRow}>
          <span>Total:</span>
          <span style={estilos.totalValue}>{formatCLP(getCartTotal())}</span>
        </div>
        
        <button 
          onClick={handleCheckout}
          disabled={pagando}
          style={{
            ...estilos.btnCheckout,
            background: pagando ? "#64748b" : "#16a34a",
            cursor: pagando ? "not-allowed" : "pointer"
          }}
          onMouseEnter={(e) => !pagando && (e.currentTarget.style.background = "#15803d")}
          onMouseLeave={(e) => !pagando && (e.currentTarget.style.background = "#16a34a")}
        >
          {pagando ? "Conectando a Mercado Pago..." : "Proceder al Pago"}
        </button>
      </div>

    </div>
  );
};

const estilos = {
  stateMessage: { textAlign: "center", padding: "60px 20px", fontFamily: "sans-serif", color: "#64748b" },
  centeredWrapper: { textAlign: "center", padding: "60px 20px", fontFamily: "sans-serif" },
  errorTitle: { color: "#ef4444", fontSize: "22px" },
  errorText: { color: "#94a3b8", marginTop: "10px" },
  emptyTitle: { color: "#64748b", fontSize: "24px" },
  btnPrimary: { background: "#2563eb", color: "#fff", padding: "10px 20px", border: "none", borderRadius: "8px", cursor: "pointer", marginTop: "20px", fontWeight: "bold" },
  btnCatalog: { background: "#2563eb", color: "#fff", padding: "12px 24px", border: "none", borderRadius: "8px", cursor: "pointer", marginTop: "20px", fontWeight: "bold", fontSize: "15px" },
  container: { maxWidth: "1100px", margin: "40px auto", padding: "0 20px", fontFamily: "sans-serif", display: "flex", gap: "40px", flexWrap: "wrap" },
  leftSection: { flex: "2", minWidth: "320px" },
  sectionTitle: { borderBottom: "2px solid #f1f5f9", paddingBottom: "15px", color: "#0f172a", margin: "0 0 20px 0" },
  cartItemRow: { display: "flex", alignItems: "center", gap: "20px", padding: "20px 0", borderBottom: "1px solid #e2e8f0" },
  itemImg: { width: "75px", height: "105px", objectFit: "contain", borderRadius: "6px", background: "#f8fafc", padding: "4px" },
  itemDetails: { flex: 1 },
  itemTitle: { margin: "0 0 6px 0", fontSize: "16px", color: "#0f172a", fontWeight: "700" },
  itemStateText: { margin: 0, fontSize: "13px", color: "#475569" },
  itemStateBadge: { fontWeight: "600", color: "#2563eb" },
  itemQuantity: { margin: "4px 0 0 0", fontSize: "12px", color: "#94a3b8" },
  itemPriceBlock: { textAlign: "right" },
  itemPrice: { fontWeight: "700", color: "#b91c1c", fontSize: "17px", display: "block", marginBottom: "8px" },
  btnDelete: { background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "13px", textDecoration: "underline", padding: 0, fontWeight: "500" },
  rightSection: { flex: "1", minWidth: "280px", background: "#f8fafc", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", height: "fit-content", boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05)" },
  summaryTitle: { margin: "0 0 20px 0", color: "#0f172a", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px", fontSize: "18px" },
  summaryRow: { display: "flex", justifyContent: "space-between", marginBottom: "15px", color: "#475569", fontSize: "14px" },
  totalRow: { display: "flex", justifyContent: "space-between", marginBottom: "25px", fontWeight: "bold", fontSize: "19px", color: "#0f172a", borderTop: "1px solid #e2e8f0", paddingTop: "15px" },
  totalValue: { color: "#b91c1c" },
  btnCheckout: { width: "100%", color: "#fff", padding: "14px", border: "none", borderRadius: "8px", fontWeight: "bold", fontSize: "15px", boxShadow: "0 4px 6px -1px rgba(22,163,74,0.2)", transition: "all 0.2s" }
};

export default Cart;