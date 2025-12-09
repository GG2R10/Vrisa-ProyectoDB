import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tabs, Tab } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import estacionService from '../../services/estacionService';
import institucionService from '../../services/institucionService';
import { Building, Radio, CheckCircle, AlertCircle } from 'lucide-react';

const CitizenOptions = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('investigador');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const [institutionData, setInstitutionData] = useState({
        nombre: '',
        direccion: '',
        color_primario: '#000000',
        color_secundario: '#FFFFFF'
    });

    const [stationData, setStationData] = useState({
        nombre: '',
        direccion: '',
        ubicacion_latitud: '',
        ubicacion_longitud: '',
        ubicacion_referencia: '',
        institucion: '',
        tecnico: ''
    });

    const [institutions, setInstitutions] = useState([]);
    const [users, setUsers] = useState([]);

    // Solicitar ser investigador
    const handleRequestInvestigador = async () => {
        setLoading(true);
        setMessage('');
        try {
            await authService.requestInvestigador();
            setMessageType('success');
            setMessage('Solicitud enviada. El administrador del sistema la revisará en breve.');
        } catch (err) {
            setMessageType('danger');
            setMessage(err.message || 'Error al enviar la solicitud');
        } finally {
            setLoading(false);
        }
    };

    // Registrar institución
    const handleRegisterInstitution = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            await institucionService.create(institutionData);
            setMessageType('success');
            setMessage('Institución registrada. Espera la aprobación del administrador del sistema.');
            setInstitutionData({
                nombre: '',
                direccion: '',
                color_primario: '#000000',
                color_secundario: '#FFFFFF'
            });
        } catch (err) {
            setMessageType('danger');
            setMessage(err.message || 'Error al registrar la institución');
        } finally {
            setLoading(false);
        }
    };

    // Registrar estación
    const handleRegisterStation = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            await estacionService.create(stationData);
            setMessageType('success');
            setMessage('Estación registrada. Espera la aprobación del administrador de la institución.');
            setStationData({
                nombre: '',
                direccion: '',
                ubicacion_latitud: '',
                ubicacion_longitud: '',
                ubicacion_referencia: '',
                institucion: '',
                tecnico: ''
            });
        } catch (err) {
            setMessageType('danger');
            setMessage(err.message || 'Error al registrar la estación');
        } finally {
            setLoading(false);
        }
    };

    // Si el usuario no es ciudadano, mostrar mensaje
    if (user && user.tipo !== 'ciudadano') {
        return (
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col md={8}>
                        <Card className="border-warning">
                            <Card.Body className="text-center">
                                <AlertCircle size={48} className="mb-3 text-warning" />
                                <h4>No disponible</h4>
                                <p className="text-muted">
                                    Solo los ciudadanos pueden acceder a estas opciones.
                                    Tu rol actual es: <strong>{user.tipo}</strong>
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col lg={10}>
                    <h2 className="mb-4 fw-bold">Panel de Ciudadano</h2>
                    
                    <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
                        {/* Tab Investigador */}
                        <Tab eventKey="investigador" title="Solicitud de Investigador">
                            <Card className="mt-3">
                                <Card.Body>
                                    <h5 className="mb-3">Solicitar ser Investigador</h5>
                                    <p className="text-muted">
                                        Los investigadores pueden ver datos de todas las estaciones, 
                                        independientemente de la institución. La solicitud será revisada 
                                        por un administrador del sistema.
                                    </p>

                                    {message && (
                                        <Alert variant={messageType} className="d-flex align-items-center">
                                            {messageType === 'success' ? <CheckCircle size={18} className="me-2" /> : <AlertCircle size={18} className="me-2" />}
                                            {message}
                                        </Alert>
                                    )}

                                    {user?.investigador_aprobado ? (
                                        <Alert variant="success" className="d-flex align-items-center">
                                            <CheckCircle size={18} className="me-2" />
                                            Ya eres investigador aprobado
                                        </Alert>
                                    ) : user?.solicita_investigador ? (
                                        <Alert variant="info">
                                            Tu solicitud de investigador está pendiente de revisión
                                        </Alert>
                                    ) : (
                                        <Button 
                                            variant="primary" 
                                            onClick={handleRequestInvestigador}
                                            disabled={loading}
                                        >
                                            {loading ? 'Enviando solicitud...' : 'Enviar solicitud'}
                                        </Button>
                                    )}
                                </Card.Body>
                            </Card>
                        </Tab>

                        {/* Tab Institución */}
                        <Tab eventKey="institucion" title="Registrar Institución">
                            <Card className="mt-3">
                                <Card.Body>
                                    <h5 className="mb-3">Registrar Nueva Institución</h5>
                                    <p className="text-muted mb-4">
                                        Al registrar una institución, serás designado como su administrador. 
                                        Tu solicitud debe ser aprobada por el administrador del sistema.
                                    </p>

                                    {message && (
                                        <Alert variant={messageType} className="d-flex align-items-center">
                                            {messageType === 'success' ? <CheckCircle size={18} className="me-2" /> : <AlertCircle size={18} className="me-2" />}
                                            {message}
                                        </Alert>
                                    )}

                                    <Form onSubmit={handleRegisterInstitution}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Nombre de la institución</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Ej: Instituto de Calidad del Aire"
                                                value={institutionData.nombre}
                                                onChange={(e) => setInstitutionData({ ...institutionData, nombre: e.target.value })}
                                                required
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Dirección</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Dirección de la institución"
                                                value={institutionData.direccion}
                                                onChange={(e) => setInstitutionData({ ...institutionData, direccion: e.target.value })}
                                                required
                                            />
                                        </Form.Group>

                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Color primario</Form.Label>
                                                    <Form.Control
                                                        type="color"
                                                        value={institutionData.color_primario}
                                                        onChange={(e) => setInstitutionData({ ...institutionData, color_primario: e.target.value })}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Color secundario</Form.Label>
                                                    <Form.Control
                                                        type="color"
                                                        value={institutionData.color_secundario}
                                                        onChange={(e) => setInstitutionData({ ...institutionData, color_secundario: e.target.value })}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Button 
                                            variant="primary" 
                                            type="submit"
                                            disabled={loading}
                                        >
                                            {loading ? 'Registrando...' : 'Registrar institución'}
                                        </Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Tab>

                        {/* Tab Estación */}
                        <Tab eventKey="estacion" title="Registrar Estación">
                            <Card className="mt-3">
                                <Card.Body>
                                    <h5 className="mb-3">Registrar Nueva Estación</h5>
                                    <p className="text-muted mb-4">
                                        Al registrar una estación, serás designado como su administrador. 
                                        La solicitud debe ser aprobada por el administrador de la institución.
                                    </p>

                                    {message && (
                                        <Alert variant={messageType} className="d-flex align-items-center">
                                            {messageType === 'success' ? <CheckCircle size={18} className="me-2" /> : <AlertCircle size={18} className="me-2" />}
                                            {message}
                                        </Alert>
                                    )}

                                    <Form onSubmit={handleRegisterStation}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Nombre de la estación</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Ej: Estación Centro"
                                                value={stationData.nombre}
                                                onChange={(e) => setStationData({ ...stationData, nombre: e.target.value })}
                                                required
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Dirección</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Dirección de la estación"
                                                value={stationData.direccion}
                                                onChange={(e) => setStationData({ ...stationData, direccion: e.target.value })}
                                                required
                                            />
                                        </Form.Group>

                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Latitud</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        step="0.000001"
                                                        placeholder="Ej: 3.4372"
                                                        value={stationData.ubicacion_latitud}
                                                        onChange={(e) => setStationData({ ...stationData, ubicacion_latitud: e.target.value })}
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Longitud</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        step="0.000001"
                                                        placeholder="Ej: -76.5225"
                                                        value={stationData.ubicacion_longitud}
                                                        onChange={(e) => setStationData({ ...stationData, ubicacion_longitud: e.target.value })}
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Referencia de ubicación (opcional)</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Ej: Cerca de parque central"
                                                value={stationData.ubicacion_referencia}
                                                onChange={(e) => setStationData({ ...stationData, ubicacion_referencia: e.target.value })}
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Institución *</Form.Label>
                                            <Form.Select
                                                value={stationData.institucion}
                                                onChange={(e) => setStationData({ ...stationData, institucion: e.target.value })}
                                                required
                                            >
                                                <option value="">Selecciona una institución</option>
                                                {/* Aquí irían las opciones cargadas dinámicamente */}
                                            </Form.Select>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Técnico *</Form.Label>
                                            <Form.Select
                                                value={stationData.tecnico}
                                                onChange={(e) => setStationData({ ...stationData, tecnico: e.target.value })}
                                                required
                                            >
                                                <option value="">Selecciona un técnico</option>
                                                {/* Aquí irían las opciones cargadas dinámicamente */}
                                            </Form.Select>
                                        </Form.Group>

                                        <Button 
                                            variant="primary" 
                                            type="submit"
                                            disabled={loading}
                                        >
                                            {loading ? 'Registrando...' : 'Registrar estación'}
                                        </Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Tab>
                    </Tabs>
                </Col>
            </Row>
        </Container>
    );
};

export default CitizenOptions;
