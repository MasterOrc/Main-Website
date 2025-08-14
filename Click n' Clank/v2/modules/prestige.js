/**
 * Prestige Manager for Click n' Clank v2
 * Handles prestige system mechanics, UI, and progression
 */

import { 
  PRESTIGE_REQUIREMENTS, 
  PRESTIGE_UPGRADES,
  DEFAULT_PRESTIGE_STATE,
  calculatePrestigePoints,
  calculatePrestigeUpgradeCost,
  canPrestige,
  getPrestigeUpgrade
} from '../Constants/prestige.js';
import { showNotification } from './notifications.js';
import audioManager from './audio.js';

class PrestigeManager {
  constructor() {
    this.prestigeState = { ...DEFAULT_PRESTIGE_STATE };
    this.isPrestigeModalOpen = false;
    this.updateInterval = null; // For live updates
    
    // Bind methods for HTML event handlers
    this.togglePrestigeModal = this.togglePrestigeModal.bind(this);
    this.confirmPrestige = this.confirmPrestige.bind(this);
    this.buyPrestigeUpgrade = this.buyPrestigeUpgrade.bind(this);
    
    this.loadPrestigeState();
    this.initializePrestigeUI();
  }

  /**
   * Initialize prestige UI elements
   */
  initializePrestigeUI() {
    this.createPrestigeButton();
    this.createPrestigeModal();
    this.updatePrestigeDisplay();
  }

  /**
   * Create the prestige button in the util buttons area
   */
  createPrestigeButton() {
    const utilButtons = document.querySelector('.util-buttons');
    if (!utilButtons) return;

    const prestigeButton = document.createElement('button');
    prestigeButton.id = 'prestige-button';
    prestigeButton.className = 'util-button prestige-button';
    prestigeButton.innerHTML = '⭐ Prestige';
    prestigeButton.onclick = this.togglePrestigeModal;
    prestigeButton.title = 'Reset progress for permanent bonuses';

    // Insert before audio controls
    const audioControls = utilButtons.querySelector('.audio-controls');
    if (audioControls) {
      utilButtons.insertBefore(prestigeButton, audioControls);
    } else {
      utilButtons.appendChild(prestigeButton);
    }

    this.prestigeButton = prestigeButton;
  }

