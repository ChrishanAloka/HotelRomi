import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { invoiceService } from '../../services/api';

export default function AdminInvoices() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [filter, setFilter] = useState('');
    const location = useLocation();
    const highlightId = new URLSearchParams(location.search).get('highlight');

    const load = () => invoiceService.getAll().then(r => setInvoices(r.data)).finally(() => setLoading(false));
    useEffect(() => { load(); }, []);

    const markPaid = async (id) => {
        await invoiceService.update(id, { isPaid: true }); load();
    };

    const filtered = filter ? invoices.filter(i => i.type === filter) : invoices;

    const printInvoice = (inv) => {
        const isRestaurant = inv.type === 'Restaurant';
        const docTitle = isRestaurant ? 'Restaurant Bill' : 'Room Invoice';
        const w = window.open('', '_blank');
        w.document.write(`
      <html><head><title>${docTitle} ${inv.invoiceNumber}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body { 
            font-family: 'Inter', sans-serif; 
            max-width: ${isRestaurant ? '380px' : '750px'}; 
            margin: 40px auto; 
            color: #2D3436; 
            padding: ${isRestaurant ? '20px' : '40px'};
            border: ${isRestaurant ? '1px solid #EEE' : 'none'};
            box-shadow: ${isRestaurant ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'};
        }
        .header { text-align: center; border-bottom: 2px solid #C9A84C; padding-bottom: 20px; margin-bottom: 30px; }
        .hotel-name { font-size: ${isRestaurant ? '1.5rem' : '2.2rem'}; color: #C9A84C; letter-spacing: 0.1em; font-weight: 700; margin-bottom: 4px; }
        .doc-type { font-size: 0.8rem; color: #636E72; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 15px; }
        
        table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: ${isRestaurant ? '0.85rem' : '0.9rem'}; }
        th { border-bottom: 1px solid #E2E8F0; padding: 10px 5px; text-align: left; color: #636E72; font-weight: 600; text-transform: uppercase; font-size: 0.7rem; }
        td { padding: 10px 5px; border-bottom: 1px solid #F1F5F9; }
        
        .info-grid { display: flex; justify-content: space-between; margin-bottom: 30px; font-size: 0.85rem; }
        .info-block div { margin-bottom: 4px; }
        .label { color: #636E72; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px; }
        
        .totals { margin-top: 30px; }
        .total-row { display: flex; justify-content: flex-end; margin-bottom: 8px; font-size: 0.9rem; }
        .total-row span:first-child { color: #636E72; margin-right: 20px; }
        .grand-total { border-top: 2px solid #C9A84C; padding-top: 12px; margin-top: 12px; font-weight: 700; font-size: 1.2rem; color: #C9A84C; }
        
        .paid-stamp { 
            position: absolute; top: ${isRestaurant ? '10px' : '40px'}; right: ${isRestaurant ? '10px' : '40px'};
            border: 3px solid #00B894; color: #00B894; padding: 4px 15px; font-size: 1rem; font-weight: 800;
            text-transform: uppercase; transform: rotate(-15deg); opacity: 0.7; border-radius: 4px;
        }
        .footer { text-align: center; margin-top: 50px; padding-top: 20px; border-top: 1px solid #E2E8F0; font-size: 0.75rem; color: #636E72; }
        @media print { body { margin: 0 auto; box-shadow: none; border: none; } }
      </style>
      </head><body>
      <div style="position: relative;">
        ${inv.isPaid ? '<div class="paid-stamp">PAID</div>' : ''}
        <div class="header">
          <div class="hotel-name">HOTEL ROMI</div>
          <div class="doc-type">${isRestaurant ? 'Restaurant Bill' : 'Room Booking Invoice'}</div>
          <div style="font-size: 0.75rem; color: #636E72;">#${inv.invoiceNumber} | ${new Date(inv.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
        </div>

        <div class="info-grid">
          <div class="info-block">
            <div class="label">Billed To</div>
            <div style="font-weight: 600;">${inv.customerName}</div>
            <div>${inv.customerPhone}</div>
          </div>
          ${!isRestaurant ? `
          <div class="info-block" style="text-align: right;">
            <div class="label">Payment Status</div>
            <div style="font-weight: 600; color: ${inv.isPaid ? '#00B894' : '#E17055'}">${inv.isPaid ? 'Settled' : 'Pending'}</div>
          </div>
          ` : ''}
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 50%;">Description</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Price</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${inv.items?.map(i => `
              <tr>
                <td>${i.description}</td>
                <td style="text-align: center;">${i.quantity}</td>
                <td style="text-align: right;">${i.unitPrice?.toLocaleString()}</td>
                <td style="text-align: right;">${i.total?.toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <div class="total-row"><span>Subtotal:</span><span>LKR ${inv.subtotal?.toLocaleString()}</span></div>
          <div class="total-row"><span>Tax:</span><span>LKR ${inv.tax?.toLocaleString()}</span></div>
          ${inv.discount ? `<div class="total-row"><span>Discount:</span><span style="color: #D63031;">-LKR ${inv.discount?.toLocaleString()}</span></div>` : ''}
          <div class="total-row grand-total">
            <span>Total:</span>
            <span>LKR ${inv.totalAmount?.toLocaleString()}</span>
          </div>
        </div>

        ${inv.notes ? `
          <div style="margin-top: 30px; font-size: 0.8rem; color: #636E72;">
            <div class="label">Additional Notes</div>
            <div style="font-style: italic;">${inv.notes}</div>
          </div>
        ` : ''}

        <div class="footer">
          <div style="font-weight: 600; margin-bottom: 5px;">Thank you for your visit!</div>
          <div>Hotel Romi • Experience Excellence</div>
          <div style="font-size: 0.65rem; color: #B2BEC3; margin-top: 10px;">This is a computer-generated ${isRestaurant ? 'bill' : 'invoice'}.</div>
        </div>
      </div>
      <script>window.onload = () => { window.print(); }</script>
      </body></html>
    `);
        w.document.close();
    };

    return (
        <AdminLayout title="Invoices">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
                <div className="d-flex flex-wrap gap-2">
                    <button className={`btn btn-sm ${!filter ? 'btn-gold' : 'btn-outline-gold'}`} onClick={() => setFilter('')}>All</button>
                    <button className={`btn btn-sm ${filter === 'Room' ? 'btn-gold' : 'btn-outline-gold'}`} onClick={() => setFilter('Room')}>Room</button>
                    <button className={`btn btn-sm ${filter === 'Restaurant' ? 'btn-gold' : 'btn-outline-gold'}`} onClick={() => setFilter('Restaurant')}>Restaurant</button>
                </div>
                <div className="dropdown">
                    <button className="btn btn-gold dropdown-toggle" data-bs-toggle="dropdown">
                        <i className="bi bi-plus-lg me-2"></i>Create Invoice
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark border-gold-subtle shadow">
                        <li><Link className="dropdown-item py-2" to="/admin/bookings"><i className="bi bi-calendar-check me-2"></i>From Room Booking</Link></li>
                        <li><Link className="dropdown-item py-2" to="/admin/orders"><i className="bi bi-bag-check me-2"></i>From Restaurant Order</Link></li>
                    </ul>
                </div>
            </div>

            {loading ? <div className="text-center py-5"><span className="spinner-border spinner-gold" /></div> : (
                <div className="card-dark">
                    <div className="table-responsive">
                        <table className="table table-dark-custom mb-0">
                            <thead>
                                <tr>
                                    <th>Invoice #</th>
                                    <th>Type</th>
                                    <th>Customer</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Paid</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(inv => (
                                    <tr key={inv._id} className={highlightId === inv._id ? 'row-highlight' : ''}>
                                        <td style={{ color: 'var(--gold)', fontWeight: 600, fontSize: '0.85rem' }}>{inv.invoiceNumber}</td>
                                        <td><span className="badge-gold" style={{ fontSize: '0.65rem' }}>{inv.type}</span></td>
                                        <td>
                                            <div style={{ color: 'var(--cream)', fontWeight: 500, fontSize: '0.875rem' }}>{inv.customerName}</div>
                                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{inv.customerPhone}</div>
                                        </td>
                                        <td style={{ fontFamily: 'Cormorant Garamond', color: 'var(--gold)', fontSize: '1rem' }}>LKR {inv.totalAmount?.toLocaleString()}</td>
                                        <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{new Date(inv.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <span style={{
                                                fontSize: '0.68rem', padding: '0.3em 0.6em', borderRadius: 2,
                                                background: inv.isPaid ? 'rgba(76,175,124,0.15)' : 'rgba(224,168,92,0.15)',
                                                color: inv.isPaid ? 'var(--success)' : 'var(--warning)',
                                                border: `1px solid ${inv.isPaid ? 'rgba(76,175,124,0.3)' : 'rgba(224,168,92,0.3)'}`
                                            }}>{inv.isPaid ? 'Paid' : 'Pending'}</span>
                                        </td>
                                        <td>
                                            <div className="d-flex gap-1">
                                                <button className="btn btn-sm btn-outline-gold px-2" title="Print" onClick={() => printInvoice(inv)}>
                                                    <i className="bi bi-printer"></i>
                                                </button>
                                                {!inv.isPaid && (
                                                    <button className="btn btn-sm px-2" title="Mark Paid"
                                                        style={{ background: 'rgba(76,175,124,0.12)', border: '1px solid rgba(76,175,124,0.3)', color: 'var(--success)', borderRadius: 2 }}
                                                        onClick={() => markPaid(inv._id)}>
                                                        <i className="bi bi-check-lg"></i>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr><td colSpan={7} className="text-center py-4" style={{ color: 'var(--text-muted)' }}>No invoices found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}