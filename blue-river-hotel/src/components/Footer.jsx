import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gradient-to-r from-darkest to-dark text-white mt-8">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* About Section */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <img src="/logo.png" alt="Blue River Hotel Logo" className="h-14 w-auto" />
                            <h3 className="text-xl font-bold font-serif">Blue River Hotel</h3>
                        </div>
                        <p className="text-white/70 text-sm leading-relaxed">
                            Experience luxury by the ocean. Your perfect getaway awaits with stunning views,
                            world-class amenities, and unforgettable memories.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-white/70 hover:text-accent transition text-sm">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/rooms" className="text-white/70 hover:text-accent transition text-sm">
                                    Our Rooms
                                </Link>
                            </li>
                            <li>
                                <Link to="/bookings" className="text-white/70 hover:text-accent transition text-sm">
                                    My Bookings
                                </Link>
                            </li>

                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-4">Contact Us</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-sm">
                                <FaMapMarkerAlt className="text-accent mt-1 flex-shrink-0" />
                                <span className="text-white/70">
                                    123 Ocean Drive, Goa 400001
                                </span>
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <FaPhone className="text-accent flex-shrink-0" />
                                <a href="tel:+919876543210" className="text-white/70 hover:text-accent transition">
                                    +91 98765 43210
                                </a>
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <FaEnvelope className="text-accent flex-shrink-0" />
                                <a href="mailto:info@blueriverhotel.com" className="text-white/70 hover:text-accent transition">
                                    info@blueriverhotel.com
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h4 className="text-lg font-bold mb-4">Follow Us</h4>
                        <p className="text-white/70 text-sm mb-4">
                            Stay connected with us on social media for updates and special offers.
                        </p>
                        <div className="flex gap-3">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/10 hover:bg-accent rounded-full flex items-center justify-center transition transform hover:scale-110"
                            >
                                <FaFacebookF className="text-sm" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/10 hover:bg-accent rounded-full flex items-center justify-center transition transform hover:scale-110"
                            >
                                <FaTwitter className="text-sm" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/10 hover:bg-accent rounded-full flex items-center justify-center transition transform hover:scale-110"
                            >
                                <FaInstagram className="text-sm" />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/10 hover:bg-accent rounded-full flex items-center justify-center transition transform hover:scale-110"
                            >
                                <FaLinkedinIn className="text-sm" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-6 mt-6">
                    <div className="flex justify-center items-center">
                        <p className="text-white/60 text-sm">
                            © {currentYear} Blue River Hotel. All rights reserved.
                        </p>

                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
