const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('[data-mobile-menu]');
const languageButton = document.querySelector('.language-toggle');
const languageList = document.querySelector('.language-list');
const navigationMenus = document.querySelectorAll('.nav-mega');

function updateHeader() {
  header?.classList.toggle('is-scrolled', window.scrollY > 18);
}

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  const tr = document.documentElement.lang === 'tr';
  menuButton.setAttribute('aria-label', isOpen ? (tr ? 'Menüyü aç' : 'Open menu') : (tr ? 'Menüyü kapat' : 'Close menu'));
  mobileMenu.hidden = isOpen;
});

mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  mobileMenu.hidden = true;
  menuButton?.setAttribute('aria-expanded', 'false');
}));

languageButton?.addEventListener('click', () => {
  const isOpen = languageButton.getAttribute('aria-expanded') === 'true';
  languageButton.setAttribute('aria-expanded', String(!isOpen));
  languageList.hidden = isOpen;
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.language-menu') && languageList) {
    languageList.hidden = true;
    languageButton?.setAttribute('aria-expanded', 'false');
  }

  if (!event.target.closest('.desktop-nav')) {
    navigationMenus.forEach((menu) => menu.removeAttribute('open'));
  }
});

navigationMenus.forEach((menu) => menu.addEventListener('toggle', () => {
  if (menu.open) {
    navigationMenus.forEach((otherMenu) => {
      if (otherMenu !== menu) otherMenu.removeAttribute('open');
    });
  }
}));

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  if (mobileMenu && !mobileMenu.hidden) {
    mobileMenu.hidden = true;
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.focus();
  }
  if (languageList && !languageList.hidden) {
    languageList.hidden = true;
    languageButton?.setAttribute('aria-expanded', 'false');
    languageButton?.focus();
  }
  navigationMenus.forEach(menu => {
    if (menu.open) { menu.removeAttribute('open'); menu.querySelector('summary')?.focus(); }
  });
});

document.querySelectorAll('.mega-menu a').forEach((link) => link.addEventListener('click', () => {
  navigationMenus.forEach((menu) => menu.removeAttribute('open'));
}));

const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealElements.forEach((element) => revealObserver.observe(element));

const form = document.querySelector('[data-demo-form]');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const notice = form.querySelector('.form-success');
  notice.textContent = document.documentElement.lang === 'tr'
    ? 'Bu önizleme formu gönderim yapmaz. Lütfen info@labomak.com.tr adresine e-posta gönderin.'
    : 'This preview form does not send messages. Please email info@labomak.com.tr.';
  notice.hidden = false;
});

const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear();
