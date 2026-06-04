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
import Register from './pages/Register.jsx';
import CreatePost from './pages/CreatePost.jsx';
import LoginSuccess from './pages/LoginSuccess.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import './style.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login-success" element={<LoginSuccess />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<App />}>
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="home" element={<Home />} />
            <Route path="categories" element={<Categories />} />
            <Route path="create-post" element={<CreatePost />} />
            <Route path="offers" element={<Offers />} />
            <Route path="contact" element={<Contact />} />
            <Route path="account" element={<Account />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);