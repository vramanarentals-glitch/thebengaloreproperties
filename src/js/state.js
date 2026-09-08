import { PROPERTIES_DATA } from '../data/properties.js';
import { 
  fetchNeonProperties, 
  saveNeonProperty, 
  deleteNeonProperty, 
  fetchNeonLeads, 
  saveNeonLead, 
  deleteNeonLead 
} from './neon.js';
import {
  initFirebase,
  subscribeCloudProperties,
  saveCloudProperty,
  deleteCloudProperty,
  subscribeCloudLeads,
  saveCloudLead,
  deleteCloudLead
} from './firebase.js';

class AppState {
  constructor() {
    // Local Storage Properties
    const savedProps = localStorage.getItem('tbp_properties');
    this.allProperties = savedProps ? JSON.parse(savedProps) : [...PROPERTIES_DATA];
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
    this.favorites = savedFavs ? JSON.parse(savedFavs) : ['prop-101', 'prop-104'];

    // Theme Mode (Default to Light Mode)
    const savedTheme = localStorage.getItem('tbp_theme') || 'light';
    this.theme = 'light';

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
    this.isAdminLoggedIn = savedAdminAuth;
    this.adminTab = 'dashboard'; // 'dashboard' | 'properties' | 'add-property' | 'leads' | 'settings'

    // Tenant Leads / Inquiries
    const savedLeads = localStorage.getItem('tbp_leads');
    this.leads = savedLeads ? JSON.parse(savedLeads) : [
      {
        id: "lead-101",
        tenantName: "Rajesh Kumar",
        tenantPhone: "+91 98860 12345",
        propertyTitle: "Skyline Zenith Luxury 3BHK Penthouse",
        locality: "Indiranagar",
        date: "2026-09-03",
        status: "New",
        notes: "Looking to move in by next month. Prefers fully furnished."
      },
      {
        id: "lead-102",
        tenantName: "Priya Sharma",
        tenantPhone: "+91 97420 54321",
        propertyTitle: "Prestige Cyber Heights 2BHK",
        locality: "Whitefield",
        date: "2026-09-02",
        status: "Contacted",
        notes: "Scheduled weekend site visit."
      },
      {
        id: "lead-103",
        tenantName: "Anand Verma",
        tenantPhone: "+91 99001 88776",
        propertyTitle: "Murugeshpalaya Commercial Godown Space",
        locality: "Murugeshpalaya",
        date: "2026-09-01",
        status: "Scheduled",
        notes: "Requires 3-phase power for warehouse logistics."
      }
    ];

    this.listeners = [];

    // Real-time Firebase & Neon PostgreSQL Cloud Sync Initialization
    this.isCloudSynced = true;
    this.cloudProvider = 'Firebase Firestore & Neon DB';
    this.initCloudSync();
  }

  async initCloudSync() {
    console.log('🔥 Initializing Firebase Firestore Real-Time Cloud Sync...');
    initFirebase();

    // 1. Subscribe to Firebase Firestore Real-time WebSockets
    this.unsubscribeFbProps = subscribeCloudProperties((fbProps) => {
      if (fbProps && Array.isArray(fbProps) && fbProps.length > 0) {
        console.log(`🔥 Real-Time Sync: Received ${fbProps.length} properties from Firebase Firestore.`);
        this.allProperties = fbProps;
        this.saveProperties();
        this.notify();
      }
    });

    this.unsubscribeFbLeads = subscribeCloudLeads((fbLeads) => {
      if (fbLeads && Array.isArray(fbLeads) && fbLeads.length > 0) {
        this.leads = fbLeads;
        localStorage.setItem('tbp_leads', JSON.stringify(this.leads));
        this.notify();
      }
    });

    // 2. Also perform Neon PostgreSQL sync in background
    await this.syncWithNeon();
    if (!this.pollTimer) {
      this.pollTimer = setInterval(() => {
        this.syncWithNeon(true);
      }, 10000);
    }
  }

