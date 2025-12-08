import { useState, useEffect } from 'react';
import { getRooms } from '../services/api';
import RoomCard from '../components/RoomCard';
import { FaSearch } from 'react-icons/fa';

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState(''); // NEW: Track search input
    const [priceRange, setPriceRange] = useState('All'); // NEW: Track price range filter
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await getRooms();
                setRooms(response.data);
                setFilteredRooms(response.data);
            } catch (error) {
                console.error('Error fetching rooms:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, []);

    // UPDATED: Combine search + type filter + price range filter
    useEffect(() => {
        let results = rooms;

        // Step 1: Filter by room type (if not "All")
        if (filter !== 'All') {
            results = results.filter(room => room.type === filter);
        }

        // Step 2: Filter by search query (name or description)
        if (searchQuery.trim() !== '') {
            results = results.filter(room => {
                const searchLower = searchQuery.toLowerCase();
                const nameMatch = room.name.toLowerCase().includes(searchLower);
                const descMatch = room.description.toLowerCase().includes(searchLower);
                return nameMatch || descMatch; // Return true if either matches
            });
        }

        // Step 3: Filter by price range
        if (priceRange !== 'All') {
            results = results.filter(room => {
                const price = room.price;
                switch (priceRange) {
                    case 'Budget':
                        return price < 15000; // Under ₹15,000
                    case 'Mid-Range':
                        return price >= 15000 && price < 40000; // ₹15,000 - ₹40,000
                    case 'Luxury':
                        return price >= 40000 && price < 80000; // ₹40,000 - ₹80,000
                    case 'Ultra-Luxury':
                        return price >= 80000; // ₹80,000+
                    default:
                        return true;
                }
            });
        }

        setFilteredRooms(results);
    }, [filter, searchQuery, priceRange, rooms]); // Re-run when any of these change

    if (loading) {
        return <div className="text-center py-20">Loading rooms...</div>;
    }

    const roomTypes = ['All', ...new Set(rooms.map(room => room.type))];

    return (
        <div>
            <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-slate-800">Our Rooms</h1>

                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                    {/* NEW: Search Input */}
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 flex-1 md:flex-initial">
                        <FaSearch className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search rooms..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none focus:ring-0 text-slate-600 outline-none w-full md:w-64"
                        />
                    </div>

                    {/* Existing Type Filter */}
                    <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border border-slate-200">
                        <FaSearch className="text-slate-400 ml-2" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="bg-transparent border-none focus:ring-0 text-slate-600 font-medium outline-none cursor-pointer"
                        >
                            {roomTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    {/* NEW: Price Range Filter */}
                    <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border border-slate-200">
                        <select
                            value={priceRange}
                            onChange={(e) => setPriceRange(e.target.value)}
                            className="bg-transparent border-none focus:ring-0 text-slate-600 font-medium outline-none cursor-pointer"
                        >
                            <option value="All">All Prices</option>
                            <option value="Budget">Budget (&lt; ₹15k)</option>
                            <option value="Mid-Range">Mid-Range (₹15k - ₹40k)</option>
                            <option value="Luxury">Luxury (₹40k - ₹80k)</option>
                            <option value="Ultra-Luxury">Ultra-Luxury (₹80k+)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredRooms.map(room => (
                    <RoomCard key={room.id} room={room} />
                ))}
            </div>
        </div>
    );
};

export default Rooms;
