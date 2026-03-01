import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/auth.service';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-gray-800">HelpDesk</h1>
            <div className="flex space-x-4">
              <Link 
                to="/dashboard" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded"
              >
                Dashboard
              </Link>
              <Link 
                to="/tickets" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded"
              >
                Tickets
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              {user?.name} ({user?.role})
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;