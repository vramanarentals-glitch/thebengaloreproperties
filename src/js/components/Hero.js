import { LOCALITIES } from '../../data/properties.js';
import { state } from '../state.js';

export function renderHero() {
  const root = document.getElementById('hero-root');
  if (!root) return;

  const c = state.contactInfo;

  root.innerHTML = `
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-badge" style="background: linear-gradient(90deg, rgba(245,158,11,0.2), rgba(16,185,129,0.2)); border: 1px solid rgba(245,158,11,0.4); color: var(--text-primary); font-weight: 700;">
          <i class="fa-solid fa-crown" style="color: #f59e0b;"></i> ${c.slogan}
        </div>
        <h1 class="hero-title">
          Discover Verified <span>Rental Properties</span> in Bangalore
        </h1>
        <p class="hero-subtitle" style="margin-bottom: 1.25rem;">
          Directly managed by <strong>${c.proprietor} (${c.role})</strong> — Exclusively featuring verified Residential Rentals, Office Space Rentals & Godown Space Rentals across Bengaluru.
        </p>

        <!-- Hero Quick Place Search Bar -->
        <form id="hero-search-form" class="hero-search-box-wrapper">
          <i class="fa-solid fa-magnifying-glass-location" style="color: #10b981; font-size: 1.3rem;"></i>
          <input 
            type="text" 
            id="hero-place-search-input" 
            placeholder="Search place in Bangalore (e.g. Murugeshpalaya, Indiranagar, Bellandur)..." 
            value="${state.filters.searchQuery}"
            style="flex-grow: 1; background: transparent; border: none; outline: none; color: var(--text-primary); font-size: 0.95rem; font-weight: 500;"
          />
          <button type="submit" id="hero-place-search-btn" class="nav-btn nav-btn-primary hero-search-btn">
            Search Place
          </button>
        </form>

        <!-- Direct Proprietor Contact Banner -->
        <div class="hero-contact-card">
          <div class="hero-contact-info-block">
            <div style="width: 52px; height: 52px; border-radius: 50%; background: linear-gradient(135deg, #f59e0b, #d97706); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: #fff; flex-shrink: 0; box-shadow: 0 4px 12px rgba(245,158,11,0.4);">
              <i class="fa-solid fa-user-tie"></i>
            </div>
            <div>
              <div style="font-size: 1.25rem; font-weight: 800; color: #fff; letter-spacing: 0.5px;">${c.proprietor} <span style="font-size: 0.8rem; background: rgba(245,158,11,0.2); color: #f59e0b; padding: 2px 8px; border-radius: 4px; font-weight: 600; margin-left: 6px;">${c.role}</span></div>
              <div style="font-size: 0.85rem; color: #cbd5e1; margin-top: 2px;">
                <i class="fa-solid fa-location-dot" style="color: #f59e0b;"></i> ${c.address}
              </div>
            </div>
          </div>

          <div class="hero-action-buttons-group">
            <button id="hero-btn-book-call" class="nav-btn nav-btn-primary" style="font-weight: 700; padding: 0.65rem 1.2rem; border-radius: 10px;">
              <i class="fa-solid fa-phone-volume"></i> Book a Call
            </button>
            <a href="tel:${c.phoneRaw}" class="nav-btn" style="background: #10b981; color: #fff; font-weight: 700; border: none; padding: 0.65rem 1.2rem; border-radius: 10px;">
              <i class="fa-solid fa-phone"></i> ${c.phone}
            </a>
            <a href="https://wa.me/${c.whatsapp.replace('+', '')}?text=Hello%20V.%20Ramana,%20I%20am%20interested%20in%20your%20properties%20in%20Bangalore." target="_blank" class="nav-btn" style="background: #25D366; color: #fff; font-weight: 700; border: none; padding: 0.65rem 1.2rem; border-radius: 10px;">
              <i class="fa-brands fa-whatsapp"></i> WhatsApp
            </a>
            <button id="hero-btn-view-card" class="nav-btn" style="background: rgba(245, 158, 11, 0.2); border: 1px solid #f59e0b; color: #f59e0b; font-weight: 700; padding: 0.65rem 1.2rem; border-radius: 10px;">
              <i class="fa-solid fa-id-card"></i> View Contact Card
            </button>
          </div>
        </div>
      </div>
    </section>
  `;

  document.getElementById('hero-search-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputVal = document.getElementById('hero-place-search-input')?.value;
    if (inputVal !== undefined) {
      state.updateFilter('searchQuery', inputVal);
    }
  });

  document.getElementById('hero-place-search-input')?.addEventListener('input', (e) => {
    state.updateFilter('searchQuery', e.target.value);
  });

  document.getElementById('hero-btn-book-call')?.addEventListener('click', () => {
    state.openModal('book-call');
  });

  document.getElementById('hero-btn-view-card')?.addEventListener('click', () => {
    state.openModal('contact-us');
  });
}
