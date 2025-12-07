import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
    BarChart2,
    Map,
    AlertTriangle,
    Settings,
    Users,
    Building
} from 'lucide-react';

const Sidebar = ({ isOpen, closeMobile }) => {
    const { user } = useAuth();
    const { theme } = useTheme();
    const location = useLocation();

    const links = [
        { label: 'Map View', path: '/', icon: <Map size={20} />, roles: ['public', 'admin', 'institution'] },
        { label: 'Dashboard', path: '/dashboard', icon: <BarChart2 size={20} />, roles: ['public', 'admin', 'institution'] },
        { label: 'Alerts', path: '/alerts', icon: <AlertTriangle size={20} />, roles: ['public', 'admin', 'institution'] },
        { label: 'My Stations', path: '/stations', icon: <Building size={20} />, roles: ['institution'] },
        { label: 'Approvals', path: '/admin/approvals', icon: <Users size={20} />, roles: ['superadmin'] },
    ];

    // Filter links based on role
    const role = user?.role || 'public';
    // Allow public links (defined as 'public' in roles) or explicit match
    // Simplified logic: if link.roles includes 'public' OR includes current user role
    const activeLinks = links.filter(l => l.roles.includes('public') || (user && l.roles.includes(user.role)));

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={closeMobile}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 bg-white shadow-xl md:shadow-none transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        border-r border-gray-200
      `}>
                <div className="p-6">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Menu</h3>
                    <ul className="space-y-1">
                        {activeLinks.map(link => {
                            const isActive = location.pathname === link.path;
                            return (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        onClick={closeMobile}
                                        className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                        ${isActive ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                      `}
                                        style={isActive ? { color: theme.primaryColor, backgroundColor: `${theme.primaryColor}10` } : {}}
                                    >
                                        <span style={isActive ? { color: theme.primaryColor } : {}}>{link.icon}</span>
                                        {link.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
