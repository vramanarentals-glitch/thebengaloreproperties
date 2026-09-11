import { state } from '../state.js';

export function renderHeader() {
  const root = document.getElementById('header-root');
  if (!root) return;

  const favCount = state.favorites.length;
  const isDark = state.theme === 'dark';
  const isAdmin = Boolean(state.currentUser && (state.isAdminLoggedIn || state.currentUser?.email === 'vramanarentals@gmail.com'));

  root.innerHTML = `
    <header class="header-nav">
      <div class="header-container">
        <a href="#" class="brand-logo">
          <div class="brand-icon">
            <i class="fa-solid fa-city"></i>
          </div>
          <div class="brand-title-wrap">
            The Bangalore <span class="brand-text-highlight">Properties</span>
            <div class="brand-subtitle">
              <i class="fa-solid fa-key"></i> 100% VERIFIED RENTALS
            </div>
          </div>
        </a>

        <!-- Desktop & Mobile Navigation Actions -->
        <div class="header-actions">
          <!-- Dedicated Mobile & Desktop Upload Property Button -->
          <button id="btn-header-upload-prop" class="nav-btn btn-upload-shortcut" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(99, 102, 241, 0.2)); border: 1.5px solid var(--accent-emerald); color: var(--accent-emerald); font-weight: 800; box-shadow: 0 2px 10px rgba(16, 185, 129, 0.2);" title="Upload & Post a Property from Mobile or Laptop">
            <i class="fa-solid fa-cloud-arrow-up"></i>
            <span class="btn-text-full">+ Upload Property</span>
            <span class="btn-text-mobile">+ Upload</span>
          </button>

          <button id="btn-book-call" class="nav-btn nav-btn-primary" style="font-weight: 700;" title="Book a Callback with Proprietor V. RAMANA">
            <i class="fa-solid fa-phone-volume"></i>
            <span class="btn-text-full">Book Call</span>
            <span class="btn-text-mobile">Book</span>
          </button>

          ${isAdmin ? `
            <button id="btn-header-admin-portal" class="nav-btn btn-admin-shortcut" style="background: rgba(16, 185, 129, 0.18); border: 1px solid #10b981; color: #10b981; font-weight: 800;" title="Open Admin Dashboard">
              <i class="fa-solid fa-user-shield"></i>
              <span class="btn-text-full">Admin Dashboard</span>
              <span class="btn-text-mobile">Admin</span>
            </button>
          ` : ''}

          ${state.currentUser ? `
            <div style="display: flex; align-items: center; gap: 0.35rem;">
              <button id="btn-user-profile" class="nav-btn" style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); color: #10b981; font-weight: 700;" title="Logged in as ${state.currentUser.name}">
                <i class="fa-solid fa-user-circle"></i>
                <span>${state.currentUser.name.split(' ')[0]}</span>
              </button>
              <button id="btn-user-logout" class="nav-btn" style="background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.3); color: #ef4444;" title="Sign Out">
                <i class="fa-solid fa-right-from-bracket"></i>
              </button>
            </div>
          ` : `
            <button id="btn-header-auth" class="nav-btn" style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); color: #10b981; font-weight: 700;" title="Sign In or Create Account">
              <i class="fa-solid fa-user-check"></i>
              <span>Sign In</span>
            </button>
          `}

          <button id="btn-contact-card" class="nav-btn" style="background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); color: #f59e0b; font-size: 0.78rem; padding: 0.35rem 0.65rem; border-radius: 6px; font-weight: 600;" title="Contact Proprietor V. RAMANA">
            <i class="fa-solid fa-address-card"></i>
            <span class="btn-text-full">V. RAMANA (+91 80504 07710)</span>
            <span class="btn-text-mobile">V. RAMANA</span>
          </button>

          <button id="btn-theme-toggle" class="nav-btn" title="Toggle Light/Dark Theme">
            <i class="fa-solid ${isDark ? 'fa-sun' : 'fa-moon'}"></i>
            <span class="hide-mobile-small">${isDark ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </div>
    </header>
  `;

  // Attach Event Listeners
  document.getElementById('btn-header-upload-prop')?.addEventListener('click', () => {
    if (isAdmin) {
      state.setAdminTab('add-property');
      state.openModal('admin-portal');
    } else {
      state.pendingAdminTab = 'add-property';
      state.openModal('admin-portal');
    }
  });

  document.getElementById('btn-header-auth')?.addEventListener('click', () => {
    state.openModal('auth-signin');
  });

  document.getElementById('btn-header-admin-portal')?.addEventListener('click', () => {
    state.openModal('admin-portal');
  });

  document.getElementById('btn-user-logout')?.addEventListener('click', () => {
    state.logout();
  });

  document.getElementById('btn-book-call')?.addEventListener('click', () => {
    state.openModal('book-call');
  });

  document.getElementById('btn-contact-card')?.addEventListener('click', () => {
    state.openModal('contact-us');
  });

  document.getElementById('btn-theme-toggle')?.addEventListener('click', () => {
    state.toggleTheme();
  });
}

