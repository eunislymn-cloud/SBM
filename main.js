// Inject Burst/Ratchet CSS
(function() {
  const burstCSS = document.createElement('style');
  burstCSS.textContent = `
    /* Burst step colors */
    .step.active.burst-2 {
      background: linear-gradient(135deg, #14F195, #0BC076) !important;
      border-color: #14F195 !important;
      box-shadow: 0 0 6px rgba(20, 241, 149, 0.4);
    }
    .step.active.burst-3 {
      background: linear-gradient(135deg, #FFD700, #FFA500) !important;
      border-color: #FFD700 !important;
      box-shadow: 0 0 6px rgba(255, 215, 0, 0.4);
    }
    .step.active.burst-4 {
      background: linear-gradient(135deg, #FF4444, #CC2222) !important;
      border-color: #FF4444 !important;
      box-shadow: 0 0 6px rgba(255, 68, 68, 0.4);
    }
    .step.active.burst-6 {
      background: linear-gradient(135deg, #FF44FF, #CC22CC) !important;
      border-color: #FF44FF !important;
      box-shadow: 0 0 6px rgba(255, 68, 255, 0.4);
    }
    .step.active.burst-8 {
      background: linear-gradient(135deg, #44FFFF, #22CCCC) !important;
      border-color: #44FFFF !important;
      box-shadow: 0 0 6px rgba(68, 255, 255, 0.4);
    }
    
    /* Burst badge (number on step) */
    .burst-badge {
      position: absolute;
      top: 1px;
      right: 1px;
      font-size: 7px;
      font-weight: 800;
      font-family: 'Orbitron', system-ui, sans-serif;
      line-height: 1;
      pointer-events: none;
      color: rgba(0,0,0,0.7);
    }
    .step.active.burst-4 .burst-badge,
    .step.active.burst-6 .burst-badge {
      color: rgba(255,255,255,0.8);
    }
    .step.active.burst-8 .burst-badge {
      color: rgba(0,0,0,0.7);
    }
    
    /* Burst popup menu */
    .burst-menu {
      position: absolute;
      bottom: calc(100% + 8px);
      left: 50%;
      transform: translateX(-50%) scale(0.8);
      background: #1a1a2e;
      border: 1px solid #444;
      border-radius: 8px;
      padding: 4px;
      z-index: 1000;
      display: flex;
      flex-direction: row;
      gap: 3px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.6);
      opacity: 0;
      transition: opacity 0.12s, transform 0.12s;
      pointer-events: none;
    }
    .burst-menu.show {
      opacity: 1;
      transform: translateX(-50%) scale(1);
      pointer-events: auto;
    }
    .burst-menu-arrow {
      position: absolute;
      bottom: -5px;
      left: 50%;
      transform: translateX(-50%) rotate(45deg);
      width: 8px;
      height: 8px;
      background: #1a1a2e;
      border-right: 1px solid #444;
      border-bottom: 1px solid #444;
    }
    .burst-option {
      width: 28px;
      height: 28px;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Orbitron', system-ui, sans-serif;
      font-size: 8px;
      font-weight: 800;
      cursor: pointer;
      border: 1.5px solid transparent;
      transition: transform 0.1s;
    }
    .burst-option:hover, .burst-option:active {
      transform: scale(1.15);
    }
    .burst-option.selected {
      outline: 2px solid #fff;
      outline-offset: 1px;
    }
    .burst-opt-1 { background: #9945FF33; color: #9945FF; border-color: #9945FF; }
    .burst-opt-2 { background: #14F19533; color: #14F195; border-color: #14F195; }
    .burst-opt-3 { background: #FFD70033; color: #FFD700; border-color: #FFD700; }
    .burst-opt-4 { background: #FF444433; color: #FF4444; border-color: #FF4444; }
    .burst-opt-6 { background: #FF44FF33; color: #FF44FF; border-color: #FF44FF; }
    .burst-opt-8 { background: #44FFFF33; color: #44FFFF; border-color: #44FFFF; }
    
    /* Ensure steps have position for burst menu anchoring */
    .step { position: relative; }
    
    /* Mobile burst button animation */
    @keyframes burstBtnPop {
      0% { transform: scale(0); opacity: 0; }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); opacity: 1; }
    }
    
    /* Loading Animation */
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #0a0a0a, #1a1a2e);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      animation: fadeOut 0.5s ease-out 3s forwards;
    }
    
    @keyframes fadeOut {
      to { opacity: 0; pointer-events: none; }
    }
    
    .loading-pyramid {
      position: relative;
      margin-bottom: 30px;
    }
    
    .loading-pyramid svg {
      width: 120px;
      height: 80px;
      animation: pyramidGlow 2s ease-in-out infinite alternate;
    }
    
    @keyframes pyramidGlow {
      0% { filter: drop-shadow(0 0 10px rgba(153, 69, 255, 0.3)); }
      100% { filter: drop-shadow(0 0 20px rgba(153, 69, 255, 0.6)); }
    }
    
    .step-cursor {
      position: absolute;
      top: 50%;
      left: -10px;
      transform: translateY(-50%);
      width: 8px;
      height: 8px;
      background: linear-gradient(45deg, #FFD700, #FFA500);
      border-radius: 2px;
      box-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
      animation: cursorSweep 2s ease-in-out 0.5s;
    }
    
    @keyframes cursorSweep {
      0% { left: -10px; opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { left: 130px; opacity: 0; }
    }
    
    .loading-text {
      font-family: 'Orbitron', sans-serif;
      font-size: 18px;
      font-weight: 700;
      color: #fff;
      text-shadow: 0 0 20px rgba(20, 241, 149, 0.5);
      opacity: 0;
      animation: textAppear 0.8s ease-out 1.5s forwards;
    }
    
    @keyframes textAppear {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(burstCSS);
})();

// Remove loading animation after it completes
setTimeout(() => {
  const loadingAnimation = document.getElementById('loadingAnimation');
  if (loadingAnimation) {
    loadingAnimation.remove();
  }
}, 3500); // Remove after 3.5 seconds (animation completes at 3s)

// Audio Context
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const masterGain = audioCtx.createGain();
const reverbNode = audioCtx.createConvolver();
const reverbWet = audioCtx.createGain();
const reverbDry = audioCtx.createGain();
const delayNode = audioCtx.createDelay(2.0);
const delayFeedback = audioCtx.createGain();
const delayWet = audioCtx.createGain();
const filterNode = audioCtx.createBiquadFilter();
const gainBoost = audioCtx.createGain();
const highShelf = audioCtx.createBiquadFilter();

// Setup Effects
filterNode.type = 'lowpass';
filterNode.frequency.value = 20000;
delayNode.delayTime.value = 0.25;
delayFeedback.gain.value = 0.3;
delayWet.gain.value = 0;

// Initial gain boost (1 = unity)
gainBoost.gain.value = 1;

// High shelf for boosting highs with gain
highShelf.type = 'highshelf';
highShelf.frequency.value = 3000;
highShelf.gain.value = 0;

// Create reverb impulse response - improved room sound
function createReverb() {
  const rate = audioCtx.sampleRate;
  const length = rate * 1.5; // 1.5 second reverb tail
  const impulse = audioCtx.createBuffer(2, length, rate);
  
  // Create a more natural sounding reverb
  const decay = 2.5; // Decay factor
  
  for (let channel = 0; channel < 2; channel++) {
    const channelData = impulse.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      const t = i / rate;
      // Exponential decay with some early reflections
      const envelope = Math.exp(-decay * t);
      // Add some randomness but smoother
      const noise = (Math.random() * 2 - 1);
      // Apply a subtle filter effect by averaging nearby samples
      channelData[i] = noise * envelope * 0.5;
    }
    
    // Add early reflections for more realistic room sound
    const reflections = [0.01, 0.02, 0.03, 0.05, 0.08];
    const reflectionGains = [0.6, 0.4, 0.3, 0.2, 0.15];
    
    for (let r = 0; r < reflections.length; r++) {
      const delaySamples = Math.floor(reflections[r] * rate);
      if (delaySamples < length) {
        channelData[delaySamples] += reflectionGains[r] * (channel === 0 ? 1 : -1);
      }
    }
  }
  
  reverbNode.buffer = impulse;
}
createReverb();

// Set initial reverb mix (0% wet)
reverbDry.gain.value = 1.0;
reverbWet.gain.value = 0;

// Effects Routing with Gain and Reverb
masterGain.connect(gainBoost);
gainBoost.connect(highShelf);

highShelf.connect(reverbDry);
highShelf.connect(reverbNode);
reverbNode.connect(reverbWet);

reverbDry.connect(filterNode);
reverbWet.connect(filterNode);

filterNode.connect(delayNode);
delayNode.connect(delayFeedback);
delayFeedback.connect(delayNode);
delayNode.connect(delayWet);

filterNode.connect(delayWet);
delayWet.connect(audioCtx.destination);
filterNode.connect(audioCtx.destination);

const trackConfig = [
  { name: 'kick', label: 'Kick' },
  { name: 'snare', label: 'Snare' },
  { name: 'hat', label: 'Hi-Hat' },
  { name: 'openhat', label: 'Open Hat' },
  { name: 'clap', label: 'Clap' },
  { name: 'rim', label: 'Rim' },
  { name: 'tom', label: 'Tom' }
];

let steps = 16;
let currentStep = 0;
let isPlaying = false;
let schedulerTimer = null;
let bpm = 120;
let swing = 0;
let currentPattern = 'A';
let sequencerEnabled = false;
let patternSequence = ['A', '', '', '', '', '', '', ''];
let currentSequenceIndex = 0;
const patterns = { A: {}, B: {}, C: {} };
const trackVolumes = {};
const trackMuted = {};
const trackSoloed = {};

// Per-pattern sound settings
const patternSounds = {
  A: { kick: 'kick1', snare: 'snare1', hat: 'hat1', clap: 'clap1', openhat: 'openhat1', rim: 'rim1', tom: 'tom1' },
  B: { kick: 'kick1', snare: 'snare1', hat: 'hat1', clap: 'clap1', openhat: 'openhat1', rim: 'rim1', tom: 'tom1' },
  C: { kick: 'kick1', snare: 'snare1', hat: 'hat1', clap: 'clap1', openhat: 'openhat1', rim: 'rim1', tom: 'tom1' }
};

const patternPitch = {
  A: { kick: 0, snare: 0, hat: 0, clap: 0, openhat: 0, rim: 0, tom: 0 },
  B: { kick: 0, snare: 0, hat: 0, clap: 0, openhat: 0, rim: 0, tom: 0 },
  C: { kick: 0, snare: 0, hat: 0, clap: 0, openhat: 0, rim: 0, tom: 0 }
};

const patternPitchRatio = {
  A: { kick: 1, snare: 1, hat: 1, clap: 1, openhat: 1, rim: 1, tom: 1 },
  B: { kick: 1, snare: 1, hat: 1, clap: 1, openhat: 1, rim: 1, tom: 1 },
  C: { kick: 1, snare: 1, hat: 1, clap: 1, openhat: 1, rim: 1, tom: 1 }
};

const patternDecay = {
  A: { kick: 100, snare: 100, hat: 100, clap: 100, openhat: 100, rim: 100, tom: 100 },
  B: { kick: 100, snare: 100, hat: 100, clap: 100, openhat: 100, rim: 100, tom: 100 },
  C: { kick: 100, snare: 100, hat: 100, clap: 100, openhat: 100, rim: 100, tom: 100 }
};

// Per-pattern effects
const patternEffects = {
  A: { reverb: 0, delayMix: 0, delayTime: 250, filter: 20000, gain: 0 },
  B: { reverb: 0, delayMix: 0, delayTime: 250, filter: 20000, gain: 0 },
  C: { reverb: 0, delayMix: 0, delayTime: 250, filter: 20000, gain: 0 }
};

// Per-pattern burst/ratchet data (1 = normal, 2/3/4/6/8 = subdivisions)
const patternBurst = { A: {}, B: {}, C: {} };
const BURST_OPTIONS = [1, 2, 3, 4, 6, 8];
const BURST_COLORS = {
  1: '',           // normal purple (default)
  2: 'burst-2',    // green
  3: 'burst-3',    // gold
  4: 'burst-4',    // red
  6: 'burst-6',    // pink
  8: 'burst-8'     // cyan
};

// Legacy references for backwards compatibility
const trackSounds = patternSounds.A;
const trackPitch = patternPitch.A;
const trackDecay = patternDecay.A;
const trackPitchRatio = patternPitchRatio.A;

// Sample Packs System
let activeSamplePack = null;
const samplePacks = {
  '808kit': {
    name: '808 Kit',
    description: 'Classic 808 drum sounds',
    icon: '🔥',
    samples: {
      kick: 'samples/808kit/kick.wav',
      snare: 'samples/808kit/snare.wav',
      hat: 'samples/808kit/hat.wav',
      clap: 'samples/808kit/clap.wav',
      openhat: 'samples/808kit/openhat.wav',
      rim: 'samples/808kit/rim.wav',
      tom: 'samples/808kit/tom.wav'
    }
  },
  'trap': {
    name: 'Trap Pack',
    description: 'Modern trap essentials',
    icon: '🌊',
    samples: {
      kick: 'samples/trap/kick.wav',
      snare: 'samples/trap/snare.wav',
      hat: 'samples/trap/hat.wav',
      clap: 'samples/trap/clap.wav',
      openhat: 'samples/trap/openhat.wav',
      rim: 'samples/trap/rim.wav',
      tom: 'samples/trap/tom.wav'
    }
  },
  'lofi': {
    name: 'Lo-Fi Beats',
    description: 'Chill lo-fi drums',
    icon: '✨',
    samples: {
      kick: 'samples/lofi/kick.wav',
      snare: 'samples/lofi/snare.wav',
      hat: 'samples/lofi/hat.wav',
      clap: 'samples/lofi/clap.wav',
      openhat: 'samples/lofi/openhat.wav',
      rim: 'samples/lofi/rim.wav',
      tom: 'samples/lofi/tom.wav'
    }
  },
  'edm': {
    name: 'EDM Kit',
    description: 'High-energy electronic',
    icon: '⚡',
    samples: {
      kick: 'samples/edm/kick.wav',
      snare: 'samples/edm/snare.wav',
      hat: 'samples/edm/hat.wav',
      clap: 'samples/edm/clap.wav',
      openhat: 'samples/edm/openhat.wav',
      rim: 'samples/edm/rim.wav',
      tom: 'samples/edm/tom.wav'
    }
  }
};

trackConfig.forEach(t => {
  patterns.A[t.name] = Array(steps).fill(false);
  patterns.B[t.name] = Array(steps).fill(false);
  patterns.C[t.name] = Array(steps).fill(false);
  patternBurst.A[t.name] = Array(steps).fill(1);
  patternBurst.B[t.name] = Array(steps).fill(1);
  patternBurst.C[t.name] = Array(steps).fill(1);
  trackVolumes[t.name] = 0.8;
});

const sequencer = document.querySelector('.sequencer');

// Sound labels for each track
const soundLabels = {
  kick: ['Kick 1', 'Kick 2'],
  snare: ['Snare 1', 'Snare 2'],
  hat: ['HH1', 'HH2'],
  openhat: ['OH1', 'OH2'],
  clap: ['Clap 1', 'Clap 2'],
  rim: ['Rim 1', 'Rim 2'],
  tom: ['Tom 1', 'Tom 2']
};

trackConfig.forEach(track => {
  const container = document.createElement('div');
  container.className = 'track-container';
  container.dataset.track = track.name;
  
  // Initialize pitch and decay for this track
  trackPitch[track.name] = 0; // -12 to +12 semitones
  trackPitchRatio[track.name] = 1; // Pre-calculated ratio
  trackDecay[track.name] = 100; // 10% to 200%
  
  const labels = soundLabels[track.name] || ['Sound 1', 'Sound 2'];
  
  const header = document.createElement('div');
  header.className = 'track-header';
  header.innerHTML = `
    <div class="track-label-wrapper">
      <div class="track-label-row">
        <div class="track-label">${track.label} <span class="dropdown-arrow">▼</span></div>
        <div class="track-ms-buttons">
          <button class="ms-btn mute-btn" data-track="${track.name}" title="Mute">M</button>
          <button class="ms-btn solo-btn" data-track="${track.name}" title="Solo">S</button>
        </div>
      </div>
      <div class="sound-menu" style="display:none;">
        <div class="sound-option" data-sound="${track.name}1">${labels[0]}</div>
        <div class="sound-option" data-sound="${track.name}2">${labels[1]}</div>
        <div class="sound-menu-divider"></div>
        <div class="param-section">
          <div class="param-row">
            <label>Pitch</label>
            <input type="range" min="-12" max="12" value="0" class="pitch-control">
            <span class="pitch-value">0</span>
          </div>
          <div class="param-row">
            <label>Decay</label>
            <input type="range" min="10" max="200" value="100" class="decay-control">
            <span class="decay-value">100%</span>
          </div>
        </div>
      </div>
    </div>
    <div class="track-volume">
      <input type="range" min="0" max="100" value="80" class="volume-control">
      <span class="volume-value">80</span>
    </div>
  `;
  
  const grid = document.createElement('div');
  grid.className = 'track-grid';
  
  for (let i = 0; i < steps; i++) {
    const step = document.createElement('div');
    step.className = 'step';
    step.dataset.index = i;
    step.dataset.track = track.name;
    grid.appendChild(step);
  }
  
  container.appendChild(header);
  container.appendChild(grid);
  sequencer.appendChild(container);
  
  const volumeControl = header.querySelector('.volume-control');
  const volumeValue = header.querySelector('.volume-value');
  volumeControl.addEventListener('input', e => {
    trackVolumes[track.name] = e.target.value / 100;
    volumeValue.textContent = e.target.value;
  });
  
  // Click volume number to manually enter value
  volumeValue.addEventListener('click', e => {
    e.stopPropagation();
    const currentVal = Math.round(trackVolumes[track.name] * 100);
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '0';
    input.max = '100';
    input.value = currentVal;
    input.className = 'volume-input';
    
    volumeValue.style.display = 'none';
    volumeValue.parentNode.insertBefore(input, volumeValue.nextSibling);
    input.focus();
    input.select();
    
    const applyValue = () => {
      let val = parseInt(input.value) || 0;
      val = Math.max(0, Math.min(100, val));
      trackVolumes[track.name] = val / 100;
      volumeControl.value = val;
      volumeValue.textContent = val;
      volumeValue.style.display = '';
      input.remove();
    };
    
    input.addEventListener('blur', applyValue);
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') applyValue();
      if (e.key === 'Escape') {
        volumeValue.style.display = '';
        input.remove();
      }
    });
  });
  
  // Pitch control
  const pitchControl = header.querySelector('.pitch-control');
  const pitchValue = header.querySelector('.pitch-value');
  pitchControl.addEventListener('input', e => {
    const semitones = parseInt(e.target.value);
    patternPitch[currentPattern][track.name] = semitones;
    patternPitchRatio[currentPattern][track.name] = Math.pow(2, semitones / 12); // Pre-calculate
    pitchValue.textContent = semitones > 0 ? '+' + semitones : semitones;
  });
  
  // Decay control
  const decayControl = header.querySelector('.decay-control');
  const decayValue = header.querySelector('.decay-value');
  decayControl.addEventListener('input', e => {
    patternDecay[currentPattern][track.name] = parseInt(e.target.value);
    decayValue.textContent = e.target.value + '%';
  });
  
  // Stop propagation on param controls so menu doesn't close
  header.querySelectorAll('.param-row input').forEach(input => {
    input.addEventListener('click', e => e.stopPropagation());
  });
  
  const labelWrapper = header.querySelector('.track-label-wrapper');
  const trackLabel = header.querySelector('.track-label');
  const soundMenu = header.querySelector('.sound-menu');
  
  trackLabel.addEventListener('click', (e) => {
    e.stopPropagation();
    document.querySelectorAll('.sound-menu').forEach(menu => {
      if (menu !== soundMenu) menu.style.display = 'none';
    });
    soundMenu.style.display = soundMenu.style.display === 'none' ? 'block' : 'none';
  });
  
  soundMenu.querySelectorAll('.sound-option').forEach(option => {
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      patternSounds[currentPattern][track.name] = option.dataset.sound;
      soundMenu.style.display = 'none';
      soundMenu.querySelectorAll('.sound-option').forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
    });
  });
  
  soundMenu.querySelector(`[data-sound="${track.name}1"]`).classList.add('selected');
  
  // Mute/Solo buttons
  trackMuted[track.name] = false;
  trackSoloed[track.name] = false;
  
  const muteBtn = header.querySelector('.mute-btn');
  const soloBtn = header.querySelector('.solo-btn');
  
  muteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    trackMuted[track.name] = !trackMuted[track.name];
    muteBtn.classList.toggle('active', trackMuted[track.name]);
    container.classList.toggle('track-muted', trackMuted[track.name]);
  });
  
  soloBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    trackSoloed[track.name] = !trackSoloed[track.name];
    soloBtn.classList.toggle('active', trackSoloed[track.name]);
    
    // Update visual mute state on all tracks
    const anySoloed = Object.values(trackSoloed).some(s => s);
    trackConfig.forEach(t => {
      const cont = document.querySelector(`[data-track="${t.name}"]`);
      if (anySoloed) {
        cont.classList.toggle('track-muted', !trackSoloed[t.name] && !false);
      } else {
        cont.classList.toggle('track-muted', trackMuted[t.name]);
      }
    });
  });
});

document.addEventListener('click', () => {
  document.querySelectorAll('.sound-menu').forEach(menu => {
    menu.style.display = 'none';
  });
});

// Drag-to-fill functionality for step sequencer
let isDragging = false;
let dragFillState = null; // true = filling, false = clearing
let dragTrack = null;

// Burst menu system
let activeBurstMenu = null;
let longPressTimer = null;
const LONG_PRESS_MS = 200;

function createBurstMenu() {
  const menu = document.createElement('div');
  menu.className = 'burst-menu';
  menu.innerHTML = BURST_OPTIONS.map(val => 
    `<div class="burst-option burst-opt-${val}" data-burst="${val}">${val}x</div>`
  ).join('') + '<div class="burst-menu-arrow"></div>';
  return menu;
}

function showBurstMenu(stepEl) {
  closeBurstMenu();
  const track = stepEl.dataset.track;
  const index = parseInt(stepEl.dataset.index);
  
  // Only show on active steps
  if (!patterns[currentPattern][track][index]) return;
  
  const menu = createBurstMenu();
  const currentBurst = patternBurst[currentPattern][track][index] || 1;
  
  // Highlight current selection
  const currentOpt = menu.querySelector(`[data-burst="${currentBurst}"]`);
  if (currentOpt) currentOpt.classList.add('selected');
  
  menu.addEventListener('click', (e) => {
    e.stopPropagation();
    const opt = e.target.closest('.burst-option');
    if (!opt) return;
    const val = parseInt(opt.dataset.burst);
    patternBurst[currentPattern][track][index] = val;
    applyBurstVisual(stepEl, val);
    closeBurstMenu();
    // Exit burst mode after selection
    if (burstModeActive) {
      burstModeActive = false;
      updateBurstModeButton();
    }
  });
  
  // Prevent menu clicks from toggling steps
  menu.addEventListener('mousedown', e => e.stopPropagation());
  menu.addEventListener('touchstart', e => e.stopPropagation());
  
  stepEl.style.position = 'relative';
  stepEl.appendChild(menu);
  
  // Animate in
  requestAnimationFrame(() => menu.classList.add('show'));
  activeBurstMenu = { menu, stepEl };
}

function closeBurstMenu() {
  if (activeBurstMenu) {
    activeBurstMenu.menu.remove();
    activeBurstMenu = null;
  }
}

function applyBurstVisual(stepEl, burstVal) {
  // Remove all burst classes
  stepEl.classList.remove('burst-2', 'burst-3', 'burst-4', 'burst-6', 'burst-8');
  // Remove old badge
  const oldBadge = stepEl.querySelector('.burst-badge');
  if (oldBadge) oldBadge.remove();
  
  if (burstVal > 1) {
    stepEl.classList.add(BURST_COLORS[burstVal]);
    const badge = document.createElement('span');
    badge.className = 'burst-badge';
    badge.textContent = burstVal + 'x';
    stepEl.appendChild(badge);
  }
}

// Right-click to open burst menu (desktop)
document.addEventListener('contextmenu', (e) => {
  const step = e.target.closest('.step');
  if (step) {
    e.preventDefault();
    showBurstMenu(step);
  }
});

// Close burst menu on outside click
document.addEventListener('click', (e) => {
  if (activeBurstMenu && !e.target.closest('.burst-menu') && !e.target.closest('.burst-option')) {
    closeBurstMenu();
  }
});

document.addEventListener('mousedown', (e) => {
  // Ignore right-clicks for drag
  if (e.button === 2) return;
  
  const step = e.target.closest('.step');
  if (step && !e.target.closest('.burst-menu')) {
    e.preventDefault();
    closeBurstMenu();
    isDragging = true;
    dragTrack = step.dataset.track;
    const index = parseInt(step.dataset.index);
    
    // Toggle the clicked step and remember the new state for drag-fill
    patterns[currentPattern][dragTrack][index] = !patterns[currentPattern][dragTrack][index];
    dragFillState = patterns[currentPattern][dragTrack][index];
    step.classList.toggle('active', dragFillState);
    
    // Reset burst when turning step off
    if (!dragFillState) {
      patternBurst[currentPattern][dragTrack][index] = 1;
      applyBurstVisual(step, 1);
    } else {
      // Apply existing burst visual when activating
      applyBurstVisual(step, patternBurst[currentPattern][dragTrack][index] || 1);
    }
  }
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging || dragTrack === null) return;
  
  const step = e.target.closest('.step');
  if (step && step.dataset.track === dragTrack) {
    const index = parseInt(step.dataset.index);
    patterns[currentPattern][dragTrack][index] = dragFillState;
    step.classList.toggle('active', dragFillState);
    if (!dragFillState) {
      patternBurst[currentPattern][dragTrack][index] = 1;
      applyBurstVisual(step, 1);
    }
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  dragFillState = null;
  dragTrack = null;
});

// Global burst mode system
let burstModeActive = false;
let burstModeButton = null;

function initBurstMode() {
  // Find the Steps control group and add burst button after it
  const stepsSelect = document.getElementById('patternLength');
  if (!stepsSelect) return;
  
  const stepsControlGroup = stepsSelect.closest('.control-group');
  if (!stepsControlGroup) return;
  
  // Create burst control group
  const burstControlGroup = document.createElement('div');
  burstControlGroup.className = 'control-group';
  burstControlGroup.style.marginLeft = '15px'; // Add extra spacing
  burstControlGroup.innerHTML = `
    <label>Burst 
      <button id="burstModeBtn" style="
        padding: 4px 8px;
        background: #333;
        border: 1px solid #666;
        border-radius: 4px;
        color: #fff;
        cursor: pointer;
        font-size: 11px;
        font-weight: bold;
        transition: all 0.2s;
        margin-left: 5px;
      ">⚡ OFF</button>
    </label>
  `;
  
  // Insert after steps control group
  stepsControlGroup.parentNode.insertBefore(burstControlGroup, stepsControlGroup.nextSibling);
  
  burstModeButton = document.getElementById('burstModeBtn');
  burstModeButton.addEventListener('click', toggleBurstMode);
}

function toggleBurstMode() {
  burstModeActive = !burstModeActive;
  updateBurstModeButton();
  closeBurstMenu();
}

function updateBurstModeButton() {
  if (burstModeButton) {
    if (burstModeActive) {
      burstModeButton.style.background = 'linear-gradient(135deg, #9945FF, #7B3FCC)';
      burstModeButton.style.borderColor = '#9945FF';
      burstModeButton.style.boxShadow = '0 0 8px rgba(153, 69, 255, 0.4)';
      burstModeButton.textContent = '⚡ ON';
    } else {
      burstModeButton.style.background = '#333';
      burstModeButton.style.borderColor = '#666';
      burstModeButton.style.boxShadow = 'none';
      burstModeButton.textContent = '⚡ OFF';
    }
  }
}

// Initialize burst mode button when page loads
document.addEventListener('DOMContentLoaded', initBurstMode);
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBurstMode);
} else {
  initBurstMode();
}

// Touch support for mobile with global burst mode
document.addEventListener('touchstart', (e) => {
  const step = e.target.closest('.step');
  if (!step || e.target.closest('.burst-menu')) return;
  
  e.preventDefault();
  
  const track = step.dataset.track;
  const index = parseInt(step.dataset.index);
  
  // If burst mode is active and step is active, show burst menu
  if (burstModeActive && patterns[currentPattern][track][index]) {
    closeBurstMenu();
    showBurstMenu(step);
    return; // Don't do normal toggle
  }
  
  closeBurstMenu();
  
  // Normal tap toggle
  isDragging = true;
  dragTrack = track;
  patterns[currentPattern][dragTrack][index] = !patterns[currentPattern][dragTrack][index];
  dragFillState = patterns[currentPattern][dragTrack][index];
  step.classList.toggle('active', dragFillState);
  
  if (!dragFillState) {
    patternBurst[currentPattern][dragTrack][index] = 1;
    applyBurstVisual(step, 1);
  } else {
    applyBurstVisual(step, patternBurst[currentPattern][dragTrack][index] || 1);
  }
}, { passive: false });

document.addEventListener('touchmove', (e) => {
  if (!isDragging || dragTrack === null) return;
  
  const touch = e.touches[0];
  const element = document.elementFromPoint(touch.clientX, touch.clientY);
  const step = element?.closest('.step');
  
  if (step && step.dataset.track === dragTrack) {
    const index = parseInt(step.dataset.index);
    patterns[currentPattern][dragTrack][index] = dragFillState;
    step.classList.toggle('active', dragFillState);
    if (!dragFillState) {
      patternBurst[currentPattern][dragTrack][index] = 1;
      applyBurstVisual(step, 1);
    }
  }
}, { passive: false });

document.addEventListener('touchend', () => {
  isDragging = false;
  dragFillState = null;
  dragTrack = null;
});

document.getElementById('seqToggle').onclick = () => {
  sequencerEnabled = !sequencerEnabled;
  const btn = document.getElementById('seqToggle');
  btn.textContent = sequencerEnabled ? 'Chain: ON' : 'Chain: OFF';
  btn.classList.toggle('active', sequencerEnabled);
};

document.querySelectorAll('.pattern-select').forEach((select, index) => {
  select.addEventListener('change', (e) => {
    patternSequence[index] = e.target.value;
  });
});

function getActiveSequence() {
  return patternSequence.filter(p => p !== '');
}

function updateSequenceUI() {
  const activeSeq = getActiveSequence();
  if (!sequencerEnabled || activeSeq.length === 0) {
    document.querySelectorAll('.seq-slot').forEach(slot => slot.classList.remove('active'));
    return;
  }
  
  let nonEmptyCount = 0;
  let targetSlotIndex = -1;
  
  for (let i = 0; i < patternSequence.length; i++) {
    if (patternSequence[i] !== '') {
      if (nonEmptyCount === currentSequenceIndex) {
        targetSlotIndex = i;
        break;
      }
      nonEmptyCount++;
    }
  }
  
  document.querySelectorAll('.seq-slot').forEach((slot, index) => {
    slot.classList.toggle('active', index === targetSlotIndex);
  });
}

// Per-track output gain nodes for voice stealing (cut previous note when new one fires)

function playSound(trackName, patternOverride = null, scheduledTime = null) {
  const pattern = patternOverride || currentPattern;
  const volume = trackVolumes[trackName];
  const time = scheduledTime || audioCtx.currentTime;
  const soundVariant = patternSounds[pattern][trackName];
  
  // Use pre-calculated values for performance
  const pitchRatio = patternPitchRatio[pattern][trackName] || 1;
  const decayMod = (patternDecay[pattern][trackName] || 100) / 100;
  
  switch(soundVariant) {
    case 'kick1': {
      // 909 style kick - buffer-based for perfectly consistent playback
      const sampleRate = audioCtx.sampleRate;
      const duration = 0.15 * decayMod;
      const bufferLen = Math.floor(sampleRate * duration);
      const buffer = audioCtx.createBuffer(1, bufferLen, sampleRate);
      const data = buffer.getChannelData(0);
      
      let phase = 0;
      for (let i = 0; i < bufferLen; i++) {
        const t = i / sampleRate;
        
        // Frequency sweep: 180 -> 50 (fast) -> 40 (slow)
        let freq;
        if (t < 0.05 * decayMod) {
          freq = 180 * pitchRatio * Math.pow((50 * pitchRatio) / (180 * pitchRatio), t / (0.05 * decayMod));
        } else {
          freq = 50 * pitchRatio * Math.pow((40 * pitchRatio) / (50 * pitchRatio), (t - 0.05 * decayMod) / (0.1 * decayMod));
        }
        
        // Amplitude envelope: 1.2 -> 0.7 (fast) -> 0 (decay)
        let amp;
        if (t < 0.02 * decayMod) {
          amp = 1.2 - (0.5 * t / (0.02 * decayMod));
        } else {
          amp = 0.7 * Math.exp(-((t - 0.02 * decayMod) / (0.03 * decayMod)));
        }
        
        // Main sine body
        phase += (2 * Math.PI * freq) / sampleRate;
        let sample = Math.sin(phase) * amp;
        
        // Click transient: square-ish at 800->100Hz, 15ms
        if (t < 0.015) {
          const clickFreq = 800 * pitchRatio * Math.pow((100 * pitchRatio) / (800 * pitchRatio), t / 0.01);
          const clickAmp = 0.5 * Math.exp(-t / 0.003);
          sample += (Math.sin(2 * Math.PI * clickFreq * t) > 0 ? 1 : -1) * clickAmp;
        }
        
        data[i] = sample * volume;
      }
      
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(masterGain);
      source.start(time);
      break;
    }
    case 'kick2': {
      // 808 style kick - buffer-based for perfectly consistent playback
      const sampleRate = audioCtx.sampleRate;
      const duration = 0.25 * decayMod;
      const bufferLen = Math.floor(sampleRate * duration);
      const buffer = audioCtx.createBuffer(1, bufferLen, sampleRate);
      const data = buffer.getChannelData(0);
      
      let phase = 0;
      for (let i = 0; i < bufferLen; i++) {
        const t = i / sampleRate;
        
        // Frequency sweep: 150 -> 35 (fast) -> 25 (slow)
        let freq;
        if (t < 0.08 * decayMod) {
          freq = 150 * pitchRatio * Math.pow((35 * pitchRatio) / (150 * pitchRatio), t / (0.08 * decayMod));
        } else {
          freq = 35 * pitchRatio * Math.pow((25 * pitchRatio) / (35 * pitchRatio), (t - 0.08 * decayMod) / (0.12 * decayMod));
        }
        
        // Amplitude envelope: 1.5 -> 0.8 (fast) -> 0 (decay)
        let amp;
        if (t < 0.05 * decayMod) {
          amp = 1.5 - (0.7 * t / (0.05 * decayMod));
        } else {
          amp = 0.8 * Math.exp(-((t - 0.05 * decayMod) / (0.05 * decayMod)));
        }
        
        // Main sine body
        phase += (2 * Math.PI * freq) / sampleRate;
        let sample = Math.sin(phase) * amp;
        
        // Click transient: triangle at 400->60Hz, 30ms
        if (t < 0.03) {
          const clickFreq = 400 * pitchRatio * Math.pow((60 * pitchRatio) / (400 * pitchRatio), t / 0.02);
          const clickAmp = 0.8 * Math.exp(-t / 0.006);
          const clickPhase = (2 * clickFreq * t) % 1;
          sample += (clickPhase < 0.5 ? 4 * clickPhase - 1 : 3 - 4 * clickPhase) * clickAmp;
        }
        
        data[i] = sample * volume;
      }
      
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(masterGain);
      source.start(time);
      break;
    }
    case 'snare1': {
      // Punchy snare with body + snap
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200 * pitchRatio, time);
      osc.frequency.exponentialRampToValueAtTime(80 * pitchRatio, time + 0.03 * decayMod);
      oscGain.gain.setValueAtTime(volume * 0.8, time);
      oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.08 * decayMod);
      osc.connect(oscGain).connect(masterGain);
      osc.start(time);
      osc.stop(time + 0.08 * decayMod);
      
      // Noise snap
      const noise = audioCtx.createBufferSource();
      const bufferLen = audioCtx.sampleRate * 0.1 * decayMod;
      const buffer = audioCtx.createBuffer(1, bufferLen, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferLen; i++) data[i] = Math.random() * 2 - 1;
      noise.buffer = buffer;
      noise.playbackRate.value = pitchRatio; // Apply pitch to noise
      
      const highpass = audioCtx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.value = 2000;
      
      const noiseGain = audioCtx.createGain();
      noiseGain.gain.setValueAtTime(volume * 0.7, time);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
      
      noise.connect(highpass).connect(noiseGain).connect(masterGain);
      noise.start(time);
      break;
    }
    case 'snare2': {
      // Tight electronic snare - punchy but bright
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280 * pitchRatio, time);
      osc.frequency.exponentialRampToValueAtTime(160 * pitchRatio, time + 0.025 * decayMod);
      oscGain.gain.setValueAtTime(volume * 0.5, time);
      oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.04 * decayMod);
      osc.connect(oscGain).connect(masterGain);
      osc.start(time);
      osc.stop(time + 0.05 * decayMod);
      
      // Crispy noise layer - the "snare wire" sound
      const noise = audioCtx.createBufferSource();
      const bufferLen = Math.floor(audioCtx.sampleRate * 0.12 * decayMod);
      const buffer = audioCtx.createBuffer(1, bufferLen, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferLen; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.02 * decayMod));
      }
      noise.buffer = buffer;
      noise.playbackRate.value = pitchRatio;
      
      // Highpass to remove low end, keep it snappy
      const highpass = audioCtx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.value = 1500 * pitchRatio;
      
      // Presence boost for snap
      const peak = audioCtx.createBiquadFilter();
      peak.type = 'peaking';
      peak.frequency.value = 3500 * pitchRatio;
      peak.Q.value = 2;
      peak.gain.value = 8;
      
      const noiseGain = audioCtx.createGain();
      noiseGain.gain.setValueAtTime(volume * 0.9, time);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1 * decayMod);
      
      noise.connect(highpass).connect(peak).connect(noiseGain).connect(masterGain);
      noise.start(time);
      break;
    }
    case 'hat1': {
      // TR-808 style closed hi-hat - 6 square wave oscillators
      const fundamental = 40 * pitchRatio;
      const ratios = [2, 3, 4.16, 5.43, 6.79, 8.21];
      
      // Bandpass for metallic tone
      const bandpass = audioCtx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 10000 * pitchRatio;
      bandpass.Q.value = 1.2;
      
      // Highpass to remove low end
      const highpass = audioCtx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.value = 7000 * pitchRatio;
      
      const gain = audioCtx.createGain();
      // Sharp attack, very fast decay
      gain.gain.setValueAtTime(volume * 0.45, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.025 * decayMod);
      
      bandpass.connect(highpass).connect(gain).connect(masterGain);
      
      ratios.forEach(ratio => {
        const osc = audioCtx.createOscillator();
        osc.type = 'square';
        osc.frequency.value = fundamental * ratio;
        osc.connect(bandpass);
        osc.start(time);
        osc.stop(time + 0.03 * decayMod);
      });
      break;
    }
    case 'hat2': {
      // Darker closed hi-hat - detuned square waves
      const fundamental = 38 * pitchRatio;
      const ratios = [2.1, 3.05, 4.2, 5.55, 6.9, 8.35];
      
      const bandpass = audioCtx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 8500 * pitchRatio;
      bandpass.Q.value = 1.0;
      
      const highpass = audioCtx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.value = 6000 * pitchRatio;
      
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(volume * 0.4, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04 * decayMod);
      
      bandpass.connect(highpass).connect(gain).connect(masterGain);
      
      ratios.forEach(ratio => {
        const osc = audioCtx.createOscillator();
        osc.type = 'square';
        osc.frequency.value = fundamental * ratio;
        osc.connect(bandpass);
        osc.start(time);
        osc.stop(time + 0.05 * decayMod);
      });
      break;
    }
    case 'clap1': {
      // Classic clap - multiple layered noise bursts with punch
      // Initial transient click for punch
      const click = audioCtx.createOscillator();
      const clickGain = audioCtx.createGain();
      click.type = 'square';
      click.frequency.value = 1500 * pitchRatio;
      clickGain.gain.setValueAtTime(volume * 0.3, time);
      clickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.008);
      click.connect(clickGain).connect(masterGain);
      click.start(time);
      click.stop(time + 0.01);
      
      const numLayers = 4;
      for (let layer = 0; layer < numLayers; layer++) {
        const bufferLen = Math.floor(audioCtx.sampleRate * 0.15 * decayMod);
        const noise = audioCtx.createBufferSource();
        const buffer = audioCtx.createBuffer(1, bufferLen, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferLen; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.02 * decayMod));
        }
        noise.buffer = buffer;
        noise.playbackRate.value = pitchRatio;
        
        // Bandpass filter for that clap character
        const bandpass = audioCtx.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.value = (1200 + layer * 400) * pitchRatio;
        bandpass.Q.value = 1.2;
        
        const gain = audioCtx.createGain();
        const layerDelay = layer * 0.006;
        gain.gain.setValueAtTime(volume * 0.7, time + layerDelay);
        gain.gain.exponentialRampToValueAtTime(0.001, time + layerDelay + 0.1 * decayMod);
        
        noise.connect(bandpass).connect(gain).connect(masterGain);
        noise.start(time + layerDelay);
      }
      break;
    }
    case 'clap2': {
      // Tight punchy clap
      // Sharp attack transient
      const click = audioCtx.createOscillator();
      const clickGain = audioCtx.createGain();
      click.type = 'square';
      click.frequency.value = 2000 * pitchRatio;
      clickGain.gain.setValueAtTime(volume * 0.35, time);
      clickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.006);
      click.connect(clickGain).connect(masterGain);
      click.start(time);
      click.stop(time + 0.008);
      
      const numHits = 3;
      for (let hit = 0; hit < numHits; hit++) {
        const bufferLen = Math.floor(audioCtx.sampleRate * 0.07 * decayMod);
        const noise = audioCtx.createBufferSource();
        const buffer = audioCtx.createBuffer(1, bufferLen, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferLen; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.01 * decayMod));
        }
        noise.buffer = buffer;
        noise.playbackRate.value = pitchRatio;
        
        const bandpass = audioCtx.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.value = 1600 * pitchRatio;
        bandpass.Q.value = 1.5;
        
        const highshelf = audioCtx.createBiquadFilter();
        highshelf.type = 'highshelf';
        highshelf.frequency.value = 3000 * pitchRatio;
        highshelf.gain.value = 5;
        
        const gain = audioCtx.createGain();
        const hitDelay = hit * 0.012;
        gain.gain.setValueAtTime(volume * 0.75, time + hitDelay);
        gain.gain.exponentialRampToValueAtTime(0.001, time + hitDelay + 0.06 * decayMod);
        
        noise.connect(bandpass).connect(highshelf).connect(gain).connect(masterGain);
        noise.start(time + hitDelay);
      }
      break;
    }
    case 'openhat1': {
      // Open hi-hat 1 - classic open hat
      const bufferSize = Math.floor(audioCtx.sampleRate * 0.25 * decayMod);
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.playbackRate.value = pitchRatio;
      
      // Highpass for that metallic hi-hat sound
      const highpass = audioCtx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.value = 7000 * pitchRatio;
      
      // Bandpass for character
      const bandpass = audioCtx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 10000 * pitchRatio;
      bandpass.Q.value = 1;
      
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(volume * 0.5, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2 * decayMod);
      
      noise.connect(highpass);
      highpass.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(masterGain);
      noise.start(time);
      noise.stop(time + 0.25 * decayMod);
      break;
    }
    case 'openhat2': {
      // Open hi-hat 2 - slightly longer
      const bufferSize = Math.floor(audioCtx.sampleRate * 0.35 * decayMod);
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.playbackRate.value = pitchRatio;
      
      const highpass = audioCtx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.value = 6000 * pitchRatio;
      
      const bandpass = audioCtx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 9000 * pitchRatio;
      bandpass.Q.value = 0.8;
      
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(volume * 0.45, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3 * decayMod);
      
      noise.connect(highpass);
      highpass.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(masterGain);
      noise.start(time);
      noise.stop(time + 0.35 * decayMod);
      break;
    }
    case 'rim1': {
      // Rimshot - stick hitting rim + head
      // High frequency crack
      const bufferLen = Math.floor(audioCtx.sampleRate * 0.03 * decayMod);
      const noise = audioCtx.createBufferSource();
      const buffer = audioCtx.createBuffer(1, bufferLen, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferLen; i++) data[i] = Math.random() * 2 - 1;
      noise.buffer = buffer;
      noise.playbackRate.value = pitchRatio;
      
      const bandpass = audioCtx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 1500 * pitchRatio;
      bandpass.Q.value = 3;
      
      const noiseGain = audioCtx.createGain();
      noiseGain.gain.setValueAtTime(volume * 1.2, time);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.03 * decayMod);
      noise.connect(bandpass).connect(noiseGain).connect(masterGain);
      noise.start(time);
      
      // Low thud from head
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(280 * pitchRatio, time);
      osc.frequency.exponentialRampToValueAtTime(150 * pitchRatio, time + 0.015 * decayMod);
      oscGain.gain.setValueAtTime(volume * 0.4, time);
      oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.025 * decayMod);
      osc.connect(oscGain).connect(masterGain);
      osc.start(time);
      osc.stop(time + 0.025 * decayMod);
      break;
    }
    case 'rim2': {
      // Sidestick / cross-stick - drier, clickier
      const bufferLen = Math.floor(audioCtx.sampleRate * 0.025 * decayMod);
      const noise = audioCtx.createBufferSource();
      const buffer = audioCtx.createBuffer(1, bufferLen, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferLen; i++) data[i] = Math.random() * 2 - 1;
      noise.buffer = buffer;
      noise.playbackRate.value = pitchRatio;
      
      const bandpass = audioCtx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 2200 * pitchRatio;
      bandpass.Q.value = 4;
      
      const noiseGain = audioCtx.createGain();
      noiseGain.gain.setValueAtTime(volume * 1.0, time);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.02 * decayMod);
      noise.connect(bandpass).connect(noiseGain).connect(masterGain);
      noise.start(time);
      break;
    }
    case 'tom1': {
      const osc = audioCtx.createOscillator();
      osc.frequency.setValueAtTime(200 * pitchRatio, time);
      osc.frequency.exponentialRampToValueAtTime(80 * pitchRatio, time + 0.2 * decayMod);
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(volume, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2 * decayMod);
      osc.connect(gain).connect(masterGain);
      osc.start(time);
      osc.stop(time + 0.2 * decayMod);
      break;
    }
    case 'tom2': {
      const osc = audioCtx.createOscillator();
      osc.frequency.setValueAtTime(150 * pitchRatio, time);
      osc.frequency.exponentialRampToValueAtTime(60 * pitchRatio, time + 0.3 * decayMod);
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(volume * 1.1, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3 * decayMod);
      osc.connect(gain).connect(masterGain);
      osc.start(time);
      osc.stop(time + 0.3 * decayMod);
      break;
    }
  }
}

function updateBeatCounter() {
  const bar = Math.floor(currentStep / steps) + 1;
  const beat = Math.floor((currentStep % steps) / 4) + 1;
  const tick = (currentStep % 4) + 1;
  
  let displayText = `${bar}.${beat}.${tick.toString().padStart(2, '0')}`;
  
  if (sequencerEnabled) {
    const activeSeq = getActiveSequence();
    if (activeSeq.length > 0) {
      displayText = `[${activeSeq[currentSequenceIndex]}] ${displayText}`;
    }
  }
  
  document.getElementById('beatCounter').textContent = displayText;
}

function tick(scheduledTime) {
  let activePattern = currentPattern;
  if (sequencerEnabled) {
    const activeSeq = getActiveSequence();
    if (activeSeq.length > 0) {
      activePattern = activeSeq[currentSequenceIndex];
    }
  }
  
  // Calculate step duration for burst subdivision timing
  const stepDuration = 60 / bpm / 4;
  
  // Schedule audio first (time-critical) - use precise scheduled time
  const anySoloed = Object.values(trackSoloed).some(s => s);
  trackConfig.forEach(track => {
    // Skip muted tracks, or non-soloed tracks when any solo is active
    if (trackMuted[track.name]) return;
    if (anySoloed && !trackSoloed[track.name]) return;
    if (patterns[activePattern][track.name][currentStep]) {
      const burstCount = (patternBurst[activePattern] && patternBurst[activePattern][track.name] && patternBurst[activePattern][track.name][currentStep]) || 1;
      
      if (burstCount <= 1) {
        // Normal single hit
        playSound(track.name, activePattern, scheduledTime);
      } else {
        // Burst: subdivide the step into multiple rapid-fire triggers
        const subInterval = stepDuration / burstCount;
        for (let b = 0; b < burstCount; b++) {
          playSound(track.name, activePattern, scheduledTime + (b * subInterval));
        }
      }
    }
  });
  
  // Defer UI updates to next animation frame (non-blocking)
  const stepSnapshot = currentStep;
  const patternSnapshot = activePattern;
  
  requestAnimationFrame(() => {
    // Update pattern buttons and grid only on pattern change
    if (sequencerEnabled) {
      document.querySelectorAll('.pattern-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.pattern === patternSnapshot);
      });
      
      if (stepSnapshot === 0) {
        trackConfig.forEach(track => {
          const container = document.querySelector(`[data-track="${track.name}"]`);
          const stepEls = container.querySelectorAll('.step');
          stepEls.forEach((el, i) => {
            el.classList.toggle('active', patterns[patternSnapshot][track.name][i]);
            // Update burst visuals on pattern switch
            const burstVal = (patternBurst[patternSnapshot][track.name] && patternBurst[patternSnapshot][track.name][i]) || 1;
            applyBurstVisual(el, patterns[patternSnapshot][track.name][i] ? burstVal : 1);
          });
        });
        
        // Apply per-pattern effects on pattern change
        applyPatternEffects(patternSnapshot);
      }
    }
    
    // Update step highlights
    trackConfig.forEach(track => {
      const container = document.querySelector(`[data-track="${track.name}"]`);
      const stepEls = container.querySelectorAll('.step');
      stepEls.forEach((el, i) => el.classList.toggle('playing', i === stepSnapshot));
    });
    
    updateBeatCounter();
    updateSequenceUI();
  });
  
  currentStep = (currentStep + 1) % steps;
  
  if (sequencerEnabled && currentStep === 0) {
    const activeSeq = getActiveSequence();
    if (activeSeq.length > 0) {
      currentSequenceIndex = (currentSequenceIndex + 1) % activeSeq.length;
    }
  }
}

function start() {
  if (isPlaying) return;
  
  // Resume audio context if suspended
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  
  isPlaying = true;
  currentSequenceIndex = 0;
  
  // Web Audio lookahead scheduler for tight timing
  const scheduleAheadTime = 0.1; // seconds to look ahead
  const timerInterval = 25; // ms between scheduler checks
  
  // Small delay to let audio context stabilize before first beat
  let nextStepTime = audioCtx.currentTime + 0.06;
  
  function scheduler() {
    if (!isPlaying) return;
    
    // Schedule all steps that fall within the lookahead window
    while (nextStepTime < audioCtx.currentTime + scheduleAheadTime) {
      tick(nextStepTime);
      
      // Calculate next step time
      let interval = 60 / bpm / 4;
      if (swing > 0 && (currentStep - 1 + steps) % steps % 2 === 0) {
        interval *= 1 + (swing / 100);
      }
      nextStepTime += interval;
    }
    
    schedulerTimer = setTimeout(scheduler, timerInterval);
  }
  
  scheduler();
}

function stop() {
  isPlaying = false;
  if (schedulerTimer) {
    clearTimeout(schedulerTimer);
    schedulerTimer = null;
  }
  currentStep = 0;
  currentSequenceIndex = 0;
  updateBeatCounter();
  updateSequenceUI();
  
  document.querySelectorAll('.pattern-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.pattern === currentPattern);
  });
  
  trackConfig.forEach(track => {
    const container = document.querySelector(`[data-track="${track.name}"]`);
    container.querySelectorAll('.step').forEach(el => {
      el.classList.remove('playing');
      const stepEls = container.querySelectorAll('.step');
      stepEls.forEach((step, i) => {
        step.classList.toggle('active', patterns[currentPattern][track.name][i]);
        // Restore burst visuals
        const burstVal = (patternBurst[currentPattern][track.name] && patternBurst[currentPattern][track.name][i]) || 1;
        applyBurstVisual(step, patterns[currentPattern][track.name][i] ? burstVal : 1);
      });
    });
  });
}

document.querySelectorAll('.pattern-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.pattern-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentPattern = btn.dataset.pattern;
    updateUI();
    applyPatternEffects(currentPattern);
  });
});

// Copy/Paste Pattern functionality
let copiedPattern = null;

document.getElementById('copyPattern').onclick = () => {
  // Deep copy the current pattern
  copiedPattern = { 
    steps: {}, 
    effects: { ...patternEffects[currentPattern] }, 
    burst: {},
    sounds: { ...patternSounds[currentPattern] },
    pitch: { ...patternPitch[currentPattern] },
    decay: { ...patternDecay[currentPattern] }
  };
  trackConfig.forEach(track => {
    copiedPattern.steps[track.name] = [...patterns[currentPattern][track.name]];
    copiedPattern.burst[track.name] = [...(patternBurst[currentPattern][track.name] || Array(steps).fill(1))];
  });
  
  // Enable paste button and update UI
  const pasteBtn = document.getElementById('pastePattern');
  pasteBtn.disabled = false;
  pasteBtn.textContent = `📥 Paste ${currentPattern}`;
  
  // Visual feedback
  const copyBtn = document.getElementById('copyPattern');
  copyBtn.textContent = '✓ Copied!';
  setTimeout(() => {
    copyBtn.textContent = '📋 Copy';
  }, 1000);
};

document.getElementById('pastePattern').onclick = () => {
  if (!copiedPattern) return;
  
  const pasteModal = document.getElementById('pasteModal');
  
  // Disable the current pattern button (can't paste to itself)
  document.querySelectorAll('.paste-option').forEach(btn => {
    const target = btn.dataset.target;
    if (target === currentPattern) {
      btn.disabled = true;
      btn.style.opacity = '0.4';
    } else {
      btn.disabled = false;
      btn.style.opacity = '1';
    }
  });
  
  pasteModal.style.display = 'flex';
};

// Close paste modal
document.getElementById('closePasteModal').onclick = () => {
  document.getElementById('pasteModal').style.display = 'none';
};

// Handle paste option clicks
document.querySelectorAll('.paste-option').forEach(btn => {
  btn.onclick = () => {
    const target = btn.dataset.target;
    const otherPatterns = ['A', 'B', 'C'].filter(p => p !== currentPattern);
    
    if (target === 'ALL') {
      // Paste to all other patterns
      otherPatterns.forEach(targetPattern => {
        trackConfig.forEach(track => {
          patterns[targetPattern][track.name] = [...copiedPattern.steps[track.name]];
          if (copiedPattern.burst && copiedPattern.burst[track.name]) {
            patternBurst[targetPattern][track.name] = [...copiedPattern.burst[track.name]];
          }
        });
        if (copiedPattern.effects) {
          Object.assign(patternEffects[targetPattern], copiedPattern.effects);
        }
        // Copy sample parameters
        if (copiedPattern.sounds) {
          Object.assign(patternSounds[targetPattern], copiedPattern.sounds);
        }
        if (copiedPattern.pitch) {
          Object.assign(patternPitch[targetPattern], copiedPattern.pitch);
          // Update pitch ratios too
          trackConfig.forEach(track => {
            const semitones = copiedPattern.pitch[track.name] || 0;
            patternPitchRatio[targetPattern][track.name] = Math.pow(2, semitones / 12);
          });
        }
        if (copiedPattern.decay) {
          Object.assign(patternDecay[targetPattern], copiedPattern.decay);
        }
      });
    } else if (['A', 'B', 'C'].includes(target)) {
      // Paste to specific pattern
      trackConfig.forEach(track => {
        patterns[target][track.name] = [...copiedPattern.steps[track.name]];
        if (copiedPattern.burst && copiedPattern.burst[track.name]) {
          patternBurst[target][track.name] = [...copiedPattern.burst[track.name]];
        }
      });
      if (copiedPattern.effects) {
        Object.assign(patternEffects[target], copiedPattern.effects);
      }
      // Copy sample parameters
      if (copiedPattern.sounds) {
        Object.assign(patternSounds[target], copiedPattern.sounds);
      }
      if (copiedPattern.pitch) {
        Object.assign(patternPitch[target], copiedPattern.pitch);
        // Update pitch ratios too
        trackConfig.forEach(track => {
          const semitones = copiedPattern.pitch[track.name] || 0;
          patternPitchRatio[target][track.name] = Math.pow(2, semitones / 12);
        });
      }
      if (copiedPattern.decay) {
        Object.assign(patternDecay[target], copiedPattern.decay);
      }
      
      // Switch to the pasted pattern
      document.querySelectorAll('.pattern-btn').forEach(b => b.classList.remove('active'));
      document.querySelector(`[data-pattern="${target}"]`).classList.add('active');
      currentPattern = target;
      updateUI();
      applyPatternEffects(currentPattern);
    }
    
    document.getElementById('pasteModal').style.display = 'none';
  };
});

function updateUI() {
  trackConfig.forEach(track => {
    const container = document.querySelector(`[data-track="${track.name}"]`);
    const stepEls = container.querySelectorAll('.step');
    stepEls.forEach((el, i) => {
      el.classList.toggle('active', patterns[currentPattern][track.name][i]);
      // Update burst visuals
      const burstVal = (patternBurst[currentPattern][track.name] && patternBurst[currentPattern][track.name][i]) || 1;
      applyBurstVisual(el, patterns[currentPattern][track.name][i] ? burstVal : 1);
    });
    
    // Update sound selection display
    const soundMenu = container.querySelector('.sound-menu');
    if (soundMenu) {
      const currentSound = patternSounds[currentPattern][track.name];
      soundMenu.querySelectorAll('.sound-option').forEach(opt => {
        opt.classList.toggle('selected', opt.dataset.sound === currentSound);
      });
    }
    
    // Update pitch display
    const pitchControl = container.querySelector('.pitch-control');
    const pitchValue = container.querySelector('.pitch-value');
    if (pitchControl && pitchValue) {
      const pitch = patternPitch[currentPattern][track.name] || 0;
      pitchControl.value = pitch;
      pitchValue.textContent = pitch > 0 ? '+' + pitch : pitch;
    }
    
    // Update decay display
    const decayControl = container.querySelector('.decay-control');
    const decayValue = container.querySelector('.decay-value');
    if (decayControl && decayValue) {
      const decay = patternDecay[currentPattern][track.name] || 100;
      decayControl.value = decay;
      decayValue.textContent = decay + '%';
    }
  });
}

// Apply effects for a given pattern - updates both audio nodes and UI sliders
function applyPatternEffects(pattern) {
  const fx = patternEffects[pattern];
  
  // Reverb
  const wetAmount = fx.reverb / 100;
  reverbWet.gain.value = wetAmount;
  reverbDry.gain.value = 1 - wetAmount;
  const reverbSlider = document.getElementById('reverb');
  if (reverbSlider) reverbSlider.value = fx.reverb;
  const reverbVal = document.getElementById('reverbValue');
  if (reverbVal) reverbVal.textContent = fx.reverb + '%';
  
  // Delay Mix
  delayWet.gain.value = fx.delayMix / 100;
  const delaySlider = document.getElementById('delayMix');
  if (delaySlider) delaySlider.value = fx.delayMix;
  const delayVal = document.getElementById('delayValue');
  if (delayVal) delayVal.textContent = fx.delayMix + '%';
  
  // Delay Time
  delayNode.delayTime.value = fx.delayTime / 1000;
  const delayTimeSlider = document.getElementById('delayTime');
  if (delayTimeSlider) delayTimeSlider.value = fx.delayTime;
  const delayTimeVal = document.getElementById('delayTimeValue');
  if (delayTimeVal) delayTimeVal.textContent = fx.delayTime + 'ms';
  
  // Filter
  filterNode.frequency.value = fx.filter;
  const filterSlider = document.getElementById('filter');
  if (filterSlider) filterSlider.value = fx.filter;
  const filterVal = document.getElementById('filterValue');
  if (filterVal) filterVal.textContent = fx.filter >= 1000 ? (fx.filter/1000).toFixed(1)+'k' : fx.filter;
  
  // Gain
  const boost = 1 + (fx.gain / 100) * 3;
  gainBoost.gain.value = boost;
  highShelf.gain.value = (fx.gain / 100) * 12;
  const gainSlider = document.getElementById('gain');
  if (gainSlider) gainSlider.value = fx.gain;
  const gainVal = document.getElementById('gainValue');
  if (gainVal) gainVal.textContent = fx.gain + '%';
}

document.getElementById('play').onclick = () => { 
  audioCtx.resume(); 
  start();
  if (window.firebaseLogEvent) window.firebaseLogEvent('play_beat', { bpm: bpm });
};

document.getElementById('stop').onclick = () => {
  stop();
  if (window.firebaseLogEvent) window.firebaseLogEvent('stop_beat');
};

// Spacebar play/stop for desktop
document.addEventListener('keydown', (e) => {
  // Only trigger if not typing in an input field
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
  
  if (e.code === 'Space') {
    e.preventDefault(); // Prevent page scroll
    if (isPlaying) {
      stop();
      if (window.firebaseLogEvent) window.firebaseLogEvent('spacebar_stop');
    } else {
      audioCtx.resume();
      start();
      if (window.firebaseLogEvent) window.firebaseLogEvent('spacebar_play', { bpm: bpm });
    }
  }
});

document.getElementById('bpm').oninput = e => {
  bpm = parseInt(e.target.value);
  document.getElementById('bpmValue').textContent = bpm;
};

// Click BPM value to manually enter
document.getElementById('bpmValue').addEventListener('click', e => {
  const currentVal = bpm;
  const input = document.createElement('input');
  input.type = 'number';
  input.min = '40';
  input.max = '200';
  input.value = currentVal;
  input.className = 'bpm-input';
  input.style.cssText = 'width: 50px; text-align: center; background: #1a1a1a; border: 1px solid #14F195; color: #fff; border-radius: 4px; font-size: inherit;';
  
  const bpmValue = e.target;
  bpmValue.style.display = 'none';
  bpmValue.parentNode.insertBefore(input, bpmValue.nextSibling);
  input.focus();
  input.select();
  
  const finishEdit = () => {
    let newVal = parseInt(input.value) || 120;
    newVal = Math.max(40, Math.min(200, newVal));
    bpm = newVal;
    document.getElementById('bpm').value = bpm;
    bpmValue.textContent = bpm;
    bpmValue.style.display = '';
    input.remove();
  };
  
  input.addEventListener('blur', finishEdit);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      finishEdit();
    } else if (e.key === 'Escape') {
      bpmValue.style.display = '';
      input.remove();
    }
  });
});

document.getElementById('swing').oninput = e => {
  swing = parseInt(e.target.value);
  document.getElementById('swingValue').textContent = swing + '%';
};

// Click Swing value to manually enter
document.getElementById('swingValue').addEventListener('click', e => {
  const currentVal = swing;
  const input = document.createElement('input');
  input.type = 'number';
  input.min = '0';
  input.max = '100';
  input.value = currentVal;
  input.className = 'swing-input';
  input.style.cssText = 'width: 50px; text-align: center; background: #1a1a1a; border: 1px solid #14F195; color: #fff; border-radius: 4px; font-size: inherit;';
  
  const swingValue = e.target;
  swingValue.style.display = 'none';
  swingValue.parentNode.insertBefore(input, swingValue.nextSibling);
  input.focus();
  input.select();
  
  const finishEdit = () => {
    let newVal = parseInt(input.value) || 0;
    newVal = Math.max(0, Math.min(100, newVal));
    swing = newVal;
    document.getElementById('swing').value = swing;
    swingValue.textContent = swing + '%';
    swingValue.style.display = '';
    input.remove();
  };
  
  input.addEventListener('blur', finishEdit);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      finishEdit();
    } else if (e.key === 'Escape') {
      swingValue.style.display = '';
      input.remove();
    }
  });
});

document.getElementById('patternLength').onchange = e => {
  const newLength = parseInt(e.target.value);
  steps = newLength;
  rebuildGrid();
};

function rebuildGrid() {
  // Rebuild the grid for each track with new step count
  trackConfig.forEach(track => {
    const container = document.querySelector(`[data-track="${track.name}"]`);
    const grid = container.querySelector('.track-grid');
    grid.innerHTML = '';
    
    // Ensure pattern arrays exist for all patterns
    ['A', 'B', 'C'].forEach(patternKey => {
      if (!patterns[patternKey][track.name]) {
        patterns[patternKey][track.name] = new Array(16).fill(false);
      }
      // Extend array if needed
      while (patterns[patternKey][track.name].length < 16) {
        patterns[patternKey][track.name].push(false);
      }
      // Ensure burst arrays exist and are correct length
      if (!patternBurst[patternKey][track.name]) {
        patternBurst[patternKey][track.name] = new Array(16).fill(1);
      }
      while (patternBurst[patternKey][track.name].length < 16) {
        patternBurst[patternKey][track.name].push(1);
      }
    });
    
    for (let i = 0; i < steps; i++) {
      const step = document.createElement('div');
      step.className = 'step';
      step.dataset.index = i;
      step.dataset.track = track.name;
      if (patterns[currentPattern][track.name][i]) {
        step.classList.add('active');
        // Apply burst visual
        const burstVal = patternBurst[currentPattern][track.name][i] || 1;
        if (burstVal > 1) {
          step.classList.add(BURST_COLORS[burstVal]);
          const badge = document.createElement('span');
          badge.className = 'burst-badge';
          badge.textContent = burstVal + 'x';
          step.appendChild(badge);
        }
      }
      grid.appendChild(step);
    }
  });
  
  // Update grid CSS - cap step width at 12-step sizing
  document.querySelectorAll('.track-grid').forEach(grid => {
    if (steps <= 12) {
      // For 12 steps or fewer, use fixed step width equivalent to 12-step pattern
      const stepWidth = `calc((100% / 12) - 3px)`;
      grid.style.gridTemplateColumns = `repeat(${steps}, ${stepWidth})`;
      grid.style.justifyContent = 'flex-start';
    } else {
      // For more than 12 steps, use flexible sizing
      grid.style.gridTemplateColumns = `repeat(${steps}, 1fr)`;
      grid.style.justifyContent = 'stretch';
    }
  });
  
  // Reset current step if beyond new length
  if (currentStep >= steps) {
    currentStep = 0;
  }
}

document.getElementById('delayMix').oninput = e => {
  const val = parseInt(e.target.value);
  patternEffects[currentPattern].delayMix = val;
  delayWet.gain.value = val / 100;
  document.getElementById('delayValue').textContent = val + '%';
};

document.getElementById('delayTime').oninput = e => {
  const val = parseInt(e.target.value);
  patternEffects[currentPattern].delayTime = val;
  delayNode.delayTime.value = val / 1000;
  document.getElementById('delayTimeValue').textContent = val + 'ms';
};

document.getElementById('filter').oninput = e => {
  const val = parseInt(e.target.value);
  patternEffects[currentPattern].filter = val;
  filterNode.frequency.value = val;
  document.getElementById('filterValue').textContent = val >= 1000 ? (val/1000).toFixed(1)+'k' : val;
};

document.getElementById('reverb').oninput = e => {
  const val = parseInt(e.target.value);
  patternEffects[currentPattern].reverb = val;
  document.getElementById('reverbValue').textContent = val + '%';
  
  const wetAmount = val / 100;
  reverbWet.gain.value = wetAmount;
  reverbDry.gain.value = 1 - wetAmount;
};

document.getElementById('gain').oninput = e => {
  const val = parseInt(e.target.value);
  patternEffects[currentPattern].gain = val;
  document.getElementById('gainValue').textContent = val + '%';
  
  // Gain boost: 0% = 1x, 100% = 4x
  const boost = 1 + (val / 100) * 3;
  gainBoost.gain.value = boost;
  
  // High shelf boost: adds presence to highs (0 to +12dB)
  highShelf.gain.value = (val / 100) * 12;
};

document.getElementById('clear').onclick = () => {
  if (confirm('Clear current pattern?')) {
    trackConfig.forEach(t => {
      patterns[currentPattern][t.name].fill(false);
      if (patternBurst[currentPattern][t.name]) patternBurst[currentPattern][t.name].fill(1);
    });
    updateUI();
  }
};

// Weighted randomize - generates musically useful patterns
document.getElementById('randomize').onclick = () => {
  const p = patterns[currentPattern];
  
  // Clear first (including bursts)
  trackConfig.forEach(t => {
    p[t.name].fill(false);
    if (patternBurst[currentPattern][t.name]) patternBurst[currentPattern][t.name].fill(1);
  });
  
  // --- KICK ---
  // Pick a kick style
  const kickStyle = Math.random();
  if (kickStyle < 0.4) {
    // 4-on-the-floor (steps 0,4,8,12)
    [0, 4, 8, 12].forEach(s => p.kick[s] = true);
    // Maybe drop one for variation
    if (Math.random() < 0.2) p.kick[12] = false;
  } else if (kickStyle < 0.7) {
    // Boom-bap / hip-hop style
    p.kick[0] = true;
    p.kick[Math.random() < 0.5 ? 6 : 7] = true;
    p.kick[10] = Math.random() < 0.5;
    if (Math.random() < 0.3) p.kick[3] = true;
  } else {
    // Syncopated
    p.kick[0] = true;
    p.kick[3] = Math.random() < 0.5;
    p.kick[6] = Math.random() < 0.6;
    p.kick[8] = Math.random() < 0.4;
    p.kick[10] = Math.random() < 0.5;
    p.kick[14] = Math.random() < 0.3;
  }
  
  // --- SNARE ---
  // Backbeat is almost always 4 and 12
  const snareStyle = Math.random();
  if (snareStyle < 0.6) {
    // Standard backbeat
    p.snare[4] = true;
    p.snare[12] = true;
  } else if (snareStyle < 0.85) {
    // Backbeat with ghost notes
    p.snare[4] = true;
    p.snare[12] = true;
    if (Math.random() < 0.5) p.snare[7] = true;
    if (Math.random() < 0.4) p.snare[14] = true;
  } else {
    // Half-time (snare only on 8)
    p.snare[8] = true;
    if (Math.random() < 0.3) p.snare[14] = true;
  }
  
  // --- HI-HAT ---
  const hatStyle = Math.random();
  if (hatStyle < 0.35) {
    // Straight 8ths
    for (let i = 0; i < 16; i += 2) p.hat[i] = true;
  } else if (hatStyle < 0.65) {
    // Straight 16ths
    for (let i = 0; i < 16; i++) p.hat[i] = true;
  } else if (hatStyle < 0.85) {
    // Offbeat 8ths
    for (let i = 2; i < 16; i += 4) p.hat[i] = true;
    // Add some extras
    for (let i = 0; i < 16; i++) {
      if (!p.hat[i] && Math.random() < 0.2) p.hat[i] = true;
    }
  } else {
    // Sparse / scattered
    for (let i = 0; i < 16; i++) {
      if (Math.random() < 0.35) p.hat[i] = true;
    }
  }
  
  // --- OPEN HAT ---
  // Sparse - usually offbeats
  const openHatCount = Math.floor(Math.random() * 3); // 0-2 hits
  const openHatCandidates = [2, 6, 10, 14];
  for (let i = 0; i < openHatCount; i++) {
    const idx = openHatCandidates[Math.floor(Math.random() * openHatCandidates.length)];
    p.openhat[idx] = true;
    // Remove closed hat where open hat plays
    p.hat[idx] = false;
  }
  
  // --- CLAP ---
  // Often layers with snare or adds accents
  if (Math.random() < 0.6) {
    // Layer with snare
    for (let i = 0; i < 16; i++) {
      if (p.snare[i]) p.clap[i] = Math.random() < 0.7;
    }
  }
  if (Math.random() < 0.3) {
    // Add a pickup clap
    const pickups = [3, 7, 11, 15];
    p.clap[pickups[Math.floor(Math.random() * pickups.length)]] = true;
  }
  
  // --- RIM ---
  // Sparse percussive accents
  if (Math.random() < 0.5) {
    for (let i = 0; i < 16; i++) {
      if (!p.kick[i] && !p.snare[i] && Math.random() < 0.15) {
        p.rim[i] = true;
      }
    }
  }
  
  // --- TOM ---
  // Very sparse - fills or accents
  if (Math.random() < 0.3) {
    const tomFillStart = Math.random() < 0.5 ? 12 : 14;
    for (let i = tomFillStart; i < 16; i++) {
      if (Math.random() < 0.5) p.tom[i] = true;
    }
  } else if (Math.random() < 0.2) {
    // Single tom accent
    const tomSpots = [3, 7, 11, 15];
    p.tom[tomSpots[Math.floor(Math.random() * tomSpots.length)]] = true;
  }
  
  updateUI();
  
  // --- SUBTLE SOUND VARIATIONS ---
  // Randomize pitch slightly (-5 to +5 semitones)
  trackConfig.forEach(track => {
    const pitch = Math.floor(Math.random() * 11) - 5; // -5 to +5
    patternPitch[currentPattern][track.name] = pitch;
    patternPitchRatio[currentPattern][track.name] = Math.pow(2, pitch / 12);
    
    // Update UI
    const container = document.querySelector(`[data-track="${track.name}"]`);
    if (container) {
      const pitchControl = container.querySelector('.pitch-control');
      const pitchValue = container.querySelector('.pitch-value');
      if (pitchControl) pitchControl.value = pitch;
      if (pitchValue) pitchValue.textContent = pitch > 0 ? '+' + pitch : pitch;
    }
  });
  
  // Randomize decay slightly (70% to 130%)
  trackConfig.forEach(track => {
    const decay = Math.floor(Math.random() * 61) + 70; // 70 to 130
    patternDecay[currentPattern][track.name] = decay;
    
    // Update UI
    const container = document.querySelector(`[data-track="${track.name}"]`);
    if (container) {
      const decayControl = container.querySelector('.decay-control');
      const decayValue = container.querySelector('.decay-value');
      if (decayControl) decayControl.value = decay;
      if (decayValue) decayValue.textContent = decay + '%';
    }
  });
  
  // Randomly add some bursts (favor hi-hats/snare fills)
  trackConfig.forEach(track => {
    for (let i = 0; i < 16; i++) {
      if (!p[track.name][i]) continue;
      
      let burstChance = 0.08; // 8% base chance
      // Hi-hats get more bursts
      if (track.name === 'hat' || track.name === 'openhat') burstChance = 0.15;
      // Snare fills at end of pattern
      if (track.name === 'snare' && i >= 12) burstChance = 0.25;
      // Toms/clap at end
      if ((track.name === 'tom' || track.name === 'clap') && i >= 14) burstChance = 0.2;
      
      if (Math.random() < burstChance) {
        const burstOptions = [2, 2, 3, 3, 4, 4, 6, 8]; // weighted toward 2x-4x
        const burstVal = burstOptions[Math.floor(Math.random() * burstOptions.length)];
        patternBurst[currentPattern][track.name][i] = burstVal;
        
        // Apply visual burst colors immediately
        const container = document.querySelector(`[data-track="${track.name}"]`);
        if (container) {
          const stepEl = container.querySelectorAll('.step')[i];
          if (stepEl) {
            applyBurstVisual(stepEl, burstVal);
          }
        }
      }
    }
  });
  
  if (window.firebaseLogEvent) window.firebaseLogEvent('randomize_pattern', { pattern: currentPattern });
};

// Share to X
document.getElementById('shareX').onclick = () => {
  document.getElementById('shareXModal').style.display = 'flex';
};

document.getElementById('closeShareXModal').onclick = () => {
  document.getElementById('shareXModal').style.display = 'none';
};

document.getElementById('shareXConfirm').onclick = () => {
  document.getElementById('shareXModal').style.display = 'none';
  
  const beatName = document.getElementById('beatName').value.trim() || 'Untitled';
  const text = `🎵 "${beatName}" - made on MPSeeker by @SolSynthLabs

Beat Maker for your Seeker!

#SolSynthLabs #MPSeeker #SolanaMobile #BeatMaker`;
  
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
  if (window.firebaseLogEvent) window.firebaseLogEvent('share_x', { beat_name: beatName });
};

function updateBeatDropdown() {
  const library = JSON.parse(localStorage.getItem('beatLibrary') || '{}');
  const select = document.getElementById('savedBeats');
  select.innerHTML = '<option value="">-- Load Beat --</option>';
  Object.keys(library).forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });
}

