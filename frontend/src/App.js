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

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <MainLayout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register-institution" element={<RegisterInstitution />} />
            <Route path="/register-station" element={<RegisterStation />} />
            <Route path="/admin/approvals" element={<AdminDashboard />} />
            <Route path="/" element={<Dashboard />} />
            {/* Add more routes here */}
          </Routes>
        </MainLayout>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