  /**
   * Create the prestige modal HTML
   */
  createPrestigeModal() {
    const modalHTML = `
      <div id="prestige-modal" class="prestige-modal">
        <div class="prestige-modal-content">
          <div class="prestige-header">
            <h2>⭐ Prestige System</h2>
            <button class="close-prestige" onclick="prestigeManager.togglePrestigeModal()">×</button>
          </div>
          
          <div class="prestige-tabs">
            <button class="prestige-tab active" data-tab="overview">Overview</button>
            <button class="prestige-tab" data-tab="upgrades">Upgrades</button>
            <button class="prestige-tab" data-tab="stats">Stats</button>
          </div>
          
          <div class="prestige-tab-content">
            <!-- Overview Tab -->
            <div id="prestige-overview" class="tab-content active">
              <div class="prestige-info">
                <div class="prestige-stats">
                  <p><strong>Prestige Points Available:</strong> <span id="current-prestige-points">0</span></p>
                  <p><strong>Total Prestiges:</strong> <span id="total-prestiges">0</span></p>
                </div>
                
                <div class="prestige-requirements" id="prestige-requirements">
                  <h3>Prestige Requirements:</h3>
                  <ul id="requirements-list">
                    <li id="req-gears">Total Gears: <span class="requirement-status">0 / 1,000,000</span></li>
                    <li id="req-upgrade">Max Upgrade Level: <span class="requirement-status">0 / 25</span></li>
                    <li id="req-gps">Gears Per Second: <span class="requirement-status">0 / 1,000</span></li>
                  </ul>
                </div>
                
                <div class="prestige-rewards">
                  <h3>Prestige Rewards:</h3>
                  <p>You will gain <strong><span id="prestige-points-reward">0</span></strong> Prestige Points</p>
                  <p class="prestige-warning">⚠️ This will reset most progress but keep achievements and prestige upgrades!</p>
                </div>
                
                <button id="confirm-prestige-btn" class="prestige-confirm-btn" disabled 
                        onclick="prestigeManager.confirmPrestige()">Prestige Now!</button>
              </div>
            </div>
            
            <!-- Upgrades Tab -->
            <div id="prestige-upgrades" class="tab-content">
              <div class="prestige-upgrades-list" id="prestige-upgrades-list">
                <!-- Dynamically generated -->
              </div>
            </div>
            
            <!-- Stats Tab -->
            <div id="prestige-stats" class="tab-content">
              <div class="prestige-statistics">
                <h3>Prestige Statistics</h3>
                <p><strong>Total Prestiges:</strong> <span id="stats-total-prestiges">0</span></p>
                <p><strong>Lifetime Prestige Points:</strong> <span id="stats-lifetime-pp">0</span></p>
                <p><strong>Lifetime Gears:</strong> <span id="stats-lifetime-gears">0</span></p>
                
                <h3>Active Bonuses</h3>
                <div id="active-bonuses-list">
                  <!-- Dynamically generated -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add tab switching functionality
    this.setupPrestigeTabs();
    this.renderPrestigeUpgrades();
  }

  /**
   * Setup tab switching for prestige modal
   */
  setupPrestigeTabs() {
    const tabs = document.querySelectorAll('.prestige-tab');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        
        // Remove active from all tabs and contents
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        
        // Add active to clicked tab and corresponding content
        tab.classList.add('active');
        const targetContent = document.getElementById(`prestige-${targetTab}`);
        if (targetContent) {
          targetContent.classList.add('active');
        }
        
        // Update displays when switching tabs
        this.updatePrestigeDisplay();
      });
    });
  }

  /**
   * Render prestige upgrades in the upgrades tab
   */
  renderPrestigeUpgrades() {
    const container = document.getElementById('prestige-upgrades-list');
    if (!container) return;

    container.innerHTML = '';

    PRESTIGE_UPGRADES.forEach(upgrade => {
      const currentLevel = this.prestigeState.prestigeUpgrades[upgrade.id] || 0;
      const cost = calculatePrestigeUpgradeCost(upgrade, currentLevel);
      const isMaxLevel = currentLevel >= upgrade.maxLevel;
      const canAfford = this.prestigeState.prestigePoints >= cost && !isMaxLevel;

      const upgradeHTML = `
        <div class="prestige-upgrade ${canAfford ? 'affordable' : ''} ${isMaxLevel ? 'max-level' : ''}" 
             data-upgrade="${upgrade.id}">
          <div class="prestige-upgrade-icon">${upgrade.icon}</div>
          <div class="prestige-upgrade-info">
            <h4>${upgrade.name}</h4>
            <p>${upgrade.description}</p>
            <div class="prestige-upgrade-level">
              Level: ${currentLevel}/${upgrade.maxLevel}
              ${!isMaxLevel ? `<span class="prestige-upgrade-cost">(${cost} PP)</span>` : '<span class="max-level-text">MAX</span>'}
            </div>
          </div>
          <button class="prestige-upgrade-btn ${canAfford ? '' : 'disabled'}" 
                  ${isMaxLevel || !canAfford ? 'disabled' : ''} 
                  onclick="prestigeManager.buyPrestigeUpgrade('${upgrade.id}')">
            ${isMaxLevel ? 'MAX' : 'Buy'}
          </button>
        </div>
      `;

      container.insertAdjacentHTML('beforeend', upgradeHTML);
    });
  }

  /**
   * Toggle prestige modal visibility
   */
  togglePrestigeModal() {
    const modal = document.getElementById('prestige-modal');
    if (!modal) return;

    this.isPrestigeModalOpen = !this.isPrestigeModalOpen;
    modal.classList.toggle('open', this.isPrestigeModalOpen);
    
    if (this.isPrestigeModalOpen) {
      this.updatePrestigeDisplay();
      // Start live updates every second
      this.updateInterval = setInterval(() => {
        this.updatePrestigeDisplay();
      }, 1000);
    } else {
      // Stop live updates when modal is closed
      if (this.updateInterval) {
        clearInterval(this.updateInterval);
        this.updateInterval = null;
      }
    }
  }

  /**
   * Update prestige displays with current game state
   */
  updatePrestigeDisplay() {
    this.updatePrestigeButton();
    this.updatePrestigeRequirements();
    this.updatePrestigeStats();
    this.updateActiveBonuses();
    this.renderPrestigeUpgrades(); // Refresh upgrade affordability
  }

  /**
   * Update prestige button state
   */
  updatePrestigeButton() {
    if (!this.prestigeButton) return;

    const gameState = this.getCurrentGameState();
    const canPrestigeNow = canPrestige(gameState);
    
    this.prestigeButton.classList.toggle('available', canPrestigeNow);
    this.prestigeButton.disabled = false; // Always allow opening the modal
    
    if (canPrestigeNow) {
      this.prestigeButton.innerHTML = '⭐ Prestige Ready!';
      this.prestigeButton.title = 'You can prestige now!';
    } else {
      this.prestigeButton.innerHTML = '⭐ Prestige';
      this.prestigeButton.title = 'Reset progress for permanent bonuses';
    }
  }

  /**
   * Update prestige requirements display
   */
  updatePrestigeRequirements() {
    const gameState = this.getCurrentGameState();
    const { totalGears, gears_per_second, upgrades } = gameState;
    
    // Get max upgrade level
    const maxUpgradeLevel = upgrades.reduce((max, upgrade) => {
      const level = parseFloat(upgrade.level.innerHTML) || 0;
      return Math.max(max, level);
    }, 0);

    // Update requirement displays
    const reqGears = document.getElementById('req-gears');
    const reqUpgrade = document.getElementById('req-upgrade');
    const reqGps = document.getElementById('req-gps');
    const confirmBtn = document.getElementById('confirm-prestige-btn');
    const pointsReward = document.getElementById('prestige-points-reward');

    if (reqGears) {
      const gearsOK = totalGears >= PRESTIGE_REQUIREMENTS.minTotalGears;
      reqGears.className = gearsOK ? 'requirement-met' : 'requirement-not-met';
      reqGears.querySelector('.requirement-status').textContent = 
        `${totalGears.toLocaleString()} / ${PRESTIGE_REQUIREMENTS.minTotalGears.toLocaleString()}`;
    }

    if (reqUpgrade) {
      const upgradeOK = maxUpgradeLevel >= PRESTIGE_REQUIREMENTS.minUpgradeLevel;
      reqUpgrade.className = upgradeOK ? 'requirement-met' : 'requirement-not-met';
      reqUpgrade.querySelector('.requirement-status').textContent = 
        `${maxUpgradeLevel} / ${PRESTIGE_REQUIREMENTS.minUpgradeLevel}`;
    }

    if (reqGps) {
      const gpsOK = gears_per_second >= PRESTIGE_REQUIREMENTS.minGearsPerSecond;
      reqGps.className = gpsOK ? 'requirement-met' : 'requirement-not-met';
      reqGps.querySelector('.requirement-status').textContent = 
        `${gears_per_second.toLocaleString()} / ${PRESTIGE_REQUIREMENTS.minGearsPerSecond.toLocaleString()}`;
    }

    // Update prestige reward and button
    const prestigePoints = calculatePrestigePoints(totalGears);
    if (pointsReward) {
      pointsReward.textContent = prestigePoints;
    }

    if (confirmBtn) {
      const canPrestigeNow = canPrestige(gameState);
      confirmBtn.disabled = !canPrestigeNow;
      confirmBtn.className = `prestige-confirm-btn ${canPrestigeNow ? 'enabled' : ''}`;
    }
  }

  /**
   * Update prestige stats display
   */
  updatePrestigeStats() {
    const elements = {
      'current-prestige-points': this.prestigeState.prestigePoints,
      'total-prestiges': this.prestigeState.totalPrestiges,
      'stats-total-prestiges': this.prestigeState.totalPrestiges,
      'stats-lifetime-pp': this.prestigeState.totalPrestigePoints,
      'stats-lifetime-gears': this.prestigeState.lifetimeGears
    };

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = typeof value === 'number' ? value.toLocaleString() : value;
      }
    });
  }

  /**
   * Update active bonuses display
   */
  updateActiveBonuses() {
    const container = document.getElementById('active-bonuses-list');
    if (!container) return;

    container.innerHTML = '';

    PRESTIGE_UPGRADES.forEach(upgrade => {
      const level = this.prestigeState.prestigeUpgrades[upgrade.id] || 0;
      if (level > 0) {
        const effect = upgrade.effect(level);
        let effectText = '';

        switch (upgrade.id) {
          case 'click_multiplier':
          case 'gear_multiplier':
          case 'passive_boost':
          case 'achievement_boost':
          case 'time_warp':
            effectText = `${(effect * 100).toFixed(1)}% multiplier`;
            break;
          case 'cost_reduction':
            effectText = `${((1 - effect) * 100).toFixed(1)}% cost reduction`;
            break;
          case 'starting_bonus':
            effectText = `${effect.toLocaleString()} starting gears`;
            break;
          case 'critical_chance':
            effectText = `+${(effect * 100).toFixed(1)}% critical chance`;
            break;
        }

        const bonusHTML = `
          <div class="active-bonus">
            <span class="bonus-icon">${upgrade.icon}</span>
            <span class="bonus-name">${upgrade.name} (Lv.${level})</span>
            <span class="bonus-effect">${effectText}</span>
          </div>
        `;
        container.insertAdjacentHTML('beforeend', bonusHTML);
      }
    });

    if (container.children.length === 0) {
      container.innerHTML = '<p class="no-bonuses">No active bonuses yet. Buy prestige upgrades to gain permanent bonuses!</p>';
    }
  }

  /**
   * Buy a prestige upgrade
   */
  buyPrestigeUpgrade(upgradeId) {
    const upgrade = getPrestigeUpgrade(upgradeId);
    if (!upgrade) return;

    const currentLevel = this.prestigeState.prestigeUpgrades[upgradeId] || 0;
    const cost = calculatePrestigeUpgradeCost(upgrade, currentLevel);

    if (this.prestigeState.prestigePoints < cost || currentLevel >= upgrade.maxLevel) {
      showNotification('Cannot afford this upgrade!', 'error');
      return;
    }

    // Purchase upgrade
    this.prestigeState.prestigePoints -= cost;
    this.prestigeState.prestigeUpgrades[upgradeId] = currentLevel + 1;

    // Play upgrade sound
    audioManager.playSound('upgrade', 0.2);

    // Show success notification
    showNotification(`${upgrade.name} upgraded to level ${currentLevel + 1}!`, 'success');

    // Update displays
    this.updatePrestigeDisplay();
    this.savePrestigeState();

    // Apply bonuses immediately
    this.applyPrestigeBonuses();
  }

  /**
   * Confirm and execute prestige
   */
  confirmPrestige() {
    const gameState = this.getCurrentGameState();
    
    if (!canPrestige(gameState)) {
      showNotification('You do not meet the prestige requirements yet!', 'error');
      return;
    }

    // Calculate prestige points to award
    const prestigePoints = calculatePrestigePoints(gameState.totalGears);
    
    // Update prestige state
    this.prestigeState.totalPrestiges += 1;
    this.prestigeState.prestigePoints += prestigePoints;
    this.prestigeState.totalPrestigePoints += prestigePoints;
    this.prestigeState.lifetimeGears += gameState.totalGears;

    // Close modal
    this.togglePrestigeModal();

    // Show prestige notification
    showNotification(`Prestige complete! Gained ${prestigePoints} Prestige Points!`, 'achievement', 5000);
    audioManager.playSound('upgrade', 0.5);

    // Save prestige state
    this.savePrestigeState();

    // Reset the game (this will be called from the main game)
    if (window.executePrestige) {
      window.executePrestige();
    }

    // Apply prestige bonuses
    setTimeout(() => {
      this.applyPrestigeBonuses();
    }, 100);
  }

  /**
   * Apply prestige bonuses to the current game state
   */
  applyPrestigeBonuses() {
    // This method will be called by the main game to apply bonuses
    // The main game will read from this.getPrestigeBonuses()
  }

  /**
   * Get all prestige bonuses as multipliers/values
   */
  getPrestigeBonuses() {
    const bonuses = {
      clickMultiplier: 1,
      gearMultiplier: 1,
      costReduction: 1,
      startingGears: 0,
      criticalChance: 0,
      passiveBoost: 1,
      achievementBoost: 1,
      timeWarp: 1
    };

    PRESTIGE_UPGRADES.forEach(upgrade => {
      const level = this.prestigeState.prestigeUpgrades[upgrade.id] || 0;
      if (level > 0) {
        const effect = upgrade.effect(level);
        
        switch (upgrade.id) {
          case 'click_multiplier':
            bonuses.clickMultiplier = effect;
            break;
          case 'gear_multiplier':
            bonuses.gearMultiplier = effect;
            break;
          case 'cost_reduction':
            bonuses.costReduction = effect;
            break;
          case 'starting_bonus':
            bonuses.startingGears = effect;
            break;
          case 'critical_chance':
            bonuses.criticalChance = effect;
            break;
          case 'passive_boost':
            bonuses.passiveBoost = effect;
            break;
          case 'achievement_boost':
            bonuses.achievementBoost = effect;
            break;
          case 'time_warp':
            bonuses.timeWarp = effect;
            break;
        }
      }
    });

    return bonuses;
  }

  /**
   * Get current game state for prestige calculations
   */
  getCurrentGameState() {
    return {
      totalGears: window.totalGears || 0,
      gears_per_second: window.gears_per_second || 0,
      upgrades: window.upgrades || []
    };
  }

  /**
   * Save prestige state to localStorage
   */
  savePrestigeState() {
    localStorage.setItem('cnc_prestige_state', JSON.stringify(this.prestigeState));
  }

  /**
   * Load prestige state from localStorage
   */
  loadPrestigeState() {
    try {
      const saved = localStorage.getItem('cnc_prestige_state');
      if (saved) {
        const loadedState = JSON.parse(saved);
        this.prestigeState = { ...DEFAULT_PRESTIGE_STATE, ...loadedState };
      }
    } catch (error) {
      console.error('Failed to load prestige state:', error);
    }
  }

  /**
   * Reset prestige state (for testing or reset)
   */
  resetPrestigeState() {
    this.prestigeState = { ...DEFAULT_PRESTIGE_STATE };
    this.savePrestigeState();
    this.updatePrestigeDisplay();
    showNotification('Prestige state reset!', 'info');
  }

  /**
   * Get prestige state for external access
   */
  getPrestigeState() {
    return { ...this.prestigeState };
  }
}

// Export singleton instance
const prestigeManager = new PrestigeManager();
export default prestigeManager;