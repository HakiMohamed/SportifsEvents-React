// src/types/auth.ts


export interface SignupData {
    username: string;
    email: string;
    password: string;
  }
  
  
  export interface SigninData {
    email: string;
    password: string; 
  }
  
  export interface UserResponse {
    user: {
      id: string;
      username: string;
      email: string;
      roles?: string[];
    };
    access_token: string;
  }