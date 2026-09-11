import { LOCALITIES } from '../../data/properties.js';
import { state } from '../state.js';
import { api } from '../api.js';
import { showToast } from './Toast.js';
import { compressImage, processAndCompressImages } from '../utils/imageCompressor.js';

export function renderAdminPortal() {
  if (state.activeModal !== 'admin-portal') return;

  const root = document.getElementById('modal-root');
  if (!root) return;

  // Check if Admin is logged in
  const isAdmin = state.isAdminLoggedIn && state.currentUser?.email === 'vramanarentals@gmail.com';
  if (!isAdmin) {
    renderAdminLoginForm(root);
  } else {
    renderAdminDashboard(root);
  }
}

function renderAdminLoginForm(root) {
  root.innerHTML = `
    <div class="modal-overlay" id="admin-modal-backdrop">
      <div class="modal-card admin-login-card" style="max-width: 440px; background: var(--bg-surface); border: 2px solid rgba(239, 68, 68, 0.4); box-shadow: 0 20px 50px rgba(0,0,0,0.7); border-radius: 20px;">
        <button class="modal-close-btn" id="btn-close-admin-modal">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <div class="modal-body" style="padding: 2.25rem 1.75rem;">
          <div style="width: 64px; height: 64px; border-radius: 20px; background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.4); color: #ef4444; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin: 0 auto 1.25rem auto; box-shadow: 0 4px 14px rgba(239, 68, 68, 0.25);">
            <i class="fa-solid fa-lock"></i>
          </div>

          <div style="text-align: center; margin-bottom: 1.5rem;">
            <div style="display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.72rem; font-weight: 800; text-transform: uppercase; color: #ef4444; background: rgba(239, 68, 68, 0.1); padding: 0.25rem 0.65rem; border-radius: 20px; border: 1px solid rgba(239, 68, 68, 0.25); margin-bottom: 0.5rem;">
              <i class="fa-solid fa-shield-halved"></i> Protected Path: /admin
            </div>
            <h3 class="font-heading" style="font-size: 1.5rem; margin-bottom: 0.35rem; font-weight: 800;">Administrator Access</h3>
            <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.4;">
              This area is strictly restricted to Proprietor V. RAMANA. Please enter your administrator credentials stored in your secure environment.
            </p>
          </div>

          <div id="admin-auth-error-box" style="display: none; background: rgba(239, 68, 68, 0.12); border: 1px solid #ef4444; border-radius: 10px; padding: 0.75rem; margin-bottom: 1rem; color: #ef4444; font-size: 0.85rem; text-align: center;">
            <i class="fa-solid fa-triangle-exclamation"></i> <span id="admin-auth-error-msg">Invalid email or password!</span>
          </div>

          <form id="admin-login-form" style="display: flex; flex-direction: column; gap: 1.1rem;">
            <div class="input-field-group" style="text-align: left;">
              <label style="font-weight: 700; font-size: 0.85rem; color: var(--text-primary); margin-bottom: 0.35rem; display: block;">
                Admin Email
              </label>
              <div style="position: relative;">
                <i class="fa-solid fa-envelope" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted);"></i>
                <input 
                  type="email" 
                  id="admin-email-input" 
                  placeholder="admin@example.com" 
                  required 
                  autocomplete="username"
                  style="width: 100%; padding: 0.85rem 0.85rem 0.85rem 2.5rem; border-radius: 12px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.95rem; font-weight: 500;"
                />
              </div>
            </div>

            <div class="input-field-group" style="text-align: left;">
              <label style="font-weight: 700; font-size: 0.85rem; color: var(--text-primary); margin-bottom: 0.35rem; display: block;">
                Admin Password
              </label>
              <div style="position: relative;">
                <i class="fa-solid fa-key" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted);"></i>
                <input 
                  type="password" 
                  id="admin-pass-input" 
                  placeholder="Enter administrator password" 
                  required 
                  autocomplete="current-password"
                  style="width: 100%; padding: 0.85rem 2.8rem 0.85rem 2.5rem; border-radius: 12px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.95rem; font-weight: 500;"
                />
                <button type="button" id="btn-toggle-admin-pass" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 0.9rem;" title="Toggle password visibility">
                  <i class="fa-solid fa-eye" id="icon-admin-pass-eye"></i>
                </button>
              </div>
            </div>

            <button type="submit" id="btn-submit-admin-login" class="nav-btn nav-btn-primary" style="width: 100%; justify-content: center; padding: 0.95rem; font-size: 1rem; margin-top: 0.25rem; font-weight: 700; border-radius: 12px; gap: 0.5rem; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);">
              <i class="fa-solid fa-lock-open"></i> Authenticate & Unlock Portal
            </button>
          </form>

          <div style="text-align: center; margin-top: 1.25rem;">
            <a href="/" id="btn-return-home" style="font-size: 0.82rem; color: var(--text-secondary); text-decoration: none; display: inline-flex; align-items: center; gap: 0.35rem;">
              <i class="fa-solid fa-arrow-left"></i> Return to Homepage
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  const passInput = document.getElementById('admin-pass-input');
  const togglePassBtn = document.getElementById('btn-toggle-admin-pass');
  const eyeIcon = document.getElementById('icon-admin-pass-eye');

  togglePassBtn?.addEventListener('click', () => {
    if (passInput) {
      if (passInput.type === 'password') {
        passInput.type = 'text';
        eyeIcon?.classList.replace('fa-eye', 'fa-eye-slash');
      } else {
        passInput.type = 'password';
        eyeIcon?.classList.replace('fa-eye-slash', 'fa-eye');
      }
    }
  });

  document.getElementById('admin-login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('admin-email-input').value.trim();
    const pass = document.getElementById('admin-pass-input').value.trim();
    const submitBtn = document.getElementById('btn-submit-admin-login');
    const errBox = document.getElementById('admin-auth-error-box');
    const errMsg = document.getElementById('admin-auth-error-msg');

    if (errBox) errBox.style.display = 'none';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Verifying with Neon DB...';
    }

    const success = await state.adminLogin(email, pass);
    if (success) {
      if (state.pendingAdminTab) {
        state.setAdminTab(state.pendingAdminTab);
        state.pendingAdminTab = null;
      }
      showToast('⚡ Administrator Access Granted! Welcome V. RAMANA.');
    } else {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-lock-open"></i> Authenticate & Unlock Portal';
      }
      if (errBox && errMsg) {
        errMsg.innerText = 'Access Denied: Invalid administrator credentials.';
        errBox.style.display = 'block';
      }
      showToast('❌ Access Denied: Invalid credentials!');
    }
  });

  const handleClose = () => {
    state.closeModal();
    const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
    if (path === '/admin' || window.location.hash.toLowerCase() === '#admin' || window.location.hash.toLowerCase() === '#/admin') {
      history.replaceState(null, '', '/');
    }
  };

  document.getElementById('btn-close-admin-modal')?.addEventListener('click', handleClose);
  document.getElementById('btn-return-home')?.addEventListener('click', (e) => {
    e.preventDefault();
    handleClose();
  });
  document.getElementById('admin-modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'admin-modal-backdrop') {
      handleClose();
    }
  });
}

function renderAdminDashboard(root) {
  const props = state.allProperties;
  const leads = state.leads;
  const c = state.contactInfo;

  const totalRent = props.reduce((acc, p) => acc + (p.price || 0), 0);
  const zeroBrokerageCount = props.filter(p => p.zeroBrokerage).length;
  const verifiedCount = props.filter(p => p.isVerified).length;

  const activeTab = state.adminTab || 'dashboard';

  root.innerHTML = `
    <div class="admin-portal-fullscreen" id="admin-portal-shell">
      
      <!-- Fullscreen Admin Header Navbar -->
      <div class="admin-header-bar">
        <div class="admin-header-left">
          <div class="admin-brand-icon">
            <i class="fa-solid fa-user-shield"></i>
          </div>
          <div style="min-width: 0; flex: 1;">
            <div class="admin-title-row">
              <h3 class="font-heading admin-portal-heading">The Bangalore Properties</h3>
              <span class="admin-status-badge">PROPRIETOR ONLINE</span>
            </div>
            <p class="admin-subtitle-info">
              Logged in as <strong>${c.proprietor} (${c.role})</strong> | Phone: ${c.phone}
            </p>
          </div>
        </div>

        <div class="admin-header-right">
          <button id="btn-admin-logout" class="nav-btn btn-logout-action" title="Logout of Admin Portal">
            <i class="fa-solid fa-right-from-bracket"></i> <span class="hide-mobile">Logout</span>
          </button>
          <button class="modal-close-btn admin-close-btn" id="btn-close-admin-portal" title="Close Admin Portal">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      <!-- Admin Horizontal Tab Bar -->
      <div class="admin-tab-nav-bar">
        <button class="admin-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}" data-admin-tab="dashboard">
          <i class="fa-solid fa-chart-pie"></i> <span>Dashboard & KPIs</span>
        </button>
        <button class="admin-tab-btn ${activeTab === 'properties' ? 'active' : ''}" data-admin-tab="properties">
          <i class="fa-solid fa-building"></i> <span>Manage Properties (${props.length})</span>
        </button>
        <button class="admin-tab-btn ${activeTab === 'add-property' ? 'active' : ''}" data-admin-tab="add-property">
          <i class="fa-solid fa-plus-circle"></i> <span>Add Property</span>
        </button>
        <button class="admin-tab-btn ${activeTab === 'leads' ? 'active' : ''}" data-admin-tab="leads">
          <i class="fa-solid fa-headset"></i> <span>Tenant Leads (${leads.length})</span>
        </button>
        <button class="admin-tab-btn ${activeTab === 'settings' ? 'active' : ''}" data-admin-tab="settings">
          <i class="fa-solid fa-sliders"></i> <span>Settings</span>
        </button>
      </div>

      <!-- Admin Portal Body View -->
      <div class="admin-body-container">
        ${renderAdminTabContent(activeTab, props, leads, c, totalRent, zeroBrokerageCount, verifiedCount)}
      </div>

    </div>
  `;

  // Attach Tab Handlers
  root.querySelectorAll('[data-admin-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.setAdminTab(btn.dataset.adminTab);
    });
  });

  const handleCloseOrLogout = (isLogout = false) => {
    if (isLogout) {
      state.adminLogout();
      showToast('Logged out of Admin Portal.');
    } else {
      state.closeModal();
    }
    const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
    if (path === '/admin' || window.location.hash.toLowerCase() === '#admin') {
      history.replaceState(null, '', '/');
    }
  };

  document.getElementById('btn-admin-logout')?.addEventListener('click', () => handleCloseOrLogout(true));
  document.getElementById('btn-close-admin-portal')?.addEventListener('click', () => handleCloseOrLogout(false));

  attachAdminTabEvents(activeTab, root);
}

function renderAdminTabContent(tab, props, leads, c, totalRent, zeroBrokerageCount, verifiedCount) {
  if (tab === 'dashboard') {
    return `
      <!-- KPI Stats Grid -->
      <div class="admin-kpi-grid">
        <div class="kpi-card kpi-emerald">
          <div class="kpi-header-row">
            <span class="kpi-title">Total Active Properties</span>
            <i class="fa-solid fa-building kpi-icon"></i>
          </div>
          <div class="kpi-value">${props.length}</div>
          <div class="kpi-sub">Verified Bengaluru Properties</div>
        </div>

        <div class="kpi-card kpi-amber">
          <div class="kpi-header-row">
            <span class="kpi-title">0% Brokerage</span>
            <i class="fa-solid fa-bolt kpi-icon"></i>
          </div>
          <div class="kpi-value">${zeroBrokerageCount}</div>
          <div class="kpi-sub">Direct Proprietor Managed</div>
        </div>

        <div class="kpi-card kpi-blue">
          <div class="kpi-header-row">
            <span class="kpi-title">100% Verified</span>
            <i class="fa-solid fa-shield-halved kpi-icon"></i>
          </div>
          <div class="kpi-value">${verifiedCount}</div>
          <div class="kpi-sub">Physically Verified</div>
        </div>

        <div class="kpi-card kpi-pink">
          <div class="kpi-header-row">
            <span class="kpi-title">Tenant Leads</span>
            <i class="fa-solid fa-comments kpi-icon"></i>
          </div>
          <div class="kpi-value">${leads.length}</div>
          <div class="kpi-sub">Active Inquiries & Visits</div>
        </div>

        <div class="kpi-card kpi-purple">
          <div class="kpi-header-row">
            <span class="kpi-title">Monthly Portfolio</span>
            <i class="fa-solid fa-indian-rupee-sign kpi-icon"></i>
          </div>
          <div class="kpi-value">₹${totalRent.toLocaleString('en-IN')}</div>
          <div class="kpi-sub">Combined Monthly Rent</div>
        </div>
      </div>

      <!-- Dashboard Grid Split -->
      <div class="admin-dashboard-split">
        
        <!-- Left: Quick Property Overview -->
        <div class="admin-card-box">
          <div class="admin-card-header">
            <h4 class="admin-card-title"><i class="fa-solid fa-list-check" style="color: var(--accent-emerald);"></i> Recent Property Listings</h4>
            <button class="btn-quick-admin-action" data-admin-tab-goto="properties">View All (${props.length})</button>
          </div>

          <!-- Desktop Data Table -->
          <div class="hide-mobile overflow-x-auto">
            <table class="admin-data-table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Locality</th>
                  <th>Rent / Mo</th>
                  <th>Type</th>
                  <th>Flags</th>
                </tr>
              </thead>
              <tbody>
                ${props.slice(0, 5).map(p => `
                  <tr>
                    <td>
                      <div style="display: flex; align-items: center; gap: 0.65rem;">
                        <img src="${p.images[0]}" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;" />
                        <div>
                          <div style="font-weight: 700; font-size: 0.88rem;">${p.title}</div>
                          <div style="font-size: 0.75rem; color: var(--text-secondary);">${p.sqft} sqft | ${p.bhk}</div>
                        </div>
                      </div>
                    </td>
                    <td><span class="badge-locality">${p.locality}</span></td>
                    <td style="font-weight: 700; color: var(--accent-emerald);">₹${p.price.toLocaleString('en-IN')}</td>
                    <td><span style="font-size: 0.8rem; font-weight: 600;">${p.type}</span></td>
                    <td>
                      <div style="display: flex; gap: 0.25rem;">
                        ${p.zeroBrokerage ? '<span class="mini-flag mini-flag-amber">0%</span>' : ''}
                        ${p.isVerified ? '<span class="mini-flag mini-flag-emerald">🛡️</span>' : ''}
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- Mobile Card List Fallback -->
          <div class="show-mobile-flex flex-column gap-3">
            ${props.slice(0, 4).map(p => `
              <div class="mobile-dash-prop-card">
                <img src="${p.images[0]}" class="mobile-dash-prop-img" />
                <div class="mobile-dash-prop-info" style="min-width: 0; flex: 1;">
                  <div class="mobile-dash-prop-title" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.title}</div>
                  <div class="mobile-dash-prop-meta" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.locality} • ${p.bhk} • ${p.sqft} sqft</div>
                  <div class="mobile-dash-prop-price">₹${p.price.toLocaleString('en-IN')}/mo</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Right: Proprietor Card & Actions -->
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div class="admin-card-box">
            <h4 class="admin-card-title" style="margin-bottom: 1rem;">
              <i class="fa-solid fa-user-tie" style="color: var(--accent-emerald);"></i> Proprietor Details
            </h4>
            <div style="font-size: 0.9rem; line-height: 1.6;">
              <div><strong>Name:</strong> ${c.proprietor} (${c.role})</div>
              <div><strong>Phone:</strong> ${c.phone}</div>
              <div><strong>WhatsApp:</strong> ${c.whatsapp}</div>
              <div><strong>Email:</strong> ${c.email}</div>
              <div style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--text-secondary);"><strong>Office:</strong> ${c.address}</div>
            </div>
            <button class="nav-btn" data-admin-tab-goto="settings" style="width: 100%; margin-top: 1rem; justify-content: center; background: rgba(16,185,129,0.15); border: 1px solid #10b981; color: #10b981; font-size: 0.85rem;">
              <i class="fa-solid fa-pen-to-square"></i> Edit Proprietor Info
            </button>
          </div>

          <div class="admin-card-box">
            <h4 class="admin-card-title" style="margin-bottom: 0.85rem;">⚡ Quick Admin Actions</h4>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <button class="nav-btn nav-btn-primary" data-admin-tab-goto="add-property" style="justify-content: center; font-size: 0.85rem;">
                <i class="fa-solid fa-plus"></i> Post New Property
              </button>
              <button class="nav-btn" data-admin-tab-goto="leads" style="justify-content: center; font-size: 0.85rem; background: rgba(245,158,11,0.15); color: #f59e0b; border: 1px solid #f59e0b;">
                <i class="fa-solid fa-headset"></i> View ${leads.length} Tenant Leads
              </button>
            </div>
          </div>
        </div>

      </div>
    `;
  }

  if (tab === 'properties') {
    return `
      <div class="admin-card-box">
        <div class="admin-properties-header-bar">
          <div>
            <h4 style="margin: 0; font-size: 1.2rem; font-weight: 800;">Manage Property Listings (${props.length})</h4>
            <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 2px 0 0 0;">Toggle flags (Verified, 0% Brokerage, Featured) or delete properties.</p>
          </div>

          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;" class="full-width-mobile">
            <input 
              type="text" 
              id="admin-prop-search" 
              placeholder="Search property title, locality..." 
              class="admin-search-input"
            />
            <button class="nav-btn nav-btn-primary" data-admin-tab-goto="add-property" style="font-size: 0.85rem; white-space: nowrap;">
              <i class="fa-solid fa-plus"></i> Add Property
            </button>
          </div>
        </div>

        <!-- Desktop View Table -->
        <div class="hide-mobile overflow-x-auto">
          <table class="admin-data-table" id="admin-properties-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Locality</th>
                <th>Rent / Deposit</th>
                <th>Furnishing</th>
                <th>0% Brokerage</th>
                <th>Verified</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${props.map(p => `
                <tr data-prop-row-id="${p.id}">
                  <td>
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <img src="${p.images[0]}" style="width: 48px; height: 48px; border-radius: 10px; object-fit: cover;" />
                      <div>
                        <div style="font-weight: 700; font-size: 0.9rem;">${p.title}</div>
                        <div style="font-size: 0.78rem; color: var(--text-secondary);">${p.bhk} | ${p.sqft} sqft | Owner: ${p.ownerName}</div>
                      </div>
                    </div>
                  </td>
                  <td><span class="badge-locality">${p.locality}</span></td>
                  <td>
                    <div style="font-weight: 800; color: var(--accent-emerald);">₹${p.price.toLocaleString('en-IN')}/mo</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">Dep: ₹${p.deposit.toLocaleString('en-IN')}</div>
                  </td>
                  <td><span style="font-size: 0.82rem;">${p.furnishing}</span></td>
                  <td>
                    <button class="flag-toggle-btn ${p.zeroBrokerage ? 'active' : ''}" data-flag-prop="${p.id}" data-flag-name="zeroBrokerage">
                      ${p.zeroBrokerage ? '⚡ Yes (0%)' : 'No'}
                    </button>
                  </td>
                  <td>
                    <button class="flag-toggle-btn ${p.isVerified ? 'active' : ''}" data-flag-prop="${p.id}" data-flag-name="isVerified">
                      ${p.isVerified ? '🛡️ Verified' : 'Unverified'}
                    </button>
                  </td>
                  <td>
                    <button class="flag-toggle-btn ${p.isFeatured ? 'active' : ''}" data-flag-prop="${p.id}" data-flag-name="isFeatured">
                      ${p.isFeatured ? '⭐ Featured' : 'Normal'}
                    </button>
                  </td>
                  <td>
                    <div style="display: flex; gap: 0.4rem;">
                      <button class="btn-admin-del" data-del-prop="${p.id}" title="Delete Property">
                        <i class="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Mobile Card List View -->
        <div class="show-mobile-flex flex-column gap-3">
          ${props.map(p => `
            <div class="admin-mobile-manage-card" data-mobile-prop-card="${p.id}">
              <div style="display: flex; gap: 0.75rem; align-items: center;">
                <img src="${p.images[0]}" style="width: 56px; height: 56px; border-radius: 10px; object-fit: cover; flex-shrink: 0;" />
                <div style="flex: 1; min-width: 0;">
                  <div style="font-weight: 800; font-size: 0.88rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.title}</div>
                  <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.locality} • ${p.bhk} • ${p.sqft} sqft</div>
                  <div style="font-weight: 800; color: var(--accent-emerald); margin-top: 2px; font-size: 0.88rem;">₹${p.price.toLocaleString('en-IN')}/mo</div>
                </div>
                <button class="btn-admin-del" data-del-prop="${p.id}" style="align-self: center; flex-shrink: 0;" title="Delete Property">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>

              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.35rem; margin-top: 0.65rem; padding-top: 0.65rem; border-top: 1px dashed var(--border-color);">
                <button class="flag-toggle-btn ${p.zeroBrokerage ? 'active' : ''}" data-flag-prop="${p.id}" data-flag-name="zeroBrokerage" style="width: 100%; text-align: center; padding: 0.35rem 0.2rem; font-size: 0.72rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  ${p.zeroBrokerage ? '⚡ 0% Broker' : 'Brokerage'}
                </button>
                <button class="flag-toggle-btn ${p.isVerified ? 'active' : ''}" data-flag-prop="${p.id}" data-flag-name="isVerified" style="width: 100%; text-align: center; padding: 0.35rem 0.2rem; font-size: 0.72rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  ${p.isVerified ? '🛡️ Verified' : 'Unverified'}
                </button>
                <button class="flag-toggle-btn ${p.isFeatured ? 'active' : ''}" data-flag-prop="${p.id}" data-flag-name="isFeatured" style="width: 100%; text-align: center; padding: 0.35rem 0.2rem; font-size: 0.72rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  ${p.isFeatured ? '⭐ Featured' : 'Normal'}
                </button>
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    `;
  }

  if (tab === 'add-property') {
    return `
      <div class="admin-card-box admin-form-container">
        <h4 style="margin: 0 0 0.5rem 0; font-size: 1.25rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem;">
          <i class="fa-solid fa-house-medical" style="color: var(--accent-emerald);"></i> Add New Property Listing
        </h4>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
          Post a verified rental listing directly to the platform.
        </p>

        <form id="admin-add-prop-form" style="display: flex; flex-direction: column; gap: 1.25rem;">
          <div class="input-field-group">
            <label>Property Title / Headline</label>
            <input type="text" id="admin-p-title" placeholder="e.g. Prestige Heights 3BHK Luxury Apartment" required />
          </div>

          <div class="input-field-group">
            <label>Full Property Address</label>
            <input 
              type="text" 
              id="admin-p-address" 
              placeholder="e.g. Ground floor, Srinivas Residency, 2nd Main, KR Garden, Murugeshpalaya, Bangalore - 560017" 
              required 
            />
          </div>

          <div class="responsive-form-row">
            <div class="input-field-group">
              <label>Locality / Place Name</label>
              <input 
                type="text" 
                id="admin-p-locality" 
                placeholder="Type place (e.g. Indiranagar, Whitefield...)" 
                list="admin-localities-datalist" 
                required 
              />
              <datalist id="admin-localities-datalist">
                ${LOCALITIES.map(loc => `<option value="${loc}"></option>`).join('')}
              </datalist>
            </div>

            <div class="input-field-group">
              <label>BHK Type</label>
              <select id="admin-p-bhk" class="search-select">
                <option value="1bhk">1 BHK / Studio</option>
                <option value="2bhk" selected>2 BHK Apartment</option>
                <option value="3bhk">3 BHK Luxury</option>
                <option value="4bhk">4+ BHK / Villa / Godown</option>
              </select>
            </div>
          </div>

          <div class="responsive-form-row">
            <div class="input-field-group">
              <label>Monthly Rent (₹)</label>
              <input type="number" id="admin-p-price" placeholder="45000" min="5000" step="1000" inputmode="numeric" required />
            </div>

            <div class="input-field-group">
              <label>Security Deposit (₹)</label>
              <input type="number" id="admin-p-deposit" placeholder="180000" min="10000" step="5000" inputmode="numeric" required />
            </div>
          </div>

          <div class="responsive-form-row">
            <div class="input-field-group">
              <label>Built-up Area (Sq Ft)</label>
              <input type="number" id="admin-p-sqft" placeholder="1350" inputmode="numeric" required />
            </div>

            <div class="input-field-group">
              <label>Furnishing Status</label>
              <select id="admin-p-furnishing" class="search-select">
                <option value="Fully Furnished">Fully Furnished</option>
                <option value="Semi-Furnished" selected>Semi-Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </div>
          </div>

          <div class="responsive-form-row">
            <div class="input-field-group">
              <label>Owner Name</label>
              <input type="text" id="admin-p-owner-name" placeholder="Owner full name" required />
            </div>

            <div class="input-field-group">
              <label>Owner Phone</label>
              <input type="tel" id="admin-p-owner-phone" placeholder="e.g. +91 98450 12345" inputmode="tel" required />
            </div>
          </div>

          <div class="input-field-group">
            <label style="font-weight: 700; display: block; margin-bottom: 0.35rem;">
              Upload Property Photos <span style="font-weight: 400; font-size: 0.8rem; color: var(--accent-emerald);">(Mobile Camera & Laptop HD)</span>
            </label>
            <input 
              type="file" 
              id="admin-p-file" 
              accept="image/*" 
              multiple 
              style="position: absolute; width: 0.1px; height: 0.1px; opacity: 0; overflow: hidden; z-index: -1;" 
            />
            <label for="admin-p-file" id="admin-p-upload-area" class="admin-dropzone-box" style="display: block; cursor: pointer; -webkit-tap-highlight-color: transparent;">
              <div style="font-size: 2.2rem; color: var(--accent-emerald); margin-bottom: 0.4rem;">
                <i class="fa-solid fa-cloud-arrow-up"></i>
              </div>
              <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-primary);">
                Tap to Select from Mobile Camera / Gallery or Drag & Drop
              </div>
              <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem;">
                ⚡ Auto-optimizes phone camera photos (JPEG, PNG, HEIC, WEBP)
              </div>
            </label>
            <div id="admin-p-upload-status" style="display: none; margin-top: 0.5rem; font-size: 0.85rem; color: var(--accent-emerald); font-weight: 600; text-align: center;"></div>
            <div id="admin-p-image-preview" style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 0.75rem;"></div>
          </div>

          <div class="input-field-group">
            <label>Property Description</label>
            <textarea id="admin-p-desc" rows="3" placeholder="Describe property features, floor level, amenities, nearby landmarks, etc." style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary);" required></textarea>
          </div>

          <button type="submit" class="nav-btn nav-btn-primary" style="justify-content: center; padding: 0.9rem; font-size: 1rem;">
            <i class="fa-solid fa-paper-plane"></i> Publish Property to Platform
          </button>
        </form>
      </div>
    `;
  }

  if (tab === 'leads') {
    return `
      <div class="admin-card-box">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <div>
            <h4 style="margin: 0; font-size: 1.2rem; font-weight: 800;">Tenant Leads & Inquiries (${leads.length})</h4>
            <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 2px 0 0 0;">Connect directly via WhatsApp or manage visit statuses.</p>
          </div>
        </div>

        <!-- Desktop View Table -->
        <div class="hide-mobile overflow-x-auto">
          <table class="admin-data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Tenant Name</th>
                <th>Contact</th>
                <th>Property Interest</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${leads.length === 0 ? '<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">No active tenant inquiries.</td></tr>' : ''}
              ${leads.map(l => `
                <tr>
                  <td><span style="font-size: 0.82rem; color: var(--text-muted);">${l.date}</span></td>
                  <td><strong>${l.tenantName}</strong></td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                      <span style="font-weight: 700;">${l.tenantPhone}</span>
                      <a href="https://wa.me/${l.tenantPhone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(l.tenantName)},%20this%20is%20V.%20RAMANA%20from%20The%20Bangalore%20Properties%20regarding%20${encodeURIComponent(l.propertyTitle)}." target="_blank" style="color: #25D366; font-size: 1.1rem;" title="WhatsApp Tenant">
                        <i class="fa-brands fa-whatsapp"></i>
                      </a>
                    </div>
                  </td>
                  <td>
                    <div style="font-size: 0.88rem; font-weight: 600;">${l.propertyTitle}</div>
                    <div style="font-size: 0.75rem; color: var(--accent-emerald);">${l.locality}</div>
                  </td>
                  <td>
                    <select class="lead-status-select" data-lead-id="${l.id}">
                      <option value="New" ${l.status === 'New' ? 'selected' : ''}>🔴 New Lead</option>
                      <option value="Contacted" ${l.status === 'Contacted' ? 'selected' : ''}>🟡 Contacted</option>
                      <option value="Scheduled" ${l.status === 'Scheduled' ? 'selected' : ''}>🔵 Visit Scheduled</option>
                      <option value="Closed" ${l.status === 'Closed' ? 'selected' : ''}>🟢 Deal Closed</option>
                    </select>
                  </td>
                  <td>
                    <button class="btn-admin-del" data-del-lead="${l.id}" title="Delete Lead">
                      <i class="fa-solid fa-trash-can"></i>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Mobile Card View -->
        <div class="show-mobile-flex flex-column gap-3">
          ${leads.length === 0 ? '<div style="text-align: center; color: var(--text-muted); padding: 1.5rem;">No active tenant inquiries.</div>' : ''}
          ${leads.map(l => `
            <div class="admin-mobile-lead-card">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem;">
                <div style="min-width: 0; flex: 1;">
                  <div style="font-weight: 800; font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${l.tenantName}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">${l.date}</div>
                </div>
                <button class="btn-admin-del" data-del-lead="${l.id}" style="flex-shrink: 0;" title="Delete Lead">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>

              <div style="margin: 0.5rem 0; font-size: 0.85rem; min-width: 0;">
                <div style="font-weight: 700; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${l.propertyTitle}</div>
                <div style="font-size: 0.75rem; color: var(--accent-emerald);">${l.locality}</div>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-top: 0.65rem; padding-top: 0.65rem; border-top: 1px dashed var(--border-color);">
                <a href="https://wa.me/${l.tenantPhone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(l.tenantName)},%20this%20is%20V.%20RAMANA%20from%20The%20Bangalore%20Properties." target="_blank" class="nav-btn" style="background: rgba(37, 211, 102, 0.15); color: #25D366; border: 1px solid #25D366; font-size: 0.78rem; padding: 0.35rem 0.6rem; white-space: nowrap; flex-shrink: 0;">
                  <i class="fa-brands fa-whatsapp"></i> WhatsApp
                </a>

                <select class="lead-status-select" data-lead-id="${l.id}" style="flex: 1; min-width: 0; font-size: 0.78rem;">
                  <option value="New" ${l.status === 'New' ? 'selected' : ''}>🔴 New</option>
                  <option value="Contacted" ${l.status === 'Contacted' ? 'selected' : ''}>🟡 Contacted</option>
                  <option value="Scheduled" ${l.status === 'Scheduled' ? 'selected' : ''}>🔵 Scheduled</option>
                  <option value="Closed" ${l.status === 'Closed' ? 'selected' : ''}>🟢 Closed</option>
                </select>
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    `;
  }

  if (tab === 'settings') {
    return `
      <div class="admin-card-box admin-form-container">
        <h4 style="margin: 0 0 0.5rem 0; font-size: 1.25rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem;">
          <i class="fa-solid fa-sliders" style="color: var(--accent-emerald);"></i> Proprietor Business Settings
        </h4>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
          Update proprietor business contact details & office address.
        </p>

        <form id="admin-settings-form" style="display: flex; flex-direction: column; gap: 1.25rem;">
          <div class="responsive-form-row">
            <div class="input-field-group">
              <label>Proprietor Name</label>
              <input type="text" id="set-proprietor" value="${c.proprietor}" required />
            </div>

            <div class="input-field-group">
              <label>Role / Title</label>
              <input type="text" id="set-role" value="${c.role}" required />
            </div>
          </div>

          <div class="responsive-form-row">
            <div class="input-field-group">
              <label>Contact Phone Number</label>
              <input type="tel" id="set-phone" value="${c.phone}" required />
            </div>

            <div class="input-field-group">
              <label>WhatsApp Number</label>
              <input type="tel" id="set-whatsapp" value="${c.whatsapp}" required />
            </div>
          </div>

          <div class="input-field-group">
            <label>Business Email</label>
            <input type="email" id="set-email" value="${c.email}" required />
          </div>

          <div class="input-field-group">
            <label>Office Address</label>
            <textarea id="set-address" rows="2" style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary);" required>${c.address}</textarea>
          </div>

          <div class="input-field-group">
            <label>Business Slogan</label>
            <input type="text" id="set-slogan" value="${c.slogan}" required />
          </div>

          <button type="submit" class="nav-btn nav-btn-primary" style="justify-content: center; padding: 0.9rem; font-size: 1rem;">
            <i class="fa-solid fa-floppy-disk"></i> Save Proprietor Settings
          </button>
        </form>

        <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color);">
          <h5 style="margin: 0 0 0.5rem 0; font-size: 1.05rem; font-weight: 700; color: #ef4444; display: flex; align-items: center; gap: 0.5rem;">
            <i class="fa-solid fa-rotate-left"></i> Data Reset & Maintenance
          </h5>
          <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 1rem;">
            Reset property listings back to the default sample dataset if you ever need to restore deleted test properties.
          </p>
          <button type="button" id="btn-reset-default-properties" class="nav-btn" style="background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #ef4444; font-size: 0.9rem;">
            <i class="fa-solid fa-arrow-rotate-left"></i> Restore Default Sample Properties
          </button>
        </div>
      </div>
    `;
  }

  return '';
}

function attachAdminTabEvents(tab, root) {
  // Tab goto buttons
  root.querySelectorAll('[data-admin-tab-goto]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.setAdminTab(btn.dataset.adminTabGoto);
    });
  });

  if (tab === 'properties') {
    const searchInput = document.getElementById('admin-prop-search');
    searchInput?.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      // Filter desktop rows
      root.querySelectorAll('#admin-properties-table tbody tr').forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(q) ? '' : 'none';
      });
      // Filter mobile cards
      root.querySelectorAll('[data-mobile-prop-card]').forEach(card => {
        card.style.display = card.innerText.toLowerCase().includes(q) ? '' : 'none';
      });
    });

    root.querySelectorAll('.flag-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const propId = btn.dataset.flagProp;
        const flagName = btn.dataset.flagName;
        state.togglePropertyFlag(propId, flagName);
        showToast(`Updated ${flagName} flag!`);
      });
    });

    root.querySelectorAll('[data-del-prop]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const propId = btn.dataset.delProp;
        if (confirm('Are you sure you want to delete this property listing?')) {
          const res = await state.deleteProperty(propId);
          if (res && res.success) {
            showToast('🗑️ Property deleted successfully from Cloud DB.');
          } else {
            showToast(`❌ Delete failed: ${res?.error || 'Unauthorized'}. Please re-login as Admin.`);
          }
        }
      });
    });
  }

  if (tab === 'add-property') {
    const fileInput = document.getElementById('admin-p-file');
    const uploadArea = document.getElementById('admin-p-upload-area');
    const previewContainer = document.getElementById('admin-p-image-preview');
    const statusBox = document.getElementById('admin-p-upload-status');
    let uploadedImages = [];

    uploadArea?.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.style.borderColor = 'var(--accent-emerald)';
      uploadArea.style.background = 'rgba(16, 185, 129, 0.15)';
    });

    uploadArea?.addEventListener('dragleave', () => {
      uploadArea.style.borderColor = 'var(--accent-emerald)';
      uploadArea.style.background = 'rgba(16, 185, 129, 0.05)';
    });

    uploadArea?.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.style.background = 'rgba(16, 185, 129, 0.05)';
      if (e.dataTransfer.files?.length) {
        processFiles(Array.from(e.dataTransfer.files));
      }
    });

    fileInput?.addEventListener('change', (e) => {
      if (e.target.files?.length) {
        processFiles(Array.from(e.target.files));
      }
    });

    async function processFiles(files) {
      if (!files || files.length === 0) return;
      if (statusBox) {
        statusBox.style.display = 'block';
        statusBox.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Optimizing mobile photos for fast upload...';
      }

      try {
        const compressedList = await processAndCompressImages(files, (curr, total) => {
          if (statusBox) {
            statusBox.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Optimizing photo ${curr} of ${total}...`;
          }
        });

        compressedList.forEach(item => {
          uploadedImages.push(item);
        });

        if (statusBox) {
          statusBox.innerHTML = `✅ ${compressedList.length} photo(s) optimized & ready!`;
          setTimeout(() => {
            if (statusBox) statusBox.style.display = 'none';
          }, 2500);
        }
      } catch (err) {
        console.error('Error processing mobile images:', err);
        showToast('⚠️ Could not process image, please try another file.');
        if (statusBox) statusBox.style.display = 'none';
      }

      renderPreviews();
    }

    function renderPreviews() {
      if (!previewContainer) return;
      if (uploadedImages.length === 0) {
        previewContainer.innerHTML = '';
        return;
      }
      previewContainer.innerHTML = uploadedImages.map((imgItem, idx) => {
        const src = typeof imgItem === 'string' ? imgItem : imgItem.dataUrl;
        const sizeKb = imgItem.compressedSize ? `${Math.round(imgItem.compressedSize / 1024)} KB` : '';
        return `
          <div style="position: relative; display: inline-block; margin: 4px;">
            <img src="${src}" style="width: 84px; height: 84px; border-radius: 12px; object-fit: cover; border: 2px solid var(--accent-emerald); display: block;" />
            ${sizeKb ? `<span style="position: absolute; bottom: 4px; left: 4px; background: rgba(0,0,0,0.75); color: #fff; font-size: 0.65rem; padding: 1px 4px; border-radius: 4px; font-weight: 700;">${sizeKb}</span>` : ''}
            <button type="button" class="btn-remove-img" data-img-idx="${idx}" style="position: absolute; top: -8px; right: -8px; width: 28px; height: 28px; border-radius: 50%; background: #ef4444; color: #fff; border: 2px solid #fff; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.5); z-index: 10; touch-action: manipulation;" title="Remove Image">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        `;
      }).join('');

      previewContainer.querySelectorAll('[data-img-idx]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const idx = Number(btn.dataset.imgIdx);
          uploadedImages.splice(idx, 1);
          renderPreviews();
        });
      });
    }

    document.getElementById('admin-add-prop-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = e.target.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving to Neon DB...';
      }

      const title = document.getElementById('admin-p-title').value;
      const address = document.getElementById('admin-p-address').value;
      const locality = document.getElementById('admin-p-locality').value;
      const bhkType = document.getElementById('admin-p-bhk').value;
      const bhkText = bhkType === '1bhk' ? '1 BHK' : bhkType === '2bhk' ? '2 BHK' : bhkType === '3bhk' ? '3 BHK' : '4+ BHK';
      const price = Number(document.getElementById('admin-p-price').value);
      const deposit = Number(document.getElementById('admin-p-deposit').value);
      const sqft = Number(document.getElementById('admin-p-sqft').value);
      const furnishing = document.getElementById('admin-p-furnishing').value;
      const ownerName = document.getElementById('admin-p-owner-name').value;
      const ownerPhone = document.getElementById('admin-p-owner-phone').value;
      const description = document.getElementById('admin-p-desc').value;

      const propertyId = `prop-custom-${Date.now()}`;
      let finalImages = [];
      if (uploadedImages.length > 0) {
        for (let i = 0; i < uploadedImages.length; i++) {
          const imgItem = uploadedImages[i];
          const dataUrl = typeof imgItem === 'string' ? imgItem : imgItem.dataUrl;
          const fileName = (typeof imgItem === 'object' && imgItem.fileName) ? imgItem.fileName : `admin-photo-${i + 1}.jpg`;
          const mimeType = (typeof imgItem === 'object' && imgItem.mimeType) ? imgItem.mimeType : 'image/jpeg';

          if (submitBtn) {
            submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Uploading photo ${i + 1} of ${uploadedImages.length}...`;
          }

          try {
            const uploadRes = await api.uploadImage(dataUrl, propertyId, fileName, mimeType);
            if (uploadRes && uploadRes.url) {
              finalImages.push(uploadRes.url);
            } else {
              finalImages.push(dataUrl);
            }
          } catch (err) {
            console.warn('Image upload fallback to dataUrl:', err);
            finalImages.push(dataUrl);
          }
        }
      } else {
        finalImages = ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"];
      }

      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Storing in Neon DB...';
      }

      await state.addProperty({
        id: propertyId,
        title,
        locality,
        address,
        price,
        deposit,
        bhk: bhkText,
        bhkType,
        type: 'Apartment',
        furnishing,
        sqft,
        bathrooms: 2,
        floor: '3rd of 8',
        facing: 'East Facing',
        availableFrom: 'Immediate',
        preferredTenants: 'Any',
        images: finalImages,
        amenities: ['Power Backup', 'Lift', 'Car Parking', '24/7 Security'],
        description,
        ownerName,
        ownerPhone,
        ownerType: 'Direct Owner'
      });

      showToast(`✨ Property "${title}" published & stored in Neon DB!`);
      state.setAdminTab('properties');
    });
  }

  if (tab === 'leads') {
    root.querySelectorAll('.lead-status-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const leadId = select.dataset.leadId;
        state.updateLeadStatus(leadId, e.target.value);
        showToast(`Updated lead status to ${e.target.value}`);
      });
    });

    root.querySelectorAll('[data-del-lead]').forEach(btn => {
      btn.addEventListener('click', () => {
        const leadId = btn.dataset.delLead;
        if (confirm('Delete this tenant lead?')) {
          state.deleteLead(leadId);
          showToast('Lead deleted.');
        }
      });
    });
  }

  if (tab === 'settings') {
    document.getElementById('admin-settings-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const proprietor = document.getElementById('set-proprietor').value;
      const role = document.getElementById('set-role').value;
      const phone = document.getElementById('set-phone').value;
      const whatsapp = document.getElementById('set-whatsapp').value;
      const email = document.getElementById('set-email').value;
      const address = document.getElementById('set-address').value;
      const slogan = document.getElementById('set-slogan').value;

      const rawDigits = phone.replace(/\D/g, '');
      const phoneRaw = rawDigits.length === 10 ? `+91${rawDigits}` : `+${rawDigits}`;

      state.updateContactInfo({
        proprietor,
        role,
        phone,
        phoneRaw,
        whatsapp,
        email,
        address,
        slogan
      });

      showToast('💾 Proprietor settings updated across the site!');
    });

    document.getElementById('btn-reset-default-properties')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all property listings to the original default dataset? Custom added or deleted properties will be reset.')) {
        state.resetPropertiesToDefault();
        showToast('🔄 Properties restored to default sample data.');
      }
    });
  }
}
