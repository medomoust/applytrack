import {
  User,
  LoginInput,
  SignUpInput,
  AuthResponse,
  JobApplication,
  JobPosting,
  UpdateJobApplicationInput,
  UpdateProfileInput,
  CreateJobPostingInput,
  UpdateJobPostingInput,
  ApplyToJobPostingInput,
  ListJobApplicationsQuery,
  ListJobPostingsQuery,
  PaginatedJobApplications,
  PaginatedJobPostings,
  PaginatedActivityLogs,
  ListActivityLogsQuery,
} from '@applytrack/shared';

const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:3001';

class ApiClient {
  private accessToken: string | null = null;

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // Auth
  async signup(data: SignUpInput): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginInput): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<void> {
    await this.request('/api/auth/logout', { method: 'POST' });
    this.accessToken = null;
  }

  async refresh(): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/refresh', { method: 'POST' });
  }

  async me(): Promise<User> {
    return this.request<User>('/api/auth/me');
  }

  async updateProfile(data: UpdateProfileInput): Promise<User> {
    return this.request<User>('/api/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Job Postings
  async getJobPostings(query: Partial<ListJobPostingsQuery> = {}): Promise<PaginatedJobPostings> {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    return this.request<PaginatedJobPostings>(`/api/job-postings?${params}`);
  }

  async getJobPosting(id: string): Promise<JobPosting> {
    return this.request<JobPosting>(`/api/job-postings/${id}`);
  }

  createJobPosting = async (data: CreateJobPostingInput): Promise<JobPosting> => {
    return this.request<JobPosting>('/api/job-postings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  updateJobPosting = async (id: string, data: UpdateJobPostingInput): Promise<JobPosting> => {
    return this.request<JobPosting>(`/api/job-postings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  deleteJobPosting = async (id: string): Promise<void> => {
    return this.request(`/api/job-postings/${id}`, { method: 'DELETE' });
  }

  async applyToJobPosting(id: string, data: ApplyToJobPostingInput = {}): Promise<JobApplication> {
    return this.request<JobApplication>(`/api/job-postings/${id}/apply`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Job Applications
  async getApplications(query: Partial<ListJobApplicationsQuery> = {}): Promise<PaginatedJobApplications> {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    return this.request<PaginatedJobApplications>(`/api/applications?${params}`);
  }

  async getApplication(id: string): Promise<JobApplication> {
    return this.request<JobApplication>(`/api/applications/${id}`);
  }

  async updateApplication(id: string, data: UpdateJobApplicationInput): Promise<JobApplication> {
    return this.request<JobApplication>(`/api/applications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async archiveApplication(id: string): Promise<JobApplication> {
    return this.request<JobApplication>(`/api/applications/${id}/archive`, {
      method: 'POST',
    });
  }

  async restoreApplication(id: string): Promise<JobApplication> {
    return this.request<JobApplication>(`/api/applications/${id}/restore`, {
      method: 'POST',
    });
  }

  async deleteApplication(id: string): Promise<void> {
    return this.request(`/api/applications/${id}`, { method: 'DELETE' });
  }

  // Activity
  async getActivity(query: Partial<ListActivityLogsQuery> = {}): Promise<PaginatedActivityLogs> {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    return this.request<PaginatedActivityLogs>(`/api/activity?${params}`);
  }

  // Dashboard
  async getDashboardStats(): Promise<any> {
    return this.request('/api/dashboard/stats');
  }

  async getRecentActivity(): Promise<any[]> {
    return this.request('/api/dashboard/activity');
  }

  // Users (admin)
  async getUsers(query: any = {}): Promise<any> {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    return this.request(`/api/users?${params}`);
  }

  async getUser(id: string): Promise<any> {
    return this.request(`/api/users/${id}`);
  }

  async updateUser(id: string, data: any): Promise<any> {
    return this.request(`/api/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient();
