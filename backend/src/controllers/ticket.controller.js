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

module.exports = {
  getAllTickets,
  getTicketById,
  createTicket
};