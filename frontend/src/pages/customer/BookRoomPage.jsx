import { useState } from 'react';
import Navbar from '../../components/common/Navbar';
import { roomService, bookingService } from '../../services/api';

const WHATSAPP_NUMBER = '94719404928';

export default function BookRoomPage() {
    const [step, setStep] = useState(1);
    const [search, setSearch] = useState({ checkIn: '', checkOut: '', type: '' });
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [form, setForm] = useState({ customerName: '', customerPhone: '', customerEmail: '', adults: 1, children: 0, includeRoomService: false, specialRequests: '' });
    const [booked, setBooked] = useState(null);
    const [error, setError] = useState('');

    const searchRooms = async () => {
        if (!search.checkIn || !search.checkOut) return setError('Please select check-in and check-out dates.');
        if (new Date(search.checkIn) >= new Date(search.checkOut)) return setError('Check-out must be after check-in.');
        setError(''); setLoading(true);
        try {
            const res = await roomService.checkAvailability(search);
            setRooms(res.data);
            setStep(2);
        } catch {
            setError('Failed to check availability.');
        } finally { setLoading(false); }
    };

    const selectRoom = (room) => { setSelectedRoom(room); setStep(3); };

    const placeBooking = async () => {
        if (!form.customerName || !form.customerPhone) return setError('Please fill required fields.');
        if (form.adults + form.children > selectedRoom.capacity) {
            return setError(`This room only accommodates up to ${selectedRoom.capacity} persons.`);
        }
        setLoading(true); setError('');
        try {
            const nights = Math.ceil((new Date(search.checkOut) - new Date(search.checkIn)) / 86400000);
            const res = await bookingService.create({
                ...form, room: selectedRoom._id,
                checkIn: search.checkIn, checkOut: search.checkOut
            });
            setBooked(res.data);
            setStep(4);
        } catch (e) {
            setError(e.response?.data?.message || 'Booking failed.');
        } finally { setLoading(false); }
    };

    const sendWhatsApp = () => {
        const msg = encodeURIComponent(
            `🏨 *New Room Booking — Hotel Romi*\n\n` +
            `*Customer:* ${booked.customerName}\n` +
            `*Room:* Room ${selectedRoom.roomNumber} (${selectedRoom.type})\n` +
            `*Check-In:* ${new Date(search.checkIn).toLocaleDateString()}\n` +
            `*Check-Out:* ${new Date(search.checkOut).toLocaleDateString()}\n` +
            `*Total:* LKR ${booked.totalAmount?.toLocaleString()}\n\n` +
            `Please confirm my booking. Thank you!`
        );
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
    };

    const nights = search.checkIn && search.checkOut
        ? Math.ceil((new Date(search.checkOut) - new Date(search.checkIn)) / 86400000) : 0;

    return (
        <div className="page-transition" style={{ background: 'var(--dark)', minHeight: '100vh', paddingTop: '80px' }}>
            <Navbar />
            <div className="page-header mb-4">
                <div className="container">
                    <div className="section-label mb-1">Hotel Romi</div>
                    <h1 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2.5rem', color: 'var(--cream)', margin: 0 }}>Book a Room</h1>
                </div>
            </div>

            <div className="container pb-5" style={{ maxWidth: 900 }}>
                {/* Step indicator */}
                <div className="d-flex align-items-center gap-2 mb-4">
                    {['Search', 'Choose Room', 'Details', 'Confirmed'].map((s, i) => (
                        <div key={i} className="d-flex align-items-center gap-2">
                            <div style={{
                                width: 28, height: 28, borderRadius: '50%',
                                background: step > i + 1 ? 'var(--gold)' : step === i + 1 ? 'var(--gold)' : 'var(--dark-3)',
                                border: `1px solid ${step >= i + 1 ? 'var(--gold)' : 'rgba(241, 229, 172, 0.2)'}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.75rem', fontWeight: 600,
                                color: step >= i + 1 ? 'var(--dark)' : 'var(--text-muted)'
                            }}>
                                {step > i + 1 ? <i className="bi bi-check"></i> : i + 1}
                            </div>
                            <span style={{ fontSize: '0.75rem', color: step === i + 1 ? 'var(--gold)' : 'var(--text-muted)', display: 'block' }}
                                className="d-none d-sm-block">{s}</span>
                            {i < 3 && <div style={{ width: 30, height: 1, background: step > i + 1 ? 'var(--gold)' : 'rgba(241, 229, 172, 0.15)' }}></div>}
                        </div>
                    ))}
                </div>

                {error && <div className="alert alert-danger mb-3" style={{ background: 'rgba(224,92,92,0.15)', border: '1px solid rgba(224,92,92,0.3)', color: '#f08080', borderRadius: 3 }}>{error}</div>}

                {/* Step 1: Search */}
                {step === 1 && (
                    <div className="card-dark p-4 animate-in">
                        <h5 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.4rem', color: 'var(--cream)', marginBottom: '1.5rem' }}>Check Availability</h5>
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.5rem' }}>Check-In</label>
                                <input type="date" className="form-control form-control-dark"
                                    min={new Date().toISOString().split('T')[0]}
                                    value={search.checkIn} onChange={e => setSearch(p => ({ ...p, checkIn: e.target.value }))} />
                            </div>
                            <div className="col-md-4">
                                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.5rem' }}>Check-Out</label>
                                <input type="date" className="form-control form-control-dark"
                                    min={search.checkIn || new Date().toISOString().split('T')[0]}
                                    value={search.checkOut} onChange={e => setSearch(p => ({ ...p, checkOut: e.target.value }))} />
                            </div>
                            <div className="col-md-4">
                                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.5rem' }}>Room Type</label>
                                <select className="form-control form-control-dark" value={search.type}
                                    onChange={e => setSearch(p => ({ ...p, type: e.target.value }))}>
                                    <option value="">All Types</option>
                                    <option value="AC">AC</option>
                                    <option value="Non-AC">Non-AC</option>
                                </select>
                            </div>
                        </div>
                        <button className="btn btn-gold mt-4 px-5" onClick={searchRooms} disabled={loading}>
                            {loading ? <span className="spinner-border spinner-border-sm me-2" /> : <i className="bi bi-search me-2"></i>}
                            Check Availability
                        </button>
                    </div>
                )}

                {/* Step 2: Choose Room */}
                {step === 2 && (
                    <div className="animate-in">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <div style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>
                                {nights} night(s) · {search.checkIn} → {search.checkOut}
                            </div>
                            <button className="btn btn-outline-gold btn-sm" onClick={() => setStep(1)}>
                                <i className="bi bi-arrow-left me-1"></i>Modify
                            </button>
                        </div>
                        <div className="row g-3">
                            {rooms.map(room => (
                                <div key={room._id} className="col-md-6">
                                    <div className="card-dark p-4" style={{
                                        opacity: room.isAvailable ? 1 : 0.5,
                                        border: `1px solid ${room.isAvailable ? 'rgba(241, 229, 172, 0.2)' : 'rgba(255,255,255,0.05)'}`,
                                        transition: 'all 0.2s'
                                    }}>
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div>
                                                <span className="badge-gold me-2">{room.type}</span>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{room.category}</span>
                                            </div>
                                            <span style={{
                                                fontSize: '0.68rem', padding: '0.25em 0.6em', borderRadius: 2,
                                                background: room.isAvailable ? 'rgba(76,175,124,0.15)' : 'rgba(224,92,92,0.15)',
                                                color: room.isAvailable ? 'var(--success)' : 'var(--danger)',
                                                border: `1px solid ${room.isAvailable ? 'rgba(76,175,124,0.3)' : 'rgba(224,92,92,0.3)'}`
                                            }}>
                                                {room.isAvailable ? 'Available' : 'Booked'}
                                            </span>
                                        </div>
                                        <h5 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.3rem', color: 'var(--cream)' }}>
                                            Room {room.roomNumber}
                                        </h5>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                            <i className="bi bi-people me-1"></i> Max {room.capacity} Persons
                                        </div>
                                        {room.description && <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{room.description}</p>}
                                        <div className="d-flex flex-wrap gap-1 mb-3">
                                            {room.amenities?.map((a, i) => (
                                                <span key={i} style={{ fontSize: '0.68rem', color: 'var(--text-muted)', background: 'var(--dark-3)', padding: '0.2em 0.5em', borderRadius: 2 }}>{a}</span>
                                            ))}
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div>
                                                <span style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.5rem', color: 'var(--gold)', fontWeight: 600 }}>
                                                    LKR {room.price?.toLocaleString()}
                                                </span>
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>/night</span>
                                                {nights > 0 && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total: LKR {(room.price * nights).toLocaleString()}</div>}
                                            </div>
                                            <button className="btn btn-gold btn-sm" disabled={!room.isAvailable} onClick={() => selectRoom(room)}>
                                                Select
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {rooms.length === 0 && (
                                <div className="col-12 text-center py-5" style={{ color: 'var(--text-muted)' }}>
                                    <i className="bi bi-door-closed" style={{ fontSize: '3rem' }}></i>
                                    <p className="mt-2">No rooms found</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Step 3: Guest Details */}
                {step === 3 && selectedRoom && (
                    <div className="animate-in">
                        <div className="card-dark p-3 mb-4 d-flex align-items-center gap-3">
                            <div style={{ background: 'rgba(241, 229, 172, 0.1)', padding: '0.75rem 1rem', borderRadius: 3, border: '1px solid rgba(241, 229, 172, 0.2)' }}>
                                <div className="badge-gold">{selectedRoom.type}</div>
                                <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.2rem', color: 'var(--cream)', marginTop: '0.25rem' }}>Room {selectedRoom.roomNumber}</div>
                            </div>
                            <div>
                                <div style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>{nights} night(s) · {search.checkIn} → {search.checkOut}</div>
                                <div className="d-flex align-items-center gap-2">
                                    <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.3rem', color: 'var(--gold)' }}>LKR {(selectedRoom.price * nights).toLocaleString()}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(Max {selectedRoom.capacity} Persons)</div>
                                </div>
                            </div>
                            <button className="btn btn-outline-gold btn-sm ms-auto" onClick={() => setStep(2)}>Change</button>
                        </div>

                        <div className="card-dark p-4">
                            <h5 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.4rem', color: 'var(--cream)', marginBottom: '1.5rem' }}>Guest Details</h5>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem' }}>Full Name *</label>
                                    <input className="form-control form-control-dark" placeholder="Your name"
                                        value={form.customerName} onChange={e => setForm(p => ({ ...p, customerName: e.target.value }))} />
                                </div>
                                <div className="col-md-6">
                                    <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem' }}>WhatsApp Phone Number *</label>
                                    <input className="form-control form-control-dark" placeholder="07X XXX XXXX" type="tel"
                                        value={form.customerPhone} onChange={e => setForm(p => ({ ...p, customerPhone: e.target.value }))} />
                                </div>
                                <div className="col-md-6">
                                    <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem' }}>Email</label>
                                    <input className="form-control form-control-dark" placeholder="email@example.com" type="email"
                                        value={form.customerEmail} onChange={e => setForm(p => ({ ...p, customerEmail: e.target.value }))} />
                                </div>
                                <div className="col-md-3">
                                    <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem' }}>Adults</label>
                                    <input type="number" className="form-control form-control-dark" min="1" max={selectedRoom.capacity}
                                        value={form.adults} onChange={e => setForm(p => ({ ...p, adults: +e.target.value }))} />
                                </div>
                                <div className="col-md-3">
                                    <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem' }}>Children</label>
                                    <input type="number" className="form-control form-control-dark" min="0" max={selectedRoom.capacity - 1}
                                        value={form.children} onChange={e => setForm(p => ({ ...p, children: +e.target.value }))} />
                                </div>
                                <div className="col-12 mt-1">
                                    <div style={{ fontSize: '0.8rem', color: form.adults + form.children > selectedRoom.capacity ? 'var(--danger)' : 'var(--text-muted)' }}>
                                        Total Persons: {form.adults + form.children} / {selectedRoom.capacity}
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="roomService"
                                            checked={form.includeRoomService} onChange={e => setForm(p => ({ ...p, includeRoomService: e.target.checked }))} />
                                        <label className="form-check-label" htmlFor="roomService" style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>
                                            <i className="bi bi-bell me-2 text-gold"></i>Include Room Service
                                        </label>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem' }}>Special Requests</label>
                                    <textarea className="form-control form-control-dark" rows={2} placeholder="Any special requirements..."
                                        value={form.specialRequests} onChange={e => setForm(p => ({ ...p, specialRequests: e.target.value }))} />
                                </div>
                            </div>
                            <button className="btn btn-gold mt-4 px-5 py-3" onClick={placeBooking} disabled={loading}>
                                {loading ? <span className="spinner-border spinner-border-sm me-2" /> : <i className="bi bi-check-circle me-2"></i>}
                                Confirm Booking
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4: Confirmed */}
                {step === 4 && booked && (
                    <div className="card-dark p-5 text-center">
                        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(76,175,124,0.15)', border: '2px solid rgba(76,175,124,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <i className="bi bi-check-lg" style={{ fontSize: '2rem', color: 'var(--success)' }}></i>
                        </div>
                        <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2rem', color: 'var(--cream)' }}>Booking Submitted!</h3>
                        <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Your booking is pending confirmation from our team.</p>
                        <div className="card-dark-3 p-4 text-start" style={{ maxWidth: 400, margin: '0 auto 2rem' }}>
                            <div className="row g-2" style={{ fontSize: '0.875rem' }}>
                                <div className="col-5" style={{ color: 'var(--text-muted)' }}>Room:</div>
                                <div className="col-7" style={{ color: 'var(--cream)' }}>Room {selectedRoom.roomNumber}</div>
                                <div className="col-5" style={{ color: 'var(--text-muted)' }}>Check-In Date:</div>
                                <div className="col-7" style={{ color: 'var(--cream)' }}>{search.checkIn}</div>
                                <div className="col-5" style={{ color: 'var(--text-muted)' }}>Check-Out Date:</div>
                                <div className="col-7" style={{ color: 'var(--cream)' }}>{search.checkOut}</div>
                                <div className="col-5" style={{ color: 'var(--text-muted)' }}>Amount:</div>
                                <div className="col-7" style={{ color: 'var(--gold)', fontFamily: 'Cormorant Garamond', fontSize: '1.1rem' }}>LKR {booked.totalAmount?.toLocaleString()}</div>
                            </div>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '2rem' }}>
                            Use your phone number <strong style={{ color: 'var(--gold)' }}>{booked.customerPhone}</strong> to track your booking status.
                        </p>
                        <div className="d-flex flex-wrap gap-3 justify-content-center">
                            <button className="btn btn-gold" onClick={sendWhatsApp}>
                                <i className="bi bi-whatsapp me-2"></i>Send via WhatsApp
                            </button>
                            <a href={`/track-order`} className="btn btn-outline-gold">Track My Booking</a>
                            <button className="btn btn-outline-gold" onClick={() => { setStep(1); setBooked(null); setSelectedRoom(null); }}>
                                New Booking
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}