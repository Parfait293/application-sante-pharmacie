// Utilitaires API pour connecter le frontend au backend

const API_BASE_URL = 'http://192.168.137.5:5000/api';

// Fonction utilitaire pour obtenir le jeton d'authentification
const getToken = () => localStorage.getItem('token');

// Fonction utilitaire pour faire des requêtes authentifiées
const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = getToken();
  // Utiliser Headers pour pouvoir définir les valeurs en toute sécurité quel que soit le type des headers entrants
  const headers = new Headers(options.headers as HeadersInit);

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });
};

// API d'authentification
export const authAPI = {
  register: async (userData: any) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  login: async (credentials: { identifier: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  getProfile: async () => {
    const response = await authFetch('/auth/me');
    return response.json();
  },

  refreshToken: async () => {
    const response = await authFetch('/auth/refresh');
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },
};

// API Utilisateur
export const userAPI = {
  updateProfile: async (userData: any) => {
    const response = await authFetch('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  updateWallet: async (amount: number, operation: 'add' | 'subtract') => {
    const response = await authFetch('/users/wallet', {
      method: 'PUT',
      body: JSON.stringify({ amount, operation }),
    });
    return response.json();
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await authFetch('/users/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return response.json();
  },
};

// API de paiement
export const paymentAPI = {
  // Méthodes de paiement
  addPaymentMethod: async (paymentData: {
    method: 'moov' | 'yas-togo' | 'carte-bancaire';
    phoneNumber?: string;
    cardDetails?: any;
    isDefault?: boolean;
  }) => {
    const response = await authFetch('/payments/methods', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
    return response.json();
  },

  getPaymentMethods: async () => {
    const response = await authFetch('/payments/methods');
    return response.json();
  },

  deletePaymentMethod: async (id: string) => {
    const response = await authFetch(`/payments/methods/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  // Dépôts et paiements
  deposit: async (depositData: {
    amount: number;
    method: 'moov' | 'yas-togo';
    phoneNumber: string;
  }) => {
    const response = await authFetch('/payments/deposit', {
      method: 'POST',
      body: JSON.stringify(depositData),
    });
    return response.json();
  },

  pay: async (paymentData: {
    amount: number;
    description: string;
    type: 'consultation' | 'medication';
    relatedId?: string;
  }) => {
    const response = await authFetch('/payments/pay', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
    return response.json();
  },

  // Transactions
  getTransactions: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.type) query.append('type', params.type);

    const response = await authFetch(`/payments/transactions?${query}`);
    return response.json();
  },

  getTransaction: async (id: string) => {
    const response = await authFetch(`/payments/transactions/${id}`);
    return response.json();
  },
};

// API Pharmacie
export const pharmacyAPI = {
  getPharmacies: async (params?: { medicine?: string; lat?: number; lng?: number }) => {
    const query = new URLSearchParams();
    if (params?.medicine) query.append('medicine', params.medicine);
    if (params?.lat) query.append('lat', params.lat.toString());
    if (params?.lng) query.append('lng', params.lng.toString());

    const response = await fetch(`${API_BASE_URL}/pharmacies?${query}`);
    return response.json();
  },

  getPharmacy: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/pharmacies/${id}`);
    return response.json();
  },
};

// API Médicaments
export const medicineAPI = {
  searchMedicines: async (name: string) => {
    const response = await fetch(`${API_BASE_URL}/medicines/search?name=${encodeURIComponent(name)}`);
    return response.json();
  },
};

// API Rendez-vous
export const appointmentAPI = {
  getAppointments: async () => {
    const response = await authFetch('/appointments');
    return response.json();
  },

  createAppointment: async (appointmentData: any) => {
    const response = await authFetch('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
    return response.json();
  },

  updateAppointment: async (id: string, updates: any) => {
    const response = await authFetch(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.json();
  },
};

// API Commande
export const orderAPI = {
  getOrders: async () => {
    const response = await authFetch('/orders');
    return response.json();
  },

  createOrder: async (orderData: FormData) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: orderData,
    });
    return response.json();
  },

  updateOrder: async (id: string, updates: any) => {
    const response = await authFetch(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.json();
  },
};

// API Notification
export const notificationAPI = {
  getNotifications: async () => {
    const response = await authFetch('/notifications');
    return response.json();
  },

  markAsRead: async (id: string) => {
    const response = await authFetch(`/notifications/${id}/read`, {
      method: 'PUT',
    });
    return response.json();
  },

  markAllAsRead: async () => {
    const response = await authFetch('/notifications/read-all', {
      method: 'PUT',
    });
    return response.json();
  },
};

// API Professionnel
export const professionalAPI = {
  getProfile: async () => {
    const response = await authFetch('/professionals/profile');
    return response.json();
  },

  getTransactions: async (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());

    const response = await authFetch(`/professionals/transactions?${query}`);
    return response.json();
  },

  withdrawEarnings: async (amount: number, bankDetails: any) => {
    const response = await authFetch('/professionals/withdraw', {
      method: 'POST',
      body: JSON.stringify({ amount, bankDetails }),
    });
    return response.json();
  },

  getAppointments: async () => {
    const response = await authFetch('/professionals/appointments');
    return response.json();
  },

  updateAppointment: async (appointmentId: string, updates: any) => {
    const response = await authFetch(`/professionals/appointments/${appointmentId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.json();
  },

  getPatients: async () => {
    const response = await authFetch('/professionals/patients');
    return response.json();
  },

  updateProfile: async (profileData: any) => {
    const response = await authFetch('/professionals/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    return response.json();
  },
};

// Fonction de déconnexion
export const logout = () => {
  localStorage.removeItem('token');
  // Rediriger vers la connexion ou rafraîchir la page
  window.location.href = '/';
};