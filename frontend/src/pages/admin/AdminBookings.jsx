import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { bookingService, invoiceService } from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import BookingCalendar from '../../components/admin/BookingCalendar';

const STATUSES = ['Pending', 'Confirmed', 'Checked-In', 'Checked-Out', 'Cancelled'];

export default function AdminBookings() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [selected, setSelected] = useState(null);
    const [view, setView] = useState('list'); // 'list' or 'calendar'
    const [drawerOpen, setDrawerOpen] = useState(false);

    const [invoiceModal, setInvoiceModal] = useState(false);
    const [invoiceForm, setInvoiceForm] = useState({ discount: 0, tax: 0, roomServiceCharge: 500, notes: '' });
    const [generating, setGenerating] = useState(false);
    const [updating, setUpdating] = useState(null); // id of booking being updated

    const openInvoiceModal = (b) => {
        setSelected(b);
        const subtotal = b.totalAmount || 0;
        setInvoiceForm({
            discount: 0,
            tax: Math.round(subtotal * 0.1),
            roomServiceCharge: 500,
            notes: ''
        });
        setInvoiceModal(true);
        setDrawerOpen(false);
    };

    const load = () => bookingService.getAll().then(r => setBookings(r.data)).finally(() => setLoading(false));
    useEffect(() => { load(); }, []);

    const updateStatus = async (id, status) => {
        setUpdating(id);
        try {
            await bookingService.updateStatus(id, status);
            await load();
            if (selected && selected._id === id) {
                setSelected(prev => ({ ...prev, status }));
            }
        } finally {
            setUpdating(null);
        }
    };


    const handleBookingClick = (b) => {
        setSelected(b);
        setDrawerOpen(true);
    };

    const genInvoice = async () => {
        setGenerating(true);
        try {
            const res = await invoiceService.createRoom({ bookingId: selected._id, ...invoiceForm });
            setInvoiceModal(false);
            navigate(`/admin/invoices?highlight=${res.data._id}`);
        } catch (e) { alert(e.response?.data?.message || 'Error'); }
        finally { setGenerating(false); }
    };

    const notifyWhatsApp = (b) => {
        let statusMsg = "";
        switch (b.status) {
            case 'Confirmed': statusMsg = "Your booking has been *Confirmed*. We are excited to welcome you!"; break;
            case 'Checked-In': statusMsg = "You have successfully *Checked-In*. Enjoy your stay!"; break;
            case 'Checked-Out': statusMsg = "You have successfully *Checked-Out*. Thank you for staying with us!"; break;
            case 'Cancelled': statusMsg = "Your booking has been *Cancelled*. Contact us if this was a mistake."; break;
            default: statusMsg = `Your booking status is now *${b.status}*.`;
        }
        const msg = encodeURIComponent(
            `🏨 *Hotel Romi — Booking Update*\n\n` +
            `Hello ${b.customerName},\n\n` +
            `${statusMsg}\n\n` +
            `*Rooms:* ${b.rooms?.map(r => `Room ${r.roomNumber}`).join(', ') || 'N/A'}\n` +
            `*Date:* ${new Date(b.checkIn).toLocaleDateString()} — ${new Date(b.checkOut).toLocaleDateString()}\n\n` +
            `See you soon!`
        );
        const phone = b.customerPhone.startsWith('0') ? '94' + b.customerPhone.substring(1) : b.customerPhone;
        window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
    };

    const filtered = filter ? bookings.filter(b => b.status === filter) : bookings;

    return (
        <AdminLayout title="Bookings">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <div className="d-flex flex-wrap gap-2">
                    <button className={`btn btn-sm ${!filter ? 'btn-gold' : 'btn-outline-gold'}`} onClick={() => setFilter('')}>All</button>
                    {STATUSES.map(s => (
                        <button key={s} className={`btn btn-sm ${filter === s ? 'btn-gold' : 'btn-outline-gold'}`} onClick={() => setFilter(s)}>{s}</button>
                    ))}
                </div>

                <div className="btn-group">
                    <button
                        className={`btn btn-sm ${view === 'list' ? 'btn-gold' : 'btn-outline-gold'}`}
                        onClick={() => setView('list')}
                        style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                    >
                        <i className="bi bi-list-ul me-2"></i>List
                    </button>
                    <button
                        className={`btn btn-sm ${view === 'calendar' ? 'btn-gold' : 'btn-outline-gold'}`}
                        onClick={() => setView('calendar')}
                        style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                    >
                        <i className="bi bi-calendar3 me-2"></i>Calendar
                    </button>
                </div>
            </div>

            {loading ? <div className="text-center py-5"><span className="spinner-border spinner-gold" /></div> : (
                view === 'list' ? (
                    <div className="card-dark animate-in">
                        <div className="table-responsive">
                            <table className="table table-dark-custom mb-0">
                                <thead>
                                    <tr>
                                        <th>Guest</th>
                                        <th>Room</th>
                                        <th>Check-In</th>
                                        <th>Check-Out</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(b => (
                                        <tr key={b._id} onClick={() => handleBookingClick(b)} style={{ cursor: 'pointer' }}>
                                            <td>
                                                <div style={{ fontWeight: 500, color: 'var(--cream)' }}>{b.customerName}</div>
                                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{b.customerPhone}</div>
                                            </td>
                                            <td>
                                                <div className="d-flex flex-wrap gap-1">
                                                    {b.rooms?.map(r => (
                                                        <span key={r._id} className="badge-gold">#{r.roomNumber}</span>
                                                    ))}
                                                    {(!b.rooms || b.rooms.length === 0) && <span className="text-muted small">No rooms</span>}
                                                </div>
                                            </td>
                                            <td style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{new Date(b.checkIn).toLocaleDateString()}</td>
                                            <td style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{new Date(b.checkOut).toLocaleDateString()}</td>
                                            <td style={{ fontFamily: 'Cormorant Garamond', color: 'var(--gold)', fontSize: '1rem' }}>LKR {b.totalAmount?.toLocaleString()}</td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <StatusBadge status={b.status} />
                                                    {updating === b._id && <span className="spinner-border spinner-border-sm text-gold" style={{ width: '0.8rem', height: '0.8rem' }} />}
                                                </div>
                                            </td>
                                            <td onClick={(e) => e.stopPropagation()}>
                                                <div className="d-flex gap-1 flex-wrap">
                                                    <select className="form-select form-select-sm"
                                                        style={{ background: 'var(--dark-3)', border: '1px solid rgba(241, 229, 172,0.2)', color: 'var(--cream)', width: 'auto', fontSize: '0.75rem', borderRadius: 2 }}
                                                        value={b.status} onChange={e => updateStatus(b._id, e.target.value)} disabled={updating === b._id}>
                                                        {STATUSES.map(s => <option key={s}>{s}</option>)}
                                                    </select>
                                                    <button className="btn btn-sm btn-outline-gold px-2" title="Generate Invoice"
                                                        onClick={() => openInvoiceModal(b)} disabled={updating === b._id}>
                                                        <i className="bi bi-receipt"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filtered.length === 0 && (
                                        <tr><td colSpan={7} className="text-center py-4" style={{ color: 'var(--text-muted)' }}>No bookings found</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <BookingCalendar bookings={filtered} onBookingClick={handleBookingClick} />
                )
            )}

            {/* Side Drawer */}
            <div className={`drawer-overlay ${drawerOpen ? 'active' : ''}`} onClick={() => setDrawerOpen(false)} />
            <div className={`drawer-content ${drawerOpen ? 'active' : ''}`}>
                {selected && (
                    <>
                        <div className="drawer-header">
                            <h4 className="mb-0 text-gold-shimmer">Booking Details</h4>
                            <button className="btn-close" onClick={() => setDrawerOpen(false)} style={{ filter: 'invert(1)' }} />
                        </div>
                        <div className="drawer-body">
                            <div className="mb-4 text-center">
                                <div className="display-font text-gold" style={{ fontSize: '1.8rem', marginBottom: '0.2rem' }}>{selected.customerName}</div>
                                <div className="text-muted small" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}>{selected.customerPhone}</div>
                            </div>

                            <div className="gold-divider" style={{ margin: '1rem 0 2rem' }} />

                            <div className="row g-4 mb-4">
                                <div className="col-6">
                                    <label className="section-label mb-2 d-block">Check-In</label>
                                    <div className="h5 mb-0 text-cream">{new Date(selected.checkIn).toLocaleDateString()}</div>
                                </div>
                                <div className="col-6">
                                    <label className="section-label mb-2 d-block">Check-Out</label>
                                    <div className="h5 mb-0 text-cream">{new Date(selected.checkOut).toLocaleDateString()}</div>
                                </div>
                                <div className="col-12">
                                    <label className="section-label mb-2 d-block">Rooms</label>
                                    <div className="d-flex flex-wrap gap-2">
                                        {selected.rooms?.map(r => (
                                            <div key={r._id} className="card-dark-3 px-3 py-2 flex-grow-1 text-center">
                                                <div className="text-gold fw-bold">Room {r.roomNumber}</div>
                                                <div className="small text-muted">{r.type}</div>
                                            </div>
                                        )) || <span className="text-muted">No rooms assigned</span>}
                                    </div>
                                </div>
                                <div className="col-6">
                                    <label className="section-label mb-2 d-block">Adults</label>
                                    <div className="h5 mb-0 text-cream">{selected.adults} Adults</div>
                                </div>
                                <div className="col-6">
                                    <label className="section-label mb-2 d-block">Children</label>
                                    <div className="h5 mb-0 text-cream">{selected.children} Children</div>
                                </div>
                                <div className="col-12">
                                    <label className="section-label mb-2 d-block">Status</label>
                                    <div className="d-flex gap-2 align-items-center">
                                        <StatusBadge status={selected.status} />
                                        <select className="form-select form-select-sm form-control-dark"
                                            value={selected.status} onChange={e => updateStatus(selected._id, e.target.value)} disabled={updating === selected._id}>
                                            {STATUSES.map(s => <option key={s}>{s}</option>)}
                                        </select>
                                        {updating === selected._id && <span className="spinner-border spinner-border-sm text-gold" />}
                                    </div>
                                </div>
                                {selected.specialRequests && (
                                    <div className="col-12">
                                        <label className="section-label mb-2 d-block">Special Requests</label>
                                        <div className="card-dark-3 p-3 small text-muted italic">
                                            "{selected.specialRequests}"
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="card-dark-3 p-4 text-center mb-4 mt-auto">
                                <label className="section-label mb-2 d-block">Total Amount</label>
                                <div className="display-font text-gold" style={{ fontSize: '2rem' }}>LKR {selected.totalAmount?.toLocaleString()}</div>
                            </div>

                            <div className="d-grid gap-2">
                                <button className="btn btn-gold" onClick={() => openInvoiceModal(selected)}>
                                    <i className="bi bi-receipt me-2"></i>Generate Invoice
                                </button>
                                <button className="btn btn-outline-success" style={{ color: '#25D366', borderColor: 'rgba(37,211,102,0.5)' }}
                                    onClick={() => notifyWhatsApp(selected)}>
                                    <i className="bi bi-whatsapp me-2"></i>Notify via WhatsApp
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Invoice Modal */}
            {invoiceModal && selected && (
                <div className="modal fade show d-block" style={{ zIndex: 1100 }}>
                    <div className="modal-dialog modal-dark modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="display-font" style={{ fontSize: '1.3rem', color: 'var(--cream)', margin: 0 }}>Generate Room Invoice</h5>
                                <button className="btn-close" onClick={() => setInvoiceModal(false)} />
                            </div>
                            <div className="modal-body p-4">
                                <div className="card-dark-3 p-3 mb-3" style={{ fontSize: '0.85rem' }}>
                                    <div className="d-flex justify-content-between mb-1">
                                        <span style={{ color: 'var(--text-muted)' }}>Guest:</span>
                                        <span style={{ color: 'var(--cream)' }}>{selected.customerName}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-1">
                                        <span style={{ color: 'var(--text-muted)' }}>Rooms:</span>
                                        <span style={{ color: 'var(--cream)', textAlign: 'right' }}>
                                            {selected.rooms?.map(r => `Room ${r.roomNumber}`).join(', ') || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span style={{ color: 'var(--text-muted)' }}>Total Subtotal:</span>
                                        <span style={{ color: 'var(--gold)', fontFamily: 'Cormorant Garamond', fontSize: '1.1rem' }}>LKR {selected.totalAmount?.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="row g-3">
                                    <div className="col-6">
                                        <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem' }}>Tax (LKR)</label>
                                        <input type="number" className="form-control form-control-dark" value={invoiceForm.tax}
                                            onChange={e => setInvoiceForm(p => ({ ...p, tax: +e.target.value }))} />
                                    </div>
                                    <div className="col-6">
                                        <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem' }}>Discount (LKR)</label>
                                        <input type="number" className="form-control form-control-dark" value={invoiceForm.discount}
                                            onChange={e => setInvoiceForm(p => ({ ...p, discount: +e.target.value }))} />
                                    </div>
                                    {selected.includeRoomService && (
                                        <div className="col-12">
                                            <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem' }}>Room Service Charge (LKR)</label>
                                            <input type="number" className="form-control form-control-dark" value={invoiceForm.roomServiceCharge}
                                                onChange={e => setInvoiceForm(p => ({ ...p, roomServiceCharge: +e.target.value }))} />
                                        </div>
                                    )}
                                    <div className="col-12">
                                        <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem' }}>Notes</label>
                                        <textarea className="form-control form-control-dark" rows={2} value={invoiceForm.notes}
                                            onChange={e => setInvoiceForm(p => ({ ...p, notes: e.target.value }))} />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-outline-gold" onClick={() => setInvoiceModal(false)}>Cancel</button>
                                <button className="btn btn-gold" onClick={genInvoice} disabled={generating}>
                                    {generating ? <span className="spinner-border spinner-border-sm me-2" /> : <i className="bi bi-receipt me-2"></i>}
                                    Generate Invoice
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {invoiceModal && <div className="modal-backdrop fade show" style={{ zIndex: 1095 }} onClick={() => setInvoiceModal(false)} />}
        </AdminLayout>
    );
}
