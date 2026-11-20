/**
 * Main Application Orchestrator
 * -------------------------------------------------------------
 * Initializes all interactive features: Gate reveal, Audio synth,
 * Countdown timer, Scroll indicators, Intersection Observer, RSVP,
 * and Native Share / Clipboard copying.
 */

import { WEDDING_CONFIG } from './wedding-config.js';
import { createMusicController } from './audio.js';
import { initCountdown } from './countdown.js';
import { initPetals } from './petals.js';
import { initRSVP } from './rsvp.js';

(function () {
  const root = document.documentElement;
  root.classList.add('js', 'locked');

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Toast Notification Helper ----------
  const toastEl = document.getElementById('toast');
  let toastTimeout = null;

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2600);
  }

  // ---------- Initialize Subsystems ----------
  const music = createMusicController(WEDDING_CONFIG);
  initCountdown(WEDDING_CONFIG);
  initPetals();
  initRSVP(WEDDING_CONFIG);

  // ---------- Gate Opening Interaction ----------
  const gateEl = document.getElementById('gate');
  const gateOpenBtn = document.getElementById('gate-open');
  let gateOpened = false;

  function openGate() {
    if (gateOpened || !gateEl) return;
    gateOpened = true;
    gateEl.classList.add('opening');

    // Trigger music on opening user gesture
    music.play();

    root.classList.remove('locked');
    setTimeout(() => {
      root.classList.add('opened');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, reduceMotion ? 0 : 350);

    setTimeout(() => {
      gateEl.style.display = 'none';
    }, reduceMotion ? 50 : 1800);
  }

  if (gateOpenBtn) {
    gateOpenBtn.addEventListener('click', openGate);
  }

  // ---------- Scroll Progress & Sticky Nav ----------
  const navEl = document.getElementById('nav');
  const progressEl = document.getElementById('progress');
  let isTicking = false;

  function onScroll() {
    const scrollY = window.scrollY || root.scrollTop;
    const maxScroll = root.scrollHeight - window.innerHeight;

    if (progressEl) {
      const progressRatio = maxScroll > 0 ? Math.min(1, scrollY / maxScroll) : 0;
      progressEl.style.transform = `scaleX(${progressRatio})`;
    }

    if (navEl) {
      navEl.classList.toggle('scrolled', scrollY > 30);
    }
    isTicking = false;
  }

  window.addEventListener(
    'scroll',
    () => {
      if (!isTicking) {
        isTicking = true;
        requestAnimationFrame(onScroll);
      }
    },
    { passive: true }
  );

  onScroll();

  // ---------- Scroll Reveal Animations ----------
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  // ---------- Copy Phone Number ----------
  const phoneTextEl = document.getElementById('phone');
  const copyPhoneBtn = document.getElementById('copy-phone');

  function copyTextToClipboard(text, successMessage) {
    function fallback() {
      try {
        if (phoneTextEl) {
          const range = document.createRange();
          range.selectNodeContents(phoneTextEl);
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
        }
      } catch (err) {}
      showToast('Select and copy: ' + text);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMessage);
      }, fallback);
    } else {
      fallback();
    }
  }

  if (copyPhoneBtn) {
    copyPhoneBtn.addEventListener('click', () => {
      const phoneNumber = WEDDING_CONFIG.contact?.phoneDisplay || '+91 6299201514';
      copyTextToClipboard(phoneNumber, 'Phone number copied to clipboard');
    });
  }

  // ---------- Native Web Share API ----------
  const shareBtn = document.getElementById('share');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const cleanUrl = window.location.href.split('#')[0];
      const shareData = {
        title: WEDDING_CONFIG.share?.title || 'Aayushi Weds Abhishek',
        text: WEDDING_CONFIG.share?.text || 'You are invited to Aayushi & Abhishek’s wedding on 4 December 2026.',
        url: cleanUrl
      };

      if (navigator.share) {
        navigator.share(shareData).catch(() => {});
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(cleanUrl).then(
          () => showToast('Invitation link copied!'),
          () => showToast('Copy the link from your browser address bar')
        );
      } else {
        showToast('Copy the link from your browser address bar');
      }
    });
  }

  // ---------- Hydrate Elements with Central Config (if modified) ----------
  function hydrateFromConfig() {
    // Top Nav Monogram
    const monoEl = document.querySelector('.mono');
    if (monoEl && WEDDING_CONFIG.couple?.monogram) {
      monoEl.textContent = WEDDING_CONFIG.couple.monogram;
    }

    // Phone Display in Footer
    if (phoneTextEl && WEDDING_CONFIG.contact?.phoneDisplay) {
      phoneTextEl.textContent = WEDDING_CONFIG.contact.phoneDisplay;
    }

    // Hashtag in Footer
    const tagEl = document.querySelector('.tag');
    if (tagEl && WEDDING_CONFIG.couple?.hashtag) {
      tagEl.textContent = WEDDING_CONFIG.couple.hashtag;
    }

    // Coordinator Question Eyebrow
    const coordEyebrow = document.querySelector('.contact .eyebrow');
    if (coordEyebrow && WEDDING_CONFIG.contact?.coordinatorName) {
      coordEyebrow.textContent = `Questions? Call ${WEDDING_CONFIG.contact.coordinatorName}`;
    }
  }

  hydrateFromConfig();
})();
