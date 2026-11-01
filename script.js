/**
 * ARVIND KUMAR - PERSONAL PORTFOLIO JAVASCRIPT
 * Features: Dark/Light Mode, Interactive Canvas, Typing Effect, Scroll Animations,
 * Mobile Menu, Project Filters, Certificate Modal, Form Validation & Toast Alerts.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. THEME SWITCHER (DARK / LIGHT MODE)
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const htmlElement = document.documentElement;

  // Check saved preference or default to dark
  const savedTheme = localStorage.getItem('arvind_portfolio_theme') || 'dark';
  setTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      showToast(`Switched to ${newTheme.toUpperCase()} mode!`, 'fa-circle-half-stroke');
    });
  }

  function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('arvind_portfolio_theme', theme);
    // Update canvas particle colors if canvas initialized
    if (window.updateCanvasTheme) {
      window.updateCanvasTheme(theme);
    }
  }

  /* ==========================================================================
     2. DYNAMIC TYPING EFFECT (HERO SUBTITLE)
     ========================================================================== */
  const typedTextElement = document.getElementById('typed-hero-text');
  const phrases = [
    'BCA Student & Aspiring Web Developer',
    'BCA 2nd Year Student',
    'Aspiring Web Developer',
    'C & C++ Programming Learner',
    'Frontend UI Enthusiast',
    'Future Full-Stack Developer'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function typeEffect() {
    if (!typedTextElement) return;

    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typedTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      typedTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 95;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 1800; // Pause at full word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400; // Pause before next word
    }

    setTimeout(typeEffect, typingSpeed);
  }

  typeEffect();

  /* ==========================================================================
     3. NAVBAR SCROLL & PROGRESS BAR
     ========================================================================== */
  const navbar = document.getElementById('main-navbar');
  const scrollProgressBar = document.getElementById('scroll-progress-bar');
  const backToTopBtn = document.getElementById('back-to-top-btn');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollY / docHeight) * 100;

    // Scroll progress bar
    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
    }

    // Navbar background blur & shadow
    if (navbar) {
      if (scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Back to top visibility
    if (backToTopBtn) {
      if (scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================================================
     4. MOBILE NAVIGATION MENU
     ========================================================================== */
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const mobileOverlay = document.getElementById('mobile-nav-overlay');
  const navLinks = document.querySelectorAll('.nav-link');

  function toggleMobileMenu() {
    if (!hamburgerBtn || !navMenu) return;
    const isOpen = hamburgerBtn.classList.toggle('open');
    navMenu.classList.toggle('active');
    if (mobileOverlay) {
      mobileOverlay.classList.toggle('active');
    }
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMobileMenu() {
    if (hamburgerBtn && hamburgerBtn.classList.contains('open')) {
      hamburgerBtn.classList.remove('open');
      navMenu.classList.remove('active');
      if (mobileOverlay) mobileOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', toggleMobileMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  /* ==========================================================================
     5. ACTIVE SECTION LINK HIGHLIGHTING
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-25% 0px -65% 0px'
  });

  sections.forEach(section => sectionObserver.observe(section));

  /* ==========================================================================
     6. SCROLL REVEAL & SKILL PROGRESS ANIMATION
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const skillBars = document.querySelectorAll('.skill-progress-bar');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));

  // Animate skill progress bars when skills section is entered
  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          skillBars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-skill-level') || '75%';
            bar.style.width = targetWidth;
          });
          skillsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    skillsObserver.observe(skillsSection);
  }

  /* ==========================================================================
     7. PROJECTS CATEGORY FILTER
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || filterValue === cardCategory) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  /* ==========================================================================
     8. CERTIFICATE MODAL PREVIEW
     ========================================================================== */
  const certModal = document.getElementById('cert-modal');
  const certModalImg = document.getElementById('cert-modal-img');
  const certModalTitle = document.getElementById('cert-modal-title');
  const certModalIssuer = document.getElementById('cert-modal-issuer');
  const certModalClose = document.getElementById('cert-modal-close');
  const viewCertBtns = document.querySelectorAll('.view-cert-btn');

  viewCertBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.cert-card');
      if (!card) return;

      const imgSrc = card.querySelector('.cert-preview-img')?.getAttribute('src');
      const title = card.querySelector('.cert-title')?.textContent;
      const issuer = card.querySelector('.cert-issuer')?.textContent;

      if (certModal && certModalImg && certModalTitle && certModalIssuer) {
        certModalImg.src = imgSrc || 'assets/cert-placeholder.svg';
        certModalTitle.textContent = title || 'Certificate Preview';
        certModalIssuer.textContent = issuer || 'Verified Credential';
        certModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeCertModal() {
    if (certModal) {
      certModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (certModalClose) certModalClose.addEventListener('click', closeCertModal);
  if (certModal) {
    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) closeCertModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCertModal();
      closeMobileMenu();
    }
  });

  /* ==========================================================================
     9. CONTACT FORM SUBMISSION & CLIENT VALIDATION
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (contactForm && submitBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name')?.value.trim();
      const email = document.getElementById('form-email')?.value.trim();
      const subject = document.getElementById('form-subject')?.value.trim();
      const message = document.getElementById('form-message')?.value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in all required fields.', 'fa-triangle-exclamation');
        return;
      }

      // Simple Email Format Validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address.', 'fa-triangle-exclamation');
        return;
      }

      // Show sending state
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

      // Simulate sending feedback
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        contactForm.reset();
        showToast(`Thank you, ${name}! Your message has been sent successfully.`, 'fa-circle-check');
      }, 1200);
    });
  }

  /* ==========================================================================
     10. COPY EMAIL TO CLIPBOARD
     ========================================================================== */
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const emailText = document.getElementById('contact-email-text')?.textContent || 'arvindgupta32023@gmail.com';
      navigator.clipboard.writeText(emailText).then(() => {
        showToast('Email address copied to clipboard!', 'fa-copy');
      }).catch(() => {
        showToast('Failed to copy. Please copy manually.', 'fa-triangle-exclamation');
      });
    });
  }

  /* ==========================================================================
     11. TOAST NOTIFICATION SYSTEM
     ========================================================================== */
  const toastBox = document.getElementById('toast-box');
  const toastIcon = document.getElementById('toast-icon');
  const toastMessage = document.getElementById('toast-message');
  let toastTimeout = null;

  function showToast(message, iconClass = 'fa-circle-check') {
    if (!toastBox || !toastMessage) return;

    if (toastIcon) {
      toastIcon.className = `fa-solid ${iconClass} toast-icon`;
    }
    toastMessage.textContent = message;

    toastBox.classList.add('active');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastBox.classList.remove('active');
    }, 3500);
  }

  /* ==========================================================================
     12. INTERACTIVE CONSTELLATION / PARTICLE BACKGROUND CANVAS
     ========================================================================== */
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 16000), 65);

    let mouse = {
      x: null,
      y: null,
      radius: 120
    };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.speedX = (Math.random() - 0.5) * 0.7;
        this.speedY = (Math.random() - 0.5) * 0.7;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce on edges
        if (this.x < 0 || this.x > width) this.speedX *= -1;
        if (this.y < 0 || this.y > height) this.speedY *= -1;

        // Mouse interaction
        if (mouse.x != null && mouse.y != null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 3;
            this.y -= (dy / dist) * force * 3;
          }
        }
      }

      draw() {
        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        ctx.fillStyle = isDark ? 'rgba(0, 242, 254, 0.6)' : 'rgba(2, 132, 199, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function connectParticles() {
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const opacity = 1 - dist / 130;
            ctx.strokeStyle = isDark
              ? `rgba(0, 242, 254, ${opacity * 0.18})`
              : `rgba(2, 132, 199, ${opacity * 0.14})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      connectParticles();
      requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    window.updateCanvasTheme = function() {
      // Re-trigger color update seamlessly
    };
  }
});
