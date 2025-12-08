import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Tabs, Tab, Table, Button, Badge, Modal, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, XCircle, Trash2, Edit, AlertCircle } from 'lucide-react';
import authService from '../../services/authService';
import institucionService from '../../services/institucionService';
import estacionService from '../../services/estacionService';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('instituciones');
    
    // Estados
    const [instituciones, setInstituciones] = useState([]);
    const [estaciones, setEstaciones] = useState([]);
    const [solicitudesInvestigador, setSolicitudesInvestigador] = useState([]);
    const [solicitudesAutoridad, setSolicitudesAutoridad] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Cargar datos
    useEffect(() => {
        if (user?.tipo === 'admin_sistema') {
            loadData();
        }
    }, [user, activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'instituciones') {
                const data = await institucionService.getPending();
                setInstituciones(data);
            } else if (activeTab === 'estaciones') {
                const data = await estacionService.getAll();
                setEstaciones(data);
            } else if (activeTab === 'investigadores') {
                const data = await authService.getPendingInvestigadores();
                setSolicitudesInvestigador(data);
            } else if (activeTab === 'autoridades') {
                const data = await authService.getPendingAutoridades();
                setSolicitudesAutoridad(data);
            }
        } catch (err) {
            setMessage(err.message || 'Error cargando datos');
            setMessageType('danger');
        } finally {
            setLoading(false);
        }
    };

    // Aprobar institución
    const handleAprobarInstitucion = async (id) => {
        try {
            await institucionService.approve(id);
            setMessage('Institución aprobada exitosamente');
            setMessageType('success');
            loadData();
        } catch (err) {
            setMessage(err.message || 'Error al aprobar');
            setMessageType('danger');
        }
    };

    // Rechazar institución
    const handleRechazarInstitucion = async (id) => {
        try {
            await institucionService.reject(id);
            setMessage('Institución rechazada');
            setMessageType('success');
            loadData();
        } catch (err) {
            setMessage(err.message || 'Error al rechazar');
            setMessageType('danger');
        }
    };

    // Eliminar estación
    const handleEliminarEstacion = async (id) => {
        try {
            await estacionService.delete(id);
            setMessage('Estación eliminada');
            setMessageType('success');
            loadData();
        } catch (err) {
            setMessage(err.message || 'Error al eliminar');
            setMessageType('danger');
        }
    };

    // Aprobar investigador
    const handleAprobarInvestigador = async (id) => {
        try {
            await authService.approveInvestigador(id);
            setMessage('Investigador aprobado');
            setMessageType('success');
            loadData();
        } catch (err) {
            setMessage(err.message || 'Error al aprobar');
            setMessageType('danger');
        }
    };

    // Rechazar investigador
    const handleRechazarInvestigador = async (id) => {
        try {
            await authService.rejectInvestigador(id);
            setMessage('Solicitud de investigador rechazada');
            setMessageType('success');
            loadData();
        } catch (err) {
            setMessage(err.message || 'Error al rechazar');
            setMessageType('danger');
        }
    };

    // Aprobar autoridad
    const handleAprobarAutoridad = async (id) => {
        try {
            await authService.approveAutoridad(id);
            setMessage('Autoridad ambiental aprobada');
            setMessageType('success');
            loadData();
        } catch (err) {
            setMessage(err.message || 'Error al aprobar');
            setMessageType('danger');
        }
    };

    // Rechazar autoridad
    const handleRechazarAutoridad = async (id) => {
        try {
            await authService.rejectAutoridad(id);
            setMessage('Solicitud de autoridad rechazada');
            setMessageType('success');
            loadData();
        } catch (err) {
            setMessage(err.message || 'Error al rechazar');
            setMessageType('danger');
        }
    };

    if (user?.tipo !== 'admin_sistema') {
        return (
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col md={8}>
                        <Card className="border-danger">
                            <Card.Body className="text-center">
                                <AlertCircle size={48} className="mb-3 text-danger" />
                                <h4>Acceso denegado</h4>
                                <p className="text-muted">
                                    Solo los administradores del sistema pueden acceder a este panel.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container fluid className="py-5">
            <h2 className="mb-4 fw-bold">Panel de Administrador del Sistema</h2>

            {message && (
                <Alert variant={messageType} dismissible onClose={() => setMessage('')}>
                    {message}
                </Alert>
            )}

            <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
                {/* Instituciones Pendientes */}
                <Tab eventKey="instituciones" title="Instituciones Pendientes">
                    <Card className="mt-3">
                        <Card.Body>
                            {loading ? (
                                <p>Cargando...</p>
                            ) : instituciones.length === 0 ? (
                                <p className="text-muted">No hay instituciones pendientes de aprobación</p>
                            ) : (
                                <div className="table-responsive">
                                    <Table striped hover>
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Creador</th>
                                                <th>Dirección</th>
                                                <th>Fecha</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {instituciones.map((inst) => (
                                                <tr key={inst.id}>
                                                    <td className="fw-semibold">{inst.nombre}</td>
                                                    <td>{inst.creador_nombre}</td>
                                                    <td>{inst.direccion}</td>
                                                    <td>{new Date(inst.fecha_creacion).toLocaleDateString()}</td>
                                                    <td>
                                                        <Button
                                                            size="sm"
                                                            variant="success"
                                                            onClick={() => handleAprobarInstitucion(inst.id)}
                                                            className="me-2"
                                                        >
                                                            <CheckCircle size={16} /> Aprobar
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="danger"
                                                            onClick={() => handleRechazarInstitucion(inst.id)}
                                                        >
                                                            <XCircle size={16} /> Rechazar
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Tab>

                {/* Estaciones */}
                <Tab eventKey="estaciones" title="Gestionar Estaciones">
                    <Card className="mt-3">
                        <Card.Body>
                            {loading ? (
                                <p>Cargando...</p>
                            ) : estaciones.length === 0 ? (
                                <p className="text-muted">No hay estaciones registradas</p>
                            ) : (
                                <div className="table-responsive">
                                    <Table striped hover>
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Institución</th>
                                                <th>Estado</th>
                                                <th>Fecha</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {estaciones.map((estacion) => (
                                                <tr key={estacion.id}>
                                                    <td className="fw-semibold">{estacion.nombre}</td>
                                                    <td>{estacion.institucion_nombre}</td>
                                                    <td>
                                                        <Badge bg={
                                                            estacion.estado_validacion === 'aprobada' ? 'success' :
                                                            estacion.estado_validacion === 'pendiente' ? 'warning' : 'danger'
                                                        }>
                                                            {estacion.estado_validacion}
                                                        </Badge>
                                                    </td>
                                                    <td>{new Date(estacion.fecha_creacion).toLocaleDateString()}</td>
                                                    <td>
                                                        <Button
                                                            size="sm"
                                                            variant="warning"
                                                            onClick={() => {
                                                                setSelectedItem(estacion);
                                                                setShowModal(true);
                                                            }}
                                                            className="me-2"
                                                        >
                                                            <Edit size={16} />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="danger"
                                                            onClick={() => handleEliminarEstacion(estacion.id)}
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Tab>

                {/* Solicitudes de Investigador */}
                <Tab eventKey="investigadores" title="Solicitudes de Investigador">
                    <Card className="mt-3">
                        <Card.Body>
                            {loading ? (
                                <p>Cargando...</p>
                            ) : solicitudesInvestigador.length === 0 ? (
                                <p className="text-muted">No hay solicitudes pendientes</p>
                            ) : (
                                <div className="table-responsive">
                                    <Table striped hover>
                                        <thead>
                                            <tr>
                                                <th>Usuario</th>
                                                <th>Email</th>
                                                <th>Estado</th>
                                                <th>Fecha Solicitud</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {solicitudesInvestigador.map((solicitud) => (
                                                <tr key={solicitud.id}>
                                                    <td className="fw-semibold">{solicitud.usuario_nombre} {solicitud.usuario_apellido}</td>
                                                    <td>{solicitud.usuario_email}</td>
                                                    <td>
                                                        <Badge bg={
                                                            solicitud.estado === 'aprobada' ? 'success' :
                                                            solicitud.estado === 'pendiente' ? 'warning' : 'danger'
                                                        }>
                                                            {solicitud.estado}
                                                        </Badge>
                                                    </td>
                                                    <td>{new Date(solicitud.fecha_solicitud).toLocaleDateString()}</td>
                                                    <td>
                                                        {solicitud.estado === 'pendiente' && (
                                                            <>
                                                                <Button
                                                                    size="sm"
                                                                    variant="success"
                                                                    onClick={() => handleAprobarInvestigador(solicitud.id)}
                                                                    className="me-2"
                                                                >
                                                                    <CheckCircle size={16} />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="danger"
                                                                    onClick={() => handleRechazarInvestigador(solicitud.id)}
                                                                >
                                                                    <XCircle size={16} />
                                                                </Button>
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Tab>

                {/* Solicitudes de Autoridad */}
                <Tab eventKey="autoridades" title="Solicitudes de Autoridad Ambiental">
                    <Card className="mt-3">
                        <Card.Body>
                            {loading ? (
                                <p>Cargando...</p>
                            ) : solicitudesAutoridad.length === 0 ? (
                                <p className="text-muted">No hay solicitudes pendientes</p>
                            ) : (
                                <div className="table-responsive">
                                    <Table striped hover>
                                        <thead>
                                            <tr>
                                                <th>Usuario</th>
                                                <th>Email</th>
                                                <th>Estado</th>
                                                <th>Fecha Solicitud</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {solicitudesAutoridad.map((solicitud) => (
                                                <tr key={solicitud.id}>
                                                    <td className="fw-semibold">{solicitud.usuario_nombre} {solicitud.usuario_apellido}</td>
                                                    <td>{solicitud.usuario_email}</td>
                                                    <td>
                                                        <Badge bg={
                                                            solicitud.estado === 'aprobada' ? 'success' :
                                                            solicitud.estado === 'pendiente' ? 'warning' : 'danger'
                                                        }>
                                                            {solicitud.estado}
                                                        </Badge>
                                                    </td>
                                                    <td>{new Date(solicitud.fecha_solicitud).toLocaleDateString()}</td>
                                                    <td>
                                                        {solicitud.estado === 'pendiente' && (
                                                            <>
                                                                <Button
                                                                    size="sm"
                                                                    variant="success"
                                                                    onClick={() => handleAprobarAutoridad(solicitud.id)}
                                                                    className="me-2"
                                                                >
                                                                    <CheckCircle size={16} />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="danger"
                                                                    onClick={() => handleRechazarAutoridad(solicitud.id)}
                                                                >
                                                                    <XCircle size={16} />
                                                                </Button>
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Tab>
            </Tabs>
        </Container>
    );
};

export default AdminDashboard;
