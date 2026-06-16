import { AxiosClientFactory, AxiosConfig } from './axios-factory';
import { InternalAxiosRequestConfig, AxiosInstance } from 'axios';

export interface SupabaseAxiosConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  timeout?: number;
  refreshSession?: () => Promise<{ accessToken: string; refreshToken: string } | null>;
}

export function createSupabaseAxiosClient(config: SupabaseAxiosConfig): AxiosInstance {
  const { supabaseUrl, supabaseAnonKey, timeout = 30000, refreshSession } = config;

  return AxiosClientFactory.createClient(
    {
      hostUrl: supabaseUrl,
      basePath: '/rest/v1',
      timeout,
      refreshToken: refreshSession
        ? async () => {
            const session = await refreshSession();
            return session?.accessToken || null;
          }
        : undefined,
    } as AxiosConfig,
    (requestConfig: InternalAxiosRequestConfig) => {
      requestConfig.headers.set('apikey', supabaseAnonKey);
      requestConfig.headers.set('Content-Type', 'application/json');
      requestConfig.headers.set('Prefer', 'return=representation');
      return requestConfig;
    }
  );
}

export function createSupabaseAuthClient(config: SupabaseAxiosConfig): AxiosInstance {
  const { supabaseUrl, supabaseAnonKey, timeout = 30000 } = config;

  return AxiosClientFactory.createClient(
    {
      hostUrl: supabaseUrl,
      basePath: '/auth/v1',
      timeout,
    } as AxiosConfig,
    (requestConfig: InternalAxiosRequestConfig) => {
      requestConfig.headers.set('apikey', supabaseAnonKey);
      requestConfig.headers.set('Content-Type', 'application/json');
      return requestConfig;
    }
  );
}

export async function refreshSupabaseToken(
  authClient: AxiosInstance,
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string } | null> {
  try {
    const response = await authClient.post('/token?grant_type=refresh_token', {
      refresh_token: refreshToken,
    });
    if (response.data?.access_token) {
      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token || refreshToken,
      };
    }
    return null;
  } catch (error) {
    console.error('[Supabase Token Refresh Failed]', error);
    return null;
  }
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PageListResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