document.getElementById('save').onclick = () => {
  const name = document.getElementById('beatName').value.trim();
  if (!name) return alert('Enter a beat name.');
  const data = { bpm, swing, patterns, trackVolumes, patternSequence, patternSounds, patternPitch, patternDecay, patternBurst };
  const library = JSON.parse(localStorage.getItem('beatLibrary') || '{}');
  library[name] = data;
  localStorage.setItem('beatLibrary', JSON.stringify(library));
  alert(`"${name}" saved!`);
  updateBeatDropdown();
  if (window.firebaseLogEvent) window.firebaseLogEvent('save_beat', { beat_name: name });
};

// Export beat to file
document.getElementById('exportBeat').onclick = () => {
  const name = document.getElementById('beatName').value.trim() || 'Untitled';
  const data = { 
    name,
    version: '1.5',
    bpm, 
    swing,
    steps,
    patterns, 
    trackVolumes, 
    patternSequence,
    sequencerEnabled,
    patternSounds,
    patternPitch,
    patternDecay,
    patternEffects,
    patternBurst,
    exportedAt: new Date().toISOString()
  };
  
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name.replace(/[^a-z0-9]/gi, '_')}.mpseeker`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  if (window.firebaseLogEvent) window.firebaseLogEvent('export_beat', { beat_name: name });
};

// Import beat from file
document.getElementById('importBeat').onclick = () => {
  document.getElementById('importFile').click();
};

document.getElementById('importFile').onchange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);
      
      // Load the beat data
      bpm = data.bpm || 120;
      swing = data.swing || 0;
      
      // Load steps (v1.4 format)
      if (data.steps) {
        steps = data.steps;
        const patternLengthSelect = document.getElementById('patternLength');
        if (patternLengthSelect) {
          patternLengthSelect.value = steps;
        }
        rebuildGrid();
      }
      
      Object.assign(patterns, data.patterns);
      Object.assign(trackVolumes, data.trackVolumes || {});
      
      if (data.patternSequence) {
        patternSequence = data.patternSequence;
        document.querySelectorAll('.pattern-select').forEach((select, i) => {
          select.value = patternSequence[i] || '';
        });
      }
      
      // Load sequencer enabled state (v1.3)
      if (data.sequencerEnabled !== undefined) {
        sequencerEnabled = data.sequencerEnabled;
        const seqToggle = document.querySelector('.seq-toggle');
        if (seqToggle) {
          seqToggle.classList.toggle('active', sequencerEnabled);
          seqToggle.textContent = sequencerEnabled ? 'Chain: ON' : 'Chain: OFF';
        }
      }
      
      // Load per-pattern sounds (v1.1 format)
      if (data.patternSounds) {
        Object.keys(data.patternSounds).forEach(pattern => {
          Object.assign(patternSounds[pattern], data.patternSounds[pattern]);
        });
      } else if (data.trackSounds) {
        // Legacy v1.0 format - apply to all patterns
        ['A', 'B', 'C'].forEach(pattern => {
          Object.assign(patternSounds[pattern], data.trackSounds);
        });
      }
      
      // Load per-pattern pitch (v1.1 format)
      if (data.patternPitch) {
        Object.keys(data.patternPitch).forEach(pattern => {
          Object.assign(patternPitch[pattern], data.patternPitch[pattern]);
          // Pre-calculate pitch ratios
          trackConfig.forEach(track => {
            const semitones = patternPitch[pattern][track.name] || 0;
            patternPitchRatio[pattern][track.name] = Math.pow(2, semitones / 12);
          });
        });
      } else if (data.trackPitch) {
        // Legacy v1.0 format - apply to all patterns
        ['A', 'B', 'C'].forEach(pattern => {
          Object.assign(patternPitch[pattern], data.trackPitch);
          trackConfig.forEach(track => {
            const semitones = patternPitch[pattern][track.name] || 0;
            patternPitchRatio[pattern][track.name] = Math.pow(2, semitones / 12);
          });
        });
      }
      
      // Load per-pattern decay (v1.1 format)
      if (data.patternDecay) {
        Object.keys(data.patternDecay).forEach(pattern => {
          Object.assign(patternDecay[pattern], data.patternDecay[pattern]);
        });
      } else if (data.trackDecay) {
        // Legacy v1.0 format - apply to all patterns
        ['A', 'B', 'C'].forEach(pattern => {
          Object.assign(patternDecay[pattern], data.trackDecay);
        });
      }
      
      // Load per-pattern effects (v1.2 format)
      if (data.patternEffects) {
        Object.keys(data.patternEffects).forEach(pattern => {
          Object.assign(patternEffects[pattern], data.patternEffects[pattern]);
        });
      }
      
      // Load per-pattern burst data (v1.5 format)
      if (data.patternBurst) {
        Object.keys(data.patternBurst).forEach(pattern => {
          if (patternBurst[pattern]) {
            Object.keys(data.patternBurst[pattern]).forEach(track => {
              patternBurst[pattern][track] = [...data.patternBurst[pattern][track]];
            });
          }
        });
      } else {
        // No burst data - initialize all to 1x
        ['A', 'B', 'C'].forEach(pattern => {
          trackConfig.forEach(track => {
            patternBurst[pattern][track.name] = Array(steps).fill(1);
          });
        });
      }
      
      document.getElementById('bpm').value = bpm;
      document.getElementById('bpmValue').textContent = bpm;
      document.getElementById('swing').value = swing;
      document.getElementById('swingValue').textContent = swing + '%';
      document.getElementById('beatName').value = data.name || 'Imported Beat';
      updateUI();
      applyPatternEffects(currentPattern);
      
      // Update track volume sliders
      trackConfig.forEach(track => {
        const container = document.querySelector(`[data-track="${track.name}"]`);
        if (container) {
          const volumeSlider = container.querySelector('.volume-slider');
          const volumeValue = container.querySelector('.volume-value');
          const vol = Math.round((trackVolumes[track.name] || 0.8) * 100);
          if (volumeSlider) volumeSlider.value = vol;
          if (volumeValue) volumeValue.textContent = vol;
        }
      });
      
      alert(`"${data.name || 'Beat'}" imported successfully!`);
      if (window.firebaseLogEvent) window.firebaseLogEvent('import_beat', { beat_name: data.name });
      
    } catch (err) {
      alert('Error importing beat: Invalid file format');
      console.error('Import error:', err);
    }
  };
  
  reader.readAsText(file);
  e.target.value = ''; // Reset file input
};

document.getElementById('savedBeats').onchange = () => {
  const name = document.getElementById('savedBeats').value;
  if (!name) return;
  const library = JSON.parse(localStorage.getItem('beatLibrary') || '{}');
  const data = library[name];
  if (!data) return alert('Beat not found!');
  
  bpm = data.bpm || 120;
  swing = data.swing || 0;
  Object.assign(patterns, data.patterns);
  Object.assign(trackVolumes, data.trackVolumes || {});
  
  if (data.patternSequence) {
    patternSequence = data.patternSequence;
    document.querySelectorAll('.pattern-select').forEach((select, i) => {
      select.value = patternSequence[i] || '';
    });
  }
  
  // Load sequencer enabled state
  if (data.sequencerEnabled !== undefined) {
    sequencerEnabled = data.sequencerEnabled;
    const seqToggle = document.querySelector('.seq-toggle');
    if (seqToggle) {
      seqToggle.classList.toggle('active', sequencerEnabled);
      seqToggle.textContent = sequencerEnabled ? 'Chain: ON' : 'Chain: OFF';
    }
  }
  
  // Load per-pattern sounds (new format)
  if (data.patternSounds) {
    Object.keys(data.patternSounds).forEach(pattern => {
      Object.assign(patternSounds[pattern], data.patternSounds[pattern]);
    });
  } else if (data.trackSounds) {
    // Legacy format - apply to all patterns
    ['A', 'B', 'C'].forEach(pattern => {
      Object.assign(patternSounds[pattern], data.trackSounds);
    });
  }
  
  // Load per-pattern pitch (new format)
  if (data.patternPitch) {
    Object.keys(data.patternPitch).forEach(pattern => {
      Object.assign(patternPitch[pattern], data.patternPitch[pattern]);
      trackConfig.forEach(track => {
        const semitones = patternPitch[pattern][track.name] || 0;
        patternPitchRatio[pattern][track.name] = Math.pow(2, semitones / 12);
      });
    });
  } else if (data.trackPitch) {
    // Legacy format - apply to all patterns
    ['A', 'B', 'C'].forEach(pattern => {
      Object.assign(patternPitch[pattern], data.trackPitch);
      trackConfig.forEach(track => {
        const semitones = patternPitch[pattern][track.name] || 0;
        patternPitchRatio[pattern][track.name] = Math.pow(2, semitones / 12);
      });
    });
  }
  
  // Load per-pattern decay (new format)
  if (data.patternDecay) {
    Object.keys(data.patternDecay).forEach(pattern => {
      Object.assign(patternDecay[pattern], data.patternDecay[pattern]);
    });
  } else if (data.trackDecay) {
    // Legacy format - apply to all patterns
    ['A', 'B', 'C'].forEach(pattern => {
      Object.assign(patternDecay[pattern], data.trackDecay);
    });
  }
  
  // Load per-pattern effects
  if (data.patternEffects) {
    Object.keys(data.patternEffects).forEach(pattern => {
      Object.assign(patternEffects[pattern], data.patternEffects[pattern]);
    });
  }
  
  document.getElementById('bpm').value = bpm;
  document.getElementById('bpmValue').textContent = bpm;
  document.getElementById('swing').value = swing;
  document.getElementById('swingValue').textContent = swing + '%';
  document.getElementById('beatName').value = name;
  updateUI();
  applyPatternEffects(currentPattern);
  
  // Update track volume sliders
  trackConfig.forEach(track => {
    const container = document.querySelector(`[data-track="${track.name}"]`);
    if (container) {
      const volumeSlider = container.querySelector('.volume-slider');
      const volumeValue = container.querySelector('.volume-value');
      const vol = Math.round((trackVolumes[track.name] || 0.8) * 100);
      if (volumeSlider) volumeSlider.value = vol;
      if (volumeValue) volumeValue.textContent = vol;
    }
  });
  
  // Reset dropdown to placeholder
  document.getElementById('savedBeats').value = '';
};

// Export audio as WAV
let selectedExportFormat = 'wav';

document.getElementById('exportAudio').onclick = () => {
  const exportModal = document.getElementById('exportModal');
  
  // Update info
  const activePatterns = patternSequence.filter(p => p !== '');
  const patternInfo = activePatterns.length > 0 
    ? `${activePatterns.length} patterns in sequence` 
    : `Pattern ${currentPattern} only`;
  
  document.getElementById('exportInfo').innerHTML = `
    <div>${patternInfo}</div>
    <div>BPM: ${bpm} • Steps: ${steps}</div>
  `;
  
  exportModal.style.display = 'flex';
};

// Close export modal
document.getElementById('closeExportModal').onclick = () => {
  document.getElementById('exportModal').style.display = 'none';
};

// Handle format selection
document.querySelectorAll('.format-option').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.format-option').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedExportFormat = btn.dataset.format;
  };
});

// Handle export option clicks
document.querySelectorAll('.export-option').forEach(btn => {
  btn.onclick = async () => {
    const loops = parseInt(btn.dataset.loops);
    const format = selectedExportFormat;
    document.getElementById('exportModal').style.display = 'none';
    
    const name = document.getElementById('beatName').value.trim() || 'MyBeat';
    const exportBtn = document.getElementById('exportAudio');
    const originalText = exportBtn.textContent;
    
    try {
      exportBtn.textContent = `Rendering ${loops}x...`;
      exportBtn.disabled = true;
      
      // Calculate duration based on pattern sequence or single pattern
      const activePatternsForRender = patternSequence.filter(p => p !== '');
      const numPatterns = activePatternsForRender.length > 0 ? activePatternsForRender.length : 1;
      const beatsPerPattern = steps;
      const secondsPerBeat = 60 / bpm / 4; // 16th notes
      const singleLoopDuration = numPatterns * beatsPerPattern * secondsPerBeat;
      const duration = (singleLoopDuration * loops) + 0.5; // Add tail for decay
      
      // Create offline audio context for rendering
      const sampleRate = 44100;
      const offlineCtx = new OfflineAudioContext(2, sampleRate * duration, sampleRate);
      
      // Create master gain for offline context
      const offlineMaster = offlineCtx.createGain();
      offlineMaster.gain.value = 0.8;
      offlineMaster.connect(offlineCtx.destination);
      
      // Render each loop
      const patternsToRender = activePatternsForRender.length > 0 ? activePatternsForRender : [currentPattern];
      let currentTime = 0;
      
      for (let loop = 0; loop < loops; loop++) {
        for (let patIdx = 0; patIdx < patternsToRender.length; patIdx++) {
          const patternKey = patternsToRender[patIdx];
          const pattern = patterns[patternKey];
          
          for (let step = 0; step < steps; step++) {
            const isOddStep = step % 2 === 1;
            const swingOffset = isOddStep ? (swing / 100) * secondsPerBeat * 0.5 : 0;
            const stepTime = currentTime + (step * secondsPerBeat) + swingOffset;
            
            // Play each track
            trackConfig.forEach(track => {
              if (pattern[track.name] && pattern[track.name][step]) {
                const burstCount = (patternBurst[patternKey] && patternBurst[patternKey][track.name] && patternBurst[patternKey][track.name][step]) || 1;
                
                if (burstCount <= 1) {
                  renderSoundOffline(offlineCtx, offlineMaster, track.name, stepTime, trackVolumes[track.name]);
                } else {
                  const subInterval = secondsPerBeat / burstCount;
                  for (let b = 0; b < burstCount; b++) {
                    renderSoundOffline(offlineCtx, offlineMaster, track.name, stepTime + (b * subInterval), trackVolumes[track.name]);
                  }
                }
              }
            });
          }
          
          currentTime += steps * secondsPerBeat;
        }
      }
      
      // Render to buffer
      const renderedBuffer = await offlineCtx.startRendering();
      
      let blob;
      let extension;
      
      if (format === 'mp3') {
        exportBtn.textContent = 'Encoding MP3...';
        blob = await bufferToMp3(renderedBuffer);
        extension = 'mp3';
      } else {
        blob = bufferToWav(renderedBuffer);
        extension = 'wav';
      }
      
      // Download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name}.${extension}`;
      a.click();
      URL.revokeObjectURL(url);
      
      if (window.firebaseLogEvent) window.firebaseLogEvent('export_beat', { format: extension, beat_name: name });
      
      exportBtn.textContent = 'Exported!';
      setTimeout(() => {
        exportBtn.textContent = originalText;
        exportBtn.disabled = false;
      }, 2000);
      
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed: ' + error.message);
      exportBtn.textContent = originalText;
      exportBtn.disabled = false;
    }
  };
});

