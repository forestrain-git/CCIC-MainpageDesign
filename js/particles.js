// ============================================
// 中建智能技术有限公司 - Canvas 2D 粒子系统
// ============================================

class ParticleNetwork {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 150 };
    this.animationId = null;

    // Default options
    this.options = {
      particleCount: options.particleCount || 200,
      particleColor: options.particleColor || 'rgba(0, 195, 255, 0.6)',
      lineColor: options.lineColor || 'rgba(0, 195, 255, 0.15)',
      particleSpeed: options.particleSpeed || 0.5,
      connectionDistance: options.connectionDistance || 150,
      lineWidth: options.lineWidth || 1,
      particleRadius: options.particleRadius || 2,
      mouseInteract: options.mouseInteract !== false,
      responsive: options.responsive !== false
    };

    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.addEventListeners();
    this.animate();
  }

  resize() {
    const parent = this.canvas.parentElement;
    this.canvas.width = parent ? parent.offsetWidth : window.innerWidth;
    this.canvas.height = parent ? parent.offsetHeight : window.innerHeight;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
  }

  createParticles() {
    this.particles = [];
    const count = this.options.particleCount;

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * this.options.particleSpeed * 2,
        vy: (Math.random() - 0.5) * this.options.particleSpeed * 2,
        radius: Math.random() * this.options.particleRadius + 1,
        opacity: Math.random() * 0.5 + 0.3
      });
    }
  }

  addEventListeners() {
    if (this.options.mouseInteract) {
      this.canvas.addEventListener('mousemove', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
      });

      this.canvas.addEventListener('mouseleave', () => {
        this.mouse.x = null;
        this.mouse.y = null;
      });
    }

    if (this.options.responsive) {
      window.addEventListener('resize', () => {
        this.resize();
        this.createParticles();
      });
    }
  }

  updateParticles() {
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Move particle
      p.x += p.vx;
      p.y += p.vy;

      // Bounce off edges
      if (p.x < 0 || p.x > this.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.height) p.vy *= -1;

      // Keep in bounds
      p.x = Math.max(0, Math.min(this.width, p.x));
      p.y = Math.max(0, Math.min(this.height, p.y));

      // Mouse interaction
      if (this.options.mouseInteract && this.mouse.x !== null) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.mouse.radius) {
          const force = (this.mouse.radius - distance) / this.mouse.radius;
          const angle = Math.atan2(dy, dx);
          p.vx -= Math.cos(angle) * force * 0.5;
          p.vy -= Math.sin(angle) * force * 0.5;
        }
      }

      // Speed limit
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      const maxSpeed = this.options.particleSpeed * 3;
      if (speed > maxSpeed) {
        p.vx = (p.vx / speed) * maxSpeed;
        p.vy = (p.vy / speed) * maxSpeed;
      }
    }
  }

  drawParticles() {
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = this.options.particleColor.replace('0.6', String(p.opacity));
      this.ctx.fill();

      // Glow effect
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = this.options.particleColor;
    }
    this.ctx.shadowBlur = 0;
  }

  drawConnections() {
    const distance = this.options.connectionDistance;

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < distance) {
          const opacity = (1 - dist / distance) * 0.3;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.strokeStyle = this.options.lineColor.replace('0.15', String(opacity));
          this.ctx.lineWidth = this.options.lineWidth;
          this.ctx.stroke();
        }
      }
    }
  }

  drawMouseConnections() {
    if (!this.options.mouseInteract || this.mouse.x === null) return;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < this.mouse.radius) {
        const opacity = (1 - dist / this.mouse.radius) * 0.5;
        this.ctx.beginPath();
        this.ctx.moveTo(this.mouse.x, this.mouse.y);
        this.ctx.lineTo(p.x, p.y);
        this.ctx.strokeStyle = `rgba(200, 164, 92, ${opacity})`;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
      }
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.updateParticles();
    this.drawConnections();
    this.drawMouseConnections();
    this.drawParticles();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

// Party page gold particles
class GoldParticleSystem {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;

    this.options = {
      particleCount: options.particleCount || 80,
      colors: options.colors || ['#C8A45C', '#D4B76A', '#E8D5A3'],
      speed: options.speed || 0.3,
      ...options
    };

    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    window.addEventListener('resize', () => this.resize());
    this.animate();
  }

  resize() {
    const parent = this.canvas.parentElement;
    this.canvas.width = parent ? parent.offsetWidth : window.innerWidth;
    this.canvas.height = parent ? parent.offsetHeight : window.innerHeight;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.options.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * this.options.speed,
        vy: -Math.random() * this.options.speed - 0.1,
        radius: Math.random() * 3 + 1,
        color: this.options.colors[Math.floor(Math.random() * this.options.colors.length)],
        opacity: Math.random() * 0.6 + 0.2,
        pulse: Math.random() * Math.PI * 2
      });
    }
  }

  updateParticles() {
    for (let p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += 0.02;

      if (p.y < -10) {
        p.y = this.height + 10;
        p.x = Math.random() * this.width;
      }
      if (p.x < -10) p.x = this.width + 10;
      if (p.x > this.width + 10) p.x = -10;
    }
  }

  drawParticles() {
    for (let p of this.particles) {
      const currentOpacity = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = currentOpacity;
      this.ctx.fill();

      // Glow
      this.ctx.shadowBlur = 15;
      this.ctx.shadowColor = p.color;
    }
    this.ctx.shadowBlur = 0;
    this.ctx.globalAlpha = 1;
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.updateParticles();
    this.drawParticles();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}
