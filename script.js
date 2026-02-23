// ===========================
// THEME TOGGLE logic
// ===========================
const themeToggle = document.getElementById('themeToggle');
const storageKey = 'pulseio-theme';

// Apply system or stored preference
const getPreferredTheme = () => {
  const storedTheme = localStorage.getItem(storageKey);
  if (storedTheme) return storedTheme;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

const setTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(storageKey, theme);
};

// Initial setup
setTheme(getPreferredTheme());

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(nextTheme);
});

// ===========================
// MOBILE CHECK
// ===========================
const isMobile = () => window.innerWidth <= 768;

// ===========================
// NAVBAR SCROLL
// ===========================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ===========================
// HAMBURGER MENU (desktop only)
// ===========================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  if (isMobile()) return; // Bottom nav handles mobile
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
    if (!isMobile()) {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = '1'; });
    }
  });
});

// ===========================
// SCROLL REVEAL (Standard & 3D)
// ===========================
const allReveals = document.querySelectorAll('.reveal, .reveal-3d, .stagger-3d, .hero-reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // If hero reveal, let it stay observed if we want repeat, but usually once is fine
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.001, rootMargin: '0px' });

// Manual reveal trigger for elements already in view
const scanReveals = () => {
  allReveals.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('visible');
    }
  });
};

// Global Failsafe: If things are still not visible after 8 seconds, force them
setTimeout(() => {
  allReveals.forEach(el => el.classList.add('visible'));
}, 8000);

allReveals.forEach(el => revealObserver.observe(el));

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
//
// ===========================
// ACTIVE NAV HIGHLIGHT (scroll  based)
// ===========================
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
  const scrollY = window.scrollY;
  const offset = isMobile() ? 200 : window.innerHeight * 0.35;
  let currentId = '';

  sections.forEach(section => {
    const top = section.offsetTop - offset;
    const bottom = top + section.offsetHeight;
    if (scrollY >= top && scrollY < bottom) {
      currentId = section.id;
    }
  });

  // Fallback: if near bottom of page, highlight last nav item
  if (window.innerHeight + scrollY >= document.body.offsetHeight - 100) {
    const lastSection = sections[sections.length - 1];
    if (lastSection) currentId = lastSection.id;
  }

  navItems.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === `#${currentId}`) {
      a.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

// ===========================
// 3D ORB PARALLAX
// ===========================
const hero3d = document.querySelector('.hero-3d-wrap');
if (hero3d) {
  document.addEventListener('mousemove', (e) => {
    const x = (window.innerWidth / 2 - e.pageX) / 30;
    const y = (window.innerHeight / 2 - e.pageY) / 30;
    hero3d.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  });
}

// ===========================
// SECTION 3D SCROLL PERSPECTIVE & PARALLAX
// ===========================
const perspectiveSections = document.querySelectorAll('.perspective-container');
const heroImg = document.querySelector('.hero-bg-img');

window.addEventListener('scroll', () => {
  const vh = window.innerHeight;
  const scrolled = window.scrollY;

  // Hero Image Parallax
  if (heroImg) {
    heroImg.style.transform = `translateY(${scrolled * 0.3}px) scale(${1 + scrolled * 0.0004})`;
  }

  perspectiveSections.forEach(section => {
    const rect = section.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const distanceToCenter = (vh / 2 - center) / vh;

    // Smoothly tilt sections as they pass center screen
    const rotation = distanceToCenter * 6; // Max tilt
    const elements = section.querySelectorAll('.reveal-3d');
    elements.forEach(el => {
      el.style.transform = `rotateX(${rotation}deg) translateZ(${Math.abs(rotation) * 3}px)`;
    });
  });
}, { passive: true });
document.querySelectorAll('img').forEach(img => {
  // Only hide if not yet loaded
  if (!img.complete) {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.8s ease';
  }

  img.addEventListener('load', () => {
    img.style.opacity = '1';
  });

  img.addEventListener('error', () => {
    img.style.background = 'linear-gradient(135deg, #111120, #0c0c16)';
    img.style.minHeight = '240px';
    img.style.opacity = '1';
  });

  // If already loaded (cached), show immediately
  if (img.complete && img.naturalWidth > 0) {
    img.style.opacity = '1';
  }

  // Failsafe: ensure all images show after 3 seconds no matter what
  setTimeout(() => {
    img.style.opacity = '1';
  }, 3000);
});

// ===========================
// LOADING SCREEN LOGIC
// ===========================
const loader = document.getElementById('loaderScreen');
const loaderGlow = document.querySelector('.loader-glow');
const loaderStatus = document.getElementById('loaderStatus');
const loaderPerc = document.getElementById('loaderPercentage');
const loaderContent = document.querySelector('.loader-content');
const backdropText = document.querySelector('.loader-backdrop-text');
const particlesContainer = document.getElementById('loaderParticles');

// 1. Particle Generation
if (particlesContainer) {
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'loader-particle';
    const size = Math.random() * 4 + 2;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left = `${Math.random() * 100}%`;
    p.style.top = `${Math.random() * 100}%`;
    p.style.opacity = Math.random() * 0.4;
    p.animate([
      { transform: 'translate(0, 0)' },
      { transform: `translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px)` }
    ], {
      duration: 3000 + Math.random() * 3000,
      iterations: Infinity,
      direction: 'alternate',
      easing: 'ease-in-out'
    });
    particlesContainer.appendChild(p);
  }
}

// 2. Interactive Tilt & Parallax
if (loader) {
  loader.addEventListener('mousemove', (e) => {
    if (loader.classList.contains('wipe')) return;
    const x = e.clientX;
    const y = e.clientY;
    if (loaderGlow) {
      loaderGlow.style.left = `${x}px`;
      loaderGlow.style.top = `${y}px`;
    }
    if (loaderContent) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const rotX = (centerY - y) / 25;
      const rotY = (x - centerX) / 25;
      loaderContent.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    }
    if (backdropText) {
      const moveX = (window.innerWidth / 2 - x) / 40;
      const moveY = (window.innerHeight / 2 - y) / 40;
      backdropText.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
    }
  });
}

// 3. Coordinated Removal
let progress = 0;
const messages = ["CALIBRATING...", "SYNCING DATA...", "RENDERER INIT...", "PULSE ACTIVE"];
const progressInterval = setInterval(() => {
  progress += Math.random() * 12;
  if (progress >= 100) {
    progress = 100;
    clearInterval(progressInterval);
    removeLoader();
  }
  if (loaderPerc) loaderPerc.textContent = Math.floor(progress);
  if (loaderStatus) {
    const msgIdx = Math.min(Math.floor((progress / 100) * messages.length), messages.length - 1);
    loaderStatus.textContent = messages[msgIdx];
  }
}, 180);

const removeLoader = () => {
  if (!loader || loader.classList.contains('hidden')) return;
  setTimeout(() => {
    loader.classList.add('wipe');
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
      scanReveals();
      const heroReveal = document.querySelector('.hero-reveal');
      if (heroReveal) heroReveal.classList.add('visible');
      window.scrollBy(0, 1);
      window.scrollBy(0, -1);
      setTimeout(scanReveals, 500);
    }, 2200);
  }, 600);
};

window.addEventListener('load', () => {
  // If assets are ready early, we still wait for progress
});
setTimeout(removeLoader, 8000);

// Prevent scroll during loading
document.body.style.overflow = 'hidden';

// ===========================
// SCROLL PROGRESS BAR
// ===========================
const progressBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  progressBar.style.width = scrolled + "%";
}, { passive: true });