// Render sound to offline context
function renderSoundOffline(ctx, master, trackName, time, volume) {
  const soundVariant = trackSounds[trackName];
  
  switch(soundVariant) {
    case 'kick1': {
      const sampleRate = ctx.sampleRate;
      const duration = 0.15;
      const bufferLen = Math.floor(sampleRate * duration);
      const buffer = ctx.createBuffer(1, bufferLen, sampleRate);
      const data = buffer.getChannelData(0);
      let phase = 0;
      for (let i = 0; i < bufferLen; i++) {
        const t = i / sampleRate;
        let freq;
        if (t < 0.05) {
          freq = 180 * Math.pow(50 / 180, t / 0.05);
        } else {
          freq = 50 * Math.pow(40 / 50, (t - 0.05) / 0.1);
        }
        let amp;
        if (t < 0.02) {
          amp = 1.2 - (0.5 * t / 0.02);
        } else {
          amp = 0.7 * Math.exp(-((t - 0.02) / 0.03));
        }
        phase += (2 * Math.PI * freq) / sampleRate;
        let sample = Math.sin(phase) * amp;
        if (t < 0.015) {
          const clickFreq = 800 * Math.pow(100 / 800, t / 0.01);
          const clickAmp = 0.5 * Math.exp(-t / 0.003);
          sample += (Math.sin(2 * Math.PI * clickFreq * t) > 0 ? 1 : -1) * clickAmp;
        }
        data[i] = sample * volume;
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(master);
      source.start(time);
      break;
    }
    case 'kick2': {
      const sampleRate = ctx.sampleRate;
      const duration = 0.25;
      const bufferLen = Math.floor(sampleRate * duration);
      const buffer = ctx.createBuffer(1, bufferLen, sampleRate);
      const data = buffer.getChannelData(0);
      let phase = 0;
      for (let i = 0; i < bufferLen; i++) {
        const t = i / sampleRate;
        let freq;
        if (t < 0.08) {
          freq = 150 * Math.pow(35 / 150, t / 0.08);
        } else {
          freq = 35 * Math.pow(25 / 35, (t - 0.08) / 0.12);
        }
        let amp;
        if (t < 0.05) {
          amp = 1.5 - (0.7 * t / 0.05);
        } else {
          amp = 0.8 * Math.exp(-((t - 0.05) / 0.05));
        }
        phase += (2 * Math.PI * freq) / sampleRate;
        let sample = Math.sin(phase) * amp;
        if (t < 0.03) {
          const clickFreq = 400 * Math.pow(60 / 400, t / 0.02);
          const clickAmp = 0.8 * Math.exp(-t / 0.006);
          const clickPhase = (2 * clickFreq * t) % 1;
          sample += (clickPhase < 0.5 ? 4 * clickPhase - 1 : 3 - 4 * clickPhase) * clickAmp;
        }
        data[i] = sample * volume;
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(master);
      source.start(time);
      break;
    }
    case 'snare1': {
      // Punchy snare with body + snap
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200, time);
      osc.frequency.exponentialRampToValueAtTime(80, time + 0.03);
      oscGain.gain.setValueAtTime(volume * 0.8, time);
      oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
      osc.connect(oscGain).connect(master);
      osc.start(time);
      osc.stop(time + 0.08);
      
      const noise = ctx.createBufferSource();
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      noise.buffer = buffer;
      const highpass = ctx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.value = 2000;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(volume * 0.7, time);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
      noise.connect(highpass).connect(noiseGain).connect(master);
      noise.start(time);
      break;
    }
    case 'snare2': {
      // Tight electronic snare - punchy but bright
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, time);
      osc.frequency.exponentialRampToValueAtTime(160, time + 0.025);
      oscGain.gain.setValueAtTime(volume * 0.5, time);
      oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
      osc.connect(oscGain).connect(master);
      osc.start(time);
      osc.stop(time + 0.05);
      
      const noise = ctx.createBufferSource();
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.12, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.02));
      }
      noise.buffer = buffer;
      
      const highpass = ctx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.value = 1500;
      
      const peak = ctx.createBiquadFilter();
      peak.type = 'peaking';
      peak.frequency.value = 3500;
      peak.Q.value = 2;
      peak.gain.value = 8;
      
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(volume * 0.9, time);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
      
      noise.connect(highpass).connect(peak).connect(noiseGain).connect(master);
      noise.start(time);
      break;
    }
    case 'hat1': {
      // TR-808 style closed hi-hat (offline)
      const fundamental = 40;
      const ratios = [2, 3, 4.16, 5.43, 6.79, 8.21];
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 10000;
      bandpass.Q.value = 1.2;
      const highpass = ctx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.value = 7000;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume * 0.45, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.025);
      bandpass.connect(highpass).connect(gain).connect(master);
      ratios.forEach(ratio => {
        const osc = ctx.createOscillator();
        osc.type = 'square';
        osc.frequency.value = fundamental * ratio;
        osc.connect(bandpass);
        osc.start(time);
        osc.stop(time + 0.03);
      });
      break;
    }
    case 'hat2': {
      // Darker closed hi-hat (offline)
      const fundamental = 38;
      const ratios = [2.1, 3.05, 4.2, 5.55, 6.9, 8.35];
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 8500;
      bandpass.Q.value = 1.0;
      const highpass = ctx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.value = 6000;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume * 0.4, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
      bandpass.connect(highpass).connect(gain).connect(master);
      ratios.forEach(ratio => {
        const osc = ctx.createOscillator();
        osc.type = 'square';
        osc.frequency.value = fundamental * ratio;
        osc.connect(bandpass);
        osc.start(time);
        osc.stop(time + 0.05);
      });
      break;
    }
    case 'clap1': {
      // Punchy clap with attack transient
      const click = ctx.createOscillator();
      const clickGain = ctx.createGain();
      click.type = 'square';
      click.frequency.value = 1500;
      clickGain.gain.setValueAtTime(volume * 0.3, time);
      clickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.008);
      click.connect(clickGain).connect(master);
      click.start(time);
      click.stop(time + 0.01);
      
      const numLayers = 4;
      for (let layer = 0; layer < numLayers; layer++) {
        const noise = ctx.createBufferSource();
        const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.02));
        }
        noise.buffer = buffer;
        const bandpass = ctx.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.value = 1200 + layer * 400;
        bandpass.Q.value = 1.2;
        const gain = ctx.createGain();
        const layerDelay = layer * 0.006;
        gain.gain.setValueAtTime(volume * 0.7, time + layerDelay);
        gain.gain.exponentialRampToValueAtTime(0.001, time + layerDelay + 0.1);
        noise.connect(bandpass).connect(gain).connect(master);
        noise.start(time + layerDelay);
      }
      break;
    }
    case 'clap2': {
      // Tight punchy clap
      const click = ctx.createOscillator();
      const clickGain = ctx.createGain();
      click.type = 'square';
      click.frequency.value = 2000;
      clickGain.gain.setValueAtTime(volume * 0.35, time);
      clickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.006);
      click.connect(clickGain).connect(master);
      click.start(time);
      click.stop(time + 0.008);
      
      for (let hit = 0; hit < 3; hit++) {
        const noise = ctx.createBufferSource();
        const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.07, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.01));
        }
        noise.buffer = buffer;
        const bandpass = ctx.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.value = 1600;
        bandpass.Q.value = 1.5;
        const highshelf = ctx.createBiquadFilter();
        highshelf.type = 'highshelf';
        highshelf.frequency.value = 3000;
        highshelf.gain.value = 5;
        const gain = ctx.createGain();
        const hitDelay = hit * 0.012;
        gain.gain.setValueAtTime(volume * 0.75, time + hitDelay);
        gain.gain.exponentialRampToValueAtTime(0.001, time + hitDelay + 0.06);
        noise.connect(bandpass).connect(highshelf).connect(gain).connect(master);
        noise.start(time + hitDelay);
      }
      break;
    }
    case 'openhat1': {
      const bufferSize = ctx.sampleRate * 0.25;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const highpass = ctx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.value = 7000;
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 10000;
      bandpass.Q.value = 1;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume * 0.5, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
      noise.connect(highpass).connect(bandpass).connect(gain).connect(master);
      noise.start(time);
      noise.stop(time + 0.25);
      break;
    }
    case 'openhat2': {
      const bufferSize = ctx.sampleRate * 0.35;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const highpass = ctx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.value = 6000;
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 9000;
      bandpass.Q.value = 0.8;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume * 0.45, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
      noise.connect(highpass).connect(bandpass).connect(gain).connect(master);
      noise.start(time);
      noise.stop(time + 0.35);
      break;
    }
    case 'rim1': {
      // Rimshot
      const noise = ctx.createBufferSource();
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.03, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      noise.buffer = buffer;
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 1500;
      bandpass.Q.value = 3;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(volume * 1.2, time);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);
      noise.connect(bandpass).connect(noiseGain).connect(master);
      noise.start(time);
      
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, time);
      osc.frequency.exponentialRampToValueAtTime(150, time + 0.015);
      oscGain.gain.setValueAtTime(volume * 0.4, time);
      oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.025);
      osc.connect(oscGain).connect(master);
      osc.start(time);
      osc.stop(time + 0.025);
      break;
    }
    case 'rim2': {
      // Sidestick
      const noise = ctx.createBufferSource();
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.025, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      noise.buffer = buffer;
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 2200;
      bandpass.Q.value = 4;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(volume * 1.0, time);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.02);
      noise.connect(bandpass).connect(noiseGain).connect(master);
      noise.start(time);
      break;
    }
    case 'tom1': {
      const osc = ctx.createOscillator();
      osc.frequency.setValueAtTime(200, time);
      osc.frequency.exponentialRampToValueAtTime(80, time + 0.2);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume * 0.9, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
      osc.connect(gain).connect(master);
      osc.start(time);
      osc.stop(time + 0.2);
      break;
    }
    case 'tom2': {
      const osc = ctx.createOscillator();
      osc.frequency.setValueAtTime(150, time);
      osc.frequency.exponentialRampToValueAtTime(60, time + 0.3);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume * 0.9, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
      osc.connect(gain).connect(master);
      osc.start(time);
      osc.stop(time + 0.3);
      break;
    }
  }
}

