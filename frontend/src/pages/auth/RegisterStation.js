import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio } from 'lucide-react';

const RegisterStation = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        location: '',
        sensorType: '',
        institutionId: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Dispatch API
        alert("Estación registrada. Pendiente de aprobación por la Institución.");
        navigate('/login');
    };

    return (
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg">
                <div className="mb-8 text-center">
                    <Radio className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-gray-900">Registro de Estación</h2>
                    <p className="text-gray-600">Registra un nuevo punto de monitoreo</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ubicación (Coordenadas o Dirección)</label>
                        <input
                            type="text" required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                            value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })}
                        />
                        <p className="text-xs text-gray-500 mt-1">Se implementará selector de mapa aquí.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tipo de Sensor</label>
                        <select
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                            value={formData.sensorType} onChange={e => setFormData({ ...formData, sensorType: e.target.value })}
                        >
                            <option value="">Seleccione...</option>
                            <option value="pm25">PM 2.5</option>
                            <option value="multi">Multisensor (PM, Gases, Meteo)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Institución Responsable</label>
                        <select
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
                            value={formData.institutionId} onChange={e => setFormData({ ...formData, institutionId: e.target.value })}
                        >
                            <option value="">Seleccione Institución...</option>
                            <option value="dagma">DAGMA</option>
                            <option value="cvc">CVC</option>
                            <option value="univalle">Universidad del Valle</option>
                        </select>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 font-medium">
                            Registrar Estación
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterStation;
