import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/romi_logo.png';

export default function AdminSidebar({ open, onClose }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const links = [
        { to: '/admin', icon: 'bi-grid-1x2', label: 'Dashboard' },
        { to: '/admin/rooms', icon: 'bi-door-closed', label: 'Rooms' },
        { to: '/admin/bookings', icon: 'bi-calendar-check', label: 'Bookings' },
        { to: '/admin/menu', icon: 'bi-menu-button-wide', label: 'Menu Items' },
        { to: '/admin/orders', icon: 'bi-bag-check', label: 'Orders' },
        { to: '/admin/invoices', icon: 'bi-receipt', label: 'Invoices' },
    ];

    const handleLogout = () => { logout(); navigate('/admin/login'); };

    return (
        <>
            {open && <div className="d-md-none position-fixed top-0 start-0 w-100 h-100"
                style={{ background: 'rgba(0,0,0,0.6)', zIndex: 99 }} onClick={onClose} />}

            <aside className={`admin-sidebar d-flex flex-column ${open ? 'open' : ''}`}>
                {/* Logo */}
                <div className="px-4 py-4" style={{ borderBottom: '1px solid rgba(241, 229, 172,0.12)' }}>
                    <div className="d-flex align-items-center gap-2">
                        <img src={logo} alt="Romi Logo" style={{ width: 32, height: 32, objectFit: 'contain' }} />
                        <div>
                            <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.3rem', fontWeight: 600, color: 'var(--cream)', letterSpacing: '0.05em' }}>HOTEL ROMI</div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Admin Panel</div>
                        </div>
                    </div>
                </div>

                {/* User info */}
                <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(241, 229, 172,0.08)' }}>
                    <div className="d-flex align-items-center gap-2">
                        <div style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: 'rgba(241, 229, 172,0.15)', border: '1px solid rgba(241, 229, 172,0.3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <i className="bi bi-person text-gold" style={{ fontSize: '0.9rem' }}></i>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--cream)', fontWeight: 500 }}>{user?.name}</div>
                            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Administrator</div>
                        </div>
                    </div>
                </div>

                {/* Nav links */}
                <nav className="flex-grow-1 py-3">
                    <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '0.5rem 1.5rem 0.25rem' }}>Navigation</div>
                    {links.map(l => (
                        <Link key={l.to} to={l.to}
                            className={`sidebar-link ${location.pathname === l.to ? 'active' : ''}`}
                            onClick={onClose}>
                            <i className={`bi ${l.icon}`}></i>
                            {l.label}
                        </Link>
                    ))}
                </nav>

                {/* Logout */}
                <div className="px-3 py-4" style={{ borderTop: '1px solid rgba(241, 229, 172,0.12)' }}>
                    <Link to="/" className="sidebar-link mb-1" style={{ fontSize: '0.8rem' }}>
                        <i className="bi bi-house"></i> View Website
                    </Link>
                    <button onClick={handleLogout} className="sidebar-link w-100 text-start border-0 bg-transparent"
                        style={{ color: 'var(--danger)' }}>
                        <i className="bi bi-box-arrow-left"></i> Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
}