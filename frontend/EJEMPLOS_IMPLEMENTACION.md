# Ejemplos de Implementación - VriSA Frontend

## 📝 Ejemplo 1: Formulario de Registro de Institución

```javascript
// frontend/src/pages/auth/RegisterInstitution.js
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Building } from 'lucide-react';

const RegisterInstitution = () => {
    const navigate = useNavigate();
    const { registerInstitution } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        tipo_institucion: 'publica',
        logo_url: '',
        color_primario: '#0d6efd',
        color_secundario: '#6c757d',
        email: '',
        telefono: '',
        // Usuario administrador
        admin_username: '',
        admin_password: '',
        admin_email: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            await registerInstitution(formData);
            setSuccess(true);
            
            // Redirigir después de 2 segundos
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.message || 'Error al registrar institución');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <Container className="min-vh-100 d-flex align-items-center justify-content-center">
                <Alert variant="success" className="text-center">
                    <h4>¡Registro Exitoso!</h4>
                    <p>Tu institución ha sido registrada. Recibirás una notificación cuando sea aprobada.</p>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="shadow-lg border-0">
                        <Card.Body className="p-4">
                            <div className="text-center mb-4">
                                <Building size={48} className="text-primary mb-3" />
                                <h2 className="fw-bold">Registrar Institución</h2>
                                <p className="text-muted">
                                    Completa el formulario para registrar tu institución
                                </p>
                            </div>

                            <Form onSubmit={handleSubmit}>
                                <h5 className="mb-3">Información de la Institución</h5>
                                
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre de la Institución *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        required
                                        placeholder="Ej: Universidad del Valle"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Descripción</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="descripcion"
                                        value={formData.descripcion}
                                        onChange={handleChange}
                                        placeholder="Breve descripción de la institución"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Tipo de Institución *</Form.Label>
                                    <Form.Select
                                        name="tipo_institucion"
                                        value={formData.tipo_institucion}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="publica">Pública</option>
                                        <option value="privada">Privada</option>
                                        <option value="mixta">Mixta</option>
                                    </Form.Select>
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Color Primario</Form.Label>
                                            <Form.Control
                                                type="color"
                                                name="color_primario"
                                                value={formData.color_primario}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Color Secundario</Form.Label>
                                            <Form.Control
                                                type="color"
                                                name="color_secundario"
                                                value={formData.color_secundario}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <hr className="my-4" />

                                <h5 className="mb-3">Administrador de la Institución</h5>

                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre de usuario *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="admin_username"
                                        value={formData.admin_username}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Email *</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="admin_email"
                                        value={formData.admin_email}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Contraseña *</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="admin_password"
                                        value={formData.admin_password}
                                        onChange={handleChange}
                                        required
                                        minLength={8}
                                    />
                                    <Form.Text className="text-muted">
                                        Mínimo 8 caracteres
                                    </Form.Text>
                                </Form.Group>

                                {error && (
                                    <Alert variant="danger" className="mb-3">
                                        {error}
                                    </Alert>
                                )}

                                <div className="d-grid gap-2">
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        size="lg"
                                        disabled={loading}
                                    >
                                        {loading ? 'Registrando...' : 'Registrar Institución'}
                                    </Button>
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => navigate('/login')}
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default RegisterInstitution;
```

---

## 📝 Ejemplo 2: Dashboard de Administrador con Aprobaciones

