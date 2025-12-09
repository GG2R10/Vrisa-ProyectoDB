import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const MainLayout = ({ children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <Navbar toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
            <div className="d-flex flex-grow-1" style={{ overflow: 'hidden' }}>
                <Sidebar isOpen={isSidebarOpen} closeMobile={() => setSidebarOpen(false)} />
                <main className="flex-grow-1 p-3 p-md-4" style={{ overflowY: 'auto' }}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
