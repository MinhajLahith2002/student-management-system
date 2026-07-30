export interface LoginRequest {
  email: string;
  password?: string; // Optional if we just want to type the form state
}

export interface AuthResponse {
  token: string;
}

export interface User {
  id?: string;
  email: string;
  role: string;
}
