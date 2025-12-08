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
    FileText
} from 'lucide-react';

const Sidebar = ({ isOpen, closeMobile }) => {
    const { user } = useAuth();
    const { theme } = useTheme();
    const location = useLocation();

    const links = [
        { label: 'Mapa', path: '/', icon: <Map size={20} />, roles: ['public', 'admin_sistema', 'admin_institucion', 'admin_estacion', 'ciudadano'] },
        { label: 'Estaciones', path: '/estaciones', icon: <Radio size={20} />, roles: ['public', 'admin_sistema', 'admin_institucion', 'admin_estacion', 'ciudadano'] },
        { label: 'Mediciones', path: '/mediciones', icon: <TrendingUp size={20} />, roles: ['public', 'admin_sistema', 'admin_institucion', 'admin_estacion', 'ciudadano'] },
        { label: 'Alertas', path: '/alertas', icon: <AlertTriangle size={20} />, roles: ['public', 'admin_sistema', 'admin_institucion', 'admin_estacion', 'ciudadano'] },
        { label: 'Reportes', path: '/reportes', icon: <FileText size={20} />, roles: ['admin_sistema', 'admin_institucion', 'admin_estacion'] },
        { label: 'Panel Admin', path: '/admin/dashboard', icon: <Users size={20} />, roles: ['admin_sistema'] },
    ];

    // Filtrar enlaces basados en el rol
    const role = user?.rol || 'public';
    const activeLinks = links.filter(l => 
        l.roles.includes('public') || 
        l.roles.includes('ciudadano') || 
        (user && l.roles.includes(user.rol))
    );

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
