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
    
    const response = await provider.connect();
    walletAddress = response.publicKey.toString();
    connectedWallet = walletType;
    
    const shortAddress = walletAddress.slice(0, 4) + '...' + walletAddress.slice(-4);
    walletBtn.textContent = shortAddress;
    walletBtn.classList.add('connected');
    
    walletStatus.className = 'wallet-status success';
    walletStatus.textContent = 'Connected successfully!';
    
    // Fetch and display balance
    await updateSolBalance();
    
    setTimeout(() => {
      walletModal.classList.remove('show');
      walletStatus.className = 'wallet-status';
    }, 1500);
    
    console.log('Connected to', walletType, 'Address:', walletAddress);
    
  } catch (error) {
    console.error('Wallet connection error:', error);
    walletStatus.className = 'wallet-status error';
    walletStatus.textContent = error.message || 'Failed to connect wallet';
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
const NFT_STORAGE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGZFYTg0NjMyMTc1NjUwOTY1M0I0NjkyMDNGNkI2MkFBNDMzOTU5QmMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTcwMTM4MDgwMDAwMCwibmFtZSI6InNlZWtlci1iZWF0LW1ha2VyIn0.demo-key-replace-with-your-own';

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

// Upload to IPFS via NFT.Storage
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
  
  const response = await fetch('https://api.nft.storage/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NFT_STORAGE_API_KEY}`
    },
    body: formData
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`IPFS upload failed: ${errorText}`);
  }
  
  const result = await response.json();
  return `https://ipfs.io/ipfs/${result.value.cid}`;
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
    
    // Step 4: Upload metadata to IPFS
    mintStatus.innerHTML = '<span class="mint-spinner"></span> Uploading metadata to IPFS...';
    let metadataUri;
    try {
      metadataUri = await uploadToIPFS(metadataJson, `${beatName.replace(/\s+/g, '-')}-metadata.json`, 'application/json');
      console.log('Metadata uploaded to IPFS:', metadataUri);
    } catch (ipfsError) {
      console.warn('IPFS metadata upload failed, using fallback:', ipfsError);
      metadataUri = await uploadToIPFSFallback(metadataJson, false);
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
    
    // Step 6: Mint the NFT
    mintStatus.innerHTML = '<span class="mint-spinner"></span> Minting your NFT... Please approve the transaction in your wallet.';
    
    const { Metaplex, walletAdapterIdentity } = window.Metaplex;
    
    const metaplex = Metaplex.make(connection).use(walletAdapterIdentity({
      publicKey: new solanaWeb3.PublicKey(walletAddress),
      signTransaction: async (tx) => walletProvider.signTransaction(tx),
      signAllTransactions: async (txs) => walletProvider.signAllTransactions(txs),
      signMessage: async (msg) => walletProvider.signMessage(msg),
    }));
    
    const { nft } = await metaplex.nfts().create({
      uri: metadataUri,
      name: beatData.name,
      symbol: beatData.symbol,
      sellerFeeBasisPoints: 500, // 5% royalty
      creators: [
        {
          address: new solanaWeb3.PublicKey(walletAddress),
          share: 100
        }
      ]
    });
    
    // Step 7: Update balance after minting (fees deducted)
    await updateSolBalance();
    
    // Success!
    const isIPFS = metadataUri.startsWith('https://ipfs.io') || metadataUri.startsWith('ipfs://');
    
    mintStatus.className = 'mint-status show success';
    mintStatus.innerHTML = `
      ✅ NFT Minted Successfully!<br><br>
      <strong>Mint Address:</strong> ${nft.address.toString()}<br>
      <strong>Storage:</strong> ${isIPFS ? '🌐 IPFS (Permanent)' : '📦 Data URI (Temporary)'}<br><br>
      <a href="https://explorer.solana.com/address/${nft.address.toString()}?cluster=${SOLANA_NETWORK}" target="_blank">
        View on Solana Explorer →
      </a>
      ${isIPFS ? `<br><a href="${metadataUri}" target="_blank">View Metadata on IPFS →</a>` : ''}
    `;
    
    mintOutput.textContent = JSON.stringify({
      success: true,
      network: SOLANA_NETWORK,
      mintAddress: nft.address.toString(),
      metadataUri: metadataUri,
      imageUri: imageUri,
      storageType: isIPFS ? 'IPFS' : 'Data URI',
      metadata: metadataJson
    }, null, 2);
    
    console.log('NFT minted successfully:', nft);
    
  } catch (error) {
    console.error('Minting error:', error);
    mintStatus.className = 'mint-status show error';
    mintStatus.innerHTML = `❌ Minting failed: ${error.message || 'Unknown error'}`;
    mintOutput.textContent = JSON.stringify({ error: error.message }, null, 2);
  }
};