// src/components/Header.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isEmployeePage = location.pathname.startsWith('/employee');

  const handleLogout = () => {
    // Aquí tu lógica de logout: limpiar token, etc.
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="logo">
        <img src="/logo1000.png" alt="Logo Web_Nomicalc" />
      </div>
      <div className="header-right">
        <span className="welcome-text">
          {isEmployeePage ? 'Bienvenido(a) Empleado' : 'Bienvenido(a) User'}
        </span>
        <button className="btn logout" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
}
