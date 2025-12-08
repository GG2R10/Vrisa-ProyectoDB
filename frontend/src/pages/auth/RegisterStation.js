import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import institucionService from '../../services/institucionService';
import { Radio, ArrowLeft, Check, MapPin } from 'lucide-react';
import VriSALogo from '../../components/VriSALogo';

const RegisterStation = () => {
    const navigate = useNavigate();
    const { registerStation } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [instituciones, setInstituciones] = useState([]);
    const [loadingInstituciones, setLoadingInstituciones] = useState(true);
    
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        latitud: '',
        longitud: '',
        direccion: '',
        institucion: '',
        tipo_sensores: [],
        // Datos del administrador
        admin_nombre_completo: '',
        admin_username: '',
        admin_email: '',
        admin_password: '',
        admin_password_confirm: ''
    });

    useEffect(() => {
        cargarInstituciones();
    }, []);

    const cargarInstituciones = async () => {
        try {
            const data = await institucionService.getAll({ estado_validacion: 'aprobada' });
            setInstituciones(data);
        } catch (err) {
            console.error('Error al cargar instituciones:', err);
            setError('Error al cargar las instituciones disponibles');
        } finally {
            setLoadingInstituciones(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSensorChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            tipo_sensores: checked 
                ? [...prev.tipo_sensores, value]
                : prev.tipo_sensores.filter(s => s !== value)
        }));
    };

    const handleUseCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData(prev => ({
                        ...prev,
                        latitud: position.coords.latitude.toFixed(6),
                        longitud: position.coords.longitude.toFixed(6)
                    }));
                },
                (error) => {
                    setError('No se pudo obtener la ubicación actual');
                }
            );
        } else {
            setError('Tu navegador no soporta geolocalización');
        }
    };

    const validateForm = () => {
        if (!formData.nombre || !formData.latitud || !formData.longitud || !formData.institucion) {
            setError('Por favor completa todos los campos obligatorios');
            return false;
        }
        if (formData.tipo_sensores.length === 0) {
            setError('Selecciona al menos un tipo de sensor');
            return false;
        }
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!validateForm()) return;
        
        setLoading(true);
        
        try {
            await registerStation(formData);
            setSuccess(true);
            
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.message || 'Error al registrar estación');
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
                            La estación <strong>{formData.nombre}</strong> ha sido registrada correctamente.
                        </p>
                        <Alert variant="info" className="mt-3">
                            <small>
                                La institución <strong>{instituciones.find(i => i.id === parseInt(formData.institucion))?.nombre}</strong> debe aprobar tu estación antes de que esté activa.
                            </small>
                        </Alert>
                    </div>
                    <Button 
                        variant="success" 
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
                    <Col xs={12} lg={10} xl={9}>
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
                                    <h2 className="fw-bold mb-2">Registro de Estación de Monitoreo</h2>
                                    <p className="text-muted">
                                        Registra un nuevo punto de monitoreo ambiental
                                    </p>
                                </div>

                                <Form onSubmit={handleSubmit}>
                                    {/* Información de la Estación */}
                                    <div className="mb-5">
                                        <h5 className="fw-bold mb-4">
                                            <MapPin size={24} className="me-2" />
                                            Información de la Estación
                                        </h5>
                                        
                                        <Row>
                                            <Col md={12} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label className="fw-semibold">
                                                        Nombre de la Estación <span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="nombre"
                                                        value={formData.nombre}
                                                        onChange={handleChange}
                                                        placeholder="Ej: Estación Univalle Norte"
                                                        required
                                                        size="lg"
                                                    />
                                                </Form.Group>
                                            </Col>

                                            <Col md={12} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label className="fw-semibold">Descripción</Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={2}
                                                        name="descripcion"
                                                        value={formData.descripcion}
                                                        onChange={handleChange}
                                                        placeholder="Breve descripción de la estación y su ubicación"
                                                    />
                                                </Form.Group>
                                            </Col>

                                            <Col md={12} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label className="fw-semibold">
                                                        Institución Responsable <span className="text-danger">*</span>
                                                    </Form.Label>
                                                    {loadingInstituciones ? (
                                                        <div className="text-center py-3">
                                                            <span className="spinner-border spinner-border-sm me-2" />
                                                            Cargando instituciones...
                                                        </div>
                                                    ) : (
                                                        <Form.Select
                                                            name="institucion"
                                                            value={formData.institucion}
                                                            onChange={handleChange}
                                                            required
                                                            size="lg"
                                                        >
                                                            <option value="">Selecciona una institución...</option>
                                                            {instituciones.map(inst => (
                                                                <option key={inst.id} value={inst.id}>
                                                                    {inst.nombre} - {inst.tipo_institucion}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                    )}
                                                    <Form.Text className="text-muted">
                                                        La institución debe aprobar tu estación
                                                    </Form.Text>
                                                </Form.Group>
                                            </Col>

                                            <Col md={12} className="mb-3">
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
                                                <Form.Label className="fw-semibold">
                                                    Coordenadas <span className="text-danger">*</span>
                                                </Form.Label>
                                                <Row>
                                                    <Col md={5}>
                                                        <Form.Group>
                                                            <Form.Control
                                                                type="number"
                                                                step="0.000001"
                                                                name="latitud"
                                                                value={formData.latitud}
                                                                onChange={handleChange}
                                                                placeholder="Latitud (Ej: 3.451647)"
                                                                required
                                                                size="lg"
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={5}>
                                                        <Form.Group>
                                                            <Form.Control
                                                                type="number"
                                                                step="0.000001"
                                                                name="longitud"
                                                                value={formData.longitud}
                                                                onChange={handleChange}
                                                                placeholder="Longitud (Ej: -76.531985)"
                                                                required
                                                                size="lg"
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={2}>
                                                        <Button 
                                                            variant="outline-primary" 
                                                            className="w-100"
                                                            size="lg"
                                                            onClick={handleUseCurrentLocation}
                                                            title="Usar ubicación actual"
                                                        >
                                                            <MapPin size={20} />
                                                        </Button>
                                                    </Col>
                                                </Row>
                                                <Form.Text className="text-muted">
                                                    <MapPin size={14} className="me-1" />
                                                    Click en el botón para usar tu ubicación actual
                                                </Form.Text>
                                            </Col>

                                            <Col md={12} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label className="fw-semibold">
                                                        Tipos de Sensores <span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Card className="border">
                                                        <Card.Body>
                                                            <Row>
                                                                <Col md={6} className="mb-2">
                                                                    <Form.Check
                                                                        type="checkbox"
                                                                        id="sensor-pm25"
                                                                        label={
                                                                            <span>
                                                                                <Badge bg="info" className="me-2">PM 2.5</Badge>
                                                                                Material Particulado Fino
                                                                            </span>
                                                                        }
                                                                        value="PM2.5"
                                                                        checked={formData.tipo_sensores.includes('PM2.5')}
                                                                        onChange={handleSensorChange}
                                                                    />
                                                                </Col>
                                                                <Col md={6} className="mb-2">
                                                                    <Form.Check
                                                                        type="checkbox"
                                                                        id="sensor-pm10"
                                                                        label={
                                                                            <span>
                                                                                <Badge bg="info" className="me-2">PM 10</Badge>
                                                                                Material Particulado Grueso
                                                                            </span>
                                                                        }
                                                                        value="PM10"
                                                                        checked={formData.tipo_sensores.includes('PM10')}
                                                                        onChange={handleSensorChange}
                                                                    />
                                                                </Col>
                                                                <Col md={6} className="mb-2">
                                                                    <Form.Check
                                                                        type="checkbox"
                                                                        id="sensor-o3"
                                                                        label={
                                                                            <span>
                                                                                <Badge bg="warning" text="dark" className="me-2">O₃</Badge>
                                                                                Ozono
                                                                            </span>
                                                                        }
                                                                        value="O3"
                                                                        checked={formData.tipo_sensores.includes('O3')}
                                                                        onChange={handleSensorChange}
                                                                    />
                                                                </Col>
                                                                <Col md={6} className="mb-2">
                                                                    <Form.Check
                                                                        type="checkbox"
                                                                        id="sensor-no2"
                                                                        label={
                                                                            <span>
                                                                                <Badge bg="danger" className="me-2">NO₂</Badge>
                                                                                Dióxido de Nitrógeno
                                                                            </span>
                                                                        }
                                                                        value="NO2"
                                                                        checked={formData.tipo_sensores.includes('NO2')}
                                                                        onChange={handleSensorChange}
                                                                    />
                                                                </Col>
                                                                <Col md={6} className="mb-2">
                                                                    <Form.Check
                                                                        type="checkbox"
                                                                        id="sensor-so2"
                                                                        label={
                                                                            <span>
                                                                                <Badge bg="danger" className="me-2">SO₂</Badge>
                                                                                Dióxido de Azufre
                                                                            </span>
                                                                        }
                                                                        value="SO2"
                                                                        checked={formData.tipo_sensores.includes('SO2')}
                                                                        onChange={handleSensorChange}
                                                                    />
                                                                </Col>
                                                                <Col md={6} className="mb-2">
                                                                    <Form.Check
                                                                        type="checkbox"
                                                                        id="sensor-co"
                                                                        label={
                                                                            <span>
                                                                                <Badge bg="secondary" className="me-2">CO</Badge>
                                                                                Monóxido de Carbono
                                                                            </span>
                                                                        }
                                                                        value="CO"
                                                                        checked={formData.tipo_sensores.includes('CO')}
                                                                        onChange={handleSensorChange}
                                                                    />
                                                                </Col>
                                                                <Col md={6} className="mb-2">
                                                                    <Form.Check
                                                                        type="checkbox"
                                                                        id="sensor-meteo"
                                                                        label={
                                                                            <span>
                                                                                <Badge bg="primary" className="me-2">Meteo</Badge>
                                                                                Variables Meteorológicas
                                                                            </span>
                                                                        }
                                                                        value="meteorologicos"
                                                                        checked={formData.tipo_sensores.includes('meteorologicos')}
                                                                        onChange={handleSensorChange}
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </Card.Body>
                                                    </Card>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </div>

                                    <hr className="my-4" />

                                    {/* Datos del Administrador */}
                                    <div className="mb-4">
                                        <h5 className="fw-bold mb-4">
                                            <i className="bi bi-person-badge me-2"></i>
                                            Administrador de la Estación
                                        </h5>
                                        <Alert variant="info" className="mb-4">
                                            <small>
                                                Esta persona será responsable de gestionar la estación y registrar mediciones
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
                                                        placeholder="admin_estacion_norte"
                                                        required
                                                        size="lg"
                                                    />
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
                                                        placeholder="admin@estacion.com"
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
                                    </div>

                                    {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

                                    <div className="d-flex justify-content-end mt-4">
                                        <Button 
                                            variant="success" 
                                            type="submit"
                                            size="lg"
                                            disabled={loading}
                                            style={{ 
                                                minWidth: '200px',
                                                background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                                                border: 'none'
                                            }}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" />
                                                    Registrando...
                                                </>
                                            ) : (
                                                'Registrar Estación'
                                            )}
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
};

export default RegisterStation;
