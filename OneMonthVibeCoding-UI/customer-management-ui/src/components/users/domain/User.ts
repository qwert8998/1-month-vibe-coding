export interface User {
  userId: number;
  userName?: string;
  lastName?: string;
  passwordHash?: string;
  dateOfBirth: string;
  isActive: boolean;
  email?: string;
  createdAt: string;
  updatedAt: string;
}
