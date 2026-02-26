import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import logo from '../../assets/romi_logo.png';

const services = [
    { icon: 'bi-snow2', title: 'AC & Non-AC Rooms', desc: 'Comfortable rooms tailored to your preference, equipped with modern amenities for a restful stay.' },
    { icon: 'bi-water', title: 'Swimming Pool', desc: 'Refresh and unwind in our pristine swimming pool, open for guests throughout the day.' },
    { icon: 'bi-cup-hot', title: 'Family Restaurant', desc: 'Savor authentic flavors and international cuisine crafted by our expert culinary team.' },
    { icon: 'bi-bell', title: 'Room Service', desc: '24-hour room service bringing hotel-quality dining directly to your door, any time.' },
    { icon: 'bi-p-circle', title: 'Secure Parking', desc: 'Ample and secure parking facility ensuring your vehicle is safe throughout your stay.' },
    { icon: 'bi-sun', title: 'Day Outing', desc: 'Full-day outing packages with access to all hotel facilities without an overnight stay.' },
    { icon: 'bi-stars', title: 'Banquet Facilities', desc: 'Elegant event spaces for weddings, engagements, birthdays, farewells, homecomings and family gatherings.' },
];

const events = [
    { icon: 'bi-heart', label: 'Weddings' },
    { icon: 'bi-gem', label: 'Engagements' },
    { icon: 'bi-balloon-heart', label: 'Birthdays' },
    { icon: 'bi-house-heart', label: 'Homecomings' },
    { icon: 'bi-people', label: 'Family Events' },
    { icon: 'bi-emoji-smile', label: 'Farewells' },
];

