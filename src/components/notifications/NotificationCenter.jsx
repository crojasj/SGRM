import React from 'react';
import { useAppContext } from '../../context/AppContext';
import Toast from './Toast';

const NotificationCenter = () => {
  const { notifications } = useAppContext();

  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1100 }}>
      {notifications.map(notif => (
        <Toast key={notif.id} notification={notif} />
      ))}
    </div>
  );
};

export default NotificationCenter;
