import React from 'react';
import { useAppContext } from '../../context/AppContext';

const Toast = ({ notification }) => {
  const bgColor = notification.type === 'error' ? 'bg-danger' : 
                  notification.type === 'warning' ? 'bg-warning text-dark' : 'bg-success';

  return (
    <div className={`toast show align-items-center text-white border-0 ${bgColor} mb-2`} role="alert" aria-live="assertive" aria-atomic="true">
      <div className="d-flex">
        <div className="toast-body">
          {notification.message}
        </div>
        <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  );
};

export default Toast;
