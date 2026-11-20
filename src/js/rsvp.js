/**
 * RSVP Handler & WhatsApp Deep Link Generator
 * -------------------------------------------------------------
 * Validates guest name, manages guest count stepper, and formats
 * a pre-composed WhatsApp message addressed to the coordinator.
 */

export function initRSVP(config) {
  let guestCount = 2;
  const gOut = document.getElementById('guests-out');
  const gMinus = document.getElementById('g-minus');
  const gPlus = document.getElementById('g-plus');
  const nameEl = document.getElementById('rsvp-name');
  const errEl = document.getElementById('rsvp-err');
  const sendBtn = document.getElementById('rsvp-send');
  const formEl = document.getElementById('rsvp-form');
  const yesRadio = document.getElementById('rsvp-yes');
  const noRadio = document.getElementById('rsvp-no');
  const guestsField = document.getElementById('guests-field');

  if (!sendBtn || !nameEl) return;

  const waNumber = config.contact?.whatsappNumber || '916299201514';
  const bride = config.couple?.bride || 'Aayushi';
  const groom = config.couple?.groom || 'Abhishek';
  const weddingDateStr = '4 December 2026';

  function isAttending() {
    return yesRadio ? yesRadio.checked : true;
  }

  function updateWhatsAppLink() {
    const guestName = nameEl.value.trim() || 'a guest';
    let message = '';

    if (isAttending()) {
      message = `Hello! This is ${guestName}. I will be joining the celebrations for ${bride} & ${groom}’s wedding on ${weddingDateStr}. Number of guests: ${guestCount}.`;
    } else {
      message = `Hello! This is ${guestName}. I am sorry, I will not be able to make it to ${bride} & ${groom}’s wedding on ${weddingDateStr}. Sending my warmest wishes and blessings!`;
    }

    sendBtn.href = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
  }

  function syncState() {
    if (gOut) gOut.textContent = String(guestCount);
    const attending = isAttending();

    if (gMinus) gMinus.disabled = guestCount <= 1 || !attending;
    if (gPlus) gPlus.disabled = guestCount >= 10 || !attending;
    if (guestsField) guestsField.style.opacity = attending ? '1' : '0.45';

    updateWhatsAppLink();
  }

  if (gMinus) {
    gMinus.addEventListener('click', () => {
      if (guestCount > 1) {
        guestCount--;
        syncState();
      }
    });
  }

  if (gPlus) {
    gPlus.addEventListener('click', () => {
      if (guestCount < 10) {
        guestCount++;
        syncState();
      }
    });
  }

  if (yesRadio) yesRadio.addEventListener('change', syncState);
  if (noRadio) noRadio.addEventListener('change', syncState);

  nameEl.addEventListener('input', () => {
    if (errEl) errEl.textContent = '';
    updateWhatsAppLink();
  });

  sendBtn.addEventListener('click', (e) => {
    if (!nameEl.value.trim()) {
      e.preventDefault();
      if (errEl) errEl.textContent = 'Please add your name so we know who is replying.';
      nameEl.focus();
    }
  });

  if (formEl) {
    formEl.addEventListener('submit', (e) => e.preventDefault());
  }

  syncState();
}
