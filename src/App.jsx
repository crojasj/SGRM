import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

// Layout
import Sidebar from './components/shared/Sidebar';
import Navbar from './components/shared/Navbar';

// Pages
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import Products from './components/inventory/Products';
import MaintenanceList from './components/maintenance/MaintenanceList';
import NotificationCenter from './components/notifications/NotificationCenter';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
        <Navbar />
        <main className="p-4 flex-grow-1" style={{ overflowY: 'auto', height: 'calc(100vh - 60px)' }}>
          {children}
        </main>
      </div>
      <NotificationCenter />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Rutas protegidas */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute allowedRoles={['Administrador', 'Supervisor', 'Técnico', 'Adquisiciones']}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/inventory" 
              element={
                <ProtectedRoute allowedRoles={['Administrador', 'Adquisiciones', 'Técnico']}>
                  <Products />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/maintenance" 
              element={
                <ProtectedRoute allowedRoles={['Administrador', 'Supervisor', 'Técnico']}>
                  <MaintenanceList />
                </ProtectedRoute>
              } 
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
