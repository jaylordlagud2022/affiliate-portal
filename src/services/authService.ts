import BaseAPI, { ApiType, LoginData, User, ApiResponse } from './api';

class AuthService extends BaseAPI {
  constructor(apiType: ApiType = 'wordpress') {
    super(apiType);
  }

  /** Step 1: Send verification code to HubSpot email */
  private async sendHubspotCode(email: string): Promise<ApiResponse<User>> {
    try {
      const response = await this.makeRequest(
        `https://api.propertyinvestors.com.au/wp-json/hubspot-login/v1/send-code`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      );
      const result = await response.json();

      if (!result.success) {
        return { success: false, error: result.message || 'Failed to send code' };
      }

      return { success: true, data: { email } as User };
    } catch {
      return { success: false, error: 'Network error' };
    }
  }

  /** Step 2: Verify code and log in */
  async verifyHubspotCode(code: string, email: string): Promise<ApiResponse<User>> {
    try {
      const response = await this.makeRequest(
        `https://api.propertyinvestors.com.au/wp-json/hubspot-login/v1/verify-code`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, email }),
        }
      );

      const result = await response.json();
      console.log('Sending verification payload:', { code, email });
      console.log('Verify result:', result);

      if (result.success && result.data?.token) {
        localStorage.setItem('authToken', result.data.token);
        this.saveCurrentUser(result.data);
        return { success: true, data: result.data };
      }

      return { success: false, error: result.message || 'Invalid code' };
    } catch (err) {
      console.error(err);
      return { success: false, error: 'Network error' };
    }
  }

  /** HubSpot login (Step 1 only) */
  private async hubspotLogin(data: LoginData): Promise<ApiResponse<User>> {
    return this.sendHubspotCode(data.email);
  }

  /** Main login entry */
  async login(data: LoginData): Promise<ApiResponse<User>> {
    if (this.apiType === 'wordpress') {
      return this.wordpressLogin(data);
    }
    return this.hubspotLogin(data);
  }

  /** WordPress login */
  private async wordpressLogin(data: LoginData): Promise<ApiResponse<User>> {
    try {
      const response = await this.makeRequest(
        `${process.env.REACT_APP_WP_AUTH_URL}/token`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: data.email,
            password: data.password,
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.token) {
        localStorage.setItem('authToken', result.token);
        const user = {
          id: result.user_id,
          email: result.user_email,
          name: result.user_display_name,
        };
        this.saveCurrentUser(user);
        return { success: true, data: user };
      }

      return { success: false, error: result.message || 'Login failed' };
    } catch {
      return { success: false, error: 'Network error' };
    }
  }

  /** Register new user */
  async register(data: Record<string, any>): Promise<ApiResponse<User>> {
    try {
      const response = await this.makeRequest(
        `https://api.propertyinvestors.com.au/wp-json/hubspot-login/v1/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      console.log('Register result:', result);

      if (result.success && result.data) {
        if (result.data.token) {
          localStorage.setItem('authToken', result.data.token);
        }
        this.saveCurrentUser(result.data);
        return { success: true, data: result.data };
      }

      return { success: false, error: result.message || 'Registration failed' };
    } catch (err) {
      console.error(err);
      return { success: false, error: 'Network error' };
    }
  }

  /** ✅ Update existing user (profile, business, etc.) */
  async updateUser(data: Record<string, any>): Promise<ApiResponse<User>> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        return { success: false, error: 'Missing authentication token' };
      }

      const response = await this.makeRequest(
        `https://api.propertyinvestors.com.au/wp-json/hubspot-login/v1/update-user`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, ...data }),
        }
      );

      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch {
        console.error('Invalid JSON response:', text);
        return { success: false, error: 'Invalid server response' };
      }

      if (result.success) {
        console.log('✅ User updated successfully:', result.data);
        this.saveCurrentUser(result.data);
        return { success: true, data: result.data };
      }

      console.warn('❌ Update failed:', result.message);
      return { success: false, error: result.message || 'Update failed' };
    } catch (err) {
      console.error('Network error:', err);
      return { success: false, error: 'Network error' };
    }
  }

  /** Storage helpers */
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getCurrentUser(): User | null {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  }

  saveCurrentUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
}

export default AuthService;
