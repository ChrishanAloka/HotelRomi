import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { roomService } from '../../services/api';

const defaultForm = { roomNumber: '', type: 'AC', category: 'Standard', description: '', price: '', capacity: 2, amenities: '', isAvailable: true };

export default function AdminRooms() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(defaultForm);
    const [saving, setSaving] = useState(false);

    const load = () => roomService.getAll().then(r => setRooms(r.data)).finally(() => setLoading(false));
    useEffect(() => { load(); }, []);

    const openNew = () => { setEditing(null); setForm(defaultForm); setModal(true); };
    const openEdit = (r) => {
        setEditing(r._id);
        setForm({ ...r, amenities: r.amenities?.join(', ') || '', price: r.price.toString() });
        setModal(true);
    };

    const save = async () => {
        setSaving(true);
        try {
            const data = { ...form, price: +form.price, amenities: form.amenities ? form.amenities.split(',').map(s => s.trim()) : [] };
            if (editing) await roomService.update(editing, data);
            else await roomService.create(data);
            setModal(false); load();
        } catch (e) { alert(e.response?.data?.message || 'Error saving'); }
        finally { setSaving(false); }
    };

    const del = async (id) => {
        if (!confirm('Delete this room?')) return;
        await roomService.delete(id); load();
    };

    return (
        <AdminLayout title="Rooms">
            <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-gold" onClick={openNew}><i className="bi bi-plus-lg me-2"></i>Add Room</button>
            </div>

            {loading ? <div className="text-center py-5"><span className="spinner-border spinner-gold" /></div> : (
                <div className="card-dark">
                    <div className="table-responsive">
                        <table className="table table-dark-custom mb-0">
                            <thead>
                                <tr>
                                    <th>Room No.</th>
                                    <th>Type</th>
                                    <th>Category</th>
                                    <th>Price/Night</th>
                                    <th>Capacity</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rooms.map(r => (
                                    <tr key={r._id}>
                                        <td style={{ color: 'var(--gold)', fontWeight: 500 }}>{r.roomNumber}</td>
                                        <td><span className="badge-gold">{r.type}</span></td>
                                        <td style={{ color: 'var(--text-light)' }}>{r.category}</td>
                                        <td style={{ fontFamily: 'Cormorant Garamond', color: 'var(--cream)', fontSize: '1rem' }}>LKR {r.price?.toLocaleString()}</td>
                                        <td style={{ color: 'var(--text-light)' }}>{r.capacity}</td>
                                        <td>
                                            <span style={{
                                                fontSize: '0.68rem', padding: '0.3em 0.6em', borderRadius: 2,
                                                background: r.isAvailable ? 'rgba(76,175,124,0.15)' : 'rgba(224,92,92,0.15)',
                                                color: r.isAvailable ? 'var(--success)' : 'var(--danger)',
                                                border: `1px solid ${r.isAvailable ? 'rgba(76,175,124,0.3)' : 'rgba(224,92,92,0.3)'}`
                                            }}>{r.isAvailable ? 'Available' : 'Unavailable'}</span>
                                        </td>
                                        <td>
                                            <button className="btn btn-sm btn-outline-gold me-2 px-2" onClick={() => openEdit(r)}>
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button className="btn btn-sm px-2" style={{ background: 'rgba(224,92,92,0.15)', border: '1px solid rgba(224,92,92,0.3)', color: 'var(--danger)', borderRadius: 2 }} onClick={() => del(r._id)}>
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {rooms.length === 0 && (
                                    <tr><td colSpan={7} className="text-center py-4" style={{ color: 'var(--text-muted)' }}>No rooms added yet</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal */}
            {modal && (
                <div className="modal show d-block" style={{ zIndex: 1060 }}>
                    <div className="modal-dialog modal-dark modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.3rem', color: 'var(--cream)', margin: 0 }}>
                                    {editing ? 'Edit Room' : 'Add New Room'}
                                </h5>
                                <button className="btn-close" onClick={() => setModal(false)} />
                            </div>
                            <div className="modal-body p-4">
                                <div className="row g-3">
                                    {[
                                        { label: 'Room Number', key: 'roomNumber', placeholder: '101' },
                                        { label: 'Price per Night (LKR)', key: 'price', placeholder: '5000', type: 'number' },
                                        { label: 'Capacity', key: 'capacity', type: 'number' }
                                    ].map(f => (
                                        <div key={f.key} className="col-md-4">
                                            <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem' }}>{f.label}</label>
                                            <input type={f.type || 'text'} className="form-control form-control-dark" placeholder={f.placeholder}
                                                value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
                                        </div>
                                    ))}
                                    <div className="col-md-4">
                                        <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem' }}>Type</label>
                                        <select className="form-control form-control-dark" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                                            <option>AC</option><option>Non-AC</option>
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem' }}>Category</label>
                                        <select className="form-control form-control-dark" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                                            {['Standard', 'Deluxe', 'Suite', 'Family'].map(c => <option key={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem' }}>Status</label>
                                        <select className="form-control form-control-dark" value={form.isAvailable.toString()} onChange={e => setForm(p => ({ ...p, isAvailable: e.target.value === 'true' }))}>
                                            <option value="true">Available</option>
                                            <option value="false">Unavailable</option>
                                        </select>
                                    </div>
                                    <div className="col-12">
                                        <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem' }}>Amenities (comma separated)</label>
                                        <input className="form-control form-control-dark" placeholder="WiFi, TV, Hot Water, Mini Bar"
                                            value={form.amenities} onChange={e => setForm(p => ({ ...p, amenities: e.target.value }))} />
                                    </div>
                                    <div className="col-12">
                                        <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem' }}>Description</label>
                                        <textarea className="form-control form-control-dark" rows={2}
                                            value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-outline-gold" onClick={() => setModal(false)}>Cancel</button>
                                <button className="btn btn-gold" onClick={save} disabled={saving}>
                                    {saving ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                                    {editing ? 'Update' : 'Add Room'}
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