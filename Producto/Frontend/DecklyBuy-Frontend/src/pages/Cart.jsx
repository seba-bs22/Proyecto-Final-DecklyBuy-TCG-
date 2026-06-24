import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartData, setCartData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_URL = 'https://localhost:8080/api/cart';

  // 1. Cargar el carrito real desde Spring Boot usando FETCH
  const obtenerCarrito = async () => {
    try {
      setCargando(true);
      const res = await fetch(API_URL, { credentials: 'include' });
      
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

  // 2. Eliminar una carta usando FETCH (Método DELETE)
  const removeFromCart = async (cartItemId) => {
    try {
      const res = await fetch(`${API_URL}/remove/${cartItemId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al eliminar el producto.");
      }

      // Actualizamos el estado local si el backend respondió OK
      setCartData(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== cartItemId)
      }));
    } catch (err) {
      alert(err.message);
    }
  };

  // Función para dar formato de moneda chilena (CLP)
  const formatCLP = (value) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0
    }).format(value || 0);
  };

  // 3. Calcular el total acumulado de los posts guardados
  const getCartTotal = () => {
    if (!cartData || !cartData.items) return 0;
    return cartData.items.reduce((total, item) => {
      const precio = item.post?.precio || 0;
      return total + (precio * item.cantidad);
    }, 0);
  };

  const handleCheckout = async () => {
    alert("¡Pronto conectaremos esta pasarela con el proceso de Checkout en Spring Boot!");
    console.log("Orden lista para procesar:", cartData.items.map(item => ({ postId: item.post?.id })));
  };

  if (cargando) {
    return <div style={{ textAlign: 'center', padding: '60px 20px', fontFamily: 'sans-serif', color: '#64748b' }}>Cargando tu carrito... 🛒</div>;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', fontFamily: 'sans-serif' }}>
        <h2 style={{ color: '#ef4444', fontSize: '22px' }}>Ups! Algo salió mal</h2>
        <p style={{ color: '#94a3b8', marginTop: '10px' }}>{error}</p>
        <button onClick={() => navigate('/login')} style={{ background: '#2563eb', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '20px', fontWeight: 'bold' }}>Ir al Login</button>
      </div>
    );
  }

  const items = cartData?.items || [];

  // ESTADO VACÍO: Si no hay cartas en el carrito
  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', fontFamily: 'sans-serif' }}>
        <h2 style={{ color: '#64748b', fontSize: '24px' }}>Tu carrito está vacío 🛒</h2>
        <p style={{ color: '#94a3b8', marginTop: '10px' }}>Explora el mercado y añade las mejores cartas a tu colección.</p>
        <button 
          onClick={() => navigate('/catalog')}
          style={{ 
            background: '#2563eb', 
            color: '#fff', 
            padding: '12px 24px', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: 'pointer', 
            marginTop: '20px', 
            fontWeight: 'bold',
            fontSize: '15px'
          }}
        >
          Volver al Catálogo
        </button>
      </div>
    );
  }

  // ESTADO LLENO: Renderizado de la lista de productos y resumen de compra
  return (
    <div style={{ 
      maxWidth: '1100px', 
      margin: '40px auto', 
      padding: '0 20px', 
      fontFamily: 'sans-serif', 
      display: 'flex', 
      gap: '40px',
      flexWrap: 'wrap'
    }}>
      
      {/* SECCIÓN IZQUIERDA: LISTA DE PRODUCTOS */}
      <div style={{ flex: '2', minWidth: '320px' }}>
        <h2 style={{ borderBottom: '2px solid #f1f5f9', paddingBottom: '15px', color: '#0f172a', margin: '0 0 20px 0' }}>
          Tu Carrito de Compras
        </h2>
        
        {items.map((item) => (
          <div key={item.id} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '20px', 
            padding: '20px 0', 
            borderBottom: '1px solid #e2e8f0' 
          }}>
            <img 
              src={item.post?.imagenUrl || "https://via.placeholder.com/80x110?text=TCG"} 
              alt={item.post?.titulo} 
              style={{ width: '75px', height: '105px', objectFit: 'contain', borderRadius: '6px', background: '#f8fafc', padding: '4px' }}
            />
            
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#0f172a', fontWeight: '700' }}>
                {item.post?.titulo || "Carta TCG"}
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#475569' }}>
                Estado: <span style={{ fontWeight: '600', color: '#2563eb' }}>{item.post?.estado || "NM"}</span>
              </p>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
                Cantidad: {item.cantidad}
              </p>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontWeight: '700', color: '#b91c1c', fontSize: '17px', display: 'block', marginBottom: '8px' }}>
                {formatCLP(item.post?.precio)}
              </span>
              <button 
                onClick={() => removeFromCart(item.id)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#ef4444', 
                  cursor: 'pointer', 
                  fontSize: '13px', 
                  textDecoration: 'underline', 
                  padding: 0,
                  fontWeight: '500'
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* SECCIÓN DERECHA: CAJA RESUMEN DE TOTALES */}
      <div style={{ 
        flex: '1', 
        minWidth: '280px',
        background: '#f8fafc', 
        padding: '24px', 
        borderRadius: '12px', 
        border: '1px solid #e2e8f0', 
        height: 'fit-content',
        boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)'
      }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', fontSize: '18px' }}>
          Resumen de Pedido
        </h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#475569', fontSize: '14px' }}>
          <span>Artículos ({items.length}):</span>
          <span>{formatCLP(getCartTotal())}</span>
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginBottom: '25px', 
          fontWeight: 'bold', 
          fontSize: '19px', 
          color: '#0f172a', 
          borderTop: '1px solid #e2e8f0', 
          paddingTop: '15px' 
        }}>
          <span>Total:</span>
          <span style={{ color: '#b91c1c' }}>{formatCLP(getCartTotal())}</span>
        </div>
        
        <button 
          onClick={handleCheckout}
          style={{ 
            width: '100%', 
            background: '#16a34a', 
            color: '#fff', 
            padding: '14px', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: 'pointer', 
            fontWeight: 'bold', 
            fontSize: '15px', 
            boxShadow: '0 4px 6px -1px rgba(22,163,74,0.2)',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#15803d'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#16a34a'}
        >
          Proceder al Pago
        </button>
      </div>

    </div>
  );
};

export default Cart;