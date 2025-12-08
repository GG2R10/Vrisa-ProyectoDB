import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Alert, Spinner } from 'react-bootstrap';
import alertaService from '../../services/alertaService';
import { AlertTriangle, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

/**
 * Componente de ejemplo que muestra cómo usar los servicios de Axios
 * Este componente lista las alertas del sistema y permite marcarlas como resueltas
 */
const AlertasList = () => {
    const [alertas, setAlertas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Cargar alertas al montar el componente
    useEffect(() => {
        cargarAlertas();
    }, []);

    const cargarAlertas = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Llamar al servicio para obtener alertas activas
            const data = await alertaService.getActivas();
            setAlertas(data);
        } catch (err) {
            setError(err.message || 'Error al cargar alertas');
            console.error('Error al cargar alertas:', err);
        } finally {
            setLoading(false);
        }
    };

    const marcarResuelta = async (alertaId) => {
        try {
            // Llamar al servicio para marcar como resuelta
            await alertaService.marcarResuelta(alertaId);
            
            // Recargar la lista
            await cargarAlertas();
            
            // Opcional: Mostrar mensaje de éxito
            alert('Alerta marcada como resuelta');
        } catch (err) {
            setError(err.message || 'Error al resolver alerta');
            console.error('Error al resolver alerta:', err);
        }
    };

    const getAlertIcon = (tipo) => {
        switch (tipo) {
            case 'critica':
                return <XCircle size={20} className="text-danger" />;
            case 'advertencia':
                return <AlertTriangle size={20} className="text-warning" />;
            default:
                return <AlertCircle size={20} className="text-info" />;
        }
    };

    const getAlertBadge = (tipo) => {
        switch (tipo) {
            case 'critica':
                return <Badge bg="danger">Crítica</Badge>;
            case 'advertencia':
                return <Badge bg="warning" text="dark">Advertencia</Badge>;
            default:
                return <Badge bg="info">Información</Badge>;
        }
    };

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Cargando...</span>
                </Spinner>
                <p className="mt-3 text-muted">Cargando alertas...</p>
            </Container>
        );
    }

    return (
        <Container fluid className="py-4">
            <Row className="mb-4">
                <Col>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="h3 fw-bold mb-1">
                                <AlertTriangle className="me-2" size={28} />
                                Alertas Activas
                            </h2>
                            <p className="text-muted mb-0">
                                Monitoreo de alertas del sistema de calidad del aire
                            </p>
                        </div>
                        <Button variant="outline-primary" onClick={cargarAlertas}>
                            Actualizar
                        </Button>
                    </div>
                </Col>
            </Row>

            {error && (
                <Alert variant="danger" dismissible onClose={() => setError(null)}>
                    <AlertCircle size={20} className="me-2" />
                    {error}
                </Alert>
            )}

            <Row>
                <Col>
                    <Card className="shadow-sm border-0">
                        <Card.Body className="p-0">
                            {alertas.length === 0 ? (
                                <div className="text-center py-5">
                                    <CheckCircle size={48} className="text-success mb-3" />
                                    <h5 className="text-muted">No hay alertas activas</h5>
                                    <p className="text-muted small">
                                        Todas las alertas han sido resueltas o no hay condiciones de alerta
                                    </p>
                                </div>
                            ) : (
                                <Table responsive hover className="mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th>Tipo</th>
                                            <th>Estación</th>
                                            <th>Descripción</th>
                                            <th>Fecha/Hora</th>
                                            <th>Valor</th>
                                            <th className="text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {alertas.map((alerta) => (
                                            <tr key={alerta.id}>
                                                <td>
                                                    <div className="d-flex align-items-center gap-2">
                                                        {getAlertIcon(alerta.tipo_alerta)}
                                                        {getAlertBadge(alerta.tipo_alerta)}
                                                    </div>
                                                </td>
                                                <td className="fw-medium">
                                                    {alerta.estacion_nombre || `Estación #${alerta.estacion}`}
                                                </td>
                                                <td>{alerta.descripcion}</td>
                                                <td className="text-muted small">
                                                    {new Date(alerta.fecha_hora_generacion).toLocaleString('es-ES')}
                                                </td>
                                                <td>
                                                    <span className="badge bg-secondary">
                                                        {alerta.valor_medicion} {alerta.unidad_medida}
                                                    </span>
                                                </td>
                                                <td className="text-center">
                                                    <Button
                                                        variant="outline-success"
                                                        size="sm"
                                                        onClick={() => marcarResuelta(alerta.id)}
                                                    >
                                                        <CheckCircle size={16} className="me-1" />
                                                        Resolver
                                                    </Button>
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

            {/* Estadísticas de alertas */}
            <Row className="mt-4">
                <Col md={4}>
                    <Card className="border-danger shadow-sm">
                        <Card.Body>
                            <div className="d-flex align-items-center">
                                <XCircle size={32} className="text-danger me-3" />
                                <div>
                                    <div className="small text-muted">Críticas</div>
                                    <div className="h4 fw-bold mb-0">
                                        {alertas.filter(a => a.tipo_alerta === 'critica').length}
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-warning shadow-sm">
                        <Card.Body>
                            <div className="d-flex align-items-center">
                                <AlertTriangle size={32} className="text-warning me-3" />
                                <div>
                                    <div className="small text-muted">Advertencias</div>
                                    <div className="h4 fw-bold mb-0">
                                        {alertas.filter(a => a.tipo_alerta === 'advertencia').length}
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-primary shadow-sm">
                        <Card.Body>
                            <div className="d-flex align-items-center">
                                <AlertCircle size={32} className="text-primary me-3" />
                                <div>
                                    <div className="small text-muted">Total</div>
                                    <div className="h4 fw-bold mb-0">{alertas.length}</div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AlertasList;
