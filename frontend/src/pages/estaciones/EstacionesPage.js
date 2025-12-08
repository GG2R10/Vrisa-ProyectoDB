import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Modal, Form, Alert, Spinner, InputGroup } from 'react-bootstrap';
import { Radio, Plus, Edit, Trash2, MapPin, Search, Filter, Eye } from 'lucide-react';
import estacionService from '../../services/estacionService';
import sensorService from '../../services/sensorService';
import { useAuth } from '../../context/AuthContext';

const EstacionesPage = () => {
    const { user } = useAuth();
    const [estaciones, setEstaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEstado, setFilterEstado] = useState('todas');
    
    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('crear'); // 'crear', 'editar', 'ver'
    const [selectedEstacion, setSelectedEstacion] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        latitud: '',
        longitud: '',
        direccion: '',
        estado: 'activa'
    });
    const [processing, setProcessing] = useState(false);

    // Modal de sensores
    const [showSensorsModal, setShowSensorsModal] = useState(false);
    const [sensores, setSensores] = useState([]);

    useEffect(() => {
        cargarEstaciones();
    }, []);

    const cargarEstaciones = async () => {
        setLoading(true);
        setError('');
        try {
            let data;
            if (user?.rol === 'admin_sistema') {
                data = await estacionService.getAll();
            } else if (user?.rol === 'admin_institucion') {
                data = await estacionService.getByInstitution(user.institucion_id);
            } else {
                data = await estacionService.getActivas();
            }
            setEstaciones(data);
        } catch (err) {
            setError('Error al cargar estaciones: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (type, estacion = null) => {
        setModalType(type);
        setSelectedEstacion(estacion);
        
        if (type === 'editar' && estacion) {
            setFormData({
                nombre: estacion.nombre,
                descripcion: estacion.descripcion || '',
                latitud: estacion.latitud,
                longitud: estacion.longitud,
                direccion: estacion.direccion || '',
                estado: estacion.estado
            });
        } else if (type === 'crear') {
            setFormData({
                nombre: '',
                descripcion: '',
                latitud: '',
                longitud: '',
                direccion: '',
                estado: 'activa'
            });
        }
        
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedEstacion(null);
        setError('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setError('');
        
        try {
            if (modalType === 'crear') {
                await estacionService.create(formData);
            } else if (modalType === 'editar') {
                await estacionService.update(selectedEstacion.id, formData);
            }
            handleCloseModal();
            cargarEstaciones();
        } catch (err) {
            setError('Error al guardar: ' + err.message);
        } finally {
            setProcessing(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta estación?')) return;
        
        try {
            await estacionService.delete(id);
            cargarEstaciones();
        } catch (err) {
            setError('Error al eliminar: ' + err.message);
        }
    };

    const handleVerSensores = async (estacion) => {
        try {
            const data = await sensorService.getByEstacion(estacion.id);
            setSensores(data);
            setSelectedEstacion(estacion);
            setShowSensorsModal(true);
        } catch (err) {
            setError('Error al cargar sensores: ' + err.message);
        }
    };

    const getEstadoBadge = (estado) => {
        const badges = {
            activa: 'success',
            inactiva: 'secondary',
            mantenimiento: 'warning',
            pendiente: 'info'
        };
        return <Badge bg={badges[estado] || 'secondary'}>{estado}</Badge>;
    };

    const estacionesFiltradas = estaciones.filter(est => {
        const matchSearch = est.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (est.direccion && est.direccion.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchFilter = filterEstado === 'todas' || est.estado === filterEstado;
        return matchSearch && matchFilter;
    });

    return (
        <Container fluid className="py-4">
            <Row className="mb-4">
                <Col>
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <Radio size={32} className="text-success me-3" />
                            <div>
                                <h2 className="mb-0">Gestión de Estaciones</h2>
                                <p className="text-muted mb-0">Administra las estaciones de monitoreo</p>
                            </div>
                        </div>
                        {(user?.rol === 'admin_sistema' || user?.rol === 'admin_institucion') && (
                            <Button 
                                variant="success" 
                                onClick={() => handleOpenModal('crear')}
                            >
                                <Plus size={18} className="me-2" />
                                Nueva Estación
                            </Button>
                        )}
                    </div>
                </Col>
            </Row>

            {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            {/* Filtros */}
            <Row className="mb-3">
                <Col md={6}>
                    <InputGroup>
                        <InputGroup.Text>
                            <Search size={18} />
                        </InputGroup.Text>
                        <Form.Control
                            placeholder="Buscar estación por nombre o ubicación..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                </Col>
                <Col md={3}>
                    <InputGroup>
                        <InputGroup.Text>
                            <Filter size={18} />
                        </InputGroup.Text>
                        <Form.Select 
                            value={filterEstado}
                            onChange={(e) => setFilterEstado(e.target.value)}
                        >
                            <option value="todas">Todas</option>
                            <option value="activa">Activas</option>
                            <option value="inactiva">Inactivas</option>
                            <option value="mantenimiento">En Mantenimiento</option>
                            <option value="pendiente">Pendientes</option>
                        </Form.Select>
                    </InputGroup>
                </Col>
            </Row>

            {/* Tabla de Estaciones */}
            <Row>
                <Col xs={12}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            {loading ? (
                                <div className="text-center py-5">
                                    <Spinner animation="border" variant="primary" />
                                    <p className="mt-3 text-muted">Cargando estaciones...</p>
                                </div>
                            ) : estacionesFiltradas.length === 0 ? (
                                <div className="text-center py-5">
                                    <Radio size={48} className="text-muted mb-3" />
                                    <h5>No hay estaciones</h5>
                                    <p className="text-muted">
                                        {searchTerm || filterEstado !== 'todas' 
                                            ? 'No se encontraron resultados con los filtros aplicados'
                                            : 'Aún no hay estaciones registradas'}
                                    </p>
                                </div>
                            ) : (
                                <Table responsive hover>
                                    <thead className="table-light">
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Ubicación</th>
                                            <th>Coordenadas</th>
                                            <th>Estado</th>
                                            <th>Sensores</th>
                                            <th className="text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {estacionesFiltradas.map((estacion) => (
                                            <tr key={estacion.id}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <Radio size={18} className="me-2 text-success" />
                                                        <div>
                                                            <strong>{estacion.nombre}</strong>
                                                            {estacion.descripcion && (
                                                                <div>
                                                                    <small className="text-muted">
                                                                        {estacion.descripcion}
                                                                    </small>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <small>
                                                        <MapPin size={14} className="me-1" />
                                                        {estacion.direccion || 'Sin dirección'}
                                                    </small>
                                                </td>
                                                <td>
                                                    <small className="text-muted">
                                                        {estacion.latitud}, {estacion.longitud}
                                                    </small>
                                                </td>
                                                <td>{getEstadoBadge(estacion.estado)}</td>
                                                <td>
                                                    <Button
                                                        variant="outline-info"
                                                        size="sm"
                                                        onClick={() => handleVerSensores(estacion)}
                                                    >
                                                        Ver Sensores
                                                    </Button>
                                                </td>
                                                <td className="text-center">
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        className="me-2"
                                                        onClick={() => handleOpenModal('ver', estacion)}
                                                    >
                                                        <Eye size={16} />
                                                    </Button>
                                                    {(user?.rol === 'admin_sistema' || user?.rol === 'admin_institucion') && (
                                                        <>
                                                            <Button
                                                                variant="outline-warning"
                                                                size="sm"
                                                                className="me-2"
                                                                onClick={() => handleOpenModal('editar', estacion)}
                                                            >
                                                                <Edit size={16} />
                                                            </Button>
                                                            <Button
                                                                variant="outline-danger"
                                                                size="sm"
                                                                onClick={() => handleDelete(estacion.id)}
                                                            >
                                                                <Trash2 size={16} />
                                                            </Button>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Modal Crear/Editar/Ver Estación */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {modalType === 'crear' && 'Nueva Estación'}
                        {modalType === 'editar' && 'Editar Estación'}
                        {modalType === 'ver' && 'Detalles de Estación'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Row>
                            <Col md={12} className="mb-3">
                                <Form.Group>
                                    <Form.Label>Nombre <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        required
                                        disabled={modalType === 'ver'}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={12} className="mb-3">
                                <Form.Group>
                                    <Form.Label>Descripción</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        name="descripcion"
                                        value={formData.descripcion}
                                        onChange={handleChange}
                                        disabled={modalType === 'ver'}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={12} className="mb-3">
                                <Form.Group>
                                    <Form.Label>Dirección</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="direccion"
                                        value={formData.direccion}
                                        onChange={handleChange}
                                        disabled={modalType === 'ver'}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6} className="mb-3">
                                <Form.Group>
                                    <Form.Label>Latitud <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.000001"
                                        name="latitud"
                                        value={formData.latitud}
                                        onChange={handleChange}
                                        required
                                        disabled={modalType === 'ver'}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6} className="mb-3">
                                <Form.Group>
                                    <Form.Label>Longitud <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.000001"
                                        name="longitud"
                                        value={formData.longitud}
                                        onChange={handleChange}
                                        required
                                        disabled={modalType === 'ver'}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={12} className="mb-3">
                                <Form.Group>
                                    <Form.Label>Estado</Form.Label>
                                    <Form.Select
                                        name="estado"
                                        value={formData.estado}
                                        onChange={handleChange}
                                        disabled={modalType === 'ver'}
                                    >
                                        <option value="activa">Activa</option>
                                        <option value="inactiva">Inactiva</option>
                                        <option value="mantenimiento">En Mantenimiento</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            {modalType === 'ver' ? 'Cerrar' : 'Cancelar'}
                        </Button>
                        {modalType !== 'ver' && (
                            <Button variant="success" type="submit" disabled={processing}>
                                {processing ? (
                                    <>
                                        <Spinner size="sm" className="me-2" />
                                        Guardando...
                                    </>
                                ) : (
                                    modalType === 'crear' ? 'Crear Estación' : 'Guardar Cambios'
                                )}
                            </Button>
                        )}
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Modal de Sensores */}
            <Modal show={showSensorsModal} onHide={() => setShowSensorsModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        Sensores de {selectedEstacion?.nombre}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {sensores.length === 0 ? (
                        <div className="text-center py-4">
                            <p className="text-muted">Esta estación no tiene sensores registrados</p>
                        </div>
                    ) : (
                        <Table hover>
                            <thead>
                                <tr>
                                    <th>Tipo</th>
                                    <th>Modelo</th>
                                    <th>Estado</th>
                                    <th>Última Calibración</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sensores.map((sensor) => (
                                    <tr key={sensor.id}>
                                        <td>
                                            <Badge bg="info">{sensor.tipo_sensor}</Badge>
                                        </td>
                                        <td>{sensor.modelo || 'N/A'}</td>
                                        <td>
                                            <Badge bg={sensor.estado === 'operativo' ? 'success' : 'warning'}>
                                                {sensor.estado}
                                            </Badge>
                                        </td>
                                        <td>
                                            <small className="text-muted">
                                                {sensor.fecha_ultima_calibracion 
                                                    ? new Date(sensor.fecha_ultima_calibracion).toLocaleDateString()
                                                    : 'Nunca'}
                                            </small>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowSensorsModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default EstacionesPage;
