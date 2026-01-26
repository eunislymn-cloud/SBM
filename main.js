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

// Setup Effects
filterNode.type = 'lowpass';
filterNode.frequency.value = 20000;
delayNode.delayTime.value = 0.25;
delayFeedback.gain.value = 0.3;
delayWet.gain.value = 0;

// Create reverb impulse response
function createReverb() {
  const rate = audioCtx.sampleRate;
  const length = rate * 2;
  const impulse = audioCtx.createBuffer(2, length, rate);
  for (let channel = 0; channel < 2; channel++) {
    const channelData = impulse.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
    }
  }
  reverbNode.buffer = impulse;
}
createReverb();

// Set initial reverb mix (20% wet)
reverbDry.gain.value = 0.8;
reverbWet.gain.value = 0.2;

// Effects Routing with Reverb
masterGain.connect(reverbDry);
masterGain.connect(reverbNode);
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
  { name: 'clap', label: 'Clap' },
  { name: 'crash', label: 'Crash' },
  { name: 'rim', label: 'Rim' },
  { name: 'tom', label: 'Tom' }
];

const steps = 16;
let currentStep = 0;
let isPlaying = false;
let bpm = 120;
let swing = 0;
let currentPattern = 'A';
let sequencerEnabled = false;
let patternSequence = ['A', '', '', '', '', '', '', ''];
let currentSequenceIndex = 0;
const patterns = { A: {}, B: {}, C: {} };
const trackVolumes = {};

const trackSounds = {
  kick: 'kick1',
  snare: 'snare1',
  hat: 'hat1',
  clap: 'clap1',
  crash: 'crash1',
  rim: 'rim1',
  tom: 'tom1'
};

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
      crash: 'samples/808kit/crash.wav',
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
      crash: 'samples/trap/crash.wav',
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
      crash: 'samples/lofi/crash.wav',
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
      crash: 'samples/edm/crash.wav',
      rim: 'samples/edm/rim.wav',
      tom: 'samples/edm/tom.wav'
    }
  }
};

trackConfig.forEach(t => {
  patterns.A[t.name] = Array(steps).fill(false);
  patterns.B[t.name] = Array(steps).fill(false);
  patterns.C[t.name] = Array(steps).fill(false);
  trackVolumes[t.name] = 0.8;
});

