import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validarRut } from '../../utils/rut';
import { sanitizeInput } from '../../utils/sanitize';

const mockUsers = [
  { rut: '11111111-1', name: 'Admin User', role: 'Administrador', password: 'password123' },
  { rut: '22222222-2', name: 'Super User', role: 'Supervisor', password: 'password123' },
  { rut: '33333333-3', name: 'Tech User', role: 'Técnico', password: 'password123' },
  { rut: '44444444-4', name: 'Adq User', role: 'Adquisiciones', password: 'password123' },
];

const Login = () => {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    const cleanRut = sanitizeInput(rut);
    const cleanPassword = sanitizeInput(password);

    if (!validarRut(cleanRut)) {
      setError('RUT inválido. Use formato 12345678-9');
      return;
    }

    const user = mockUsers.find(u => u.rut === cleanRut && u.password === cleanPassword);

    if (user) {
      const { password, ...userData } = user;
      login(userData);
      navigate('/');
    } else {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="text-center mb-4">
          <h2 className="text-magenta fw-bold">SGRM <span className="text-yellow">PRO</span></h2>
          <p className="text-muted">Sistema Inteligente de Gestión</p>
        </div>
        
        {error && <div className="alert alert-danger p-2 text-center">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">RUT</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="12345678-9"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
              required 
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Contraseña</label>
            <input 
              type="password" 
              className="form-control" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary-custom w-100 py-2 fw-bold">
            Ingresar al Sistema
          </button>
        </form>
        <div className="mt-3 text-center text-muted small">
          <p>Ruts de prueba: 11111111-1 (Admin), 22222222-2 (Sup), 33333333-3 (Tec), 44444444-4 (Adq)<br/>Pass: password123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
