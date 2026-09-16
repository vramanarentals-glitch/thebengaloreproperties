export function showToast(message, icon = 'fa-circle-check') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';

  const iconEl = document.createElement('i');
  const safeIcon = (typeof icon === 'string' && /^[a-zA-Z0-9\-_ ]+$/.test(icon)) ? icon : 'fa-circle-check';
  iconEl.className = `fa-solid ${safeIcon}`;
  iconEl.style.color = 'var(--accent-emerald)';
  iconEl.style.fontSize = '1.2rem';

  const textSpan = document.createElement('span');
  textSpan.textContent = String(message || '');

  toast.appendChild(iconEl);
  toast.appendChild(textSpan);
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4500);
}
