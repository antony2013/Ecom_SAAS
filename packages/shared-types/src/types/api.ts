// API response envelope types matching backend format

export interface ApiError {
  error: string;
  code?: string;
  message: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ListResponse<T> {
  items: T[];
  total: number;
}

export interface SearchResponse<T> extends ListResponse<T> {
  limit: number;
  offset: number;
}

// Auth response types
export interface AuthResponse {
  success: boolean;
}

export interface CustomerLoginResponse extends AuthResponse {
  customer: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
}

export interface MerchantLoginResponse extends AuthResponse {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export interface SuperAdminLoginResponse extends AuthResponse {
  admin: {
    id: string;
    email: string;
    name: string;
  };
}

export interface CustomerRegisterResponse extends AuthResponse {
  customer: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
}

export interface MerchantRegisterResponse extends AuthResponse {
  store: {
    id: string;
    name: string;
    domain: string;
    status: string;
  };
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export interface VerifyEmailResponse extends AuthResponse {
  verified: boolean;
  userType: string;
  email: string;
}

export interface ResetPasswordResponse extends AuthResponse {
  reset: boolean;
  email: string;
}

export interface ForgotPasswordResponse extends AuthResponse {
  message: string;
}