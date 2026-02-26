import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import logo from '../../assets/romi_logo.png';

export default function Navbar() {
    const location = useLocation();
    const [open, setOpen] = useState(false);

    const links = [
        { to: '/', label: 'Home' },
        { to: '/restaurant', label: 'Restaurant' },
        { to: '/book-room', label: 'Rooms' },
        { to: '/track-order', label: 'Track Order' },
    ];

    return (
        <nav className="nav-romi navbar navbar-expand-lg fixed-top px-3 px-lg-5">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand text-decoration-none d-flex align-items-center gap-2">
                    <img src={logo} alt="Romi Logo" style={{ width: 40, height: 40, objectFit: 'contain' }} />
                    <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 600, color: '#F5F0E8', letterSpacing: '0.05em' }}>
                        HOTEL ROMI
                    </span>
                </Link>

                <button className="navbar-toggler border-0" onClick={() => setOpen(!open)}
                    style={{ color: 'var(--gold)' }}>
                    <i className={`bi bi-${open ? 'x-lg' : 'list'}`} style={{ fontSize: '1.4rem' }}></i>
                </button>

                <div className={`collapse navbar-collapse ${open ? 'show' : ''}`}>
                    <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
                        {links.map(l => (
                            <li key={l.to} className="nav-item">
                                <Link
                                    to={l.to}
                                    onClick={() => setOpen(false)}
                                    className="nav-link px-3 py-2"
                                    style={{
                                        fontFamily: 'Jost, sans-serif',
                                        fontSize: '0.8rem',
                                        fontWeight: 500,
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase',
                                        color: location.pathname === l.to ? 'var(--gold)' : 'var(--text-light)',
                                        borderBottom: location.pathname === l.to ? '1px solid var(--gold)' : '1px solid transparent',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                        <li className="nav-item ms-lg-3">
                            <Link to="/admin" className="btn btn-outline-gold btn-sm" onClick={() => setOpen(false)}>
                                <i className="bi bi-lock me-1"></i>Admin
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}