import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Badge, Spinner, Alert, ListGroup } from 'react-bootstrap';
import { FileText, Download, Calendar, Building, Radio, TrendingUp, CheckCircle } from 'lucide-react';
import reporteService from '../../services/reporteService';
import estacionService from '../../services/estacionService';
import institucionService from '../../services/institucionService';
import { useAuth } from '../../context/AuthContext';

const ReportesPage = () => {
    const { user } = useAuth();
    const [tipoReporte, setTipoReporte] = useState('general');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // Datos para los filtros
    const [estaciones, setEstaciones] = useState([]);
    const [instituciones, setInstituciones] = useState([]);
    
    // Filtros del reporte
    const [filtros, setFiltros] = useState({
        estacion_id: '',
        institucion_id: '',
        fecha_inicio: '',
        fecha_fin: '',
        tipo_contaminante: 'PM2.5',
        formato: 'pdf'
    });

    // Reportes generados
    const [reportesGenerados, setReportesGenerados] = useState([]);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const [estacionesData, institucionesData] = await Promise.all([
                estacionService.getActivas(),
                user?.rol === 'admin_sistema' ? institucionService.getAprobadas() : Promise.resolve([])
            ]);
            
            setEstaciones(estacionesData);
            setInstituciones(institucionesData);
            
            // Configurar fechas por defecto (último mes)
            const hoy = new Date();
            const hace30Dias = new Date(hoy);
            hace30Dias.setDate(hoy.getDate() - 30);
            
            setFiltros(prev => ({
                ...prev,
                fecha_fin: hoy.toISOString().split('T')[0],
                fecha_inicio: hace30Dias.toISOString().split('T')[0]
            }));
        } catch (err) {
            setError('Error al cargar datos: ' + err.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
    };

    const handleGenerarReporte = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        
        try {
            let reporte;
            
            switch (tipoReporte) {
                case 'general':
                    reporte = await reporteService.generarReporteGeneral(
                        filtros.fecha_inicio,
                        filtros.fecha_fin,
                        filtros.formato
                    );
                    break;
                    
                case 'detallado':
                    if (!filtros.estacion_id) {
                        setError('Debes seleccionar una estación para el reporte detallado');
                        setLoading(false);
                        return;
                    }
                    reporte = await reporteService.generarReporteDetallado(
                        filtros.estacion_id,
                        filtros.fecha_inicio,
                        filtros.fecha_fin,
                        filtros.formato
                    );
                    break;
                    
                case 'calidad_aire':
                    reporte = await reporteService.getReporteCalidadAire(
                        filtros.estacion_id || undefined,
                        filtros.fecha_inicio,
                        filtros.fecha_fin
                    );
                    break;
                    
                case 'tendencias':
                    reporte = await reporteService.getReporteTendencias(
                        filtros.tipo_contaminante,
                        filtros.fecha_inicio,
                        filtros.fecha_fin,
                        filtros.estacion_id || undefined
                    );
                    break;
                    
                case 'comparativo':
                    reporte = await reporteService.getReporteComparativo(
                        filtros.fecha_inicio,
                        filtros.fecha_fin,
                        filtros.institucion_id || undefined
                    );
                    break;
                    
                default:
                    throw new Error('Tipo de reporte no válido');
            }
            
            // Agregar a la lista de reportes generados
            const nuevoReporte = {
                id: Date.now(),
                tipo: tipoReporte,
                fecha_generacion: new Date().toLocaleString(),
                parametros: { ...filtros },
                data: reporte
            };
            
            setReportesGenerados(prev => [nuevoReporte, ...prev]);
            setSuccess('Reporte generado exitosamente');
            
            // Si es un archivo (PDF/CSV), descargarlo automáticamente
            if (filtros.formato === 'pdf' || filtros.formato === 'csv') {
                descargarReporte(reporte, tipoReporte, filtros.formato);
            }
            
        } catch (err) {
            setError('Error al generar reporte: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const descargarReporte = (data, tipo, formato) => {
        const extension = formato === 'pdf' ? 'pdf' : 'csv';
        const mimeType = formato === 'pdf' ? 'application/pdf' : 'text/csv';
        
        const blob = new Blob([data], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_${tipo}_${new Date().toISOString().split('T')[0]}.${extension}`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const getTipoReporteLabel = (tipo) => {
        const labels = {
            general: 'Reporte General',
            detallado: 'Reporte Detallado por Estación',
            calidad_aire: 'Índice de Calidad del Aire',
            tendencias: 'Análisis de Tendencias',
            comparativo: 'Reporte Comparativo'
        };
        return labels[tipo] || tipo;
    };

    return (
        <Container fluid className="py-4">
            <Row className="mb-4">
                <Col>
                    <div className="d-flex align-items-center">
                        <FileText size={32} className="text-primary me-3" />
                        <div>
                            <h2 className="mb-0">Generación de Reportes</h2>
                            <p className="text-muted mb-0">Crea reportes personalizados de calidad del aire</p>
                        </div>
                    </div>
                </Col>
            </Row>

            {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert variant="success" dismissible onClose={() => setSuccess('')}>
                    <CheckCircle size={18} className="me-2" />
                    {success}
                </Alert>
            )}

            <Row>
                {/* Formulario de Generación */}
                <Col lg={5}>
                    <Card className="shadow-sm mb-4">
                        <Card.Header className="bg-primary text-white">
                            <h5 className="mb-0">
                                <FileText size={20} className="me-2" />
                                Configurar Reporte
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleGenerarReporte}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">Tipo de Reporte</Form.Label>
                                    <Form.Select 
                                        value={tipoReporte}
                                        onChange={(e) => setTipoReporte(e.target.value)}
                                    >
                                        <option value="general">Reporte General del Sistema</option>
                                        <option value="detallado">Reporte Detallado por Estación</option>
                                        <option value="calidad_aire">Índice de Calidad del Aire (ICA)</option>
                                        <option value="tendencias">Análisis de Tendencias</option>
                                        <option value="comparativo">Reporte Comparativo de Estaciones</option>
                                    </Form.Select>
                                    <Form.Text className="text-muted">
                                        Selecciona el tipo de análisis que deseas generar
                                    </Form.Text>
                                </Form.Group>

                                <Row>
                                    <Col md={6} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="fw-semibold">
                                                <Calendar size={16} className="me-2" />
                                                Fecha Inicio
                                            </Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="fecha_inicio"
                                                value={filtros.fecha_inicio}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={6} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="fw-semibold">
                                                <Calendar size={16} className="me-2" />
                                                Fecha Fin
                                            </Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="fecha_fin"
                                                value={filtros.fecha_fin}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {(tipoReporte === 'detallado' || tipoReporte === 'calidad_aire' || tipoReporte === 'tendencias') && (
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold">
                                            <Radio size={16} className="me-2" />
                                            Estación
                                        </Form.Label>
                                        <Form.Select
                                            name="estacion_id"
                                            value={filtros.estacion_id}
                                            onChange={handleChange}
                                            required={tipoReporte === 'detallado'}
                                        >
                                            <option value="">
                                                {tipoReporte === 'detallado' ? 'Selecciona una estación...' : 'Todas las estaciones'}
                                            </option>
                                            {estaciones.map(est => (
                                                <option key={est.id} value={est.id}>
                                                    {est.nombre}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                )}

                                {tipoReporte === 'tendencias' && (
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold">
                                            <TrendingUp size={16} className="me-2" />
                                            Contaminante
                                        </Form.Label>
                                        <Form.Select
                                            name="tipo_contaminante"
                                            value={filtros.tipo_contaminante}
                                            onChange={handleChange}
                                        >
                                            <option value="PM2.5">PM 2.5</option>
                                            <option value="PM10">PM 10</option>
                                            <option value="O3">Ozono (O₃)</option>
                                            <option value="NO2">NO₂</option>
                                            <option value="SO2">SO₂</option>
                                            <option value="CO">CO</option>
                                        </Form.Select>
                                    </Form.Group>
                                )}

                                {tipoReporte === 'comparativo' && user?.rol === 'admin_sistema' && (
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold">
                                            <Building size={16} className="me-2" />
                                            Institución
                                        </Form.Label>
                                        <Form.Select
                                            name="institucion_id"
                                            value={filtros.institucion_id}
                                            onChange={handleChange}
                                        >
                                            <option value="">Todas las instituciones</option>
                                            {instituciones.map(inst => (
                                                <option key={inst.id} value={inst.id}>
                                                    {inst.nombre}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                )}

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold">Formato de Salida</Form.Label>
                                    <div className="d-flex gap-3">
                                        <Form.Check
                                            type="radio"
                                            label="PDF"
                                            name="formato"
                                            value="pdf"
                                            checked={filtros.formato === 'pdf'}
                                            onChange={handleChange}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="CSV"
                                            name="formato"
                                            value="csv"
                                            checked={filtros.formato === 'csv'}
                                            onChange={handleChange}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="JSON"
                                            name="formato"
                                            value="json"
                                            checked={filtros.formato === 'json'}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </Form.Group>

                                <Button 
                                    variant="success" 
                                    type="submit" 
                                    className="w-100"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Spinner size="sm" className="me-2" />
                                            Generando Reporte...
                                        </>
                                    ) : (
                                        <>
                                            <FileText size={18} className="me-2" />
                                            Generar Reporte
                                        </>
                                    )}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>

                    {/* Información de Reportes */}
                    <Card className="shadow-sm">
                        <Card.Header className="bg-light">
                            <h6 className="mb-0">Tipos de Reportes Disponibles</h6>
                        </Card.Header>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <strong>Reporte General:</strong> Vista global de todas las estaciones y mediciones
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Reporte Detallado:</strong> Análisis exhaustivo de una estación específica
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>ICA:</strong> Índice de Calidad del Aire calculado según normativa
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Tendencias:</strong> Evolución temporal de contaminantes
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Comparativo:</strong> Comparación entre múltiples estaciones
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>

                {/* Historial de Reportes Generados */}
                <Col lg={7}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-light">
                            <h5 className="mb-0">
                                <FileText size={20} className="me-2" />
                                Reportes Generados
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            {reportesGenerados.length === 0 ? (
                                <div className="text-center py-5">
                                    <FileText size={48} className="text-muted mb-3" />
                                    <h5>No hay reportes generados</h5>
                                    <p className="text-muted">
                                        Los reportes que generes aparecerán aquí
                                    </p>
                                </div>
                            ) : (
                                <Table responsive hover>
                                    <thead>
                                        <tr>
                                            <th>Tipo</th>
                                            <th>Fecha Generación</th>
                                            <th>Período</th>
                                            <th>Formato</th>
                                            <th className="text-center">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportesGenerados.map((reporte) => (
                                            <tr key={reporte.id}>
                                                <td>
                                                    <Badge bg="primary">
                                                        {getTipoReporteLabel(reporte.tipo)}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    <small>{reporte.fecha_generacion}</small>
                                                </td>
                                                <td>
                                                    <small className="text-muted">
                                                        {new Date(reporte.parametros.fecha_inicio).toLocaleDateString()} - {' '}
                                                        {new Date(reporte.parametros.fecha_fin).toLocaleDateString()}
                                                    </small>
                                                </td>
                                                <td>
                                                    <Badge bg="secondary">
                                                        {reporte.parametros.formato.toUpperCase()}
                                                    </Badge>
                                                </td>
                                                <td className="text-center">
                                                    <Button
                                                        variant="outline-success"
                                                        size="sm"
                                                        onClick={() => descargarReporte(
                                                            reporte.data,
                                                            reporte.tipo,
                                                            reporte.parametros.formato
                                                        )}
                                                    >
                                                        <Download size={16} />
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
        </Container>
    );
};

export default ReportesPage;
