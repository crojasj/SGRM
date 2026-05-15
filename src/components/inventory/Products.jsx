import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Modal from '../shared/Modal';

const Products = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useAppContext();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    code: '', name: '', description: '', type: 'Repuesto', quantity: 0, minStock: 0
  });

  const canEdit = ['Administrador', 'Adquisiciones'].includes(user?.role);

  const handleOpenModal = (product = null) => {
    if (product) {
      setFormData(product);
      setEditingId(product.id);
    } else {
      setFormData({ code: '', name: '', description: '', type: 'Repuesto', quantity: 0, minStock: 0 });
      setEditingId(null);
    }
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateProduct({ ...formData, id: editingId });
    } else {
      addProduct(formData);
    }
    setShowModal(false);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Inventario de Repuestos</h2>
        {canEdit && (
          <button className="btn btn-primary-custom" onClick={() => handleOpenModal()}>
            <FaPlus className="me-2" />
            Nuevo Producto
          </button>
        )}
      </div>

      <div className="card card-dashboard">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Stock Total</th>
                <th>Reservado</th>
                <th>Disponible</th>
                {canEdit && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {products.map(p => {
                const available = p.quantity - p.reserved;
                const isCritical = available <= p.minStock;
                
                return (
                  <tr key={p.id} className={isCritical ? 'table-warning' : ''}>
                    <td>{p.code}</td>
                    <td>{p.name}</td>
                    <td>{p.type}</td>
                    <td>{p.quantity}</td>
                    <td>{p.reserved}</td>
                    <td><span className={`badge ${isCritical ? 'bg-danger' : 'bg-success'}`}>{available}</span></td>
                    {canEdit && (
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleOpenModal(p)}>
                          <FaEdit />
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => deleteProduct(p.id)}>
                          <FaTrash />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal show={showModal} title={editingId ? 'Editar Producto' : 'Nuevo Producto'} onClose={() => setShowModal(false)}>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Código</label>
            <input type="text" className="form-control" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div className="row mb-3">
            <div className="col-6">
              <label className="form-label">Cantidad</label>
              <input type="number" className="form-control" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} required />
            </div>
            <div className="col-6">
              <label className="form-label">Stock Mínimo</label>
              <input type="number" className="form-control" value={formData.minStock} onChange={e => setFormData({...formData, minStock: parseInt(e.target.value)})} required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary-custom w-100">Guardar</button>
        </form>
      </Modal>
    </div>
  );
};

export default Products;
