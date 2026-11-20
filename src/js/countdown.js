/**
 * Countdown Timer Module
 * -------------------------------------------------------------
 * Computes the remaining time until the wedding ceremony in days,
 * hours, minutes, and seconds, updating the display every second.
 */

export function initCountdown(config) {
  const targetISO = config.wedding?.targetISO || '2026-12-04T22:30:00+05:30';
  const targetTime = new Date(targetISO).getTime();

  const daysEl = document.getElementById('cd-d');
  const hoursEl = document.getElementById('cd-h');
  const minsEl = document.getElementById('cd-m');
  const secsEl = document.getElementById('cd-s');
  const countdownBox = document.getElementById('countdown');
  const noteEl = document.getElementById('cd-note');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  function pad(num) {
    return num < 10 ? '0' + num : String(num);
  }

  function update() {
    const now = Date.now();
    const diff = targetTime - now;

    if (diff <= 0) {
      if (countdownBox) countdownBox.style.display = 'none';
      if (noteEl) {
        noteEl.style.display = 'block';
        const isToday = now - targetTime < 86400000;
        noteEl.textContent = isToday ? 'Today we celebrate!' : 'Married with your blessings';
      }
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    daysEl.textContent = pad(d);
    hoursEl.textContent = pad(h);
    minsEl.textContent = pad(m);
    secsEl.textContent = pad(s);
  }

  update();
  const timerId = setInterval(update, 1000);

  return () => clearInterval(timerId);
}
