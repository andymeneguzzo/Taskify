import React, { createContext, useState, useContext } from 'react';
import '../styles/Toast.css';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    
    // Auto hide after 5 seconds
    setTimeout(() => {
      setToast({ visible: false, message: '', type: 'success' });
    }, 5000);
  };

  const hideToast = () => {
    setToast({ visible: false, message: '', type: 'success' });
  };

  return (
    <ToastContext.Provider value={{ toast, showToast, hideToast }}>
      {children}
      {toast.visible && (
        <div className={`toast-container ${toast.type}`}>
          <div className="toast-message">{toast.message}</div>
          <button className="toast-close" onClick={hideToast}>×</button>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
