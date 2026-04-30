/* =========================================================
   Keystone South Construction — Main JavaScript
   Scroll animations · Parallax · Mobile nav · Form
   ========================================================= */

(() => {
  'use strict';

  /* ── DOM refs ─────────────────────────────────────────── */
  const nav        = document.getElementById('nav');
  const hamburger  = document.querySelector('.nav-hamburger');
  const navLinks   = document.querySelector('.nav-links');
  const heroBg     = document.querySelector('.hero-bg');
  const stickyBar  = document.getElementById('sticky-bar');
  const contactForm = document.getElementById('contactForm');

  /* ── Intersection Observer — reveal on scroll ──────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ── Scroll handler ────────────────────────────────────── */
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;

    /* Nav: darken on scroll */
    if (y > 60) {
      nav.style.background = 'rgba(10,10,10,0.95)';
    } else {
      nav.style.background = 'rgba(10,10,10,0.72)';
    }

    /* Hero parallax */
    if (heroBg) {
      const speed = 0.35;
      heroBg.style.transform = `translateY(${y * speed}px)`;
    }

    /* Sticky bar — show after scrolling 120 px */
    if (y > 120) {
      stickyBar.classList.add('visible');
    } else {
      stickyBar.classList.remove('visible');
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  /* ── Mobile hamburger ──────────────────────────────────── */
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      /* Animate bars */
      const bars = hamburger.querySelectorAll('span');
      if (isOpen) {
        bars[0].style.transform = 'translateY(7px) rotate(45deg)';
        bars[1].style.opacity   = '0';
        bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        bars[0].style.transform = '';
        bars[1].style.opacity   = '';
        bars[2].style.transform = '';
      }
    });

    /* Close nav on link click */
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        const bars = hamburger.querySelectorAll('span');
        bars[0].style.transform = '';
        bars[1].style.opacity   = '';
        bars[2].style.transform = '';
      });
    });
  }

  /* ── Gallery parallax on large screens ────────────────── */
  const galleryItems = document.querySelectorAll('.gallery-img-wrap');

  const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0 });

  if (window.innerWidth > 900) {
    galleryItems.forEach(img => {
      galleryObserver.observe(img);
    });

    window.addEventListener('scroll', () => {
      requestAnimationFrame(() => {
        galleryItems.forEach(imgWrap => {
          if (!imgWrap.classList.contains('in-view')) return;
          const rect   = imgWrap.getBoundingClientRect();
          const center = window.innerHeight / 2;
          const offset = ((rect.top + rect.height / 2) - center) * 0.08;
          imgWrap.querySelector('img').style.transform =
            `translateY(${offset}px) scale(1.05)`;
        });
      });
    }, { passive: true });
  }

  /* ── Animated counter ──────────────────────────────────── */
  function animateCounter(el, target, duration = 1800) {
    let start = null;
    const suffix = el.dataset.suffix || '';

    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); /* ease-out cubic */
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.count, 10);
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

  /* ── Contact form ──────────────────────────────────────── */
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn     = contactForm.querySelector('.btn-submit');
      const success = document.getElementById('formSuccess');

      btn.textContent = 'Sending…';
      btn.disabled    = true;

      /* Simulate network delay — replace with real fetch/FormData call */
      setTimeout(() => {
        contactForm.reset();
        btn.textContent = 'Message Sent ✓';
        btn.style.background = '#22c55e';
        if (success) success.style.display = 'block';

        setTimeout(() => {
          btn.textContent      = 'Send Message';
          btn.disabled         = false;
          btn.style.background = '';
          if (success) success.style.display = 'none';
        }, 4000);
      }, 1200);
    });
  }

  /* ── Smooth scroll for anchor links ───────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Initial scroll check (page reload mid‑scroll) ─────── */
  onScroll();
})();