export default function HomePage() {
    return (
        <div className="page-transition" style={{ background: 'var(--dark)', minHeight: '100vh', overflowX: 'hidden' }}>
            <Navbar />

            {/* Hero */}
            <section className="hero-section d-flex align-items-start justify-content-center text-center" style={{ paddingTop: '80px' }}>
                <div className="container pb-4 pt-5">
                    <div className="fade-in-up">
                        <div className="section-label mb-2">Welcome to</div>
                        <img src={logo} alt="Hotel Romi Logo" className="mb-3" style={{
                            width: 180, height: 180, objectFit: 'contain',
                            filter: 'drop-shadow(0 0 15px rgba(241, 229, 172, 0.2))'
                        }} />
                        <h1 className="display-2 mb-0 text-gold-shimmer" style={{ fontFamily: 'Cormorant Garamond', fontWeight: 100, letterSpacing: '0.08em' }}>
                            HOTEL ROMI
                        </h1>
                        <div className="gold-divider-sm my-3"></div>
                        <p style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.25rem', fontStyle: 'italic', color: 'var(--text-light)', maxWidth: 600, margin: '0 auto 2rem' }}>
                            Where luxury meets comfort — an unforgettable retreat crafted for your every need.
                        </p>
                        <div className="d-flex flex-wrap gap-3 justify-content-center">
                            <Link to="/book-room" className="btn btn-gold px-4 py-3">
                                <i className="bi bi-door-closed me-2"></i>Book a Room
                            </Link>
                            <Link to="/restaurant" className="btn btn-outline-gold px-4 py-3">
                                <i className="bi bi-cup-hot me-2"></i>Order Food
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Decorative elements */}
                <div style={{
                    position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'
                }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Scroll</div>
                    <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, var(--gold), transparent)' }}></div>
                </div>
            </section>

            {/* About */}
            <section style={{ background: 'var(--dark-2)', padding: '5rem 0' }}>
                <div className="container">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-5">
                            <div className="section-label mb-3">About Us</div>
                            <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '3rem', fontWeight: 400, color: 'var(--cream)', lineHeight: 1.2 }}>
                                A Sanctuary of<br /><em style={{ color: 'var(--gold)' }}>Elegance & Comfort</em>
                            </h2>
                            <hr className="gold-divider" />
                            <p style={{ color: 'var(--text-light)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                                Hotel Romi stands as a beacon of warm hospitality and refined luxury. Nestled in a serene setting,
                                we offer an exceptional blend of modern comforts and timeless elegance. Whether you're here for
                                a business trip, a family vacation, or a special celebration, we ensure every moment is memorable.
                            </p>
                            <p style={{ color: 'var(--text-light)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                                From our thoughtfully appointed rooms to our world-class restaurant and event facilities,
                                Hotel Romi is your complete destination for rest, dining, and celebration.
                            </p>
                        </div>
                        <div className="col-lg-7">
                            <div className="row g-3">
                                {[
                                    { num: '50+', label: 'Luxury Rooms' },
                                    { num: '15+', label: 'Years Experience' },
                                    { num: '1000+', label: 'Events Hosted' },
                                    { num: '4.9★', label: 'Guest Rating' },
                                ].map((s, i) => (
                                    <div key={i} className="col-6">
                                        <div className="card-dark p-4 text-center">
                                            <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '2.5rem', color: 'var(--gold)', fontWeight: 600 }}>{s.num}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s.label}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services */}
            <section style={{ padding: '5rem 0' }}>
                <div className="container">
                    <div className="text-center mb-5">
                        <div className="section-label mb-3">What We Offer</div>
                        <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2.8rem', color: 'var(--cream)' }}>Our Services</h2>
                        <div className="gold-divider-sm"></div>
                    </div>
                    <div className="row g-4">
                        {services.map((s, i) => (
                            <div key={i} className="col-md-6 col-lg-4">
                                <div className="card-dark p-4 h-100 animate-in" style={{
                                    animationDelay: `${i * 0.1}s`,
                                    opacity: 0
                                }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = 'rgba(241, 229, 172, 0.4)';
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = 'rgba(241, 229, 172, 0.15)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}>
                                    <div style={{
                                        width: 52, height: 52, borderRadius: '3px',
                                        background: 'rgba(241, 229, 172, 0.1)', border: '1px solid rgba(241, 229, 172, 0.25)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem'
                                    }}>
                                        <i className={`bi ${s.icon} text-gold`} style={{ fontSize: '1.4rem' }}></i>
                                    </div>
                                    <h5 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.3rem', color: 'var(--cream)', marginBottom: '0.75rem' }}>{s.title}</h5>
                                    <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Banquet / Events */}
            <section style={{ background: 'var(--dark-2)', padding: '5rem 0' }}>
                <div className="container">
                    <div className="row align-items-center g-4">
                        <div className="col-lg-6">
                            <div className="section-label mb-3">Events & Celebrations</div>
                            <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2.8rem', color: 'var(--cream)' }}>
                                Your Perfect <em style={{ color: 'var(--gold)' }}>Celebration</em> Awaits
                            </h2>
                            <hr className="gold-divider" />
                            <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', lineHeight: 1.8 }}>
                                Our elegant banquet halls are designed to transform your vision into reality.
                                With professional event coordination, exquisite décor arrangements, and sumptuous catering,
                                Hotel Romi ensures every celebration is uniquely extraordinary.
                            </p>
                            <div className="mt-4 d-flex flex-wrap gap-2">
                                {events.map((e, i) => (
                                    <span key={i} className="badge-gold d-flex align-items-center gap-1 py-2 px-3">
                                        <i className={`bi ${e.icon}`}></i> {e.label}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="card-dark p-5 text-center" style={{ border: '1px solid rgba(241, 229, 172, 0.25)' }}>
                                <i className="bi bi-stars text-gold" style={{ fontSize: '3rem' }}></i>
                                <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.8rem', color: 'var(--cream)', margin: '1rem 0 0.5rem' }}>
                                    Book Your Event
                                </h3>
                                <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                                    Contact us to discuss your event requirements. We'll craft an experience tailored just for you.
                                </p>
                                <a href="tel:+94XXXXXXXXX" className="btn btn-gold w-100 py-3">
                                    <i className="bi bi-telephone me-2"></i>Contact Us Now
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ padding: '5rem 0' }}>
                <div className="container text-center">
                    <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2.8rem', color: 'var(--cream)', marginBottom: '1rem' }}>
                        Ready for an Unforgettable Stay?
                    </h2>
                    <p style={{ color: 'var(--text-light)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
                        Book your room today and experience the Romi difference.
                    </p>
                    <div className="d-flex flex-wrap gap-3 justify-content-center">
                        <Link to="/book-room" className="btn btn-gold px-5 py-3">
                            <i className="bi bi-calendar-plus me-2"></i>Reserve Now
                        </Link>
                        <Link to="/track-order" className="btn btn-outline-gold px-5 py-3">
                            <i className="bi bi-search me-2"></i>Track My Order
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ background: 'var(--dark-2)', borderTop: '1px solid rgba(241, 229, 172, 0.15)', padding: '3rem 0' }}>
                <div className="container">
                    <div className="row g-4">
                        <div className="col-lg-4">
                            <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.8rem', color: 'var(--cream)', marginBottom: '0.5rem' }}>HOTEL ROMI</div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.7 }}>
                                Luxury hospitality crafted with passion, delivered with care.
                            </p>
                        </div>
                        <div className="col-lg-4">
                            <h6 style={{ color: 'var(--gold)', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>Quick Links</h6>
                            <div className="d-flex flex-column gap-2">
                                {[['/', 'Home'], ['/restaurant', 'Restaurant'], ['/book-room', 'Rooms'], ['/track-order', 'Track Order']].map(([to, label]) => (
                                    <Link key={to} to={to} style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none' }}
                                        onMouseEnter={e => e.target.style.color = 'var(--gold)'}
                                        onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>{label}</Link>
                                ))}
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <h6 style={{ color: 'var(--gold)', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>Contact</h6>
                            <div className="d-flex flex-column gap-2" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                <div><i className="bi bi-geo-alt me-2 text-gold"></i>Hotel Romi, Your City, Sri Lanka</div>
                                <div><i className="bi bi-telephone me-2 text-gold"></i>+94 XX XXX XXXX</div>
                                <div><i className="bi bi-envelope me-2 text-gold"></i>info@hotelromi.lk</div>
                            </div>
                        </div>
                    </div>
                    <hr className="gold-divider mt-4" />
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textAlign: 'center', margin: 0 }}>
                        © {new Date().getFullYear()} Hotel Romi. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}