import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gradient-to-r from-darkest to-dark text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 py-2 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0">
                {/* Logo - Always visible */}
                <Link to="/" className="flex items-center gap-2 text-lg md:text-xl font-bold tracking-wide hover:text-accent transition group">
                    <img src="/logo.png" alt="Blue River Hotel Logo" className="h-8 md:h-12 w-auto transition group-hover:scale-105" />
                    <span className="font-serif">Blue River</span>
                </Link>

                {/* Navigation Links - Responsive */}
                <div className="flex flex-wrap items-center justify-center gap-2 md:gap-8 w-full md:w-auto">
                    <NavLink to="/" className={({ isActive }) => `px-3 md:px-4 py-2 rounded-full transition-all duration-300 text-sm md:text-base ${isActive ? 'bg-accent text-darkest font-semibold shadow-lg transform scale-105' : 'text-white/90 hover:text-accent hover:bg-white/5'}`}>Home</NavLink>
                    <NavLink to="/rooms" className={({ isActive }) => `px-3 md:px-4 py-2 rounded-full transition-all duration-300 text-sm md:text-base ${isActive ? 'bg-accent text-darkest font-semibold shadow-lg transform scale-105' : 'text-white/90 hover:text-accent hover:bg-white/5'}`}>Rooms</NavLink>
                    {user ? (
                        <>
                            <NavLink to="/bookings" className={({ isActive }) => `px-3 md:px-4 py-2 rounded-full transition-all duration-300 text-sm md:text-base ${isActive ? 'bg-accent text-darkest font-semibold shadow-lg transform scale-105' : 'text-white/90 hover:text-accent hover:bg-white/5'}`}>My Bookings</NavLink>
                            <div className="flex items-center gap-2 md:gap-3 pl-0 md:pl-4 md:border-l border-white/20">
                                <span className="text-xs md:text-sm font-medium text-white/90 flex items-center gap-2">
                                    <FaUserCircle className="text-lg md:text-xl text-accent" />
                                    <span className="hidden sm:inline">{user.name}</span>
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="text-xs md:text-sm bg-white/10 hover:bg-white/20 px-2 md:px-3 py-1 rounded-md transition"
                                >
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-2 md:gap-4 pl-0 md:pl-4 md:border-l border-white/20">
                            <NavLink to="/login" className={({ isActive }) => `px-3 md:px-4 py-2 rounded-full transition-all duration-300 text-sm md:text-base ${isActive ? 'bg-accent text-darkest font-semibold shadow-lg transform scale-105' : 'text-white/90 hover:text-accent hover:bg-white/5'}`}>Login</NavLink>
                            <Link
                                to="/register"
                                className="bg-accent text-darkest px-3 md:px-5 py-2 rounded-full font-bold hover:bg-light-accent transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm md:text-base"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
