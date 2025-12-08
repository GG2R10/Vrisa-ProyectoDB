import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Dashboard from './pages/public/Dashboard';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
// import PrivateRoute from './components/PrivateRoute'; // To be implemented

import MainLayout from './layouts/MainLayout';

import RegisterInstitution from './pages/auth/RegisterInstitution';
import RegisterStation from './pages/auth/RegisterStation';
import AdminDashboard from './pages/admin/AdminDashboard';
import EstacionesPage from './pages/estaciones/EstacionesPage';
import MedicionesPage from './pages/mediciones/MedicionesPage';
import ReportesPage from './pages/reportes/ReportesPage';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <MainLayout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register-institution" element={<RegisterInstitution />} />
            <Route path="/register-station" element={<RegisterStation />} />
            <Route path="/" element={<Dashboard />} />
            
            {/* Rutas de administración */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/estaciones" element={<EstacionesPage />} />
            <Route path="/mediciones" element={<MedicionesPage />} />
            <Route path="/reportes" element={<ReportesPage />} />
          </Routes>
        </MainLayout>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
