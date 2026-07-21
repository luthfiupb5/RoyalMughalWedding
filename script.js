// Register GSAP ScrollToPlugin
gsap.registerPlugin(ScrollToPlugin);

/* ==========================================
   AMBIENT FLOATING PARTICLES
   ========================================== */
function createParticles() {
  const container = document.getElementById('particle-container');
  if (!container) return;

  const particleCount = 28;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    // Randomized initial properties
    const size = Math.random() * 5 + 3; // 3px to 8px
    const startX = Math.random() * 100; // 0% to 100% width
    const startY = Math.random() * 100; // Distribute vertically across viewport initially
    const maxOpacity = Math.random() * 0.6 + 0.3; // 0.3 to 0.9

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${startX}%`;
    particle.style.top = `${startY}%`;
    particle.style.opacity = 0; // Start invisible, fade in

    container.appendChild(particle);

    // Elegant float animation using GSAP timeline
    const duration = Math.random() * 8 + 12; // 12s to 20s (slow & premium)

    gsap.timeline({ repeat: -1 })
      .to(particle, {
        opacity: maxOpacity,
        duration: 2,
        ease: "power1.in"
      })
      .to(particle, {
        y: -window.innerHeight - 100,
        x: `+=${Math.random() * 60 - 30}`, // gentle drift sway
        duration: duration,
        ease: "none"
      }, 0)
      .to(particle, {
        opacity: 0,
        duration: 2,
        ease: "power1.out"
      }, duration - 2)
      .set(particle, {
        y: 0,
        left: `${Math.random() * 100}%`,
        top: '100%' // Reset to bottom for subsequent loops
      });
  }
}

/* ==========================================
   WAX SEAL OPENING ANIMATION (GSAP)
   ========================================== */
const envelopeOverlay = document.getElementById('envelope-overlay');
const mainContent = document.getElementById('main-content');
const bgMusic = document.getElementById('bg-music');
const musicToggleBtn = document.getElementById('music-toggle-btn');
const openingVideo = document.getElementById('opening-video');

let hasTransitioned = false;

// Unified transition to main invitation content
function transitionToHero() {
  if (hasTransitioned) return;
  hasTransitioned = true;

  // Stop video playback
  if (openingVideo) {
    openingVideo.pause();
  }

  // Keep scroll lock active initially on the Hero Card overlay
  // document.body.classList.remove('no-scroll');

  // Instantly hide the envelope overlay (no burgundy transition blinking)
  if (envelopeOverlay) {
    envelopeOverlay.style.display = 'none';
  }

  // GSAP timeline for text animations
  const tl = gsap.timeline();

  // Create a label for simultaneous start of background cross-fade and container fade-in
  tl.addLabel("fadeStart", 0.1);

  // Fade background from base to transition (after-intro.png)
  tl.to(".hero-bg-transition", {
    opacity: 1,
    duration: 1.5,
    ease: "power2.inOut"
  }, "fadeStart");

  // 1. Gently fade in and settle the blurred arch container
  tl.fromTo(".hero-arch-container",
    { opacity: 0, scale: 0.98 },
    { opacity: 1, scale: 1, duration: 1.0, ease: "power2.out" },
    "fadeStart"
  );

  // 2. Staggered reveal of hero text components starting after container is visible
  tl.fromTo(".hero-arch-content .bismillah-img",
    { opacity: 0, y: 15 },
    { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
    "fadeStart+=0.6"
  );

  tl.fromTo(".hero-arch-content .bismillah-translation",
    { opacity: 0, y: 15 },
    { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
    "fadeStart+=0.85"
  );

  tl.fromTo(".hero-arch-content .hero-divider, .hero-arch-content .hero-divider-small",
    { opacity: 0, scaleX: 0 },
    { opacity: 1, scaleX: 1, duration: 0.8, ease: "power2.out" },
    "fadeStart+=1.05"
  );

  tl.fromTo(".hero-arch-content .hero-initials",
    { opacity: 0, scale: 0.9 },
    { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" },
    "fadeStart+=1.2"
  );

  tl.fromTo(".hero-arch-content .hero-couple-names",
    { opacity: 0, y: 15 },
    { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
    "fadeStart+=1.4"
  );

  tl.fromTo(".scroll-cue",
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
    "fadeStart+=1.7"
  );

  // Active state for hero section elements
  const heroSection = document.getElementById('hero-section');
  if (heroSection) {
    heroSection.classList.add('active');
  }

  // Start background music loop
  playMusic();

  // Start floating particles
  createParticles();
}

// Play transition once video playback completes
if (openingVideo) {
  openingVideo.addEventListener('ended', transitionToHero);

  // Programmatically trigger play immediately to minimize initial black frame / load delay
  openingVideo.play().catch(err => {
    console.warn("Muted autoplay triggered programmatically, handled fallback:", err);
  });
}



/* ==========================================
   BACKGROUND MUSIC CONTROLLER
   ========================================== */
let isMusicInitialized = false;

function playMusic() {
  if (!bgMusic) return;
  bgMusic.play()
    .then(() => {
      isMusicInitialized = true;
      musicToggleBtn.classList.add('playing');
      musicToggleBtn.querySelector('.icon-playing').classList.remove('hidden');
      musicToggleBtn.querySelector('.icon-muted').classList.add('hidden');
    })
    .catch((err) => {
      console.warn("Audio autoplay blocked by browser policy:", err);
    });
}

if (musicToggleBtn && bgMusic) {
  musicToggleBtn.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play();
      musicToggleBtn.classList.add('playing');
      musicToggleBtn.querySelector('.icon-playing').classList.remove('hidden');
      musicToggleBtn.querySelector('.icon-muted').classList.add('hidden');
    } else {
      bgMusic.pause();
      musicToggleBtn.classList.remove('playing');
      musicToggleBtn.querySelector('.icon-playing').classList.add('hidden');
      musicToggleBtn.querySelector('.icon-muted').classList.remove('hidden');
    }
  });
}



/* ==========================================
   SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================== */
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll('.scroll-section');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        sectionObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0 // fire as soon as any pixel enters viewport
  });

  sections.forEach(section => {
    sectionObserver.observe(section);
  });
});


/* ==========================================
   ADD TO CALENDAR MODAL SHEET & LOGIC
   ========================================== */
const calendarModal = document.getElementById('calendar-modal');
const modalEventName = document.getElementById('modal-event-name');
const googleCalLink = document.getElementById('google-cal-link');

// Event details holder
let currentEvent = {
  title: '',
  start: '',
  end: '',
  description: '',
  location: ''
};

function openCalendarModal(title, startISO, endISO, description, location) {
  currentEvent = {
    title: title,
    start: startISO,
    end: endISO,
    description: description,
    location: location
  };

  if (modalEventName) {
    modalEventName.innerText = title;
  }

  // Format details specifically for Google Calendar Template links
  const gStart = formatGoogleDate(new Date(startISO));
  const gEnd = formatGoogleDate(new Date(endISO));

  const gUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${gStart}/${gEnd}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;

  if (googleCalLink) {
    googleCalLink.setAttribute('href', gUrl);
  }

  if (calendarModal) {
    calendarModal.classList.remove('hidden');
  }
}

function closeCalendarModal() {
  if (calendarModal) {
    calendarModal.classList.add('hidden');
  }
}

// Format Date object to Google Calendar format (YYYYMMDDTHHmmssZ)
function formatGoogleDate(date) {
  return date.toISOString().replace(/-|:|\.\d+/g, '');
}

// Generate and trigger download of .ics file
function downloadIcsFile() {
  const start = formatIcsDate(new Date(currentEvent.start));
  const end = formatIcsDate(new Date(currentEvent.end));
  const stamp = formatIcsDate(new Date());

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Royal Mughal Palace Invitation//NONSGML v1.0//EN
BEGIN:VEVENT
UID:${Date.now()}@royalmughalpalace.com
DTSTAMP:${stamp}
DTSTART:${start}
DTEND:${end}
SUMMARY:${currentEvent.title}
DESCRIPTION:${currentEvent.description}
LOCATION:${currentEvent.location}
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.setAttribute('download', `${currentEvent.title.replace(/\s+/g, '_')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  closeCalendarModal();
}

function formatIcsDate(date) {
  return date.toISOString().replace(/-|:|\.\d+/g, '');
}

/* ==========================================
   WEB SHARE / LINK CLIPBOARD COPY
   ========================================== */
const shareInviteBtn = document.getElementById('share-invite-btn');
const shareToast = document.getElementById('share-toast');

if (shareInviteBtn) {
  shareInviteBtn.addEventListener('click', () => {
    if (navigator.share) {
      navigator.share({
        title: 'Yousuf & Ayisha Wedding Invitation',
        text: 'You are cordially invited to the wedding celebrations of Yousuf and Ayisha.',
        url: window.location.href
      })
        .catch((err) => {
          console.log("Error sharing:", err);
        });
    } else {
      // Fallback: Copy URL to clipboard
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          showToast();
        })
        .catch(err => {
          console.error("Clipboard copy failed:", err);
        });
    }
  });
}

