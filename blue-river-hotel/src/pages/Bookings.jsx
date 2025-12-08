import { useState, useEffect } from 'react';
import { getUserBookings, deleteBooking, updateBooking } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext'; // NEW: Our custom toast hook

const Bookings = () => {
    const { user } = useAuth();
    const { showToast } = useToast(); // NEW: Get showToast function from context
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingBookingId, setEditingBookingId] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    useEffect(() => {
        fetchBookings();
    }, [user]);

    const fetchBookings = async () => {
        if (user) {
            try {
                const response = await getUserBookings(user.id);
                const sortedBookings = response.data.sort((a, b) => {
                    if (a.bookedAt && b.bookedAt) {
                        return new Date(b.bookedAt) - new Date(a.bookedAt);
                    }
                    return b.id > a.id ? 1 : -1;
                });
                setBookings(sortedBookings);
            } catch (error) {
                console.error('Error fetching bookings:', error);
                showToast('Failed to load bookings', 'error');
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (id) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            try {
                await deleteBooking(id);
                setBookings(bookings.filter(b => b.id !== id));
                showToast('Booking cancelled successfully', 'success');
            } catch (error) {
                console.error('Error cancelling booking:', error);
                showToast('Failed to cancel booking', 'error');
            }
        }
    };

    const startEdit = (booking) => {
        setEditingBookingId(booking.id);
        setEditFormData({
            ...booking
        });
    };

    const cancelEdit = () => {
        setEditingBookingId(null);
        setEditFormData({});
    };

    const handleEditChange = (e) => {
        setEditFormData({
            ...editFormData,
            [e.target.name]: e.target.value
        });
    };

    const saveEdit = async (id) => {
        try {
            const payload = {};
            const originalBooking = bookings.find(b => b.id === id);

            if (editFormData.type === 'service') {
                payload.date = editFormData.date;
                payload.time = editFormData.time;
                const newGuests = Number(editFormData.guests);
                payload.guests = newGuests;

                // Recalculate price for service
                // Use stored pricePerPerson if available, otherwise derive from total/guests
                let pricePerPerson = originalBooking.pricePerPerson;
                if (!pricePerPerson && originalBooking.guests > 0) {
                    pricePerPerson = originalBooking.totalPrice / originalBooking.guests;
                }

                if (pricePerPerson) {
                    payload.totalPrice = pricePerPerson * newGuests;
                }
            } else {
                payload.checkIn = editFormData.checkIn;
                payload.checkOut = editFormData.checkOut;

                // Recalculate price for room
                const start = new Date(payload.checkIn);
                const end = new Date(payload.checkOut);
                const diffTime = Math.abs(end - start);
                const newDiffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (newDiffDays <= 0) {
                    showToast('Check-out date must be after check-in date', 'error');
                    return;
                }

                let pricePerNight = originalBooking.pricePerNight;
                if (!pricePerNight) {
                    const oldStart = new Date(originalBooking.checkIn);
                    const oldEnd = new Date(originalBooking.checkOut);
                    const oldDiffTime = Math.abs(oldEnd - oldStart);
                    const oldDiffDays = Math.ceil(oldDiffTime / (1000 * 60 * 60 * 24));
                    if (oldDiffDays > 0) {
                        pricePerNight = originalBooking.totalPrice / oldDiffDays;
                    }
                }

                if (pricePerNight) {
                    payload.totalPrice = pricePerNight * newDiffDays;
                }
            }

            await updateBooking(id, payload);
            setBookings(bookings.map(b => b.id === id ? { ...b, ...payload } : b));
            setEditingBookingId(null);
            showToast('Booking updated successfully', 'success');
        } catch (error) {
            console.error('Error updating booking:', error);
            showToast('Failed to update booking', 'error');
        }
    };

    if (!user) {
        return (
            <div className="text-center py-20">
                <p className="text-xl text-slate-600 mb-4">Please login to view your bookings.</p>
                <Link to="/login" className="text-primary hover:underline font-bold">Login here</Link>
            </div>
        );
    }

    if (loading) return <div className="text-center py-20">Loading bookings...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">My Bookings</h1>
            {bookings.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                    <p className="text-slate-600 mb-4">You haven't made any bookings yet.</p>
                    <Link to="/rooms" className="text-primary hover:underline font-medium">Browse Rooms</Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="bg-white p-6 rounded-xl shadow-md flex flex-col md:flex-row gap-6">
                            <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                    src={booking.type === 'service' ? booking.serviceImage : booking.roomImage}
                                    alt={booking.type === 'service' ? booking.serviceName : booking.roomName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-slate-800">
                                        {booking.type === 'service' ? booking.serviceName : booking.roomName}
                                    </h3>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                                        }`}>
                                        {booking.status}
                                    </span>
                                </div>

                                {editingBookingId === booking.id ? (
                                    <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 mb-4 bg-slate-50 p-4 rounded-lg">
                                        {booking.type === 'service' ? (
                                            <>
                                                <div>
                                                    <label className="block font-medium text-slate-500 mb-1">Date</label>
                                                    <input
                                                        type="date"
                                                        name="date"
                                                        value={editFormData.date}
                                                        onChange={handleEditChange}
                                                        className="w-full p-2 border rounded"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block font-medium text-slate-500 mb-1">Time</label>
                                                    <input
                                                        type="time"
                                                        name="time"
                                                        value={editFormData.time}
                                                        onChange={handleEditChange}
                                                        className="w-full p-2 border rounded"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block font-medium text-slate-500 mb-1">Guests</label>
                                                    <input
                                                        type="number"
                                                        name="guests"
                                                        value={editFormData.guests}
                                                        onChange={handleEditChange}
                                                        className="w-full p-2 border rounded"
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div>
                                                    <label className="block font-medium text-slate-500 mb-1">Check-in</label>
                                                    <input
                                                        type="date"
                                                        name="checkIn"
                                                        value={editFormData.checkIn}
                                                        onChange={handleEditChange}
                                                        className="w-full p-2 border rounded"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block font-medium text-slate-500 mb-1">Check-out</label>
                                                    <input
                                                        type="date"
                                                        name="checkOut"
                                                        value={editFormData.checkOut}
                                                        onChange={handleEditChange}
                                                        className="w-full p-2 border rounded"
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    booking.type === 'service' ? (
                                        <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 mb-4">
                                            <div>
                                                <p className="font-medium text-slate-500">Date</p>
                                                <p>{new Date(booking.date).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-500">Time</p>
                                                <p>{booking.time}</p>
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-500">Guests</p>
                                                <p>{booking.guests}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 mb-4">
                                            <div>
                                                <p className="font-medium text-slate-500">Check-in</p>
                                                <p>{new Date(booking.checkIn).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-500">Check-out</p>
                                                <p>{new Date(booking.checkOut).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    )
                                )}

                                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                                    <p className="text-lg font-bold text-primary">
                                        {booking.type === 'service'
                                            ? (booking.totalPrice > 0 ? `Total: ₹${booking.totalPrice.toLocaleString('en-IN')}` : 'Free Service')
                                            : `Total: ₹${booking.totalPrice.toLocaleString('en-IN')}`
                                        }
                                    </p>
                                    <div className="flex gap-3">
                                        {editingBookingId === booking.id ? (
                                            <>
                                                <button
                                                    onClick={() => saveEdit(booking.id)}
                                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={cancelEdit}
                                                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors text-sm font-medium"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => startEdit(booking)}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleCancelBooking(booking.id)}
                                                    className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                                                >
                                                    Cancel Booking
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Bookings;
