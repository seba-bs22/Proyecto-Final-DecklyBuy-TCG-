import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import App from './App.jsx';
import Categories from './pages/Categories.jsx';
import Home from './pages/Home.jsx';
import Account from './pages/Account.jsx';
import Offers from './pages/Offers.jsx';
import Contact from './pages/Contact.jsx';
import Login from './pages/Login.jsx';
import LoginVerify from './pages/LoginVerify.jsx';
import Register from './pages/Register.jsx';
import VerifyCode from './pages/VerifyCode.jsx';   
import CreatePost from './pages/CreatePost.jsx';
import Posts from './pages/Posts.jsx';   
import EditPost from './pages/EditPost.jsx'; 
import LoginSuccess from './pages/LoginSuccess.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';

// IMPORTACIÓN DEL NUEVO MERCADO GLOBAL Y DETALLE DE CARTA
import Catalog from './pages/Catalog.jsx'; 
import CardDetail from './pages/CardDetail.jsx'; 

// IMPORTACIÓN DE LA WISHLIST
import WishlistPage from './pages/Wishlist.jsx'; 

// 🛒 IMPORTACIONES COMPLETAS DEL CARRITO (CON EL PROVIDER QUE FALTABA)
import { CartProvider } from './context/CartContext.jsx'; // <-- ¡Agregado para evitar el pantallazo en blanco!
import Cart from './pages/Cart.jsx';

import './style.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider> {/* Envolviendo el árbol correctamente */}
        <Routes>

          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/login-verify" element={<LoginVerify />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-code" element={<VerifyCode />} />
          <Route path="/login-success" element={<LoginSuccess />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<App />}>
              <Route index element={<Navigate to="/home" replace />} />
              <Route path="home" element={<Home />} />
              <Route path="categories" element={<Categories />} />
              <Route path="catalog" element={<Catalog />} />
              <Route path="card/:cardId" element={<CardDetail />} />
              
              {/* Ruta física del carrito */}
              <Route path="carrito" element={<Cart />} />

              <Route path="create-post" element={<CreatePost />} />
              <Route path="posts" element={<Posts />} /> 
              <Route path="edit-post/:id" element={<EditPost />} /> 
              <Route path="offers" element={<Offers />} />
              <Route path="contact" element={<Contact />} />
              <Route path="account" element={<Account />} />
              <Route path="wishlist" element={<WishlistPage />} />
            </Route>
          </Route>

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);