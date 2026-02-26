import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { orderService, invoiceService } from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';

const STATUSES = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [selected, setSelected] = useState(null);
    const [billModal, setBillModal] = useState(false);
    const [billForm, setBillForm] = useState({ discount: 0, tax: 0, notes: '' });
    const [generating, setGenerating] = useState(false);

    const openBillModal = (o) => {
        setSelected(o);
        setBillForm({
            discount: 0,
            tax: Math.round(o.totalAmount * 0.1),
            notes: ''
        });
        setBillModal(true);
    };

    const load = () => orderService.getAll().then(r => setOrders(r.data)).finally(() => setLoading(false));
    useEffect(() => { load(); }, []);

    const updateStatus = async (id, status) => {
        await orderService.updateStatus(id, status); load();
    };

    const notifyWhatsApp = (o) => {
        let statusMsg = "";
        switch (o.status) {
            case 'Confirmed': statusMsg = "Your order has been *Confirmed* and will be prepared soon!"; break;
            case 'Preparing': statusMsg = "Your order is now being *Prepared* by our chef!"; break;
            case 'Ready': statusMsg = "Your order is *Ready*! Please collect it at the counter."; break;
            case 'Delivered': statusMsg = "Your order has been *Delivered*. Enjoy your meal!"; break;
            case 'Cancelled': statusMsg = "Your order has been *Cancelled*. Contact us if you have any questions."; break;
            default: statusMsg = `Your order status is now *${o.status}*.`;
        }
        const msg = encodeURIComponent(
            `🍽️ *Hotel Romi — Order Update*\n\n` +
            `Hello ${o.customerName},\n\n` +
            `${statusMsg}\n\n` +
            `*Order Type:* ${o.orderType}\n` +
            `*Total:* LKR ${o.totalAmount?.toLocaleString()}\n\n` +
            `Thank you for choosing Hotel Romi!`
        );
        const phone = o.customerPhone.startsWith('0') ? '94' + o.customerPhone.substring(1) : o.customerPhone;
        window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
    };

    const genBill = async () => {
        setGenerating(true);
        try {
            const res = await invoiceService.createRestaurant({ orderId: selected._id, ...billForm });
            setBillModal(false);
            navigate(`/admin/invoices?highlight=${res.data._id}`);
        } catch (e) { alert(e.response?.data?.message || 'Error'); }
        finally { setGenerating(false); }
    };

    const filtered = filter ? orders.filter(o => o.status === filter) : orders;

    return (
        <AdminLayout title="Orders">
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
                                    <th>Customer</th>
                                    <th>Items</th>
                                    <th>Type</th>
                                    <th>Total</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(o => (
                                    <tr key={o._id}>
                                        <td>
                                            <div style={{ fontWeight: 500, color: 'var(--cream)' }}>{o.customerName}</div>
                                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{o.customerPhone}</div>
                                        </td>
                                        <td>
                                            {o.items?.map((item, i) => (
                                                <div key={i} style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>{item.name} ×{item.quantity}</div>
                                            ))}
                                        </td>
                                        <td><span className="badge-gold" style={{ fontSize: '0.65rem' }}>{o.orderType}</span></td>
                                        <td style={{ fontFamily: 'Cormorant Garamond', color: 'var(--gold)', fontSize: '1rem' }}>LKR {o.totalAmount?.toLocaleString()}</td>
                                        <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                                        <td><StatusBadge status={o.status} /></td>
                                        <td>
                                            <div className="d-flex gap-1">
                                                <select className="form-select form-select-sm"
                                                    style={{ background: 'var(--dark-3)', border: '1px solid rgba(241, 229, 172,0.2)', color: 'var(--cream)', width: 'auto', fontSize: '0.75rem', borderRadius: 2 }}
                                                    value={o.status} onChange={e => updateStatus(o._id, e.target.value)}>
                                                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                                                </select>
                                                <button className="btn btn-sm btn-outline-gold px-2" title="Generate Bill"
                                                    onClick={() => openBillModal(o)}>
                                                    <i className="bi bi-receipt"></i>
                                                </button>
                                                <button className="btn btn-sm btn-outline-success px-2" title="Notify via WhatsApp"
                                                    style={{ color: '#25D366', borderColor: 'rgba(37,211,102,0.3)' }}
                                                    onClick={() => notifyWhatsApp(o)}>
                                                    <i className="bi bi-whatsapp"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr><td colSpan={7} className="text-center py-4" style={{ color: 'var(--text-muted)' }}>No orders found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {billModal && selected && (
                <div className="modal fade show d-block" style={{ zIndex: 1060 }}>
                    <div className="modal-dialog modal-dark modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.3rem', color: 'var(--cream)', margin: 0 }}>Generate Restaurant Bill</h5>
                                <button className="btn-close" onClick={() => setBillModal(false)} />
                            </div>
                            <div className="modal-body p-4">
                                <div className="card-dark-3 p-3 mb-3">
                                    {selected.items?.map((item, i) => (
                                        <div key={i} className="d-flex justify-content-between" style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>
                                            <span>{item.name} ×{item.quantity}</span>
                                            <span>LKR {(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}
                                    <div className="d-flex justify-content-between mt-2 pt-2" style={{ borderTop: '1px solid rgba(241, 229, 172,0.1)' }}>
                                        <span style={{ color: 'var(--cream)', fontWeight: 500, fontSize: '0.875rem' }}>Total Subtotal</span>
                                        <span style={{ color: 'var(--gold)', fontFamily: 'Cormorant Garamond', fontSize: '1.1rem' }}>LKR {selected.totalAmount?.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="row g-3">
                                    <div className="col-6">
                                        <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem' }}>Tax (LKR)</label>
                                        <input type="number" className="form-control form-control-dark" value={billForm.tax}
                                            onChange={e => setBillForm(p => ({ ...p, tax: +e.target.value }))} />
                                    </div>
                                    <div className="col-6">
                                        <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem' }}>Discount (LKR)</label>
                                        <input type="number" className="form-control form-control-dark" value={billForm.discount}
                                            onChange={e => setBillForm(p => ({ ...p, discount: +e.target.value }))} />
                                    </div>
                                    <div className="col-12">
                                        <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem' }}>Notes</label>
                                        <textarea className="form-control form-control-dark" rows={2} value={billForm.notes}
                                            onChange={e => setBillForm(p => ({ ...p, notes: e.target.value }))} />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-outline-gold" onClick={() => setBillModal(false)}>Cancel</button>
                                <button className="btn btn-gold" onClick={genBill} disabled={generating}>
                                    {generating ? <span className="spinner-border spinner-border-sm me-2" /> : <i className="bi bi-receipt me-2"></i>}
                                    Generate Bill
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {billModal && <div className="modal-backdrop fade show" style={{ zIndex: 1055 }} onClick={() => setBillModal(false)} />}
        </AdminLayout>
    );
}