import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createBooking } from '../services/api';
import { FaCalendarAlt, FaClock, FaUsers, FaCheckCircle } from 'react-icons/fa';
import { useToast } from '../context/ToastContext';

const ServiceBooking = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const service = location.state?.service;

    const [formData, setFormData] = useState({
        date: '',
        time: '',
        guests: 1,
        specialRequests: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!service) {
            navigate('/');
        }
    }, [service, navigate]);

    if (!service) {
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            showToast('Please login to book a service', 'error');
            navigate('/login');
            return;
        }

        // Validate that the selected time hasn't passed for today
        const selectedDate = new Date(formData.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);

        // Check if the selected date is today
        if (selectedDate.getTime() === today.getTime()) {
            // Convert selected time to 24-hour format for comparison
            const timeStr = formData.time; // e.g., "08:00 AM" or "03:00 PM"
            const timeParts = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);

            if (timeParts) {
                let hours = parseInt(timeParts[1]);
                const minutes = parseInt(timeParts[2]);
                const period = timeParts[3].toUpperCase();

                // Convert to 24-hour format
                if (period === 'PM' && hours !== 12) {
                    hours += 12;
                } else if (period === 'AM' && hours === 12) {
                    hours = 0;
                }

                // Get current time
                const now = new Date();
                const currentHours = now.getHours();
                const currentMinutes = now.getMinutes();

                // Compare times
                const selectedTimeInMinutes = hours * 60 + minutes;
                const currentTimeInMinutes = currentHours * 60 + currentMinutes;

                if (selectedTimeInMinutes <= currentTimeInMinutes) {
                    showToast('Cannot book a service for a time that has already passed today. Please select a future time or a different date.', 'error');
                    setIsSubmitting(false);
                    return;
                }
            }
        }

        setIsSubmitting(true);

        try {
            const booking = {
                userId: user.id,
                serviceName: service.name,
                serviceImage: service.image,
                date: formData.date,
                time: formData.time,
                guests: formData.guests,
                specialRequests: formData.specialRequests,
                status: 'Confirmed',
                bookedAt: new Date().toISOString(),
                type: 'service', // Add type to distinguish from room bookings
                totalPrice: service.price * formData.guests,
                pricePerPerson: service.price
            };

            await createBooking(booking);
            showToast(`${service.name} booked successfully!`, 'success');

            // Redirect to bookings page after 1.5 seconds
            setTimeout(() => {
                navigate('/bookings');
            }, 1500);
        } catch (error) {
            console.error('Booking failed:', error);
            showToast('Failed to create booking', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const timeSlots = [
        '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
        '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
        '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM',
        '08:00 PM', '09:00 PM'
    ];

    return (
        <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Service Information */}
                <div className="space-y-6">
                    <div className="rounded-3xl overflow-hidden shadow-2xl">
                        <img
                            src={service.image}
                            alt={service.name}
                            className="w-full h-[400px] object-cover"
                        />
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/50">
                        <h1 className="text-4xl font-bold text-darkest mb-4">{service.name}</h1>
                        <p className="text-lg text-slate-600 leading-relaxed mb-6">
                            {service.description}
                        </p>
                        <div className="space-y-3 text-slate-700">
                            <div className="flex items-center gap-3">
                                <FaCheckCircle className="text-primary text-xl" />
                                <span>Professional staff available</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaCheckCircle className="text-primary text-xl" />
                                <span>Premium facilities and equipment</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaCheckCircle className="text-primary text-xl" />
                                <span>Complimentary refreshments</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaCheckCircle className="text-primary text-xl" />
                                <span>Flexible booking options</span>
                            </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-slate-200">
                            <p className="text-slate-600 mb-2">Price per person</p>
                            <p className="text-3xl font-bold text-primary">₹{service.price.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                </div>

                {/* Booking Form */}
                <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/50 h-fit sticky top-8">
                    <h2 className="text-3xl font-bold text-darkest mb-6">Book Your Experience</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Date Selection */}
                        <div>
                            <label className="flex items-center gap-2 text-slate-700 font-semibold mb-2">
                                <FaCalendarAlt className="text-primary" />
                                Select Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                min={getMinDate()}
                                required
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:outline-none transition"
                            />
                        </div>

                        {/* Time Selection */}
                        <div>
                            <label className="flex items-center gap-2 text-slate-700 font-semibold mb-2">
                                <FaClock className="text-primary" />
                                Select Time Slot
                            </label>
                            <select
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:outline-none transition"
                            >
                                <option value="">Choose a time</option>
                                {timeSlots.map((slot) => (
                                    <option key={slot} value={slot}>
                                        {slot}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Number of Guests */}
                        <div>
                            <label className="flex items-center gap-2 text-slate-700 font-semibold mb-2">
                                <FaUsers className="text-primary" />
                                Number of Guests
                            </label>
                            <input
                                type="number"
                                name="guests"
                                value={formData.guests}
                                onChange={handleChange}
                                min="1"
                                max="10"
                                required
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:outline-none transition"
                            />
                        </div>

                        {/* Special Requests */}
                        <div>
                            <label className="text-slate-700 font-semibold mb-2 block">
                                Special Requests (Optional)
                            </label>
                            <textarea
                                name="specialRequests"
                                value={formData.specialRequests}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Any special requirements or preferences..."
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:outline-none transition resize-none"
                            />
                        </div>

                        {/* Price Summary */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-slate-600">Price per person</span>
                                <span className="font-semibold">₹{service.price.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-slate-600">Guests</span>
                                <span className="font-semibold">{formData.guests}</span>
                            </div>
                            <div className="border-t border-slate-200 my-2 pt-2 flex justify-between items-center">
                                <span className="text-lg font-bold text-darkest">Total Price</span>
                                <span className="text-xl font-bold text-primary">₹{(service.price * formData.guests).toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition shadow-lg hover:shadow-xl transform hover:scale-[1.02] ${isSubmitting
                                ? 'bg-slate-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-primary to-secondary text-white hover:from-secondary hover:to-primary'
                                }`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                'Confirm Booking'
                            )}
                        </button>

                        {!user && (
                            <p className="text-center text-slate-600 text-sm">
                                Please <a href="/login" className="text-primary font-semibold hover:underline">login</a> to complete your booking
                            </p>
                        )}
                    </form>
                </div>
            </div >
        </div >
    );
};

export default ServiceBooking;
