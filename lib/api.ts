const BASE = process.env.NEXT_PUBLIC_API_URL || 'https://yira-api-production.up.railway.app/api/v1';

function getHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('yira_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export const api = {
  get: async (url: string) => {
    const res = await fetch(`${BASE}${url}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },
  post: async (url: string, body: any) => {
    const res = await fetch(`${BASE}${url}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },
  put: async (url: string, body: any) => {
    const res = await fetch(`${BASE}${url}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },
  delete: async (url: string) => {
    const res = await fetch(`${BASE}${url}`, { method: 'DELETE', headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }
};

export const endpoints = {
  auth: {
    login:      '/auth/conseiller/login',
    loginAdmin: '/auth/admin/login',
    loginDrh:   '/auth/drh/login',
    register:   '/auth/jeune/inscription',
  },
  admin: {
    beneficiaires: '/admin/beneficiaires',
    conseillers:   '/admin/conseillers',
    stats:         '/admin/stats',
  },
  jeune: {
    profil:    '/jeune/profil',
    test:      '/jeune/test-result',
    filieres:  '/jeune/filieres',
  },
  pays: '/pays',
  stats: '/stats',
};