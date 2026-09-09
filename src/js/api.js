// API client connecting frontend to Neon PostgreSQL backend REST API

const API_BASE = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('tbp_admin_token') || '';

  return {
    'Content-Type': 'application/json',
    'x-admin-token': token,
    'Authorization': token ? `Bearer ${token}` : ''
  };
}

export const api = {
  // Database Health Check
  async getHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Backend API not responding, running with local cache:', err);
      return null;
    }
  },

  // Verify Admin Session / Token
  async verifyAdminToken() {
    try {
      const res = await fetch(`${API_BASE}/admin/verify-token`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) return false;
      const data = await res.json();
      return Boolean(data && data.valid);
    } catch (err) {
      return false;
    }
  },

  // Image Upload directly to Neon Database
  async uploadImage(imageData, propertyId = null, fileName = 'uploaded-property-photo.jpg', mimeType = 'image/jpeg') {
    try {
      const res = await fetch(`${API_BASE}/upload-image`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ imageData, propertyId, fileName, mimeType })
      });
      if (!res.ok) throw new Error(`Image upload failed with status ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('Failed to upload image to Neon DB:', err);
      return { success: false, url: imageData, dataUrl: imageData };
    }
  },

  // Properties API
  async getProperties() {
    try {
      const res = await fetch(`${API_BASE}/properties`);
      if (!res.ok) throw new Error(`Failed to fetch properties: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('Failed to fetch properties from DB:', err);
      return null;
    }
  },

  async createProperty(propertyData) {
    try {
      const res = await fetch(`${API_BASE}/properties`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(propertyData)
      });
      if (!res.ok) throw new Error(`Failed to create property: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('Failed to create property in DB:', err);
      return propertyData;
    }
  },

  async updateProperty(id, propertyData) {
    try {
      const res = await fetch(`${API_BASE}/properties/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(propertyData)
      });
      if (!res.ok) throw new Error(`Failed to update property: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('Failed to update property in DB:', err);
      return null;
    }
  },

  async togglePropertyFlag(id, flagName) {
    try {
      const res = await fetch(`${API_BASE}/properties/${id}/toggle-flag`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ flagName })
      });
      if (!res.ok) throw new Error(`Failed to toggle flag: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('Failed to toggle property flag in DB:', err);
      return null;
    }
  },

  async deleteProperty(id) {
    try {
      const res = await fetch(`${API_BASE}/properties/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error(`Failed to delete property: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('Failed to delete property in DB:', err);
      return null;
    }
  },

  async resetProperties() {
    try {
      const res = await fetch(`${API_BASE}/properties/reset`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error(`Failed to reset properties: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('Failed to reset properties in DB:', err);
      return null;
    }
  },

  // Leads API
  async getLeads() {
    try {
      const res = await fetch(`${API_BASE}/leads`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error(`Failed to fetch leads: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('Failed to fetch leads from DB:', err);
      return null;
    }
  },

  async createLead(leadData) {
    try {
      const res = await fetch(`${API_BASE}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });
      if (!res.ok) throw new Error(`Failed to create lead: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('Failed to create lead in DB:', err);
      return leadData;
    }
  },

  async updateLead(id, updates) {
    try {
      const res = await fetch(`${API_BASE}/leads/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error(`Failed to update lead: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('Failed to update lead in DB:', err);
      return null;
    }
  },

  async deleteLead(id) {
    try {
      const res = await fetch(`${API_BASE}/leads/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error(`Failed to delete lead: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('Failed to delete lead in DB:', err);
      return null;
    }
  },

  // User Auth API
  async registerUser(userData) {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return await res.json();
    } catch (err) {
      console.error('Registration failed:', err);
      return { success: false, message: 'Connection error during registration' };
    }
  },

  async loginUser(email, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return await res.json();
    } catch (err) {
      console.error('Login failed:', err);
      return { success: false, message: 'Connection error during login' };
    }
  },

  // Contact Info API
  async getContactInfo() {
    try {
      const res = await fetch(`${API_BASE}/contact`);
      if (!res.ok) throw new Error(`Failed to fetch contact info: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('Failed to fetch contact info from DB:', err);
      return null;
    }
  },

  async updateContactInfo(contactData) {
    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(contactData)
      });
      if (!res.ok) throw new Error(`Failed to update contact info: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('Failed to update contact info in DB:', err);
      return null;
    }
  }
};
