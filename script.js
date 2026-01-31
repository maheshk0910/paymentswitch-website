// =====================================================
// PAYMENT SWITCH UK - COMPLETE JAVASCRIPT
// =====================================================

// =====================================================
// 1. SCROLL PROGRESS BAR
// =====================================================
function updateScrollProgress() {
  const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    progressBar.style.width = scrolled + '%';
  }
}

window.addEventListener('scroll', updateScrollProgress);

// =====================================================
// 2. FLOATING PARTICLES BACKGROUND
// =====================================================
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 15 + 's';
    particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
    container.appendChild(particle);
  }
}

// =====================================================
// 3. PROMO BANNER
// =====================================================
function closePromoBanner() {
  const banner = document.getElementById('promo-banner');
  banner.style.animation = 'slideUp 0.3s ease-out';
  setTimeout(() => {
    banner.style.display = 'none';
    // Adjust sticky positions after banner closes
    const ticker = document.querySelector('.stats-ticker');
    const header = document.querySelector('header');
    if (ticker) ticker.style.top = '0';
    if (header) header.style.top = '2rem';
  }, 300);
  localStorage.setItem('promoBannerClosed', 'true');
}

// =====================================================
// 4. MOBILE NAVIGATION
// =====================================================
function toggleMobileMenu() {
  const nav = document.getElementById('mobile-nav');
  nav.classList.toggle('active');
  document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
}

// =====================================================
// 5. FAQ TOGGLE
// =====================================================
function toggleFAQ(element) {
  const item = element.parentElement;
  const wasActive = item.classList.contains('active');
  
  // Close all FAQ items
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
  
  // Open clicked item if it wasn't active
  if (!wasActive) {
    item.classList.add('active');
  }
}

// =====================================================
// 6. SMOOTH SCROLL TO CONTACT
// =====================================================
function scrollToContact(e) {
  if (e) e.preventDefault();
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
}

// =====================================================
// 7. SCROLL TO TOP
// =====================================================
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =====================================================
// 7. FORM SUBMIT Emailjs & telegram 
// =====================================================
function handleSubmit(e) {
  e.preventDefault();

  const params = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    business: document.getElementById('business-type').value,
    payments: document.querySelector('input[name="payments"]:checked').value
  };

  // 🔔 TELEGRAM ADMIN NOTIFICATION (via Netlify function)
  fetch("/.netlify/functions/sendTelegram", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params)
  }).catch(err => {
    console.error("Telegram notification failed:", err);
  });

  // ✅ Admin email
  emailjs.send(
    "service_d3pvldk",
    "template_hp1knth",
    params
  ).then(() => {
    console.log("Admin email sent");
  }).catch(err => {
    console.error("Admin email failed:", err);
  });

  // ✅ Customer email
  emailjs.send(
    "service_np25j3r",
    "template_eq3bjin",
    params
  ).then(() => {
    console.log("Customer email sent");
  }).catch(err => {
    console.error("Customer email failed:", err);
    alert(
      "We received your enquiry, but confirmation email could not be sent. Our team will still contact you."
    );
  });

  document.getElementById('modal').classList.add('active');
  document.getElementById('enquiry-form').reset();
}

// =====================================================
// 9. CLOSE MODAL
// =====================================================
function closeModal() {
  document.getElementById('modal').classList.remove('active');
}

// =====================================================
// 10. WELCOME POPUP
// =====================================================
function closeWelcomePopup() {
  document.getElementById('welcome-popup').classList.remove('active');
  // REMOVED: localStorage.setItem('welcomePopupShown', 'true');
  // Now it will show every time the page loads
}

// =====================================================
// 11. SCROLL EFFECTS
// =====================================================
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  const backBtn = document.getElementById('back-to-top');
  
  if (window.scrollY > 100) {
    header.classList.add('scrolled');
    backBtn.classList.add('visible');
  } else {
    header.classList.remove('scrolled');
    backBtn.classList.remove('visible');
  }
});

// =====================================================
// 12. INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
// =====================================================
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observe elements with animation classes
  document.querySelectorAll('.fade-in-scroll, .slide-in-left, .slide-in-right, .scale-up, .flip-in').forEach(el => {
    observer.observe(el);
  });
}

// =====================================================
// 13. ADD RIPPLE EFFECT TO BUTTONS
// =====================================================
function addRippleEffects() {
  document.querySelectorAll('button, .btn-submit, .pricing-btn, .cta-btn, .popup-btn, .modal-btn').forEach(btn => {
    if (!btn.classList.contains('btn-ripple')) {
      btn.classList.add('btn-ripple');
    }
  });
}

// =====================================================
// 14. COUNTER ANIMATION
// =====================================================
function animateCounter(element, target, duration = 2000, suffix = '') {
  let current = 0;
  const increment = target / (duration / 16);
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target + suffix;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current * 100) / 100 + suffix;
    }
  }, 16);
}

