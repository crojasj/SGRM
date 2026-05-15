import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { FaWrench, FaExclamationTriangle, FaBox, FaShoppingCart } from 'react-icons/fa';

const DashboardCard = ({ title, value, icon, color }) => (
  <div className="col-md-3 mb-4">
    <div className="card card-dashboard h-100 p-3">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h6 className="text-muted mb-2">{title}</h6>
          <h3 className="mb-0 fw-bold">{value}</h3>
        </div>
        <div className={`p-3 rounded-circle text-white`} style={{ backgroundColor: color }}>
          {icon}
        </div>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { products, maintenances } = useAppContext();

  // Cálculos del dashboard
  const openMaintenances = maintenances.filter(m => m.status !== 'Finalizada').length;
  const criticalStock = products.filter(p => (p.quantity - p.reserved) <= p.minStock).length;
  const reservedMaterials = products.reduce((acc, p) => acc + p.reserved, 0);
  const pendingPurchases = products.filter(p => p.quantity === 0).length;

  return (
    <div>
      <h2 className="mb-4 fw-bold">Dashboard</h2>
      
      <div className="row">
        <DashboardCard 
          title="Órdenes Abiertas" 
          value={openMaintenances} 
          icon={<FaWrench size={24} />} 
          color="#d1007f" 
        />
        <DashboardCard 
          title="Stock Crítico" 
          value={criticalStock} 
          icon={<FaExclamationTriangle size={24} />} 
          color="#ffd600" 
        />
        <DashboardCard 
          title="Mat. Reservados" 
          value={reservedMaterials} 
          icon={<FaBox size={24} />} 
          color="#17a2b8" 
        />
        <DashboardCard 
          title="Compras Pendientes" 
          value={pendingPurchases} 
          icon={<FaShoppingCart size={24} />} 
          color="#dc3545" 
        />
      </div>

      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card card-dashboard p-4">
            <h5 className="fw-bold mb-3">Alertas Recientes</h5>
            {criticalStock > 0 ? (
              <div className="alert alert-warning">
                <strong>Atención:</strong> Hay {criticalStock} productos en stock crítico.
              </div>
            ) : (
              <p className="text-muted">No hay alertas de stock en este momento.</p>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="card card-dashboard p-4">
            <h5 className="fw-bold mb-3">Mantenciones Recientes</h5>
            {maintenances.length > 0 ? (
              <ul className="list-group list-group-flush">
                {maintenances.slice(-3).reverse().map(m => (
                  <li key={m.id} className="list-group-item px-0">
                    <strong>OT-{m.id}</strong> - {m.equipment} <span className="badge bg-secondary float-end">{m.status}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No hay mantenciones registradas.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
