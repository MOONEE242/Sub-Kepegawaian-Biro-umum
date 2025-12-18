
const getHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  login: async (creds: any) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(creds),
    });
    if (!res.ok) throw new Error('Login gagal');
    const data = await res.json();
    localStorage.setItem('auth_token', data.token);
    return data;
  },
  get: async (endpoint: string) => {
    const res = await fetch(`/api${endpoint}`, { headers: getHeaders() });
    if (res.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.reload();
    }
    return res.json();
  },
  post: async (endpoint: string, data: any) => {
    const res = await fetch(`/api${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
  put: async (endpoint: string, data: any) => {
    const res = await fetch(`/api${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
  delete: async (endpoint: string) => {
    const res = await fetch(`/api${endpoint}`, { 
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  }
};
