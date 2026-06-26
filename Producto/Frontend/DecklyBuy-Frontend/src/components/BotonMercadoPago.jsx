import React, { useState } from 'react';

export const BotonMercadoPago = ({ total }) => {
    const [loading, setLoading] = useState(false);

    const handlePago = async () => {
        setLoading(true);
        try {
            // Llamamos a nuestro endpoint del Backend enviando el total del carrito
            const response = await fetch('http://localhost:8080/api/mercadopago/crear-preferencia', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ total: total })
            });

            const data = await response.json();

            if (data.url) {
                // Redirigimos al usuario a la página segura de Mercado Pago
                window.location.href = data.url;
            } else {
                alert("No se pudo generar la URL de pago.");
            }
        } catch (error) {
            console.error("Error al procesar el pago:", error);
            alert("Hubo un error al conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button 
            onClick={handlePago} 
            disabled={loading || total <= 0}
            style={{
                backgroundColor: '#009ee3', // Azul clásico de Mercado Pago
                color: 'white',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                width: '100%',
                marginTop: '15px'
            }}
        >
            {loading ? 'Procesando...' : 'Pagar con Mercado Pago'}
        </button>
    );
};