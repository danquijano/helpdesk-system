import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import ticketService from '../../services/ticket.service';

const CreateTicket: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'software'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await ticketService.createTicket(formData);
      navigate('/tickets');
    } catch (err) {
      setError('Error creating ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Create New Ticket</h1>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
              placeholder="e.g., Cannot access email"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
              placeholder="Describe the issue in detail..."
            />
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="software">Software</option>
                <option value="hardware">Hardware</option>
                <option value="network">Network</option>
                <option value="access">Access / Permissions</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;