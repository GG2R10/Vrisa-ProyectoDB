import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Nav, Offcanvas } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
    BarChart2,
    Map,
    AlertTriangle,
    Users,
    Building,
    Radio,
    TrendingUp,
    FileText,
    Settings,
    BookOpen
} from 'lucide-react';

const Sidebar = ({ isOpen, closeMobile }) => {
    const { user } = useAuth();
    const { theme } = useTheme();
    const location = useLocation();

    // Definir enlaces por rol
    const getLinksByRole = (userRole) => {
        const publicLinks = [
            { label: 'Mapa', path: '/', icon: <Map size={20} />, roles: ['public', 'ciudadano', 'admin_sistema', 'admin_institucion', 'admin_estacion', 'tecnico', 'investigador', 'autoridad'] },
            { label: 'Estaciones', path: '/estaciones', icon: <Radio size={20} />, roles: ['public', 'ciudadano', 'admin_sistema', 'admin_institucion', 'admin_estacion', 'tecnico', 'investigador', 'autoridad'] },
            { label: 'Mediciones', path: '/mediciones', icon: <TrendingUp size={20} />, roles: ['public', 'ciudadano', 'admin_sistema', 'admin_institucion', 'admin_estacion', 'tecnico', 'investigador', 'autoridad'] },
            { label: 'Alertas', path: '/alertas', icon: <AlertTriangle size={20} />, roles: ['admin_sistema', 'admin_institucion', 'admin_estacion', 'tecnico', 'investigador', 'autoridad'] },
            { label: 'Reportes', path: '/reportes', icon: <FileText size={20} />, roles: ['ciudadano', 'admin_sistema', 'admin_institucion', 'admin_estacion', 'tecnico', 'investigador', 'autoridad'] },
        ];

        const citizenLinks = [
            { label: 'Mis Opciones', path: '/citizen/opciones', icon: <Settings size={20} />, roles: ['ciudadano'] },
        ];

        const adminLinks = [
            { label: 'Panel Admin Sistema', path: '/admin/sistema', icon: <Users size={20} />, roles: ['admin_sistema'] },
            { label: 'Mis Estaciones', path: '/admin/estaciones', icon: <Radio size={20} />, roles: ['admin_institucion', 'admin_estacion'] },
        ];

        const allLinks = [...publicLinks, ...citizenLinks, ...adminLinks];

        // Filtrar links basados en el rol
        return allLinks.filter(link => {
            if (link.roles.includes('public')) return true;
            if (userRole && link.roles.includes(userRole)) return true;
            return false;
        });
    };

    const role = user?.tipo || 'public';
    const activeLinks = getLinksByRole(role);

    const SidebarContent = () => (
        <div className="p-3">
            <h6 className="text-uppercase text-muted fw-semibold mb-3 small">Menú</h6>
            <Nav className="flex-column">
                {activeLinks.map(link => {
                    const isActive = location.pathname === link.path;
                    return (
                        <Nav.Link
                            key={link.path}
                            as={Link}
                            to={link.path}
                            onClick={closeMobile}
                            className={`d-flex align-items-center py-2 px-3 mb-1 rounded ${
                                isActive ? 'active' : ''
                            }`}
                            style={isActive ? {
                                backgroundColor: `${theme.primaryColor}15`,
                                color: theme.primaryColor,
                                fontWeight: '500'
                            } : {
                                color: '#6c757d'
                            }}
                        >
                            <span className="me-3" style={isActive ? { color: theme.primaryColor } : {}}>
                                {link.icon}
                            </span>
                            {link.label}
                        </Nav.Link>
                    );
                })}
            </Nav>

            {/* Mostrar información del rol */}
            {user && role !== 'ciudadano' && (
                <div className="mt-4 pt-4 border-top">
                    <h6 className="text-uppercase text-muted fw-semibold small mb-2">Tu Rol</h6>
                    <div className="badge" style={{ backgroundColor: theme.primaryColor }}>
                        {role === 'admin_sistema' && 'Admin del Sistema'}
                        {role === 'admin_institucion' && 'Admin de Institución'}
                        {role === 'admin_estacion' && 'Admin de Estación'}
                        {role === 'tecnico' && 'Técnico'}
                        {role === 'investigador' && 'Investigador'}
                        {role === 'autoridad' && 'Autoridad Ambiental'}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <>
            {/* Sidebar para Desktop */}
            <aside className="d-none d-md-block bg-white border-end" style={{ width: '260px', minHeight: '100vh' }}>
                <SidebarContent />
            </aside>

            {/* Offcanvas para Mobile */}
            <Offcanvas 
                show={isOpen} 
                onHide={closeMobile} 
                placement="start"
                className="d-md-none"
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Menú</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="p-0">
                    <SidebarContent />
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default Sidebar;

