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
      <div class="modal-overlay" id="modal-backdrop">
        <div class="modal-card">
          <button class="modal-close-btn" id="btn-close-modal">
            <i class="fa-solid fa-xmark"></i>
          </button>

          <div class="modal-body">
            <!-- Main Photo Gallery -->
            <div class="gallery-main">
              <img id="gallery-current-img" src="${p.images[0]}" alt="${p.title}" />
            </div>

            ${p.images.length > 1 ? `
              <div style="display: flex; gap: 0.75rem; margin-bottom: 1.5rem;">
                ${p.images.map((img, idx) => `
                  <img 
                    src="${img}" 
                    class="gallery-thumb" 
                    data-img-src="${img}"
                    style="width: 80px; height: 60px; border-radius: 8px; object-fit: cover; cursor: pointer; border: 2px solid ${idx === 0 ? 'var(--accent-emerald)' : 'transparent'};" 
                  />
                `).join('')}
              </div>
            ` : ''}

            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
              <div>
                <h2 class="modal-title font-heading">${p.title}</h2>
                <div class="modal-address">
                  <i class="fa-solid fa-location-dot" style="color: var(--accent-emerald);"></i> ${p.address}
                </div>
              </div>
              
              <div style="text-align: right;">
                <div style="font-size: 2rem; font-weight: 800; color: var(--accent-emerald);">
                  ₹${p.price.toLocaleString('en-IN')} <span style="font-size: 1rem; color: var(--text-secondary); font-weight: 500;">/month</span>
                </div>
                <div style="font-size: 0.9rem; color: var(--text-secondary);">
                  Security Deposit: <strong>₹${p.deposit.toLocaleString('en-IN')}</strong>
                </div>
              </div>
            </div>

            <!-- Key Specs Bar -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem; background: var(--bg-glass); border: 1px solid var(--border-color); padding: 1.25rem; border-radius: 16px; margin: 1.5rem 0;">
              <div>
                <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">BHK TYPE</div>
                <div style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">${p.bhk}</div>
              </div>
              <div>
                <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">SUPER AREA</div>
                <div style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">${p.sqft} sq ft</div>
              </div>
              <div>
                <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">FURNISHING</div>
                <div style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">${p.furnishing}</div>
              </div>
              <div>
                <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">FLOOR</div>
                <div style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">${p.floor}</div>
              </div>
              <div>
                <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">FACING</div>
                <div style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">${p.facing}</div>
              </div>
            </div>

            <!-- Description -->
            <div style="margin-bottom: 1.5rem;">
              <h4 class="font-heading" style="font-size: 1.1rem; margin-bottom: 0.5rem;">Property Description</h4>
              <p style="color: var(--text-secondary); line-height: 1.6;">${p.description}</p>
            </div>

            <!-- Amenities -->
            <div style="margin-bottom: 1.5rem;">
              <h4 class="font-heading" style="font-size: 1.1rem; margin-bottom: 0.5rem;">Society & Unit Amenities</h4>
              <div class="amenities-tag-grid">
                ${p.amenities.map(a => `
                  <span class="amenity-chip">
                    <i class="fa-solid fa-circle-check"></i> ${a}
                  </span>
                `).join('')}
              </div>
            </div>

            <!-- Neighborhood Proximity Matrix -->
            ${p.proximity ? `
              <div style="background: var(--bg-surface); border: 1px solid var(--border-color); padding: 1.25rem; border-radius: 16px; margin-bottom: 1.5rem;">
                <h4 class="font-heading" style="font-size: 1.1rem; margin-bottom: 0.75rem;">⚡ Proximity & Proximity Markers</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; font-size: 0.9rem; color: var(--text-secondary);">
                  <div>🚇 <strong>Metro:</strong> ${p.proximity.metro}</div>
                  <div>🏢 <strong>Tech Hub:</strong> ${p.proximity.techPark}</div>
                  <div>🏥 <strong>Hospital:</strong> ${p.proximity.hospital}</div>
                  <div>🛍️ <strong>Shopping:</strong> ${p.proximity.shopping}</div>
                </div>
              </div>
            ` : ''}

            <!-- Owner Contact Box -->
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(99, 102, 241, 0.1)); border: 1px solid var(--border-glow); padding: 1.25rem; border-radius: 16px;">
              <div>
                <div style="font-size: 0.8rem; font-weight: 700; color: var(--accent-emerald);">LISTED BY</div>
                <div style="font-size: 1.2rem; font-weight: 800;">${p.ownerName} (${p.ownerType})</div>
                <div style="font-size: 0.85rem; color: var(--text-secondary);">${p.ownerPhone}</div>
              </div>

              <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                <button id="btn-modal-book-call" class="nav-btn" style="background: rgba(16, 185, 129, 0.2); border: 1px solid #10b981; color: #10b981; font-weight: 700;">
                  <i class="fa-solid fa-phone-volume"></i> Book a Call
                </button>
                <a href="tel:${p.ownerPhone}" class="nav-btn nav-btn-primary">
                  <i class="fa-solid fa-phone"></i> Call Now
                </a>
                <button id="btn-modal-schedule-tour" class="nav-btn" style="background: var(--accent-indigo); color: #fff; border: none;">
                  <i class="fa-solid fa-calendar-plus"></i> Schedule Tour
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Attach Gallery Thumb clicks
    root.querySelectorAll('.gallery-thumb').forEach(thumb => {
      thumb.addEventListener('click', () => {
        const mainImg = document.getElementById('gallery-current-img');
        if (mainImg) mainImg.src = thumb.dataset.imgSrc;
      });
    });

    document.getElementById('btn-modal-book-call')?.addEventListener('click', () => {
      state.openModal('book-call', p);
    });

    document.getElementById('btn-modal-schedule-tour')?.addEventListener('click', () => {
      state.openModal('schedule-visit', p);
    });
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
        <div class="modal-card" style="max-width: 780px; width: 92vw; max-height: 90vh; overflow-y: auto; background: #0b0f19; border: 2px solid rgba(245, 158, 11, 0.5); box-shadow: 0 25px 60px rgba(0,0,0,0.85); padding: 0; border-radius: 20px;">
          <button class="modal-close-btn" id="btn-close-modal" style="top: 15px; right: 15px; background: rgba(0,0,0,0.6); color: #fff; border: 1px solid rgba(255,255,255,0.2); z-index: 10;">
            <i class="fa-solid fa-xmark"></i>
          </button>

          <!-- Digital Business Card UI Header -->
          <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-b: 2px solid #f59e0b; position: relative;">
            <!-- Gold Trim Curved Header -->
            <div style="background: linear-gradient(90deg, #d97706, #f59e0b, #fbbf24); padding: 1rem 1.5rem; text-align: center; color: #0b0f19; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; font-size: 0.85rem; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
              <i class="fa-solid fa-building-circle-check"></i> Official Business Contact Card
            </div>

            <!-- Top Front Banner (Matching Business Card Image) -->
            <div style="padding: 1.5rem 1.5rem 1rem 1.5rem; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; border-bottom: 1px dashed rgba(245,158,11,0.3);">
              <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="width: 60px; height: 60px; border-radius: 14px; background: linear-gradient(135deg, #f59e0b, #b45309); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 2rem; box-shadow: 0 6px 16px rgba(245,158,11,0.4);">
                  <i class="fa-solid fa-city"></i>
                </div>
                <div>
                  <div style="font-family: 'Outfit', sans-serif; font-size: 1.6rem; font-weight: 800; color: #ffffff; line-height: 1.1; letter-spacing: -0.5px;">
                    The Bangalore <span style="color: #f59e0b;">Properties</span>
                  </div>
                  <div style="font-size: 0.68rem; font-weight: 700; color: #94a3b8; letter-spacing: 1px; margin-top: 4px;">
                    RENT • LEASE • SALE • OFFICE SPACE • GODOWN SPACE • ETC.
                  </div>
                </div>
              </div>

              <!-- Top Right Highlight -->
              <div style="background: rgba(245,158,11,0.15); border: 1px solid #f59e0b; padding: 0.75rem 1.25rem; border-radius: 12px; text-align: right;">
                <div style="font-size: 1.25rem; font-weight: 900; color: #ffffff; font-family: 'Outfit', sans-serif;">${c.proprietor}</div>
                <div style="font-size: 0.95rem; font-weight: 700; color: #f59e0b;">
                  <i class="fa-solid fa-phone"></i> ${c.phone}
                </div>
              </div>
            </div>

            <!-- Card Bottom Banner with Slogan (Matching Business Card Image) -->
            <div style="background: linear-gradient(90deg, #0f172a, #1e1b4b); padding: 1rem 1.5rem; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.1);">
              <div style="font-size: 0.8rem; color: #cbd5e1;">
                <span style="color: #f59e0b; font-weight: 700;">PROPRIETOR:</span> ${c.proprietor}
              </div>
              <div style="font-family: 'Outfit', sans-serif; font-size: 1.1rem; font-weight: 900; color: #fbbf24; letter-spacing: 1px; text-shadow: 0 0 10px rgba(245,158,11,0.5);">
                YOUR PROPERTY, OUR PRIORITY.
              </div>
            </div>
          </div>

          <!-- Business Card Details Body -->
          <div style="padding: 1.5rem; background: #0f172a;">
            <div style="display: grid; grid-template-columns: 1fr; gap: 1rem; margin-bottom: 1.5rem;">

              <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); padding: 1rem; border-radius: 12px; display: flex; align-items: center; gap: 1rem;">
                <div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(245,158,11,0.15); color: #f59e0b; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0;">
                  <i class="fa-solid fa-user-tie"></i>
                </div>
                <div>
                  <div style="font-size: 0.75rem; color: #94a3b8; font-weight: 600;">CONTACT PERSON</div>
                  <div style="font-size: 1.1rem; font-weight: 800; color: #f8fafc;">${c.proprietor} (${c.role})</div>
                </div>
              </div>

              <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); padding: 1rem; border-radius: 12px; display: flex; align-items: center; gap: 1rem;">
                <div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(37,211,102,0.15); color: #25D366; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0;">
                  <i class="fa-brands fa-whatsapp"></i>
                </div>
                <div style="flex-grow: 1;">
                  <div style="font-size: 0.75rem; color: #94a3b8; font-weight: 600;">WHATSAPP & PHONE NUMBER</div>
                  <div style="font-size: 1.1rem; font-weight: 800; color: #f8fafc;">${c.phone}</div>
                </div>
                <a href="https://wa.me/${c.whatsapp.replace('+', '')}?text=Hello%20V.%20Ramana,%20I%20want%20to%20inquire%20about%20properties%20in%20Bangalore." target="_blank" class="nav-btn" style="background: #25D366; color: #fff; border: none; font-weight: 800; padding: 0.45rem 1rem; font-size: 0.85rem; border-radius: 10px;">
                  <i class="fa-brands fa-whatsapp"></i> WhatsApp
                </a>
              </div>

              <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); padding: 1rem; border-radius: 12px; display: flex; align-items: center; gap: 1rem;">
                <div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(239,68,68,0.15); color: #ef4444; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0;">
                  <i class="fa-solid fa-envelope"></i>
                </div>
                <div style="flex-grow: 1;">
                  <div style="font-size: 0.75rem; color: #94a3b8; font-weight: 600;">EMAIL ADDRESS</div>
                  <div style="font-size: 1rem; font-weight: 700; color: #f8fafc; word-break: break-all;">${c.email}</div>
                </div>
                <a href="mailto:${c.email}" class="nav-btn" style="background: rgba(239,68,68,0.2); color: #ef4444; border: 1px solid #ef4444; padding: 0.4rem 0.9rem; font-size: 0.85rem;">
                  Email Us
                </a>
              </div>

              <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); padding: 1rem; border-radius: 12px; display: flex; align-items: flex-start; gap: 1rem;">
                <div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(99,102,241,0.15); color: #6366f1; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; margin-top: 2px;">
                  <i class="fa-solid fa-location-dot"></i>
                </div>
                <div>
                  <div style="font-size: 0.75rem; color: #94a3b8; font-weight: 600;">OFFICE ADDRESS</div>
                  <div style="font-size: 0.95rem; font-weight: 700; color: #f8fafc; line-height: 1.5; margin-top: 2px;">
                    Ground floor, Srinivas Residency,<br/>
                    2nd Main, KR Garden, Murugeshpalaya,<br/>
                    Bangalore - 560017
                  </div>
                </div>
              </div>

            </div>

            <!-- Services Offered Bottom Strip -->
            <div style="background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.3); padding: 0.85rem; border-radius: 12px; text-align: center; margin-bottom: 1.25rem;">
              <div style="font-size: 0.7rem; font-weight: 800; color: #f59e0b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">PROPERTY SERVICES OFFERED</div>
              <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem;">
                ${c.services.map(s => `
                  <span style="background: rgba(0,0,0,0.4); color: #fff; font-size: 0.75rem; font-weight: 700; padding: 3px 10px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1);">
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
        <div class="modal-card" style="max-width: 620px; width: 92vw; max-height: 90vh; overflow-y: auto; background: #0f172a; border: 2px solid rgba(16, 185, 129, 0.5); box-shadow: 0 25px 60px rgba(0,0,0,0.85); border-radius: 20px;">
          <button class="modal-close-btn" id="btn-close-modal" style="top: 15px; right: 15px; background: rgba(0,0,0,0.6); color: #fff; border: 1px solid rgba(255,255,255,0.2); z-index: 10;">
            <i class="fa-solid fa-xmark"></i>
          </button>

          <div class="modal-body" style="padding: 1.75rem;">
            <!-- Header -->
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem;">
              <div style="width: 50px; height: 50px; border-radius: 14px; background: linear-gradient(135deg, #10b981, #059669); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0; box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);">
                <i class="fa-solid fa-phone-volume"></i>
              </div>
              <div>
                <h3 class="font-heading" style="font-size: 1.4rem; color: #fff; line-height: 1.2;">Book a Call with Proprietor</h3>
                <p style="font-size: 0.85rem; color: #10b981; font-weight: 700; margin-top: 2px;">
                  Direct Callback from ${c.proprietor} (${c.phone})
                </p>
              </div>
            </div>

            <form id="form-book-call" style="display: flex; flex-direction: column; gap: 1.25rem;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="input-field-group">
                  <label style="font-weight: 700; color: #e2e8f0;">Your Full Name *</label>
                  <input type="text" id="book-call-name" placeholder="e.g. Anand Sharma" required style="background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); color: #fff; padding: 0.75rem; border-radius: 10px;" />
                </div>
                <div class="input-field-group">
                  <label style="font-weight: 700; color: #e2e8f0;">Mobile Number *</label>
                  <input type="tel" id="book-call-phone" placeholder="+91 98765 43210" required style="background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); color: #fff; padding: 0.75rem; border-radius: 10px;" />
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="input-field-group">
                  <label style="font-weight: 700; color: #e2e8f0;">Preferred Service</label>
                  <select id="book-call-service" style="background: rgba(15,23,42,0.9); border: 1px solid var(--border-color); color: #fff; padding: 0.75rem; border-radius: 10px;">
                    <option value="Residential Rental">Residential Rental (Flat/House)</option>
                    <option value="Commercial Office Space">Commercial Office Space</option>
                    <option value="Godown / Warehouse">Godown / Warehouse Space</option>
                    <option value="Long Term Lease">Long Term Lease</option>
                    <option value="General Property Consultation">General Property Consultation</option>
                  </select>
                </div>
                <div class="input-field-group">
                  <label style="font-weight: 700; color: #e2e8f0;">Preferred Locality</label>
                  <input type="text" id="book-call-locality" placeholder="e.g. Murugeshpalaya, Indiranagar" style="background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); color: #fff; padding: 0.75rem; border-radius: 10px;" />
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="input-field-group">
                  <label style="font-weight: 700; color: #e2e8f0;">Preferred Call Date *</label>
                  <input type="date" id="book-call-date" min="${today}" value="${today}" required style="background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); color: #fff; padding: 0.75rem; border-radius: 10px;" />
                </div>
                <div class="input-field-group">
                  <label style="font-weight: 700; color: #e2e8f0;">Preferred Time Slot</label>
                  <select id="book-call-slot" style="background: rgba(15,23,42,0.9); border: 1px solid var(--border-color); color: #fff; padding: 0.75rem; border-radius: 10px;">
                    <option value="Morning (09:00 AM - 12:00 PM)">Morning (09:00 AM - 12:00 PM)</option>
                    <option value="Afternoon (12:00 PM - 04:00 PM)">Afternoon (12:00 PM - 04:00 PM)</option>
                    <option value="Evening (04:00 PM - 08:00 PM)">Evening (04:00 PM - 08:00 PM)</option>
                  </select>
                </div>
              </div>

              <div class="input-field-group">
                <label style="font-weight: 700; color: #e2e8f0;">Notes / Requirements (Optional)</label>
                <textarea id="book-call-notes" rows="2" placeholder="e.g. Budget ₹30k - ₹40k, 2BHK furnished near Tech Park..." style="background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); color: #fff; padding: 0.75rem; border-radius: 10px; resize: vertical;"></textarea>
              </div>

              <div style="display: flex; gap: 0.75rem; margin-top: 0.5rem; flex-wrap: wrap;">
                <button type="submit" class="nav-btn nav-btn-primary" style="flex: 1; min-width: 180px; justify-content: center; padding: 0.9rem; font-size: 1rem; font-weight: 800;">
                  <i class="fa-solid fa-phone-volume"></i> Confirm & Book Callback
                </button>
                <a href="https://wa.me/${c.whatsapp.replace('+', '')}?text=Hello%20V.%20Ramana,%20I%20would%20like%20to%20book%20a%20call%20regarding%20properties." target="_blank" class="nav-btn" style="background: #25D366; color: #fff; font-weight: 800; padding: 0.9rem; border-radius: 10px; border: none; text-decoration: none;">
                  <i class="fa-brands fa-whatsapp"></i> Chat on WhatsApp
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
