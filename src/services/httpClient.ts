// Frentend/src/services/httpClient.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';



export class HttpClient {
  private axiosInstance: AxiosInstance;


  constructor(baseURL?: string) {
    this.axiosInstance = axios.create({
      baseURL: baseURL || import.meta.env.VITE_API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }


  setNavigationHandler(navigate: (path: string) => void) {
    this.navigate = navigate;
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          
          switch (error.response.status) {
            case 401:
               localStorage.removeItem('token');
                localStorage.removeItem('user');
                 window.location.href = '/login';
                  break;
            case 403:
              console.error('Access forbidden');
              break;
            case 404:
              console.error('Resource not found');
              break;
            case 500:
              console.error('Internal server error');
              break;
          }
        } else if (error.request) {
          console.error('No response received', error.request);
        } else {
          console.error('Error', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.put(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.delete(url, config);
    return response.data;
  }
}