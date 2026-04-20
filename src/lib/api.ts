/**
 * Base API Client
 * Wraps native fetch with consistent error handling and auth headers
 */

export async function apiClient<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = (import.meta as any).env.VITE_API_BASE_URL || '/api';
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  } as any;

  // Add auth token if available in storage or context
  const token = localStorage.getItem('auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Fetch error at ${endpoint}:`, error);
    throw error;
  }
}