const sequencer = document.querySelector('.sequencer');
trackConfig.forEach(track => {
  const container = document.createElement('div');
  container.className = 'track-container';
  container.dataset.track = track.name;
  
  const header = document.createElement('div');
  header.className = 'track-header';
  header.innerHTML = `
    <div class="track-label-wrapper">
      <div class="track-label">${track.label}</div>
      <div class="sound-menu" style="display:none;">
        <div class="sound-option" data-sound="${track.name}1">Sound 1</div>
        <div class="sound-option" data-sound="${track.name}2">Sound 2</div>
      </div>
    </div>
    <div class="track-volume">
      <span>Vol</span>
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
    step.addEventListener('click', () => {
      patterns[currentPattern][track.name][i] = !patterns[currentPattern][track.name][i];
      step.classList.toggle('active');
    });
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
      trackSounds[track.name] = option.dataset.sound;
      soundMenu.style.display = 'none';
      soundMenu.querySelectorAll('.sound-option').forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
    });
  });
  
  soundMenu.querySelector(`[data-sound="${track.name}1"]`).classList.add('selected');
});

document.addEventListener('click', () => {
  document.querySelectorAll('.sound-menu').forEach(menu => {
    menu.style.display = 'none';
  });
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

function playSound(trackName) {
  const volume = trackVolumes[trackName];
  const time = audioCtx.currentTime;
  const soundVariant = trackSounds[trackName];
  
  switch(soundVariant) {
    case 'kick1': {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.frequency.setValueAtTime(150, time);
      osc.frequency.exponentialRampToValueAtTime(40, time + 0.15);
      gain.gain.setValueAtTime(volume, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
      osc.connect(gain).connect(masterGain);
      osc.start(time);
      osc.stop(time + 0.15);
      break;
    }
    case 'kick2': {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.frequency.setValueAtTime(100, time);
      osc.frequency.exponentialRampToValueAtTime(30, time + 0.25);
      gain.gain.setValueAtTime(volume * 1.2, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);
      osc.connect(gain).connect(masterGain);
      osc.start(time);
      osc.stop(time + 0.25);
      break;
    }
    case 'snare1': {
      const noise = audioCtx.createBufferSource();
      const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.2, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      noise.buffer = buffer;
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(volume, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
      noise.connect(gain).connect(masterGain);
      noise.start(time);
      break;
    }
    case 'snare2': {
      const noise = audioCtx.createBufferSource();
      const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.15, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
      }
      noise.buffer = buffer;
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(volume * 0.8, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);
      noise.connect(gain).connect(masterGain);
      noise.start(time);
      break;
    }
    case 'hat1': {
      const noise = audioCtx.createBufferSource();
      const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.05, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.005));
      }
      noise.buffer = buffer;
      
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 7000;
      
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(volume * 0.4, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);
      
      noise.connect(filter).connect(gain).connect(masterGain);
      noise.start(time);
      break;
    }
    case 'hat2': {
      const noise = audioCtx.createBufferSource();
      const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.15, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.02));
      }
      noise.buffer = buffer;
      
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 6000;
      
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(volume * 0.35, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);
      
      noise.connect(filter).connect(gain).connect(masterGain);
      noise.start(time);
      break;
    }
    case 'clap1': {
      const noise = audioCtx.createBufferSource();
      const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.1, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.02));
      }
      noise.buffer = buffer;
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(volume * 0.7, time);
      noise.connect(gain).connect(masterGain);
      noise.start(time);
      break;
    }
    case 'clap2': {
      for (let delay = 0; delay < 3; delay++) {
        const noise = audioCtx.createBufferSource();
        const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.05, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.01));
        }
        noise.buffer = buffer;
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(volume * 0.5, time + delay * 0.02);
        noise.connect(gain).connect(masterGain);
        noise.start(time + delay * 0.02);
      }
      break;
    }
    case 'crash1': {
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      osc1.type = 'square';
      osc2.type = 'square';
      osc1.frequency.value = 5000 + Math.random() * 3000;
      osc2.frequency.value = 7000 + Math.random() * 3000;
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(volume * 0.5, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.8);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(masterGain);
      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + 0.8);
      osc2.stop(time + 0.8);
      break;
    }
    case 'crash2': {
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const osc3 = audioCtx.createOscillator();
      osc1.type = 'square';
      osc2.type = 'square';
      osc3.type = 'square';
      osc1.frequency.value = 4000 + Math.random() * 2000;
      osc2.frequency.value = 6000 + Math.random() * 2000;
      osc3.frequency.value = 8000 + Math.random() * 2000;
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(volume * 0.4, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 1.2);
      osc1.connect(gain);
      osc2.connect(gain);
      osc3.connect(gain);
      gain.connect(masterGain);
      osc1.start(time);
      osc2.start(time);
      osc3.start(time);
      osc1.stop(time + 1.2);
      osc2.stop(time + 1.2);
      osc3.stop(time + 1.2);
      break;
    }
    case 'rim1': {
      const osc = audioCtx.createOscillator();
      osc.frequency.setValueAtTime(400, time);
      osc.frequency.exponentialRampToValueAtTime(200, time + 0.02);
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(volume * 0.5, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.02);
      osc.connect(gain).connect(masterGain);
      osc.start(time);
      osc.stop(time + 0.02);
      break;
    }
    case 'rim2': {
      const osc = audioCtx.createOscillator();
      osc.frequency.setValueAtTime(800, time);
      osc.frequency.exponentialRampToValueAtTime(400, time + 0.015);
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(volume * 0.6, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.015);
      osc.connect(gain).connect(masterGain);
      osc.start(time);
      osc.stop(time + 0.015);
      break;
    }
    case 'tom1': {
      const osc = audioCtx.createOscillator();
      osc.frequency.setValueAtTime(200, time);
      osc.frequency.exponentialRampToValueAtTime(80, time + 0.2);
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(volume, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
      osc.connect(gain).connect(masterGain);
      osc.start(time);
      osc.stop(time + 0.2);
      break;
    }
    case 'tom2': {
      const osc = audioCtx.createOscillator();
      osc.frequency.setValueAtTime(150, time);
      osc.frequency.exponentialRampToValueAtTime(60, time + 0.3);
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(volume * 1.1, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
      osc.connect(gain).connect(masterGain);
      osc.start(time);
      osc.stop(time + 0.3);
      break;
    }
  }
}

function updateBeatCounter() {
  const bar = Math.floor(currentStep / 16) + 1;
  const beat = Math.floor((currentStep % 16) / 4) + 1;
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

function tick() {
  let activePattern = currentPattern;
  if (sequencerEnabled) {
    const activeSeq = getActiveSequence();
    if (activeSeq.length > 0) {
      activePattern = activeSeq[currentSequenceIndex];
      
      document.querySelectorAll('.pattern-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.pattern === activePattern);
      });
      
      trackConfig.forEach(track => {
        const container = document.querySelector(`[data-track="${track.name}"]`);
        const stepEls = container.querySelectorAll('.step');
        stepEls.forEach((el, i) => {
          el.classList.toggle('active', patterns[activePattern][track.name][i]);
        });
      });
    }
  }
  
  trackConfig.forEach(track => {
    const container = document.querySelector(`[data-track="${track.name}"]`);
    const stepEls = container.querySelectorAll('.step');
    stepEls.forEach((el, i) => el.classList.toggle('playing', i === currentStep));
    
    if (patterns[activePattern][track.name][currentStep]) playSound(track.name);
  });
  
  updateBeatCounter();
  updateSequenceUI();
  
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
  isPlaying = true;
  currentSequenceIndex = 0;
  
  const baseInterval = (60 / bpm) * 1000 / 4;
  let lastTime = Date.now();
  let stepCounter = 0;
  
  function scheduleTick() {
    if (!isPlaying) return;
    const now = Date.now();
    let interval = baseInterval;
    if (swing > 0 && stepCounter % 2 === 1) interval *= 1 + (swing / 100);
    if (now - lastTime >= interval) {
      tick();
      lastTime = now;
      stepCounter++;
    }
    requestAnimationFrame(scheduleTick);
  }
  scheduleTick();
}

function stop() {
  isPlaying = false;
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
  });
});

function updateUI() {
  trackConfig.forEach(track => {
    const container = document.querySelector(`[data-track="${track.name}"]`);
    const stepEls = container.querySelectorAll('.step');
    stepEls.forEach((el, i) => {
      el.classList.toggle('active', patterns[currentPattern][track.name][i]);
    });
  });
}

document.getElementById('play').onclick = () => { 
  audioCtx.resume(); 
  start(); 
};

document.getElementById('stop').onclick = stop;

document.getElementById('bpm').oninput = e => {
  bpm = parseInt(e.target.value);
  document.getElementById('bpmValue').textContent = bpm;
};

document.getElementById('swing').oninput = e => {
  swing = parseInt(e.target.value);
  document.getElementById('swingValue').textContent = swing + '%';
};

document.getElementById('delayMix').oninput = e => {
  delayWet.gain.value = e.target.value / 100;
  document.getElementById('delayValue').textContent = e.target.value + '%';
};

document.getElementById('delayTime').oninput = e => {
  delayNode.delayTime.value = e.target.value / 1000;
  document.getElementById('delayTimeValue').textContent = e.target.value + 'ms';
};

document.getElementById('filter').oninput = e => {
  filterNode.frequency.value = parseInt(e.target.value);
  const val = parseInt(e.target.value);
  document.getElementById('filterValue').textContent = val >= 1000 ? (val/1000).toFixed(1)+'k' : val;
};

document.getElementById('reverb').oninput = e => {
  const val = parseInt(e.target.value);
  document.getElementById('reverbValue').textContent = val + '%';
  
  const wetAmount = val / 100;
  reverbWet.gain.value = wetAmount;
  reverbDry.gain.value = 1 - wetAmount;
};

document.getElementById('clear').onclick = () => {
  if (confirm('Clear current pattern?')) {
    trackConfig.forEach(t => patterns[currentPattern][t.name].fill(false));
    updateUI();
  }
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
  const data = { bpm, swing, patterns, trackVolumes, patternSequence, trackSounds };
  const library = JSON.parse(localStorage.getItem('beatLibrary') || '{}');
  library[name] = data;
  localStorage.setItem('beatLibrary', JSON.stringify(library));
  alert(`"${name}" saved!`);
  updateBeatDropdown();
};

document.getElementById('load').onclick = () => {
  const name = document.getElementById('savedBeats').value;
  if (!name) return alert('Select a beat.');
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
  
  if (data.trackSounds) {
    Object.assign(trackSounds, data.trackSounds);
    trackConfig.forEach(track => {
      const soundMenu = document.querySelector(`[data-track="${track.name}"] .sound-menu`);
      if (soundMenu) {
        soundMenu.querySelectorAll('.sound-option').forEach(opt => {
          opt.classList.toggle('selected', opt.dataset.sound === trackSounds[track.name]);
        });
      }
    });
  }
  
  document.getElementById('bpm').value = bpm;
  document.getElementById('bpmValue').textContent = bpm;
  document.getElementById('swing').value = swing;
  document.getElementById('swingValue').textContent = swing + '%';
  updateUI();
  alert(`"${name}" loaded!`);
};

document.getElementById('export').onclick = () => {
  const name = document.getElementById('beatName').value.trim() || 'MyBeat';
  const data = { name, bpm, swing, patterns, trackVolumes, patternSequence, trackSounds };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

document.getElementById('import').onclick = () => document.getElementById('importFile').click();

document.getElementById('importFile').onchange = e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = evt => {
    try {
      const data = JSON.parse(evt.target.result);
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
      
      if (data.trackSounds) {
        Object.assign(trackSounds, data.trackSounds);
        trackConfig.forEach(track => {
          const soundMenu = document.querySelector(`[data-track="${track.name}"] .sound-menu`);
          if (soundMenu) {
            soundMenu.querySelectorAll('.sound-option').forEach(opt => {
              opt.classList.toggle('selected', opt.dataset.sound === trackSounds[track.name]);
            });
          }
        });
      }
      
      document.getElementById('beatName').value = data.name || '';
      document.getElementById('bpm').value = bpm;
      document.getElementById('bpmValue').textContent = bpm;
      document.getElementById('swing').value = swing;
      document.getElementById('swingValue').textContent = swing + '%';
      updateUI();
      alert(`"${data.name || 'Beat'}" imported!`);
    } catch {
      alert('Invalid file!');
    }
  };
  reader.readAsText(file);
  e.target.value = '';
};

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
  if (!solanaConnection) {
    solanaConnection = new solanaWeb3.Connection(
      solanaWeb3.clusterApiUrl('devnet'),
      'confirmed'
    );
  }
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
    const balance = await connection.getBalance(publicKey);
    const solBalance = balance / solanaWeb3.LAMPORTS_PER_SOL;
    
    solBalanceEl.textContent = solBalance.toFixed(4);
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
        throw new Error('Phantom not found. Please install Phantom wallet.');
      }
    } else if (walletType === 'solflare') {
      if (window.solflare) {
        provider = window.solflare;
      } else {
        throw new Error('Solflare not found. Please install Solflare wallet.');
      }
    }
    
    if (!provider) {
      throw new Error('Wallet not available');
    }
    
    console.log('Connecting to', walletType, '...');
    const response = await provider.connect();
    walletAddress = response.publicKey.toString();
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
function disconnectWallet() {
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
  else if (window.solflare?.isConnected) {
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
const SOLANA_NETWORK = 'devnet';
const mintStatus = document.getElementById('mintStatus');
const mintOutput = document.getElementById('mintOutput');

// NFT.Storage API key (free tier - get yours at nft.storage)
// For production, you should use your own API key
// Upload to IPFS via Pinata
const PINATA_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlMjdkOTkxZS1mZjIxLTQ4YTYtOThmMy04MDJkMGE5MjEwOGEiLCJlbWFpbCI6ImV1bmlzbHltbkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNmYxM2ZiZTZmNDI4ODZiNmJkYTEiLCJzY29wZWRLZXlTZWNyZXQiOiI5MDNkZDgyNzUwYzcyZjE2Njk4M2FhZThiNWNkZTZkMDdlMWY2YWFkNGJiNzQyNDNlNGMzOTRmOTZkZDFkMTMwIiwiZXhwIjoxODAxMDA1OTAzfQ.cPnCe_7yo6GpsKIQTzQR04aChyIluN5jMabs-e77iMA';

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
    crash: '#FFD700',
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
  ctx.fillText('Created with Seeker Beat Maker', canvas.width / 2, footerY);
  
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
  
  const beatName = document.getElementById('beatName').value.trim() || 'Seeker Beat';
  
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
      description: `A unique beat created with Seeker Beat Maker. BPM: ${bpm}, Swing: ${swing}%`,
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
      app: 'Seeker Beat Maker',
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
      external_url: 'https://seeker-beat-maker.app',
      attributes: [
        { trait_type: 'BPM', value: beatData.bpm },
        { trait_type: 'Swing', value: `${beatData.swing}%` },
        { trait_type: 'Patterns', value: Object.keys(beatData.patterns).length },
        { trait_type: 'Tracks', value: Object.keys(beatData.patterns.A).length },
        { trait_type: 'App', value: 'Seeker Beat Maker' },
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
    
    // Step 4: Create metadata URI with beat data
    mintStatus.innerHTML = '<span class="mint-spinner"></span> Creating metadata...';
    let metadataUri;
    
    // Ultra-compress patterns: convert each track to hex (16 bits = 4 hex chars)
    const compressToHex = (boolArray) => {
      let binary = boolArray.map(v => v ? '1' : '0').join('');
      return parseInt(binary, 2).toString(16).padStart(4, '0');
    };
    
    // Compress all 7 tracks for a pattern into a 28-char hex string
    const trackOrder = ['kick', 'snare', 'hat', 'clap', 'crash', 'rim', 'tom'];
    
    const compressPattern = (pattern) => {
      let hexString = '';
      trackOrder.forEach(track => {
        hexString += compressToHex(pattern[track] || Array(16).fill(false));
      });
      return hexString;
    };
    
    // Check if pattern is empty
    const isEmpty = (hex) => hex === '0000000000000000000000000000';
    
    // Compress all patterns
    const pA = compressPattern(patterns.A);
    const pB = compressPattern(patterns.B);
    const pC = compressPattern(patterns.C);
    
    // Build the most compact metadata possible
    // Use single char keys: n=name, b=bpm, a/b/c=patterns, s=swing
    let compactMeta;
    
    // Try to fit all 3 patterns with minimal keys
    if (!isEmpty(pC)) {
      // All 3 patterns - use single letter keys, short name
      compactMeta = {
        n: beatName.slice(0, 2),
        b: bpm,
        a: pA,
        B: pB,  // capital B to not conflict with bpm 'b'
        c: pC
      };
      metadataUri = 'data:application/json,' + encodeURIComponent(JSON.stringify(compactMeta));
      console.log('3 patterns, length:', metadataUri.length);
      
      // If too long, remove name
      if (metadataUri.length > 200) {
        delete compactMeta.n;
        metadataUri = 'data:application/json,' + encodeURIComponent(JSON.stringify(compactMeta));
        console.log('Removed name, length:', metadataUri.length);
      }
      
      // If still too long, remove C
      if (metadataUri.length > 200) {
        delete compactMeta.c;
        metadataUri = 'data:application/json,' + encodeURIComponent(JSON.stringify(compactMeta));
        console.log('Removed C, length:', metadataUri.length);
      }
    } else if (!isEmpty(pB)) {
      // Only A and B
      compactMeta = {
        n: beatName.slice(0, 5),
        b: bpm,
        a: pA,
        B: pB
      };
      metadataUri = 'data:application/json,' + encodeURIComponent(JSON.stringify(compactMeta));
    } else {
      // Only A - more room for name
      compactMeta = {
        n: beatName.slice(0, 12),
        b: bpm,
        p: pA
      };
      metadataUri = 'data:application/json,' + encodeURIComponent(JSON.stringify(compactMeta));
    }
    
    // Add swing if non-zero and we have room
    if (swing > 0 && metadataUri.length < 195) {
      compactMeta.s = swing;
      metadataUri = 'data:application/json,' + encodeURIComponent(JSON.stringify(compactMeta));
    }
    
    console.log('Compact metadata content:', JSON.stringify(compactMeta));
    console.log('Final metadata URI length:', metadataUri.length);
    
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
        sellerFeeBasisPoints: 500, // 5% royalty
        creators: [
          {
            address: payer,
            verified: true,
            share: 100,
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
    const trackOrder = ['kick', 'snare', 'hat', 'clap', 'crash', 'rim', 'tom'];
    
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
    // Check for format with all 3 patterns (a, B, c lowercase/mixed keys)
    if (metadata.a && metadata.B && metadata.c && typeof metadata.a === 'string') {
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
      const trackMap = { k: 'kick', s: 'snare', h: 'hat', c: 'clap', r: 'rim', t: 'tom', x: 'crash' };
      
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
      throw new Error('This NFT does not contain beat data. It may not be a Seeker Beat Maker NFT.');
    }
    
    // Store fetched beat data
    fetchedBeatData = beatDataToLoad;
    
    // Set defaults for missing fields
    fetchedBeatData.name = fetchedBeatData.name || metadata.name || metadata.n || 'Loaded Beat';
    fetchedBeatData.bpm = fetchedBeatData.bpm || metadata.b || 120;
    fetchedBeatData.swing = fetchedBeatData.swing || metadata.s || 0;
    
    // Update preview
    document.getElementById('nftPreviewImage').src = metadata.image || '';
    document.getElementById('nftPreviewName').textContent = fetchedBeatData.name;
    document.getElementById('nftPreviewDesc').textContent = metadata.description || 'Beat loaded from NFT';
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