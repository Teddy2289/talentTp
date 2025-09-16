import { i } from "framer-motion/client";

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  type: UserType;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export enum UserType {
  ADMIN = "Admin",
  AGENT = "Agent",
  CLIENT = "Client",
  USER = "User",
}

export interface CreateUserRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  type?: UserType;
  is_verified?: boolean;
}

export interface UpdateUserRequest {
  email?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  type?: UserType;
  is_verified?: boolean;
}
