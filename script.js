(function () {
  'use strict';
  var SERVICE_ID  = 'service_r3o0k3e';   
  var TEMPLATE_ID = 'template_eq7tz74';  



  /* ── NAVBAR ────────────────────────────────────────────── */
  var navbar = document.getElementById('navbar');

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    var total = document.documentElement.scrollHeight - window.innerHeight;
    var pct   = total > 0 ? (window.scrollY / total) * 100 : 0;
    document.body.style.setProperty('--scroll-pct', pct.toFixed(1) + '%');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ── HAMBURGER MENU ─────────────────────────────────────── */
  var hamburger = document.getElementById('hamburger');
  var navLinks  = document.getElementById('navLinks');

  function closeMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });


  /* ── SMOOTH SCROLL ──────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var navH = 70;
      var top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });


  /* ── SCROLL REVEAL ──────────────────────────────────────── */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var siblings = Array.from(
        entry.target.parentElement.querySelectorAll('[data-aos]')
      );
      var index = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = (index * 90) + 'ms';
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('[data-aos]').forEach(function (el) {
    revealObserver.observe(el);
  });


  /* ── CONTACT FORM ───────────────────────────────────────── */
  var form       = document.getElementById('contactForm');
  var successMsg = document.getElementById('formSuccess');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name    = document.getElementById('name').value.trim();
    var email   = document.getElementById('email').value.trim();
    var phone   = document.getElementById('phone').value.trim();
    var message = document.getElementById('message').value.trim();

    /* — Client-side validation — */
    clearError();

    if (!name) {
      showError('Please enter your full name.');
      document.getElementById('name').focus();
      return;
    }
    if (!email || !isValidEmail(email)) {
      showError('Please enter a valid email address.');
      document.getElementById('email').focus();
      shakeEl(document.getElementById('email'));
      return;
    }
    if (!message) {
      showError('Please write a message before sending.');
      document.getElementById('message').focus();
      return;
    }


    if (typeof emailjs === 'undefined') {
      showError('Email service failed to load. Please refresh the page and try again.');
      console.error('EmailJS SDK not loaded. Check your internet connection or ad-blocker.');
      return;
    }

    /* — Check placeholders haven't been left in — */
    if (TEMPLATE_ID === 'YOUR_TEMPLATE_ID') {
      showError('Developer: Template ID not set in script.js. See setup instructions at the top of the file.');
      console.error('⚠️  MUBOK FARM: Replace YOUR_TEMPLATE_ID in script.js with your real EmailJS Template ID.');
      return;
    }

    /* — Send — */
    var btn  = form.querySelector('button[type="submit"]');
    var text = btn.querySelector('.btn-text');

    btn.disabled    = true;
    text.textContent = 'Sending…';

    var params = {
      title   : 'Mubok Farm — New Enquiry',
      name    : name,
      email   : email,
      phone   : phone ? phone : 'Not provided',
      message : message
    };

    console.log('Sending to EmailJS:', SERVICE_ID, TEMPLATE_ID, params);

    emailjs.send(SERVICE_ID, TEMPLATE_ID, params)
      .then(function (response) {
        console.log('EmailJS success:', response.status, response.text);
        text.textContent        = 'Message Sent';
        btn.style.background    = 'var(--c-green-lt)';
        successMsg.classList.add('visible');
        form.reset();

        setTimeout(function () {
          btn.disabled        = false;
          text.textContent    = 'Send Message';
          btn.style.background = '';
          successMsg.classList.remove('visible');
        }, 5000);
      })
      .catch(function (err) {
        console.error('EmailJS failed:', err);

        var hint = '';
        if (err && err.status === 400) {
          hint = ' (Error 400: Check your Template ID and that all template variables match.)';
        } else if (err && err.status === 401) {
          hint = ' (Error 401: Your Public Key is wrong. Check index.html → emailjs.init.)';
        } else if (err && err.status === 404) {
          hint = ' (Error 404: Service ID or Template ID not found. Double-check both.)';
        } else if (err && err.status === 422) {
          hint = ' (Error 422: Template variable mismatch. Make sure your template uses {{name}}, {{email}}, {{message}}, {{title}}, {{phone}}.)';
        }

        text.textContent = 'Failed — try again';
        btn.disabled     = false;
        showError('Message failed to send.' + hint + ' Or call us directly.');

        setTimeout(function () {
          text.textContent = 'Send Message';
        }, 3500);
      });
  });


  /* ── HELPERS ────────────────────────────────────────────── */
  function showError(msg) {
    var el = form.querySelector('.form-error');
    if (!el) {
      el = document.createElement('p');
      el.className = 'form-error';
      form.querySelector('button[type="submit"]').insertAdjacentElement('afterend', el);
    }
    el.textContent  = msg;
    el.style.display = 'block';
  }

  function clearError() {
    var el = form.querySelector('.form-error');
    if (el) el.style.display = 'none';
  }

  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  function shakeEl(el) {
    el.style.animation = '';
    // Force reflow so animation restarts
    void el.offsetWidth;
    el.style.animation = 'shake .45s ease';
    el.addEventListener('animationend', function () {
      el.style.animation = '';
    }, { once: true });
  }

  /* Shake keyframe */
  var styleTag = document.createElement('style');
  styleTag.textContent = [
    '@keyframes shake {',
    '  0%,100% { transform: translateX(0); }',
    '  20%     { transform: translateX(-9px); }',
    '  40%     { transform: translateX(9px); }',
    '  60%     { transform: translateX(-5px); }',
    '  80%     { transform: translateX(5px); }',
    '}'
  ].join('\n');
  document.head.appendChild(styleTag);


  /* ── FOOTER YEAR ────────────────────────────────────────── */
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

})();