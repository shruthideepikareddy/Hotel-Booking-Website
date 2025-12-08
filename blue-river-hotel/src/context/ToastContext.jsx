import { createContext, useContext, useState } from 'react';
import Toast from '../components/Toast';


const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]); 

    const showToast = (message, type = 'info') => {
        const id = Date.now(); 
        const newToast = { id, message, type };

      
        setToasts(prevToasts => [...prevToasts, newToast]);
    };

   
    const removeToast = (id) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
                {}
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
};