// Convert AudioBuffer to WAV Blob
function bufferToWav(buffer) {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  
  const dataLength = buffer.length * blockAlign;
  const bufferLength = 44 + dataLength;
  
  const arrayBuffer = new ArrayBuffer(bufferLength);
  const view = new DataView(arrayBuffer);
  
  // WAV header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // fmt chunk size
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true);
  
  // Write audio data
  const channels = [];
  for (let i = 0; i < numChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }
  
  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, channels[ch][i]));
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }
  
  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

// MP3 encoding using lamejs
async function bufferToMp3(buffer) {
  // Load lamejs if not already loaded
  if (typeof lamejs === 'undefined') {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/lamejs/1.2.1/lame.min.js');
  }
  
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const kbps = 192; // MP3 bitrate
  
  const mp3encoder = new lamejs.Mp3Encoder(numChannels, sampleRate, kbps);
  const mp3Data = [];
  
  // Get audio data
  const left = buffer.getChannelData(0);
  const right = numChannels > 1 ? buffer.getChannelData(1) : left;
  
  // Convert float32 to int16
  const leftInt = new Int16Array(left.length);
  const rightInt = new Int16Array(right.length);
  
  for (let i = 0; i < left.length; i++) {
    leftInt[i] = Math.max(-32768, Math.min(32767, Math.floor(left[i] * 32767)));
    rightInt[i] = Math.max(-32768, Math.min(32767, Math.floor(right[i] * 32767)));
  }
  
  // Encode in chunks
  const sampleBlockSize = 1152;
  for (let i = 0; i < leftInt.length; i += sampleBlockSize) {
    const leftChunk = leftInt.subarray(i, i + sampleBlockSize);
    const rightChunk = rightInt.subarray(i, i + sampleBlockSize);
    const mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk);
    if (mp3buf.length > 0) {
      mp3Data.push(mp3buf);
    }
  }
  
  // Finish encoding
  const mp3buf = mp3encoder.flush();
  if (mp3buf.length > 0) {
    mp3Data.push(mp3buf);
  }
  
  return new Blob(mp3Data, { type: 'audio/mp3' });
}