function showToast() {
  if (!shareToast) return;
  shareToast.classList.remove('hidden');
  shareToast.classList.add('show');

  setTimeout(() => {
    shareToast.classList.remove('show');
    setTimeout(() => {
      shareToast.classList.add('hidden');
    }, 400);
  }, 2000);
}

/* ==========================================
   WEDDING CARD MODAL INTERACTION
   ========================================== */
document.addEventListener("DOMContentLoaded", () => {
  const openCardBtn = document.getElementById('open-card-btn');
  const cardModal = document.getElementById('card-modal');

  if (openCardBtn && cardModal) {
    const closeBtn = cardModal.querySelector('.card-modal-close');
    const overlay = cardModal.querySelector('.card-modal-overlay');

    const openModal = () => {
      cardModal.classList.remove('hidden');
      document.body.classList.add('modal-open');
    };

    const closeModal = () => {
      cardModal.classList.add('hidden');
      document.body.classList.remove('modal-open');
    };

    openCardBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);
  }
});

/* ==========================================
   SLIDE DECK NAVIGATION — TRANSFORM BASED
   No window.scrollTo. No overflow conflicts.
   ========================================== */
(function () {
  /* ── State ── */
  let isHeroActive = true;
  let isAnimating = false;
  let currentScreen = 0; // 0=card 1=nikkah 2=couple 3=closing
  let touchStartY = 0;
  const DURATION = 0.82;
  const EASE = 'power3.inOut';

  /* ── Element refs ── */
  const deck = document.getElementById('snap-deck');
  const closing = document.getElementById('closing-section');

  /* Section order inside snap-deck */
  const snapSections = [
    document.getElementById('wedding-card-section'),
    document.getElementById('schedule-section'),
    document.getElementById('couple-section'),
  ];

  /* ── Ensure inner elements are immediately visible without blinking ── */
  function animateIn(el) {
    if (!el) return;
    el.classList.add('active');
    const targets = el.querySelectorAll(
      '.section-header-box, .section-title, .gold-divider-small, ' +
      '.royal-arch-frame, .royal-date-container, ' +
      '.couple-card-container, .scroll-entry-wrapper, ' +
      '.countdown-block, .venue-card-compact, .closing-card'
    );
    if (targets.length) {
      gsap.set(targets, { opacity: 1, y: 0 });
    }
  }

  /* ── Initialize section positions inside the deck ── */
  function initDeckSections() {
    if (closing) closing.classList.remove('visible');
    // Card visible at top; others hidden below, ready to slide in
    snapSections.forEach((s, i) => {
      if (!s) return;
      gsap.set(s, { y: i === 0 ? '0%' : '100%' });
    });
  }

  /* ── Navigate between snap sections (0-2) ── */
  function goToSnap(targetIdx) {
    if (isAnimating || targetIdx === currentScreen) return;
    if (targetIdx < 0 || targetIdx > 2) return;
    isAnimating = true;

    if (closing) closing.classList.remove('visible');

    const dir = targetIdx > currentScreen ? 1 : -1; // 1=down -1=up
    const outgoing = snapSections[currentScreen];
    const incoming = snapSections[targetIdx];

    // Pre-position incoming section
    gsap.set(incoming, { y: dir > 0 ? '100%' : '-100%' });

    const tl = gsap.timeline({
      onComplete: () => {
        currentScreen = targetIdx;
        isAnimating = false;
        animateIn(incoming, 0.1);
      }
    });

    // Outgoing slides out
    tl.to(outgoing, { y: dir > 0 ? '-100%' : '100%', duration: DURATION, ease: EASE }, 0);
    // Incoming slides in
    tl.to(incoming, { y: '0%', duration: DURATION, ease: EASE }, 0);
  }

  /* ── Reveal closing section (screen 3) ── */
  function openClosing() {
    if (isAnimating) return;
    isAnimating = true;

    if (closing) {
      closing.classList.add('visible');
      gsap.fromTo(closing,
        { y: '100vh' },
        {
          y: '0px',
          duration: DURATION,
          ease: EASE,
          onComplete: () => {
            currentScreen = 3;
            isAnimating = false;
            // Enable body scroll so closing section is reachable
            document.body.classList.remove('no-scroll');
            window.scrollTo(0, 0);
            animateIn(closing, 0.2);
          }
        }
      );
    }
  }

  /* ── Return from closing section to couple section ── */
  function closeClosing() {
    if (isAnimating) return;
    isAnimating = true;

    document.body.classList.add('no-scroll');
    window.scrollTo(0, 0);

    if (closing) {
      gsap.to(closing, {
        y: '100vh',
        duration: DURATION,
        ease: EASE,
        onComplete: () => {
          currentScreen = 2;
          isAnimating = false;
          closing.classList.remove('visible');
          gsap.set(closing, { y: '0px' });
        }
      });
    }
  }

  /* ── Slide hero away → reveal snap deck ── */
  const slideHeroUp = () => {
    if (!hasTransitioned || !isHeroActive || isAnimating) return;
    isAnimating = true;

    if (closing) closing.classList.remove('visible');

    gsap.killTweensOf(['#hero-section', deck]);

    gsap.timeline({
      onComplete: () => {
        isHeroActive = false;
        currentScreen = 0;
        isAnimating = false;
        document.body.classList.add('no-scroll');
        animateIn(snapSections[0], 0.15);
      }
    })
      .to('#hero-section', { yPercent: -100, duration: 1.1, ease: 'power3.inOut' }, 0)
      .to(deck, { y: '0px', duration: 1.0, ease: 'power3.out' }, 0.05);
  };

  /* ── Slide hero back down (swipe up on card section) ── */
  const slideHeroDown = () => {
    if (!hasTransitioned || isHeroActive || isAnimating || currentScreen !== 0) return;
    isAnimating = true;

    if (closing) closing.classList.remove('visible');

    gsap.killTweensOf(['#hero-section', deck]);

    gsap.timeline({
      onComplete: () => {
        isHeroActive = true;
        isAnimating = false;
        document.body.classList.remove('no-scroll');
      }
    })
      .to('#hero-section', { yPercent: 0, duration: 1.1, ease: 'power3.inOut' }, 0)
      .to(deck, { y: '100vh', duration: 1.0, ease: 'power3.inOut' }, 0);
  };

  /* ── Scroll direction handler ── */
  function handleDown() {
    if (isHeroActive) { slideHeroUp(); return; }
    if (currentScreen === 0) { goToSnap(1); return; }
    if (currentScreen === 1) { goToSnap(2); return; }
    if (currentScreen === 2) { openClosing(); return; }
  }

  function handleUp() {
    if (isHeroActive) return;
    const currentScrollY = window.scrollY || document.documentElement.scrollTop || 0;
    if (currentScreen === 3 && currentScrollY > 10) return; // mid-scroll in closing
    if (currentScreen === 3) { closeClosing(); return; }
    if (currentScreen === 2) { goToSnap(1); return; }
    if (currentScreen === 1) { goToSnap(0); return; }
    if (currentScreen === 0) { slideHeroDown(); return; }
  }

  /* ── Wheel events (desktop) ── */
  window.addEventListener('wheel', (e) => {
    if (!hasTransitioned || isAnimating) return;
    if (currentScreen === 3 && e.deltaY > 0) return; // let closing scroll naturally
    if (e.deltaY > 5) handleDown();
    if (e.deltaY < -5) handleUp();
  }, { passive: true });

  /* ── Touch / swipe events (mobile) ── */
  window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (!hasTransitioned || isAnimating) return;
    const delta = touchStartY - e.changedTouches[0].clientY;
    if (currentScreen === 3 && delta > 0) return; // let closing scroll naturally
    if (delta > 30) handleDown();
    if (delta < -30) handleUp();
  }, { passive: true });

  /* ── Init Handler ── */
  function initDeck() {
    initDeckSections();

    // Click on scroll cue to open deck
    const scrollCue = document.querySelector('.scroll-cue');
    if (scrollCue) {
      scrollCue.style.cursor = 'pointer';
      scrollCue.addEventListener('click', slideHeroUp);
    }
  }

  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    initDeck();
  } else {
    document.addEventListener('DOMContentLoaded', initDeck);
  }
})();








