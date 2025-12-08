import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRoom, createBooking } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FaUser, FaExpand, FaCheck } from 'react-icons/fa';

const RoomDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const response = await getRoom(id);
                setRoom(response.data);
            } catch (error) {
                console.error('Error fetching room:', error);
                showToast('Failed to load room details', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchRoom();
    }, [id]);

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!user) {
            showToast('Please login to book a room', 'info');
            navigate('/login');
            return;
        }

        if (!checkIn || !checkOut) {
            showToast('Please select check-in and check-out dates', 'error');
            return;
        }

        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 0) {
            showToast('Check-out date must be after check-in date', 'error');
            return;
        }

        const totalPrice = diffDays * room.price;

        try {
            await createBooking({
                userId: user.id,
                roomId: room.id,
                checkIn,
                checkOut,
                totalPrice,
                pricePerNight: room.price,
                status: 'Confirmed',
                roomName: room.name,
                roomImage: room.image
            });
            showToast('Booking confirmed successfully!', 'success');
            navigate('/bookings');
        } catch (error) {
            console.error('Booking failed:', error);
            showToast('Failed to create booking', 'error');
        }
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (!room) return <div className="text-center py-20">Room not found</div>;

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <div className="rounded-2xl overflow-hidden shadow-lg h-[400px]">
                    <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800 mb-2">{room.name}</h1>
                            <span className="bg-blue-100 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                                {room.type}
                            </span>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-bold text-primary">₹{room.price.toLocaleString('en-IN')}</p>
                            <p className="text-slate-500">per night</p>
                        </div>
                    </div>

                    <p className="text-slate-600 text-lg mb-8 leading-relaxed">{room.description}</p>

                    <h3 className="text-xl font-bold mb-4">Amenities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {room.amenities.map((amenity, index) => (
                            <div key={index} className="flex items-center gap-2 text-slate-600">
                                <FaCheck className="text-green-500" />
                                <span>{amenity}</span>
                            </div>
                        ))}
                        <div className="flex items-center gap-2 text-slate-600">
                            <FaUser className="text-primary" />
                            <span>Up to {room.capacity} Guests</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-xl shadow-lg sticky top-24 border border-slate-100">
                    <h3 className="text-xl font-bold mb-6 text-center">Book This Room</h3>
                    <form onSubmit={handleBooking} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Check-in Date</label>
                            <input
                                type="date"
                                value={checkIn}
                                min={today}
                                onChange={(e) => setCheckIn(e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Check-out Date</label>
                            <input
                                type="date"
                                value={checkOut}
                                min={checkIn || today}
                                onChange={(e) => setCheckOut(e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                required
                            />
                        </div>

                        <div className="pt-4 border-t border-slate-100 mt-4">
                            <button
                                type="submit"
                                className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-secondary transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                Confirm Booking
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RoomDetails;