// Helper to load external scripts
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

updateBeatDropdown();

// ============ WALLET CONNECTION ============
let connectedWallet = null;
let walletAddress = null;
let solanaConnection = null;

const walletBtn = document.getElementById('walletBtn');
const walletModal = document.getElementById('walletModal');
const closeModal = document.getElementById('closeModal');
const walletStatus = document.getElementById('walletStatus');
const walletInfo = document.getElementById('walletInfo');
const solBalanceEl = document.getElementById('solBalance');
const airdropBtn = document.getElementById('airdropBtn');

// Initialize Solana connection
function initSolanaConnection() {
  // Always create fresh connection to avoid caching issues
  const urlParams = new URLSearchParams(window.location.search);
  const useDevnet = urlParams.get('devnet') === 'true';
  
  // Use public RPC endpoints (no API key needed)
  const endpoint = useDevnet 
    ? 'https://api.devnet.solana.com'
    : 'https://solana-rpc.publicnode.com';
  
  console.log('Connecting to:', useDevnet ? 'devnet' : 'mainnet', endpoint);
  
  solanaConnection = new solanaWeb3.Connection(endpoint, 'confirmed');
  return solanaConnection;
}

// Fetch and display SOL balance
async function updateSolBalance() {
  if (!walletAddress) {
    walletInfo.style.display = 'none';
    return;
  }
  
  try {
    const connection = initSolanaConnection();
    const publicKey = new solanaWeb3.PublicKey(walletAddress);
    console.log('Fetching balance for:', walletAddress);
    const balance = await connection.getBalance(publicKey);
    console.log('Raw balance (lamports):', balance);
    const solBalance = balance / solanaWeb3.LAMPORTS_PER_SOL;
    console.log('SOL balance:', solBalance);
    
    // Show at least 4 decimal places, or more if needed
    if (solBalance > 0 && solBalance < 0.0001) {
      solBalanceEl.textContent = solBalance.toFixed(6);
    } else {
      solBalanceEl.textContent = solBalance.toFixed(4);
    }
    walletInfo.style.display = 'flex';
    
    console.log('Balance updated:', solBalance, 'SOL');
  } catch (error) {
    console.error('Error fetching balance:', error);
    solBalanceEl.textContent = '-.--';
    walletInfo.style.display = 'flex';
  }
}

