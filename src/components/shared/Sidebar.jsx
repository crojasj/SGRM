import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaTachometerAlt, FaBoxOpen, FaTools, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  return (
    <div className="sidebar d-flex flex-column p-3" style={{ width: '250px' }}>
      <div className="d-flex align-items-center mb-4 px-2">
        <h3 className="text-magenta m-0 fw-bold">SGRM <span className="text-yellow">PRO</span></h3>
      </div>
      
      <div className="mb-4 px-2">
        <small className="text-muted d-block">Usuario Actual</small>
        <strong>{user?.name}</strong>
        <br />
        <span className="badge bg-secondary">{user?.role}</span>
      </div>

      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink to="/" className="nav-link" end>
            <FaTachometerAlt className="me-2" />
            Dashboard
          </NavLink>
        </li>
        {['Administrador', 'Adquisiciones', 'Técnico'].includes(user?.role) && (
          <li>
            <NavLink to="/inventory" className="nav-link">
              <FaBoxOpen className="me-2" />
              Inventario
            </NavLink>
          </li>
        )}
        {['Administrador', 'Supervisor', 'Técnico'].includes(user?.role) && (
          <li>
            <NavLink to="/maintenance" className="nav-link">
              <FaTools className="me-2" />
              Mantenciones
            </NavLink>
          </li>
        )}
      </ul>
      
      <hr />
      <div className="px-2">
        <a href="#" className="nav-link text-danger" onClick={handleLogout}>
          <FaSignOutAlt className="me-2" />
          Cerrar Sesión
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
