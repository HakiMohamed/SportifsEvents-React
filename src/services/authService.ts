// src/services/authService.ts
import axios from 'axios';
import { HttpClient } from './httpClient'; 
import { UserResponse, SignupData, SigninData } from '../types/auth';



export class AuthService {
  private static instance: AuthService;
  private readonly apiUrl = import.meta.env.VITE_API_URL + '/auth';

  private constructor(private httpClient: HttpClient) {}

  public static getInstance(httpClient?: HttpClient): AuthService {
    if (!AuthService.instance) {
      if (!httpClient) {
        throw new Error('HttpClient is required for first initialization');
      }
      AuthService.instance = new AuthService(httpClient);
    }
    return AuthService.instance;
  }

  async signup(userData: SignupData): Promise<UserResponse> {
    try {
      const response = await this.httpClient.post<UserResponse>(`${this.apiUrl}/Register`, userData);
      return response;
    } catch (error) {
      this.handleAuthError(error);
    }
  }

  async signin(credentials: SigninData): Promise<UserResponse> {
    try {
      const response = await this.httpClient.post<UserResponse>(`${this.apiUrl}/Login`, credentials);
      this.storeAuthentication(response);
      return response;
    } catch (error) {
      this.handleAuthError(error);
    }
  }

  logout(): void {
    this.clearAuthentication();
  }

  private storeAuthentication(authData: UserResponse): void {
    localStorage.setItem('token', authData.access_token);
    localStorage.setItem('user', JSON.stringify(authData.user));
  }

  private clearAuthentication(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  private handleAuthError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'Authentication failed';
      throw new Error(message);
    }
    throw error;
  }

  getCurrentUser(): UserResponse['user'] | null {
    const userString = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (userString && token) {
      return JSON.parse(userString);
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}