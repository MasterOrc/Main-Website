/**
 * Audio Manager for Click n' Clank v2
 * Handles all sound effects, background music, and audio settings
 */

class AudioManager {
  constructor() {
    // Audio settings with defaults
    this.settings = {
      musicEnabled: true,
      soundEnabled: true,
      musicVolume: 0.05,
      soundVolume: 0.3
    };
    
    // Audio instances
    this.backgroundMusic = null;
    this.audioInstances = new Map();
    
    // Load settings from localStorage
    this.loadSettings();
    
    // Initialize audio
    this.initializeAudio();
  }

  /**
   * Initialize all audio instances
   */
  initializeAudio() {
    // Background music
    this.backgroundMusic = new Audio("./assets/Audio/bgm.mp3");
    this.backgroundMusic.volume = this.settings.musicVolume;
    this.backgroundMusic.loop = true;
    
    // Pre-load sound effects for better performance
    this.preloadSounds();
    
    // Start background music if enabled
    if (this.settings.musicEnabled) {
      this.playBackgroundMusic();
    }
  }

  /**
   * Pre-load common sound effects
   */
  preloadSounds() {
    const soundFiles = [
      { key: 'click', src: './assets/Audio/click.wav' },
      { key: 'upgrade', src: './assets/Audio/upgrade.mp3' }
    ];

    soundFiles.forEach(({ key, src }) => {
      const audio = new Audio(src);
      audio.volume = this.settings.soundVolume;
      this.audioInstances.set(key, audio);
    });
  }

  /**
   * Play a sound effect
   * @param {string} soundKey - The key for the sound to play
   * @param {number} volume - Optional volume override (0-1)
   */
  playSound(soundKey, volume = null) {
    if (!this.settings.soundEnabled) return;

    const audio = this.audioInstances.get(soundKey);
    if (!audio) {
      console.warn(`Sound not found: ${soundKey}`);
      return;
    }

    // Create a new instance to allow overlapping sounds
    const soundInstance = audio.cloneNode();
    soundInstance.volume = volume !== null ? volume : this.settings.soundVolume;
    
    soundInstance.play().catch(e => {
      console.log(`Could not play sound ${soundKey}:`, e.message);
    });
  }

  /**
   * Play background music
   */
  playBackgroundMusic() {
    if (!this.settings.musicEnabled || !this.backgroundMusic) return;

    this.backgroundMusic.play().catch(e => {
      console.log('Could not play background music:', e.message);
    });
  }

  /**
   * Stop background music
   */
  stopBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
    }
  }

  /**
   * Toggle music on/off
   */
  toggleMusic() {
    this.settings.musicEnabled = !this.settings.musicEnabled;
    
    if (this.settings.musicEnabled) {
      this.playBackgroundMusic();
    } else {
      this.stopBackgroundMusic();
    }
    
    this.saveSettings();
    this.updateUIControls();
  }

  /**
   * Toggle sound effects on/off
   */
  toggleSound() {
    this.settings.soundEnabled = !this.settings.soundEnabled;
    this.saveSettings();
    this.updateUIControls();
  }

  /**
   * Set music volume
   * @param {number} volume - Volume level (0-1)
   */
  setMusicVolume(volume) {
    this.settings.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = this.settings.musicVolume;
    }
    this.saveSettings();
  }

  /**
   * Set sound effects volume
   * @param {number} volume - Volume level (0-1)
   */
  setSoundVolume(volume) {
    this.settings.soundVolume = Math.max(0, Math.min(1, volume));
    // Update all preloaded sounds
    this.audioInstances.forEach(audio => {
      audio.volume = this.settings.soundVolume;
    });
    this.saveSettings();
  }

  /**
   * Update UI control states
   */
  updateUIControls() {
    const musicBtn = document.getElementById('music-toggle');
    const soundBtn = document.getElementById('sound-toggle');
    
    if (musicBtn) {
      musicBtn.classList.toggle('disabled', !this.settings.musicEnabled);
      musicBtn.innerHTML = this.settings.musicEnabled ? '🎵' : '🔇';
      musicBtn.title = this.settings.musicEnabled ? 'Music: On' : 'Music: Off';
    }
    
    if (soundBtn) {
      soundBtn.classList.toggle('disabled', !this.settings.soundEnabled);
      soundBtn.innerHTML = this.settings.soundEnabled ? '🔊' : '🔇';
      soundBtn.title = this.settings.soundEnabled ? 'Sound: On' : 'Sound: Off';
    }

    // Update volume sliders if they exist
    const musicVolumeSlider = document.getElementById('music-volume');
    const soundVolumeSlider = document.getElementById('sound-volume');
    
    if (musicVolumeSlider) {
      musicVolumeSlider.value = this.settings.musicVolume;
    }
    
    if (soundVolumeSlider) {
      soundVolumeSlider.value = this.settings.soundVolume;
    }
  }

  /**
   * Save audio settings to localStorage
   */
  saveSettings() {
    localStorage.setItem('cnc_audio_settings', JSON.stringify(this.settings));
  }

  /**
   * Load audio settings from localStorage
   */
  loadSettings() {
    try {
      const saved = localStorage.getItem('cnc_audio_settings');
      if (saved) {
        const loadedSettings = JSON.parse(saved);
        this.settings = { ...this.settings, ...loadedSettings };
      }
    } catch (error) {
      console.log('Could not load audio settings:', error.message);
    }
  }

  /**
   * Get current audio settings
   * @returns {Object} Current audio settings
   */
  getSettings() {
    return { ...this.settings };
  }
}

// Export singleton instance
const audioManager = new AudioManager();
export default audioManager;