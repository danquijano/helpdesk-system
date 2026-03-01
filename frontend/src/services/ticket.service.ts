import api from './api';

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  createdBy: number;
  assignedTo: number | null;
  createdAt: string;
  updatedAt: string;
  comments: any[];
}

export interface CreateTicketDto {
  title: string;
  description: string;
  priority?: string;
  category?: string;
}

class TicketService {
  async getAllTickets(): Promise<Ticket[]> {
    const response = await api.get('/tickets');
    return response.data;
  }

  async getTicketById(id: number): Promise<Ticket> {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  }

  async createTicket(ticket: CreateTicketDto): Promise<Ticket> {
    const response = await api.post('/tickets', ticket);
    return response.data;
  }
}

export default new TicketService();