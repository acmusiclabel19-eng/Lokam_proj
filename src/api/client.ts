import axios, { type AxiosInstance, type AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth
  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    return response.data;
  }

  async register(data: any) {
    const response = await this.client.post('/auth/register', data);
    return response.data;
  }

  async getMe() {
    const response = await this.client.get('/auth/me');
    return response.data;
  }

  async changePassword(currentPassword: string, newPassword: string) {
    const response = await this.client.post('/auth/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  }

  // Properties
  async getProperties(params?: any) {
    const response = await this.client.get('/properties', { params });
    return response.data;
  }

  async getProperty(id: string) {
    const response = await this.client.get(`/properties/${id}`);
    return response.data;
  }

  async createProperty(data: any) {
    const response = await this.client.post('/properties', data);
    return response.data;
  }

  async updateProperty(id: string, data: any) {
    const response = await this.client.put(`/properties/${id}`, data);
    return response.data;
  }

  async deleteProperty(id: string) {
    const response = await this.client.delete(`/properties/${id}`);
    return response.data;
  }

  async updateFinancialModel(id: string, data: any) {
    const response = await this.client.patch(`/properties/${id}/financial`, data);
    return response.data;
  }

  async getPropertyTypes() {
    const response = await this.client.get('/properties/types');
    return response.data;
  }

  async getCommunes() {
    const response = await this.client.get('/properties/communes');
    return response.data;
  }

  // Tenants
  async getTenants() {
    const response = await this.client.get('/tenants');
    return response.data;
  }

  async getTenant(id: string) {
    const response = await this.client.get(`/tenants/${id}`);
    return response.data;
  }

  async createTenant(data: any) {
    const response = await this.client.post('/tenants', data);
    return response.data;
  }

  async updateTenant(id: string, data: any) {
    const response = await this.client.put(`/tenants/${id}`, data);
    return response.data;
  }

  async deleteTenant(id: string) {
    const response = await this.client.delete(`/tenants/${id}`);
    return response.data;
  }

  // Leases
  async getLeases(params?: any) {
    const response = await this.client.get('/leases', { params });
    return response.data;
  }

  async getLease(id: string) {
    const response = await this.client.get(`/leases/${id}`);
    return response.data;
  }

  async createLease(data: any) {
    const response = await this.client.post('/leases', data);
    return response.data;
  }

  async updateLease(id: string, data: any) {
    const response = await this.client.put(`/leases/${id}`, data);
    return response.data;
  }

  async terminateLease(id: string) {
    const response = await this.client.post(`/leases/${id}/terminate`);
    return response.data;
  }

  async renewLease(id: string, newEndDate: string) {
    const response = await this.client.post(`/leases/${id}/renew`, { newEndDate });
    return response.data;
  }

  async calculateSettlement(id: string) {
    const response = await this.client.get(`/leases/${id}/settlement`);
    return response.data;
  }

  // Payments
  async getPayments(params?: any) {
    const response = await this.client.get('/payments', { params });
    return response.data;
  }

  async getPendingPayments() {
    const response = await this.client.get('/payments/pending');
    return response.data;
  }

  async getOverduePayments() {
    const response = await this.client.get('/payments/overdue');
    return response.data;
  }

  async createPayment(data: any, receipt?: File) {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
    if (receipt) {
      formData.append('receipt', receipt);
    }

    const response = await this.client.post('/payments', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async validatePayment(id: string, status: 'VALIDATED' | 'REJECTED', rejectionReason?: string) {
    const response = await this.client.post(`/payments/${id}/validate`, {
      status,
      rejectionReason
    });
    return response.data;
  }

  // Maintenance
  async getMaintenances(params?: any) {
    const response = await this.client.get('/maintenances', { params });
    return response.data;
  }

  async getMaintenance(id: string) {
    const response = await this.client.get(`/maintenances/${id}`);
    return response.data;
  }

  async createMaintenance(data: any, photos?: File[]) {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
    if (photos) {
      photos.forEach(photo => {
        formData.append('photos', photo);
      });
    }

    const response = await this.client.post('/maintenances', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async updateMaintenance(id: string, data: any) {
    const response = await this.client.put(`/maintenances/${id}`, data);
    return response.data;
  }

  async addTimelineEntry(id: string, note: string, status?: string) {
    const response = await this.client.post(`/maintenances/${id}/timeline`, {
      note,
      status
    });
    return response.data;
  }

  // Dashboard
  async getDashboardStats() {
    const response = await this.client.get('/dashboard/stats');
    return response.data;
  }

  async getRevenueChart(year?: number) {
    const response = await this.client.get('/dashboard/revenue-chart', {
      params: { year }
    });
    return response.data;
  }

  async getOccupancyChart() {
    const response = await this.client.get('/dashboard/occupancy-chart');
    return response.data;
  }

  async getPropertyTypeDistribution() {
    const response = await this.client.get('/dashboard/property-types');
    return response.data;
  }

  async getRecentActivity(limit?: number) {
    const response = await this.client.get('/dashboard/activity', {
      params: { limit }
    });
    return response.data;
  }

  async getAlerts() {
    const response = await this.client.get('/dashboard/alerts');
    return response.data;
  }

  // Notifications
  async getNotifications(unreadOnly?: boolean) {
    const response = await this.client.get('/notifications', {
      params: { unreadOnly }
    });
    return response.data;
  }

  async getUnreadCount() {
    const response = await this.client.get('/notifications/unread-count');
    return response.data;
  }

  async markAsRead(id: string) {
    const response = await this.client.patch(`/notifications/${id}/read`);
    return response.data;
  }

  async markAllAsRead() {
    const response = await this.client.patch('/notifications/read-all');
    return response.data;
  }

  // PDF Documents
  getContractUrl(leaseId: string): string {
    return `${API_BASE_URL}/pdf/contracts/${leaseId}`;
  }

  getQuittanceUrl(paymentId: string): string {
    return `${API_BASE_URL}/pdf/quittances/${paymentId}`;
  }

  getFinancialReportUrl(year?: number): string {
    return `${API_BASE_URL}/pdf/financial-report?year=${year || new Date().getFullYear()}`;
  }

  getReminderUrl(tenantId: string): string {
    return `${API_BASE_URL}/pdf/reminders/${tenantId}`;
  }
}

export const api = new ApiClient();
export default api;