  async syncWithNeon(isSilent = false) {
    try {
      const neonProps = await fetchNeonProperties();
      if (neonProps && Array.isArray(neonProps) && neonProps.length > 0) {
        const currentStr = JSON.stringify(this.allProperties);
        const newStr = JSON.stringify(neonProps);
        if (currentStr !== newStr) {
          if (!isSilent) console.log(`✅ Synced ${neonProps.length} properties from Neon PostgreSQL!`);
          this.allProperties = neonProps;
          this.saveProperties();
          this.notify();
        }
      }

      const neonLeads = await fetchNeonLeads();
      if (neonLeads && Array.isArray(neonLeads) && neonLeads.length > 0) {
        const currentLeadsStr = JSON.stringify(this.leads);
        const newLeadsStr = JSON.stringify(neonLeads);
        if (currentLeadsStr !== newLeadsStr) {
          this.leads = neonLeads;
          localStorage.setItem('tbp_leads', JSON.stringify(this.leads));
          this.notify();
        }
      }
    } catch (e) {
      if (!isSilent) console.warn('Neon DB sync note:', e);
    }
  }

  // Auth Methods: Email & Password, Google OAuth

  handleGoogleCredential(credentialResponse) {
    try {
      // Decode Google ID Token JWT payload
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
    this.notify();
  }

  closeModal() {
    this.activeModal = null;
    this.activeProperty = null;
    this.notify();
  }

  async addProperty(newProp) {
    const propertyWithId = {
      id: `prop-custom-${Date.now()}`,
      isVerified: true,
      isFeatured: true,
      zeroBrokerage: true,
      images: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
      ],
      ...newProp
    };
    this.allProperties.unshift(propertyWithId);
    this.saveProperties();
    this.notify();

    // Save to both Firebase Firestore & Neon PostgreSQL
    await saveCloudProperty(propertyWithId);
    await saveNeonProperty(propertyWithId);
    await this.syncWithNeon(true);
  }

  async forceRefreshFromCloud() {
    console.log('🔄 Clearing local cache and fetching fresh properties from Neon Cloud DB...');
    localStorage.removeItem('tbp_properties');
    await this.syncWithNeon();
    this.notify();
  }

  saveProperties() {
    try {
      localStorage.setItem('tbp_properties', JSON.stringify(this.allProperties));
    } catch (e) {
      console.error('Failed to save properties to localStorage:', e);
    }
  }

