const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://oxkamuxdvqfruduerpsc.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94a2FtdXhkdnFmcnVkdWVycHNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NTIwNjIsImV4cCI6MjA4MDIyODA2Mn0.5pGLuEUDjFg9v5KFJ9i2mRycx5XUbrusAxPSzJq5rt4';

const baseHeaders = {
  apikey: supabaseAnonKey,
  Authorization: `Bearer ${supabaseAnonKey}`,
  'Content-Type': 'application/json',
};

const restUrl = `${supabaseUrl}/rest/v1`;

export type SupabaseResponse<T> = {
  data: T | null;
  error: string | null;
};

const handleResponse = async <T>(response: Response): Promise<SupabaseResponse<T>> => {
  if (!response.ok) {
    const message = await response.text();
    return { data: null, error: message || 'Unknown Supabase error' };
  }
  const json = (await response.json()) as T;
  return { data: json, error: null };
};

export const supabase = {
  select: async <T>(table: string, order?: { column: string; ascending?: boolean }) => {
    const url = new URL(`${restUrl}/${table}`);
    url.searchParams.set('select', '*');
    if (order) {
      url.searchParams.set('order', `${order.column}.${order.ascending === false ? 'desc' : 'asc'}`);
    }
    const response = await fetch(url.toString(), { headers: baseHeaders });
    return handleResponse<T[]>(response);
  },
  upsert: async <T>(table: string, payload: T | T[]) => {
    const url = `${restUrl}/${table}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { ...baseHeaders, Prefer: 'resolution=merge-duplicates' },
      body: JSON.stringify(payload),
    });
    return handleResponse<T[]>(response);
  },
  insert: async <T>(table: string, payload: T | T[]) => {
    const url = `${restUrl}/${table}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: baseHeaders,
      body: JSON.stringify(payload),
    });
    return handleResponse<T[]>(response);
  },
  update: async <T>(table: string, column: string, value: string, payload: Partial<T>) => {
    const url = new URL(`${restUrl}/${table}`);
    url.searchParams.set(column, `eq.${value}`);
    const response = await fetch(url.toString(), {
      method: 'PATCH',
      headers: baseHeaders,
      body: JSON.stringify(payload),
    });
    return handleResponse<T[]>(response);
  },
  delete: async (table: string, column: string, value: string) => {
    const url = new URL(`${restUrl}/${table}`);
    url.searchParams.set(column, `eq.${value}`);
    const response = await fetch(url.toString(), {
      method: 'DELETE',
      headers: baseHeaders,
    });
    if (!response.ok) {
      const message = await response.text();
      return { data: null, error: message || 'Delete failed' };
    }
    return { data: null, error: null };
  },
};
