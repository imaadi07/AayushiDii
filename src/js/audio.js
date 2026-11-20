/**
 * Background Music & Web Audio Synthesizer
 * -------------------------------------------------------------
 * Provides ambient wedding chimes or custom audio playback with
 * fade-in/fade-out, tab visibility handling, and UI state sync.
 */

export function createMusicController(config) {
  const musicBtn = document.getElementById('music');
  const src = (config.music && config.music.audioSrc) || '';
  const defaultVol = (config.music && config.music.defaultVolume) || 0.55;

  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  let ctx = null;
  let master = null;
  let verb = null;
  let timer = null;
  let step = 0;
  let next = 0;
  let audio = null;
  let isPlaying = false;
  let hasStarted = false;

  const scale = [0, 2, 4, 7, 9];
  const phrase = [
    2, 4, 5, 7, 5, 4, 2, 4,
    0, 2, 4, 2, -1, 0, 2, 0,
    4, 5, 7, 9, 7, 5, 4, 2,
    5, 4, 2, 0, -1, 0, -3, 0
  ];
  const bass = [0, 0, -3, -1];

  function freq(deg, base) {
    const oct = Math.floor(deg / 5);
    const i = ((deg % 5) + 5) % 5;
    return 440 * Math.pow(2, ((base + oct * 12 + scale[i]) - 69) / 12);
  }

  function createImpulseBuffer() {
    if (!ctx) return null;
    const length = ctx.sampleRate * 2.6;
    const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const channel = buffer.getChannelData(c);
      for (let i = 0; i < length; i++) {
        channel[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.4);
      }
    }
    return buffer;
  }

  function pluck(time, frequency, velocity) {
    if (!ctx) return;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const subGain = ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.value = frequency;
    osc2.type = 'sine';
    osc2.frequency.value = frequency * 2;
    subGain.gain.value = 0.25;

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(velocity, time + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 2.1);

    osc1.connect(gain);
    osc2.connect(subGain);
    subGain.connect(gain);
    gain.connect(master);
    gain.connect(verb);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + 2.2);
    osc2.stop(time + 2.2);
  }

  function lowDrone(time, frequency) {
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = frequency;

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.16, time + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 3.4);

    osc.connect(gain);
    gain.connect(master);
    osc.start(time);
    osc.stop(time + 3.5);
  }

  function scheduleMelody() {
    if (!ctx) return;
    while (next < ctx.currentTime + 0.5) {
      const k = step % phrase.length;
      pluck(next, freq(phrase[k], 60), k % 4 === 0 ? 0.2 : 0.13);
      if (k % 8 === 0) {
        lowDrone(next, freq(bass[Math.floor((k / 8) % bass.length)], 36 + 12));
      }
      step++;
      next += 0.46;
    }
  }

  function startPadChord() {
    if (!ctx) return;
    [130.81, 196.0, 261.63].forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = f;
      osc.detune.value = idx * 4 - 4;
      gain.gain.value = 0.018;
      osc.connect(gain);
      gain.connect(master);
      osc.start();
    });
  }

  function setupWebAudio() {
    if (ctx) return;
    ctx = new AudioCtx();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    verb = ctx.createConvolver();
    verb.buffer = createImpulseBuffer();
    const wetGain = ctx.createGain();
    wetGain.gain.value = 0.5;
    verb.connect(wetGain);
    wetGain.connect(master);

    startPadChord();
    next = ctx.currentTime + 0.1;
  }

  function updateButtonUI(active) {
    if (!musicBtn) return;
    musicBtn.classList.toggle('on', active);
    musicBtn.setAttribute('aria-pressed', active ? 'true' : 'false');
    musicBtn.setAttribute('aria-label', active ? 'Turn music off' : 'Turn music on');
  }

  function play() {
    try {
      if (src) {
        if (!audio) {
          audio = new Audio(src);
          audio.loop = true;
          audio.volume = defaultVol;
        }
        audio.play().catch(() => {});
      } else if (AudioCtx) {
        if (!ctx) setupWebAudio();
        ctx.resume();
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.setTargetAtTime(defaultVol, ctx.currentTime, 0.8);
        if (!timer) {
          next = Math.max(next, ctx.currentTime + 0.1);
          timer = setInterval(scheduleMelody, 120);
        }
      } else {
        return;
      }
      isPlaying = true;
      hasStarted = true;
      updateButtonUI(true);
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  function pause() {
    try {
      if (audio) {
        audio.pause();
      }
      if (ctx) {
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.setTargetAtTime(0, ctx.currentTime, 0.25);
        setTimeout(() => {
          if (!isPlaying && ctx) {
            clearInterval(timer);
            timer = null;
            ctx.suspend();
          }
        }, 900);
      }
    } catch (e) {
      console.warn('Audio pause error:', e);
    }
    isPlaying = false;
    updateButtonUI(false);
  }

  function toggle() {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }

  // Handle browser tab switching
  document.addEventListener('visibilitychange', () => {
    if (!hasStarted) return;
    if (document.hidden) {
      if (audio) audio.pause();
      if (ctx) ctx.suspend();
    } else if (isPlaying) {
      if (audio) audio.play().catch(() => {});
      if (ctx) ctx.resume();
    }
  });

  const isSupported = Boolean(src || AudioCtx);
  if (musicBtn && isSupported) {
    musicBtn.hidden = false;
    musicBtn.addEventListener('click', toggle);
  }

  return {
    play,
    pause,
    toggle,
    isSupported
  };
}
