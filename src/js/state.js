import { PROPERTIES_DATA } from '../data/properties.js';
import { api } from './api.js';

class AppState {
  constructor() {
    // Force purge old cached mock properties from localStorage across all devices
    try {
      const CACHE_VERSION = 'v4_neon_live';
      if (localStorage.getItem('tbp_sync_ver') !== CACHE_VERSION) {
        localStorage.removeItem('tbp_properties');
        localStorage.removeItem('tbp_leads');
        localStorage.removeItem('tbp_favorites');
        localStorage.setItem('tbp_sync_ver', CACHE_VERSION);
      }
    } catch (e) {}

    // Local Storage Properties fallback (only cached if synced from Neon DB)
    const savedProps = localStorage.getItem('tbp_properties');
    this.allProperties = savedProps ? JSON.parse(savedProps) : [];
    this.filteredProperties = [...this.allProperties];

    this.filters = {
      searchQuery: '',
      locality: 'All',
      bhk: 'All',
      maxPrice: 150000,
      minPrice: 15000,
      furnishing: 'All',
      tenantType: 'All',
      zeroBrokerageOnly: false,
      verifiedOnly: false,
      amenities: []
    };

    this.sortBy = 'featured'; // 'featured', 'price-low', 'price-high', 'newest'
    this.viewMode = 'grid'; // 'grid' or 'list'

    // Local Storage Favorites
    const savedFavs = localStorage.getItem('tbp_favorites');
    this.favorites = savedFavs ? JSON.parse(savedFavs) : [];

    // Theme Mode (Default to Light Mode)
    const savedTheme = localStorage.getItem('tbp_theme') || 'light';
    this.theme = savedTheme;

    // Business Contact Details (V. RAMANA / The Bangalore Properties)
    const savedContactInfo = localStorage.getItem('tbp_contact_info');
    const defaultContactInfo = {
      name: "The Bangalore Properties",
      proprietor: "V. RAMANA",
      role: "Proprietor",
      phone: "+91 80504 07710",
      phoneRaw: "+918050407710",
      whatsapp: "+918050407710",
      email: "ramuramana92@gmail.com",
      address: "Ground floor, Srinivas Residency, 2nd Main, KR Garden, Murugeshpalaya, Bangalore - 560017",
      locality: "Murugeshpalaya",
      slogan: "YOUR PROPERTY, OUR PRIORITY.",
      services: ["RESIDENTIAL RENT", "COMMERCIAL RENT", "OFFICE SPACE RENT", "GODOWN SPACE RENT", "LONG TERM LEASE RENT"]
    };
    this.contactInfo = savedContactInfo ? JSON.parse(savedContactInfo) : defaultContactInfo;

    // Authentication State
    const savedUser = localStorage.getItem('tbp_user');
    this.currentUser = savedUser ? JSON.parse(savedUser) : null;

    const savedRegUsers = localStorage.getItem('tbp_registered_users');
    this.registeredUsers = savedRegUsers ? JSON.parse(savedRegUsers) : [];

    this.authTab = 'email-pass'; // 'email-pass'
    this.userAuthMode = 'signin'; // 'signin' | 'register'
    this.pendingEmail = '';

    // Active Modals state
    this.activeModal = null; // null, 'property-details', 'schedule-visit', 'list-property', 'contact-us', 'auth-signin', 'admin-portal'
    this.activeProperty = null;

    // Admin Portal State
    const savedAdminAuth = localStorage.getItem('tbp_admin_auth') === 'true';
    this.isAdminLoggedIn = Boolean(this.currentUser && (savedAdminAuth || this.currentUser?.email === 'vramanarentals@gmail.com'));
    this.adminTab = 'dashboard'; // 'dashboard' | 'properties' | 'add-property' | 'leads' | 'settings'

    // Tenant Leads / Inquiries
    const savedLeads = localStorage.getItem('tbp_leads');
    this.leads = savedLeads ? JSON.parse(savedLeads) : [];

    this.dbStatus = 'connecting'; // 'connected' | 'offline'
    this.listeners = [];

    // Automatically load live data from Neon PostgreSQL
    this.initFromDb();

    // Auto-sync with cloud DB periodically & when page gains focus
    setInterval(() => this.initFromDb(), 30000);
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          this.initFromDb();
        }
      });
    }
  }

  // Fetch live state from Neon DB API
  async initFromDb() {
    try {
      let hasChanged = false;

      // 1. Check health
      const health = await api.getHealth();
      const newStatus = (health && health.status === 'ok') ? 'connected' : 'offline';
      if (this.dbStatus !== newStatus) {
        this.dbStatus = newStatus;
        hasChanged = true;
      }

      // 2. If admin token stored, verify validity
      const token = localStorage.getItem('tbp_admin_token');
      if (token) {
        const isValid = await api.verifyAdminToken();
        if (!isValid && this.isAdminLoggedIn) {
          this.isAdminLoggedIn = false;
          localStorage.removeItem('tbp_admin_auth');
          localStorage.removeItem('tbp_admin_token');
          hasChanged = true;
        }
      }

      // 3. Fetch properties from Neon DB
      const dbProps = await api.getProperties();
      if (dbProps && Array.isArray(dbProps)) {
        if (JSON.stringify(dbProps) !== JSON.stringify(this.allProperties)) {
          this.allProperties = dbProps;
          this.saveProperties();
          hasChanged = true;
        }
      }

      // 4. Fetch leads from Neon DB
      const dbLeads = await api.getLeads();
      if (dbLeads && Array.isArray(dbLeads)) {
        if (JSON.stringify(dbLeads) !== JSON.stringify(this.leads)) {
          this.leads = dbLeads;
          localStorage.setItem('tbp_leads', JSON.stringify(this.leads));
          hasChanged = true;
        }
      }

      // 5. Fetch contact settings
      const dbContact = await api.getContactInfo();
      if (dbContact) {
        if (JSON.stringify(dbContact) !== JSON.stringify(this.contactInfo)) {
          this.contactInfo = dbContact;
          localStorage.setItem('tbp_contact_info', JSON.stringify(this.contactInfo));
          hasChanged = true;
        }
      }

      if (hasChanged) {
        this.applyFilters();
        this.notify();
      }
    } catch (e) {
      if (this.dbStatus !== 'offline') {
        this.dbStatus = 'offline';
        this.notify();
      }
    }
  }

  // Auth Methods: Email & Password, Google OAuth

  handleGoogleCredential(credentialResponse) {
    try {
      const base64Url = credentialResponse.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
      const payload = JSON.parse(jsonPayload);

      const user = {
        id: `usr-google-${payload.sub}`,
        name: payload.name || payload.given_name || payload.email.split('@')[0],
        email: payload.email,
        provider: 'Google Account',
        avatar: payload.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
      };
      this.currentUser = user;
      localStorage.setItem('tbp_user', JSON.stringify(user));
      this.activeModal = null;
      this.notify();
      return user;
    } catch (e) {
      console.error('Failed to parse Google OAuth credential:', e);
      return this.loginWithGoogle();
    }
  }

  loginWithGoogle(email = 'user.google@gmail.com', name = 'Google User') {
    const user = {
      id: `usr-google-${Date.now()}`,
      name: name,
      email: email,
      provider: 'Google Account',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    };
    this.currentUser = user;
    localStorage.setItem('tbp_user', JSON.stringify(user));
    this.activeModal = null;
    this.notify();
    return user;
  }

  logout() {
    this.currentUser = null;
    this.isAdminLoggedIn = false;
    localStorage.removeItem('tbp_user');
    localStorage.removeItem('tbp_admin_auth');
    localStorage.removeItem('tbp_admin_token');
    if (window.location.pathname === '/admin') {
      history.replaceState(null, '', '/');
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.applyFilters();
    this.listeners.forEach(listener => listener(this));
  }

  setTheme(theme) {
    this.theme = theme;
    localStorage.setItem('tbp_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    this.notify();
  }

  toggleTheme() {
    const nextTheme = this.theme === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
  }

  toggleFavorite(propertyId) {
    if (this.favorites.includes(propertyId)) {
      this.favorites = this.favorites.filter(id => id !== propertyId);
    } else {
      this.favorites.push(propertyId);
    }
    localStorage.setItem('tbp_favorites', JSON.stringify(this.favorites));
    this.notify();
  }

  isFavorite(propertyId) {
    return this.favorites.includes(propertyId);
  }

  updateFilter(key, value) {
    this.filters[key] = value;
    this.notify();
  }

  toggleAmenity(amenityName) {
    const index = this.filters.amenities.indexOf(amenityName);
    if (index > -1) {
      this.filters.amenities.splice(index, 1);
    } else {
      this.filters.amenities.push(amenityName);
    }
    this.notify();
  }

  resetFilters() {
    this.filters = {
      searchQuery: '',
      locality: 'All',
      bhk: 'All',
      maxPrice: 150000,
      minPrice: 15000,
      furnishing: 'All',
      tenantType: 'All',
      zeroBrokerageOnly: false,
      verifiedOnly: false,
      amenities: []
    };
    this.sortBy = 'featured';
    this.notify();
  }

  setSortBy(sortVal) {
    this.sortBy = sortVal;
    this.notify();
  }

  openModal(modalType, propertyData = null) {
    this.activeModal = modalType;
    this.activeProperty = propertyData;
    if (modalType === 'admin-portal') {
      if (window.location.pathname !== '/admin' && !window.location.hash.includes('admin')) {
        history.pushState(null, '', '/admin');
      }
    }
    this.notify();
  }

  closeModal() {
    if (this.activeModal === 'admin-portal') {
      if (window.location.pathname === '/admin') {
        history.replaceState(null, '', '/');
      }
    }
    this.activeModal = null;
    this.activeProperty = null;
    this.notify();
  }

  async addProperty(newProp) {
    const propertyWithId = {
      id: newProp.id || `prop-custom-${Date.now()}`,
      isVerified: true,
      isFeatured: true,
      zeroBrokerage: true,
      images: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
      ],
      ...newProp
    };

    // Optimistically update frontend state
    this.allProperties.unshift(propertyWithId);
    this.saveProperties();
    this.notify();

    // Persist directly to Neon DB
    try {
      const created = await api.createProperty(propertyWithId);
      if (created && created.id) {
        const idx = this.allProperties.findIndex(p => p.id === propertyWithId.id);
        if (idx !== -1) {
          this.allProperties[idx] = created;
          this.saveProperties();
          this.notify();
        }
      }
    } catch (e) {
      console.error('Failed to persist property to Neon DB:', e);
    }
  }

  saveProperties() {
    try {
      localStorage.setItem('tbp_properties', JSON.stringify(this.allProperties));
    } catch (e) {
      console.error('Failed to save properties to localStorage:', e);
    }
  }

  async resetPropertiesToDefault() {
    try {
      const resetList = await api.resetProperties();
      if (resetList && Array.isArray(resetList)) {
        this.allProperties = resetList;
      } else {
        this.allProperties = [];
      }
    } catch (e) {
      this.allProperties = [];
    }
    this.saveProperties();
    this.notify();
  }

  applyFilters() {
    let result = [...this.allProperties];

    // Search query (title, address, locality)
    if (this.filters.searchQuery.trim() !== '') {
      const q = this.filters.searchQuery.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.locality.toLowerCase().includes(q) ||
        (p.address && p.address.toLowerCase().includes(q)) ||
        (p.bhk && p.bhk.toLowerCase().includes(q))
      );
    }

    // Locality
    if (this.filters.locality !== 'All') {
      result = result.filter(p => p.locality === this.filters.locality);
    }

    // BHK
    if (this.filters.bhk !== 'All') {
      result = result.filter(p => p.bhkType === this.filters.bhk);
    }

    // Price range
    result = result.filter(p => p.price <= this.filters.maxPrice);

    // Furnishing
    if (this.filters.furnishing !== 'All') {
      result = result.filter(p => p.furnishing === this.filters.furnishing);
    }

    // Zero Brokerage
    if (this.filters.zeroBrokerageOnly) {
      result = result.filter(p => p.zeroBrokerage);
    }

    // Verified
    if (this.filters.verifiedOnly) {
      result = result.filter(p => p.isVerified);
    }

    // Amenities
    if (this.filters.amenities.length > 0) {
      result = result.filter(p =>
        this.filters.amenities.every(a => p.amenities && p.amenities.includes(a))
      );
    }

    // Sorting
    if (this.sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (this.sortBy === 'newest') {
      result.sort((a, b) => (b.id > a.id ? 1 : -1));
    } else { // 'featured'
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    this.filteredProperties = result;
  }

  // User Registration & Login Methods with Neon DB
  async registerUser({ name, email, password }) {
    if (!name || !email || !password) {
      return { success: false, message: 'Please fill in all required fields.' };
    }

    const res = await api.registerUser({ name, email, password });
    if (res && res.success && res.user) {
      this.currentUser = res.user;
      localStorage.setItem('tbp_user', JSON.stringify(res.user));
      this.closeModal();
      this.notify();
      return res;
    }

    return res || { success: false, message: 'Registration failed.' };
  }

  async loginUser(email, password) {
    if (!email || !password) {
      return { success: false, message: 'Please enter both email and password.' };
    }

    const res = await api.loginUser(email, password);
    if (res && res.success && res.user) {
      this.currentUser = res.user;
      this.isAdminLoggedIn = Boolean(res.isAdmin);
      localStorage.setItem('tbp_user', JSON.stringify(res.user));
      
      if (res.isAdmin) {
        localStorage.setItem('tbp_admin_auth', 'true');
        if (res.token) {
          localStorage.setItem('tbp_admin_token', res.token);
        }
      } else {
        localStorage.removeItem('tbp_admin_auth');
        localStorage.removeItem('tbp_admin_token');
      }
      this.closeModal();
      this.notify();
      return res;
    }

    return res || { success: false, message: 'Invalid credentials.' };
  }

  // Admin Portal Methods
  async adminLogin(email, password) {
    const res = await this.loginUser(email, password);
    return res && res.success && res.isAdmin;
  }

  adminLogout() {
    this.isAdminLoggedIn = false;
    localStorage.removeItem('tbp_admin_auth');
    localStorage.removeItem('tbp_admin_token');
    if (this.currentUser?.isAdmin) {
      this.currentUser = null;
      localStorage.removeItem('tbp_user');
    }
    this.closeModal();
    if (window.location.pathname === '/admin') {
      history.replaceState(null, '', '/');
    }
    this.notify();
  }

  setAdminTab(tab) {
    this.adminTab = tab;
    this.notify();
  }

  async deleteProperty(propertyId) {
    const res = await api.deleteProperty(propertyId);
    if (res && res.success) {
      this.allProperties = this.allProperties.filter(p => p.id !== propertyId);
      this.saveProperties();
      this.notify();
      return { success: true };
    } else {
      console.error('Failed to delete property from Cloud DB:', res);
      // Re-sync with Cloud DB to ensure local state reflects reality
      const dbProps = await api.getProperties();
      if (dbProps && Array.isArray(dbProps)) {
        this.allProperties = dbProps;
        this.saveProperties();
        this.notify();
      }
      return { 
        success: false, 
        error: res?.error || 'Database delete failed. Please check admin login.' 
      };
    }
  }

  async togglePropertyFlag(propertyId, flagName) {
    const prop = this.allProperties.find(p => p.id === propertyId);
    if (prop) {
      prop[flagName] = !prop[flagName];
      this.saveProperties();
      this.notify();
      await api.togglePropertyFlag(propertyId, flagName);
    }
  }

  async updateLeadStatus(leadId, newStatus) {
    const lead = this.leads.find(l => l.id === leadId);
    if (lead) {
      lead.status = newStatus;
      localStorage.setItem('tbp_leads', JSON.stringify(this.leads));
      this.notify();
      await api.updateLead(leadId, { status: newStatus });
    }
  }

  async deleteLead(leadId) {
    this.leads = this.leads.filter(l => l.id !== leadId);
    localStorage.setItem('tbp_leads', JSON.stringify(this.leads));
    this.notify();
    await api.deleteLead(leadId);
  }

  async addLead(newLead) {
    const leadObj = {
      id: `lead-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'New',
      ...newLead
    };
    this.leads.unshift(leadObj);
    localStorage.setItem('tbp_leads', JSON.stringify(this.leads));
    this.notify();
    await api.createLead(leadObj);
  }

  async updateContactInfo(newInfo) {
    this.contactInfo = { ...this.contactInfo, ...newInfo };
    try {
      localStorage.setItem('tbp_contact_info', JSON.stringify(this.contactInfo));
    } catch (e) {
      console.error('Failed to save contact info to localStorage:', e);
    }
    this.notify();
    await api.updateContactInfo(this.contactInfo);
  }
}

export const state = new AppState();
