// main.js - Main game state and logic for Click n' Clank v2

import { UpgradeManager } from './upgrades.js';
import { GamblingManager } from './gamble.js';

// Game state class
class GameState {
    constructor() {
        // Core game state
        this.gears = 0;
        this.gearsPerClick = 1;
        this.gearsPerSecond = 0;
        
        // Game elements
        this.gearCountDisplay = null;
        this.gearsPerClickDisplay = null;
        this.gearsPerSecondDisplay = null;
        this.mainGear = null;
        this.gearContainer = null;
        this.notificationElement = null;
        
        // Audio elements
        this.clickSound = null;
        this.upgradeSound = null;
        this.bgMusic = null;
        
        // Managers
        this.upgradeManager = null;
        this.gamblingManager = null;
        
        // Game loop
        this.gameLoopId = null;
        this.autoSaveId = null;
        
        this.initialize();
    }

    initialize() {
        this.setupElements();
        this.setupAudio();
        this.setupManagers();
        this.setupEventListeners();
        this.startGameLoop();
        this.startAutoSave();
        this.updateTitle();
    }

    setupElements() {
        this.gearCountDisplay = document.getElementById('gear-count');
        this.gearsPerClickDisplay = document.getElementById('gears-per-click');
        this.gearsPerSecondDisplay = document.getElementById('gears-per-second');
        this.mainGear = document.getElementById('main-gear');
        this.gearContainer = document.getElementById('gear-container');
        this.notificationElement = document.getElementById('notification');
    }

    setupAudio() {
        // Initialize audio with error handling
        try {
            this.clickSound = new Audio('../assets/Audio/click.wav');
            this.clickSound.volume = 0.3;
            
            this.upgradeSound = new Audio('../assets/Audio/upgrade.mp3');
            this.upgradeSound.volume = 0.1;
            
            this.bgMusic = new Audio('../assets/Audio/bgm.mp3');
            this.bgMusic.volume = 0.05;
            this.bgMusic.loop = true;
        } catch (error) {
            console.warn('Audio setup failed:', error);
        }
    }

    setupManagers() {
        this.upgradeManager = new UpgradeManager(this);
        this.gamblingManager = new GamblingManager(this);
        
        // Render upgrades
        const upgradesContainer = document.getElementById('upgrades-container');
        this.upgradeManager.render(upgradesContainer);
    }

