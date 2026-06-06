import { client } from "./client";
import type {
  AuthResponse,
  LoginCredentials,
  SignupCredentials,
  User,
} from "@/types/auth";

/** Wrapper format from backend ResponseInterceptor */
interface ApiResponse<T> {
  success: boolean;
  data: T;
  requestId: string;
}

/**
 * Register a new user.
 */
export async function signup(
  credentials: SignupCredentials
): Promise<AuthResponse> {
  const response = await client.post<ApiResponse<AuthResponse>>(
    "/auth/signup",
    credentials
  );
  return response.data.data;
}

/**
 * Authenticate an existing user.
 */
export async function signin(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  const response = await client.post<ApiResponse<AuthResponse>>(
    "/auth/signin",
    credentials
  );
  return response.data.data;
}

/**
 * Get the current authenticated user's info.
 * This is a protected endpoint that requires a valid token.
 */
export async function getMe(): Promise<User> {
  const response = await client.get<ApiResponse<User>>("/auth/me");
  return response.data.data;
}

/**
 * Refresh access token using httpOnly refresh_token cookie.
 * The backend reads the cookie automatically.
 */
export async function refresh(): Promise<{ accessToken: string }> {
  const response = await client.post<ApiResponse<{ accessToken: string }>>("/auth/refresh");
  return response.data.data;
}

/**
 * Logout and revoke refresh token.
 * The backend reads the cookie and marks the token as revoked.
 */
export async function logout(): Promise<void> {
  await client.post("/auth/logout");
}
