// ===========================
// NAVBAR SCROLL EFFECT
// ===========================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===========================
// HAMBURGER MENU
// ===========================
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// Close menu on nav link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

// ===========================
// SCROLL REVEAL ANIMATION
// ===========================
const revealElements = document.querySelectorAll(
  '.stat-card, .need-card, .objective-item, .audience-card, .module-card, .method-card, .outcome-card, .col-card, .duration-card, .solution-banner, .conclusion-card, .mentor-card'
);

revealElements.forEach(el => {
  el.classList.add('reveal');
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ===========================
// ACTIVE NAV LINK HIGHLIGHT
// ===========================
const sections = document.querySelectorAll('section[id]');
const navLinkItems = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinkItems.forEach(link => {
        link.style.color = '';
        link.style.background = '';
      });
      const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (activeLink) {
        activeLink.style.color = '#8b85ff';
        activeLink.style.background = 'rgba(108, 99, 255, 0.1)';
      }
    }
  });
}, {
  threshold: 0.4
});

sections.forEach(section => sectionObserver.observe(section));

// ===========================
// SMOOTH COUNTER ANIMATION
// ===========================
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const duration = 1800;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statNumbers = document.querySelectorAll('.stat-number');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const text = el.textContent.trim();
      if (text === '7') animateCounter(el, 7);
      else if (text === '60+') animateCounter(el, 60, '+');
      else if (text === '3') animateCounter(el, 3);
      else if (text === '100%') animateCounter(el, 100, '%');
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => counterObserver.observe(el));

// ===========================
// PARALLAX ORBS
// ===========================
const orbs = document.querySelectorAll('.hero-orb');
window.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  orbs.forEach((orb, i) => {
    const factor = (i + 1) * 0.4;
    orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
  });
});

// ===========================
// MODULE CARD HOVER GLOW
// ===========================
document.querySelectorAll('.module-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.boxShadow = '0 16px 48px rgba(108, 99, 255, 0.2)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.boxShadow = '';
  });
});

// ===========================
// PRINT / DOWNLOAD HINT
// ===========================
// Keyboard shortcut: Ctrl+P to print
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
    // Let default print dialog open
    console.log('Printing proposal...');
  }
});

console.log('%c🎓 Teach & Think Proposal Website', 'color: #6c63ff; font-size: 18px; font-weight: bold;');
console.log('%cBuilt for Sathwik Shetty | Innovation, Technology & Communication Mentoring Program', 'color: #a0a0b8; font-size: 12px;');
