export interface ChangePasswordRequest {
  userId: string;
  code: string;
  password: string;
}