// =====================================================
// 15. INITIALIZE COUNTERS ON SCROLL
// =====================================================
function initCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        const target = parseFloat(entry.target.getAttribute('data-count'));
        const suffix = entry.target.getAttribute('data-suffix') || '';
        animateCounter(entry.target, target, 2000, suffix);
        entry.target.classList.add('counted');
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => {
    observer.observe(el);
  });
}

// =====================================================
// 16. SMOOTH SCROLL TO ANCHOR LINKS
// =====================================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
}

// =====================================================
// 17. SOCIAL PROOF NOTIFICATIONS
// =====================================================
const notifications = [
  { name: 'UK business owner', text: 'Requested a callback' },
  { name: 'Retailer from Manchester', text: 'Enquired about card machines' },
  { name: 'UK merchant', text: 'Recently made an enquiry' },
  { name: 'Service provider from Leeds', text: 'Switched card machine provider' },
  { name: 'Business owner', text: 'Requested pricing details' },
  { name: 'Retail store', text: 'Exploring card machine options' },
  { name: 'Hospitality business', text: 'Started application process' }
];


let notifIndex = 0;

function showNotification() {
  const notif = document.getElementById('notification');
  if (!notif) return;
  
  const data = notifications[notifIndex];
  notif.querySelector('.notification-name').textContent = data.name;
  notif.querySelector('.notification-text').textContent = data.text;
  notif.classList.add('show');
  
  setTimeout(() => notif.classList.remove('show'), 4000);
  notifIndex = (notifIndex + 1) % notifications.length;
}

// =====================================================
// 18. CHECK LOCAL STORAGE FOR PROMO BANNER
// =====================================================
function checkPromoBanner() {
  const promoBannerClosed = localStorage.getItem('promoBannerClosed');
  if (promoBannerClosed === 'true') {
    const banner = document.getElementById('promo-banner');
    if (banner) banner.style.display = 'none';
    const ticker = document.querySelector('.stats-ticker');
    const header = document.querySelector('header');
    if (ticker) ticker.style.top = '0';
    if (header) header.style.top = '2rem';
  }
}

// =====================================================
// 19. SHOW WELCOME POPUP - MODIFIED TO SHOW ALWAYS
// =====================================================
function showWelcomePopup() {
  // CHANGED: Now always shows the popup, regardless of localStorage
  setTimeout(() => {
    const popup = document.getElementById('welcome-popup');
    if (popup) popup.classList.add('active');
  }, 2000); // Shows after 2 seconds
}

// =====================================================
// 20. INITIALIZE ALL FUNCTIONS
// =====================================================
function initAllAnimations() {
  createParticles();
  initScrollAnimations();
  addRippleEffects();
  initCounters();
  initSmoothScroll();
  checkPromoBanner();
  showWelcomePopup(); // CHANGED: Now calls showWelcomePopup instead of checkWelcomePopup
  
  // Start notification cycle
  setTimeout(showNotification, 3000);
  setInterval(showNotification, 15000);
  
  console.log('✨ All animations and features initialized!');
}

// =====================================================
// 21. RUN ON PAGE LOAD
// =====================================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllAnimations);
} else {
  initAllAnimations();
}

// Re-initialize on dynamic content changes
window.addEventListener('load', () => {
  setTimeout(() => {
    addRippleEffects();
    initScrollAnimations();
  }, 500);
});

// =====================================================
// 22. PREVENT FORM RESUBMISSION ON PAGE REFRESH
// =====================================================
if (window.history.replaceState) {
  window.history.replaceState(null, null, window.location.href);
}

// =====================================================
// 23. GLOBAL ERROR HANDLER (OPTIONAL)
// =====================================================
window.addEventListener('error', (e) => {
  console.error('Global error:', e.message);
});

// =====================================================
// 24. LOG PERFORMANCE METRICS (OPTIONAL)
// =====================================================
window.addEventListener('load', () => {
  if (window.performance) {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`⚡ Page loaded in ${pageLoadTime}ms`);
  }
});

function acceptCookies() {
  document.getElementById('cookie-banner').style.display = 'none';
  localStorage.setItem('cookiesAccepted', 'true');
}

window.addEventListener('load', () => {
  if (localStorage.getItem('cookiesAccepted') === 'true') {
    const banner = document.getElementById('cookie-banner');
    if (banner) banner.style.display = 'none';
  }
});

// =====================================================
// save lead google sheet 
// =====================================================
//function saveLeadToSheet(data) {
  //const formData = new FormData();

  //formData.append("name", data.name);
 // formData.append("email", data.email);
 // formData.append("phone", data.phone);
 // formData.append("business", data.business);
 // formData.append("payments", data.payments);

 // fetch("https://script.google.com/macros/s/AKfycbyelN1aoSEHxqdlN1fDuG71wizA574DkQrpg81SzRCDK27jl0VSbqE8FHYZZERqwRHU/exec", {
   // method: "POST",
 //   mode: "no-cors",
  //  body: formData
  //});

  //console.log("Lead sent to Google Sheets");
//}


// =====================================================
// END OF SCRIPT

// =====================================================
