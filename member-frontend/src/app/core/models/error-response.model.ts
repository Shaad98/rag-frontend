export interface ErrorResponse {
  timestamp: string; // ISO LocalDateTime string from backend
  status: number;
  code: string;
  message: string;
  path: string;
}