import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { menuService } from '../../services/api';

const CATEGORIES = ['Starters', 'Rice & Noodles', 'Curries', 'Grills', 'Desserts', 'Beverages', 'Specials'];
const defaultForm = { name: '', category: 'Starters', description: '', price: '', isAvailable: true, isVegetarian: false, spiceLevel: 'None', image: '' };

export default function AdminMenu() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(defaultForm);
    const [saving, setSaving] = useState(false);
    const [catFilter, setCatFilter] = useState('');

    const load = () => menuService.getAll().then(r => setItems(r.data)).finally(() => setLoading(false));
    useEffect(() => { load(); }, []);

    const openNew = () => { setEditing(null); setForm(defaultForm); setModal(true); };
    const openEdit = (i) => { setEditing(i._id); setForm({ ...i, price: i.price.toString() }); setModal(true); };
    const del = async (id) => { if (!confirm('Delete?')) return; await menuService.delete(id); load(); };

    const save = async () => {
        setSaving(true);
        try {
            const data = { ...form, price: +form.price };
            if (editing) await menuService.update(editing, data);
            else await menuService.create(data);
            setModal(false); load();
        } catch (e) { alert(e.response?.data?.message || 'Error'); }
        finally { setSaving(false); }
    };

    const filtered = catFilter ? items.filter(i => i.category === catFilter) : items;

    return (
        <AdminLayout title="Menu Items">
            <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                <div className="d-flex flex-wrap gap-2 flex-grow-1">
                    <button className={`btn btn-sm ${!catFilter ? 'btn-gold' : 'btn-outline-gold'}`} onClick={() => setCatFilter('')}>All</button>
                    {CATEGORIES.map(c => (
                        <button key={c} className={`btn btn-sm ${catFilter === c ? 'btn-gold' : 'btn-outline-gold'}`} onClick={() => setCatFilter(c)}>{c}</button>
                    ))}
                </div>
                <button className="btn btn-gold" onClick={openNew}><i className="bi bi-plus-lg me-2"></i>Add Item</button>
            </div>

            {loading ? <div className="text-center py-5"><span className="spinner-border spinner-gold" /></div> : (
                <div className="row g-3">
                    {filtered.map(item => (
                        <div key={item._id} className="col-sm-6 col-lg-4">
                            <div className="card-dark p-3 h-100">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <div>
                                        <span className="badge-gold" style={{ fontSize: '0.65rem' }}>{item.category}</span>
                                        {!item.isAvailable && <span style={{ fontSize: '0.65rem', color: 'var(--danger)', marginLeft: 6 }}>Unavailable</span>}
                                    </div>
                                    <div className="d-flex gap-1">
                                        <button className="btn btn-sm btn-outline-gold px-2 py-1" onClick={() => openEdit(item)}><i className="bi bi-pencil"></i></button>
                                        <button className="btn btn-sm px-2 py-1" style={{ background: 'rgba(224,92,92,0.12)', border: '1px solid rgba(224,92,92,0.25)', color: 'var(--danger)', borderRadius: 2 }} onClick={() => del(item._id)}>
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </div>
                                <h6 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.1rem', color: 'var(--cream)', marginBottom: '0.25rem' }}>{item.name}</h6>
                                <div className="d-flex gap-2 mb-2">
                                    {item.isVegetarian && <span style={{ fontSize: '0.65rem', color: 'var(--success)' }}><i className="bi bi-leaf-fill me-1"></i>Veg</span>}
                                    {item.spiceLevel !== 'None' && <span style={{ fontSize: '0.65rem', color: 'var(--warning)' }}><i className="bi bi-fire me-1"></i>{item.spiceLevel}</span>}
                                </div>
                                {item.description && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{item.description}</p>}
                                <div style={{ fontFamily: 'Cormorant Garamond', color: 'var(--gold)', fontSize: '1.2rem', marginTop: 'auto' }}>
                                    LKR {item.price?.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <div className="col-12 text-center py-5" style={{ color: 'var(--text-muted)' }}>
                            <i className="bi bi-cup-hot" style={{ fontSize: '2.5rem' }}></i>
                            <p className="mt-2">No menu items in this category</p>
                        </div>
                    )}
                </div>
            )}

            {modal && (
                <div className="modal show d-block" style={{ zIndex: 1060 }}>
                    <div className="modal-dialog modal-dark modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.3rem', color: 'var(--cream)', margin: 0 }}>
                                    {editing ? 'Edit Menu Item' : 'Add Menu Item'}
                                </h5>
                                <button className="btn-close" onClick={() => setModal(false)} />
                            </div>
                            <div className="modal-body p-4">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem' }}>Item Name</label>
                                        <input className="form-control form-control-dark" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                                    </div>
                                    <div className="col-md-3">
                                        <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem' }}>Category</label>
                                        <select className="form-control form-control-dark" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                                            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-md-3">
                                        <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem' }}>Price (LKR)</label>
                                        <input type="number" className="form-control form-control-dark" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} />
                                    </div>
                                    <div className="col-md-4">
                                        <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem' }}>Spice Level</label>
                                        <select className="form-control form-control-dark" value={form.spiceLevel} onChange={e => setForm(p => ({ ...p, spiceLevel: e.target.value }))}>
                                            {['None', 'Mild', 'Medium', 'Hot', 'Extra Hot'].map(s => <option key={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem' }}>Image URL (optional)</label>
                                        <input className="form-control form-control-dark" placeholder="https://..." value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} />
                                    </div>
                                    <div className="col-md-4 d-flex align-items-end gap-3 pb-1">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" id="veg" checked={form.isVegetarian} onChange={e => setForm(p => ({ ...p, isVegetarian: e.target.checked }))} />
                                            <label className="form-check-label" htmlFor="veg" style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Vegetarian</label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" id="avail" checked={form.isAvailable} onChange={e => setForm(p => ({ ...p, isAvailable: e.target.checked }))} />
                                            <label className="form-check-label" htmlFor="avail" style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Available</label>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem' }}>Description</label>
                                        <textarea className="form-control form-control-dark" rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-outline-gold" onClick={() => setModal(false)}>Cancel</button>
                                <button className="btn btn-gold" onClick={save} disabled={saving}>
                                    {saving ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                                    {editing ? 'Update' : 'Add Item'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {modal && <div className="modal-backdrop fade show" style={{ zIndex: 1055 }} onClick={() => setModal(false)} />}
        </AdminLayout>
    );
}