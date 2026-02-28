import React from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth.service';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">HelpDesk</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                {user?.name} ({user?.role})
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Bienvenido al Dashboard</h2>
          <p>Has iniciado sesión correctamente como {user?.role}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;