// Request devnet airdrop
async function requestAirdrop() {
  if (!walletAddress) {
    alert('Please connect your wallet first!');
    return;
  }
  
  airdropBtn.disabled = true;
  airdropBtn.classList.add('loading');
  airdropBtn.textContent = '⏳ Requesting...';
  
  try {
    const connection = initSolanaConnection();
    const publicKey = new solanaWeb3.PublicKey(walletAddress);
    
    // Request 1 SOL airdrop
    const signature = await connection.requestAirdrop(
      publicKey,
      1 * solanaWeb3.LAMPORTS_PER_SOL
    );
    
    airdropBtn.textContent = '⏳ Confirming...';
    
    // Wait for confirmation
    const latestBlockhash = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
      signature,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
    });
    
    // Update balance after airdrop
    await updateSolBalance();
    
    airdropBtn.textContent = '✅ Success!';
    setTimeout(() => {
      airdropBtn.textContent = '💧 Airdrop';
      airdropBtn.disabled = false;
      airdropBtn.classList.remove('loading');
    }, 2000);
    
    console.log('Airdrop successful! Signature:', signature);
    
  } catch (error) {
    console.error('Airdrop error:', error);
    
    let errorMsg = 'Failed';
    if (error.message?.includes('429') || error.message?.includes('rate')) {
      errorMsg = 'Rate limited';
    } else if (error.message?.includes('airdrop')) {
      errorMsg = 'Try again later';
    }
    
    airdropBtn.textContent = '❌ ' + errorMsg;
    setTimeout(() => {
      airdropBtn.textContent = '💧 Airdrop';
      airdropBtn.disabled = false;
      airdropBtn.classList.remove('loading');
    }, 3000);
  }
}

// Airdrop button click handler
airdropBtn.onclick = requestAirdrop;

// Open modal
walletBtn.onclick = () => {
  if (connectedWallet) {
    if (confirm('Disconnect wallet?')) {
      disconnectWallet();
    }
  } else {
    walletModal.classList.add('show');
  }
};

// Close modal
closeModal.onclick = () => {
  walletModal.classList.remove('show');
  walletStatus.className = 'wallet-status';
  walletStatus.textContent = '';
};

// Close modal when clicking outside
walletModal.onclick = (e) => {
  if (e.target === walletModal) {
    walletModal.classList.remove('show');
    walletStatus.className = 'wallet-status';
    walletStatus.textContent = '';
  }
};

// Wallet option click handlers
document.querySelectorAll('.wallet-option').forEach(option => {
  option.onclick = async () => {
    const walletType = option.dataset.wallet;
    await connectWallet(walletType);
  };
});

// Connect wallet function
async function connectWallet(walletType) {
  walletStatus.className = 'wallet-status';
  walletStatus.textContent = 'Connecting...';
  walletStatus.style.display = 'block';
  
  try {
    // Check if Solana Web3 is loaded
    if (typeof solanaWeb3 === 'undefined') {
      throw new Error('Solana Web3 library not loaded. Please refresh the page.');
    }
    
    let provider = null;
    
    if (walletType === 'seedvault') {
      if (window.solana && window.solana.isSeedVault) {
        provider = window.solana;
      } else {
        throw new Error('Seed Vault not found. Please make sure you are using a Solana Mobile device.');
      }
    } else if (walletType === 'phantom') {
      if (window.phantom?.solana) {
        provider = window.phantom.solana;
      } else if (window.solana && window.solana.isPhantom) {
        provider = window.solana;
      } else {
        throw new Error('Phantom not detected.\n\n📱 On mobile? Save your beat, then open mpseeker.app in Phantom\'s browser to connect & mint.');
      }
    } else if (walletType === 'solflare') {
      if (window.solflare) {
        provider = window.solflare;
      } else {
        throw new Error('Solflare not detected.\n\n📱 On mobile? Save your beat, then open mpseeker.app in Solflare\'s browser to connect & mint.');
      }
    }
    
    if (!provider) {
      throw new Error('Wallet not available');
    }
    
    console.log('Connecting to', walletType, '...');
    
    // Solflare needs special handling
    if (walletType === 'solflare') {
      try {
        await provider.connect();
      } catch (e) {
        console.log('Solflare connect response:', e);
      }
      
      // Wait a moment for Solflare to set publicKey
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (provider.publicKey) {
        walletAddress = provider.publicKey.toString();
      } else {
        throw new Error('Could not get wallet address from Solflare');
      }
    } else {
      // Phantom and Seed Vault
      const response = await provider.connect();
      
      if (response && response.publicKey) {
        walletAddress = response.publicKey.toString();
      } else if (provider.publicKey) {
        walletAddress = provider.publicKey.toString();
      } else {
        throw new Error('Could not get wallet address');
      }
    }
    
    connectedWallet = walletType;
    console.log('Connected! Address:', walletAddress);
    
    const shortAddress = walletAddress.slice(0, 4) + '...' + walletAddress.slice(-4);
    walletBtn.textContent = shortAddress;
    walletBtn.classList.add('connected');
    
    walletStatus.className = 'wallet-status success';
    walletStatus.textContent = 'Connected successfully!';
    
    // Fetch and display balance (with error handling)
    try {
      await updateSolBalance();
    } catch (balanceError) {
      console.error('Balance fetch error:', balanceError);
      // Don't fail the whole connection if balance fails
    }
    
    setTimeout(() => {
      walletModal.classList.remove('show');
      walletStatus.className = 'wallet-status';
    }, 1500);
    
    console.log('Connected to', walletType, 'Address:', walletAddress);
    if (window.firebaseLogEvent) window.firebaseLogEvent('wallet_connect', { wallet_type: walletType });
    
  } catch (error) {
    console.error('Wallet connection error:', error);
    walletStatus.className = 'wallet-status error';
    
    // More specific error messages
    let errorMsg = error.message || 'Failed to connect wallet';
    if (error.code === 4001) {
      errorMsg = 'Connection rejected by user';
    } else if (error.message?.includes('User rejected')) {
      errorMsg = 'Connection rejected by user';
    }
    
    walletStatus.textContent = errorMsg;
  }
}

// Disconnect wallet function
async function disconnectWallet() {
  // Actually disconnect from the wallet provider
  try {
    if (connectedWallet === 'phantom' && window.phantom?.solana) {
      await window.phantom.solana.disconnect();
    } else if (connectedWallet === 'solflare' && window.solflare) {
      await window.solflare.disconnect();
    } else if (window.solana) {
      await window.solana.disconnect();
    }
  } catch (e) {
    console.log('Disconnect error (ignoring):', e);
  }
  
  connectedWallet = null;
  walletAddress = null;
  walletBtn.textContent = 'Connect Wallet';
  walletBtn.classList.remove('connected');
  walletInfo.style.display = 'none';
  solBalanceEl.textContent = '0.00';
  console.log('Wallet disconnected');
}

// Check if wallet was previously connected (auto-reconnect)
async function checkExistingConnection() {
  if (window.phantom?.solana?.isConnected) {
    try {
      const response = await window.phantom.solana.connect({ onlyIfTrusted: true });
      walletAddress = response.publicKey.toString();
      connectedWallet = 'phantom';
      const shortAddress = walletAddress.slice(0, 4) + '...' + walletAddress.slice(-4);
      walletBtn.textContent = shortAddress;
      walletBtn.classList.add('connected');
      await updateSolBalance();
    } catch (e) {
      // Silent fail
    }
  }
  else if (window.solflare?.isConnected && window.solflare?.publicKey) {
    try {
      walletAddress = window.solflare.publicKey.toString();
      connectedWallet = 'solflare';
      const shortAddress = walletAddress.slice(0, 4) + '...' + walletAddress.slice(-4);
      walletBtn.textContent = shortAddress;
      walletBtn.classList.add('connected');
      await updateSolBalance();
    } catch (e) {
      // Silent fail
    }
  }
}

setTimeout(checkExistingConnection, 500);

// ============ NFT MINTING ============
// Check URL for devnet override (?devnet=true)
const urlParams = new URLSearchParams(window.location.search);
const useDevnet = urlParams.get('devnet') === 'true';
const SOLANA_NETWORK = useDevnet ? 'devnet' : 'mainnet-beta';

// Show airdrop button if on devnet
if (useDevnet) {
  const airdropBtn = document.getElementById('airdropBtn');
  if (airdropBtn) airdropBtn.style.display = 'inline-flex';
  console.log('🔧 DEVNET MODE ENABLED');
}

const mintStatus = document.getElementById('mintStatus');
const mintOutput = document.getElementById('mintOutput');

// NFT.Storage API key (free tier - get yours at nft.storage)
// For production, you should use your own API key
// Upload to IPFS via Pinata
// PINATA_JWT removed for security - will be moved to backend proxy when minting is enabled
const PINATA_JWT = '';

// Generate beat visualization as canvas image
function generateBeatImage(beatData) {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');
  
  // Background gradient
  const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  bgGradient.addColorStop(0, '#0A0A0A');
  bgGradient.addColorStop(1, '#1a0a2e');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Title
  ctx.fillStyle = '#14F195';
  ctx.font = 'bold 36px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(beatData.name, canvas.width / 2, 50);
  
  // Subtitle
  ctx.fillStyle = '#888';
  ctx.font = '18px Arial';
  ctx.fillText(`${beatData.bpm} BPM • ${beatData.swing}% Swing`, canvas.width / 2, 80);
  
  // Track colors
  const trackColors = {
    kick: '#9945FF',
    snare: '#00FFC3',
    hat: '#14F195',
    clap: '#FF6B9D',
    openhat: '#FFD700',
    rim: '#00BFFF',
    tom: '#FF8C00'
  };
  
  const tracks = Object.keys(beatData.patterns.A);
  const cellWidth = 40;
  const cellHeight = 35;
  const startX = (canvas.width - (16 * cellWidth + 15 * 4)) / 2;
  const startY = 120;
  
  // Draw pattern grid for Pattern A (primary)
  ctx.fillStyle = '#9945FF';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('Pattern A', startX, startY - 10);
  
  tracks.forEach((track, trackIndex) => {
    const y = startY + trackIndex * (cellHeight + 8);
    
    // Track label
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(track.toUpperCase(), startX - 10, y + cellHeight / 2 + 4);
    
    // Steps
    for (let step = 0; step < 16; step++) {
      const x = startX + step * (cellWidth + 4);
      const isActive = beatData.patterns.A[track][step];
      
      // Cell background
      ctx.fillStyle = isActive ? trackColors[track] : '#1a1a1a';
      ctx.beginPath();
      ctx.roundRect(x, y, cellWidth, cellHeight, 4);
      ctx.fill();
      
      // Cell border
      ctx.strokeStyle = isActive ? trackColors[track] : '#333';
      ctx.lineWidth = isActive ? 2 : 1;
      ctx.stroke();
      
      // Glow effect for active cells
      if (isActive) {
        ctx.shadowColor = trackColors[track];
        ctx.shadowBlur = 10;
        ctx.fillStyle = trackColors[track];
        ctx.beginPath();
        ctx.roundRect(x, y, cellWidth, cellHeight, 4);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  });
  
  // Footer
  const footerY = canvas.height - 40;
  ctx.fillStyle = '#444';
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Created with MPSeeker', canvas.width / 2, footerY);
  
  // Solana logo hint
  ctx.fillStyle = '#9945FF';
  ctx.font = 'bold 14px Arial';
  ctx.fillText('◎ Solana NFT', canvas.width / 2, footerY + 25);
  
  return canvas.toDataURL('image/png');
}

// Upload to IPFS via Pinata
async function uploadToIPFS(data, filename, contentType = 'application/json') {
  let blob;
  
  if (contentType === 'image/png') {
    // Convert base64 data URL to blob
    const base64Data = data.split(',')[1];
    const binaryData = atob(base64Data);
    const arrayBuffer = new ArrayBuffer(binaryData.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < binaryData.length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i);
    }
    blob = new Blob([uint8Array], { type: contentType });
  } else {
    blob = new Blob([JSON.stringify(data)], { type: contentType });
  }
  
  const formData = new FormData();
  formData.append('file', blob, filename);
  
  const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PINATA_JWT}`
    },
    body: formData
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`IPFS upload failed: ${errorText}`);
  }
  
  const result = await response.json();
  console.log('Pinata upload success:', result);
  // Return gateway URL that works in wallets
  return `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
}

// Alternative: Use a free public IPFS pinning service
async function uploadToIPFSFallback(data, isImage = false) {
  // Convert data to JSON string for non-image data
  const content = isImage ? data : JSON.stringify(data);
  
  // Use web3.storage or similar free service
  // For now, we'll use a base64 data URI as fallback but store the full data
  if (isImage) {
    return data; // Return the data URL directly
  }
  
  // For JSON metadata, encode as data URI (fallback)
  return 'data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(data))));
}

// ============ TOKEN METADATA HELPERS ============
// Token Metadata Program ID
const TOKEN_METADATA_PROGRAM_ID = new solanaWeb3.PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

