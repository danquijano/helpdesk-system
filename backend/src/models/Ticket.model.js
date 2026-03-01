const tickets = [
  {
    id: 1,
    title: "Cannot access email",
    description: "Unable to login to Outlook since this morning",
    status: "open",
    priority: "high",
    category: "software",
    createdBy: 3,
    assignedTo: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 2,
    title: "Slow computer",
    description: "Computer is very slow when opening programs",
    status: "open",
    priority: "medium",
    category: "hardware",
    createdBy: 3,
    assignedTo: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    comments: []
  }
];

const getAllTickets = () => tickets;
const getTicketById = (id) => tickets.find(t => t.id === parseInt(id));

const createTicket = (ticketData) => {
  const newTicket = {
    id: tickets.length + 1,
    ...ticketData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    comments: []
  };
  tickets.push(newTicket);
  return newTicket;
};

const updateTicket = (id, updateData) => {
  const index = tickets.findIndex(t => t.id === parseInt(id));
  if (index !== -1) {
    tickets[index] = {
      ...tickets[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    return tickets[index];
  }
  return null;
};

module.exports = {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket
};