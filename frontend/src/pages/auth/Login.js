import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, AlertCircle } from 'lucide-react';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            await login(formData.username, formData.password);
            navigate('/');
        } catch (err) {
            setError('Credenciales inválidas. Por favor, intenta de nuevo.');
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
                                <h2 className="fw-bold mb-2">VriSA</h2>
                                <p className="text-muted">
                                    Monitoreo de Calidad del Aire
                                </p>
                            </div>

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-semibold">Email o Usuario</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <User size={18} />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            placeholder="Tu email o usuario"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            required
                                        />
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="small fw-semibold">Contraseña</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <Lock size={18} />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="password"
                                            placeholder="Tu contraseña"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            required
                                        />
                                    </InputGroup>
                                </Form.Group>

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
                                    {loading ? 'Ingresando...' : 'Ingresar'}
                                </Button>

                                <hr className="my-4" />

                                <div className="text-center">
                                    <small className="text-muted">
                                        ¿No tienes cuenta?{' '}
                                        <Link to="/register" className="text-decoration-none fw-semibold">
                                            Regístrate aquí
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

export default Login;

