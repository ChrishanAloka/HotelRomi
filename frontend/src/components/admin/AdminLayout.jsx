import { useState } from 'react';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ children, title }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div style={{ background: 'var(--dark)', minHeight: '100vh' }}>
            <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="admin-main">
                <div className="page-transition">
                    {/* Top bar */}
                    <div style={{
                        background: 'var(--maroon)',
                        borderBottom: '1px solid rgba(241, 229, 172, 0.12)',
                        padding: '1rem 1.5rem',
                        position: 'sticky', top: 0, zIndex: 50,
                        display: 'flex', alignItems: 'center', gap: '1rem'
                    }}>
                        <button className="btn d-md-none p-0" onClick={() => setSidebarOpen(true)}
                            style={{ color: 'var(--gold)' }}>
                            <i className="bi bi-list" style={{ fontSize: '1.4rem' }}></i>
                        </button>
                        <h5 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.3rem', color: 'var(--cream)', margin: 0 }}>
                            {title}
                        </h5>
                    </div>

                    <div className="p-3 p-lg-4">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}