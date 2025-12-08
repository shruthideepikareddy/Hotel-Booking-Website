import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSun, FaCloud, FaCloudRain } from 'react-icons/fa';

const WeatherWidget = () => {
    // Step 1: Create state to store the weather data
    const [temperature, setTemperature] = useState(null);
    const [weatherCode, setWeatherCode] = useState(null);
    const [loading, setLoading] = useState(true);

    // Step 2: Fetch weather data when component loads
    useEffect(() => {
        const getWeather = async () => {
            try {
                // Call the Open-Meteo API for Goa's weather
                const response = await axios.get(
                    'https://api.open-meteo.com/v1/forecast?latitude=15.2993&longitude=74.1240&current_weather=true'
                );

                // Extract the data we need
                const currentWeather = response.data.current_weather;
                setTemperature(currentWeather.temperature);
                setWeatherCode(currentWeather.weathercode);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch weather:', error);
                setLoading(false);
            }
        };

        getWeather();
    }, []); // Empty array means: run only once when component loads

    // Step 3: Function to pick the right icon based on weather code
    const getWeatherIcon = () => {
        if (weatherCode === 0 || weatherCode === 1) {
            return <FaSun className="text-yellow-400 text-4xl" />;
        } else if (weatherCode === 2 || weatherCode === 3) {
            return <FaCloud className="text-gray-400 text-4xl" />;
        } else {
            return <FaCloudRain className="text-blue-400 text-4xl" />;
        }
    };

    // Step 4: Function to convert weather code to text
    const getWeatherText = () => {
        if (weatherCode === 0) return 'Clear Sky';
        if (weatherCode === 1) return 'Mainly Clear';
        if (weatherCode === 2) return 'Partly Cloudy';
        if (weatherCode === 3) return 'Overcast';
        return 'Rainy';
    };

    // Don't show anything while loading
    if (loading) return null;

    // Step 5: Display the weather widget
    return (
        <div className="absolute top-4 right-4 z-20 bg-white/20 backdrop-blur-md p-4 rounded-xl border border-white/30 text-white shadow-lg">
            <div className="flex items-center gap-4">
                {/* Weather Icon */}
                {getWeatherIcon()}

                {/* Weather Info */}
                <div>
                    <p className="text-2xl font-bold">{temperature}°C</p>
                    <p className="text-sm font-medium">{getWeatherText()}</p>
                    <p className="text-xs opacity-75 mt-1">Goa, India</p>
                </div>
            </div>
        </div>
    );
};

export default WeatherWidget;
