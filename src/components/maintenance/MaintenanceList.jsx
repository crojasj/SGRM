import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { FaPlus, FaCheckCircle, FaTools, FaPause } from 'react-icons/fa';
import Modal from '../shared/Modal';

const MaintenanceList = () => {
  const { maintenances, addMaintenance, updateMaintenanceStatus, products, updateProduct } = useAppContext();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ equipment: '', description: '', priority: 'Media' });

  const isSupervisor = user?.role === 'Supervisor' || user?.role === 'Administrador';
  const isTechnician = user?.role === 'Técnico' || user?.role === 'Administrador';

  const handleSubmit = (e) => {
    e.preventDefault();
    addMaintenance({ ...formData, createdBy: user.name });
    setShowModal(false);
    setFormData({ equipment: '', description: '', priority: 'Media' });
  };

  const handleStatusChange = (id, newStatus) => {
    updateMaintenanceStatus(id, newStatus);
  };

  const handleReserveMaterial = (maintId, productId, qty) => {
    const product = products.find(p => p.id === productId);
    if (product && (product.quantity - product.reserved) >= qty) {
      updateProduct({ ...product, reserved: product.reserved + qty });
      alert('Material reservado con éxito');
    } else {
      alert('Stock insuficiente para reserva');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Gestión de Mantenciones</h2>
        {isSupervisor && (
          <button className="btn btn-primary-custom" onClick={() => setShowModal(true)}>
            <FaPlus className="me-2" />
            Nueva Solicitud
          </button>
        )}
      </div>

      <div className="row">
        {maintenances.map(m => (
          <div key={m.id} className="col-md-6 mb-4">
            <div className="card card-dashboard p-3">
              <div className="d-flex justify-content-between">
                <h5 className="fw-bold">OT-{m.id}: {m.equipment}</h5>
                <span className={`badge ${m.status === 'Finalizada' ? 'bg-success' : 'bg-warning text-dark'}`}>
                  {m.status}
                </span>
              </div>
              <p className="text-muted mt-2 mb-1">{m.description}</p>
              <small className="d-block mb-3">Prioridad: <strong>{m.priority}</strong> | Solicitado por: {m.createdBy}</small>
              
              {isTechnician && m.status !== 'Finalizada' && (
                <div className="d-flex gap-2">
                  {m.status === 'Creada' && (
                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleStatusChange(m.id, 'En evaluación')}>
                      <FaTools className="me-1"/> Evaluar
                    </button>
                  )}
                  {m.status === 'En evaluación' && (
                    <>
                      <button className="btn btn-sm btn-outline-warning" onClick={() => handleStatusChange(m.id, 'Esperando materiales')}>
                        <FaPause className="me-1"/> Faltan Mat.
                      </button>
                      <button className="btn btn-sm btn-outline-success" onClick={() => handleStatusChange(m.id, 'Finalizada')}>
                        <FaCheckCircle className="me-1"/> Finalizar
                      </button>
                    </>
                  )}
                  {m.status === 'Esperando materiales' && (
                    <button className="btn btn-sm btn-outline-info" onClick={() => handleReserveMaterial(m.id, products[0]?.id, 1)}>
                      Reservar Material (Ejemplo)
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal show={showModal} title="Nueva Solicitud de Mantención" onClose={() => setShowModal(false)}>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Equipo</label>
            <input type="text" className="form-control" value={formData.equipment} onChange={e => setFormData({...formData, equipment: e.target.value})} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Descripción de Falla</label>
            <textarea className="form-control" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label">Prioridad</label>
            <select className="form-select" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
              <option>Baja</option>
              <option>Media</option>
              <option>Alta</option>
              <option>Crítica</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary-custom w-100">Generar Solicitud</button>
        </form>
      </Modal>
    </div>
  );
};

export default MaintenanceList;
