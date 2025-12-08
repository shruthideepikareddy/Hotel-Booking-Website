import { Link } from 'react-router-dom';
import { FaUser, FaExpand } from 'react-icons/fa';

const RoomCard = ({ room }) => {
    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 group border border-slate-100">
            <div className="relative h-56 overflow-hidden">
                <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
                <div className="absolute top-4 right-4 bg-darkest/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold text-white shadow-lg">
                    ₹{room.price.toLocaleString('en-IN')}/night
                </div>
            </div>
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-darkest mb-1 group-hover:text-primary transition">{room.name}</h3>
                        <span className="inline-block bg-lightest text-dark px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider">
                            {room.type}
                        </span>
                    </div>
                </div>
                <p className="text-slate-600 mb-6 line-clamp-2 text-sm leading-relaxed">{room.description}</p>
                <div className="flex items-center gap-6 mb-6 text-sm text-slate-500 border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-2">
                        <FaUser className="text-primary" />
                        <span>{room.capacity} Guests</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaExpand className="text-primary" />
                        <span>{room.amenities.length} Amenities</span>
                    </div>
                </div>
                <Link
                    to={`/rooms/${room.id}`}
                    className="block w-full bg-primary text-white text-center py-3 rounded-xl hover:bg-dark transition font-bold shadow-md hover:shadow-lg"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default RoomCard;
