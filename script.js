const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  siteNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const page = document.body.dataset.page;
document.querySelectorAll('.site-nav > a').forEach(link => {
  const href = link.getAttribute('href');
  if (
    (page === 'home' && href === 'index.html') ||
    (page === 'about' && href === 'about.html') ||
    (page === 'contact' && href === 'contact.html' && !link.classList.contains('nav-cta'))
  ) {
    link.classList.add('active');
  }
});

const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => observer.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('visible'));
}

const interestSelect = document.getElementById('interest');
if (interestSelect) {
  const params = new URLSearchParams(window.location.search);
  const interest = params.get('interest');
  const validValues = ['soulmates', 'mentr', 'general', 'partnership'];
  if (interest && validValues.includes(interest)) {
    interestSelect.value = interest;
  }
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const statusEl = document.getElementById('formStatus');

  const validators = {
    name: (value) => value.trim().length >= 2 ? '' : 'Please enter your name.',
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? '' : 'Please enter a valid email address.',
    interest: (value) => value.trim() ? '' : 'Please select an area of interest.',
    message: (value) => value.trim().length >= 10 ? '' : 'Please enter a message of at least 10 characters.'
  };

  const setFieldError = (field, message) => {
    const row = field.closest('.form-row');
    const errorEl = row.querySelector('.error-message');
    field.classList.toggle('input-error', Boolean(message));
    errorEl.textContent = message;
  };

  const validateField = (field) => {
    const rule = validators[field.name];
    if (!rule) return true;
    const message = rule(field.value);
    setFieldError(field, message);
    return !message;
  };

  contactForm.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('input-error')) validateField(field);
    });
  });

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    statusEl.textContent = '';

    const fields = [...contactForm.querySelectorAll('input, select, textarea')];
    const allValid = fields.every(validateField);

    if (!allValid) {
      statusEl.textContent = 'Please review the highlighted fields.';
      return;
    }

    contactForm.reset();
    statusEl.textContent = 'Thanks — your message has been prepared successfully. Connect this form to Formspree or a Vercel backend to receive submissions live.';
  });
}
