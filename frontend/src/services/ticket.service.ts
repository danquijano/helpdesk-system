import api from './api';

export interface Comment {
  id: number;
  userId: number;
  userName: string;
  comment: string;
  createdAt: string;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: 'open' | 'in progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  createdBy: number;
  assignedTo: number | null;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
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

  async addComment(id: number, comment: string): Promise<Comment> {
    const response = await api.post(`/tickets/${id}/comments`, { comment });
    return response.data;
  }

  async updateStatus(id: number, status: string): Promise<Ticket> {
    const response = await api.patch(`/tickets/${id}/status`, { status });
    return response.data;
  }
}

export default new TicketService();