/**
 * Falling Rose Petals Particle Effect
 * -------------------------------------------------------------
 * Generates delicate floating blush petals that drift naturally
 * down the screen.
 */

export function initPetals() {
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const wrap = document.getElementById('petals');
  if (!wrap) return;

  const count = window.innerWidth < 600 ? 9 : 16;
  const colors = ['#F2A9B3', '#F6C3C6', '#F4B8BC', '#EFA3AB'];

  for (let i = 0; i < count; i++) {
    const petal = document.createElement('span');
    petal.className = 'petal';

    const scale = 0.7 + Math.random() * 0.9;
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.background = colors[i % colors.length];
    petal.style.width = `${12 * scale}px`;
    petal.style.height = `${16 * scale}px`;
    petal.style.animationDuration = `${11 + Math.random() * 10}s`;
    petal.style.animationDelay = `${-Math.random() * 20}s`;
    petal.style.setProperty('--dx', `${Math.random() * 120 - 60}px`);

    wrap.appendChild(petal);
  }
}
