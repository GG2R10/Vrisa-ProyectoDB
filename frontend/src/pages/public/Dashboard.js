import React, { useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import MapComponent from '../../components/MapComponent';
import { Activity, Wind, Droplets, Thermometer } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// Mock Data
const MOCK_STATIONS = [
    { id: 1, name: 'Estación Univalle', lat: 3.37, lng: -76.53, institution: 'Universidad del Valle', ica: 45 },
    { id: 2, name: 'Estación Base Aérea', lat: 3.45, lng: -76.50, institution: 'CVC', ica: 80 },
    { id: 3, name: 'Estación Compartir', lat: 3.42, lng: -76.48, institution: 'DAGMA', ica: 120 },
];

const Dashboard = () => {
    const { theme } = useTheme();
    const [selectedStation, setSelectedStation] = useState(null);

    return (
        <Container fluid className="py-4">
            {/* Header */}
            <Row className="mb-4">
                <Col>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h1 className="h3 fw-bold mb-1">Monitor de Calidad del Aire</h1>
                            <p className="text-muted mb-0">Visualización en tiempo real de la red VriSA</p>
                        </div>
                        <div className="text-end">
                            <div className="small text-muted">Cali, Colombia</div>
                            <div className="h4 fw-bold mb-0">28°C</div>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* Stats Overview */}
            <Row className="g-3 mb-4">
                <Col xs={12} sm={6} lg={3}>
                    <StatCard icon={<Activity />} label="Estaciones Activas" value="12" color="primary" />
                </Col>
                <Col xs={12} sm={6} lg={3}>
                    <StatCard icon={<Wind />} label="Velocidad Viento" value="12 km/h" color="secondary" />
                </Col>
                <Col xs={12} sm={6} lg={3}>
                    <StatCard icon={<Droplets />} label="Humedad Promedio" value="65%" color="info" />
                </Col>
                <Col xs={12} sm={6} lg={3}>
                    <StatCard icon={<Thermometer />} label="Temp. Promedio" value="28°C" color="warning" />
                </Col>
            </Row>

            {/* Main Content */}
            <Row className="g-4">
                {/* Map Area */}
                <Col lg={8}>
                    <Card className="shadow-sm border-0">
                        <Card.Body>
                            <h5 className="fw-semibold mb-3">Mapa de Estaciones</h5>
                            <MapComponent stations={MOCK_STATIONS} onStationSelect={setSelectedStation} />
                        </Card.Body>
                    </Card>
                </Col>

                {/* Station Details */}
                <Col lg={4}>
                    {selectedStation ? (
                        <Card className="shadow-sm border-0 h-100">
                            <Card.Body>
                                <h5 className="fw-bold mb-2">{selectedStation.name}</h5>
                                <span className="badge bg-primary mb-3">
                                    {selectedStation.institution}
                                </span>

                                <div className="mb-4">
                                    <div className="small text-muted mb-1">Índice de Calidad del Aire (ICA)</div>
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="display-6 fw-bold">{selectedStation.ica}</div>
                                        <div>
                                            <span 
                                                className={`badge ${selectedStation.ica < 50 ? 'bg-success' : 'bg-warning'}`}
                                            >
                                                {selectedStation.ica < 50 ? 'Bueno' : 'Moderado'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <hr />

                                <div>
                                    <h6 className="fw-semibold mb-3">Mediciones Recientes</h6>
                                    <div className="d-flex flex-column gap-2">
                                        <MeasurementRow label="PM 2.5" value="12 µg/m³" />
                                        <MeasurementRow label="PM 10" value="28 µg/m³" />
                                        <MeasurementRow label="O3" value="45 ppb" />
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    ) : (
                        <Card className="shadow-sm border-0 h-100">
                            <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center text-muted">
                                <MapPlaceholderIcon />
                                <p className="mt-3 mb-0">
                                    Selecciona una estación en el mapa para ver sus detalles en tiempo real.
                                </p>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

const StatCard = ({ icon, label, value, color }) => (
    <Card className="shadow-sm border-0 h-100">
        <Card.Body className="d-flex align-items-center">
            <div 
                className={`p-3 rounded bg-${color} bg-opacity-10 text-${color} me-3`}
                style={{ minWidth: '60px', textAlign: 'center' }}
            >
                {React.cloneElement(icon, { size: 28 })}
            </div>
            <div>
                <div className="small text-muted">{label}</div>
                <div className="h5 fw-bold mb-0">{value}</div>
            </div>
        </Card.Body>
    </Card>
);

const MeasurementRow = ({ label, value }) => (
    <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
        <span className="text-muted">{label}</span>
        <span className="fw-bold font-monospace">{value}</span>
    </div>
);

const MapPlaceholderIcon = () => (
    <svg className="opacity-25" width="64" height="64" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
);

export default Dashboard;
