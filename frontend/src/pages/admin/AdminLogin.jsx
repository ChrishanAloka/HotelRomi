import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/romi_logo.png';

export default function AdminLogin() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            await login(form.email, form.password);
            navigate('/admin');
        } catch {
            setError('Invalid email or password.');
        } finally { setLoading(false); }
    };

    return (
        <div className="page-transition" style={{
            minHeight: '100vh', background: 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundImage: 'radial-gradient(ellipse at 30% 50%, rgba(241, 229, 172, 0.08) 0%, transparent 60%)'
        }}>
            <div style={{ width: '100%', maxWidth: 420, padding: '1.5rem' }}>
                <div className="text-center mb-4">
                    <img src={logo} alt="Romi Logo" style={{ width: 64, height: 64, objectFit: 'contain', marginBottom: '1rem' }} />
                    <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2rem', color: 'var(--cream)' }}>Hotel Romi</h2>
                    <div className="section-label">Admin Portal</div>
                </div>

                <div className="card-dark p-4">
                    {error && (
                        <div style={{ background: 'rgba(224,92,92,0.15)', border: '1px solid rgba(224,92,92,0.3)', color: '#f08080', padding: '0.75rem', borderRadius: 3, marginBottom: '1rem', fontSize: '0.875rem' }}>
                            <i className="bi bi-exclamation-circle me-2"></i>{error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem' }}>Email</label>
                            <input type="email" className="form-control form-control-dark" placeholder="admin@hotelromi.lk"
                                value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
                        </div>
                        <div className="mb-4">
                            <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem' }}>Password</label>
                            <input type="password" className="form-control form-control-dark" placeholder="••••••••"
                                value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
                        </div>
                        <button type="submit" className="btn btn-gold w-100 py-3" disabled={loading}>
                            {loading ? <span className="spinner-border spinner-border-sm me-2" /> : <i className="bi bi-lock me-2"></i>}
                            Sign In
                        </button>
                    </form>
                </div>

                <div className="text-center mt-3">
                    <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'none' }}>
                        <i className="bi bi-arrow-left me-1"></i>Back to Website
                    </Link>
                </div>
            </div>
        </div>
    );
}