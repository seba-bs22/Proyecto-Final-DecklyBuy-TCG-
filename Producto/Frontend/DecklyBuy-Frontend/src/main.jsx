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
import PostDetail from './pages/PostDetail.jsx'; // 👈 IMPORTACIÓN DE LA NUEVA VISTA DETALLE
import LoginSuccess from './pages/LoginSuccess.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import Catalog from './pages/Catalog.jsx'; 
import CardDetail from './pages/CardDetail.jsx'; 
import SellerProfile from './pages/SellerProfile.jsx'; 
import WishlistPage from './pages/Wishlist.jsx'; 
import { CartProvider } from './context/CartContext.jsx'; 
import Cart from './pages/Cart.jsx';
import CompleteProfile from './pages/CompleteProfile.jsx';

import './style.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <Routes>
          {/* 1. Rutas Públicas de Autenticación */}
          <Route path="/login" element={<Login />} />
          <Route path="/login-verify" element={<LoginVerify />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-code" element={<VerifyCode />} />
          <Route path="/login-success" element={<LoginSuccess />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* 2. Filtro de Protección del Sistema */}
          <Route element={<ProtectedRoute />}>
            
            {/* Si el perfil está INCOMPLETO, solo puede ver esto */}
            <Route path="/completar-perfil" element={<CompleteProfile />} />

            {/* Si el perfil ya está COMPLETO, puede acceder a la app principal */}
            <Route path="/" element={<App />}>
              <Route index element={<Navigate to="/home" replace />} />
              <Route path="home" element={<Home />} />
              <Route path="categories" element={<Categories />} />
              <Route path="catalog" element={<Catalog />} />
              <Route path="card/:cardId" element={<CardDetail />} />
              <Route path="vendedor/:vendorId" element={<SellerProfile />} />
              <Route path="carrito" element={<Cart />} />
              <Route path="create-post" element={<CreatePost />} />
              <Route path="posts" element={<Posts />} /> 
              
              {/* ─── RUTAS MANEJADORAS DE PUBLICACIONES INDIVIDUALES ─── */}
              <Route path="posts/:id" element={<PostDetail />} /> {/* 👈 NUEVA RUTA AGREGADA */}
              <Route path="edit-post/:id" element={<EditPost />} /> 
              
              <Route path="offers" element={<Offers />} />
              <Route path="contact" element={<Contact />} />
              <Route path="account" element={<Account />} />
              <Route path="wishlist" element={<WishlistPage />} />
            </Route>

          </Route>

          {/* Fallback global */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);