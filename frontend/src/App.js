import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/public/Dashboard';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import MainLayout from './layouts/MainLayout';

import RegisterInstitution from './pages/auth/RegisterInstitution';
import RegisterStation from './pages/auth/RegisterStation';
import AdminSystemDashboard from './pages/admin/AdminSystemDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import CitizenOptions from './pages/citizen/CitizenOptions';
import EstacionesPage from './pages/estaciones/EstacionesPage';
import MedicionesPage from './pages/mediciones/MedicionesPage';
import ReportesPage from './pages/reportes/ReportesPage';
import AlertasPage from './components/alertas/AlertasList';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainLayout>
          <Routes>
            {/* Rutas de autenticación */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Rutas heredadas (para compatibilidad) */}
            <Route path="/register-institution" element={<RegisterInstitution />} />
            <Route path="/register-station" element={<RegisterStation />} />
            
            {/* Rutas públicas */}
            <Route path="/" element={<Dashboard />} />
            
            {/* Rutas de ciudadano */}
            <Route path="/citizen/opciones" element={<CitizenOptions />} />
            
            {/* Rutas de datos */}
            <Route path="/estaciones" element={<EstacionesPage />} />
            <Route path="/mediciones" element={<MedicionesPage />} />
            <Route path="/reportes" element={<ReportesPage />} />
            <Route path="/alertas" element={<AlertasPage />} />
            
            {/* Rutas de administración */}
            <Route path="/admin/sistema" element={<AdminSystemDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/estaciones" element={<AdminDashboard />} />
          </Routes>
        </MainLayout>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

