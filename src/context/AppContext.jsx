import React, { createContext, useState, useContext, useEffect } from 'react';
import { getStorageData, setStorageData, initStorage } from '../services/storage';
import { sendEmailAlert } from '../services/emailService';
import { sendWhatsAppAlert } from '../services/whatsappService';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

const initialData = {
  products: [
    { id: '1', code: 'P001', name: 'Filtro de Aceite', description: 'Filtro estándar', type: 'Repuesto', quantity: 50, reserved: 0, minStock: 10 },
    { id: '2', code: 'P002', name: 'Bomba de Agua', description: 'Bomba centrífuga', type: 'Equipo', quantity: 5, reserved: 2, minStock: 2 }
  ],
  maintenances: [],
  notifications: []
};

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(() => initStorage(initialData));

  // Actualizar LocalStorage cuando data cambie
  useEffect(() => {
    setStorageData(data);
  }, [data]);

  // Verificar Stock Crítico y Alertas
  useEffect(() => {
    if (data && data.products) {
      data.products.forEach(product => {
        const available = product.quantity - product.reserved;
        if (available <= 0) {
          // sendEmailAlert(product); // Comentado para evitar errores si no hay credenciales
          // sendWhatsAppAlert(product); // Comentado para evitar popups molestos
        }
      });
    }
  }, [data.products]);

  // Funciones CRUD Productos
  const addProduct = (product) => {
    setData(prev => ({ ...prev, products: [...prev.products, { ...product, id: Date.now().toString(), reserved: 0 }] }));
  };

  const updateProduct = (updatedProduct) => {
    setData(prev => ({
      ...prev,
      products: prev.products.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    }));
  };

  const deleteProduct = (id) => {
    setData(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== id)
    }));
  };

  // Funciones CRUD Mantenciones
  const addMaintenance = (maintenance) => {
    setData(prev => ({
      ...prev,
      maintenances: [...prev.maintenances, { ...maintenance, id: Date.now().toString(), status: 'Creada', createdAt: new Date().toISOString() }]
    }));
  };

  const updateMaintenanceStatus = (id, newStatus) => {
    setData(prev => ({
      ...prev,
      maintenances: prev.maintenances.map(m => m.id === id ? { ...m, status: newStatus } : m)
    }));
  };

  // Funciones Notificaciones
  const addNotification = (message, type = 'info') => {
    const newNotif = { id: Date.now().toString(), message, type, read: false };
    setData(prev => ({ ...prev, notifications: [newNotif, ...prev.notifications] }));
  };

  return (
    <AppContext.Provider value={{ 
      products: data.products, 
      maintenances: data.maintenances, 
      notifications: data.notifications,
      addProduct, updateProduct, deleteProduct,
      addMaintenance, updateMaintenanceStatus,
      addNotification
    }}>
      {children}
    </AppContext.Provider>
  );
};
