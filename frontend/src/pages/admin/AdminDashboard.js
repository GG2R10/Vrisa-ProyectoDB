import React, { useState } from 'react';
import { Check, X, Shield } from 'lucide-react';

const MOCK_PENDING_INSTITUTIONS = [
    { id: 1, name: 'EcoMonitores S.A.S', address: 'Calle 5 # 34-12', status: 'pending' },
    { id: 2, name: 'Fundación Aire Limpio', address: 'Av. 6N # 23-14', status: 'pending' },
];

const AdminDashboard = () => {
    const [pending, setPending] = useState(MOCK_PENDING_INSTITUTIONS);

    const handleAction = (id, action) => {
        // API call to approve/reject
        console.log(`${action} institution ${id}`);
        setPending(pending.filter(i => i.id !== id));
    };

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
                <p className="text-gray-500">Gestión de Instituciones y Permisos Globales</p>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                        <Shield size={20} className="text-blue-600" />
                        Solicitudes de Instituciones
                    </h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {pending.length} Pendientes
                    </span>
                </div>

                {pending.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">Nombre Institucional</th>
                                    <th className="px-6 py-3">Dirección / NIT</th>
                                    <th className="px-6 py-3">Estado</th>
                                    <th className="px-6 py-3 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pending.map((inst) => (
                                    <tr key={inst.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            {inst.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {inst.address}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded">
                                                Pendiente
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => handleAction(inst.id, 'approve')}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors"
                                            >
                                                <Check size={16} /> Aceptar
                                            </button>
                                            <button
                                                onClick={() => handleAction(inst.id, 'reject')}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors"
                                            >
                                                <X size={16} /> Rechazar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        No hay solicitudes pendientes.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
