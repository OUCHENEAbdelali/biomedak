const API_BASE = 'http://localhost/biomedak/server/api';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

export const authAPI = {
  async checkSession() {
    return fetchAPI('/auth.php');
  },

  async login(email: string, password: string) {
    return fetchAPI('/auth.php?action=login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async register(email: string, password: string, fullName: string) {
    return fetchAPI('/auth.php?action=register', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName }),
    });
  },

  async logout() {
    return fetchAPI('/auth.php?action=logout', {
      method: 'POST',
    });
  },
};

export const equipementsAPI = {
  async getAll() {
    return fetchAPI('/equipements.php');
  },

  async getOne(id: string) {
    return fetchAPI(`/equipements.php?id=${id}`);
  },

  async create(data: any) {
    return fetchAPI('/equipements.php', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: any) {
    return fetchAPI(`/equipements.php?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string) {
    return fetchAPI(`/equipements.php?id=${id}`, {
      method: 'DELETE',
    });
  },
};

export const interventionsAPI = {
  async getAll() {
    return fetchAPI('/interventions.php');
  },

  async getOne(id: string) {
    return fetchAPI(`/interventions.php?id=${id}`);
  },

  async create(data: any) {
    return fetchAPI('/interventions.php', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: any) {
    return fetchAPI(`/interventions.php?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string) {
    return fetchAPI(`/interventions.php?id=${id}`, {
      method: 'DELETE',
    });
  },
};

export const statsAPI = {
  async get() {
    return fetchAPI('/stats.php');
  },
};

export const profileAPI = {
  async update(fullName: string) {
    return fetchAPI('/profile.php', {
      method: 'PUT',
      body: JSON.stringify({ full_name: fullName }),
    });
  },
};
