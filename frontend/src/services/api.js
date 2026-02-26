import axios from 'axios';

const api = axios.create({
    baseURL: 'https://hotelromi.onrender.com/api',
    headers: { 'Content-Type': 'application/json' }
});

const token = localStorage.getItem('romi_token');
if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

export default api;

// Room services
export const roomService = {
    getAll: () => api.get('/rooms'),
    getById: (id) => api.get(`/rooms/${id}`),
    checkAvailability: (params) => api.get('/rooms/availability', { params }),
    create: (data) => api.post('/rooms', data),
    update: (id, data) => api.put(`/rooms/${id}`, data),
    delete: (id) => api.delete(`/rooms/${id}`)
};

// Booking services
export const bookingService = {
    getAll: () => api.get('/bookings'),
    getByPhone: (phone) => api.get(`/bookings/phone/${phone}`),
    create: (data) => api.post('/bookings', data),
    updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
    update: (id, data) => api.put(`/bookings/${id}`, data)
};

// Menu services
export const menuService = {
    getAll: (params) => api.get('/menu', { params }),
    create: (data) => api.post('/menu', data),
    update: (id, data) => api.put(`/menu/${id}`, data),
    delete: (id) => api.delete(`/menu/${id}`)
};

// Order services
export const orderService = {
    getAll: () => api.get('/orders'),
    getByPhone: (phone) => api.get(`/orders/phone/${phone}`),
    create: (data) => api.post('/orders', data),
    updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status })
};

// Invoice services
export const invoiceService = {
    getAll: () => api.get('/invoices'),
    getById: (id) => api.get(`/invoices/${id}`),
    createRoom: (data) => api.post('/invoices/room', data),
    createRestaurant: (data) => api.post('/invoices/restaurant', data),
    update: (id, data) => api.put(`/invoices/${id}`, data)
};