const ticketModel = require('../models/Ticket.model');

const getDashboardStats = (req, res) => {
  try {
    const tickets = ticketModel.getAllTickets();
    const user = req.user;
    
    // Filter tickets based on user role
    let userTickets = tickets;
    if (user.role === 'employee') {
      userTickets = tickets.filter(t => t.createdBy === user.id);
    }
    
    // Calculate statistics
    const stats = {
      totalTickets: userTickets.length,
      byStatus: {
        open: userTickets.filter(t => t.status === 'open').length,
        inProgress: userTickets.filter(t => t.status === 'in progress').length,
        resolved: userTickets.filter(t => t.status === 'resolved').length,
        closed: userTickets.filter(t => t.status === 'closed').length
      },
      byPriority: {
        low: userTickets.filter(t => t.priority === 'low').length,
        medium: userTickets.filter(t => t.priority === 'medium').length,
        high: userTickets.filter(t => t.priority === 'high').length,
        critical: userTickets.filter(t => t.priority === 'critical').length
      },
      recentTickets: userTickets
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
    };
    
    // Add technician-specific stats
    if (user.role === 'technician' || user.role === 'admin') {
      stats.assignedToMe = tickets.filter(t => t.assignedTo === user.id).length;
      stats.unassigned = tickets.filter(t => !t.assignedTo).length;
    }
    
    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching dashboard stats' });
  }
};

module.exports = {
  getDashboardStats
};