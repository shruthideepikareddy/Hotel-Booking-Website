import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getRooms = () => api.get('/rooms');
export const getRoom = (id) => api.get(`/rooms/${id}`);
export const registerUser = (user) => api.post('/users', user);
export const loginUser = async (email, password) => {
    const response = await api.get(`/users?email=${email}&password=${password}`);
    if (response.data.length > 0) {
        return response.data[0];
    }
    throw new Error('Invalid credentials');
};
export const createBooking = (booking) => api.post('/bookings', booking);
export const getUserBookings = (userId) => api.get(`/bookings?userId=${userId}&_expand=room`);
export const deleteBooking = (id) => api.delete(`/bookings/${id}`);
export const updateBooking = (id, booking) => api.patch(`/bookings/${id}`, booking);

export default api;
