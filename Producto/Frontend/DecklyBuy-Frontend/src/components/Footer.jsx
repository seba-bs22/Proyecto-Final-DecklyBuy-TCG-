import React from 'react';

const Footer = () => (
  <footer className="footer">
    <div className="footer-contenido">
      <p>&copy; 2025 DecklyBuyTCG. Todos los derechos reservados.</p>
      <ul className="footer-enlaces">
        <li><a href="#">Política de Privacidad</a></li>
        <li><a href="#">Términos y Condiciones</a></li>
        <li><a href="#">Contacto</a></li>
      </ul>
      <div className="footer-redes">
        <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
        <a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a>
      </div>
    </div>
  </footer>
);

export default Footer;