  resetPropertiesToDefault() {
    this.allProperties = [...PROPERTIES_DATA];
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
        p.address.toLowerCase().includes(q) ||
        p.bhk.toLowerCase().includes(q)
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
        this.filters.amenities.every(a => p.amenities.includes(a))
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

  // User Registration & Login Methods
  registerUser({ name, email, password }) {
    if (!name || !email || !password) {
      return { success: false, message: 'Please fill in all required fields.' };
    }
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (cleanEmail === 'vramanarentals@gmail.com') {
      return { success: false, message: 'This email is reserved for Admin login.' };
    }

    const existing = this.registeredUsers.find(u => u.email === cleanEmail);
    if (existing) {
      return { success: false, message: 'An account with this email already exists. Please sign in.' };
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      password: cleanPass,
      provider: 'Email & Password',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`
    };

    this.registeredUsers.push(newUser);
    localStorage.setItem('tbp_registered_users', JSON.stringify(this.registeredUsers));

    const userSession = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      provider: newUser.provider,
      avatar: newUser.avatar
    };
    this.currentUser = userSession;
    localStorage.setItem('tbp_user', JSON.stringify(userSession));

    this.closeModal();
    this.notify();
    return { success: true, user: userSession };
  }

  loginUser(email, password) {
    if (!email || !password) {
      return { success: false, message: 'Please enter both email and password.' };
    }
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    // Check if credentials match admin email
    if (cleanEmail === 'vramanarentals@gmail.com') {
      const regUser = this.registeredUsers.find(u => u.email === cleanEmail && u.password === cleanPass);
      if (cleanPass === 'ramana rentals' || regUser) {
        this.isAdminLoggedIn = true;
        localStorage.setItem('tbp_admin_auth', 'true');
        const adminSession = {
          id: regUser ? regUser.id : 'usr-admin',
          name: regUser ? regUser.name : 'V. RAMANA (Proprietor)',
          email: 'vramanarentals@gmail.com',
          provider: 'Admin Account',
          avatar: regUser ? regUser.avatar : 'https://api.dicebear.com/7.x/avataaars/svg?seed=VRamana',
          isAdmin: true
        };
        this.currentUser = adminSession;
        localStorage.setItem('tbp_user', JSON.stringify(adminSession));
        // Automatically open Admin Portal upon admin login!
        this.activeModal = 'admin-portal';
        this.notify();
        return { success: true, user: adminSession, isAdmin: true };
      }
    }

    // Check registered users
    const user = this.registeredUsers.find(u => u.email === cleanEmail && u.password === cleanPass);
    if (user) {
      this.isAdminLoggedIn = false;
      localStorage.removeItem('tbp_admin_auth');
      const userSession = {
        id: user.id,
        name: user.name,
        email: user.email,
        provider: user.provider,
        avatar: user.avatar,
        isAdmin: false
      };
      this.currentUser = userSession;
      localStorage.setItem('tbp_user', JSON.stringify(userSession));
      this.closeModal();
      this.notify();
      return { success: true, user: userSession, isAdmin: false };
    }

    return { success: false, message: 'Invalid email or password!' };
  }

  // Admin Portal Methods
  adminLogin(email, password) {
    if (!email || !password) return false;
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();
    if (cleanEmail === 'vramanarentals@gmail.com' && cleanPass === 'ramana rentals') {
      this.isAdminLoggedIn = true;
      localStorage.setItem('tbp_admin_auth', 'true');
      const adminSession = {
        id: 'usr-admin',
        name: 'V. RAMANA (Proprietor)',
        email: 'vramanarentals@gmail.com',
        provider: 'Admin Account',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=VRamana',
        isAdmin: true
      };
      this.currentUser = adminSession;
      localStorage.setItem('tbp_user', JSON.stringify(adminSession));
      this.activeModal = 'admin-portal';
      this.notify();
      return true;
    }
    return false;
  }

  adminLogout() {
    this.isAdminLoggedIn = false;
    localStorage.removeItem('tbp_admin_auth');
    this.notify();
  }

  setAdminTab(tab) {
    this.adminTab = tab;
    this.notify();
  }

  async deleteProperty(propertyId) {
    this.allProperties = this.allProperties.filter(p => p.id !== propertyId);
    this.saveProperties();
    this.notify();

    await deleteCloudProperty(propertyId);
    await deleteNeonProperty(propertyId);
    await this.syncWithNeon(true);
  }

  async togglePropertyFlag(propertyId, flagName) {
    const prop = this.allProperties.find(p => p.id === propertyId);
    if (prop) {
      prop[flagName] = !prop[flagName];
      this.saveProperties();
      this.notify();

      await saveCloudProperty(prop);
      await saveNeonProperty(prop);
      await this.syncWithNeon(true);
    }
  }

  async updateLeadStatus(leadId, newStatus) {
    const lead = this.leads.find(l => l.id === leadId);
    if (lead) {
      lead.status = newStatus;
      localStorage.setItem('tbp_leads', JSON.stringify(this.leads));
      this.notify();

      await saveCloudLead(lead);
      await saveNeonLead(lead);
      await this.syncWithNeon(true);
    }
  }

  async deleteLead(leadId) {
    this.leads = this.leads.filter(l => l.id !== leadId);
    localStorage.setItem('tbp_leads', JSON.stringify(this.leads));
    this.notify();

    await deleteCloudLead(leadId);
    await deleteNeonLead(leadId);
    await this.syncWithNeon(true);
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

    await saveCloudLead(leadObj);
    await saveNeonLead(leadObj);
    await this.syncWithNeon(true);
  }

  updateContactInfo(newInfo) {
    this.contactInfo = { ...this.contactInfo, ...newInfo };
    try {
      localStorage.setItem('tbp_contact_info', JSON.stringify(this.contactInfo));
    } catch (e) {
      console.error('Failed to save contact info to localStorage:', e);
    }
    this.notify();
  }
}

export const state = new AppState();
