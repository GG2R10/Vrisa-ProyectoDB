import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Spinner, Alert, ButtonGroup } from 'react-bootstrap';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, MapPin, Activity, Download } from 'lucide-react';
import medicionService from '../../services/medicionService';
import estacionService from '../../services/estacionService';

const MedicionesPage = () => {
    const [estaciones, setEstaciones] = useState([]);
    const [selectedEstacion, setSelectedEstacion] = useState('');
    const [tipoContaminante, setTipoContaminante] = useState('PM2.5');
    const [rangoFecha, setRangoFecha] = useState('24h');
    const [chartType, setChartType] = useState('line');
    
    const [mediciones, setMediciones] = useState([]);
    const [estadisticas, setEstadisticas] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        cargarEstaciones();
    }, []);

    useEffect(() => {
        if (selectedEstacion) {
            cargarMediciones();
        }
    }, [selectedEstacion, tipoContaminante, rangoFecha]);

    const cargarEstaciones = async () => {
        try {
            const data = await estacionService.getActivas();
            setEstaciones(data);
            if (data.length > 0) {
                setSelectedEstacion(data[0].id);
            }
        } catch (err) {
            setError('Error al cargar estaciones: ' + err.message);
        }
    };

    const cargarMediciones = async () => {
        setLoading(true);
        setError('');
        
        try {
            const ahora = new Date();
            let fechaInicio;
            
            switch (rangoFecha) {
                case '24h':
                    fechaInicio = new Date(ahora - 24 * 60 * 60 * 1000);
                    break;
                case '7d':
                    fechaInicio = new Date(ahora - 7 * 24 * 60 * 60 * 1000);
                    break;
                case '30d':
                    fechaInicio = new Date(ahora - 30 * 24 * 60 * 60 * 1000);
                    break;
                default:
                    fechaInicio = new Date(ahora - 24 * 60 * 60 * 1000);
            }

            const data = await medicionService.getByDateRange(
                selectedEstacion,
                fechaInicio.toISOString(),
                ahora.toISOString(),
                tipoContaminante
            );

            // Procesar datos para gráficas
            const medicionesProcesadas = data.map(m => ({
                fecha: new Date(m.fecha).toLocaleString('es-CO', { 
                    month: 'short', 
                    day: 'numeric', 
                    hour: '2-digit' 
                }),
                valor: m.valor,
                tipo: m.tipo_contaminante,
                timestamp: new Date(m.fecha).getTime()
            }));

            // Ordenar por fecha
            medicionesProcesadas.sort((a, b) => a.timestamp - b.timestamp);

            setMediciones(medicionesProcesadas);

            // Calcular estadísticas
            if (medicionesProcesadas.length > 0) {
                const valores = medicionesProcesadas.map(m => m.valor);
                setEstadisticas({
                    promedio: (valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(2),
                    maximo: Math.max(...valores).toFixed(2),
                    minimo: Math.min(...valores).toFixed(2),
                    total: valores.length
                });
            }
        } catch (err) {
            setError('Error al cargar mediciones: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const getCalidadAire = (tipo, valor) => {
        // Índices simplificados según tipo de contaminante
        const limites = {
            'PM2.5': [12, 35.4, 55.4, 150.4, 250.4],
            'PM10': [54, 154, 254, 354, 424],
            'O3': [54, 70, 85, 105, 200],
            'NO2': [53, 100, 360, 649, 1249],
            'SO2': [35, 75, 185, 304, 604],
            'CO': [4.4, 9.4, 12.4, 15.4, 30.4]
        };

        const niveles = [
            { nombre: 'Buena', color: 'success' },
            { nombre: 'Moderada', color: 'info' },
            { nombre: 'Dañina para grupos sensibles', color: 'warning' },
            { nombre: 'Dañina', color: 'danger' },
            { nombre: 'Muy Dañina', color: 'danger' },
            { nombre: 'Peligrosa', color: 'dark' }
        ];

        const limiteTipo = limites[tipo] || limites['PM2.5'];
        
        for (let i = 0; i < limiteTipo.length; i++) {
            if (valor <= limiteTipo[i]) {
                return niveles[i];
            }
        }
        
        return niveles[5];
    };

    const handleExportarDatos = () => {
        // Crear CSV
        const csv = [
            ['Fecha', 'Tipo Contaminante', 'Valor', 'Unidad'],
            ...mediciones.map(m => [
                m.fecha,
                m.tipo,
                m.valor,
                getUnidad(tipoContaminante)
            ])
        ].map(row => row.join(',')).join('\n');

        // Descargar
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mediciones_${selectedEstacion}_${new Date().toISOString()}.csv`;
        a.click();
    };

    const getUnidad = (tipo) => {
        const unidades = {
            'PM2.5': 'µg/m³',
            'PM10': 'µg/m³',
            'O3': 'ppb',
            'NO2': 'ppb',
            'SO2': 'ppb',
            'CO': 'ppm'
        };
        return unidades[tipo] || 'µg/m³';
    };

    const renderChart = () => {
        if (loading) {
            return (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3 text-muted">Cargando datos...</p>
                </div>
            );
        }

        if (mediciones.length === 0) {
            return (
                <div className="text-center py-5">
                    <Activity size={48} className="text-muted mb-3" />
                    <h5>No hay datos disponibles</h5>
                    <p className="text-muted">
                        No se encontraron mediciones para el rango seleccionado
                    </p>
                </div>
            );
        }

        const ChartComponent = chartType === 'line' ? LineChart : 
                             chartType === 'bar' ? BarChart : AreaChart;
        const DataComponent = chartType === 'line' ? Line : 
                            chartType === 'bar' ? Bar : Area;

        return (
            <ResponsiveContainer width="100%" height={400}>
                <ChartComponent data={mediciones}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="fecha" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                    />
                    <YAxis 
                        label={{ 
                            value: getUnidad(tipoContaminante), 
                            angle: -90, 
                            position: 'insideLeft' 
                        }}
                    />
                    <Tooltip 
                        formatter={(value) => [value.toFixed(2), tipoContaminante]}
                        labelFormatter={(label) => `Fecha: ${label}`}
                    />
                    <Legend />
                    <DataComponent 
                        type="monotone" 
                        dataKey="valor" 
                        stroke="#0d6efd" 
                        fill="#0d6efd"
                        name={tipoContaminante}
                    />
                </ChartComponent>
            </ResponsiveContainer>
        );
    };

    const estacionSeleccionada = estaciones.find(e => e.id === parseInt(selectedEstacion));
    const calidadActual = estadisticas && getCalidadAire(tipoContaminante, parseFloat(estadisticas.promedio));

    return (
        <Container fluid className="py-4">
            <Row className="mb-4">
                <Col>
                    <div className="d-flex align-items-center">
                        <TrendingUp size={32} className="text-primary me-3" />
                        <div>
                            <h2 className="mb-0">Análisis de Mediciones</h2>
                            <p className="text-muted mb-0">Visualización de datos de calidad del aire</p>
                        </div>
                    </div>
                </Col>
            </Row>

            {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            {/* Controles */}
            <Row className="mb-4">
                <Col md={3}>
                    <Form.Group>
                        <Form.Label className="fw-semibold">
                            <MapPin size={16} className="me-2" />
                            Estación
                        </Form.Label>
                        <Form.Select 
                            value={selectedEstacion}
                            onChange={(e) => setSelectedEstacion(e.target.value)}
                        >
                            {estaciones.map(est => (
                                <option key={est.id} value={est.id}>
                                    {est.nombre}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
                
                <Col md={3}>
                    <Form.Group>
                        <Form.Label className="fw-semibold">
                            <Activity size={16} className="me-2" />
                            Contaminante
                        </Form.Label>
                        <Form.Select 
                            value={tipoContaminante}
                            onChange={(e) => setTipoContaminante(e.target.value)}
                        >
                            <option value="PM2.5">PM 2.5</option>
                            <option value="PM10">PM 10</option>
                            <option value="O3">Ozono (O₃)</option>
                            <option value="NO2">Dióxido de Nitrógeno (NO₂)</option>
                            <option value="SO2">Dióxido de Azufre (SO₂)</option>
                            <option value="CO">Monóxido de Carbono (CO)</option>
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col md={2}>
                    <Form.Group>
                        <Form.Label className="fw-semibold">
                            <Calendar size={16} className="me-2" />
                            Período
                        </Form.Label>
                        <Form.Select 
                            value={rangoFecha}
                            onChange={(e) => setRangoFecha(e.target.value)}
                        >
                            <option value="24h">Últimas 24 horas</option>
                            <option value="7d">Últimos 7 días</option>
                            <option value="30d">Últimos 30 días</option>
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col md={2}>
                    <Form.Label className="fw-semibold d-block">Tipo de Gráfica</Form.Label>
                    <ButtonGroup>
                        <Button 
                            variant={chartType === 'line' ? 'primary' : 'outline-primary'}
                            size="sm"
                            onClick={() => setChartType('line')}
                        >
                            Línea
                        </Button>
                        <Button 
                            variant={chartType === 'bar' ? 'primary' : 'outline-primary'}
                            size="sm"
                            onClick={() => setChartType('bar')}
                        >
                            Barras
                        </Button>
                        <Button 
                            variant={chartType === 'area' ? 'primary' : 'outline-primary'}
                            size="sm"
                            onClick={() => setChartType('area')}
                        >
                            Área
                        </Button>
                    </ButtonGroup>
                </Col>

                <Col md={2} className="d-flex align-items-end">
                    <Button 
                        variant="success" 
                        className="w-100"
                        onClick={handleExportarDatos}
                        disabled={mediciones.length === 0}
                    >
                        <Download size={16} className="me-2" />
                        Exportar
                    </Button>
                </Col>
            </Row>

            {/* Estadísticas */}
            {estadisticas && calidadActual && (
                <Row className="mb-4">
                    <Col md={3}>
                        <Card className="shadow-sm border-0" style={{ borderLeft: '4px solid #0d6efd' }}>
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <p className="text-muted mb-1 small">Promedio</p>
                                        <h4 className="mb-0">{estadisticas.promedio}</h4>
                                        <small className="text-muted">{getUnidad(tipoContaminante)}</small>
                                    </div>
                                    <TrendingUp size={32} className="text-primary" />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={3}>
                        <Card className="shadow-sm border-0" style={{ borderLeft: '4px solid #dc3545' }}>
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <p className="text-muted mb-1 small">Máximo</p>
                                        <h4 className="mb-0">{estadisticas.maximo}</h4>
                                        <small className="text-muted">{getUnidad(tipoContaminante)}</small>
                                    </div>
                                    <Activity size={32} className="text-danger" />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={3}>
                        <Card className="shadow-sm border-0" style={{ borderLeft: '4px solid #198754' }}>
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <p className="text-muted mb-1 small">Mínimo</p>
                                        <h4 className="mb-0">{estadisticas.minimo}</h4>
                                        <small className="text-muted">{getUnidad(tipoContaminante)}</small>
                                    </div>
                                    <Activity size={32} className="text-success" />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={3}>
                        <Card className="shadow-sm border-0" style={{ borderLeft: `4px solid var(--bs-${calidadActual.color})` }}>
                            <Card.Body>
                                <div>
                                    <p className="text-muted mb-1 small">Calidad del Aire</p>
                                    <Badge bg={calidadActual.color} className="fs-6">
                                        {calidadActual.nombre}
                                    </Badge>
                                    <div className="mt-2">
                                        <small className="text-muted">
                                            {estadisticas.total} mediciones
                                        </small>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Gráfica */}
            <Row>
                <Col xs={12}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-white">
                            <h5 className="mb-0">
                                {estacionSeleccionada?.nombre} - {tipoContaminante}
                            </h5>
                            <small className="text-muted">
                                Datos de los últimos {rangoFecha === '24h' ? '24 horas' : rangoFecha === '7d' ? '7 días' : '30 días'}
                            </small>
                        </Card.Header>
                        <Card.Body>
                            {renderChart()}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default MedicionesPage;