// Get Associated Token Address
async function getAssociatedTokenAddress(mint, owner) {
  const [address] = solanaWeb3.PublicKey.findProgramAddressSync(
    [
      owner.toBuffer(),
      splToken.TOKEN_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    splToken.ASSOCIATED_TOKEN_PROGRAM_ID
  );
  return address;
}

// Parse Metadata Account Data
function parseMetadataAccount(data) {
  // Metadata account structure (Token Metadata v1.1+):
  // - key: u8 (1 byte) - MetadataKey enum
  // - update_authority: Pubkey (32 bytes)
  // - mint: Pubkey (32 bytes)
  // - data: Data struct
  //   - name: String (4 bytes length + 32 bytes padded data)
  //   - symbol: String (4 bytes length + 10 bytes padded data)  
  //   - uri: String (4 bytes length + 200 bytes padded data)
  //   - seller_fee_basis_points: u16
  //   - creators: Option<Vec<Creator>>
  // ... more fields
  
  try {
    let offset = 1; // Skip key byte
    
    // Skip update authority (32 bytes)
    offset += 32;
    
    // Skip mint (32 bytes)
    offset += 32;
    
    // Read name (4 byte length + up to 32 bytes of data)
    const nameLength = data.readUInt32LE(offset);
    offset += 4;
    // Name is stored in a fixed 32-byte field
    const nameBytes = data.slice(offset, offset + Math.min(nameLength, 32));
    const name = nameBytes.toString('utf8').replace(/\0/g, '').trim();
    offset += 32; // Always skip 32 bytes for name field
    
    // Read symbol (4 byte length + up to 10 bytes of data)
    const symbolLength = data.readUInt32LE(offset);
    offset += 4;
    // Symbol is stored in a fixed 10-byte field
    const symbolBytes = data.slice(offset, offset + Math.min(symbolLength, 10));
    const symbol = symbolBytes.toString('utf8').replace(/\0/g, '').trim();
    offset += 10; // Always skip 10 bytes for symbol field
    
    // Read URI (4 byte length + up to 200 bytes of data)
    const uriLength = data.readUInt32LE(offset);
    offset += 4;
    // URI is stored in a fixed 200-byte field
    const uriBytes = data.slice(offset, offset + Math.min(uriLength, 200));
    const uri = uriBytes.toString('utf8').replace(/\0/g, '').trim();
    
    console.log('Parsed metadata - Name:', name, 'Symbol:', symbol, 'URI:', uri);
    
    return {
      name: name,
      symbol: symbol,
      uri: uri
    };
  } catch (error) {
    console.error('Error parsing metadata:', error);
    throw new Error('Failed to parse NFT metadata from blockchain');
  }
}

// Create Metadata Account V3 Instruction
function createMetadataAccountV3Instruction(
  metadataAccount,
  mint,
  mintAuthority,
  payer,
  updateAuthority,
  data,
  isMutable,
  collectionDetails
) {
  const keys = [
    { pubkey: metadataAccount, isSigner: false, isWritable: true },
    { pubkey: mint, isSigner: false, isWritable: false },
    { pubkey: mintAuthority, isSigner: true, isWritable: false },
    { pubkey: payer, isSigner: true, isWritable: true },
    { pubkey: updateAuthority, isSigner: false, isWritable: false },
    { pubkey: solanaWeb3.SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: solanaWeb3.SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
  ];

  // Serialize the CreateMetadataAccountArgsV3
  const nameBuffer = Buffer.alloc(36);
  nameBuffer.write(data.name);
  
  const symbolBuffer = Buffer.alloc(14);
  symbolBuffer.write(data.symbol);
  
  const uriBuffer = Buffer.alloc(204);
  uriBuffer.write(data.uri);
  
  // Build instruction data
  const instructionData = Buffer.concat([
    Buffer.from([33]), // CreateMetadataAccountV3 discriminator
    // Data struct
    Buffer.from([data.name.length, 0, 0, 0]), // name length (u32 le)
    Buffer.from(data.name),
    Buffer.from([data.symbol.length, 0, 0, 0]), // symbol length (u32 le)
    Buffer.from(data.symbol),
    Buffer.from([data.uri.length, 0, 0, 0, 0]), // uri length (u32 le, but we need padding)
  ]);
  
  // Simplified: Use a pre-built buffer approach
  const buffer = Buffer.alloc(1 + 4 + 32 + 4 + 10 + 4 + 200 + 2 + 1 + 1 + 34 + 2 + 2 + 1 + 1);
  let offset = 0;
  
  // Instruction discriminator (33 for CreateMetadataAccountV3)
  buffer.writeUInt8(33, offset);
  offset += 1;
  
  // Name (length-prefixed string)
  const nameBytes = Buffer.from(data.name.slice(0, 32));
  buffer.writeUInt32LE(nameBytes.length, offset);
  offset += 4;
  nameBytes.copy(buffer, offset);
  offset += nameBytes.length;
  
  // Symbol (length-prefixed string)
  const symbolBytes = Buffer.from(data.symbol.slice(0, 10));
  buffer.writeUInt32LE(symbolBytes.length, offset);
  offset += 4;
  symbolBytes.copy(buffer, offset);
  offset += symbolBytes.length;
  
  // URI (length-prefixed string)
  const uriBytes = Buffer.from(data.uri.slice(0, 200));
  buffer.writeUInt32LE(uriBytes.length, offset);
  offset += 4;
  uriBytes.copy(buffer, offset);
  offset += uriBytes.length;
  
  // Seller fee basis points (u16)
  buffer.writeUInt16LE(data.sellerFeeBasisPoints, offset);
  offset += 2;
  
  // Creators (Option<Vec<Creator>>)
  if (data.creators && data.creators.length > 0) {
    buffer.writeUInt8(1, offset); // Some
    offset += 1;
    buffer.writeUInt32LE(data.creators.length, offset); // Vec length
    offset += 4;
    
    for (const creator of data.creators) {
      creator.address.toBuffer().copy(buffer, offset);
      offset += 32;
      buffer.writeUInt8(creator.verified ? 1 : 0, offset);
      offset += 1;
      buffer.writeUInt8(creator.share, offset);
      offset += 1;
    }
  } else {
    buffer.writeUInt8(0, offset); // None
    offset += 1;
  }
  
  // Collection (Option<Collection>) - None
  buffer.writeUInt8(0, offset);
  offset += 1;
  
  // Uses (Option<Uses>) - None
  buffer.writeUInt8(0, offset);
  offset += 1;
  
  // isMutable
  buffer.writeUInt8(isMutable ? 1 : 0, offset);
  offset += 1;
  
  // CollectionDetails (Option<CollectionDetails>) - None
  buffer.writeUInt8(0, offset);
  offset += 1;

  return new solanaWeb3.TransactionInstruction({
    keys,
    programId: TOKEN_METADATA_PROGRAM_ID,
    data: buffer.slice(0, offset),
  });
}

// Create Master Edition V3 Instruction
function createMasterEditionV3Instruction(
  masterEdition,
  mint,
  updateAuthority,
  mintAuthority,
  payer,
  metadata,
  maxSupply
) {
  const keys = [
    { pubkey: masterEdition, isSigner: false, isWritable: true },
    { pubkey: mint, isSigner: false, isWritable: true },
    { pubkey: updateAuthority, isSigner: true, isWritable: false },
    { pubkey: mintAuthority, isSigner: true, isWritable: false },
    { pubkey: payer, isSigner: true, isWritable: true },
    { pubkey: metadata, isSigner: false, isWritable: true },
    { pubkey: splToken.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    { pubkey: solanaWeb3.SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: solanaWeb3.SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
  ];

  // CreateMasterEditionV3 instruction
  // Discriminator: 17 (for CreateMasterEditionV3)
  const buffer = Buffer.alloc(1 + 1 + 8);
  let offset = 0;
  
  buffer.writeUInt8(17, offset); // Discriminator
  offset += 1;
  
  // Max supply (Option<u64>)
  if (maxSupply !== null && maxSupply !== undefined) {
    buffer.writeUInt8(1, offset); // Some
    offset += 1;
    // Write u64 as two u32s (little endian)
    buffer.writeUInt32LE(maxSupply, offset);
    offset += 4;
    buffer.writeUInt32LE(0, offset); // High bits
    offset += 4;
  } else {
    buffer.writeUInt8(0, offset); // None - unlimited
    offset += 1;
  }

  return new solanaWeb3.TransactionInstruction({
    keys,
    programId: TOKEN_METADATA_PROGRAM_ID,
    data: buffer.slice(0, offset),
  });
}

document.getElementById('mint').onclick = async () => {
  if (!connectedWallet || !walletAddress) {
    alert('Please connect your wallet first!');
    walletModal.classList.add('show');
    return;
  }
  
  const beatName = document.getElementById('beatName').value.trim() || 'My Beat';
  
  if (!confirm(`Mint "${beatName}" as an NFT on Solana ${SOLANA_NETWORK}?\n\nThis will:\n1. Generate artwork from your beat pattern\n2. Upload metadata to IPFS\n3. Create your NFT on Solana`)) {
    return;
  }
  
  mintStatus.className = 'mint-status show loading';
  mintStatus.innerHTML = '<span class="mint-spinner"></span> Preparing your beat for minting...';
  mintOutput.textContent = '';
  
  try {
    // Gather beat data
    const beatData = {
      name: beatName,
      symbol: 'BEAT',
      description: `A unique beat created with MPSeeker. BPM: ${bpm}, Swing: ${swing}%`,
      bpm: bpm,
      swing: swing,
      patterns: patterns,
      trackVolumes: trackVolumes,
      patternSequence: patternSequence,
      trackSounds: trackSounds,
      samplePack: activeSamplePack ? {
        id: activeSamplePack,
        name: samplePacks[activeSamplePack].name
      } : null,
      creator: walletAddress,
      app: 'MPSeeker',
      version: '1.0',
      timestamp: new Date().toISOString()
    };
    
    // Step 1: Generate beat visualization image
    mintStatus.innerHTML = '<span class="mint-spinner"></span> Generating beat artwork...';
    const imageDataUrl = generateBeatImage(beatData);
    
    // Step 2: Upload image to IPFS
    mintStatus.innerHTML = '<span class="mint-spinner"></span> Uploading artwork to IPFS...';
    let imageUri;
    try {
      imageUri = await uploadToIPFS(imageDataUrl, `${beatName.replace(/\s+/g, '-')}-artwork.png`, 'image/png');
      console.log('Image uploaded to IPFS:', imageUri);
    } catch (ipfsError) {
      console.warn('IPFS upload failed, using fallback:', ipfsError);
      imageUri = imageDataUrl; // Fallback to data URI
    }
    
    // Step 3: Create metadata JSON
    mintStatus.innerHTML = '<span class="mint-spinner"></span> Creating NFT metadata...';
    
    const metadataJson = {
      name: beatData.name,
      symbol: beatData.symbol,
      description: beatData.description,
      image: imageUri,
      external_url: 'https://mpseeker.app',
      attributes: [
        { trait_type: 'BPM', value: beatData.bpm },
        { trait_type: 'Swing', value: `${beatData.swing}%` },
        { trait_type: 'Patterns', value: Object.keys(beatData.patterns).length },
        { trait_type: 'Tracks', value: Object.keys(beatData.patterns.A).length },
        { trait_type: 'App', value: 'MPSeeker' },
        { trait_type: 'Version', value: '1.0' }
      ],
      properties: {
        files: [
          {
            uri: imageUri,
            type: 'image/png'
          }
        ],
        category: 'audio',
        creators: [
          {
            address: walletAddress,
            share: 100
          }
        ]
      },
      // Full beat data for loading back into the app
      beatData: beatData
    };
    
    // Step 4: Upload full metadata JSON to IPFS (includes image URL and beat data)
    mintStatus.innerHTML = '<span class="mint-spinner"></span> Uploading metadata to IPFS...';
    let metadataUri;
    
    // Compress patterns for storage in metadata
    const compressToHex = (boolArray) => {
      let binary = boolArray.map(v => v ? '1' : '0').join('');
      return parseInt(binary, 2).toString(16).padStart(4, '0');
    };
    
    const trackOrder = ['kick', 'snare', 'hat', 'openhat', 'clap', 'rim', 'tom'];
    
    const compressPattern = (pattern) => {
      let hexString = '';
      trackOrder.forEach(track => {
        hexString += compressToHex(pattern[track] || Array(16).fill(false));
      });
      return hexString;
    };
    
    const isEmpty = (hex) => hex === '0000000000000000000000000000';
    
    const pA = compressPattern(patterns.A);
    const pB = compressPattern(patterns.B);
    const pC = compressPattern(patterns.C);
    
    // Add compressed beat data to metadata for app loading
    metadataJson.beatPatterns = {
      a: pA,
      B: pB
    };
    if (!isEmpty(pC)) {
      metadataJson.beatPatterns.c = pC;
    }
    metadataJson.beatBpm = bpm;
    metadataJson.beatSwing = swing;
    
    try {
      // Upload metadata JSON to Pinata
      const metadataBlob = new Blob([JSON.stringify(metadataJson)], { type: 'application/json' });
      const metadataFormData = new FormData();
      metadataFormData.append('file', metadataBlob, `${beatName.replace(/\s+/g, '-')}-metadata.json`);
      
      const metadataResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PINATA_JWT}`
        },
        body: metadataFormData
      });
      
      if (!metadataResponse.ok) {
        throw new Error('Failed to upload metadata to IPFS');
      }
      
      const metadataResult = await metadataResponse.json();
      metadataUri = `https://gateway.pinata.cloud/ipfs/${metadataResult.IpfsHash}`;
      console.log('Metadata uploaded to IPFS:', metadataUri);
      console.log('Metadata URI length:', metadataUri.length);
      
    } catch (metaUploadError) {
      console.warn('Metadata IPFS upload failed, using compact on-chain format:', metaUploadError);
      
      // Fallback to compact on-chain storage
      let compactMeta;
      
      if (!isEmpty(pC)) {
        compactMeta = {
          n: beatName.slice(0, 2),
          b: bpm,
          a: pA,
          B: pB,
          c: pC
        };
        metadataUri = 'data:application/json,' + encodeURIComponent(JSON.stringify(compactMeta));
        
        if (metadataUri.length > 200) {
          delete compactMeta.n;
          metadataUri = 'data:application/json,' + encodeURIComponent(JSON.stringify(compactMeta));
        }
        
        if (metadataUri.length > 200) {
          delete compactMeta.c;
          metadataUri = 'data:application/json,' + encodeURIComponent(JSON.stringify(compactMeta));
        }
      } else if (!isEmpty(pB)) {
        compactMeta = {
          n: beatName.slice(0, 5),
          b: bpm,
          a: pA,
          B: pB
        };
        metadataUri = 'data:application/json,' + encodeURIComponent(JSON.stringify(compactMeta));
      } else {
        compactMeta = {
          n: beatName.slice(0, 12),
          b: bpm,
          p: pA
        };
        metadataUri = 'data:application/json,' + encodeURIComponent(JSON.stringify(compactMeta));
      }
      
      if (swing > 0 && metadataUri.length < 195) {
        compactMeta.s = swing;
        metadataUri = 'data:application/json,' + encodeURIComponent(JSON.stringify(compactMeta));
      }
      
      console.log('Using compact fallback, length:', metadataUri.length);
    }
    
    // Step 5: Connect to Solana
    mintStatus.innerHTML = '<span class="mint-spinner"></span> Connecting to Solana...';
    
    const connection = new solanaWeb3.Connection(
      solanaWeb3.clusterApiUrl(SOLANA_NETWORK),
      'confirmed'
    );
    
    let walletProvider;
    if (connectedWallet === 'phantom') {
      walletProvider = window.phantom?.solana || window.solana;
    } else if (connectedWallet === 'solflare') {
      walletProvider = window.solflare;
    } else if (connectedWallet === 'seedvault') {
      walletProvider = window.solana;
    }
    
    if (!walletProvider) {
      throw new Error('Wallet provider not found');
    }
    
    // Step 6: Mint the NFT using Token Metadata Program
    mintStatus.innerHTML = '<span class="mint-spinner"></span> Creating mint account...';
    
    const payer = new solanaWeb3.PublicKey(walletAddress);
    
    // Generate new mint keypair
    const mintKeypair = solanaWeb3.Keypair.generate();
    const mint = mintKeypair.publicKey;
    
    // Derive metadata PDA
    const [metadataPDA] = solanaWeb3.PublicKey.findProgramAddressSync(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );
    
    // Derive master edition PDA
    const [masterEditionPDA] = solanaWeb3.PublicKey.findProgramAddressSync(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
        Buffer.from('edition'),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );
    
    // Get associated token account for the payer
    const associatedTokenAddress = await getAssociatedTokenAddress(mint, payer);
    
    mintStatus.innerHTML = '<span class="mint-spinner"></span> Building transaction...';
    
    // Create transaction
    const transaction = new solanaWeb3.Transaction();
    
    // Get minimum rent for mint account
    const mintRent = await connection.getMinimumBalanceForRentExemption(82); // Mint account size
    
    // 1. Create mint account
    transaction.add(
      solanaWeb3.SystemProgram.createAccount({
        fromPubkey: payer,
        newAccountPubkey: mint,
        space: 82,
        lamports: mintRent,
        programId: splToken.TOKEN_PROGRAM_ID,
      })
    );
    
    // 2. Initialize mint (0 decimals for NFT)
    transaction.add(
      splToken.createInitializeMintInstruction(
        mint,
        0, // 0 decimals for NFT
        payer,
        payer,
        splToken.TOKEN_PROGRAM_ID
      )
    );
    
    // 3. Create associated token account
    transaction.add(
      splToken.createAssociatedTokenAccountInstruction(
        payer,
        associatedTokenAddress,
        payer,
        mint
      )
    );
    
    // 4. Mint 1 token to the associated token account
    transaction.add(
      splToken.createMintToInstruction(
        mint,
        associatedTokenAddress,
        payer,
        1 // Mint 1 token (NFT)
      )
    );
    
    // 5. Create metadata account instruction (Token Metadata Program)
    const createMetadataInstruction = createMetadataAccountV3Instruction(
      metadataPDA,
      mint,
      payer,
      payer,
      payer,
      {
        name: beatData.name.slice(0, 32), // Max 32 chars
        symbol: beatData.symbol.slice(0, 10), // Max 10 chars
        uri: metadataUri,
        sellerFeeBasisPoints: 1000, // 10% total royalty
        creators: [
          {
            address: payer,
            verified: true,
            share: 80, // Original minter gets 80% of royalties (8% of sale)
          },
          {
            address: new solanaWeb3.PublicKey('3fuLXsLx3xH9EF7wXWMVzwzxQByAPqQ8FHYXZy62WMba'),
            verified: false, // MPSeeker
            share: 20, // MPSeeker gets 20% of royalties (2% of sale)
          }
        ],
        collection: null,
        uses: null,
      },
      true, // isMutable
      true, // collectionDetails
    );
    transaction.add(createMetadataInstruction);
    
    // 6. Create master edition instruction
    const createMasterEditionInstruction = createMasterEditionV3Instruction(
      masterEditionPDA,
      mint,
      payer,
      payer,
      payer,
      metadataPDA,
      0 // Max supply 0 = unlimited prints disabled (unique NFT)
    );
    transaction.add(createMasterEditionInstruction);
    
    // Set recent blockhash and fee payer
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = payer;
    
    // Partial sign with mint keypair
    transaction.partialSign(mintKeypair);
    
    mintStatus.innerHTML = '<span class="mint-spinner"></span> Please approve the transaction in your wallet...';
    
    // Sign with wallet
    const signedTransaction = await walletProvider.signTransaction(transaction);
    
    mintStatus.innerHTML = '<span class="mint-spinner"></span> Sending transaction...';
    
    // Send transaction
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());
    
    mintStatus.innerHTML = '<span class="mint-spinner"></span> Confirming transaction...';
    
    // Confirm transaction
    await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight,
    });
    
    // Step 7: Update balance after minting (fees deducted)
    await updateSolBalance();
    
    // Success!
    const isIPFS = metadataUri.startsWith('https://ipfs.io') || metadataUri.startsWith('ipfs://');
    
    mintStatus.className = 'mint-status show success';
    mintStatus.innerHTML = `
      <button class="close-mint-status" onclick="this.parentElement.style.display='none';">×</button>
      ✅ NFT Minted Successfully!<br><br>
      <strong>Mint Address:</strong> <code>${mint.toString()}</code><br>
      <strong>Storage:</strong> ${isIPFS ? '🌐 IPFS (Permanent)' : '📦 Data URI (Temporary)'}<br><br>
      <a href="https://explorer.solana.com/address/${mint.toString()}?cluster=${SOLANA_NETWORK}" target="_blank">
        View on Solana Explorer →
      </a>
      ${isIPFS ? `<br><a href="${metadataUri}" target="_blank">View Metadata on IPFS →</a>` : ''}
      <br><button class="show-details-btn" onclick="document.getElementById('mintOutput').classList.toggle('show'); document.getElementById('mintOutput').style.display = document.getElementById('mintOutput').style.display === 'none' ? 'block' : 'none'; this.textContent = this.textContent.includes('Show') ? '▲ Hide Details' : '▼ Show Details';">▼ Show Details</button>
    `;
    
    mintOutput.textContent = JSON.stringify({
      success: true,
      network: SOLANA_NETWORK,
      mintAddress: mint.toString(),
      signature: signature,
      metadataUri: metadataUri,
      imageUri: imageUri,
      storageType: isIPFS ? 'IPFS' : 'Data URI',
      metadata: metadataJson
    }, null, 2);
    mintOutput.classList.remove('show'); // Ensure it's hidden by default
    
    console.log('NFT minted successfully! Mint:', mint.toString(), 'Signature:', signature);
    
  } catch (error) {
    console.error('Minting error:', error);
    mintStatus.className = 'mint-status show error';
    mintStatus.innerHTML = `
      <button class="close-mint-status" onclick="this.parentElement.style.display='none';">×</button>
      ❌ Minting failed: ${error.message || 'Unknown error'}
    `;
    mintOutput.textContent = JSON.stringify({ error: error.message }, null, 2);
    mintOutput.classList.add('show'); // Show details on error for debugging
  }
};

// ============ LOAD BEAT FROM NFT ============
const loadNftSection = document.getElementById('loadNftSection');
const loadNftBtn = document.getElementById('loadNftBtn');
const closeLoadNft = document.getElementById('closeLoadNft');
const nftMintAddress = document.getElementById('nftMintAddress');
const fetchNftBtn = document.getElementById('fetchNftBtn');
const loadNftStatus = document.getElementById('loadNftStatus');
const nftPreview = document.getElementById('nftPreview');
const loadNftConfirm = document.getElementById('loadNftConfirm');

let fetchedBeatData = null;

// Toggle Load NFT section
loadNftBtn.onclick = () => {
  loadNftSection.style.display = loadNftSection.style.display === 'none' ? 'block' : 'none';
  // Reset state when opening
  if (loadNftSection.style.display === 'block') {
    nftMintAddress.value = '';
    loadNftStatus.className = 'load-nft-status';
    loadNftStatus.style.display = 'none';
    nftPreview.style.display = 'none';
    fetchedBeatData = null;
  }
};

closeLoadNft.onclick = () => {
  loadNftSection.style.display = 'none';
};

