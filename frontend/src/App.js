import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomeAdmin from './pages/HomeAdmin';
import HomeEmployee from './pages/HomeEmployee';
import Payslip from './pages/Payslip';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />}/>
      <Route path="/register" element={<RegisterPage />}/>
      <Route path='/home' element={<HomeAdmin />}/>
      <Route path='/home_employee' element={<HomeEmployee />}/>
      <Route path='/payslip/:employeeId' element={<Payslip />}/>
      {/* Luego añadiremos rutas privadas aquí */}
    </Routes>
  );
}

export default App;