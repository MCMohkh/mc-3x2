// MC JOINT — SHARED JS

document.addEventListener('DOMContentLoaded', () => {

  // Sticky header shadow
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Mobile menu
  const toggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => mobileMenu.classList.toggle('active'));
    document.querySelectorAll('.mobile-menu a').forEach(a => {
      a.addEventListener('click', () => mobileMenu.classList.remove('active'));
    });
  }

  // Footer year
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  // Active nav link
  const norm = p => (p.split('#')[0].replace(/\/index\.html$/, '/').replace(/\.html$/, '').replace(/\/$/, '')) || '/';
  const here = norm(window.location.pathname);
  document.querySelectorAll('nav > a, nav > .nav-dropdown > a').forEach(a => {
    if (norm(a.getAttribute('href')) === here) a.classList.add('active');
  });

  // Animated counters
  function animateCounter(el, target, prefix='', suffix='') {
    let start = 0;
    const inc = target / 80;
    const iv = setInterval(() => {
      start += inc;
      if (start >= target) { start = target; clearInterval(iv); }
      el.textContent = prefix + Math.floor(start).toLocaleString('en-IN') + suffix;
    }, 20);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, prefix, suffix);
        el.dataset.animated = 'true';
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').substring(1);
      const el = document.getElementById(id);
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  // Fade-in on scroll
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));
});
