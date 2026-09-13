import { state } from '../state.js';
import { showToast } from './Toast.js';

export function renderPropertyModal() {
  const root = document.getElementById('modal-root');
  if (!root) return;

  if (!state.activeModal) {
    root.innerHTML = '';
    return;
  }

  const p = state.activeProperty;

  if (state.activeModal === 'property-details' && p) {
    root.innerHTML = `
      <div class="modal-overlay modal-overlay-details-fullscreen" id="modal-backdrop">
        <div class="modal-card modal-card-details-fullscreen">
          
          <!-- Sticky Fullscreen Top Navigation Bar -->
          <div class="details-fullscreen-topbar">
            <div class="details-fullscreen-topbar-left">
              <button type="button" class="details-back-btn" id="btn-back-details" title="Back to Properties">
                <i class="fa-solid fa-arrow-left"></i> <span>Back to Properties</span>
              </button>
              <div class="details-breadcrumb hide-mobile">
                <span>Bengaluru</span>
                <i class="fa-solid fa-chevron-right" style="font-size: 0.7rem; color: var(--text-muted);"></i>
                <span>${p.locality}</span>
                <i class="fa-solid fa-chevron-right" style="font-size: 0.7rem; color: var(--text-muted);"></i>
                <span style="font-weight: 700; color: var(--text-primary);">${p.title}</span>
              </div>
            </div>

            <div class="details-fullscreen-topbar-right">
              <div class="hide-mobile" style="text-align: right; margin-right: 0.5rem;">
                <div style="font-size: 1.25rem; font-weight: 800; color: var(--accent-emerald); line-height: 1;">
                  ₹${p.price.toLocaleString('en-IN')}<span style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 500;">/mo</span>
                </div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">Dep: ₹${p.deposit.toLocaleString('en-IN')}</div>
              </div>
              <button type="button" class="nav-btn details-edit-btn" id="btn-edit-details" style="background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; color: #10b981; font-weight: 700; padding: 0.55rem 0.95rem; font-size: 0.85rem; border-radius: 10px; cursor: pointer; display: inline-flex; align-items: center; gap: 0.45rem; text-decoration: none;" title="Edit Property Details">
                <i class="fa-solid fa-pen-to-square"></i> <span>Edit Property</span>
              </button>
              <a href="tel:${p.ownerPhone}" class="nav-btn nav-btn-primary hide-mobile" style="padding: 0.55rem 1rem; font-size: 0.85rem; border-radius: 10px; text-decoration: none;">
                <i class="fa-solid fa-phone"></i> Call Direct
              </a>
              <a href="https://wa.me/918050407710?text=${encodeURIComponent(`Hello V. Ramana, I am inquiring about "${p.title}" in ${p.locality} listed for ₹${p.price.toLocaleString('en-IN')}/mo on The Bangalore Properties.`)}" target="_blank" class="nav-btn hide-mobile" style="background: #25D366; color: #fff; border: none; padding: 0.55rem 1rem; font-size: 0.85rem; border-radius: 10px; text-decoration: none;">
                <i class="fa-brands fa-whatsapp"></i> WhatsApp
              </a>
              <button class="modal-close-btn" id="btn-close-modal" style="position: static !important; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.1); border: 1px solid var(--border-color); color: var(--text-primary); cursor: pointer;" title="Close Details">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>

          <!-- Fullscreen Scrollable Content Body -->
          <div class="details-fullscreen-body" id="details-scroll-container">
            <div class="details-fullscreen-container">

              <!-- Title & Price Header Banner -->
              <div class="details-main-header-card">
                <div style="flex: 1; min-width: 280px;">
                  <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.5rem; align-items: center;">
                    <span class="badge" style="background: #10b981; color: #fff; font-weight: 800; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px;"><i class="fa-solid fa-key"></i> FOR RENT</span>
                    ${p.isVerified ? `<span class="badge badge-verified">🛡️ Verified Property</span>` : ''}
                    <button type="button" class="badge" id="btn-badge-edit-details" style="background: rgba(16, 185, 129, 0.18); border: 1px solid #10b981; color: #10b981; font-weight: 800; font-size: 0.75rem; cursor: pointer; display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.25rem 0.65rem; border-radius: 6px;" title="Edit Property Details">
                      <i class="fa-solid fa-pen-to-square"></i> Edit Listing
                    </button>
                  </div>
                  <h1 class="details-page-title font-heading">${p.title}</h1>
                  <div class="details-page-address">
                    <i class="fa-solid fa-location-dot" style="color: var(--accent-emerald);"></i> ${p.address}
                  </div>
                </div>

                <div class="details-header-price-card">
                  <div style="font-size: 2.2rem; font-weight: 800; color: var(--accent-emerald); line-height: 1.1;">
                    ₹${p.price.toLocaleString('en-IN')} <span style="font-size: 1.05rem; color: var(--text-secondary); font-weight: 500;">/month</span>
                  </div>
                  <div style="font-size: 0.95rem; color: var(--text-secondary); margin-top: 4px;">
                    Security Deposit: <strong style="color: var(--text-primary);">₹${p.deposit.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              </div>

              <!-- Main Photo Gallery Slider (Sideways Swipeable, No Arrows) -->
              <div class="gallery-slider-wrapper details-fullscreen-gallery">
                <div class="gallery-slider-track" id="property-gallery-slider">
                  ${p.images.map((img, idx) => `
                    <div class="gallery-slide-item" data-slide-index="${idx}">
                      <div class="gallery-ambient-bg" style="background-image: url('${img}');" aria-hidden="true"></div>
                      <img class="gallery-main-img" src="${img}" alt="${p.title} - Photo ${idx + 1}" loading="${idx === 0 ? 'eager' : 'lazy'}" />
                    </div>
                  `).join('')}
                </div>

                ${p.images.length > 1 ? `
                  <div class="gallery-counter-pill" id="gallery-counter-pill">
                    <span id="gallery-active-index">1</span> / ${p.images.length}
                  </div>
                ` : ''}
              </div>

              <!-- Horizontally Scrollable Thumbnails Strip -->
              ${p.images.length > 1 ? `
                <div class="gallery-thumbs-carousel" id="gallery-thumbs-carousel" style="margin-bottom: 2rem;">
                  ${p.images.map((img, idx) => `
                    <button 
                      type="button" 
                      class="gallery-thumb-btn ${idx === 0 ? 'active' : ''}" 
                      data-thumb-index="${idx}"
                      aria-label="View Photo ${idx + 1}"
                    >
                      <img src="${img}" alt="Thumbnail ${idx + 1}" loading="lazy" />
                    </button>
                  `).join('')}
                </div>
              ` : ''}

              <!-- 2-Column Responsive Layout: Left Content (68%) & Right Sticky Contact Widget (32%) -->
              <div class="details-2col-layout">
                
                <!-- Left Column: Specs, Description, Amenities, Proximity -->
                <div class="details-main-col">

                  <!-- Key Specs Matrix Bar (Balanced 4x2 Grid) -->
                  <div class="details-specs-grid">
                    <div class="details-spec-box">
                      <div class="details-spec-icon"><i class="fa-solid fa-bed"></i></div>
                      <div class="details-spec-content">
                        <div class="details-spec-label">BHK TYPE</div>
                        <div class="details-spec-val">${p.bhk}</div>
                      </div>
                    </div>
                    <div class="details-spec-box">
                      <div class="details-spec-icon"><i class="fa-solid fa-ruler-combined"></i></div>
                      <div class="details-spec-content">
                        <div class="details-spec-label">SUPER AREA</div>
                        <div class="details-spec-val">${p.sqft} sq ft</div>
                      </div>
                    </div>
                    <div class="details-spec-box">
                      <div class="details-spec-icon"><i class="fa-solid fa-couch"></i></div>
                      <div class="details-spec-content">
                        <div class="details-spec-label">FURNISHING</div>
                        <div class="details-spec-val">${p.furnishing}</div>
                      </div>
                    </div>
                    <div class="details-spec-box">
                      <div class="details-spec-icon"><i class="fa-solid fa-stairs"></i></div>
                      <div class="details-spec-content">
                        <div class="details-spec-label">FLOOR LEVEL</div>
                        <div class="details-spec-val">${p.floor}</div>
                      </div>
                    </div>
                    <div class="details-spec-box">
                      <div class="details-spec-icon"><i class="fa-solid fa-compass"></i></div>
                      <div class="details-spec-content">
                        <div class="details-spec-label">FACING</div>
                        <div class="details-spec-val">${p.facing}</div>
                      </div>
                    </div>
                    <div class="details-spec-box">
                      <div class="details-spec-icon"><i class="fa-solid fa-bath"></i></div>
                      <div class="details-spec-content">
                        <div class="details-spec-label">BATHROOMS</div>
                        <div class="details-spec-val">${p.bathrooms || 2} Baths</div>
                      </div>
                    </div>
                    <div class="details-spec-box">
                      <div class="details-spec-icon"><i class="fa-solid fa-clock"></i></div>
                      <div class="details-spec-content">
                        <div class="details-spec-label">AVAILABLE FROM</div>
                        <div class="details-spec-val">${p.availableFrom || 'Immediate'}</div>
                      </div>
                    </div>
                    <div class="details-spec-box">
                      <div class="details-spec-icon"><i class="fa-solid fa-users"></i></div>
                      <div class="details-spec-content">
                        <div class="details-spec-label">PREFERRED TENANTS</div>
                        <div class="details-spec-val">${p.preferredTenants || 'Any'}</div>
                      </div>
                    </div>
                  </div>

                  <!-- Property Description Card -->
                  <div class="details-section-card">
                    <h3 class="details-section-heading">
                      <i class="fa-solid fa-circle-info" style="color: var(--accent-emerald);"></i> Property Overview & Description
                    </h3>
                    <p class="details-desc-text">${p.description}</p>
                  </div>

                  <!-- Society & Unit Amenities Card -->
                  <div class="details-section-card">
                    <h3 class="details-section-heading">
                      <i class="fa-solid fa-list-check" style="color: var(--accent-emerald);"></i> Society & Unit Amenities
                    </h3>
                    <div class="amenities-tag-grid">
                      ${p.amenities.map(a => `
                        <span class="amenity-chip">
                          <i class="fa-solid fa-circle-check" style="color: var(--accent-emerald);"></i> ${a}
                        </span>
                      `).join('')}
                    </div>
                  </div>


                </div>

                <!-- Right Column: Sticky Contact & Booking Widget -->
                <div class="details-side-col">
                  <div class="details-sticky-contact-card">
                    <div class="details-contact-header">
                      <div style="font-size: 0.72rem; font-weight: 800; color: var(--accent-emerald); text-transform: uppercase; letter-spacing: 0.8px;">VERIFIED PROPRIETOR LISTING</div>
                      <div style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary); margin-top: 2px;">
                        V. RAMANA <span style="font-size: 0.82rem; font-weight: 600; color: var(--text-secondary);">(Proprietor)</span>
                      </div>
                      <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 2px;">
                        The Bangalore Properties
                      </div>
                    </div>

                    <!-- Direct Actions Stack -->
                    <div class="details-contact-actions">
                      <a href="tel:${p.ownerPhone}" class="nav-btn nav-btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem 1rem; font-size: 0.95rem; font-weight: 700; border-radius: 12px; gap: 0.5rem; text-decoration: none;">
                        <i class="fa-solid fa-phone"></i> Call Directly (${p.ownerPhone})
                      </a>

                      <a href="https://wa.me/918050407710?text=${encodeURIComponent(`Hello V. Ramana, I am inquiring about "${p.title}" in ${p.locality} listed for ₹${p.price.toLocaleString('en-IN')}/mo on The Bangalore Properties.`)}" target="_blank" class="nav-btn" style="width: 100%; justify-content: center; background: #25D366; color: #fff; font-weight: 800; padding: 0.85rem 1rem; font-size: 0.95rem; border-radius: 12px; border: none; text-decoration: none; gap: 0.5rem;">
                        <i class="fa-brands fa-whatsapp" style="font-size: 1.15rem;"></i> Chat on WhatsApp
                      </a>

                      <button type="button" id="btn-modal-book-call" class="nav-btn" style="width: 100%; justify-content: center; background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; color: #10b981; font-weight: 700; padding: 0.85rem 1rem; font-size: 0.92rem; border-radius: 12px;">
                        <i class="fa-solid fa-phone-volume"></i> Request a Callback
                      </button>

                      <button type="button" id="btn-modal-schedule-tour" class="nav-btn" style="width: 100%; justify-content: center; background: var(--accent-indigo); color: #fff; border: none; font-weight: 700; padding: 0.85rem 1rem; font-size: 0.92rem; border-radius: 12px;">
                        <i class="fa-solid fa-calendar-plus"></i> Schedule Property Visit
                      </button>

                      <button type="button" id="btn-side-edit-details" class="nav-btn" style="width: 100%; justify-content: center; background: rgba(16, 185, 129, 0.12); border: 1px solid #10b981; color: #10b981; font-weight: 700; padding: 0.85rem 1rem; font-size: 0.92rem; border-radius: 12px; margin-top: 0.35rem;">
                        <i class="fa-solid fa-pen-to-square"></i> Edit Property Details
                      </button>
                    </div>

                    <!-- Office Details Box -->
                    <div class="details-office-info-box">
                      <div style="font-size: 0.72rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">OFFICE LOCATION</div>
                      <div style="font-size: 0.82rem; color: var(--text-primary); line-height: 1.45; margin-top: 4px;">
                        Ground floor, Srinivas Residency, 2nd Main, KR Garden, Murugeshpalaya, Bangalore - 560017
                      </div>
                      <div style="margin-top: 8px; font-size: 0.78rem; color: var(--accent-emerald); font-weight: 700;">
                        <i class="fa-solid fa-handshake"></i> YOUR PROPERTY, OUR PRIORITY.
                      </div>
                    </div>

                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-back-details')?.addEventListener('click', () => {
      state.closeModal();
    });

    // Setup Sideways Swipe & Drag Gallery Slider (No arrows)
    const slider = document.getElementById('property-gallery-slider');
    const counterSpan = document.getElementById('gallery-active-index');
    const thumbButtons = root.querySelectorAll('.gallery-thumb-btn');

    if (slider) {
      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;
      let isDragging = false;

      // Mouse drag for desktop sideways sliding
      slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('is-dragging');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        isDragging = false;
      });

      window.addEventListener('mouseup', () => {
        if (!isDown) return;
        isDown = false;
        slider.classList.remove('is-dragging');
        const slideWidth = slider.clientWidth;
        if (slideWidth > 0) {
          const targetIndex = Math.round(slider.scrollLeft / slideWidth);
          slider.scrollTo({ left: targetIndex * slideWidth, behavior: 'smooth' });
        }
      });

      slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.5;
        slider.scrollLeft = scrollLeft - walk;
        if (Math.abs(walk) > 5) isDragging = true;
      });

      // Touch swipe gestures specifically tuned for mobile phones (No arrows needed)
      let touchStartX = 0;
      let touchStartY = 0;
      let touchStartTime = 0;
      let touchDeltaX = 0;
      let isSwiping = false;

      slider.addEventListener('touchstart', (e) => {
        if (!e.touches || e.touches.length === 0) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
        touchDeltaX = 0;
        isSwiping = true;
      }, { passive: true });

      slider.addEventListener('touchmove', (e) => {
        if (!isSwiping || !e.touches || e.touches.length === 0) return;
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        touchDeltaX = currentX - touchStartX;
        const deltaY = currentY - touchStartY;

        // If swiping horizontally, prevent vertical scroll interference
        if (Math.abs(touchDeltaX) > Math.abs(deltaY) && Math.abs(touchDeltaX) > 10) {
          if (e.cancelable) e.preventDefault();
        }
      }, { passive: false });

      slider.addEventListener('touchend', () => {
        if (!isSwiping) return;
        isSwiping = false;
        const slideWidth = slider.clientWidth;
        const timeDiff = Date.now() - touchStartTime;
        
        // Threshold: 30px swipe or quick flick under 300ms
        const isQuickFlick = timeDiff < 300 && Math.abs(touchDeltaX) > 20;
        const isSufficientDrag = Math.abs(touchDeltaX) > 35;

        if (slideWidth > 0 && (isQuickFlick || isSufficientDrag)) {
          const currentIdx = Math.round(slider.scrollLeft / slideWidth);
          if (touchDeltaX < 0 && currentIdx < p.images.length - 1) {
            // Swiped left -> slide to next picture
            slider.scrollTo({ left: (currentIdx + 1) * slideWidth, behavior: 'smooth' });
          } else if (touchDeltaX > 0 && currentIdx > 0) {
            // Swiped right -> slide to previous picture
            slider.scrollTo({ left: (currentIdx - 1) * slideWidth, behavior: 'smooth' });
          } else {
            slider.scrollTo({ left: currentIdx * slideWidth, behavior: 'smooth' });
          }
        }
      }, { passive: true });

      // Synchronize active slide index & active thumbnail during scroll/swipe
      let scrollTimeout;
      slider.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          const slideWidth = slider.clientWidth;
          if (slideWidth <= 0) return;
          const activeIdx = Math.round(slider.scrollLeft / slideWidth);
          
          if (counterSpan) {
            counterSpan.textContent = String(activeIdx + 1);
          }

          thumbButtons.forEach((btn, idx) => {
            if (idx === activeIdx) {
              btn.classList.add('active');
              btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            } else {
              btn.classList.remove('active');
            }
          });
        }, 50);
      }, { passive: true });

      // Click thumbnail to slide smoothly to that picture
      thumbButtons.forEach((thumb) => {
        thumb.addEventListener('click', (e) => {
          e.preventDefault();
          const targetIdx = Number(thumb.dataset.thumbIndex);
          const slideWidth = slider.clientWidth;
          slider.scrollTo({
            left: targetIdx * slideWidth,
            behavior: 'smooth'
          });
        });
      });
    }

    document.getElementById('btn-modal-book-call')?.addEventListener('click', () => {
      state.openModal('book-call', p);
    });

    document.getElementById('btn-modal-schedule-tour')?.addEventListener('click', () => {
      state.openModal('schedule-visit', p);
    });

    const handleOpenEdit = (e) => {
      e?.preventDefault();
      state.openModal('edit-property', p);
    };

    document.getElementById('btn-edit-details')?.addEventListener('click', handleOpenEdit);
    document.getElementById('btn-badge-edit-details')?.addEventListener('click', handleOpenEdit);
    document.getElementById('btn-side-edit-details')?.addEventListener('click', handleOpenEdit);
  } else if (state.activeModal === 'schedule-visit' && p) {
    const today = new Date().toISOString().split('T')[0];

    root.innerHTML = `
      <div class="modal-overlay" id="modal-backdrop">
        <div class="modal-card" style="max-width: 550px;">
          <button class="modal-close-btn" id="btn-close-modal">
            <i class="fa-solid fa-xmark"></i>
          </button>

          <div class="modal-body">
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
              <div style="width: 40px; height: 40px; border-radius: 10px; background: var(--accent-emerald-light); color: var(--accent-emerald); display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
                <i class="fa-solid fa-calendar-check"></i>
              </div>
              <div>
                <h3 class="font-heading" style="font-size: 1.4rem;">Schedule Property Tour</h3>
                <p style="font-size: 0.85rem; color: var(--text-secondary);">${p.title}</p>
              </div>
            </div>

            <form id="form-schedule-visit" style="display: flex; flex-direction: column; gap: 1.25rem;">
              <div class="input-field-group">
                <label>Select Tour Date</label>
                <input type="date" id="visit-date" min="${today}" value="${today}" required />
              </div>

              <div class="input-field-group">
                <label>Preferred Time Slot</label>
                <div class="filter-pills" id="time-slot-pills">
                  <button type="button" class="pill-btn active" data-slot="10:00 AM">10:00 AM</button>
                  <button type="button" class="pill-btn" data-slot="02:00 PM">02:00 PM</button>
                  <button type="button" class="pill-btn" data-slot="05:00 PM">05:00 PM</button>
                  <button type="button" class="pill-btn" data-slot="07:00 PM">07:00 PM</button>
                </div>
              </div>

              <div class="input-field-group">
                <label>Your Full Name</label>
                <input type="text" id="visit-name" placeholder="e.g. Rahul Sharma" required />
              </div>

              <div class="input-field-group">
                <label>Mobile Number (for Visit Confirmation SMS)</label>
                <input type="tel" id="visit-phone" placeholder="+91 98765 43210" required />
              </div>

              <button type="submit" class="nav-btn nav-btn-primary" style="width: 100%; justify-content: center; padding: 0.9rem; font-size: 1rem; margin-top: 0.5rem;">
                <i class="fa-solid fa-circle-check"></i> Confirm Visit Appointment
              </button>
            </form>
          </div>
        </div>
      </div>
    `;

    // Time Slot selector
    let selectedSlot = '10:00 AM';
    root.querySelectorAll('#time-slot-pills .pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        root.querySelectorAll('#time-slot-pills .pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedSlot = btn.dataset.slot;
      });
    });

    document.getElementById('form-schedule-visit')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const date = document.getElementById('visit-date').value;
      const name = document.getElementById('visit-name').value;
      const phone = document.getElementById('visit-phone').value;

      state.addLead({
        tenantName: name,
        tenantPhone: phone,
        propertyId: p.id,
        propertyTitle: p.title,
        locality: p.locality,
        date: date,
        status: 'New',
        notes: `Property tour booked for ${date} at ${selectedSlot}. Property: ${p.title} (${p.locality})`
      });

      state.closeModal();
      showToast(`🎉 Tour Confirmed for ${name}! Appointment scheduled for ${date} at ${selectedSlot}. Confirmation SMS sent to ${phone}.`);
    });
  } else if (state.activeModal === 'contact-us') {
    const c = state.contactInfo;

    root.innerHTML = `
      <div class="modal-overlay" id="modal-backdrop">
        <div class="modal-card" style="max-width: 680px; width: 94vw; max-height: 90vh; max-height: 90dvh; overflow-y: auto; overflow-x: hidden; background: #0b0f19; border: 2px solid rgba(245, 158, 11, 0.5); box-shadow: 0 25px 60px rgba(0,0,0,0.85); padding: 0; border-radius: 20px; box-sizing: border-box;">
          <button class="modal-close-btn" id="btn-close-modal" style="top: 10px; right: 10px; background: rgba(0,0,0,0.7); color: #fff; border: 1px solid rgba(255,255,255,0.25); z-index: 20; width: 34px; height: 34px;">
            <i class="fa-solid fa-xmark"></i>
          </button>

          <!-- Digital Business Card UI Header -->
          <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-bottom: 2px solid #f59e0b; position: relative;">
            <!-- Gold Trim Curved Header -->
            <div style="background: linear-gradient(90deg, #d97706, #f59e0b, #fbbf24); padding: 0.75rem 3.5rem 0.75rem 1rem; text-align: center; color: #0b0f19; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; font-size: 0.8rem; box-shadow: 0 4px 12px rgba(0,0,0,0.3); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              <i class="fa-solid fa-building-circle-check"></i> Official Business Contact Card
            </div>

            <!-- Top Front Banner (Matching Business Card Image) -->
            <div style="padding: 1.25rem 1.25rem 1rem 1.25rem; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; border-bottom: 1px dashed rgba(245,158,11,0.3);">
              <div style="display: flex; align-items: center; gap: 0.85rem; min-width: 0;">
                <div style="width: 50px; height: 50px; border-radius: 14px; background: linear-gradient(135deg, #f59e0b, #b45309); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.7rem; flex-shrink: 0; box-shadow: 0 6px 16px rgba(245,158,11,0.4);">
                  <i class="fa-solid fa-city"></i>
                </div>
                <div style="min-width: 0;">
                  <div style="font-family: 'Outfit', sans-serif; font-size: 1.4rem; font-weight: 800; color: #ffffff; line-height: 1.15; letter-spacing: -0.3px; word-break: break-word;">
                    The Bangalore <span style="color: #f59e0b;">Properties</span>
                  </div>
                  <div style="font-size: 0.65rem; font-weight: 700; color: #94a3b8; letter-spacing: 0.5px; margin-top: 4px; line-height: 1.3;">
                    RENT • LEASE • SALE • OFFICE • GODOWN
                  </div>
                </div>
              </div>

              <!-- Top Right Highlight -->
              <div style="background: rgba(245,158,11,0.15); border: 1px solid #f59e0b; padding: 0.65rem 1rem; border-radius: 12px; text-align: left; flex: 1; min-width: 170px;">
                <div style="font-size: 1.15rem; font-weight: 900; color: #ffffff; font-family: 'Outfit', sans-serif;">${c.proprietor}</div>
                <div style="font-size: 0.9rem; font-weight: 700; color: #f59e0b; white-space: nowrap;">
                  <i class="fa-solid fa-phone"></i> ${c.phone}
                </div>
              </div>
            </div>

            <!-- Card Bottom Banner with Slogan (Matching Business Card Image) -->
            <div style="background: linear-gradient(90deg, #0f172a, #1e1b4b); padding: 0.85rem 1.25rem; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.1);">
              <div style="font-size: 0.78rem; color: #cbd5e1;">
                <span style="color: #f59e0b; font-weight: 700;">PROPRIETOR:</span> ${c.proprietor}
              </div>
              <div style="font-family: 'Outfit', sans-serif; font-size: 0.95rem; font-weight: 900; color: #fbbf24; letter-spacing: 0.5px; text-shadow: 0 0 10px rgba(245,158,11,0.5);">
                YOUR PROPERTY, OUR PRIORITY.
              </div>
            </div>
          </div>

          <!-- Business Card Details Body -->
          <div style="padding: 1.25rem; background: #0f172a;">
            <div style="display: flex; flex-direction: column; gap: 0.85rem; margin-bottom: 1.25rem;">

              <div class="contact-detail-row">
                <div style="width: 42px; height: 42px; border-radius: 10px; background: rgba(245,158,11,0.15); color: #f59e0b; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; flex-shrink: 0;">
                  <i class="fa-solid fa-user-tie"></i>
                </div>
                <div style="flex: 1; min-width: 0;">
                  <div style="font-size: 0.72rem; color: #94a3b8; font-weight: 600;">CONTACT PERSON</div>
                  <div style="font-size: 1rem; font-weight: 800; color: #f8fafc;">${c.proprietor} (${c.role})</div>
                </div>
              </div>

              <div class="contact-detail-row">
                <div style="width: 42px; height: 42px; border-radius: 10px; background: rgba(37,211,102,0.15); color: #25D366; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; flex-shrink: 0;">
                  <i class="fa-brands fa-whatsapp"></i>
                </div>
                <div style="flex: 1; min-width: 140px;">
                  <div style="font-size: 0.72rem; color: #94a3b8; font-weight: 600;">WHATSAPP & PHONE</div>
                  <div style="font-size: 1.05rem; font-weight: 800; color: #f8fafc; white-space: nowrap;">${c.phone}</div>
                </div>
                <a href="https://wa.me/${c.whatsapp.replace('+', '')}?text=Hello%20V.%20Ramana,%20I%20want%20to%20inquire%20about%20properties%20in%20Bangalore." target="_blank" class="nav-btn" style="background: #25D366; color: #fff; border: none; font-weight: 800; padding: 0.5rem 0.85rem; font-size: 0.82rem; border-radius: 10px; flex-shrink: 0; white-space: nowrap;">
                  <i class="fa-brands fa-whatsapp"></i> WhatsApp
                </a>
              </div>

              <div class="contact-detail-row">
                <div style="width: 42px; height: 42px; border-radius: 10px; background: rgba(239,68,68,0.15); color: #ef4444; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; flex-shrink: 0;">
                  <i class="fa-solid fa-envelope"></i>
                </div>
                <div style="flex: 1; min-width: 140px;">
                  <div style="font-size: 0.72rem; color: #94a3b8; font-weight: 600;">EMAIL ADDRESS</div>
                  <div style="font-size: 0.9rem; font-weight: 700; color: #f8fafc; word-break: break-all;">${c.email}</div>
                </div>
                <a href="mailto:${c.email}" class="nav-btn" style="background: rgba(239,68,68,0.2); color: #ef4444; border: 1px solid #ef4444; padding: 0.45rem 0.8rem; font-size: 0.82rem; flex-shrink: 0; white-space: nowrap;">
                  Email Us
                </a>
              </div>

              <div class="contact-detail-row" style="align-items: flex-start;">
                <div style="width: 42px; height: 42px; border-radius: 10px; background: rgba(99,102,241,0.15); color: #6366f1; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; flex-shrink: 0; margin-top: 2px;">
                  <i class="fa-solid fa-location-dot"></i>
                </div>
                <div style="flex: 1; min-width: 0;">
                  <div style="font-size: 0.72rem; color: #94a3b8; font-weight: 600;">OFFICE ADDRESS</div>
                  <div style="font-size: 0.88rem; font-weight: 700; color: #f8fafc; line-height: 1.45; margin-top: 2px;">
                    Ground floor, Srinivas Residency,<br/>
                    2nd Main, KR Garden, Murugeshpalaya,<br/>
                    Bangalore - 560017
                  </div>
                </div>
              </div>

            </div>

            <!-- Services Offered Bottom Strip -->
            <div style="background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.3); padding: 0.75rem; border-radius: 12px; text-align: center; margin-bottom: 1rem;">
              <div style="font-size: 0.68rem; font-weight: 800; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px;">PROPERTY SERVICES OFFERED</div>
              <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.4rem;">
                ${c.services.map(s => `
                  <span style="background: rgba(0,0,0,0.4); color: #fff; font-size: 0.72rem; font-weight: 700; padding: 3px 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1);">
                    ${s}
                  </span>
                `).join('')}
              </div>
            </div>

            <!-- Quick Buttons -->
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <a href="https://wa.me/${c.whatsapp.replace('+', '')}?text=Hello%20V.%20Ramana,%20I%20got%20your%20contact%20card%20and%20I%20want%20to%20inquire%20about%20properties%20in%20Bangalore." target="_blank" class="nav-btn" style="flex: 1; min-width: 140px; background: #25D366; color: #fff; font-weight: 800; justify-content: center; padding: 0.8rem;">
                <i class="fa-brands fa-whatsapp"></i> Chat on WhatsApp
              </a>
              <button id="btn-copy-card-details" class="nav-btn" style="flex: 1; min-width: 140px; background: rgba(255,255,255,0.1); color: #fff; border: 1px solid var(--border-color); font-weight: 700; justify-content: center; padding: 0.8rem;">
                <i class="fa-solid fa-copy"></i> Copy Details
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-copy-card-details')?.addEventListener('click', () => {
      const textToCopy = `The Bangalore Properties\nProprietor: V. RAMANA\nPhone: +91 80504 07710\nEmail: ramuramana92@gmail.com\nAddress: Ground floor, Srinivas Residency, 2nd Main, KR Garden, Murugeshpalaya, Bangalore - 560017\nSlogan: YOUR PROPERTY, OUR PRIORITY.\nServices: Rent, Lease, Sale, Office Space, Godown Space, etc.`;
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast('📋 Contact details copied to clipboard!');
      }).catch(() => {
        showToast('📋 V. RAMANA (+91 80504 07710)');
      });
    });
  } else if (state.activeModal === 'book-call') {
    const today = new Date().toISOString().split('T')[0];
    const c = state.contactInfo;

    root.innerHTML = `
      <div class="modal-overlay" id="modal-backdrop">
        <div class="modal-card modal-card-book-call" style="max-width: 580px; width: 94vw; max-height: 90vh; max-height: 90dvh; display: flex; flex-direction: column; overflow: hidden; background: #0f172a; border: 2px solid rgba(16, 185, 129, 0.5); box-shadow: 0 25px 60px rgba(0,0,0,0.85); border-radius: 20px; box-sizing: border-box;">
          
          <!-- Sticky Pinned Modal Header -->
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 1.15rem 1.35rem; border-bottom: 1px solid rgba(255,255,255,0.1); background: #0f172a; flex-shrink: 0; border-top-left-radius: 18px; border-top-right-radius: 18px;">
            <div style="display: flex; align-items: center; gap: 0.75rem; min-width: 0; flex: 1;">
              <div style="width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #10b981, #059669); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);">
                <i class="fa-solid fa-phone-volume"></i>
              </div>
              <div style="min-width: 0; flex: 1;">
                <h3 class="font-heading" style="font-size: 1.2rem; color: #fff; line-height: 1.2; margin: 0;">Book a Callback</h3>
                <p style="font-size: 0.78rem; color: #10b981; font-weight: 700; margin: 2px 0 0 0;">
                  With Proprietor ${c.proprietor} (${c.phone})
                </p>
              </div>
            </div>

            <button class="modal-close-btn" id="btn-close-modal" style="position: static !important; width: 34px; height: 34px; background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2); flex-shrink: 0; margin-left: 0.75rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease;" title="Close Modal">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <!-- Scrollable Body Container -->
          <div class="modal-body" style="flex: 1 1 0%; min-height: 0; overflow-y: auto; -webkit-overflow-scrolling: touch; touch-action: pan-y; padding: 1.25rem 1.35rem 2rem 1.35rem; box-sizing: border-box;">
            <form id="form-book-call" style="display: flex; flex-direction: column; gap: 1rem;">
              <div class="modal-grid-2col">
                <div class="input-field-group">
                  <label style="font-weight: 700; color: #e2e8f0; font-size: 0.85rem; margin-bottom: 0.35rem;">Your Full Name *</label>
                  <input type="text" id="book-call-name" placeholder="e.g. Anand Sharma" required style="background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); color: #fff; padding: 0.75rem; border-radius: 10px; font-size: 0.92rem; width: 100%; box-sizing: border-box;" />
                </div>
                <div class="input-field-group">
                  <label style="font-weight: 700; color: #e2e8f0; font-size: 0.85rem; margin-bottom: 0.35rem;">Mobile Number *</label>
                  <input type="tel" id="book-call-phone" placeholder="+91 98765 43210" required style="background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); color: #fff; padding: 0.75rem; border-radius: 10px; font-size: 0.92rem; width: 100%; box-sizing: border-box;" />
                </div>
              </div>

              <div class="modal-grid-2col">
                <div class="input-field-group">
                  <label style="font-weight: 700; color: #e2e8f0; font-size: 0.85rem; margin-bottom: 0.35rem;">Preferred Service</label>
                  <select id="book-call-service" style="background: rgba(15,23,42,0.95); border: 1px solid var(--border-color); color: #fff; padding: 0.75rem; border-radius: 10px; font-size: 0.92rem; width: 100%; box-sizing: border-box;">
                    <option value="Residential Rental">Residential Rental (Flat/House)</option>
                    <option value="Commercial Office Space">Commercial Office Space</option>
                    <option value="Godown / Warehouse">Godown / Warehouse Space</option>
                    <option value="Long Term Lease">Long Term Lease</option>
                    <option value="General Property Consultation">General Property Consultation</option>
                  </select>
                </div>
                <div class="input-field-group">
                  <label style="font-weight: 700; color: #e2e8f0; font-size: 0.85rem; margin-bottom: 0.35rem;">Preferred Locality</label>
                  <input type="text" id="book-call-locality" placeholder="e.g. Murugeshpalaya, Indiranagar" style="background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); color: #fff; padding: 0.75rem; border-radius: 10px; font-size: 0.92rem; width: 100%; box-sizing: border-box;" />
                </div>
              </div>

              <div class="modal-grid-2col">
                <div class="input-field-group">
                  <label style="font-weight: 700; color: #e2e8f0; font-size: 0.85rem; margin-bottom: 0.35rem;">Preferred Call Date *</label>
                  <input type="date" id="book-call-date" min="${today}" value="${today}" required style="background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); color: #fff; padding: 0.75rem; border-radius: 10px; font-size: 0.92rem; width: 100%; box-sizing: border-box;" />
                </div>
                <div class="input-field-group">
                  <label style="font-weight: 700; color: #e2e8f0; font-size: 0.85rem; margin-bottom: 0.35rem;">Preferred Time Slot</label>
                  <select id="book-call-slot" style="background: rgba(15,23,42,0.95); border: 1px solid var(--border-color); color: #fff; padding: 0.75rem; border-radius: 10px; font-size: 0.92rem; width: 100%; box-sizing: border-box;">
                    <option value="Morning (09:00 AM - 12:00 PM)">Morning (09:00 AM - 12:00 PM)</option>
                    <option value="Afternoon (12:00 PM - 04:00 PM)">Afternoon (12:00 PM - 04:00 PM)</option>
                    <option value="Evening (04:00 PM - 08:00 PM)">Evening (04:00 PM - 08:00 PM)</option>
                  </select>
                </div>
              </div>

              <div class="input-field-group">
                <label style="font-weight: 700; color: #e2e8f0; font-size: 0.85rem; margin-bottom: 0.35rem;">Notes / Requirements (Optional)</label>
                <textarea id="book-call-notes" rows="2" placeholder="e.g. Budget ₹30k - ₹40k, 2BHK furnished near Tech Park..." style="background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); color: #fff; padding: 0.75rem; border-radius: 10px; resize: vertical; font-size: 0.92rem; width: 100%; box-sizing: border-box;"></textarea>
              </div>

              <!-- Full-Width Responsive Action Buttons (Never Cut Off) -->
              <div class="book-call-action-btns" style="display: flex; flex-direction: column; gap: 0.65rem; margin-top: 0.75rem; padding-bottom: 0.5rem;">
                <button type="submit" class="nav-btn nav-btn-primary" style="width: 100%; justify-content: center; padding: 0.9rem 1rem; font-size: 0.98rem; font-weight: 800; border-radius: 12px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35); display: flex; align-items: center; gap: 0.5rem; text-align: center;">
                  <i class="fa-solid fa-phone-volume"></i> Confirm & Book Callback
                </button>
                <a href="https://wa.me/${c.whatsapp.replace('+', '')}?text=Hello%20V.%20Ramana,%20I%20would%20like%20to%20book%20a%20call%20regarding%20properties." target="_blank" class="nav-btn" style="width: 100%; justify-content: center; background: #25D366; color: #fff; font-weight: 800; padding: 0.85rem 1rem; font-size: 0.95rem; border-radius: 12px; border: none; text-decoration: none; display: flex; align-items: center; gap: 0.5rem; box-shadow: 0 4px 14px rgba(37, 211, 102, 0.3); text-align: center;">
                  <i class="fa-brands fa-whatsapp" style="font-size: 1.2rem;"></i> Chat on WhatsApp
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    document.getElementById('form-book-call')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('book-call-name').value.trim();
      const phone = document.getElementById('book-call-phone').value.trim();
      const service = document.getElementById('book-call-service').value;
      const locality = document.getElementById('book-call-locality').value.trim() || 'Bangalore';
      const date = document.getElementById('book-call-date').value;
      const slot = document.getElementById('book-call-slot').value;
      const notes = document.getElementById('book-call-notes').value.trim();

      // Store in State -> automatically updates Admin Portal leads!
      state.addLead({
        tenantName: name,
        tenantPhone: phone,
        propertyTitle: `Booked Call: ${service}`,
        locality: locality,
        date: date,
        notes: `Call Scheduled for ${date} [${slot}]. Service: ${service}. ${notes ? 'Notes: ' + notes : ''}`
      });

      state.closeModal();
      showToast(`📞 Call Request Booked! Proprietor ${c.proprietor} will contact ${name} on ${date} (${slot}).`);

      // Launch direct WhatsApp confirmation
      const waMsg = `Hello V. Ramana, I have requested a callback on ${date} (${slot}) regarding ${service} in ${locality}.\nName: ${name}\nPhone: ${phone}${notes ? '\nNote: ' + notes : ''}`;
      window.open(`https://wa.me/${c.whatsapp.replace('+', '')}?text=${encodeURIComponent(waMsg)}`, '_blank');
    });
  } else if (state.activeModal === 'edit-property' && p) {
    let currentPhotos = Array.isArray(p.images) && p.images.length > 0 ? [...p.images] : [];

    root.innerHTML = `
      <div class="modal-overlay modal-overlay-details-fullscreen" id="modal-backdrop" style="background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(12px); overflow-y: auto; padding: 1.5rem 1rem; display: flex; align-items: center; justify-content: center;">
        <div class="modal-card edit-modal-card" style="max-width: 840px; width: 100%; max-height: 92vh; margin: auto; background: var(--bg-surface); border-radius: 20px; border: 1px solid var(--border-color); box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6); overflow: hidden; display: flex; flex-direction: column;">
          
          <!-- Sticky Top Header -->
          <div style="background: var(--bg-surface); border-bottom: 1px solid var(--border-color); padding: 1.15rem 1.5rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-shrink: 0;">
            <div style="display: flex; align-items: center; gap: 0.85rem;">
              <button type="button" class="details-back-btn" id="btn-back-from-edit" style="padding: 0.45rem 0.85rem; font-size: 0.82rem;">
                <i class="fa-solid fa-arrow-left"></i> <span>Back to Details</span>
              </button>
              <div>
                <h3 class="font-heading" style="margin: 0; font-size: 1.25rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.45rem;">
                  <i class="fa-solid fa-pen-to-square" style="color: var(--accent-emerald);"></i> Edit Property Details
                </h3>
                <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 2px;">
                  Editing: <strong style="color: var(--text-primary);">${p.title}</strong> (${p.locality})
                </div>
              </div>
            </div>
            <button class="modal-close-btn" id="btn-close-edit" style="position: static !important; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.08); border: 1px solid var(--border-color); color: var(--text-primary); cursor: pointer;" title="Close Edit">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <!-- Scrollable Edit Form Body -->
          <div style="flex: 1 1 0%; min-height: 0; overflow-y: auto; -webkit-overflow-scrolling: touch; padding: 1.5rem 1.75rem 2.5rem 1.75rem; box-sizing: border-box;">
            <form id="form-edit-property" style="display: flex; flex-direction: column; gap: 1.25rem;">
              
              <!-- Title & Locality -->
              <div class="modal-grid-2col">
                <div class="input-field-group">
                  <label style="font-weight: 700; color: var(--text-primary); font-size: 0.85rem; margin-bottom: 0.35rem; display: block;">Property Title *</label>
                  <input type="text" id="edit-p-title" value="${p.title ? p.title.replace(/"/g, '&quot;') : ''}" required style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.92rem; box-sizing: border-box;" />
                </div>
                <div class="input-field-group">
                  <label style="font-weight: 700; color: var(--text-primary); font-size: 0.85rem; margin-bottom: 0.35rem; display: block;">Locality / Area *</label>
                  <input type="text" id="edit-p-locality" value="${p.locality ? p.locality.replace(/"/g, '&quot;') : ''}" list="edit-localities-datalist" required style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.92rem; box-sizing: border-box;" />
                  <datalist id="edit-localities-datalist">
                    <option value="Murugeshpalaya"></option>
                    <option value="Indiranagar"></option>
                    <option value="Koramangala"></option>
                    <option value="Whitefield"></option>
                    <option value="HSR Layout"></option>
                    <option value="Domlur"></option>
                    <option value="HAL"></option>
                    <option value="Marathahalli"></option>
                    <option value="Old Airport Road"></option>
                    <option value="Bellandur"></option>
                    <option value="Electronic City"></option>
                    <option value="JP Nagar"></option>
                    <option value="Jayanagar"></option>
                    <option value="BTM Layout"></option>
                    <option value="Hebbal"></option>
                    <option value="Sarjapur Road"></option>
                  </datalist>
                </div>
              </div>

              <!-- Address -->
              <div class="input-field-group">
                <label style="font-weight: 700; color: var(--text-primary); font-size: 0.85rem; margin-bottom: 0.35rem; display: block;">Full Address *</label>
                <input type="text" id="edit-p-address" value="${p.address ? p.address.replace(/"/g, '&quot;') : ''}" required style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.92rem; box-sizing: border-box;" />
              </div>

              <!-- Rent, Deposit, BHK, Super Area -->
              <div class="modal-grid-2col">
                <div class="input-field-group">
                  <label style="font-weight: 700; color: var(--text-primary); font-size: 0.85rem; margin-bottom: 0.35rem; display: block;">Monthly Rent (₹) *</label>
                  <input type="number" id="edit-p-price" value="${p.price}" min="1000" step="500" required style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.92rem; box-sizing: border-box;" />
                </div>
                <div class="input-field-group">
                  <label style="font-weight: 700; color: var(--text-primary); font-size: 0.85rem; margin-bottom: 0.35rem; display: block;">Security Deposit (₹) *</label>
                  <input type="number" id="edit-p-deposit" value="${p.deposit}" min="1000" step="1000" required style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.92rem; box-sizing: border-box;" />
                </div>
              </div>

              <div class="modal-grid-2col">
                <div class="input-field-group">
                  <label style="font-weight: 700; color: var(--text-primary); font-size: 0.85rem; margin-bottom: 0.35rem; display: block;">BHK Type *</label>
                  <select id="edit-p-bhk" style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.92rem; box-sizing: border-box;">
                    <option value="1 BHK" ${p.bhk === '1 BHK' ? 'selected' : ''}>1 BHK</option>
                    <option value="2 BHK" ${p.bhk === '2 BHK' || p.bhk?.includes('2') ? 'selected' : ''}>2 BHK</option>
                    <option value="3 BHK" ${p.bhk === '3 BHK' || p.bhk?.includes('3') ? 'selected' : ''}>3 BHK</option>
                    <option value="4+ BHK" ${p.bhk === '4+ BHK' || p.bhk?.includes('4') ? 'selected' : ''}>4+ BHK / Villa</option>
                  </select>
                </div>
                <div class="input-field-group">
                  <label style="font-weight: 700; color: var(--text-primary); font-size: 0.85rem; margin-bottom: 0.35rem; display: block;">Super Area (sq ft) *</label>
                  <input type="number" id="edit-p-sqft" value="${p.sqft}" min="50" step="10" required style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.92rem; box-sizing: border-box;" />
                </div>
              </div>

              <!-- Furnishing, Floor, Facing, Bathrooms -->
              <div class="modal-grid-2col">
                <div class="input-field-group">
                  <label style="font-weight: 700; color: var(--text-primary); font-size: 0.85rem; margin-bottom: 0.35rem; display: block;">Furnishing *</label>
                  <select id="edit-p-furnishing" style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.92rem; box-sizing: border-box;">
                    <option value="Semi-Furnished" ${p.furnishing === 'Semi-Furnished' ? 'selected' : ''}>Semi-Furnished</option>
                    <option value="Fully Furnished" ${p.furnishing === 'Fully Furnished' ? 'selected' : ''}>Fully Furnished</option>
                    <option value="Unfurnished" ${p.furnishing === 'Unfurnished' ? 'selected' : ''}>Unfurnished</option>
                  </select>
                </div>
                <div class="input-field-group">
                  <label style="font-weight: 700; color: var(--text-primary); font-size: 0.85rem; margin-bottom: 0.35rem; display: block;">Floor Level *</label>
                  <input type="text" id="edit-p-floor" value="${p.floor ? p.floor.replace(/"/g, '&quot;') : 'Ground Floor'}" list="edit-floor-datalist" required style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.92rem; box-sizing: border-box;" />
                  <datalist id="edit-floor-datalist">
                    <option value="Ground Floor"></option>
                    <option value="1st Floor"></option>
                    <option value="2nd Floor"></option>
                    <option value="3rd Floor"></option>
                    <option value="3rd of 8"></option>
                    <option value="4th Floor"></option>
                    <option value="5th Floor"></option>
                    <option value="Top Floor / Penthouse"></option>
                  </datalist>
                </div>
              </div>

              <div class="modal-grid-2col">
                <div class="input-field-group">
                  <label style="font-weight: 700; color: var(--text-primary); font-size: 0.85rem; margin-bottom: 0.35rem; display: block;">Facing (Direction)</label>
                  <select id="edit-p-facing" style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.92rem; box-sizing: border-box;">
                    <option value="East Facing" ${p.facing === 'East Facing' ? 'selected' : ''}>East Facing</option>
                    <option value="North Facing" ${p.facing === 'North Facing' ? 'selected' : ''}>North Facing</option>
                    <option value="North-East Facing" ${p.facing === 'North-East Facing' ? 'selected' : ''}>North-East Facing</option>
                    <option value="West Facing" ${p.facing === 'West Facing' ? 'selected' : ''}>West Facing</option>
                    <option value="South Facing" ${p.facing === 'South Facing' ? 'selected' : ''}>South Facing</option>
                    <option value="South-East Facing" ${p.facing === 'South-East Facing' ? 'selected' : ''}>South-East Facing</option>
                    <option value="North-West Facing" ${p.facing === 'North-West Facing' ? 'selected' : ''}>North-West Facing</option>
                    <option value="South-West Facing" ${p.facing === 'South-West Facing' ? 'selected' : ''}>South-West Facing</option>
                  </select>
                </div>
                <div class="input-field-group">
                  <label style="font-weight: 700; color: var(--text-primary); font-size: 0.85rem; margin-bottom: 0.35rem; display: block;">Number of Bathrooms</label>
                  <select id="edit-p-bathrooms" style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.92rem; box-sizing: border-box;">
                    <option value="1" ${Number(p.bathrooms) === 1 ? 'selected' : ''}>1 Bathroom</option>
                    <option value="2" ${Number(p.bathrooms || 2) === 2 ? 'selected' : ''}>2 Bathrooms</option>
                    <option value="3" ${Number(p.bathrooms) === 3 ? 'selected' : ''}>3 Bathrooms</option>
                    <option value="4" ${Number(p.bathrooms) >= 4 ? 'selected' : ''}>4+ Bathrooms</option>
                  </select>
                </div>
              </div>

              <div class="modal-grid-2col">
                <div class="input-field-group">
                  <label style="font-weight: 700; color: var(--text-primary); font-size: 0.85rem; margin-bottom: 0.35rem; display: block;">Available From</label>
                  <input type="text" id="edit-p-available" value="${p.availableFrom ? p.availableFrom.replace(/"/g, '&quot;') : 'Immediate'}" placeholder="e.g. Immediate, 1st of Next Month" style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.92rem; box-sizing: border-box;" />
                </div>
                <div class="input-field-group">
                  <label style="font-weight: 700; color: var(--text-primary); font-size: 0.85rem; margin-bottom: 0.35rem; display: block;">Preferred Tenants</label>
                  <select id="edit-p-tenants" style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.92rem; box-sizing: border-box;">
                    <option value="Any" ${p.preferredTenants === 'Any' ? 'selected' : ''}>Any (Family or Bachelors)</option>
                    <option value="Family Only" ${p.preferredTenants === 'Family Only' ? 'selected' : ''}>Family Only</option>
                    <option value="Bachelors Only" ${p.preferredTenants === 'Bachelors Only' ? 'selected' : ''}>Bachelors Only</option>
                    <option value="Company Lease" ${p.preferredTenants === 'Company Lease' ? 'selected' : ''}>Company Lease</option>
                  </select>
                </div>
              </div>

              <!-- Amenities Checkboxes -->
              <div class="input-field-group">
                <label style="font-weight: 700; color: var(--text-primary); font-size: 0.85rem; margin-bottom: 0.6rem; display: block;">
                  <i class="fa-solid fa-list-check" style="color: var(--accent-emerald);"></i> Society & Unit Amenities
                </label>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 0.65rem;">
                  ${[
                    { id: 'Power Backup', icon: 'fa-bolt', name: 'Power Backup' },
                    { id: 'Lift', icon: 'fa-arrows-up-down', name: 'Lift' },
                    { id: 'Car Parking', icon: 'fa-square-parking', name: 'Car Parking' },
                    { id: '24/7 Security', icon: 'fa-shield-halved', name: '24/7 Security' },
                    { id: 'Gym', icon: 'fa-dumbbell', name: 'Gym / Fitness Center' },
                    { id: 'Swimming Pool', icon: 'fa-person-swimming', name: 'Swimming Pool' },
                    { id: 'Clubhouse', icon: 'fa-champagne-glasses', name: 'Clubhouse' },
                    { id: 'CCTV', icon: 'fa-video', name: 'CCTV Surveillance' },
                    { id: 'Gas Pipeline', icon: 'fa-fire-burner', name: 'Piped Gas' },
                    { id: 'Children Play Area', icon: 'fa-children', name: 'Children Play Area' }
                  ].map(am => {
                    const isChecked = (p.amenities || []).some(a => a.toLowerCase().includes(am.id.toLowerCase()));
                    return `
                      <label style="display: flex; align-items: center; gap: 0.6rem; padding: 0.6rem 0.85rem; border-radius: 10px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); cursor: pointer; font-size: 0.84rem; font-weight: 600;">
                        <input type="checkbox" name="edit-amenity" value="${am.name}" ${isChecked ? 'checked' : ''} style="accent-color: var(--accent-emerald); width: 16px; height: 16px;" />
                        <i class="fa-solid ${am.icon}" style="color: var(--accent-emerald); width: 16px; text-align: center;"></i>
                        <span>${am.name}</span>
                      </label>
                    `;
                  }).join('')}
                </div>
              </div>

              <!-- Photos Management -->
              <div class="input-field-group">
                <label style="font-weight: 700; color: var(--text-primary); font-size: 0.85rem; margin-bottom: 0.45rem; display: block;">
                  <i class="fa-solid fa-images" style="color: var(--accent-emerald);"></i> Property Photos (<span id="edit-photos-count">${currentPhotos.length}</span>)
                </label>
                
                <div id="edit-photos-preview" style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 0.85rem;"></div>

                <input type="file" id="edit-p-file" accept="image/*" multiple style="display: none;" />
                <label for="edit-p-file" id="edit-p-dropzone" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1.25rem; border: 2px dashed rgba(16, 185, 129, 0.4); border-radius: 14px; background: rgba(16, 185, 129, 0.05); cursor: pointer; text-align: center;">
                  <i class="fa-solid fa-cloud-arrow-up" style="font-size: 1.8rem; color: var(--accent-emerald); margin-bottom: 0.4rem;"></i>
                  <span style="font-size: 0.9rem; font-weight: 700; color: var(--text-primary);">Tap to Add More Photos from Camera / Gallery</span>
                  <span style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">Supports mobile phone photos & HD desktop pictures</span>
                </label>
                <div id="edit-p-upload-status" style="display: none; margin-top: 0.4rem; font-size: 0.82rem; color: var(--accent-emerald); font-weight: 600; text-align: center;"></div>
              </div>

              <!-- Description -->
              <div class="input-field-group">
                <label style="font-weight: 700; color: var(--text-primary); font-size: 0.85rem; margin-bottom: 0.35rem; display: block;">Property Description</label>
                <textarea id="edit-p-desc" rows="3" style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.92rem; box-sizing: border-box;">${p.description || ''}</textarea>
              </div>

              <!-- Owner Name & Phone -->
              <div class="modal-grid-2col">
                <div class="input-field-group">
                  <label style="font-weight: 700; color: var(--text-primary); font-size: 0.85rem; margin-bottom: 0.35rem; display: block;">Owner / Contact Name</label>
                  <input type="text" id="edit-p-owner-name" value="${p.ownerName ? p.ownerName.replace(/"/g, '&quot;') : 'V. RAMANA'}" style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.92rem; box-sizing: border-box;" />
                </div>
                <div class="input-field-group">
                  <label style="font-weight: 700; color: var(--text-primary); font-size: 0.85rem; margin-bottom: 0.35rem; display: block;">Owner Contact Phone</label>
                  <input type="tel" id="edit-p-owner-phone" value="${p.ownerPhone ? p.ownerPhone.replace(/"/g, '&quot;') : '+91 80504 07710'}" style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.92rem; box-sizing: border-box;" />
                </div>
              </div>

              <!-- Action Footer -->
              <div style="display: flex; gap: 0.85rem; justify-content: flex-end; margin-top: 1rem; border-top: 1px solid var(--border-color); padding-top: 1.25rem;">
                <button type="button" id="btn-cancel-edit-form" class="nav-btn" style="padding: 0.85rem 1.5rem; background: var(--bg-glass); border: 1px solid var(--border-color); color: var(--text-primary); font-weight: 700;">
                  Cancel
                </button>
                <button type="submit" id="btn-save-edit-form" class="nav-btn nav-btn-primary" style="padding: 0.85rem 1.75rem; font-weight: 800; display: inline-flex; align-items: center; gap: 0.5rem;">
                  <i class="fa-solid fa-floppy-disk"></i> Save Changes
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>
    `;

    const returnToDetails = () => {
      state.openModal('property-details', p);
    };

    document.getElementById('btn-back-from-edit')?.addEventListener('click', returnToDetails);
    document.getElementById('btn-close-edit')?.addEventListener('click', returnToDetails);
    document.getElementById('btn-cancel-edit-form')?.addEventListener('click', returnToDetails);

    const photosPreview = document.getElementById('edit-photos-preview');
    const photosCount = document.getElementById('edit-photos-count');

    function renderEditPhotos() {
      if (!photosPreview) return;
      if (photosCount) photosCount.textContent = String(currentPhotos.length);
      if (currentPhotos.length === 0) {
        photosPreview.innerHTML = '<div style="font-size: 0.82rem; color: var(--text-muted); font-style: italic;">No photos yet. Please add at least one photo below.</div>';
        return;
      }
      photosPreview.innerHTML = currentPhotos.map((src, idx) => `
        <div style="position: relative; width: 88px; height: 88px; border-radius: 12px; overflow: hidden; border: 2px solid rgba(16, 185, 129, 0.4); flex-shrink: 0;">
          <img src="${src}" style="width: 100%; height: 100%; object-fit: cover;" />
          <button type="button" class="btn-remove-edit-img" data-img-idx="${idx}" style="position: absolute; top: 4px; right: 4px; width: 24px; height: 24px; border-radius: 50%; background: #ef4444; color: #fff; border: 1.5px solid #fff; font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.5); z-index: 10;" title="Delete Photo">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      `).join('');

      photosPreview.querySelectorAll('[data-img-idx]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const idx = Number(btn.dataset.imgIdx);
          currentPhotos.splice(idx, 1);
          renderEditPhotos();
        });
      });
    }

    renderEditPhotos();

    // Handle adding more photos
    const fileInput = document.getElementById('edit-p-file');
    const statusBox = document.getElementById('edit-p-upload-status');

    fileInput?.addEventListener('change', (e) => {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;
      if (statusBox) {
        statusBox.style.display = 'block';
        statusBox.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Reading ${files.length} photo(s)...`;
      }
      let loaded = 0;
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          currentPhotos.push(ev.target.result);
          loaded++;
          if (loaded === files.length) {
            if (statusBox) {
              statusBox.innerHTML = `✅ Added ${files.length} new photo(s)!`;
              setTimeout(() => { if (statusBox) statusBox.style.display = 'none'; }, 2000);
            }
            renderEditPhotos();
          }
        };
        reader.readAsDataURL(file);
      });
    });

    // Form submit listener
    document.getElementById('form-edit-property')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const saveBtn = document.getElementById('btn-save-edit-form');
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving changes...';
      }

      const bhkVal = document.getElementById('edit-p-bhk').value;
      const bhkType = bhkVal === '1 BHK' ? '1bhk' : bhkVal === '2 BHK' ? '2bhk' : bhkVal === '3 BHK' ? '3bhk' : '4bhk';
      const selectedAmenities = Array.from(
        document.querySelectorAll('input[name="edit-amenity"]:checked')
      ).map(el => el.value);

      const updatedPayload = {
        title: document.getElementById('edit-p-title').value.trim(),
        locality: document.getElementById('edit-p-locality').value.trim(),
        address: document.getElementById('edit-p-address').value.trim(),
        price: Number(document.getElementById('edit-p-price').value),
        deposit: Number(document.getElementById('edit-p-deposit').value),
        bhk: bhkVal,
        bhkType: bhkType,
        sqft: Number(document.getElementById('edit-p-sqft').value),
        furnishing: document.getElementById('edit-p-furnishing').value,
        floor: document.getElementById('edit-p-floor').value.trim(),
        facing: document.getElementById('edit-p-facing').value,
        bathrooms: Number(document.getElementById('edit-p-bathrooms').value),
        availableFrom: document.getElementById('edit-p-available').value.trim() || 'Immediate',
        preferredTenants: document.getElementById('edit-p-tenants').value,
        amenities: selectedAmenities,
        images: currentPhotos.length > 0 ? currentPhotos : p.images,
        description: document.getElementById('edit-p-desc').value.trim(),
        ownerName: document.getElementById('edit-p-owner-name').value.trim(),
        ownerPhone: document.getElementById('edit-p-owner-phone').value.trim()
      };

      await state.updateProperty(p.id, updatedPayload);
      showToast(`✨ Property "${updatedPayload.title}" updated successfully!`);
      state.openModal('property-details', { ...p, ...updatedPayload });
    });
  }

  // Backdrop click & Close button
  document.getElementById('btn-close-modal')?.addEventListener('click', () => {
    state.closeModal();
  });

  document.getElementById('modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'modal-backdrop') {
      state.closeModal();
    }
  });
}
