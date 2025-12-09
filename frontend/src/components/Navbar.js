import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar as BSNavbar, Container, Nav, Button, Dropdown } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, Menu, User } from 'lucide-react';
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

                <Nav className="ms-auto d-flex align-items-center gap-2">
                    {user ? (
                        <>
                            <span className="text-muted small d-none d-md-inline me-3">
                                Bienvenido, <strong>{user.nombre}</strong>
                            </span>
                            <Dropdown>
                                <Dropdown.Toggle 
                                    variant="outline-secondary" 
                                    size="sm"
                                    className="d-flex align-items-center"
                                >
                                    <User size={18} className="me-2" />
                                    <span className="d-none d-md-inline">Perfil</span>
                                </Dropdown.Toggle>

                                <Dropdown.Menu align="end">
                                    <Dropdown.Item disabled>
                                        <small className="text-muted">{user.email}</small>
                                    </Dropdown.Item>
                                    <Dropdown.Divider />
                                    {user.tipo === 'ciudadano' && (
                                        <>
                                            <Dropdown.Item as={Link} to="/citizen/opciones">
                                                Mi Panel
                                            </Dropdown.Item>
                                            <Dropdown.Divider />
                                        </>
                                    )}
                                    {user.tipo === 'admin_sistema' && (
                                        <>
                                            <Dropdown.Item as={Link} to="/admin/sistema">
                                                Panel de Admin
                                            </Dropdown.Item>
                                            <Dropdown.Divider />
                                        </>
                                    )}
                                    <Dropdown.Item onClick={logout} className="text-danger">
                                        <LogOut size={16} className="me-2" /> Cerrar sesión
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </>
                    ) : (
                        <>
                            <Button 
                                as={Link} 
                                to="/login"
                                variant="outline-secondary"
                                size="sm"
                            >
                                Inicia sesión
                            </Button>
                            <Button 
                                as={Link} 
                                to="/register"
                                size="sm"
                                style={{ backgroundColor: theme.primaryColor, borderColor: theme.primaryColor }}
                                className="text-white"
                            >
                                Registrarse
                            </Button>
                        </>
                    )}
                </Nav>
            </Container>
        </BSNavbar>
    );
};

export default Navbar;

