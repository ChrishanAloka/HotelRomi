import { useState } from 'react';
import Navbar from '../../components/common/Navbar';
import { orderService, bookingService } from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';

export default function TrackOrderPage() {
    const [phone, setPhone] = useState('');
    const [orders, setOrders] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [tab, setTab] = useState('orders');

    const search = async () => {
        if (!phone.trim()) return;
        setLoading(true); setSearched(false);
        try {
            const [oRes, bRes] = await Promise.all([
                orderService.getByPhone(phone.trim()),
                bookingService.getByPhone(phone.trim())
            ]);

            const now = new Date();
            const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;

            const filteredOrders = oRes.data.filter(order => {
                if (order.status === 'Delivered') {
                    return (now - new Date(order.createdAt)) <= twoDaysInMs;
                }
                return true;
            });

            const filteredBookings = bRes.data.filter(booking => {
                if (booking.status === 'Checked-Out') {
                    return (now - new Date(booking.checkOut)) <= twoDaysInMs;
                }
                return true;
            });

            setOrders(filteredOrders);
            setBookings(filteredBookings);
            setSearched(true);
        } catch (error) {
            console.error(error);
            setOrders([]); setBookings([]); setSearched(true);
        } finally { setLoading(false); }
    };

    const statusSteps = {
        orders: ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Delivered'],
        bookings: ['Pending', 'Confirmed', 'Checked-In', 'Checked-Out']
    };

    const getStepIndex = (status, type) => statusSteps[type].indexOf(status);

    return (
        <div className="page-transition" style={{ background: 'var(--dark)', minHeight: '100vh', paddingTop: '80px' }}>
            <Navbar />
            <div className="page-header mb-4">
                <div className="container">
                    <div className="section-label mb-1">Hotel Romi</div>
                    <h1 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2.5rem', color: 'var(--cream)', margin: 0 }}>Track Your Order</h1>
                </div>
            </div>

            <div className="container pb-5" style={{ maxWidth: 700 }}>
                <div className="card-dark p-4 mb-4">
                    <h5 style={{ fontFamily: 'Cormorant Garamond', color: 'var(--cream)', marginBottom: '1rem' }}>Enter Your Phone Number</h5>
                    <div className="d-flex gap-2">
                        <input className="form-control form-control-dark flex-grow-1" placeholder="07X XXX XXXX" type="tel"
                            value={phone} onChange={e => setPhone(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && search()} />
                        <button className="btn btn-gold px-4" onClick={search} disabled={loading}>
                            {loading ? <span className="spinner-border spinner-border-sm" /> : <i className="bi bi-search"></i>}
                        </button>
                    </div>
                </div>

                {searched && (
                    <div className="animate-in">
                        {/* Tabs */}
                        <div className="d-flex gap-2 mb-4">
                            {[['orders', `Orders (${orders.length})`], ['bookings', `Bookings (${bookings.length})`]].map(([t, label]) => (
                                <button key={t} onClick={() => setTab(t)}
                                    className={`btn btn-sm ${tab === t ? 'btn-gold' : 'btn-outline-gold'}`}>
                                    {label}
                                </button>
                            ))}
                        </div>

                        {tab === 'orders' && (
                            orders.length === 0 ? (
                                <div className="text-center py-5" style={{ color: 'var(--text-muted)' }}>
                                    <i className="bi bi-bag-x" style={{ fontSize: '3rem' }}></i>
                                    <p className="mt-2">No orders found for this phone number</p>
                                </div>
                            ) : orders.map(order => (
                                <div key={order._id} className="card-dark p-4 mb-3">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.1rem', color: 'var(--cream)' }}>
                                                {order.orderType} Order
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                {new Date(order.createdAt).toLocaleString()}
                                            </div>
                                        </div>
                                        <StatusBadge status={order.status} />
                                    </div>

                                    {/* Progress */}
                                    {order.status !== 'Cancelled' && (
                                        <div className="mb-3">
                                            <div className="d-flex justify-content-between position-relative" style={{ paddingBottom: '1.5rem' }}>
                                                <div style={{ position: 'absolute', top: 11, left: '5%', right: '5%', height: 2, background: 'rgba(241, 229, 172,0.15)', zIndex: 0 }}>
                                                    <div style={{
                                                        height: '100%', background: 'var(--gold)',
                                                        width: `${(getStepIndex(order.status, 'orders') / (statusSteps.orders.length - 1)) * 100}%`,
                                                        transition: 'width 0.5s ease'
                                                    }}></div>
                                                </div>
                                                {statusSteps.orders.map((s, i) => (
                                                    <div key={s} style={{ zIndex: 1, textAlign: 'center' }}>
                                                        <div style={{
                                                            width: 22, height: 22, borderRadius: '50%', margin: '0 auto 6px',
                                                            background: i <= getStepIndex(order.status, 'orders') ? 'var(--gold)' : 'var(--dark-3)',
                                                            border: `2px solid ${i <= getStepIndex(order.status, 'orders') ? 'var(--gold)' : 'rgba(241, 229, 172,0.2)'}`,
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                        }}>
                                                            {i < getStepIndex(order.status, 'orders') && <i className="bi bi-check" style={{ fontSize: '0.65rem', color: 'var(--dark)' }}></i>}
                                                            {i === getStepIndex(order.status, 'orders') && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--dark)' }}></div>}
                                                        </div>
                                                        <div style={{ fontSize: '0.58rem', color: i <= getStepIndex(order.status, 'orders') ? 'var(--gold)' : 'var(--text-muted)' }}>{s}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div style={{ borderTop: '1px solid rgba(241, 229, 172,0.1)', paddingTop: '0.75rem' }}>
                                        {order.items?.map((item, i) => (
                                            <div key={i} className="d-flex justify-content-between" style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>
                                                <span>{item.name} × {item.quantity}</span>
                                                <span>LKR {(item.price * item.quantity).toLocaleString()}</span>
                                            </div>
                                        ))}
                                        <div className="d-flex justify-content-between mt-2" style={{ borderTop: '1px solid rgba(241, 229, 172,0.08)', paddingTop: '0.5rem' }}>
                                            <span style={{ fontWeight: 500, color: 'var(--cream)', fontSize: '0.875rem' }}>Total</span>
                                            <span style={{ fontFamily: 'Cormorant Garamond', color: 'var(--gold)', fontSize: '1.1rem' }}>LKR {order.totalAmount?.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}

                        {tab === 'bookings' && (
                            bookings.length === 0 ? (
                                <div className="text-center py-5" style={{ color: 'var(--text-muted)' }}>
                                    <i className="bi bi-calendar-x" style={{ fontSize: '3rem' }}></i>
                                    <p className="mt-2">No bookings found for this phone number</p>
                                </div>
                            ) : bookings.map(booking => (
                                <div key={booking._id} className="card-dark p-4 mb-3">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.2rem', color: 'var(--cream)' }}>
                                                Rooms: {booking.rooms?.map(r => r.roomNumber).join(', ') || 'N/A'}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                Booked on {new Date(booking.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <StatusBadge status={booking.status} />
                                    </div>

                                    {booking.status !== 'Cancelled' && (
                                        <div className="mb-3">
                                            <div className="d-flex justify-content-between position-relative" style={{ paddingBottom: '1.5rem' }}>
                                                <div style={{ position: 'absolute', top: 11, left: '5%', right: '5%', height: 2, background: 'rgba(241, 229, 172,0.15)' }}>
                                                    <div style={{
                                                        height: '100%', background: 'var(--gold)',
                                                        width: `${(getStepIndex(booking.status, 'bookings') / (statusSteps.bookings.length - 1)) * 100}%`
                                                    }}></div>
                                                </div>
                                                {statusSteps.bookings.map((s, i) => (
                                                    <div key={s} style={{ zIndex: 1, textAlign: 'center' }}>
                                                        <div style={{
                                                            width: 22, height: 22, borderRadius: '50%', margin: '0 auto 6px',
                                                            background: i <= getStepIndex(booking.status, 'bookings') ? 'var(--gold)' : 'var(--dark-3)',
                                                            border: `2px solid ${i <= getStepIndex(booking.status, 'bookings') ? 'var(--gold)' : 'rgba(241, 229, 172,0.2)'}`,
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                        }}>
                                                            {i < getStepIndex(booking.status, 'bookings') && <i className="bi bi-check" style={{ fontSize: '0.65rem', color: 'var(--dark)' }}></i>}
                                                        </div>
                                                        <div style={{ fontSize: '0.6rem', color: i <= getStepIndex(booking.status, 'bookings') ? 'var(--gold)' : 'var(--text-muted)' }}>{s}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="row g-2" style={{ fontSize: '0.8rem' }}>
                                        <div className="col-6"><span style={{ color: 'var(--text-muted)' }}>Check-In: </span><span style={{ color: 'var(--cream)' }}>{new Date(booking.checkIn).toLocaleDateString()}</span></div>
                                        <div className="col-6"><span style={{ color: 'var(--text-muted)' }}>Check-Out: </span><span style={{ color: 'var(--cream)' }}>{new Date(booking.checkOut).toLocaleDateString()}</span></div>
                                        <div className="col-6"><span style={{ color: 'var(--text-muted)' }}>Guests: </span><span style={{ color: 'var(--cream)' }}>{booking.adults} adults, {booking.children} children</span></div>
                                        <div className="col-6"><span style={{ color: 'var(--text-muted)' }}>Amount: </span><span style={{ color: 'var(--gold)', fontFamily: 'Cormorant Garamond', fontSize: '1rem' }}>LKR {booking.totalAmount?.toLocaleString()}</span></div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}