```javascript
// frontend/src/pages/admin/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Tabs, Tab, Modal, Form } from 'react-bootstrap';
import institucionService from '../../services/institucionService';
import estacionService from '../../services/estacionService';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const AdminDashboard = () => {
    const [instituciones, setInstituciones] = useState([]);
    const [estaciones, setEstaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [motivoRechazo, setMotivoRechazo] = useState('');
    const [activeTab, setActiveTab] = useState('instituciones');

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            const [instData, estData] = await Promise.all([
                institucionService.getPendientes(),
                estacionService.getPendientes()
            ]);
            setInstituciones(instData);
            setEstaciones(estData);
        } catch (error) {
            console.error('Error al cargar datos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAprobar = async (tipo, id) => {
        try {
            if (tipo === 'institucion') {
                await institucionService.aprobar(id);
            } else {
                await estacionService.aprobar(id);
            }
            await cargarDatos();
            alert('Aprobado exitosamente');
        } catch (error) {
            console.error('Error al aprobar:', error);
            alert('Error al aprobar');
        }
    };

    const handleRechazarClick = (tipo, item) => {
        setSelectedItem({ tipo, item });
        setShowModal(true);
    };

    const handleRechazarConfirm = async () => {
        try {
            const { tipo, item } = selectedItem;
            if (tipo === 'institucion') {
                await institucionService.rechazar(item.id, motivoRechazo);
            } else {
                await estacionService.rechazar(item.id, motivoRechazo);
            }
            setShowModal(false);
            setMotivoRechazo('');
            await cargarDatos();
            alert('Rechazado exitosamente');
        } catch (error) {
            console.error('Error al rechazar:', error);
            alert('Error al rechazar');
        }
    };

    return (
        <Container fluid className="py-4">
            <Row className="mb-4">
                <Col>
                    <h2 className="fw-bold">Panel de Administración</h2>
                    <p className="text-muted">Gestión de aprobaciones pendientes</p>
                </Col>
            </Row>

            <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
                <Tab 
                    eventKey="instituciones" 
                    title={
                        <span>
                            Instituciones 
                            <Badge bg="warning" className="ms-2">{instituciones.length}</Badge>
                        </span>
                    }
                >
                    <Card className="shadow-sm border-0 mt-3">
                        <Card.Body>
                            <Table responsive hover>
                                <thead className="bg-light">
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Tipo</th>
                                        <th>Descripción</th>
                                        <th>Estado</th>
                                        <th className="text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {instituciones.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center text-muted py-4">
                                                No hay instituciones pendientes
                                            </td>
                                        </tr>
                                    ) : (
                                        instituciones.map((inst) => (
                                            <tr key={inst.id}>
                                                <td className="fw-medium">{inst.nombre}</td>
                                                <td>
                                                    <Badge bg="secondary">{inst.tipo_institucion}</Badge>
                                                </td>
                                                <td className="text-truncate" style={{ maxWidth: '300px' }}>
                                                    {inst.descripcion}
                                                </td>
                                                <td>
                                                    <Badge bg="warning" className="d-flex align-items-center gap-1" style={{ width: 'fit-content' }}>
                                                        <Clock size={14} />
                                                        Pendiente
                                                    </Badge>
                                                </td>
                                                <td className="text-center">
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        className="me-2"
                                                        onClick={() => handleAprobar('institucion', inst.id)}
                                                    >
                                                        <CheckCircle size={16} className="me-1" />
                                                        Aprobar
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => handleRechazarClick('institucion', inst)}
                                                    >
                                                        <XCircle size={16} className="me-1" />
                                                        Rechazar
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Tab>

                <Tab 
                    eventKey="estaciones" 
                    title={
                        <span>
                            Estaciones 
                            <Badge bg="warning" className="ms-2">{estaciones.length}</Badge>
                        </span>
                    }
                >
                    <Card className="shadow-sm border-0 mt-3">
                        <Card.Body>
                            <Table responsive hover>
                                <thead className="bg-light">
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Institución</th>
                                        <th>Ubicación</th>
                                        <th>Estado</th>
                                        <th className="text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {estaciones.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center text-muted py-4">
                                                No hay estaciones pendientes
                                            </td>
                                        </tr>
                                    ) : (
                                        estaciones.map((est) => (
                                            <tr key={est.id}>
                                                <td className="fw-medium">{est.nombre}</td>
                                                <td>{est.institucion_nombre}</td>
                                                <td>
                                                    <small className="text-muted font-monospace">
                                                        {est.latitud}, {est.longitud}
                                                    </small>
                                                </td>
                                                <td>
                                                    <Badge bg="warning" className="d-flex align-items-center gap-1" style={{ width: 'fit-content' }}>
                                                        <Clock size={14} />
                                                        Pendiente
                                                    </Badge>
                                                </td>
                                                <td className="text-center">
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        className="me-2"
                                                        onClick={() => handleAprobar('estacion', est.id)}
                                                    >
                                                        <CheckCircle size={16} className="me-1" />
                                                        Aprobar
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => handleRechazarClick('estacion', est)}
                                                    >
                                                        <XCircle size={16} className="me-1" />
                                                        Rechazar
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Tab>
            </Tabs>

            {/* Modal de Rechazo */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Motivo de Rechazo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Especifica el motivo del rechazo:</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            value={motivoRechazo}
                            onChange={(e) => setMotivoRechazo(e.target.value)}
                            placeholder="Ej: Documentación incompleta, datos incorrectos, etc."
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={handleRechazarConfirm}
                        disabled={!motivoRechazo.trim()}
                    >
                        Rechazar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AdminDashboard;
```

---

## 📝 Ejemplo 3: Página de Mediciones con Gráficas

