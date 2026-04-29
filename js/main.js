// ============================================
// 中建智能技术有限公司 - 全局脚本
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all modules
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initCountUpAnimations();
  initSmoothScroll();
});

// ============================================
// Navbar scroll effect
// ============================================
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let lastScroll = 0;

  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });
}

// ============================================
// Mobile menu toggle
// ============================================
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (!menuBtn || !navLinks) return;

  menuBtn.addEventListener('click', function() {
    menuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function() {
      menuBtn.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// ============================================
// Scroll animations via IntersectionObserver
// ============================================
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

// ============================================
// Count up animation for numbers
// ============================================
function initCountUpAnimations() {
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';
        const duration = parseInt(el.getAttribute('data-duration')) || 2000;
        const isDecimal = target % 1 !== 0;

        animateCount(el, 0, target, duration, prefix, suffix, isDecimal);
        observer.unobserve(el);
      }
    });
  }, observerOptions);

  counters.forEach(counter => observer.observe(counter));
}

function animateCount(el, start, end, duration, prefix, suffix, isDecimal) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function (ease-out cubic)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = start + (end - start) * easeOut;

    if (isDecimal) {
      el.textContent = prefix + current.toFixed(1) + suffix;
    } else {
      el.textContent = prefix + Math.floor(current) + suffix;
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      if (isDecimal) {
        el.textContent = prefix + end.toFixed(1) + suffix;
      } else {
        el.textContent = prefix + Math.floor(end) + suffix;
      }
    }
  }

  requestAnimationFrame(update);
}

// ============================================
// Smooth scroll for anchor links
// ============================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ============================================
// Filter functionality (used in cases.html)
// ============================================
function initFilter(filterContainer, itemsContainer) {
  if (!filterContainer || !itemsContainer) return;

  const filterBtns = filterContainer.querySelectorAll('.filter-btn');
  const items = itemsContainer.querySelectorAll('.filter-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      // Filter items
      items.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = '';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => {
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

// ============================================
// Form validation (used in contact.html)
// ============================================
function validateForm(form) {
  if (!form) return false;

  let isValid = true;
  const requiredFields = form.querySelectorAll('[required]');

  requiredFields.forEach(field => {
    const errorEl = field.parentElement.querySelector('.error-msg');

    if (!field.value.trim()) {
      field.classList.add('error');
      if (errorEl) errorEl.textContent = '此项为必填项';
      isValid = false;
    } else {
      field.classList.remove('error');
      if (errorEl) errorEl.textContent = '';

      // Email validation
      if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
          field.classList.add('error');
          if (errorEl) errorEl.textContent = '请输入有效的邮箱地址';
          isValid = false;
        }
      }

      // Phone validation
      if (field.type === 'tel') {
        const phoneRegex = /^[0-9\-\s+()]{7,20}$/;
        if (!phoneRegex.test(field.value)) {
          field.classList.add('error');
          if (errorEl) errorEl.textContent = '请输入有效的电话号码';
          isValid = false;
        }
      }
    }
  });

  return isValid;
}

// ============================================
// Utility: Debounce
// ============================================
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ============================================
// Utility: Throttle
// ============================================
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
