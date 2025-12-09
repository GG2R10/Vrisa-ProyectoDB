import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, ProgressBar } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Building, Upload, ArrowLeft, Check } from 'lucide-react';
import VriSALogo from '../../components/VriSALogo';

const RegisterInstitution = () => {
    const navigate = useNavigate();
    const { registerInstitution } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    
    const [formData, setFormData] = useState({
        // Información de la institución
        nombre: '',
        descripcion: '',
        tipo_institucion: 'publica',
        email_contacto: '',
        telefono: '',
        direccion: '',
        logo_url: '',
        color_primario: '#0d6efd',
        color_secundario: '#6c757d',
        
        // Datos del administrador
        admin_nombre_completo: '',
        admin_username: '',
        admin_email: '',
        admin_password: '',
        admin_password_confirm: ''
    });

    const [logoPreview, setLogoPreview] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Crear preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
                setFormData(prev => ({
                    ...prev,
                    logo_url: reader.result // En producción, esto debe subirse al servidor
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const validateStep1 = () => {
        if (!formData.nombre || !formData.tipo_institucion || !formData.email_contacto) {
            setError('Por favor completa todos los campos obligatorios');
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        if (!formData.admin_username || !formData.admin_email || !formData.admin_password) {
            setError('Por favor completa todos los campos del administrador');
            return false;
        }
        if (formData.admin_password !== formData.admin_password_confirm) {
            setError('Las contraseñas no coinciden');
            return false;
        }
        if (formData.admin_password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres');
            return false;
        }
        return true;
    };

    const handleNext = () => {
        setError('');
        if (currentStep === 1 && validateStep1()) {
            setCurrentStep(2);
        }
    };

    const handleBack = () => {
        setError('');
        setCurrentStep(1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!validateStep2()) return;
        
        setLoading(true);
        
        try {
            await registerInstitution(formData);
            setSuccess(true);
            
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.message || 'Error al registrar institución');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <Container className="min-vh-100 d-flex align-items-center justify-content-center">
                <Card className="shadow-lg border-0 text-center p-5" style={{ maxWidth: '500px' }}>
                    <div className="mb-4">
                        <div 
                            className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: '80px', height: '80px', backgroundColor: '#d1e7dd' }}
                        >
                            <Check size={48} color="#0f5132" />
                        </div>
                        <h3 className="fw-bold text-success mb-3">¡Registro Exitoso!</h3>
                        <p className="text-muted">
                            Tu institución <strong>{formData.nombre}</strong> ha sido registrada correctamente.
                        </p>
                        <Alert variant="info" className="mt-3">
                            <small>
                                Recibirás una notificación por correo cuando tu institución sea aprobada por el administrador del sistema.
                            </small>
                        </Alert>
                    </div>
                    <Button 
                        variant="primary" 
                        onClick={() => navigate('/login')}
                    >
                        Ir al inicio de sesión
                    </Button>
                </Card>
            </Container>
        );
    }

    return (
        <Container fluid className="py-5" style={{ backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
            <Container>
                <Row className="justify-content-center">
                    <Col xs={12} lg={10} xl={8}>
                        <div className="mb-4">
                            <Button 
                                variant="link" 
                                className="text-decoration-none p-0 mb-3"
                                onClick={() => navigate('/login')}
                            >
                                <ArrowLeft size={20} className="me-2" />
                                Volver al inicio
                            </Button>
                        </div>

                        <Card className="shadow-lg border-0 rounded-4">
                            <Card.Body className="p-5">
                                <div className="text-center mb-4">
                                    <div className="mb-3">
                                        <VriSALogo size="lg" variant="full" />
                                    </div>
                                    <h2 className="fw-bold mb-2">Registro de Institución</h2>
                                    <p className="text-muted">
                                        Únete a la red de monitoreo ambiental de Cali
                                    </p>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-5">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className={`small fw-semibold ${currentStep === 1 ? 'text-primary' : 'text-muted'}`}>
                                            Datos de la Institución
                                        </span>
                                        <span className={`small fw-semibold ${currentStep === 2 ? 'text-primary' : 'text-muted'}`}>
                                            Administrador
                                        </span>
                                    </div>
                                    <ProgressBar now={(currentStep / 2) * 100} variant="primary" />
                                </div>

                                <Form onSubmit={handleSubmit}>
                                    {/* PASO 1: Información de la Institución */}
                                    {currentStep === 1 && (
                                        <>
                                            <h5 className="fw-bold mb-4">Información de la Institución</h5>
                                            
                                            <Row>
                                                <Col md={12} className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label className="fw-semibold">
                                                            Nombre Oficial de la Institución <span className="text-danger">*</span>
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="nombre"
                                                            value={formData.nombre}
                                                            onChange={handleChange}
                                                            placeholder="Ej: Universidad del Valle"
                                                            required
                                                            size="lg"
                                                        />
                                                    </Form.Group>
                                                </Col>

                                                <Col md={6} className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label className="fw-semibold">
                                                            Tipo de Institución <span className="text-danger">*</span>
                                                        </Form.Label>
                                                        <Form.Select
                                                            name="tipo_institucion"
                                                            value={formData.tipo_institucion}
                                                            onChange={handleChange}
                                                            required
                                                            size="lg"
                                                        >
                                                            <option value="publica">Pública</option>
                                                            <option value="privada">Privada</option>
                                                            <option value="mixta">Mixta</option>
                                                            <option value="ong">ONG</option>
                                                        </Form.Select>
                                                    </Form.Group>
                                                </Col>

                                                <Col md={6} className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label className="fw-semibold">
                                                            Email de Contacto <span className="text-danger">*</span>
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="email"
                                                            name="email_contacto"
                                                            value={formData.email_contacto}
                                                            onChange={handleChange}
                                                            placeholder="contacto@institucion.edu.co"
                                                            required
                                                            size="lg"
                                                        />
                                                    </Form.Group>
                                                </Col>

                                                <Col md={6} className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label className="fw-semibold">Teléfono</Form.Label>
                                                        <Form.Control
                                                            type="tel"
                                                            name="telefono"
                                                            value={formData.telefono}
                                                            onChange={handleChange}
                                                            placeholder="+57 300 123 4567"
                                                            size="lg"
                                                        />
                                                    </Form.Group>
                                                </Col>

                                                <Col md={6} className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label className="fw-semibold">Dirección</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="direccion"
                                                            value={formData.direccion}
                                                            onChange={handleChange}
                                                            placeholder="Calle 13 # 100-00, Cali"
                                                            size="lg"
                                                        />
                                                    </Form.Group>
                                                </Col>

                                                <Col md={12} className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label className="fw-semibold">Descripción</Form.Label>
                                                        <Form.Control
                                                            as="textarea"
                                                            rows={3}
                                                            name="descripcion"
                                                            value={formData.descripcion}
                                                            onChange={handleChange}
                                                            placeholder="Breve descripción de la institución y su interés en el monitoreo ambiental"
                                                        />
                                                    </Form.Group>
                                                </Col>

                                                <Col md={6} className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label className="fw-semibold">Color Primario</Form.Label>
                                                        <div className="d-flex align-items-center gap-3">
                                                            <Form.Control
                                                                type="color"
                                                                name="color_primario"
                                                                value={formData.color_primario}
                                                                onChange={handleChange}
                                                                style={{ width: '80px', height: '45px', cursor: 'pointer' }}
                                                            />
                                                            <Form.Control
                                                                type="text"
                                                                value={formData.color_primario}
                                                                onChange={handleChange}
                                                                name="color_primario"
                                                                className="font-monospace"
                                                            />
                                                        </div>
                                                        <Form.Text className="text-muted">
                                                            Color principal de tu institución
                                                        </Form.Text>
                                                    </Form.Group>
                                                </Col>

                                                <Col md={6} className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label className="fw-semibold">Color Secundario</Form.Label>
                                                        <div className="d-flex align-items-center gap-3">
                                                            <Form.Control
                                                                type="color"
                                                                name="color_secundario"
                                                                value={formData.color_secundario}
                                                                onChange={handleChange}
                                                                style={{ width: '80px', height: '45px', cursor: 'pointer' }}
                                                            />
                                                            <Form.Control
                                                                type="text"
                                                                value={formData.color_secundario}
                                                                onChange={handleChange}
                                                                name="color_secundario"
                                                                className="font-monospace"
                                                            />
                                                        </div>
                                                        <Form.Text className="text-muted">
                                                            Color secundario de tu institución
                                                        </Form.Text>
                                                    </Form.Group>
                                                </Col>

                                                <Col md={12} className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label className="fw-semibold">Logo Institucional</Form.Label>
                                                        <div 
                                                            className="border-2 border-dashed rounded p-4 text-center position-relative"
                                                            style={{ 
                                                                borderColor: logoPreview ? '#0d6efd' : '#dee2e6',
                                                                backgroundColor: logoPreview ? '#f8f9fa' : '#fff',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={handleFileChange}
                                                                className="position-absolute w-100 h-100 opacity-0"
                                                                style={{ cursor: 'pointer', top: 0, left: 0 }}
                                                            />
                                                            {logoPreview ? (
                                                                <div>
                                                                    <img 
                                                                        src={logoPreview} 
                                                                        alt="Logo preview" 
                                                                        className="mb-3"
                                                                        style={{ maxHeight: '120px', maxWidth: '100%' }}
                                                                    />
                                                                    <p className="text-success fw-semibold mb-0">
                                                                        Logo cargado ✓
                                                                    </p>
                                                                    <small className="text-muted">Click para cambiar</small>
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    <Upload className="mx-auto mb-3 text-muted" size={40} />
                                                                    <p className="fw-semibold mb-1">Click para subir logo</p>
                                                                    <small className="text-muted">PNG, JPG o SVG (máx. 2MB)</small>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Form.Group>
                                                </Col>
                                            </Row>

                                            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

                                            <div className="d-flex justify-content-end mt-4">
                                                <Button 
                                                    variant="primary" 
                                                    size="lg"
                                                    onClick={handleNext}
                                                    style={{ minWidth: '150px' }}
                                                >
                                                    Siguiente
                                                </Button>
                                            </div>
                                        </>
                                    )}

                                    {/* PASO 2: Datos del Administrador */}
                                    {currentStep === 2 && (
                                        <>
                                            <h5 className="fw-bold mb-4">Datos del Administrador</h5>
                                            <Alert variant="info" className="mb-4">
                                                <small>
                                                    Esta persona será el administrador principal de la institución en la plataforma
                                                </small>
                                            </Alert>
                                            
                                            <Row>
                                                <Col md={12} className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label className="fw-semibold">
                                                            Nombre Completo <span className="text-danger">*</span>
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="admin_nombre_completo"
                                                            value={formData.admin_nombre_completo}
                                                            onChange={handleChange}
                                                            placeholder="Juan Pérez García"
                                                            required
                                                            size="lg"
                                                        />
                                                    </Form.Group>
                                                </Col>

                                                <Col md={6} className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label className="fw-semibold">
                                                            Nombre de Usuario <span className="text-danger">*</span>
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="admin_username"
                                                            value={formData.admin_username}
                                                            onChange={handleChange}
                                                            placeholder="admin_univalle"
                                                            required
                                                            size="lg"
                                                        />
                                                        <Form.Text className="text-muted">
                                                            Usado para iniciar sesión
                                                        </Form.Text>
                                                    </Form.Group>
                                                </Col>

                                                <Col md={6} className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label className="fw-semibold">
                                                            Email <span className="text-danger">*</span>
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="email"
                                                            name="admin_email"
                                                            value={formData.admin_email}
                                                            onChange={handleChange}
                                                            placeholder="admin@univalle.edu.co"
                                                            required
                                                            size="lg"
                                                        />
                                                    </Form.Group>
                                                </Col>

                                                <Col md={6} className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label className="fw-semibold">
                                                            Contraseña <span className="text-danger">*</span>
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="password"
                                                            name="admin_password"
                                                            value={formData.admin_password}
                                                            onChange={handleChange}
                                                            placeholder="••••••••"
                                                            required
                                                            minLength={8}
                                                            size="lg"
                                                        />
                                                        <Form.Text className="text-muted">
                                                            Mínimo 8 caracteres
                                                        </Form.Text>
                                                    </Form.Group>
                                                </Col>

                                                <Col md={6} className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label className="fw-semibold">
                                                            Confirmar Contraseña <span className="text-danger">*</span>
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="password"
                                                            name="admin_password_confirm"
                                                            value={formData.admin_password_confirm}
                                                            onChange={handleChange}
                                                            placeholder="••••••••"
                                                            required
                                                            size="lg"
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>

                                            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

                                            <div className="d-flex justify-content-between mt-4">
                                                <Button 
                                                    variant="outline-secondary" 
                                                    size="lg"
                                                    onClick={handleBack}
                                                    style={{ minWidth: '150px' }}
                                                >
                                                    Atrás
                                                </Button>
                                                <Button 
                                                    variant="primary" 
                                                    type="submit"
                                                    size="lg"
                                                    disabled={loading}
                                                    style={{ 
                                                        minWidth: '200px',
                                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                        border: 'none'
                                                    }}
                                                >
                                                    {loading ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" />
                                                            Registrando...
                                                        </>
                                                    ) : (
                                                        'Enviar Solicitud'
                                                    )}
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
};

export default RegisterInstitution;
