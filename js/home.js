// ============================================
// 中建智能技术有限公司 - 首页脚本 v2
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // Initialize particle network on hero canvas
  const heroCanvas = document.getElementById('hero-particles');
  if (heroCanvas && typeof ParticleNetwork !== 'undefined') {
    new ParticleNetwork(heroCanvas, {
      particleCount: 160,
      particleColor: 'rgba(0, 195, 255, 0.5)',
      lineColor: 'rgba(0, 195, 255, 0.12)',
      particleSpeed: 0.4,
      connectionDistance: 140,
      lineWidth: 1,
      particleRadius: 1.8,
      mouseInteract: true,
      responsive: true
    });
  }

  // Initialize tech cards 3D tilt effect
  initTechCardTilt();

  // Initialize hero text animations
  initHeroAnimations();

  // Initialize scroll-triggered animations with direction variants
  initDirectionalAnimations();
});

// ============================================
// Tech card 3D tilt effect
// ============================================
function initTechCardTilt() {
  const cards = document.querySelectorAll('.tech-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', function(e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / centerY * -10;
      const rotateY = (x - centerX) / centerX * 10;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', function() {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

// ============================================
// Hero text animations
// ============================================
function initHeroAnimations() {
  const heroTitle = document.querySelector('.hero-title');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  const heroButtons = document.querySelector('.hero-buttons');

  if (heroTitle) {
    heroTitle.style.opacity = '0';
    heroTitle.style.animation = 'fadeInUp 1s ease-out 0.2s forwards';
  }

  if (heroSubtitle) {
    heroSubtitle.style.opacity = '0';
    heroSubtitle.style.animation = 'fadeInUp 1s ease-out 0.5s forwards';
  }

  if (heroButtons) {
    heroButtons.style.opacity = '0';
    heroButtons.style.animation = 'fadeInUp 1s ease-out 0.8s forwards';
  }
}

// ============================================
// Directional scroll animations
// Assigns different animation directions based on element position
// ============================================
function initDirectionalAnimations() {
  // Auto-assign animation directions based on element position/role
  const sections = document.querySelectorAll('section');

  sections.forEach(section => {
    const cards = section.querySelectorAll('.business-card, .case-card, .tech-card');
    cards.forEach((card, index) => {
      // Skip if already has a directional class
      if (card.classList.contains('fade-left') ||
          card.classList.contains('fade-right') ||
          card.classList.contains('zoom-in') ||
          card.classList.contains('blur-in')) {
        return;
      }

      // Alternate directions for visual rhythm
      if (index % 3 === 0) {
        card.classList.add('fade-left');
      } else if (index % 3 === 1) {
        card.classList.add('fade-right');
      } else {
        card.classList.add('zoom-in');
      }
    });
  });
}