```javascript
// frontend/src/pages/MedicionesPage.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import medicionService from '../services/medicionService';
import estacionService from '../services/estacionService';

// Registrar componentes de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const MedicionesPage = () => {
    const [estaciones, setEstaciones] = useState([]);
    const [mediciones, setMediciones] = useState([]);
    const [selectedEstacion, setSelectedEstacion] = useState('');
    const [tipoMedicion, setTipoMedicion] = useState('PM2.5');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        cargarEstaciones();
    }, []);

    useEffect(() => {
        if (selectedEstacion) {
            cargarMediciones();
        }
    }, [selectedEstacion, tipoMedicion]);

    const cargarEstaciones = async () => {
        try {
            const data = await estacionService.getActivas();
            setEstaciones(data);
            if (data.length > 0) {
                setSelectedEstacion(data[0].id);
            }
        } catch (error) {
            console.error('Error al cargar estaciones:', error);
        }
    };

    const cargarMediciones = async () => {
        try {
            setLoading(true);
            const data = await medicionService.getUltimasByEstacion(selectedEstacion, 50);
            
            // Filtrar por tipo de medición
            const filtered = data.filter(m => m.tipo_medicion === tipoMedicion);
            setMediciones(filtered);
        } catch (error) {
            console.error('Error al cargar mediciones:', error);
        } finally {
            setLoading(false);
        }
    };

    // Preparar datos para la gráfica
    const chartData = {
        labels: mediciones.map(m => 
            new Date(m.fecha_hora).toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
            })
        ),
        datasets: [
            {
                label: tipoMedicion,
                data: mediciones.map(m => m.valor),
                borderColor: 'rgb(13, 110, 253)',
                backgroundColor: 'rgba(13, 110, 253, 0.1)',
                tension: 0.4
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: `Histórico de ${tipoMedicion}`
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    return (
        <Container fluid className="py-4">
            <Row className="mb-4">
                <Col>
                    <h2 className="fw-bold">Mediciones en Tiempo Real</h2>
                    <p className="text-muted">Visualiza las mediciones de las estaciones</p>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Estación</Form.Label>
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
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Tipo de Medición</Form.Label>
                        <Form.Select
                            value={tipoMedicion}
                            onChange={(e) => setTipoMedicion(e.target.value)}
                        >
                            <option value="PM2.5">PM 2.5</option>
                            <option value="PM10">PM 10</option>
                            <option value="O3">Ozono (O3)</option>
                            <option value="NO2">Dióxido de Nitrógeno (NO2)</option>
                            <option value="SO2">Dióxido de Azufre (SO2)</option>
                            <option value="CO">Monóxido de Carbono (CO)</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card className="shadow-sm border-0">
                        <Card.Body>
                            <div style={{ height: '400px' }}>
                                {loading ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary" />
                                        <p className="mt-3 text-muted">Cargando datos...</p>
                                    </div>
                                ) : mediciones.length === 0 ? (
                                    <div className="text-center py-5 text-muted">
                                        No hay datos disponibles
                                    </div>
                                ) : (
                                    <Line data={chartData} options={chartOptions} />
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-4">
                <Col>
                    <Card className="shadow-sm border-0">
                        <Card.Body>
                            <h5 className="mb-3">Últimas Mediciones</h5>
                            <div className="table-responsive">
                                <table className="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>Fecha/Hora</th>
                                            <th>Valor</th>
                                            <th>Unidad</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mediciones.slice(0, 10).map((m, idx) => (
                                            <tr key={idx}>
                                                <td>
                                                    {new Date(m.fecha_hora).toLocaleString('es-ES')}
                                                </td>
                                                <td className="fw-bold">{m.valor}</td>
                                                <td className="text-muted">{m.unidad_medida}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default MedicionesPage;
```

---

## 💡 Tips Adicionales

### 1. Manejo de Errores Global
Crea un componente `ErrorBoundary`:

```javascript
// src/components/ErrorBoundary.js
import React from 'react';
import { Alert, Container } from 'react-bootstrap';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error capturado:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Container className="mt-5">
                    <Alert variant="danger">
                        <Alert.Heading>¡Algo salió mal!</Alert.Heading>
                        <p>{this.state.error?.message}</p>
                    </Alert>
                </Container>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
```

### 2. Interceptor para Refresh Token
Actualiza `client.js`:

```javascript
// Interceptor para manejar errores de autenticación
client.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post(
                    `${baseURL}/api/token/refresh/`,
                    { refresh: refreshToken }
                );

                const { access } = response.data;
                localStorage.setItem('token', access);

                originalRequest.headers.Authorization = `Bearer ${access}`;
                return client(originalRequest);
            } catch (refreshError) {
                // Token refresh falló, redirigir a login
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
```

### 3. Hook Personalizado para Datos
```javascript
// src/hooks/useApi.js
import { useState, useEffect } from 'react';

export const useApi = (apiFunc, params = []) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const result = await apiFunc(...params);
            setData(result);
            setError(null);
        } catch (err) {
            setError(err.message || 'Error al cargar datos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [JSON.stringify(params)]);

    return { data, loading, error, refetch: fetchData };
};

// Uso:
// const { data: estaciones, loading, error } = useApi(estacionService.getAll);
```

---

¡Estos ejemplos te ayudarán a implementar las páginas restantes del proyecto! 🚀
