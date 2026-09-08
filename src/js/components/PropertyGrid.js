import { state } from '../state.js';

export function renderPropertyGrid() {
  const quickBarRoot = document.getElementById('quick-bar-root');
  const gridRoot = document.getElementById('property-grid-root');

  if (!gridRoot) return;

  const count = state.filteredProperties.length;

  // Render Quick Bar
  if (quickBarRoot) {
    quickBarRoot.innerHTML = `
      <div class="results-count">
        Showing <span>${count}</span> Rental Properties in Bengaluru
      </div>

      <div class="sort-container">
        <label for="sort-select" style="font-size: 0.85rem; color: var(--text-secondary); font-weight: 600;">Sort By:</label>
        <select id="sort-select" class="sort-select">
          <option value="featured" ${state.sortBy === 'featured' ? 'selected' : ''}>Featured First</option>
          <option value="price-low" ${state.sortBy === 'price-low' ? 'selected' : ''}>Price: Low to High</option>
          <option value="price-high" ${state.sortBy === 'price-high' ? 'selected' : ''}>Price: High to Low</option>
          <option value="newest" ${state.sortBy === 'newest' ? 'selected' : ''}>Newest Added</option>
        </select>
      </div>
    `;

    document.getElementById('sort-select')?.addEventListener('change', (e) => {
      state.setSortBy(e.target.value);
    });
  }

  // Handle Empty State
  if (count === 0) {
    const c = state.contactInfo;
    const searchedTerm = state.filters.searchQuery.trim() || (state.filters.locality !== 'All' ? state.filters.locality : '');
    const displayLocation = searchedTerm ? searchedTerm : 'your selected search criteria';

    const waMessage = searchedTerm
      ? `Hello V. Ramana, I searched for rental properties in "${searchedTerm}" on The Bangalore Properties website, but no active listings were displayed. Please send me available options for "${searchedTerm}".`
      : `Hello V. Ramana, I am looking for rental properties in Bangalore with my specific requirements. Please share available options.`;

    const waLink = `https://wa.me/${c.whatsapp.replace('+', '')}?text=${encodeURIComponent(waMessage)}`;

    gridRoot.innerHTML = `
      <div class="empty-state-card">
        <div class="empty-state-icon">
          <i class="fa-solid fa-map-location-dot"></i>
        </div>

        <h3 class="font-heading empty-state-title">
          No Active Properties Listed for <span class="empty-state-highlight">"${displayLocation}"</span>
        </h3>
        
        <div class="empty-state-contact-box">
          <div class="empty-state-contact-title">
            <i class="fa-solid fa-handshake-angle"></i> Please Contact Us Directly!
          </div>
          <div class="empty-state-contact-desc">
            We have unlisted & upcoming residential flats, office spaces, and godowns available in <strong>${displayLocation}</strong>. Contact Proprietor <strong>${c.proprietor} (${c.phone})</strong> on WhatsApp or phone to get instant property options!
          </div>
        </div>

        <div class="empty-state-actions">
          <!-- WhatsApp Direct Button -->
          <a 
            href="${waLink}" 
            target="_blank" 
            class="nav-btn empty-state-btn empty-state-wa-btn" 
          >
            <i class="fa-brands fa-whatsapp empty-state-wa-icon"></i> <span>Chat on WhatsApp for "${displayLocation}"</span>
          </a>

          <!-- Book a Call Button -->
          <button id="btn-empty-book-call" class="nav-btn nav-btn-primary empty-state-btn">
            <i class="fa-solid fa-phone-volume"></i> <span>Book a Call</span>
          </button>

          <!-- Reset Filters Button -->
          <button id="btn-empty-reset" class="nav-btn empty-state-btn empty-state-reset-btn">
            <i class="fa-solid fa-rotate-left"></i> <span>View All Properties</span>
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-empty-book-call')?.addEventListener('click', () => {
      state.openModal('book-call');
    });

    document.getElementById('btn-empty-reset')?.addEventListener('click', () => {
      state.resetFilters();
    });
    return;
  }

  // Render Grid Cards
  gridRoot.innerHTML = state.filteredProperties.map(p => {
    const isFav = state.isFavorite(p.id);

    return `
      <article class="property-card" data-id="${p.id}">
        <div class="card-image-wrapper">
          <img class="card-image" src="${p.images[0]}" alt="${p.title}" loading="lazy" />
          
          <div class="card-badges">
            <span class="badge" style="background: #10b981; color: #ffffff; font-weight: 800; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px;"><i class="fa-solid fa-key"></i> FOR RENT</span>
            ${p.isVerified ? `<span class="badge badge-verified"><i class="fa-solid fa-shield-halved"></i> Verified</span>` : ''}
            ${p.zeroBrokerage ? `<span class="badge badge-brokerage">0% Brokerage</span>` : ''}
            ${p.isFeatured ? `<span class="badge badge-featured">★ Featured</span>` : ''}
          </div>

          <button class="fav-toggle-btn ${isFav ? 'active' : ''}" data-fav-id="${p.id}" title="${isFav ? 'Remove from Saved' : 'Save Property'}">
            <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
          </button>
        </div>

        <div class="card-content">
          <div class="card-price-row">
            <div class="card-price">
              ₹${p.price.toLocaleString('en-IN')} <span>/mo</span>
            </div>
            <div class="card-deposit">
              Dep: ₹${(p.deposit / 1000).toFixed(0)}k
            </div>
          </div>

          <h3 class="card-title" title="${p.title}">${p.title}</h3>
          
          <div class="card-locality">
            <i class="fa-solid fa-location-dot" style="color: var(--accent-emerald);"></i> ${p.locality}, Bengaluru
          </div>

          <div class="card-specs">
            <div class="spec-item">
              <i class="fa-solid fa-bed"></i> ${p.bhk}
            </div>
            <div class="spec-item">
              <i class="fa-solid fa-ruler-combined"></i> ${p.sqft} sq ft
            </div>
            <div class="spec-item">
              <i class="fa-solid fa-bath"></i> ${p.bathrooms} Bath
            </div>
            <div class="spec-item">
              <i class="fa-solid fa-couch"></i> ${p.furnishing.split(' ')[0]}
            </div>
          </div>

          <div class="card-actions">
            <button class="btn-card-secondary btn-view-details" data-prop-id="${p.id}">
              <i class="fa-solid fa-eye"></i> Details
            </button>
            <button class="btn-card-secondary btn-book-call-card" data-prop-id="${p.id}" style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); color: #10b981; font-weight: 700;">
              <i class="fa-solid fa-phone-volume"></i> Call
            </button>
            <button class="btn-card-primary btn-schedule-visit" data-prop-id="${p.id}">
              <i class="fa-solid fa-calendar-check"></i> Book Visit
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Attach Card Event Listeners
  gridRoot.querySelectorAll('[data-fav-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.favId;
      state.toggleFavorite(id);
    });
  });

  gridRoot.querySelectorAll('.btn-view-details').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.propId;
      const prop = state.allProperties.find(p => p.id === id);
      if (prop) state.openModal('property-details', prop);
    });
  });

  gridRoot.querySelectorAll('.btn-book-call-card').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.propId;
      const prop = state.allProperties.find(p => p.id === id);
      state.openModal('book-call', prop);
    });
  });

  gridRoot.querySelectorAll('.btn-schedule-visit').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.propId;
      const prop = state.allProperties.find(p => p.id === id);
      if (prop) state.openModal('schedule-visit', prop);
    });
  });
}
