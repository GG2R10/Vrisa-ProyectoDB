import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, Menu, User, Settings } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();
    const { theme } = useTheme();

    return (
        <nav className="shadow-md h-16 flex items-center justify-between px-6 bg-white z-20 relative" style={{ borderTop: `4px solid ${theme.primaryColor}` }}>
            <div className="flex items-center gap-4">
                <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 rounded md:hidden">
                    <Menu size={24} />
                </button>
                <Link to="/" className="flex items-center gap-2">
                    {theme.logoUrl ? (
                        <img src={theme.logoUrl} alt="Logo" className="h-10" />
                    ) : (
                        <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-xl" style={{ color: theme.primaryColor }}>
                            {theme.name[0]}
                        </div>
                    )}
                    <span className="font-bold text-xl text-gray-800">{theme.name}</span>
                </Link>
            </div>

            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        <span className="hidden md:block text-sm text-gray-600">Welcome, {user.username}</span>
                        <button onClick={logout} className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-sm font-medium">
                            <LogOut size={18} />
                            <span className="hidden md:block">Logout</span>
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="px-4 py-2 rounded text-white font-medium" style={{ backgroundColor: theme.primaryColor }}>
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
