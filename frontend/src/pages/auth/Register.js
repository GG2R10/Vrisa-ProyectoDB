import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, AlertCircle } from 'lucide-react';
import VriSALogo from '../../components/VriSALogo';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        confirmPassword: '',
        solicita_autoridad: false,
        solicita_investigador: false
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validaciones básicas
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            setLoading(false);
            return;
        }

        if (formData.password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres');
            setLoading(false);
            return;
        }

        try {
            const registerData = {
                username: formData.username,
                nombre: formData.nombre,
                apellido: formData.apellido,
                email: formData.email,
                password: formData.password,
                solicita_autoridad: formData.solicita_autoridad,
                solicita_investigador: formData.solicita_investigador
            };

            await register(registerData);
            navigate('/', { state: { message: 'Registro exitoso. Bienvenido a VriSA' } });
        } catch (err) {
            setError(err.message || 'Error en el registro. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
            <Row className="w-100 justify-content-center">
                <Col xs={12} md={10} lg={8} xl={6}>
                    <Card className="shadow-lg border-0">
                        <Card.Body className="p-5">
                            <div className="text-center mb-4">
                                <div className="mb-3">
                                    <VriSALogo size="lg" variant="full" />
                                </div>
                                <h2 className="fw-bold mb-2">Crear Cuenta</h2>
                                <p className="text-muted">
                                    Regístrate para acceder a la plataforma VriSA
                                </p>
                            </div>

                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="small fw-semibold">Nombre</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text>
                                                    <User size={18} />
                                                </InputGroup.Text>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Tu nombre"
                                                    name="nombre"
                                                    value={formData.nombre}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="small fw-semibold">Apellido</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text>
                                                    <User size={18} />
                                                </InputGroup.Text>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Tu apellido"
                                                    name="apellido"
                                                    value={formData.apellido}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-semibold">Nombre de usuario</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <User size={18} />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            placeholder="nombre_usuario"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            required
                                        />
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-semibold">Correo electrónico</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <Mail size={18} />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="email"
                                            placeholder="tu@email.com"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-semibold">Contraseña</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <Lock size={18} />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="password"
                                            placeholder="Mínimo 8 caracteres"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="small fw-semibold">Confirmar contraseña</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <Lock size={18} />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="password"
                                            placeholder="Confirma tu contraseña"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                    </InputGroup>
                                </Form.Group>

                                <div className="border-top pt-4 mb-4">
                                    <h6 className="fw-semibold mb-3">Opciones adicionales</h6>
                                    
                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            type="checkbox"
                                            id="autoridad"
                                            label="¿Eres una autoridad ambiental?"
                                            name="solicita_autoridad"
                                            checked={formData.solicita_autoridad}
                                            onChange={handleChange}
                                        />
                                        <small className="text-muted d-block mt-1">
                                            Si es así, tu solicitud será revisada por un administrador del sistema
                                        </small>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            type="checkbox"
                                            id="investigador"
                                            label="¿Quieres registrarte como investigador?"
                                            name="solicita_investigador"
                                            checked={formData.solicita_investigador}
                                            onChange={handleChange}
                                        />
                                        <small className="text-muted d-block mt-1">
                                            Los investigadores pueden ver datos de todas las estaciones
                                        </small>
                                    </Form.Group>
                                </div>

                                {error && (
                                    <Alert variant="danger" className="py-2 d-flex align-items-center">
                                        <AlertCircle size={18} className="me-2" />
                                        {error}
                                    </Alert>
                                )}

                                <Button 
                                    variant="primary" 
                                    type="submit" 
                                    className="w-100 py-2 mb-3"
                                    disabled={loading}
                                >
                                    {loading ? 'Registrando...' : 'Crear cuenta'}
                                </Button>

                                <div className="text-center">
                                    <small className="text-muted">
                                        ¿Ya tienes cuenta?{' '}
                                        <Link to="/login" className="text-decoration-none fw-semibold">
                                            Inicia sesión aquí
                                        </Link>
                                    </small>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;
