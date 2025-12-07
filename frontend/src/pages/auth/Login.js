import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Cloud, Lock, User } from 'lucide-react';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData.username, formData.password);
            navigate('/');
        } catch (err) {
            setError('Credenciales inválidas');
        }
    };

    return (
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 h-[calc(100vh-4rem)]">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <Cloud className="h-8 w-8 text-blue-600" />
                    </div>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                        Bienvenido a VriSA
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Inicia sesión para acceder a la plataforma de monitoreo
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div className="relative">
                            <User className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="relative block w-full rounded-t-md border-0 py-2.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                placeholder="Nombre de usuario"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="relative block w-full rounded-b-md border-0 py-2.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                placeholder="Contraseña"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2.5 text-md font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
                        >
                            Ingresar
                        </button>
                    </div>

                    <div className="text-sm text-center text-gray-500">
                        ¿Eres una institución? <Link to="/register-institution" className="text-blue-600 hover:underline">Regístrate aquí</Link>
                    </div>
                    <div className="text-sm text-center text-gray-500 mt-2">
                        ¿Administras una estación? <Link to="/register-station" className="text-blue-600 hover:underline">Regístrate aquí</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
