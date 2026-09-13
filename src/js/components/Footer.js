import { state } from '../state.js';

export function renderFooter() {
  const root = document.getElementById('footer-root');
  if (!root) return;

  const c = state.contactInfo;

  root.innerHTML = `
    <div style="max-width: 1400px; margin: 0 auto; text-align: left; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; margin-bottom: 2rem; width: 100%;">
      <div>
        <div class="brand-logo" style="margin-bottom: 1rem;">
          <div class="brand-icon">
            <i class="fa-solid fa-city"></i>
          </div>
          <div>The Bangalore <span class="brand-text-highlight">Properties</span></div>
        </div>
        <p style="color: #f59e0b; font-size: 0.85rem; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 0.5rem;">
          "${c.slogan}"
        </p>
        <p style="color: var(--text-secondary); font-size: 0.85rem; line-height: 1.6;">
          Bengaluru's premier property platform directly managed by Proprietor V. RAMANA. Verified rental homes, office spaces, godowns & leases across Silicon Valley of India.
        </p>
      </div>

      <div>
        <h4 class="font-heading" style="color: var(--text-primary); margin-bottom: 1rem;">Services & Categories</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.85rem; color: var(--text-secondary);">
          <li><a href="#" class="footer-link"><i class="fa-solid fa-house" style="color: var(--accent-emerald);"></i> Residential Homes for Rent</a></li>
          <li><a href="#" class="footer-link"><i class="fa-solid fa-file-contract" style="color: var(--accent-amber);"></i> Long-term Property Lease</a></li>
          <li><a href="#" class="footer-link"><i class="fa-solid fa-key" style="color: var(--accent-indigo);"></i> Property Sale & Investments</a></li>
          <li><a href="#" class="footer-link"><i class="fa-solid fa-building" style="color: #3b82f6;"></i> Commercial Office Spaces</a></li>
          <li><a href="#" class="footer-link"><i class="fa-solid fa-warehouse" style="color: #ec4899;"></i> Industrial & Godown Spaces</a></li>
        </ul>
      </div>

      <div>
        <h4 class="font-heading" style="color: var(--text-primary); margin-bottom: 1rem;">Popular Localities</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.85rem; color: var(--text-secondary);">
          <li><a href="#" class="footer-link">Murugeshpalaya & EGL Tech Park</a></li>
          <li><a href="#" class="footer-link">Indiranagar 100ft Road</a></li>
          <li><a href="#" class="footer-link">Koramangala 5th Block</a></li>
          <li><a href="#" class="footer-link">HSR Layout Sector 1</a></li>
          <li><a href="#" class="footer-link">Whitefield near ITPL</a></li>
        </ul>
      </div>

      <div>
        <h4 class="font-heading" style="color: var(--text-primary); margin-bottom: 1rem;">Direct Contact (Proprietor)</h4>
        <div style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.8; margin-bottom: 1rem;">
          <div style="font-weight: 800; color: var(--text-primary); font-size: 0.95rem; margin-bottom: 0.25rem;">
            👤 ${c.proprietor} <span style="font-size: 0.75rem; color: #f59e0b; font-weight: 600;">(${c.role})</span>
          </div>
          <div>📍 ${c.address}</div>
          <div>📧 <a href="mailto:${c.email}" style="color: var(--accent-emerald); hover: underline;">${c.email}</a></div>
          <div>📞 <a href="tel:${c.phoneRaw}" style="color: #f59e0b; font-weight: 700;">${c.phone}</a></div>
        </div>
        <div style="display: flex; gap: 0.75rem; font-size: 1.2rem;">
          <a href="https://wa.me/${c.whatsapp.replace('+', '')}" target="_blank" style="color: #25D366;" title="WhatsApp Direct"><i class="fa-brands fa-whatsapp"></i></a>
          <a href="tel:${c.phoneRaw}" style="color: var(--accent-emerald);" title="Call Direct"><i class="fa-solid fa-phone"></i></a>
          <a href="mailto:${c.email}" style="color: var(--accent-amber);" title="Email Direct"><i class="fa-solid fa-envelope"></i></a>
          <button id="footer-btn-contact-modal" style="color: var(--accent-indigo); cursor: pointer; border: none; background: none; font-size: 1.2rem;" title="View Digital Business Card"><i class="fa-solid fa-id-card"></i></button>
        </div>
      </div>
    </div>

    <div style="border-top: 1px solid var(--border-color); padding-top: 1.5rem; font-size: 0.8rem; color: var(--text-muted); display: flex; flex-wrap: wrap; justify-content: space-between; gap: 1rem; align-items: center;">
      <div>
        © ${new Date().getFullYear()} The Bangalore Properties. All rights reserved. Managed by <strong>V. RAMANA (Proprietor)</strong>.
      </div>
      <div style="color: #10b981; font-weight: 700; letter-spacing: 0.5px;">
        <i class="fa-solid fa-key"></i> 100% VERIFIED RENTAL LISTINGS ONLY
      </div>
    </div>
  `;

  document.getElementById('footer-btn-contact-modal')?.addEventListener('click', () => {
    state.openModal('contact-us');
  });
}
