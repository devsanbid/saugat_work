import { ApiClient } from './api';

class AuthAPI {
  constructor() {
    this.client = new ApiClient();
  }

  // Login user
  async login(credentials) {
    return this.client.post('/auth/login', credentials);
  }

  // Register user
  async register(userData) {
    return this.client.post('/auth/register', userData);
  }

  // Logout user
  async logout() {
    return this.client.post('/auth/logout');
  }

  // Get current user profile
  async getProfile() {
    return this.client.get('/auth/me');
  }

  // Update user profile
  async updateProfile(profileData) {
    return this.client.put('/auth/profile', profileData);
  }

  // Change password
  async changePassword(passwordData) {
    return this.client.put('/auth/change-password', passwordData);
  }

  // Forgot password
  async forgotPassword(email) {
    return this.client.post('/auth/forgot-password', { email });
  }

  // Reset password
  async resetPassword(token, newPassword) {
    return this.client.post('/auth/reset-password', { token, newPassword });
  }

  // Verify email
  async verifyEmail(token) {
    return this.client.post('/auth/verify-email', { token });
  }

  // Resend verification email
  async resendVerification(email) {
    return this.client.post('/auth/resend-verification', { email });
  }

  // Refresh token
  async refreshToken() {
    return this.client.post('/auth/refresh-token');
  }
}

export const authAPI = new AuthAPI();
export default authAPI;