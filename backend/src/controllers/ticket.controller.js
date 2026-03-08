const ticketModel = require('../models/Ticket.model');

const getAllTickets = (req, res) => {
  try {
    const tickets = ticketModel.getAllTickets();

    if (req.user.role === 'employee') {
      const userTickets = tickets.filter(t => t.createdBy === req.user.id);
      return res.json(userTickets);
    }

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tickets' });
  }
};

const getTicketById = (req, res) => {
  try {
    const ticket = ticketModel.getTicketById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching ticket' });
  }
};

const createTicket = (req, res) => {
  try {
    const { title, description, priority, category } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const newTicket = ticketModel.createTicket({
      title,
      description,
      priority: priority || 'medium',
      category: category || 'other',
      createdBy: req.user.id,
      assignedTo: null,
      status: 'open'
    });

    res.status(201).json(newTicket);
  } catch (error) {
    res.status(500).json({ error: 'Error creating ticket' });
  }
};

// Add comment to ticket
const addComment = (req, res) => {
  try {
    const ticket = ticketModel.getTicketById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    // Check permissions (employee can only comment on their own tickets)
    if (req.user.role === 'employee' && ticket.createdBy !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    const { comment } = req.body;
    
    if (!comment) {
      return res.status(400).json({ error: 'Comment is required' });
    }
    
    const newComment = {
      id: ticket.comments.length + 1,
      userId: req.user.id,
      userName: req.user.name, 
      comment,
      createdAt: new Date().toISOString()
    };
    
    ticket.comments.push(newComment);
    ticket.updatedAt = new Date().toISOString();
    
    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding comment' });
  }
};

const updateStatus = (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['open', 'in progress', 'resolved', 'closed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const ticket = ticketModel.getTicketById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Only technicians and admin can update status
    if (req.user.role === 'employee') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    ticket.status = status;
    ticket.updatedAt = new Date().toISOString();

    res.json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating status' });
  }
};

module.exports = {
  getAllTickets,
  getTicketById,
  createTicket,
  addComment,
  updateStatus
};