import { state } from './js/state.js';
import { renderHeader } from './js/components/Header.js';
import { renderHero } from './js/components/Hero.js';
import { renderFilters } from './js/components/Filters.js';
import { renderPropertyGrid } from './js/components/PropertyGrid.js';
import { renderPropertyModal } from './js/components/PropertyModal.js';
import { renderListPropertyModal } from './js/components/ListPropertyModal.js';
import { renderAuthModal } from './js/components/AuthModal.js';
import { renderAdminPortal } from './js/components/AdminPortal.js';
import { renderFooter } from './js/components/Footer.js';

let isInitialized = false;

function renderApp() {
  const activeEl = document.activeElement;
  const isTypingInSearch = activeEl && (
    activeEl.id === 'hero-place-search-input' || 
    activeEl.id === 'filter-search-input'
  );

  // Always render property grid results on state change
  renderPropertyGrid();

  // If user is currently typing inside search inputs, avoid destroying active input DOM elements
  if (!isTypingInSearch || !isInitialized) {
    renderHeader();
    renderHero();
    renderFilters();
    renderFooter();
  }

  // Always handle active modals & admin portal renders
  renderPropertyModal();
  renderListPropertyModal();
  renderAuthModal();
  renderAdminPortal();

  // Toggle body scroll lock & hide floating call buttons when any modal is active
  document.body.classList.toggle('modal-open', Boolean(state.activeModal));

  // Keep focus on active element if it was set
  if (activeEl && document.body.contains(activeEl)) {
    try {
      activeEl.focus();
    } catch (e) {}
  }

  isInitialized = true;
}

function checkAdminRoute() {
  const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
  const hash = window.location.hash.toLowerCase();
  if (path === '/admin' || hash === '#admin' || hash === '#/admin') {
    if (state.activeModal !== 'admin-portal') {
      state.openModal('admin-portal');
    }
  }
}

function applyUrlParams() {
  try {
    const params = new URLSearchParams(window.location.search);
    const searchVal = params.get('search') || params.get('q');
    const localityVal = params.get('locality');
    const bhkVal = params.get('bhk');
    const zeroBrokVal = params.get('zeroBrokerage');

    let changed = false;
    if (searchVal) {
      state.filters.searchQuery = searchVal;
      changed = true;
    }
    if (localityVal) {
      state.filters.locality = localityVal;
      changed = true;
    }
    if (bhkVal) {
      state.filters.bhk = bhkVal;
      changed = true;
    }
    if (zeroBrokVal === 'true' || zeroBrokVal === '1') {
      state.filters.zeroBrokerageOnly = true;
      changed = true;
    }
    if (changed) {
      state.applyFilters();
    }
  } catch (e) {
    console.warn('Error applying URL parameters:', e);
  }
}

function init() {
  // Set initial theme attribute
  document.documentElement.setAttribute('data-theme', state.theme);

  // Check if route matches /admin
  checkAdminRoute();

  // Apply SEO deep-link query parameters
  applyUrlParams();

  // Listen for browser back/forward navigation or hash changes
  window.addEventListener('popstate', checkAdminRoute);
  window.addEventListener('hashchange', checkAdminRoute);

  // Render reactive components initial
  renderApp();

  // Floating call button listener
  document.getElementById('floating-btn-book-call')?.addEventListener('click', () => {
    state.openModal('book-call');
  });

  // Subscribe to state changes for re-rendering
  state.subscribe(() => {
    renderApp();
  });
}

// Initialize on DOM Ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
