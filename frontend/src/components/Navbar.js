import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar as BSNavbar, Container, Nav, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, Menu } from 'lucide-react';
import VriSALogo from './VriSALogo';

const Navbar = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();
    const { theme } = useTheme();

    return (
        <BSNavbar 
            bg="white" 
            expand="lg" 
            className="shadow-sm"
            style={{ borderTop: `4px solid ${theme.primaryColor}` }}
        >
            <Container fluid className="px-4">
                <Button 
                    variant="outline-secondary" 
                    className="d-lg-none me-2 border-0"
                    onClick={toggleSidebar}
                    aria-label="Toggle Sidebar"
                >
                    <Menu size={24} />
                </Button>

                <BSNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
                    <VriSALogo size="sm" variant="full" />
                </BSNavbar.Brand>

                <Nav className="ms-auto d-flex align-items-center">
                    {user ? (
                        <>
                            <span className="text-muted small d-none d-md-inline me-3">
                                Bienvenido, {user.username}
                            </span>
                            <Button 
                                variant="outline-secondary" 
                                size="sm" 
                                onClick={logout}
                                className="d-flex align-items-center"
                            >
                                <LogOut size={18} className="me-1" />
                                <span className="d-none d-md-inline">Cerrar sesión</span>
                            </Button>
                        </>
                    ) : (
                        <Button 
                            as={Link} 
                            to="/login"
                            style={{ backgroundColor: theme.primaryColor, borderColor: theme.primaryColor }}
                            className="text-white"
                        >
                            Iniciar sesión
                        </Button>
                    )}
                </Nav>
            </Container>
        </BSNavbar>
    );
};

export default Navbar;
