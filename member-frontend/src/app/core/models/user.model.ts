export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface UserResponse {
  userId: string;
  fullName: string;
  email: string;
  dateOfBirth: string; // ISO date string (LocalDate)
  role: Role;
}

export interface AdminUserResponse extends UserResponse {
  isEnabled: boolean;
}

export interface UpdateUserRequest {
  fullName?: string;
  dateOfBirth?: string;
}