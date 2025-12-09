import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Table, Badge, Modal } from 'react-bootstrap';
import { FileText, Database, FileJson } from 'lucide-react';
import reporteService from '../../services/reporteService';

const ReportesPage = () => {
    const [tipoReporte, setTipoReporte] = useState('general');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [reportesGenerados, setReportesGenerados] = useState([]);

    // Estado para el modal de visualización JSON
    const [showModal, setShowModal] = useState(false);
    const [contenidoModal, setContenidoModal] = useState(null);

    const [filtros, setFiltros] = useState({
        fecha_inicio: '',
        fecha_fin: ''
    });

    const handleGenerarReporte = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            let reporte;
            const params = {
                fecha_inicio: filtros.fecha_inicio,
                fecha_fin: filtros.fecha_fin,
            };

            // Ajustar parámetros según el tipo de reporte
            switch (tipoReporte) {
                case 'general':
                    params.tipo_reporte = 'calidad_aire';
                    reporte = await reporteService.generarReporteGeneral(params);
                    break;

                case 'detallado':
                    params.tipo_reporte = 'tendencias';
                    reporte = await reporteService.generarReporteGeneral(params);
                    break;

                case 'alertas':
                    params.tipo_reporte = 'alertas';
                    reporte = await reporteService.generarReporteGeneral(params);
                    break;

                case 'infraestructura':
                    params.tipo_reporte = 'infraestructura';
                    reporte = await reporteService.generarReporteGeneral(params);
                    break;

                default:
                    params.tipo_reporte = 'calidad_aire';
                    reporte = await reporteService.generarReporteGeneral(params);
            }

            // Agregar a historial local
            const nuevoReporte = {
                id: Date.now(),
                tipo: tipoReporte,
                fecha: new Date().toLocaleDateString(),
                data: reporte
            };

            setReportesGenerados(prev => [nuevoReporte, ...prev]);
            setSuccess('Reporte generado exitosamente');

            // MOSTRAR EN MODAL
            setContenidoModal(reporte);
            setShowModal(true);

        } catch (err) {
            console.error(err);
            setError('Error al generar reporte: ' + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    const verReporteHistorial = (reporteData) => {
        setContenidoModal(reporteData);
        setShowModal(true);
    };

    return (
        <Container fluid className="py-4">
            <Row className="mb-4">
                <Col>
                    <div className="d-flex align-items-center">
                        <FileText size={32} className="text-primary me-3" />
                        <div>
                            <h2 className="mb-0">Generación de Reportes</h2>
                            <p className="text-muted mb-0">Visualización de datos históricos</p>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col md={4}>
                    <Card className="shadow-sm mb-4">
                        <Card.Header className="bg-white">
                            <h5 className="mb-0">Configuración</h5>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleGenerarReporte}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tipo de Reporte</Form.Label>
                                    <Form.Select
                                        value={tipoReporte}
                                        onChange={(e) => setTipoReporte(e.target.value)}
                                    >
                                        <option value="general">Reporte General del Sistema</option>
                                        <option value="detallado">Reporte de Tendencias</option>
                                        <option value="alertas">Histórico de Alertas</option>
                                        <option value="infraestructura">Estado de Infraestructura</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Rango de Fechas</Form.Label>
                                    <Row>
                                        <Col>
                                            <Form.Control
                                                type="date"
                                                value={filtros.fecha_inicio}
                                                onChange={(e) => setFiltros({ ...filtros, fecha_inicio: e.target.value })}
                                            />
                                            <Form.Text className="text-muted">Desde</Form.Text>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="date"
                                                value={filtros.fecha_fin}
                                                onChange={(e) => setFiltros({ ...filtros, fecha_fin: e.target.value })}
                                            />
                                            <Form.Text className="text-muted">Hasta</Form.Text>
                                        </Col>
                                    </Row>
                                </Form.Group>


                                <div className="d-grid mt-4">
                                    <Button variant="primary" type="submit" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <Spinner animation="border" size="sm" className="me-2" />
                                                Generando...
                                            </>
                                        ) : (
                                            <>
                                                <Database size={18} className="me-2" />
                                                Generar Reporte
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={8}>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}

                    <Card className="shadow-sm">
                        <Card.Header className="bg-white">
                            <h5 className="mb-0">Historial de Generación (Sesión Actual)</h5>
                        </Card.Header>
                        <Card.Body>
                            {reportesGenerados.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <FileText size={48} className="mb-3 opacity-50" />
                                    <p>No se han generado reportes en esta sesión</p>
                                </div>
                            ) : (
                                <Table hover responsive>
                                    <thead>
                                        <tr>
                                            <th>Tipo</th>
                                            <th>Fecha</th>
                                            <th>Formato</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportesGenerados.map((rep) => (
                                            <tr key={rep.id}>
                                                <td>
                                                    {rep.tipo === 'general' ? 'General' :
                                                        rep.tipo === 'detallado' ? 'Tendencias' : rep.tipo}
                                                </td>
                                                <td>{rep.fecha}</td>
                                                <td><Badge bg="secondary">JSON</Badge></td>
                                                <td>
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        onClick={() => verReporteHistorial(rep.data)}
                                                    >
                                                        <FileJson size={16} className="me-1" /> Ver JSON
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

            {/* MODAL PARA VER JSON */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Resultado del Reporte</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <pre style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '5px' }}>
                        {JSON.stringify(contenidoModal, null, 2)}
                    </pre>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ReportesPage;
