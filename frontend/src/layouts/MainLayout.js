import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const MainLayout = ({ children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <Navbar toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar isOpen={isSidebarOpen} closeMobile={() => setSidebarOpen(false)} />
                <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
