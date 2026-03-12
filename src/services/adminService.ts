import { HealthCheckResponse, BackupsResponse } from '../types';

const API_BASE_URL = 'http://localhost:5000/api/v1/admin';

export const AdminService = {
  getDatabaseHealth: async (): Promise<HealthCheckResponse> => {
    const response = await fetch(`${API_BASE_URL}/database/health`);
    if (!response.ok) {
      throw new Error('Failed to fetch database health');
    }
    return response.json();
  },

  getBackups: async (): Promise<BackupsResponse> => {
    const response = await fetch(`${API_BASE_URL}/backups`);
    if (!response.ok) {
      throw new Error('Failed to fetch backups');
    }
    return response.json();
  },
};
