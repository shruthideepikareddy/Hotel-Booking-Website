import { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const Toast = ({ message, type = 'info', onClose }) => {

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        // Cleanup: Clear the timer if component unmounts early
        return () => clearTimeout(timer);
    }, [onClose]);

    // Choose icon and colors based on toast type
    const getToastStyle = () => {
        switch (type) {
            case 'success':
                return {
                    icon: <FaCheckCircle className="text-green-500 text-xl" />,
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200',
                    textColor: 'text-green-800'
                };
            case 'error':
                return {
                    icon: <FaExclamationCircle className="text-red-500 text-xl" />,
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200',
                    textColor: 'text-red-800'
                };
            case 'info':
            default:
                return {
                    icon: <FaInfoCircle className="text-blue-500 text-xl" />,
                    bgColor: 'bg-blue-50',
                    borderColor: 'border-blue-200',
                    textColor: 'text-blue-800'
                };
        }
    };

    const style = getToastStyle();

    return (
        <div className={`${style.bgColor} ${style.borderColor} border-l-4 p-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-md animate-slide-in`}>
            {/* Icon */}
            {style.icon}

            {/* Message */}
            <p className={`${style.textColor} flex-1 font-medium`}>{message}</p>

            {/* Close Button */}
            <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition"
            >
                <FaTimes />
            </button>
        </div>
    );
};

export default Toast;
