import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { bookingService, invoiceService } from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';

const STATUSES = ['Pending', 'Confirmed', 'Checked-In', 'Checked-Out', 'Cancelled'];

export default function AdminBookings() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [selected, setSelected] = useState(null);
    const [invoiceModal, setInvoiceModal] = useState(false);
    const [invoiceForm, setInvoiceForm] = useState({ discount: 0, tax: 0, roomServiceCharge: 500, notes: '' });
    const [generating, setGenerating] = useState(false);

    const openInvoiceModal = (b) => {
        setSelected(b);
        const nights = Math.ceil((new Date(b.checkOut) - new Date(b.checkIn)) / (1000 * 60 * 60 * 24));
        const subtotal = b.totalAmount || 0;
        setInvoiceForm({
            discount: 0,
            tax: Math.round(subtotal * 0.1),
            roomServiceCharge: 500,
            notes: ''
        });
        setInvoiceModal(true);
    };

    const load = () => bookingService.getAll().then(r => setBookings(r.data)).finally(() => setLoading(false));
    useEffect(() => { load(); }, []);

    const updateStatus = async (id, status) => {
        await bookingService.updateStatus(id, status); load();
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
            <div className="d-flex flex-wrap gap-2 mb-3">
                <button className={`btn btn-sm ${!filter ? 'btn-gold' : 'btn-outline-gold'}`} onClick={() => setFilter('')}>All</button>
                {STATUSES.map(s => (
                    <button key={s} className={`btn btn-sm ${filter === s ? 'btn-gold' : 'btn-outline-gold'}`} onClick={() => setFilter(s)}>{s}</button>
                ))}
            </div>

            {loading ? <div className="text-center py-5"><span className="spinner-border spinner-gold" /></div> : (
                <div className="card-dark">
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
                                    <tr key={b._id}>
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
                                        <td><StatusBadge status={b.status} /></td>
                                        <td>
                                            <div className="d-flex gap-1 flex-wrap">
                                                <select className="form-select form-select-sm"
                                                    style={{ background: 'var(--dark-3)', border: '1px solid rgba(241, 229, 172,0.2)', color: 'var(--cream)', width: 'auto', fontSize: '0.75rem', borderRadius: 2 }}
                                                    value={b.status} onChange={e => updateStatus(b._id, e.target.value)}>
                                                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                                                </select>
                                                <button className="btn btn-sm btn-outline-gold px-2" title="Generate Invoice"
                                                    onClick={() => openInvoiceModal(b)}>
                                                    <i className="bi bi-receipt"></i>
                                                </button>
                                                <button className="btn btn-sm btn-outline-success px-2" title="Notify via WhatsApp"
                                                    style={{ color: '#25D366', borderColor: 'rgba(37,211,102,0.3)' }}
                                                    onClick={() => notifyWhatsApp(b)}>
                                                    <i className="bi bi-whatsapp"></i>
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
            )}

            {/* Invoice Modal */}
            {invoiceModal && selected && (
                <div className="modal fade show d-block" style={{ zIndex: 1060 }}>
                    <div className="modal-dialog modal-dark modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.3rem', color: 'var(--cream)', margin: 0 }}>Generate Room Invoice</h5>
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
            {invoiceModal && <div className="modal-backdrop fade show" style={{ zIndex: 1055 }} onClick={() => setInvoiceModal(false)} />}
        </AdminLayout>
    );
}