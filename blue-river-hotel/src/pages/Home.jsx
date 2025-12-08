import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSwimmingPool, FaWifi, FaUtensils, FaConciergeBell, FaChevronLeft, FaChevronRight, FaArrowRight } from 'react-icons/fa';
import WeatherWidget from '../components/WeatherWidget';
const heroImages = [
    "https://static.thehoneycombers.com/wp-content/uploads/sites/4/2015/11/BulgariResortBali_5.jpg",
    "https://assets.anantara.com/image/upload/q_auto,f_auto/media/minor/anantara/images/eastern-mangroves-hotels--spa-by-anantara/the-resort/desktop-banner/eastern_mangroves_by_anantara_exterior_1920x1080.jpg",
    "https://www.hotelsinheaven.com/wp-content/uploads/2020/06/Bulgari-Hotel-1500x842.jpg",
    "https://www.lifestyleandtravel.com/wp-content/uploads/2019/10/02.-GMPP.jpg"
];

const Home = () => {
    const navigate = useNavigate();
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextImage = () => {
        setCurrentImage((prev) => (prev + 1) % heroImages.length);
    };

    const prevImage = () => {
        setCurrentImage((prev) => (prev - 1 + heroImages.length) % heroImages.length);
    };

    return (
        <div className="space-y-16">
            {/* Hero Section */}
            <section className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl group">
                <WeatherWidget />
                {heroImages.map((img, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImage ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <img
                            src={img}
                            alt={`Slide ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-darkest/90 via-darkest/40 to-transparent" />
                    </div>
                ))}

                <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-8 z-10">
                    <h1 className="text-6xl font-bold mb-6 drop-shadow-2xl tracking-tight animate-fade-in-up">
                        Blue River Hotel
                    </h1>
                    <p className="text-2xl mb-8 max-w-2xl drop-shadow-lg font-light animate-fade-in-up delay-100">
                        Experience the ultimate luxury by the ocean.
                    </p>
                    <Link
                        to="/rooms"
                        className="bg-primary hover:bg-secondary text-white px-10 py-4 rounded-full text-xl font-semibold transition transform hover:scale-105 shadow-xl hover:shadow-primary/50 animate-fade-in-up delay-200"
                    >
                        Book Your Stay
                    </Link>
                </div>

                {/* Carousel Controls */}
                <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm transition opacity-0 group-hover:opacity-100 z-20"
                >
                    <FaChevronLeft size={24} />
                </button>
                <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm transition opacity-0 group-hover:opacity-100 z-20"
                >
                    <FaChevronRight size={24} />
                </button>

                {/* Indicators */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                    {heroImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentImage(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentImage ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
                                }`}
                        />
                    ))}
                </div>
            </section>

            {/* Facilities Section */}
            <section>
                <h2 className="text-4xl font-bold text-center mb-16 text-darkest">World Class Facilities</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 text-center group border border-white/50 hover:-translate-y-2">
                        <div className="w-20 h-20 bg-lightest rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary text-primary group-hover:text-white transition duration-300 shadow-inner">
                            <FaSwimmingPool className="text-4xl" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-dark">Infinity Pool</h3>
                        <p className="text-slate-600 leading-relaxed">Relax in our stunning ocean-view infinity pool.</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 text-center group border border-white/50 hover:-translate-y-2">
                        <div className="w-20 h-20 bg-lightest rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary text-primary group-hover:text-white transition duration-300 shadow-inner">
                            <FaWifi className="text-4xl" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-dark">High-Speed WiFi</h3>
                        <p className="text-slate-600 leading-relaxed">Stay connected with complimentary high-speed internet.</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 text-center group border border-white/50 hover:-translate-y-2">
                        <div className="w-20 h-20 bg-lightest rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary text-primary group-hover:text-white transition duration-300 shadow-inner">
                            <FaUtensils className="text-4xl" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-dark">Fine Dining</h3>
                        <p className="text-slate-600 leading-relaxed">Exquisite culinary experiences at our restaurant.</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 text-center group border border-white/50 hover:-translate-y-2">
                        <div className="w-20 h-20 bg-lightest rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary text-primary group-hover:text-white transition duration-300 shadow-inner">
                            <FaConciergeBell className="text-4xl" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-dark">24/7 Room Service</h3>
                        <p className="text-slate-600 leading-relaxed">Round-the-clock service for your convenience.</p>
                    </div>
                </div>
            </section>

            {/* Feature Sections */}
            <section className="space-y-24 py-16">
                {/* Private Beach Access */}
                <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 space-y-6">
                        <h2 className="text-4xl font-bold text-darkest">Private Beach Access</h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Enjoy exclusive access to our pristine private beach. Whether you want to soak up the sun, take a refreshing dip, or enjoy a romantic sunset walk, our private beach offers the perfect escape.
                        </p>
                        <button
                            onClick={() => navigate('/service-booking', {
                                state: {
                                    service: {
                                        name: 'Private Beach Access',
                                        description: 'Enjoy exclusive access to our pristine private beach. Whether you want to soak up the sun, take a refreshing dip, or enjoy a romantic sunset walk, our private beach offers the perfect escape.',
                                        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000',
                                        price: 500
                                    }
                                }
                            })}
                            className="inline-flex items-center gap-2 bg-darkest text-white px-8 py-3 rounded-full font-semibold hover:bg-dark transition shadow-lg hover:shadow-xl cursor-pointer"
                        >
                            Book Now <FaArrowRight />
                        </button>
                    </div>
                    <div className="flex-1 h-[400px] rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition duration-500">
                        <img
                            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000"
                            alt="Private Beach"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Heated Jacuzzi */}
                <div className="flex flex-col md:flex-row-reverse items-center gap-12">
                    <div className="flex-1 space-y-6">
                        <h2 className="text-4xl font-bold text-darkest">Heated Jacuzzi</h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Unwind in our luxurious heated jacuzzi with stunning views. Perfect for relaxation after a long day, our temperature-controlled jacuzzi provides the ultimate comfort and therapeutic experience.
                        </p>
                        <button
                            onClick={() => navigate('/service-booking', {
                                state: {
                                    service: {
                                        name: 'Heated Jacuzzi',
                                        description: 'Unwind in our luxurious heated jacuzzi with stunning views. Perfect for relaxation after a long day, our temperature-controlled jacuzzi provides the ultimate comfort and therapeutic experience.',
                                        image: 'https://a0.muscache.com/im/pictures/2b57605b-6a43-4bf5-995f-ff6afc858020.jpg?im_w=720',
                                        price: 1000
                                    }
                                }
                            })}
                            className="inline-flex items-center gap-2 bg-darkest text-white px-8 py-3 rounded-full font-semibold hover:bg-dark transition shadow-lg hover:shadow-xl cursor-pointer"
                        >
                            Book Now <FaArrowRight />
                        </button>
                    </div>
                    <div className="flex-1 h-[400px] rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition duration-500">
                        <img
                            src="https://a0.muscache.com/im/pictures/2b57605b-6a43-4bf5-995f-ff6afc858020.jpg?im_w=720"
                            alt="Heated Jacuzzi"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Gym Booking */}
                <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 space-y-6">
                        <h2 className="text-4xl font-bold text-darkest">Gym Booking</h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Stay fit with our state-of-the-art gym. Equipped with the latest cardio and strength training equipment, our gym has everything you need for a great workout.
                        </p>
                        <button
                            onClick={() => navigate('/service-booking', {
                                state: {
                                    service: {
                                        name: 'Gym Booking',
                                        description: 'Stay fit with our state-of-the-art gym. Equipped with the latest cardio and strength training equipment, our gym has everything you need for a great workout.',
                                        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1000',
                                        price: 300
                                    }
                                }
                            })}
                            className="inline-flex items-center gap-2 bg-darkest text-white px-8 py-3 rounded-full font-semibold hover:bg-dark transition shadow-lg hover:shadow-xl cursor-pointer"
                        >
                            Book Now <FaArrowRight />
                        </button>
                    </div>
                    <div className="flex-1 h-[400px] rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition duration-500">
                        <img
                            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1000"
                            alt="Gym"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Luxury Spa and Wellness */}
                <div className="flex flex-col md:flex-row-reverse items-center gap-12">
                    <div className="flex-1 space-y-6">
                        <h2 className="text-4xl font-bold text-darkest">Luxury Spa & Wellness</h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Rejuvenate your senses at our luxury spa. Choose from a wide range of treatments and massages designed to restore balance and harmony to your body and mind.
                        </p>
                        <button
                            onClick={() => navigate('/service-booking', {
                                state: {
                                    service: {
                                        name: 'Luxury Spa & Wellness',
                                        description: 'Rejuvenate your senses at our luxury spa. Choose from a wide range of treatments and massages designed to restore balance and harmony to your body and mind.',
                                        image: 'https://s31606.pcdn.co/wp-content/uploads/2021/01/iStock-913095166-scaled-e1610581460758.jpg',
                                        price: 2500
                                    }
                                }
                            })}
                            className="inline-flex items-center gap-2 bg-darkest text-white px-8 py-3 rounded-full font-semibold hover:bg-dark transition shadow-lg hover:shadow-xl cursor-pointer"
                        >
                            Book Now <FaArrowRight />
                        </button>
                    </div>
                    <div className="flex-1 h-[400px] rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition duration-500">
                        <img
                            src="https://s31606.pcdn.co/wp-content/uploads/2021/01/iStock-913095166-scaled-e1610581460758.jpg"
                            alt="Luxury Spa"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
