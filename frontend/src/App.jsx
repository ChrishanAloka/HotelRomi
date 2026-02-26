import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Customer pages
import HomePage from './pages/customer/HomePage';
import RestaurantPage from './pages/customer/RestaurantPage';
import BookRoomPage from './pages/customer/BookRoomPage';
import TrackOrderPage from './pages/customer/TrackOrderPage';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRooms from './pages/admin/AdminRooms';
import AdminBookings from './pages/admin/AdminBookings';
import AdminMenu from './pages/admin/AdminMenu';
import AdminOrders from './pages/admin/AdminOrders';
import AdminInvoices from './pages/admin/AdminInvoices';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div className="spinner-border spinner-gold" role="status" />
        </div>
    );
    return user ? children : <Navigate to="/admin/login" />;
};

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <BrowserRouter>
                    <Routes>
                        {/* Customer Routes */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/restaurant" element={<RestaurantPage />} />
                        <Route path="/book-room" element={<BookRoomPage />} />
                        <Route path="/track-order" element={<TrackOrderPage />} />
                        {/* Admin Routes */}
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                        <Route path="/admin/rooms" element={<ProtectedRoute><AdminRooms /></ProtectedRoute>} />
                        <Route path="/admin/bookings" element={<ProtectedRoute><AdminBookings /></ProtectedRoute>} />
                        <Route path="/admin/menu" element={<ProtectedRoute><AdminMenu /></ProtectedRoute>} />
                        <Route path="/admin/orders" element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />
                        <Route path="/admin/invoices" element={<ProtectedRoute><AdminInvoices /></ProtectedRoute>} />
                    </Routes>
                </BrowserRouter>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;