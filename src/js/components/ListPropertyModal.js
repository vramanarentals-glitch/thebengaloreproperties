import { LOCALITIES } from '../../data/properties.js';
import { state } from '../state.js';
import { api } from '../api.js';
import { showToast } from './Toast.js';
import { compressImage, processAndCompressImages } from '../utils/imageCompressor.js';

export function renderListPropertyModal() {
  if (state.activeModal !== 'list-property') return;

  const root = document.getElementById('modal-root');
  if (!root) return;

  root.innerHTML = `
    <div class="modal-overlay" id="modal-backdrop">
      <div class="modal-card" style="max-width: 650px; max-height: 90vh; overflow-y: auto;">
        <button class="modal-close-btn" id="btn-close-modal">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <div class="modal-body">
          <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem;">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: var(--accent-indigo-light); color: var(--accent-indigo); display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">
              <i class="fa-solid fa-house-medical"></i>
            </div>
            <div>
              <h3 class="font-heading" style="font-size: 1.5rem;">List Your Property in Bengaluru</h3>
              <p style="font-size: 0.85rem; color: var(--text-secondary);">Post your 0% brokerage rental listing and reach thousands of verified tenants across Bangalore.</p>
            </div>
          </div>

          <form id="form-list-property" style="display: flex; flex-direction: column; gap: 1.25rem;">
            <div class="input-field-group">
              <label>Property Name / Headline</label>
              <input type="text" id="lp-title" placeholder="e.g. Prestige Lakeview Spacious 2BHK" required />
            </div>

            <div class="modal-grid-2col">
              <div class="input-field-group">
                <label>Locality</label>
                <select id="lp-locality" class="search-select" style="padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input);">
                  ${LOCALITIES.map(loc => `<option value="${loc}">${loc}</option>`).join('')}
                </select>
              </div>

              <div class="input-field-group">
                <label>BHK Type</label>
                <select id="lp-bhk" class="search-select" style="padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input);">
                  <option value="1bhk">1 BHK</option>
                  <option value="2bhk" selected>2 BHK Apartment</option>
                  <option value="3bhk">3 BHK</option>
                  <option value="4bhk">4+ BHK / Villa</option>
                </select>
              </div>
            </div>

            <div class="modal-grid-2col">
              <div class="input-field-group">
                <label>Monthly Rent Expected (₹)</label>
                <input type="number" id="lp-price" placeholder="45000" min="5000" step="1000" inputmode="numeric" required />
              </div>

              <div class="input-field-group">
                <label>Security Deposit (₹)</label>
                <input type="number" id="lp-deposit" placeholder="180000" min="10000" step="5000" inputmode="numeric" required />
              </div>
            </div>

            <div class="modal-grid-2col">
              <div class="input-field-group">
                <label>Built-up Area (Sq Ft)</label>
                <input type="number" id="lp-sqft" placeholder="1250" inputmode="numeric" required />
              </div>

              <div class="input-field-group">
                <label>Furnishing Status</label>
                <select id="lp-furnishing" class="search-select" style="padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input);">
                  <option value="Fully Furnished">Fully Furnished</option>
                  <option value="Semi-Furnished" selected>Semi-Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div>
            </div>

            <div class="input-field-group">
              <label style="font-weight: 700; display: block; margin-bottom: 0.35rem;">
                Upload Property Photos <span style="font-weight: 400; font-size: 0.8rem; color: var(--accent-indigo);">(Mobile Camera & Laptop HD)</span>
              </label>
              <input 
                type="file" 
                id="lp-file-input" 
                accept="image/*" 
                multiple 
                style="position: absolute; width: 0.1px; height: 0.1px; opacity: 0; overflow: hidden; z-index: -1;" 
              />
              <label for="lp-file-input" id="lp-upload-dropzone" class="admin-dropzone-box" style="display: block; cursor: pointer; padding: 1.25rem; text-align: center; border: 2px dashed var(--border-color); border-radius: 12px; background: rgba(99, 102, 241, 0.04); -webkit-tap-highlight-color: transparent;">
                <div style="font-size: 1.8rem; color: var(--accent-indigo); margin-bottom: 0.3rem;">
                  <i class="fa-solid fa-cloud-arrow-up"></i>
                </div>
                <div style="font-weight: 700; font-size: 0.9rem; color: var(--text-primary);">Tap to Select from Mobile Camera / Gallery or Drag & Drop</div>
                <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.2rem;">⚡ Auto-compresses mobile camera photos for instant upload</div>
              </label>
              <div id="lp-upload-status" style="display: none; margin-top: 0.5rem; font-size: 0.85rem; color: var(--accent-indigo); font-weight: 600; text-align: center;"></div>
              <div id="lp-image-preview" style="display: flex; gap: 0.6rem; flex-wrap: wrap; margin-top: 0.6rem;"></div>
            </div>

            <div class="modal-grid-2col">
              <div class="input-field-group">
                <label>Your Full Name</label>
                <input type="text" id="lp-owner-name" placeholder="Owner Name" required />
              </div>

              <div class="input-field-group">
                <label>Contact Phone Number</label>
                <input type="tel" id="lp-owner-phone" placeholder="+91 98450 99887" inputmode="tel" required />
              </div>
            </div>

            <button type="submit" id="btn-submit-listing" class="nav-btn nav-btn-primary" style="width: 100%; justify-content: center; padding: 0.9rem; font-size: 1rem; margin-top: 0.5rem;">
              <i class="fa-solid fa-paper-plane"></i> Publish 0% Brokerage Listing
            </button>
          </form>
        </div>
      </div>
    </div>
  `;

  // Image Upload Handling
  const fileInput = document.getElementById('lp-file-input');
  const dropzone = document.getElementById('lp-upload-dropzone');
  const previewContainer = document.getElementById('lp-image-preview');
  const statusBox = document.getElementById('lp-upload-status');
  let uploadedImages = [];

  dropzone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = 'var(--accent-indigo)';
  });

  dropzone?.addEventListener('dragleave', () => {
    dropzone.style.borderColor = 'var(--border-color)';
  });

  dropzone?.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = 'var(--border-color)';
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
          <img src="${src}" style="width: 76px; height: 76px; border-radius: 10px; object-fit: cover; border: 2px solid var(--accent-indigo); display: block;" />
          ${sizeKb ? `<span style="position: absolute; bottom: 3px; left: 3px; background: rgba(0,0,0,0.75); color: #fff; font-size: 0.65rem; padding: 1px 4px; border-radius: 4px; font-weight: 700;">${sizeKb}</span>` : ''}
          <button type="button" class="btn-remove-lp-img" data-img-idx="${idx}" style="position: absolute; top: -8px; right: -8px; width: 28px; height: 28px; border-radius: 50%; background: #ef4444; color: #fff; border: 2px solid #fff; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.4); z-index: 10; touch-action: manipulation;" title="Remove">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      `;
    }).join('');

    previewContainer.querySelectorAll('.btn-remove-lp-img').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const idx = Number(btn.dataset.imgIdx);
        uploadedImages.splice(idx, 1);
        renderPreviews();
      });
    });
  }

  document.getElementById('form-list-property')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('btn-submit-listing');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Saving listing...`;
    }

    const title = document.getElementById('lp-title').value;
    const locality = document.getElementById('lp-locality').value;
    const bhkType = document.getElementById('lp-bhk').value;
    const bhkText = bhkType === '1bhk' ? '1 BHK' : bhkType === '2bhk' ? '2 BHK' : bhkType === '3bhk' ? '3 BHK' : '4+ BHK';
    const price = Number(document.getElementById('lp-price').value);
    const deposit = Number(document.getElementById('lp-deposit').value);
    const sqft = Number(document.getElementById('lp-sqft').value);
    const furnishing = document.getElementById('lp-furnishing').value;
    const ownerName = document.getElementById('lp-owner-name').value;
    const ownerPhone = document.getElementById('lp-owner-phone').value;

    const propertyId = `prop-custom-${Date.now()}`;

    // Upload images directly to Neon DB table 'property_images'
    let finalImages = [];
    if (uploadedImages.length > 0) {
      for (let i = 0; i < uploadedImages.length; i++) {
        const imgItem = uploadedImages[i];
        const dataUrl = typeof imgItem === 'string' ? imgItem : imgItem.dataUrl;
        const fileName = (typeof imgItem === 'object' && imgItem.fileName) ? imgItem.fileName : `listing-${i + 1}.jpg`;
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
          console.warn('Image upload fallback:', err);
          finalImages.push(dataUrl);
        }
      }
    } else {
      finalImages = ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"];
    }

    if (submitBtn) {
      submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Finalizing listing...`;
    }

    await state.addProperty({
      id: propertyId,
      title,
      locality,
      address: `${locality}, Bengaluru`,
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
      description: `Newly listed ${bhkText} apartment in prime ${locality}. Directly posted by property owner with 0% brokerage fees.`,
      ownerName,
      ownerPhone,
      ownerType: 'Direct Owner'
    });

    state.closeModal();
    showToast(`✨ Property "${title}" in ${locality} listed successfully!`);
  });

  document.getElementById('btn-close-modal')?.addEventListener('click', () => {
    state.closeModal();
  });

  document.getElementById('modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'modal-backdrop') {
      state.closeModal();
    }
  });
}
