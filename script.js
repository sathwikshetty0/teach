// ===========================
// NAVBAR SCROLL
// ===========================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ===========================
// HAMBURGER MENU
// ===========================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  const [s1, s2, s3] = hamburger.querySelectorAll('span');
  if (isOpen) {
    s1.style.transform = 'rotate(45deg) translate(5px, 5px)';
    s2.style.opacity = '0';
    s3.style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    s1.style.transform = s2.style.opacity = s3.style.transform = '';
    s2.style.opacity = '1';
  }
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = '1'; });
  });
});

// ===========================
// SCROLL REVEAL
// ===========================
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 70);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ===========================
// COUNTER ANIMATION
// ===========================
function animateCount(el, target, suffix = '') {
  let start = null;
  const duration = 1600;
  const step = (ts) => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statNums = document.querySelectorAll('.stat-num');
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      animateCount(el, target, suffix);
      counterObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => counterObs.observe(el));

// ===========================
// ACTIVE NAV HIGHLIGHT
// ===========================
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.35, rootMargin: '-10% 0px -70% 0px' });

sections.forEach(s => sectionObs.observe(s));

// ===========================
// IMAGE ENHANCEMENTS
// ===========================
document.querySelectorAll('img').forEach(img => {
  // Simple fade-in for images
  img.style.opacity = '0';
  img.style.transition = 'opacity 0.8s ease';

  img.addEventListener('load', () => {
    img.style.opacity = '1';
  });

  img.addEventListener('error', () => {
    img.style.background = 'linear-gradient(135deg, #111120, #0c0c16)';
    img.style.minHeight = '240px';
    img.style.opacity = '1';
  });
});

