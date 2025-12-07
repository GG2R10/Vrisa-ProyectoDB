import React, { useState } from 'react';
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
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Monitor de Calidad del Aire</h1>
                    <p className="text-gray-500">Visualización en tiempo real de la red VriSA</p>
                </div>
                <div className="text-right">
                    <div className="text-sm font-medium text-gray-500">Cali, Colombia</div>
                    <div className="text-2xl font-bold text-gray-800">28°C</div>
                </div>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard icon={<Activity />} label="Estaciones Activas" value="12" color="blue" />
                <StatCard icon={<Wind />} label="Velocidad Viento" value="12 km/h" color="gray" />
                <StatCard icon={<Droplets />} label="Humedad Promedio" value="65%" color="blue" />
                <StatCard icon={<Thermometer />} label="Temp. Promedio" value="28°C" color="orange" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Map Area */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-semibold text-gray-700 mb-4">Mapa de Estaciones</h3>
                        <MapComponent stations={MOCK_STATIONS} onStationSelect={setSelectedStation} />
                    </div>
                </div>

                {/* Sidebar Details / Selected Station */}
                <div>
                    {selectedStation ? (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
                            <h2 className="text-xl font-bold text-gray-800 mb-2">{selectedStation.name}</h2>
                            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-4">
                                {selectedStation.institution}
                            </span>

                            <div className="space-y-4">
                                <div>
                                    <div className="text-sm text-gray-500 mb-1">Índice de Calidad del Aire (ICA)</div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-4xl font-bold text-gray-900">{selectedStation.ica}</div>
                                        <div className={`h-3 w-3 rounded-full ${selectedStation.ica < 50 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                        <span className="text-sm text-gray-600">
                                            {selectedStation.ica < 50 ? 'Bueno' : 'Moderado'}
                                        </span>
                                    </div>
                                </div>
                                <hr />
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-2">Mediciones Recientes</h4>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex justify-between">
                                            <span>PM 2.5</span>
                                            <span className="font-mono font-bold">12 µg/m³</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>PM 10</span>
                                            <span className="font-mono font-bold">28 µg/m³</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>O3</span>
                                            <span className="font-mono font-bold">45 ppb</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col items-center justify-center text-center text-gray-400">
                            <MapComponentPlaceholderIcon />
                            <p className="mt-4">Selecciona una estación en el mapa para ver sus detalles en tiempo real.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className={`p-3 rounded-lg bg-${color}-50 text-${color}-600`}>
            {React.cloneElement(icon, { size: 24 })}
        </div>
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
    </div>
);

const MapComponentPlaceholderIcon = () => (
    <svg className="w-16 h-16 opacity-20" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
);

export default Dashboard;
