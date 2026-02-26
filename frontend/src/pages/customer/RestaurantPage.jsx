import { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import { menuService, orderService } from '../../services/api';
import { useCart } from '../../context/CartContext';

const CATEGORIES = ['All', 'Starters', 'Rice & Noodles', 'Curries', 'Grills', 'Desserts', 'Beverages', 'Specials'];

const WHATSAPP_NUMBER = '94719404928'; // Replace with actual number

export default function RestaurantPage() {
    const [items, setItems] = useState([]);
    const [category, setCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [showCart, setShowCart] = useState(false);
    const [orderForm, setOrderForm] = useState({ name: '', phone: '', notes: '' });
    const [placing, setPlacing] = useState(false);
    const [success, setSuccess] = useState(false);
    const { cart, addToCart, removeFromCart, updateQty, clearCart, total, count } = useCart();

    useEffect(() => {
        menuService.getAll({ available: 'true' })
            .then(r => setItems(r.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const filtered = category === 'All' ? items : items.filter(i => i.category === category);

    const buildWhatsAppMessage = () => {
        const lines = cart.map(i => `• ${i.name} x${i.quantity} — LKR ${(i.price * i.quantity).toLocaleString()}`).join('\n');
        return encodeURIComponent(
            `🍽️ *New Takeaway Order — Hotel Romi*\n\n*Customer:* ${orderForm.name}\n*Phone:* ${orderForm.phone}\n\n*Order:*\n${lines}\n\n*Total:* LKR ${total.toLocaleString()}\n\n${orderForm.notes ? `*Notes:* ${orderForm.notes}` : ''}`
        );
    };

    const placeOrder = async () => {
        if (!orderForm.name || !orderForm.phone) return alert('Please fill in your name and phone number.');
        setPlacing(true);
        try {
            await orderService.create({
                customerName: orderForm.name,
                customerPhone: orderForm.phone,
                items: cart.map(i => ({ menuItem: i._id, name: i.name, price: i.price, quantity: i.quantity })),
                orderType: 'Takeaway',
                notes: orderForm.notes
            });
            // Open WhatsApp
            window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage()}`, '_blank');
            clearCart();
            setOrderForm({ name: '', phone: '', notes: '' });
            setShowCart(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 5000);
        } catch (err) {
            alert('Could not place order. Please try again.');
        } finally {
            setPlacing(false);
        }
    };

    return (
        <div className="page-transition" style={{ background: 'var(--dark)', minHeight: '100vh', paddingTop: '80px' }}>
            <Navbar />

            {/* Header */}
            <div className="page-header mb-4">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col">
                            <div className="section-label mb-1">Hotel Romi</div>
                            <h1 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2.5rem', color: 'var(--cream)', margin: 0 }}>
                                Family Restaurant
                            </h1>
                            <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginTop: '0.25rem', marginBottom: 0 }}>
                                Order takeaway — we'll send it to WhatsApp
                            </p>
                        </div>
                        <div className="col-auto">
                            <button className="btn btn-gold position-relative" onClick={() => setShowCart(true)}>
                                <i className="bi bi-bag me-2"></i>Cart
                                {count > 0 && (
                                    <span style={{
                                        position: 'absolute', top: '-8px', right: '-8px',
                                        background: 'var(--gold)', color: 'var(--dark)',
                                        width: 20, height: 20, borderRadius: '50%',
                                        fontSize: '0.7rem', fontWeight: 700,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>{count}</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {success && (
                <div className="container mb-3">
                    <div className="alert-gold alert d-flex align-items-center gap-2">
                        <i className="bi bi-check-circle-fill text-gold"></i>
                        Order placed! WhatsApp opened with your order details.
                    </div>
                </div>
            )}

            <div className="container pb-5">
                {/* Category filter */}
                <div className="d-flex flex-wrap gap-2 mb-4">
                    {CATEGORIES.map(c => (
                        <button key={c} onClick={() => setCategory(c)}
                            className={`btn btn-sm ${category === c ? 'btn-gold' : 'btn-outline-gold'}`}
                            style={{ fontSize: '0.75rem' }}>
                            {c}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border spinner-gold" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-5" style={{ color: 'var(--text-muted)' }}>
                        <i className="bi bi-cup-hot" style={{ fontSize: '3rem' }}></i>
                        <p className="mt-2">No items in this category</p>
                    </div>
                ) : (
                    <div className="row g-3">
                        {filtered.map(item => (
                            <div key={item._id} className="col-sm-6 col-lg-4">
                                <div className="card-dark h-100 d-flex flex-column" style={{ overflow: 'hidden' }}>
                                    {item.image && (
                                        <img src={item.image} alt={item.name} style={{ height: 160, objectFit: 'cover', width: '100%' }} />
                                    )}
                                    {!item.image && (
                                        <div style={{ height: 100, background: 'var(--dark-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <i className="bi bi-cup-hot text-gold" style={{ fontSize: '2rem', opacity: 0.5 }}></i>
                                        </div>
                                    )}
                                    <div className="p-3 flex-grow-1 d-flex flex-column">
                                        <div className="d-flex justify-content-between align-items-start mb-1">
                                            <h6 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.1rem', color: 'var(--cream)', marginBottom: 0 }}>
                                                {item.name}
                                            </h6>
                                            <span className="badge-gold ms-2" style={{ whiteSpace: 'nowrap' }}>
                                                {item.category}
                                            </span>
                                        </div>
                                        <div className="d-flex gap-2 mb-2">
                                            {item.isVegetarian && <span style={{ fontSize: '0.65rem', color: 'var(--success)' }}><i className="bi bi-leaf-fill me-1"></i>Veg</span>}
                                            {item.spiceLevel !== 'None' && <span style={{ fontSize: '0.65rem', color: 'var(--warning)' }}><i className="bi bi-fire me-1"></i>{item.spiceLevel}</span>}
                                        </div>
                                        {item.description && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', flexGrow: 1 }}>{item.description}</p>}
                                        <div className="d-flex align-items-center justify-content-between mt-auto pt-2">
                                            <span style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.2rem', color: 'var(--gold)', fontWeight: 600 }}>
                                                LKR {item.price.toLocaleString()}
                                            </span>
                                            {cart.find(c => c._id === item._id) ? (
                                                <div className="d-flex align-items-center gap-2">
                                                    <button className="btn btn-sm btn-outline-gold px-2 py-1"
                                                        onClick={() => updateQty(item._id, cart.find(c => c._id === item._id).quantity - 1)}>
                                                        <i className="bi bi-dash"></i>
                                                    </button>
                                                    <span style={{ color: 'var(--cream)', minWidth: 20, textAlign: 'center', fontSize: '0.9rem' }}>
                                                        {cart.find(c => c._id === item._id).quantity}
                                                    </span>
                                                    <button className="btn btn-sm btn-gold px-2 py-1"
                                                        onClick={() => updateQty(item._id, cart.find(c => c._id === item._id).quantity + 1)}>
                                                        <i className="bi bi-plus"></i>
                                                    </button>
                                                </div>
                                            ) : (
                                                <button className="btn btn-gold btn-sm" onClick={() => addToCart(item)}>
                                                    <i className="bi bi-plus me-1"></i>Add
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Cart Sidebar */}
            <div style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: '100%', maxWidth: 420,
                background: 'var(--dark-2)',
                borderLeft: '1px solid rgba(241, 229, 172, 0.2)',
                zIndex: 1050,
                display: 'flex', flexDirection: 'column',
                transform: showCart ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: showCart ? '-10px 0 30px rgba(0,0,0,0.5)' : 'none'
            }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(241, 229, 172, 0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h5 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.4rem', color: 'var(--cream)', margin: 0 }}>Your Order</h5>
                    <button className="btn p-0" onClick={() => setShowCart(false)} style={{ color: 'var(--text-light)' }}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
                    {cart.length === 0 ? (
                        <div className="text-center py-4" style={{ color: 'var(--text-muted)' }}>
                            <i className="bi bi-bag" style={{ fontSize: '2.5rem' }}></i>
                            <p className="mt-2 small">Your cart is empty</p>
                        </div>
                    ) : cart.map(item => (
                        <div key={item._id} className="d-flex align-items-center gap-3 mb-3 pb-3 animate-in"
                            style={{ borderBottom: '1px solid rgba(241, 229, 172, 0.08)' }}>
                            <div className="flex-grow-1">
                                <div style={{ color: 'var(--cream)', fontSize: '0.9rem', fontWeight: 500 }}>{item.name}</div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>LKR {item.price.toLocaleString()} each</div>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <button className="btn btn-sm btn-outline-gold px-2 py-0" onClick={() => updateQty(item._id, item.quantity - 1)}>
                                    <i className="bi bi-dash"></i>
                                </button>
                                <span style={{ color: 'var(--cream)', minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                                <button className="btn btn-sm btn-gold px-2 py-0" onClick={() => updateQty(item._id, item.quantity + 1)}>
                                    <i className="bi bi-plus"></i>
                                </button>
                            </div>
                            <div style={{ color: 'var(--gold)', fontSize: '0.9rem', minWidth: 80, textAlign: 'right' }}>
                                LKR {(item.price * item.quantity).toLocaleString()}
                            </div>
                        </div>
                    ))}

                    {cart.length > 0 && (
                        <div className="animate-in">
                            <div className="d-flex justify-content-between mb-4 pt-2">
                                <span style={{ color: 'var(--text-light)' }}>Total</span>
                                <span style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.3rem', color: 'var(--gold)', fontWeight: 600 }}>
                                    LKR {total.toLocaleString()}
                                </span>
                            </div>
                            <h6 style={{ color: 'var(--cream)', fontSize: '0.85rem', letterSpacing: '0.05em', marginBottom: '1rem' }}>Your Details</h6>
                            <input className="form-control form-control-dark mb-2" placeholder="Your Name *"
                                value={orderForm.name} onChange={e => setOrderForm(p => ({ ...p, name: e.target.value }))} />
                            <input className="form-control form-control-dark mb-2" placeholder="Phone Number *" type="tel"
                                value={orderForm.phone} onChange={e => setOrderForm(p => ({ ...p, phone: e.target.value }))} />
                            <textarea className="form-control form-control-dark mb-3" rows={2} placeholder="Special notes (optional)"
                                value={orderForm.notes} onChange={e => setOrderForm(p => ({ ...p, notes: e.target.value }))} />
                        </div>
                    )}
                </div>

                {cart.length > 0 && (
                    <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(241, 229, 172, 0.15)' }}>
                        <button className="btn btn-gold w-100 py-3" onClick={placeOrder} disabled={placing}>
                            {placing ? <span className="spinner-border spinner-border-sm me-2" /> : <i className="bi bi-whatsapp me-2"></i>}
                            Send via WhatsApp
                        </button>
                    </div>
                )}
            </div>

            <div style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.5)',
                zIndex: 1049,
                opacity: showCart ? 1 : 0,
                visibility: showCart ? 'visible' : 'hidden',
                transition: 'opacity 0.3s ease, visibility 0.3s ease'
            }} onClick={() => setShowCart(false)} />
        </div>
    );
}