/* ==========================================
   COUNTDOWN TIMER
   ========================================== */
(function () {
  // Wedding: 11 October 2026, 11:00 AM IST (UTC+5:30)
  const WEDDING_DATE = new Date('2026-10-11T11:00:00+05:30');

  const elDays = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMinutes = document.getElementById('cd-minutes');
  const elSeconds = document.getElementById('cd-seconds');
  const grid = document.getElementById('countdown-grid');

  if (!elDays || !elHours || !elMinutes || !elSeconds) return;

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  // Animate digit change with a brief tick class
  function updateEl(el, value) {
    const newVal = pad(value);
    if (el.textContent !== newVal) {
      el.textContent = newVal;
      el.classList.remove('tick');
      // Force reflow so animation restarts
      void el.offsetWidth;
      el.classList.add('tick');
    }
  }

  function tick() {
    const now = new Date();
    const diff = WEDDING_DATE - now;

    if (diff <= 0) {
      // Replace grid with celebratory message
      if (grid) {
        grid.innerHTML = '<p class="countdown-done-msg">The Big Day Has Arrived! 🌹</p>';
      }
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    updateEl(elDays, days);
    updateEl(elHours, hours);
    updateEl(elMinutes, minutes);
    updateEl(elSeconds, seconds);
  }

  // Run immediately, then every second
  tick();
  setInterval(tick, 1000);
})();
