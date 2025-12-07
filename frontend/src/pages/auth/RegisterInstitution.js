import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Upload } from 'lucide-react';

const RegisterInstitution = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        primaryColor: '#2563eb',
        secondaryColor: '#64748b',
        logo: null
    });

    const handleFileChange = (e) => {
        setFormData({ ...formData, logo: e.target.files[0] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Registering Institution", formData);
        // Dispatch API call here
        alert("Solicitud enviada. Esperando aprobación del administrador.");
        navigate('/login');
    };

    return (
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg">
                <div className="mb-8 text-center">
                    <Building className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-gray-900">Registro de Institución</h2>
                    <p className="text-gray-600">Únete a la red de monitoreo ambiental de Cali</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Nombre Oficial de la Institución</label>
                            <input
                                type="text" required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Dirección Física</label>
                            <input
                                type="text" required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Color Primario (Institucional)</label>
                            <div className="flex items-center gap-2 mt-1">
                                <input
                                    type="color"
                                    className="h-10 w-20 p-1 border rounded cursor-pointer"
                                    value={formData.primaryColor} onChange={e => setFormData({ ...formData, primaryColor: e.target.value })}
                                />
                                <span className="text-sm text-gray-500">{formData.primaryColor}</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Color Secundario</label>
                            <div className="flex items-center gap-2 mt-1">
                                <input
                                    type="color"
                                    className="h-10 w-20 p-1 border rounded cursor-pointer"
                                    value={formData.secondaryColor} onChange={e => setFormData({ ...formData, secondaryColor: e.target.value })}
                                />
                                <span className="text-sm text-gray-500">{formData.secondaryColor}</span>
                            </div>
                        </div>

                        <div className="col-span-2 border-dashed border-2 border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                            <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} accept="image/*" />
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-600">Click para subir Logo Institucional</p>
                            {formData.logo && <p className="text-green-600 font-medium mt-2">{formData.logo.name}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium">
                            Enviar Solicitud
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterInstitution;
