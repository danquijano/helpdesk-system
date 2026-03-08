import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import ticketService, { Ticket, Comment } from '../../services/ticket.service';
import authService from '../../services/auth.service';

const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const user = authService.getCurrentUser();
  const isTechnician = user?.role === 'technician' || user?.role === 'admin';
  const canComment = isTechnician || (user?.role === 'employee' && ticket?.createdBy === user?.id);

  useEffect(() => {
    loadTicket();
  }, [id]);

  const loadTicket = async () => {
    try {
      setLoading(true);
      const data = await ticketService.getTicketById(Number(id));
      setTicket(data);
    } catch (err) {
      setError('Error loading ticket');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket || !newComment.trim()) return;

    setSubmitting(true);
    try {
      await ticketService.addComment(ticket.id, newComment);
      setNewComment('');
      await loadTicket(); // Reload to get new comment
    } catch (err) {
      setError('Error adding comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!ticket) return;

    try {
      await ticketService.updateStatus(ticket.id, newStatus);
      await loadTicket();
    } catch (err) {
      setError('Error updating status');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading ticket...</div>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-100 text-red-700 p-4 rounded">
            {error || 'Ticket not found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/tickets')}
          className="mb-4 text-blue-500 hover:text-blue-700 flex items-center gap-1"
        >
          ← Back to Tickets
        </button>

        {/* Ticket Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Ticket #{ticket.id}: {ticket.title}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Created on {new Date(ticket.createdAt).toLocaleString()}
              </p>
            </div>
            <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(ticket.status)}`}>
              {ticket.status}
            </span>
          </div>

          <div className="border-t pt-4">
            <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Priority:</span>{' '}
              <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Category:</span>{' '}
              <span className="text-gray-900">{ticket.category}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Assigned to:</span>{' '}
              <span className="text-gray-900">{ticket.assignedTo || 'Unassigned'}</span>
            </div>
          </div>

          {/* Status Actions for Technicians */}
          {isTechnician && (
            <div className="mt-6 pt-4 border-t">
              <h3 className="font-medium text-gray-900 mb-3">Update Status</h3>
              <div className="flex flex-wrap gap-2">
                {['open', 'in progress', 'resolved', 'closed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={ticket.status === status}
                    className={`px-4 py-2 rounded text-sm ${
                      ticket.status === status
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Comments ({ticket.comments.length})
          </h2>

          {/* Comments List */}
          <div className="space-y-4 mb-6">
            {ticket.comments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No comments yet</p>
            ) : (
              ticket.comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 p-4 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-900">
                      {comment.userName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {comment.comment}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Add Comment Form */}
          {canComment && (
            <form onSubmit={handleAddComment} className="border-t pt-4">
              <h3 className="font-medium text-gray-900 mb-3">Add a Comment</h3>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="w-full p-3 border rounded focus:outline-none focus:border-blue-500"
                placeholder="Write your comment here..."
                disabled={submitting}
              />
              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={!newComment.trim() || submitting}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {submitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;