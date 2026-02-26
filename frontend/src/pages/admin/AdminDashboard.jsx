import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { roomService, bookingService, orderService, menuService } from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ rooms: 0, bookings: 0, orders: 0, menu: 0 });
    const [recentBookings, setRecentBookings] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            roomService.getAll(),
            bookingService.getAll(),
            orderService.getAll(),
            menuService.getAll()
        ]).then(([rooms, bookings, orders, menu]) => {
            setStats({
                rooms: rooms.data.length,
                bookings: bookings.data.length,
                orders: orders.data.length,
                menu: menu.data.length
            });
            setRecentBookings(bookings.data.slice(0, 5));
            setRecentOrders(orders.data.slice(0, 5));
        }).finally(() => setLoading(false));
    }, []);

    const cards = [
        { label: 'Total Rooms', value: stats.rooms, icon: 'bi-door-closed', color: 'var(--gold)' },
        { label: 'Bookings', value: stats.bookings, icon: 'bi-calendar-check', color: '#5CA8E0' },
        { label: 'Orders', value: stats.orders, icon: 'bi-bag-check', color: '#4CAF7C' },
        { label: 'Menu Items', value: stats.menu, icon: 'bi-menu-button-wide', color: '#E0A85C' },
    ];

    return (
        <AdminLayout title="Dashboard">
            <div className="row g-3 mb-4">
                {cards.map((c, i) => (
                    <div key={i} className="col-6 col-lg-3">
                        <div className="card-dark p-4" style={{ borderLeft: `3px solid ${c.color}` }}>
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{c.label}</div>
                                    <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '2.2rem', color: 'var(--cream)', fontWeight: 600, lineHeight: 1 }}>{loading ? '—' : c.value}</div>
                                </div>
                                <div style={{ background: `${c.color}1A`, width: 44, height: 44, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className={`bi ${c.icon}`} style={{ color: c.color, fontSize: '1.2rem' }}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-4">
                <div className="col-lg-6">
                    <div className="card-dark">
                        <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(241, 229, 172,0.12)' }}>
                            <h6 style={{ color: 'var(--cream)', fontFamily: 'Cormorant Garamond', fontSize: '1.1rem', margin: 0 }}>Recent Bookings</h6>
                        </div>
                        <div className="p-3">
                            {loading ? <div className="text-center py-3"><span className="spinner-border spinner-border-sm spinner-gold" /></div>
                                : recentBookings.length === 0 ? <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>No bookings yet</p>
                                    : recentBookings.map(b => (
                                        <div key={b._id} className="d-flex align-items-center gap-3 py-2" style={{ borderBottom: '1px solid rgba(241, 229, 172,0.07)' }}>
                                            <div style={{ background: 'rgba(241, 229, 172,0.1)', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <i className="bi bi-person text-gold" style={{ fontSize: '0.9rem' }}></i>
                                            </div>
                                            <div className="flex-grow-1">
                                                <div style={{ fontSize: '0.85rem', color: 'var(--cream)', fontWeight: 500 }}>{b.customerName}</div>
                                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Room {b.room?.roomNumber} · {new Date(b.checkIn).toLocaleDateString()}</div>
                                            </div>
                                            <div className="d-flex align-items-center gap-2">
                                                <StatusBadge status={b.status} />
                                                <Link to="/admin/bookings" className="btn btn-sm btn-outline-gold p-1" style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Manage Booking">
                                                    <i className="bi bi-receipt" style={{ fontSize: '0.8rem' }}></i>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card-dark">
                        <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(241, 229, 172,0.12)' }}>
                            <h6 style={{ color: 'var(--cream)', fontFamily: 'Cormorant Garamond', fontSize: '1.1rem', margin: 0 }}>Recent Orders</h6>
                        </div>
                        <div className="p-3">
                            {loading ? <div className="text-center py-3"><span className="spinner-border spinner-border-sm spinner-gold" /></div>
                                : recentOrders.length === 0 ? <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>No orders yet</p>
                                    : recentOrders.map(o => (
                                        <div key={o._id} className="d-flex align-items-center gap-3 py-2" style={{ borderBottom: '1px solid rgba(241, 229, 172,0.07)' }}>
                                            <div style={{ background: 'rgba(76,175,124,0.1)', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <i className="bi bi-bag text-success" style={{ fontSize: '0.9rem' }}></i>
                                            </div>
                                            <div className="flex-grow-1">
                                                <div style={{ fontSize: '0.85rem', color: 'var(--cream)', fontWeight: 500 }}>{o.customerName}</div>
                                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{o.items?.length} item(s) · LKR {o.totalAmount?.toLocaleString()}</div>
                                            </div>
                                            <div className="d-flex align-items-center gap-2">
                                                <StatusBadge status={o.status} />
                                                <Link to="/admin/orders" className="btn btn-sm btn-outline-gold p-1" style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Manage Order">
                                                    <i className="bi bi-receipt" style={{ fontSize: '0.8rem' }}></i>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}