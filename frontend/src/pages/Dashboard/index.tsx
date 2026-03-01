import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import authService from '../../services/auth.service';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">
            Welcome, {user?.name}!
          </h2>
          <p className="text-gray-600 mb-6">
            You are logged in as <span className="font-semibold">{user?.role}</span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/tickets/new')}
                  className="w-full text-left px-4 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                >
                  ➕ Create New Ticket
                </button>
                <button
                  onClick={() => navigate('/tickets')}
                  className="w-full text-left px-4 py-2 bg-gray-50 text-gray-700 rounded hover:bg-gray-100"
                >
                  📋 View All Tickets
                </button>
              </div>
            </div>

            {/* Stats (placeholder) */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Quick Stats</h3>
              <p className="text-gray-600">Coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;