import React, { useState, useEffect, useRef } from "react";

const TcgChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hola. Soy tu asistente de DecklyBuy TCG. Puedo ayudarte a verificar sets, numeraciones o complementar los analisis visuales de las cartas. ¿Que duda tienes hoy?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Mantiene el scroll posicionado en el ultimo mensaje de la lista
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Agregar el mensaje del usuario a la interfaz inmediatamente
    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: input
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    try {
      // Peticion HTTP POST al endpoint del controlador de Spring Boot
      const response = await fetch("https://localhost:8080/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: currentInput }),
        credentials: "include"
      });

      if (response.ok) {
        const result = await response.json();
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: "ai",
            text: result.response || "Consulta procesada."
          }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: "ai",
            text: "No se pudo obtener respuesta del servidor de IA. Intentalo de nuevo."
          }
        ]);
      }
    } catch (error) {
      console.error("Error al conectar con la API de IA:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: "Error de comunicacion con el backend."
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{ position: "fixed", bottom: "25px", right: "25px", zIndex: 9999, fontFamily: "sans-serif" }}>
      
      {/* Ventana de conversacion (Desplegable) */}
      {isOpen && (
        <div style={{
          width: "360px",
          height: "480px",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          marginBottom: "15px",
          border: "1px solid #eaeaea"
        }}>
          
          {/* Cabecera del Chat */}
          <div style={{ background: "#0275d8", color: "#fff", padding: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "bold" }}>Consultor Experto TCG</h3>
              <span style={{ fontSize: "0.75rem", opacity: 0.85 }}>En linea (IA Local)</span>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: "#fff", fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
          </div>

          {/* Area del historial de mensajes */}
          <div style={{ flex: 1, padding: "15px", overflowY: "auto", background: "#f8f9fa", display: "flex", flexDirection: "column", gap: "12px" }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ display: "flex", justifyContent: msg.sender === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "80%",
                  padding: "10px 14px",
                  borderRadius: msg.sender === "user" ? "14px 14px 0 14px" : "14px 14px 14px 0",
                  background: msg.sender === "user" ? "#0275d8" : "#ffffff",
                  color: msg.sender === "user" ? "#ffffff" : "#222222",
                  fontSize: "0.9rem",
                  lineHeight: "1.35",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  border: msg.sender === "user" ? "none" : "1px solid #eef0f2"
                }}>
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Estado de carga cuando el modelo responde */}
            {isTyping && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ background: "#e9ecef", color: "#666", padding: "8px 12px", borderRadius: "14px 14px 14px 0", fontSize: "0.85rem", fontStyle: "italic" }}>
                  Analizando base de datos TCG...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Formulario de entrada de texto */}
          <form onSubmit={handleSendMessage} style={{ display: "flex", padding: "12px", background: "#fff", borderTop: "1px solid #eee", gap: "8px" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregunta sobre sets o cartas..."
              disabled={isTyping}
              style={{ flex: 1, padding: "10px 12px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "0.85rem", outline: "none" }}
            />
            <button
              type="submit"
              disabled={isTyping || !input.trim()}
              style={{ padding: "0 14px", background: isTyping || !input.trim() ? "#a0c5e8" : "#0275d8", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "0.85rem" }}
            >
              Enviar
            </button>
          </form>

        </div>
      )}

      {/* Boton flotante circular (Alternador de apertura) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "#0275d8",
          color: "white",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 4px 15px rgba(2,117,216,0.4)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "1.1rem",
          fontWeight: "bold",
          outline: "none"
        }}
      >
        {isOpen ? "Cerrar" : "IA Chat"}
      </button>

    </div>
  );
};

export default TcgChatWidget;