// Fetch NFT metadata
fetchNftBtn.onclick = async () => {
  console.log('Fetch button clicked');
  const mintAddress = nftMintAddress.value.trim();
  console.log('Mint address:', mintAddress);
  
  if (!mintAddress) {
    loadNftStatus.className = 'load-nft-status show error';
    loadNftStatus.style.display = 'block';
    loadNftStatus.textContent = 'Please enter a mint address';
    return;
  }
  
  // Validate Solana address format (base58, 32-44 chars)
  if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(mintAddress)) {
    loadNftStatus.className = 'load-nft-status show error';
    loadNftStatus.style.display = 'block';
    loadNftStatus.textContent = 'Invalid Solana address format';
    return;
  }
  
  loadNftStatus.className = 'load-nft-status show loading';
  loadNftStatus.style.display = 'block';
  loadNftStatus.innerHTML = '<span class="mint-spinner"></span> Fetching NFT metadata...';
  nftPreview.style.display = 'none';
  fetchedBeatData = null;
  
  try {
    const connection = initSolanaConnection();
    const mintPubkey = new solanaWeb3.PublicKey(mintAddress);
    console.log('Mint pubkey:', mintPubkey.toString());
    
    // Fetch NFT by reading the metadata account directly
    loadNftStatus.innerHTML = '<span class="mint-spinner"></span> Reading NFT from blockchain...';
    
    // Derive metadata PDA
    const [metadataPDA] = solanaWeb3.PublicKey.findProgramAddressSync(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintPubkey.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );
    console.log('Metadata PDA:', metadataPDA.toString());
    
    // Fetch metadata account
    const metadataAccount = await connection.getAccountInfo(metadataPDA);
    console.log('Metadata account:', metadataAccount);
    
    if (!metadataAccount) {
      throw new Error('NFT metadata not found. This might not be an NFT.');
    }
    
    // Parse metadata account data
    const metadataData = parseMetadataAccount(metadataAccount.data);
    
    console.log('NFT found:', metadataData);
    
    // Get metadata URI
    const metadataUri = metadataData.uri;
    if (!metadataUri) {
      throw new Error('NFT has no metadata URI');
    }
    
    // Fetch metadata JSON
    loadNftStatus.innerHTML = '<span class="mint-spinner"></span> Fetching metadata...';
    let metadata;
    
    console.log('Metadata URI:', metadataUri);
    console.log('URI length:', metadataUri.length);
    
    if (metadataUri.startsWith('data:')) {
      // Handle data URI
      try {
        // Check if it's base64 or URL-encoded
        const isBase64 = metadataUri.includes(';base64,');
        
        if (isBase64) {
          // Base64 encoded
          const base64Data = metadataUri.split(',')[1];
          console.log('Base64 data length:', base64Data?.length);
          
          if (!base64Data) {
            throw new Error('Invalid data URI format');
          }
          
          // Try decoding
          let jsonString;
          try {
            // First try standard base64 decode
            jsonString = atob(base64Data);
          } catch (e) {
            // Try URL-safe base64
            const standardBase64 = base64Data.replace(/-/g, '+').replace(/_/g, '/');
            jsonString = atob(standardBase64);
          }
          
          // Handle UTF-8 encoding
          try {
            jsonString = decodeURIComponent(escape(jsonString));
          } catch (e) {
            // Already decoded or not URL encoded
            console.log('Using raw decoded string');
          }
          
          console.log('Decoded JSON string (first 200 chars):', jsonString.substring(0, 200));
          metadata = JSON.parse(jsonString);
        } else {
          // URL-encoded (data:application/json,{...})
          const jsonPart = metadataUri.split(',')[1];
          console.log('URL-encoded data length:', jsonPart?.length);
          
          if (!jsonPart) {
            throw new Error('Invalid data URI format');
          }
          
          const jsonString = decodeURIComponent(jsonPart);
          console.log('Decoded JSON string:', jsonString);
          metadata = JSON.parse(jsonString);
        }
      } catch (parseError) {
        console.error('Data URI parse error:', parseError);
        console.error('Raw URI:', metadataUri.substring(0, 300));
        throw new Error('This NFT\'s metadata was truncated during minting. Try minting a new NFT - the issue has been fixed!');
      }
    } else {
      // Fetch from URL (IPFS, JSONBin, paste.rs, or other)
      let fetchUrl = metadataUri;
      
      // Convert IPFS URLs to HTTP gateway
      if (metadataUri.startsWith('ipfs://')) {
        fetchUrl = metadataUri.replace('ipfs://', 'https://ipfs.io/ipfs/');
      }
      
      console.log('Fetching from URL:', fetchUrl);
      
      const response = await fetch(fetchUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch metadata');
      }
      
      // Handle different response formats
      const responseText = await response.text();
      console.log('Response text (first 500 chars):', responseText.substring(0, 500));
      
      try {
        const jsonData = JSON.parse(responseText);
        
        // JSONBin wraps response in { record: {...} }
        if (jsonData.record) {
          console.log('Detected JSONBin format');
          metadata = jsonData.record;
        } else {
          metadata = jsonData;
        }
      } catch (e) {
        console.error('Failed to parse JSON:', e);
        throw new Error('Failed to parse metadata JSON');
      }
    }
    
    console.log('Metadata:', metadata);
    
    // Handle different metadata formats
    let beatDataToLoad = null;
    
    // Track order for decompression
    const trackOrder = ['kick', 'snare', 'hat', 'openhat', 'clap', 'rim', 'tom'];
    
    // Decompress hex string to boolean arrays for all tracks
    const hexToBoolArray = (hex) => {
      const binary = parseInt(hex, 16).toString(2).padStart(16, '0');
      return binary.split('').map(c => c === '1');
    };
    
    const decompressPattern = (hexString) => {
      const pattern = {};
      trackOrder.forEach((track, index) => {
        const hex = hexString.substr(index * 4, 4);
        pattern[track] = hexToBoolArray(hex);
      });
      return pattern;
    };
    
    // Create empty pattern
    const emptyPattern = () => {
      const pattern = {};
      trackOrder.forEach(track => {
        pattern[track] = Array(16).fill(false);
      });
      return pattern;
    };
    
    // Check for FULL beat data format (from external storage)
    if (metadata.patterns && typeof metadata.patterns === 'object' && metadata.patterns.A && typeof metadata.patterns.A === 'object') {
      console.log('Detected FULL beat data format (external storage)');
      
      beatDataToLoad = {
        name: metadata.name || 'Loaded Beat',
        bpm: metadata.bpm || 120,
        swing: metadata.swing || 0,
        patterns: metadata.patterns,
        trackVolumes: metadata.trackVolumes || {},
        trackSounds: metadata.trackSounds || {},
        patternSequence: metadata.patternSequence || ['', '', '', ''],
        effects: metadata.effects || {}
      };
      
      console.log('Full beat data loaded with all patterns, volumes, and effects!');
    }
    // Check for Pinata IPFS metadata format (has beatPatterns with compressed hex)
    else if (metadata.beatPatterns && metadata.beatPatterns.a && metadata.beatPatterns.B) {
      console.log('Detected Pinata IPFS metadata format');
      
      const bp = metadata.beatPatterns;
      beatDataToLoad = {
        name: metadata.name || 'Loaded Beat',
        bpm: metadata.beatBpm || metadata.bpm || 120,
        swing: metadata.beatSwing || metadata.swing || 0,
        patterns: {
          A: decompressPattern(bp.a),
          B: decompressPattern(bp.B),
          C: bp.c ? decompressPattern(bp.c) : emptyPattern()
        }
      };
      
      console.log('Loaded from Pinata IPFS with image!');
    }
    // Check for format with all 3 patterns (a, B, c lowercase/mixed keys)
    else if (metadata.a && metadata.B && metadata.c && typeof metadata.a === 'string') {
      console.log('Detected compact a+B+c pattern format');
      
      beatDataToLoad = {
        name: metadata.n || 'Loaded Beat',
        bpm: metadata.b || 120,
        swing: metadata.s || 0,
        patterns: {
          A: decompressPattern(metadata.a),
          B: decompressPattern(metadata.B),
          C: decompressPattern(metadata.c)
        }
      };
    }
    // Check for format with all 3 patterns (A, B, C hex strings) - old format
    else if (metadata.A && metadata.B && metadata.C && typeof metadata.A === 'string') {
      console.log('Detected A+B+C pattern format');
      
      beatDataToLoad = {
        name: metadata.n || 'Loaded Beat',
        bpm: metadata.b || 120,
        swing: metadata.s || 0,
        patterns: {
          A: decompressPattern(metadata.A),
          B: decompressPattern(metadata.B),
          C: decompressPattern(metadata.C)
        }
      };
    }
    // Check for format with A and B patterns (a, B mixed keys)
    else if (metadata.a && metadata.B && typeof metadata.a === 'string') {
      console.log('Detected compact a+B pattern format');
      
      beatDataToLoad = {
        name: metadata.n || 'Loaded Beat',
        bpm: metadata.b || 120,
        swing: metadata.s || 0,
        patterns: {
          A: decompressPattern(metadata.a),
          B: decompressPattern(metadata.B),
          C: emptyPattern()
        }
      };
    }
    // Check for format with A and B patterns (hex strings) - old format
    else if (metadata.A && metadata.B && typeof metadata.A === 'string') {
      console.log('Detected A+B pattern format');
      
      beatDataToLoad = {
        name: metadata.n || 'Loaded Beat',
        bpm: metadata.b || 120,
        swing: metadata.s || 0,
        patterns: {
          A: decompressPattern(metadata.A),
          B: decompressPattern(metadata.B),
          C: emptyPattern()
        }
      };
    }
    // Check for compact format with single hex string (p field) - Pattern A only
    else if (metadata.p && typeof metadata.p === 'string') {
      console.log('Detected compact hex string format (Pattern A only)');
      
      beatDataToLoad = {
        name: metadata.n || 'Loaded Beat',
        bpm: metadata.b || 120,
        swing: metadata.s || 0,
        patterns: {
          A: decompressPattern(metadata.p),
          B: emptyPattern(),
          C: emptyPattern()
        }
      };
    }
    // Check for old minimal hex format (A object with short track names)
    else if (metadata.A && typeof metadata.A === 'object') {
      console.log('Detected old minimal hex format');
      
      // Map short track names to full names
      const trackMap = { k: 'kick', s: 'snare', h: 'hat', c: 'clap', r: 'rim', t: 'tom', o: 'openhat' };
      
      const decompressedA = {};
      const patternA = metadata.A;
      Object.keys(patternA).forEach(shortName => {
        const fullName = trackMap[shortName] || shortName;
        decompressedA[fullName] = hexToBoolArray(patternA[shortName]);
      });
      
      // Fill in missing tracks
      trackOrder.forEach(track => {
        if (!decompressedA[track]) {
          decompressedA[track] = Array(16).fill(false);
        }
      });
      
      beatDataToLoad = {
        name: metadata.n || metadata.name || 'Loaded Beat',
        bpm: metadata.b || 120,
        swing: metadata.s || 0,
        patterns: {
          A: decompressedA,
          B: emptyPattern(),
          C: emptyPattern()
        }
      };
    }
    // Check for beatData format
    else if (metadata.beatData) {
      beatDataToLoad = metadata.beatData;
      
      // Decompress patterns if needed
      const decompressPatterns = (compressedPatterns) => {
        const decompressed = {};
        Object.keys(compressedPatterns).forEach(patternKey => {
          decompressed[patternKey] = {};
          Object.keys(compressedPatterns[patternKey]).forEach(track => {
            const value = compressedPatterns[patternKey][track];
            if (typeof value === 'string') {
              if (value.length === 4) {
                // Hex format
                const binary = parseInt(value, 16).toString(2).padStart(16, '0');
                decompressed[patternKey][track] = binary.split('').map(c => c === '1');
              } else {
                // Binary string format
                decompressed[patternKey][track] = value.split('').map(c => c === '1');
              }
            } else {
              decompressed[patternKey][track] = value;
            }
          });
        });
        return decompressed;
      };
      
      // Handle compressed 'p' field
      if (beatDataToLoad.p && !beatDataToLoad.patterns) {
        beatDataToLoad.patterns = decompressPatterns(beatDataToLoad.p);
      } else if (beatDataToLoad.A && !beatDataToLoad.patterns) {
        // Only Pattern A was stored
        beatDataToLoad.patterns = { A: {}, B: {}, C: {} };
        Object.keys(beatDataToLoad.A).forEach(track => {
          const value = beatDataToLoad.A[track];
          if (typeof value === 'string') {
            if (value.length === 4) {
              const binary = parseInt(value, 16).toString(2).padStart(16, '0');
              beatDataToLoad.patterns.A[track] = binary.split('').map(c => c === '1');
            } else {
              beatDataToLoad.patterns.A[track] = value.split('').map(c => c === '1');
            }
          } else {
            beatDataToLoad.patterns.A[track] = value;
          }
          beatDataToLoad.patterns.B[track] = Array(16).fill(false);
          beatDataToLoad.patterns.C[track] = Array(16).fill(false);
        });
      } else if (beatDataToLoad.patterns) {
        // Check if patterns need decompression
        const firstPattern = Object.keys(beatDataToLoad.patterns)[0];
        if (firstPattern) {
          const firstTrack = Object.keys(beatDataToLoad.patterns[firstPattern])[0];
          if (firstTrack && typeof beatDataToLoad.patterns[firstPattern][firstTrack] === 'string') {
            beatDataToLoad.patterns = decompressPatterns(beatDataToLoad.patterns);
          }
        }
      }
    }
    
    if (!beatDataToLoad) {
      throw new Error('This NFT does not contain beat data. It may not be a MPSeeker NFT.');
    }
    
    // Store fetched beat data
    fetchedBeatData = beatDataToLoad;
    
    // Set defaults for missing fields
    fetchedBeatData.name = fetchedBeatData.name || metadata.name || metadata.n || 'Loaded Beat';
    fetchedBeatData.bpm = fetchedBeatData.bpm || metadata.b || 120;
    fetchedBeatData.swing = fetchedBeatData.swing || metadata.s || 0;
    
    // Generate preview image from beat data (since image URL isn't stored on-chain)
    let previewImage = metadata.image || '';
    if (!previewImage && fetchedBeatData.patterns) {
      // Generate the beat visualization
      const previewBeatData = {
        name: fetchedBeatData.name,
        bpm: fetchedBeatData.bpm,
        swing: fetchedBeatData.swing,
        patterns: fetchedBeatData.patterns
      };
      previewImage = generateBeatImage(previewBeatData);
      console.log('Generated preview image from beat data');
    }
    
    // Update preview
    document.getElementById('nftPreviewImage').src = previewImage;
    document.getElementById('nftPreviewName').textContent = fetchedBeatData.name;
    document.getElementById('nftPreviewDesc').textContent = metadata.description || `${fetchedBeatData.bpm} BPM Beat from Solana NFT`;
    document.getElementById('nftPreviewBpm').textContent = `${fetchedBeatData.bpm} BPM`;
    document.getElementById('nftPreviewSwing').textContent = `${fetchedBeatData.swing}% Swing`;
    
    // Show preview
    nftPreview.style.display = 'block';
    loadNftStatus.className = 'load-nft-status show success';
    loadNftStatus.style.display = 'block';
    loadNftStatus.textContent = '✅ Beat found! Preview below:';
    
  } catch (error) {
    console.error('Error fetching NFT:', error);
    loadNftStatus.className = 'load-nft-status show error';
    loadNftStatus.style.display = 'block';
    loadNftStatus.textContent = `❌ ${error.message || 'Failed to fetch NFT'}`;
    nftPreview.style.display = 'none';
  }
};

// Load beat into sequencer
loadNftConfirm.onclick = () => {
  if (!fetchedBeatData) {
    alert('No beat data to load!');
    return;
  }
  
  try {
    // Load patterns - directly assign the loaded patterns
    if (fetchedBeatData.patterns) {
      console.log('Loading patterns:', fetchedBeatData.patterns);
      
      // Load each pattern (A, B, C)
      ['A', 'B', 'C'].forEach(patternKey => {
        if (fetchedBeatData.patterns[patternKey]) {
          // Ensure pattern exists
          if (!patterns[patternKey]) {
            patterns[patternKey] = {};
          }
          
          // Load each track in this pattern
          Object.keys(fetchedBeatData.patterns[patternKey]).forEach(track => {
            const trackData = fetchedBeatData.patterns[patternKey][track];
            if (Array.isArray(trackData)) {
              patterns[patternKey][track] = [...trackData];
              console.log(`Loaded ${patternKey}.${track}:`, patterns[patternKey][track]);
            }
          });
        }
      });
    }
    
    // Load BPM
    if (fetchedBeatData.bpm) {
      bpm = fetchedBeatData.bpm;
      document.getElementById('bpm').value = bpm;
      document.getElementById('bpmValue').textContent = bpm;
    }
    
    // Load Swing
    if (fetchedBeatData.swing !== undefined) {
      swing = fetchedBeatData.swing;
      document.getElementById('swing').value = swing;
      document.getElementById('swingValue').textContent = swing + '%';
    }
    
    // Load track volumes
    if (fetchedBeatData.trackVolumes) {
      Object.keys(fetchedBeatData.trackVolumes).forEach(track => {
        if (trackVolumes[track] !== undefined) {
          trackVolumes[track] = fetchedBeatData.trackVolumes[track];
          // Update volume slider UI
          const trackContainer = document.querySelector(`.track-container[data-track="${track}"]`);
          if (trackContainer) {
            const volumeSlider = trackContainer.querySelector('.volume-control');
            const volumeValue = trackContainer.querySelector('.volume-value');
            if (volumeSlider) volumeSlider.value = Math.round(trackVolumes[track] * 100);
            if (volumeValue) volumeValue.textContent = Math.round(trackVolumes[track] * 100);
          }
        }
      });
    }
    
    // Load pattern sequence
    if (fetchedBeatData.patternSequence) {
      patternSequence = [...fetchedBeatData.patternSequence];
      document.querySelectorAll('.pattern-select').forEach((select, index) => {
        select.value = patternSequence[index] || '';
      });
    }
    
    // Load track sounds
    if (fetchedBeatData.trackSounds) {
      Object.keys(fetchedBeatData.trackSounds).forEach(track => {
        if (trackSounds[track] !== undefined) {
          trackSounds[track] = fetchedBeatData.trackSounds[track];
          // Update the sound selector UI if it exists
          const trackContainer = document.querySelector(`.track-container[data-track="${track}"]`);
          if (trackContainer) {
            const soundSelect = trackContainer.querySelector('.sound-select');
            if (soundSelect) {
              soundSelect.value = trackSounds[track];
            }
          }
        }
      });
    }
    
    // Load effects
    if (fetchedBeatData.effects) {
      const effects = fetchedBeatData.effects;
      
      // Reverb
      if (effects.reverb !== undefined) {
        const reverbSlider = document.getElementById('reverb');
        const reverbValue = document.getElementById('reverbValue');
        if (reverbSlider) {
          reverbSlider.value = effects.reverb;
          if (reverbValue) reverbValue.textContent = effects.reverb + '%';
          // Update actual reverb (wet/dry mix)
          const wetAmount = effects.reverb / 100;
          reverbWet.gain.value = wetAmount * 0.5;
          reverbDry.gain.value = 1 - (wetAmount * 0.3);
        }
      }
      
      // Delay
      if (effects.delay !== undefined) {
        const delaySlider = document.getElementById('delay');
        const delayValueEl = document.getElementById('delayValue');
        if (delaySlider) {
          delaySlider.value = effects.delay;
          if (delayValueEl) delayValueEl.textContent = effects.delay + '%';
          delayWet.gain.value = effects.delay / 100;
        }
      }
      
      // Filter
      if (effects.filter !== undefined) {
        const filterSlider = document.getElementById('filter');
        const filterValue = document.getElementById('filterValue');
        if (filterSlider) {
          filterSlider.value = effects.filter;
          if (filterValue) filterValue.textContent = effects.filter + '%';
          // Calculate filter frequency (20Hz to 20000Hz logarithmic)
          const minFreq = 20;
          const maxFreq = 20000;
          const filterPercent = effects.filter / 100;
          filterNode.frequency.value = minFreq * Math.pow(maxFreq / minFreq, filterPercent);
        }
      }
      
      console.log('Effects loaded:', effects);
    }
    
    // Load per-pattern effects (v1.2 format)
    if (fetchedBeatData.patternEffects) {
      Object.keys(fetchedBeatData.patternEffects).forEach(pattern => {
        Object.assign(patternEffects[pattern], fetchedBeatData.patternEffects[pattern]);
      });
      applyPatternEffects(currentPattern);
    }
    
    // Load beat name
    if (fetchedBeatData.name) {
      document.getElementById('beatName').value = fetchedBeatData.name;
    }
    
    // Update grid UI
    updateGridUI();
    
    // Close the load section
    loadNftSection.style.display = 'none';
    
    // Show success message
    alert(`✅ Beat "${fetchedBeatData.name || 'Untitled'}" loaded successfully!\n\nPress Play to hear it!`);
    
    console.log('Beat loaded from NFT:', fetchedBeatData);
    
  } catch (error) {
    console.error('Error loading beat:', error);
    alert('Failed to load beat: ' + error.message);
  }
};

// Update grid UI to reflect loaded patterns
function updateGridUI() {
  document.querySelectorAll('.track-container').forEach(container => {
    const track = container.dataset.track;
    const steps = container.querySelectorAll('.step');
    
    steps.forEach((step, index) => {
      const isActive = patterns[currentPattern][track]?.[index] || false;
      step.classList.toggle('active', isActive);
    });
  });
}

// Portrait message dismiss functionality
function dismissPortraitMessage() {
  const portraitMessage = document.getElementById('portraitMessage');
  if (portraitMessage) {
    portraitMessage.style.display = 'none';
    // Store preference to not show again this session
    sessionStorage.setItem('portraitMessageDismissed', 'true');
  }
}

// Make function globally available
window.dismissPortraitMessage = dismissPortraitMessage;

// Check if message was already dismissed this session
document.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem('portraitMessageDismissed') === 'true') {
    const portraitMessage = document.getElementById('portraitMessage');
    if (portraitMessage) {
      portraitMessage.style.display = 'none';
    }
  }
});