    setupEventListeners() {
        // Main gear clicking
        this.mainGear.addEventListener('click', (event) => this.handleGearClick(event));
        
        // Action buttons
        document.getElementById('save-btn').addEventListener('click', () => this.saveGame());
        document.getElementById('load-btn').addEventListener('click', () => this.loadGame());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            switch(event.key.toLowerCase()) {
                case 's':
                    if (event.ctrlKey || event.metaKey) {
                        event.preventDefault();
                        this.saveGame();
                    }
                    break;
                case 'l':
                    if (event.ctrlKey || event.metaKey) {
                        event.preventDefault();
                        this.loadGame();
                    }
                    break;
                case 'g':
                    if (!event.ctrlKey && !event.metaKey) {
                        this.gamblingManager.openModal();
                    }
                    break;
                case ' ':
                    event.preventDefault();
                    this.handleGearClick({ target: this.mainGear, offsetX: 100, offsetY: 100 });
                    break;
            }
        });

        // Window event handlers
        window.addEventListener('beforeunload', () => {
            this.saveGame();
        });

        // Visibility change handler for audio
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (this.bgMusic) this.bgMusic.pause();
            } else {
                this.tryPlayBgMusic();
            }
        });
    }

    handleGearClick(event) {
        // Add gears
        this.gears += this.gearsPerClick;
        
        // Play sound
        this.playClickSound();
        
        // Create floating text animation
        this.createFloatingText(event, `+${Math.round(this.gearsPerClick)}`);
        
        // Add gear rotation animation
        this.addGearClickAnimation();
        
        // Update display
        this.updateDisplay();
        this.updateTitle();
    }

    createFloatingText(event, text) {
        const floatingText = document.createElement('div');
        floatingText.className = 'floating-text';
        floatingText.textContent = text;
        
        // Position relative to gear container
        const rect = this.gearContainer.getBoundingClientRect();
        const x = (event.offsetX || rect.width / 2) - 20;
        const y = (event.offsetY || rect.height / 2) - 10;
        
        floatingText.style.left = `${x}px`;
        floatingText.style.top = `${y}px`;
        
        this.gearContainer.appendChild(floatingText);
        
        // Remove after animation
        setTimeout(() => {
            if (floatingText.parentNode) {
                floatingText.parentNode.removeChild(floatingText);
            }
        }, 1000);
    }

    addGearClickAnimation() {
        this.mainGear.classList.remove('clicked');
        // Force reflow
        void this.mainGear.offsetWidth;
        this.mainGear.classList.add('clicked');
    }

    startGameLoop() {
        const gameLoop = () => {
            // Add passive income
            this.gears += this.gearsPerSecond / 10; // 10 updates per second
            
            // Update display
            this.updateDisplay();
            this.updateTitle();
            
            // Update upgrade affordability
            this.upgradeManager.updateDisplay();
            
            // Try to play background music
            this.tryPlayBgMusic();
            
            this.gameLoopId = requestAnimationFrame(gameLoop);
        };
        
        gameLoop();
    }

    startAutoSave() {
        // Auto-save every 3 minutes
        this.autoSaveId = setInterval(() => {
            this.saveGame(true);
        }, 180000);
    }

    updateDisplay() {
        this.gearCountDisplay.textContent = Math.floor(this.gears);
        this.gearsPerClickDisplay.textContent = Math.round(this.gearsPerClick * 10) / 10;
        this.gearsPerSecondDisplay.textContent = Math.round(this.gearsPerSecond * 10) / 10;
    }

    updateTitle() {
        document.title = `Gears: ${Math.floor(this.gears)} | Click n' Clank v2`;
    }

    showNotification(message, duration = 3000) {
        const notificationText = document.getElementById('notification-text');
        notificationText.textContent = message;
        this.notificationElement.classList.remove('hidden');
        
        // Clear existing timeout
        if (this.notificationTimeout) {
            clearTimeout(this.notificationTimeout);
        }
        
        // Hide after duration
        this.notificationTimeout = setTimeout(() => {
            this.notificationElement.classList.add('hidden');
        }, duration);
    }

    // Audio methods
    playClickSound() {
        if (this.clickSound) {
            this.clickSound.currentTime = 0;
            this.clickSound.play().catch(() => {}); // Ignore play failures
        }
    }

    playUpgradeSound() {
        if (this.upgradeSound) {
            this.upgradeSound.currentTime = 0;
            this.upgradeSound.play().catch(() => {}); // Ignore play failures
        }
    }

    tryPlayBgMusic() {
        if (this.bgMusic && this.bgMusic.paused && !document.hidden) {
            this.bgMusic.play().catch(() => {}); // Ignore play failures
        }
    }

    // Save/Load functionality
    saveGame(isAutoSave = false) {
        const saveData = {
            version: '2.0',
            timestamp: Date.now(),
            gears: this.gears,
            gearsPerClick: this.gearsPerClick,
            gearsPerSecond: this.gearsPerSecond,
            upgrades: this.upgradeManager.getSaveData(),
            gambling: this.gamblingManager.getSaveData()
        };

        try {
            localStorage.setItem('click_n_clank_v2_save', JSON.stringify(saveData));
            
            const message = isAutoSave ? 'Game auto-saved' : 'Game saved successfully!';
            this.showNotification(message);
        } catch (error) {
            console.error('Save failed:', error);
            this.showNotification('Save failed! Storage may be full.', 5000);
        }
    }

    loadGame() {
        try {
            const saveDataString = localStorage.getItem('click_n_clank_v2_save');
            if (!saveDataString) {
                this.showNotification('No save data found!', 3000);
                return false;
            }

            const saveData = JSON.parse(saveDataString);
            
            // Load basic game state
            this.gears = saveData.gears || 0;
            this.gearsPerClick = saveData.gearsPerClick || 1;
            this.gearsPerSecond = saveData.gearsPerSecond || 0;
            
            // Load managers data
            if (saveData.upgrades) {
                this.upgradeManager.loadSaveData(saveData.upgrades);
            }
            if (saveData.gambling) {
                this.gamblingManager.loadSaveData(saveData.gambling);
            }
            
            // Update displays
            this.updateDisplay();
            this.updateTitle();
            this.upgradeManager.updateDisplay();
            
            this.showNotification('Game loaded successfully!');
            return true;
        } catch (error) {
            console.error('Load failed:', error);
            this.showNotification('Load failed! Save data may be corrupted.', 5000);
            return false;
        }
    }

    // Legacy save migration (if needed)
    tryMigrateLegacySave() {
        // Check for v1 save data and migrate if needed
        const legacyKeys = ['gears_per_click', 'gears_per_second', 'gear'];
        const hasLegacyData = legacyKeys.some(key => localStorage.getItem(key) !== null);
        
        if (hasLegacyData && !localStorage.getItem('click_n_clank_v2_save')) {
            try {
                this.gears = parseFloat(localStorage.getItem('gear')) || 0;
                this.gearsPerClick = parseFloat(localStorage.getItem('gears_per_click')) || 1;
                this.gearsPerSecond = parseFloat(localStorage.getItem('gears_per_second')) || 0;
                
                this.saveGame();
                this.showNotification('Legacy save data migrated to v2!', 5000);
            } catch (error) {
                console.warn('Legacy migration failed:', error);
            }
        }
    }

    // Cleanup
    destroy() {
        if (this.gameLoopId) {
            cancelAnimationFrame(this.gameLoopId);
        }
        if (this.autoSaveId) {
            clearInterval(this.autoSaveId);
        }
        if (this.notificationTimeout) {
            clearTimeout(this.notificationTimeout);
        }
        
        // Stop audio
        if (this.bgMusic) {
            this.bgMusic.pause();
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new GameState();
    
    // Try to migrate legacy saves
    game.tryMigrateLegacySave();
    
    // Try to load existing save
    game.loadGame();
    
    // Make game globally accessible for debugging
    window.gameState = game;
    
    console.log('Click n\' Clank v2 initialized!');
    console.log('Keyboard shortcuts:');
    console.log('- Space: Click gear');
    console.log('- G: Open gambling');
    console.log('- Ctrl+S: Save game');
    console.log('- Ctrl+L: Load game');
});