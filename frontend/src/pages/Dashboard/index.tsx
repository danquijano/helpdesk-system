import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import authService from '../../services/auth.service';
import statsService, { DashboardStats } from '../../services/stats.service';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await statsService.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError('Error loading dashboard stats');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-yellow-100 text-yellow-800';
      case 'in progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const StatCard = ({ title, value, color = 'blue' }: { title: string; value: number; color?: string }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
      <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.name}!
          </h1>
          <p className="text-gray-600">
            You are logged in as <span className="font-semibold capitalize">{user?.role}</span>
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
            {error}
          </div>
        )}

        {stats && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard title="Total Tickets" value={stats.totalTickets} color="blue" />
              <StatCard title="Open" value={stats.byStatus.open} color="yellow" />
              <StatCard title="In Progress" value={stats.byStatus.inProgress} color="blue" />
              <StatCard title="Resolved" value={stats.byStatus.resolved} color="green" />
              
              {(user?.role === 'technician' || user?.role === 'admin') && (
                <>
                  <StatCard title="Assigned to Me" value={stats.assignedToMe || 0} color="purple" />
                  <StatCard title="Unassigned" value={stats.unassigned || 0} color="orange" />
                </>
              )}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Status Distribution */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Tickets by Status</h2>
                <div className="space-y-3">
                  {Object.entries(stats.byStatus).map(([status, count]) => (
                    <div key={status}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize">{status}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            status === 'open' ? 'bg-yellow-500' :
                            status === 'inProgress' ? 'bg-blue-500' :
                            status === 'resolved' ? 'bg-green-500' :
                            'bg-gray-500'
                          }`}
                          style={{ width: `${stats.totalTickets ? (count / stats.totalTickets) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Priority Distribution */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Tickets by Priority</h2>
                <div className="space-y-3">
                  {Object.entries(stats.byPriority).map(([priority, count]) => (
                    <div key={priority}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize">{priority}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            priority === 'critical' ? 'bg-red-500' :
                            priority === 'high' ? 'bg-orange-500' :
                            priority === 'medium' ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${stats.totalTickets ? (count / stats.totalTickets) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Tickets */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Tickets</h2>
                <button
                  onClick={() => navigate('/tickets')}
                  className="text-sm text-blue-500 hover:text-blue-700"
                >
                  View All →
                </button>
              </div>
              
              <div className="space-y-3">
                {stats.recentTickets.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No recent tickets</p>
                ) : (
                  stats.recentTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      onClick={() => navigate(`/tickets/${ticket.id}`)}
                      className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            #{ticket.id} - {ticket.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(ticket.status)}`}>
                            {ticket.status}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/tickets/new')}
                    className="w-full text-left px-4 py-3 bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                  >
                    ➕ Create New Ticket
                  </button>
                  <button
                    onClick={() => navigate('/tickets')}
                    className="w-full text-left px-4 py-3 bg-gray-50 text-gray-700 rounded hover:bg-gray-100"
                  >
                    📋 View All Tickets
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h2>
                <p className="text-gray-600 mb-4">
                  Contact IT support for assistance with technical issues.
                </p>
                <div className="text-sm text-gray-500">
                  <p>📧 support@helpdesk.com</p>
                  <p>📞 ext. 1234</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;