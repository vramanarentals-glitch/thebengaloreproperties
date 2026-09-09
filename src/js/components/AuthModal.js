import { state } from '../state.js';
import { showToast } from './Toast.js';
import { sanitizeHTML } from '../utils/security.js';

export function renderAuthModal() {
  if (state.activeModal !== 'auth-signin') return;

  const root = document.getElementById('modal-root');
  if (!root) return;

  const isSignIn = state.userAuthMode === 'signin';

  root.innerHTML = `
    <div class="modal-overlay" id="modal-backdrop">
      <div class="modal-card" style="max-width: 460px; width: 100%; box-sizing: border-box; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 24px; padding: 1.75rem 1.5rem; box-shadow: var(--shadow-lg); position: relative; max-height: 90vh; overflow-y: auto;">
        <button class="modal-close-btn" id="btn-close-modal" style="position: absolute; top: 18px; right: 18px; background: var(--bg-input); border: 1px solid var(--border-color); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-secondary); transition: all 0.2s ease;">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <div style="text-align: center; margin-bottom: 1.5rem;">
          <div style="width: 64px; height: 64px; border-radius: 20px; background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(59, 130, 246, 0.15)); border: 1px solid var(--accent-emerald); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; color: var(--accent-emerald); margin: 0 auto 1rem auto; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);">
            <i class="${isSignIn ? 'fa-solid fa-user-lock' : 'fa-solid fa-user-plus'}"></i>
          </div>
          <h2 class="font-heading" style="font-size: 1.6rem; margin-bottom: 0.35rem; color: var(--text-primary); font-weight: 800;">
            ${isSignIn ? 'Sign In to Bengaluru Properties' : 'Create New Account'}
          </h2>
          <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.4;">
            ${isSignIn ? 'Enter your email and password to access your account and saved properties.' : 'Register with your email to save properties and request instant site visits.'}
          </p>
        </div>

        <!-- Mode Toggle: Sign In vs Create Account -->
        <div style="display: flex; background: var(--bg-input); padding: 4px; border-radius: 14px; border: 1px solid var(--border-color); margin-bottom: 1.5rem;">
          <button id="btn-switch-signin" style="flex: 1; padding: 0.65rem; border-radius: 10px; border: none; font-size: 0.88rem; font-weight: 700; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 0.5rem; ${isSignIn ? 'background: var(--accent-emerald); color: #ffffff; box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);' : 'background: transparent; color: var(--text-muted);'}">
            <i class="fa-solid fa-right-to-bracket"></i> Sign In
          </button>
          <button id="btn-switch-register" style="flex: 1; padding: 0.65rem; border-radius: 10px; border: none; font-size: 0.88rem; font-weight: 700; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 0.5rem; ${!isSignIn ? 'background: var(--accent-emerald); color: #ffffff; box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);' : 'background: transparent; color: var(--text-muted);'}">
            <i class="fa-solid fa-user-plus"></i> Create Account
          </button>
        </div>

        ${isSignIn ? `
          <!-- Sign In Form -->
          <form id="form-user-login" style="display: flex; flex-direction: column; gap: 1.1rem;">
            <div class="input-field-group" style="text-align: left;">
              <label style="font-weight: 700; font-size: 0.85rem; color: var(--text-primary); margin-bottom: 0.4rem; display: block;">
                Email Address
              </label>
              <div style="position: relative;">
                <i class="fa-solid fa-envelope" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted);"></i>
                <input 
                  type="email" 
                  id="user-login-email" 
                  placeholder="name@example.com" 
                  required 
                  autocomplete="email"
                  style="width: 100%; padding: 0.85rem 0.85rem 0.85rem 2.6rem; border-radius: 12px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.95rem; font-weight: 500;"
                />
              </div>
            </div>

            <div class="input-field-group" style="text-align: left;">
              <label style="font-weight: 700; font-size: 0.85rem; color: var(--text-primary); margin-bottom: 0.4rem; display: block;">
                Password
              </label>
              <div style="position: relative;">
                <i class="fa-solid fa-lock" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted);"></i>
                <input 
                  type="password" 
                  id="user-login-pass" 
                  placeholder="••••••••" 
                  required 
                  autocomplete="current-password"
                  style="width: 100%; padding: 0.85rem 0.85rem 0.85rem 2.6rem; border-radius: 12px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.95rem; font-weight: 500;"
                />
              </div>
            </div>

            <button type="submit" class="nav-btn nav-btn-primary" style="width: 100%; justify-content: center; padding: 0.95rem; font-size: 1rem; margin-top: 0.35rem; border-radius: 12px; font-weight: 700; gap: 0.6rem; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);">
              <i class="fa-solid fa-right-to-bracket"></i> Secure Sign In
            </button>
          </form>
        ` : `
          <!-- Register / Create Account Form -->
          <form id="form-user-register" style="display: flex; flex-direction: column; gap: 1.1rem;">
            <div class="input-field-group" style="text-align: left;">
              <label style="font-weight: 700; font-size: 0.85rem; color: var(--text-primary); margin-bottom: 0.4rem; display: block;">
                Full Name
              </label>
              <div style="position: relative;">
                <i class="fa-solid fa-user" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted);"></i>
                <input 
                  type="text" 
                  id="user-reg-name" 
                  placeholder="Enter your full name" 
                  required 
                  style="width: 100%; padding: 0.85rem 0.85rem 0.85rem 2.6rem; border-radius: 12px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.95rem; font-weight: 500;"
                />
              </div>
            </div>

            <div class="input-field-group" style="text-align: left;">
              <label style="font-weight: 700; font-size: 0.85rem; color: var(--text-primary); margin-bottom: 0.4rem; display: block;">
                Email Address
              </label>
              <div style="position: relative;">
                <i class="fa-solid fa-envelope" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted);"></i>
                <input 
                  type="email" 
                  id="user-reg-email" 
                  placeholder="name@example.com" 
                  required 
                  autocomplete="email"
                  style="width: 100%; padding: 0.85rem 0.85rem 0.85rem 2.6rem; border-radius: 12px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.95rem; font-weight: 500;"
                />
              </div>
            </div>

            <div class="input-field-group" style="text-align: left;">
              <label style="font-weight: 700; font-size: 0.85rem; color: var(--text-primary); margin-bottom: 0.4rem; display: block;">
                Create Password
              </label>
              <div style="position: relative;">
                <i class="fa-solid fa-lock" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted);"></i>
                <input 
                  type="password" 
                  id="user-reg-pass" 
                  placeholder="Minimum 6 characters" 
                  required 
                  minlength="6"
                  autocomplete="new-password"
                  style="width: 100%; padding: 0.85rem 0.85rem 0.85rem 2.6rem; border-radius: 12px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.95rem; font-weight: 500;"
                />
              </div>
            </div>

            <div class="input-field-group" style="text-align: left;">
              <label style="font-weight: 700; font-size: 0.85rem; color: var(--text-primary); margin-bottom: 0.4rem; display: block;">
                Confirm Password
              </label>
              <div style="position: relative;">
                <i class="fa-solid fa-lock-keyhole" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted);"></i>
                <input 
                  type="password" 
                  id="user-reg-confirm" 
                  placeholder="Re-enter password" 
                  required 
                  minlength="6"
                  autocomplete="new-password"
                  style="width: 100%; padding: 0.85rem 0.85rem 0.85rem 2.6rem; border-radius: 12px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.95rem; font-weight: 500;"
                />
              </div>
            </div>

            <button type="submit" class="nav-btn nav-btn-primary" style="width: 100%; justify-content: center; padding: 0.95rem; font-size: 1rem; margin-top: 0.35rem; border-radius: 12px; font-weight: 700; gap: 0.6rem; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);">
              <i class="fa-solid fa-user-plus"></i> Register & Sign In
            </button>
          </form>
        `}

        <!-- Security Badge Notice -->
        <div style="margin-top: 1.5rem; text-align: center; font-size: 0.75rem; color: var(--text-muted); display: flex; align-items: center; justify-content: center; gap: 0.4rem;">
          <i class="fa-solid fa-shield-halved" style="color: var(--accent-emerald);"></i> 256-Bit SSL Encrypted & Secure Authentication
        </div>
      </div>
    </div>
  `;

  // Attach Event Listeners
  document.getElementById('btn-switch-signin')?.addEventListener('click', () => {
    state.userAuthMode = 'signin';
    state.notify();
  });

  document.getElementById('btn-switch-register')?.addEventListener('click', () => {
    state.userAuthMode = 'register';
    state.notify();
  });

  // User Sign In Submit
  document.getElementById('form-user-login')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailRaw = document.getElementById('user-login-email')?.value || '';
    const passRaw = document.getElementById('user-login-pass')?.value || '';
    
    const email = sanitizeHTML(emailRaw.trim());
    const pass = passRaw.trim();

    const submitBtn = e.target.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...';
    }

    const res = await state.loginUser(email, pass);
    if (res.success) {
      if (res.isAdmin) {
        showToast('⚡ Logged in as Proprietor Admin!');
      } else {
        showToast(`🎉 Welcome back, ${res.user.name}!`);
      }
    } else {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Secure Sign In';
      }
      showToast(`❌ ${res.message}`);
    }
  });

  // User Registration Submit
  document.getElementById('form-user-register')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameRaw = document.getElementById('user-reg-name')?.value || '';
    const emailRaw = document.getElementById('user-reg-email')?.value || '';
    const passRaw = document.getElementById('user-reg-pass')?.value || '';
    const confirmRaw = document.getElementById('user-reg-confirm')?.value || '';

    const name = sanitizeHTML(nameRaw.trim());
    const email = sanitizeHTML(emailRaw.trim());
    const pass = passRaw.trim();
    const confirm = confirmRaw.trim();

    if (pass !== confirm) {
      showToast('⚠️ Passwords do not match! Please check again.');
      return;
    }

    const submitBtn = e.target.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating Account in DB...';
    }

    const res = await state.registerUser({ name, email, password: pass });
    if (res.success) {
      showToast(`🎉 Account created! Welcome, ${res.user.name}.`);
    } else {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-user-plus"></i> Create My Account';
      }
      showToast(`❌ ${res.message}`);
    }
  });

  // Modal Close Listeners
  document.getElementById('btn-close-modal')?.addEventListener('click', () => {
    state.closeModal();
  });

  document.getElementById('modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'modal-backdrop') {
      state.closeModal();
    }
  });
}
