import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Tabs, Tab, Table, Button, Badge, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { Check, X, Shield, Building, Radio, CheckCircle, XCircle } from 'lucide-react';
import institucionService from '../../services/institucionService';
import estacionService from '../../services/estacionService';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useAuth();
    // Only 'admin_sistema' can verify institutions
    const canViewInstitutions = user?.rol === 'admin_sistema';

    const [activeTab, setActiveTab] = useState(canViewInstitutions ? 'instituciones' : 'estaciones');
    const [instituciones, setInstituciones] = useState([]);
    const [estaciones, setEstaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'aprobar' o 'rechazar'
    const [selectedItem, setSelectedItem] = useState(null);
    const [razonRechazo, setRazonRechazo] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        // Redirect if trying to view restricted tab
        if (!canViewInstitutions && activeTab === 'instituciones') {
            setActiveTab('estaciones');
        }
        cargarDatos();
    }, [activeTab, canViewInstitutions]);

    const cargarDatos = async () => {
        setLoading(true);
        setError('');
        try {
            if (activeTab === 'instituciones' && canViewInstitutions) {
                const data = await institucionService.getPendientes();
                setInstituciones(data);
            } else if (activeTab === 'estaciones') {
                const data = await estacionService.getPendientes();
                setEstaciones(data);
            }
        } catch (err) {
            setError('Error al cargar los datos: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (item, type) => {
        setSelectedItem(item);
        setModalType(type);
        setShowModal(true);
        setRazonRechazo('');
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedItem(null);
        setModalType('');
        setRazonRechazo('');
    };

    const handleAprobar = async () => {
        if (!selectedItem) return;

        setProcessing(true);
        try {
            if (activeTab === 'instituciones') {
                await institucionService.aprobar(selectedItem.id);
            } else {
                await estacionService.approve(selectedItem.id);
            }
            handleCloseModal();
            cargarDatos();
        } catch (err) {
            setError('Error al aprobar: ' + err.message);
        } finally {
            setProcessing(false);
        }
    };

    const handleRechazar = async () => {
        if (!selectedItem || !razonRechazo.trim()) {
            setError('Debes proporcionar una razón para el rechazo');
            return;
        }

        setProcessing(true);
        try {
            if (activeTab === 'instituciones') {
                await institucionService.rechazar(selectedItem.id, razonRechazo);
            } else {
                await estacionService.reject(selectedItem.id, razonRechazo);
            }
            handleCloseModal();
            cargarDatos();
        } catch (err) {
            setError('Error al rechazar: ' + err.message);
        } finally {
            setProcessing(false);
        }
    };

    const renderInstitucionesTable = () => {
        if (loading) {
            return (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3 text-muted">Cargando instituciones...</p>
                </div>
            );
        }

        if (instituciones.length === 0) {
            return (
                <div className="text-center py-5">
                    <CheckCircle size={48} className="text-success mb-3" />
                    <h5>No hay instituciones pendientes</h5>
                    <p className="text-muted">Todas las solicitudes han sido procesadas</p>
                </div>
            );
        }

        return (
            <Table responsive hover>
                <thead className="table-light">
                    <tr>
                        <th>Nombre</th>
                        <th>Tipo</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Fecha Solicitud</th>
                        <th className="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {instituciones.map((inst) => (
                        <tr key={inst.id}>
                            <td>
                                <div className="d-flex align-items-center">
                                    <Building size={18} className="me-2 text-primary" />
                                    <strong>{inst.nombre}</strong>
                                </div>
                            </td>
                            <td>
                                <Badge bg="info">{inst.tipo_institucion}</Badge>
                            </td>
                            <td>{inst.email_contacto}</td>
                            <td>{inst.telefono || 'N/A'}</td>
                            <td>
                                <small className="text-muted">
                                    {new Date(inst.fecha_creacion).toLocaleDateString()}
                                </small>
                            </td>
                            <td className="text-center">
                                <Button
                                    variant="success"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleOpenModal(inst, 'aprobar')}
                                >
                                    <Check size={16} />
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleOpenModal(inst, 'rechazar')}
                                >
                                    <X size={16} />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        );
    };

    const renderEstacionesTable = () => {
        if (loading) {
            return (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3 text-muted">Cargando estaciones...</p>
                </div>
            );
        }

        if (estaciones.length === 0) {
            return (
                <div className="text-center py-5">
                    <CheckCircle size={48} className="text-success mb-3" />
                    <h5>No hay estaciones pendientes</h5>
                    <p className="text-muted">Todas las solicitudes han sido procesadas</p>
                </div>
            );
        }

        return (
            <Table responsive hover>
                <thead className="table-light">
                    <tr>
                        <th>Nombre</th>
                        <th>Institución</th>
                        <th>Ubicación</th>
                        <th>Coordenadas</th>
                        <th>Fecha Solicitud</th>
                        <th className="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {estaciones.map((est) => (
                        <tr key={est.id}>
                            <td>
                                <div className="d-flex align-items-center">
                                    <Radio size={18} className="me-2 text-success" />
                                    <strong>{est.nombre}</strong>
                                </div>
                            </td>
                            <td>{est.institucion_nombre || 'N/A'}</td>
                            <td>
                                <small>{est.direccion || 'Sin dirección'}</small>
                            </td>
                            <td>
                                <small className="text-muted">
                                    {est.latitud}, {est.longitud}
                                </small>
                            </td>
                            <td>
                                <small className="text-muted">
                                    {new Date(est.fecha_creacion).toLocaleDateString()}
                                </small>
                            </td>
                            <td className="text-center">
                                <Button
                                    variant="success"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleOpenModal(est, 'aprobar')}
                                >
                                    <Check size={16} />
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleOpenModal(est, 'rechazar')}
                                >
                                    <X size={16} />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        );
    };

    return (
        <Container fluid className="py-4">
            <Row className="mb-4">
                <Col>
                    <div className="d-flex align-items-center mb-2">
                        <Shield size={32} className="text-primary me-3" />
                        <div>
                            <h2 className="mb-0">Panel de Administración</h2>
                            <p className="text-muted mb-0">Gestión de instituciones y estaciones pendientes</p>
                        </div>
                    </div>
                </Col>
            </Row>

            {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            <Row>
                <Col xs={12}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Tabs
                                activeKey={activeTab}
                                onSelect={(k) => setActiveTab(k)}
                                className="mb-4"
                            >
                                {canViewInstitutions && (
                                    <Tab
                                        eventKey="instituciones"
                                        title={
                                            <span>
                                                <Building size={18} className="me-2" />
                                                Instituciones
                                                {instituciones.length > 0 && (
                                                    <Badge bg="primary" className="ms-2">
                                                        {instituciones.length}
                                                    </Badge>
                                                )}
                                            </span>
                                        }
                                    >
                                        {renderInstitucionesTable()}
                                    </Tab>
                                )}

                                <Tab
                                    eventKey="estaciones"
                                    title={
                                        <span>
                                            <Radio size={18} className="me-2" />
                                            Estaciones
                                            {estaciones.length > 0 && (
                                                <Badge bg="primary" className="ms-2">
                                                    {estaciones.length}
                                                </Badge>
                                            )}
                                        </span>
                                    }
                                >
                                    {renderEstacionesTable()}
                                </Tab>
                            </Tabs>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Modal de Confirmación */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {modalType === 'aprobar' ? (
                            <span className="text-success">
                                <CheckCircle size={24} className="me-2" />
                                Aprobar {activeTab === 'instituciones' ? 'Institución' : 'Estación'}
                            </span>
                        ) : (
                            <span className="text-danger">
                                <XCircle size={24} className="me-2" />
                                Rechazar {activeTab === 'instituciones' ? 'Institución' : 'Estación'}
                            </span>
                        )}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedItem && (
                        <>
                            <p>
                                <strong>Nombre:</strong> {selectedItem.nombre}
                            </p>
                            {modalType === 'aprobar' ? (
                                <Alert variant="success">
                                    <p className="mb-0">
                                        ¿Estás seguro de que deseas aprobar esta solicitud?
                                        Los usuarios asociados recibirán una notificación.
                                    </p>
                                </Alert>
                            ) : (
                                <>
                                    <Alert variant="warning">
                                        Esta acción notificará al usuario del rechazo.
                                    </Alert>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold">
                                            Razón del Rechazo <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={razonRechazo}
                                            onChange={(e) => setRazonRechazo(e.target.value)}
                                            placeholder="Explica por qué se rechaza esta solicitud..."
                                            required
                                        />
                                    </Form.Group>
                                </>
                            )}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal} disabled={processing}>
                        Cancelar
                    </Button>
                    {modalType === 'aprobar' ? (
                        <Button
                            variant="success"
                            onClick={handleAprobar}
                            disabled={processing}
                        >
                            {processing ? (
                                <>
                                    <Spinner size="sm" className="me-2" />
                                    Aprobando...
                                </>
                            ) : (
                                <>
                                    <Check size={18} className="me-2" />
                                    Aprobar
                                </>
                            )}
                        </Button>
                    ) : (
                        <Button
                            variant="danger"
                            onClick={handleRechazar}
                            disabled={processing || !razonRechazo.trim()}
                        >
                            {processing ? (
                                <>
                                    <Spinner size="sm" className="me-2" />
                                    Rechazando...
                                </>
                            ) : (
                                <>
                                    <X size={18} className="me-2" />
                                    Rechazar
                                </>
                            )}
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AdminDashboard;
