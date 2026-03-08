import api from './api';

export interface DashboardStats {
  totalTickets: number;
  byStatus: {
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
  };
  byPriority: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  recentTickets: Array<{
    id: number;
    title: string;
    status: string;
    priority: string;
    createdAt: string;
  }>;
  assignedToMe?: number;
  unassigned?: number;
}

class StatsService {
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get('/stats/dashboard');
    return response.data;
  }
}

export default new StatsService();