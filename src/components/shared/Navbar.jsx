import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { FaBell } from 'react-icons/fa';

const Navbar = () => {
  const { notifications } = useAppContext();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm px-4 py-2" style={{ height: '60px' }}>
      <div className="container-fluid d-flex justify-content-end">
        <div className="d-flex align-items-center">
          <div className="position-relative me-3" style={{ cursor: 'pointer' }}>
            <FaBell size={20} className="text-muted" />
            {unreadCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65em' }}>
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
