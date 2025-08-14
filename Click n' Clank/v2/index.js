import { powerUpIntervals, upgrades } from "./Constants/upgrades.js";
import AchievementManager from './modules/achievements.js';
import animationManager from './modules/animations.js';
import audioManager from './modules/audio.js';
import prestigeManager from './modules/prestige.js';
import { 
  showNotification, 
  showUpgradeSuccess, 
  showCriticalHit, 
  showInsufficientFunds,
  showSaveSuccess,
  showLoadSuccess,
  showAutoSave
} from './modules/notifications.js';

// Game state variables
let gear = document.querySelector(".gear-cost");
let parsedGear = parseFloat(gear.innerHTML);

let gears_per_clickText = document.getElementById("GearsPerClick-text");
let gears_per_secondText = document.getElementById("GearsPerSecond-text");
let gearImgContainer = document.querySelector(".gear-img-container");

let gears_per_click = 1;
let gears_per_second = 0;
let totalGears = 0;
let globalMultiplier = 1;
let costReductionFactor = 1;
let timeAccelerationFactor = 1;
let autoClickerLevel = 0;
let luckFactor = 1;
let achievementClickMultiplier = 1; // Achievement-based click power multiplier

// Initialize managers
const achievementManager = new AchievementManager();

// Apply prestige bonuses on game start
applyPrestigeBonuses();

/**
 * Apply prestige bonuses to game variables
 */
function applyPrestigeBonuses() {
  const bonuses = prestigeManager.getPrestigeBonuses();
  
  // Apply click multiplier to base gear per click
  const baseGearsPerClick = 1;
  gears_per_click = baseGearsPerClick * bonuses.clickMultiplier;
  
  // Apply global multiplier bonus
  globalMultiplier *= bonuses.gearMultiplier;
  
  // Apply cost reduction
  costReductionFactor *= bonuses.costReduction;
  
  // Add starting gears if this is a fresh prestige
  if (bonuses.startingGears > 0 && parsedGear === 0) {
    parsedGear += bonuses.startingGears;
    gear.innerHTML = Math.round(parsedGear);
  }
  
  // Apply critical hit chance bonus
  animationManager.updateCriticalHitChance(animationManager.criticalHitChance + bonuses.criticalChance);
  
  // Apply luck factor enhancement
  luckFactor *= bonuses.passiveBoost;
  
  // Apply time acceleration for prestige time warp
  timeAccelerationFactor *= bonuses.timeWarp;
  
  // Update displays
  updateDisplays();
}

/**
 * Execute prestige reset - called by prestige manager
 */
function executePrestige() {
  // Reset core game state but keep achievements and prestige data
  parsedGear = 0;
  gears_per_click = 1;
  gears_per_second = 0;
  globalMultiplier = 1;
  costReductionFactor = 1;
  timeAccelerationFactor = 1;
  autoClickerLevel = 0;
  luckFactor = 1;
  // Note: achievementClickMultiplier is NOT reset as achievements persist through prestige
  
  // Reset upgrades but keep the structure
  upgrades.forEach(upgrade => {
    upgrade.level.innerHTML = "0";
    // Reset costs to base values would need to be handled in upgrades.js
    // For now, reload should handle this properly
  });
  
  // Update display
  gear.innerHTML = "0";
  updateDisplays();
  
  // Reapply prestige bonuses
  setTimeout(() => {
    applyPrestigeBonuses();
  }, 100);
  
  // Show completion message
  showNotification("Prestige complete! Your bonuses are now active!", "success", 4000);
}

// Initialize animations
animationManager.initializeAnimations();

// Hide loading screen after game loads
setTimeout(() => {
  animationManager.hideLoadingScreen();
}, 500);

function incrementGear(event) {
  // Play clicking sound using audio manager
  audioManager.playSound('click');

  // Get prestige bonuses for critical hit calculation
  const bonuses = prestigeManager.getPrestigeBonuses();
  const enhancedCritChance = animationManager.criticalHitChance + bonuses.criticalChance;
  
  // Check for critical hit with prestige bonus
  const isCritical = enhancedCritChance * luckFactor > Math.random();
  const currentAchievementMultiplier = window.achievementClickMultiplier || 1;
  let clickAmount = gears_per_click * globalMultiplier * bonuses.clickMultiplier * currentAchievementMultiplier;
  
  if (isCritical) {
    clickAmount *= 2; // Critical hits do 2x damage
    showCriticalHit(clickAmount);
    achievementManager.updateStats('critical_hit');
    animationManager.createParticleEffect(event.offsetX, event.offsetY, '#ff6b6b');
  } else {
    achievementManager.updateStats('normal_hit');
  }

  // Update gear count
  const oldGear = parsedGear;
  parsedGear += clickAmount;
  totalGears = Math.max(totalGears, parsedGear);
  gear.innerHTML = Math.round(parsedGear);
  
  // Animate gear update
  animationManager.animateGearUpdate(parsedGear, oldGear);
  
  // Show click animation
  animationManager.animateClick(event, clickAmount, isCritical);
  
  // Update title and achievements
  updateTitle();
  achievementManager.updateStats('click');
  achievementManager.updateStats('gears', totalGears);
  
  // Update multiplier display
  updateMultiplierDisplay();
}

function buyUpgrade(upgradeName) {
  const mu = upgrades.find((u) => u.name === upgradeName);
  if (!mu) return;

  const upgradeDiv = document.getElementById(`${mu.name}-upgrade`);
  const nextLevelDiv = document.getElementById(`${mu.name}-next-level`);
  const nextLevelP = document.getElementById(`${mu.name}-next-p`);

  // Calculate actual cost with reductions and prestige bonuses
  const bonuses = prestigeManager.getPrestigeBonuses();
  const actualCost = mu.parsedCost * costReductionFactor * bonuses.costReduction;

  if (parsedGear >= actualCost) {
    // Play upgrade sound using audio manager
    audioManager.playSound('upgrade', 0.1);

    // Deduct cost
    parsedGear -= actualCost;
    gear.innerHTML = Math.round(parsedGear);

    // Animate purchase
    animationManager.animateUpgradePurchase(mu.name);

    let index = powerUpIntervals.indexOf(parseFloat(mu.level.innerHTML));
    
    // Handle power-up levels
    if (index !== -1) {
      upgradeDiv.style.cssText = `border-color: rgb(105, 105, 105)`;
      nextLevelDiv.style.cssText = `background-color: rgb(105, 105, 105); font-weight: normal`;
      mu.cost.innerHTML = Math.round(mu.parsedCost *= mu.costMultiplier);

      // Apply special upgrade effects
      applySpecialUpgradeEffects(mu, index);

      if (mu.name === 'Clicker') {
        gears_per_click *= mu.powerUps[index].multiplier;
        nextLevelP.innerHTML = `+${mu.parsedIncrease} gears per click`;
      } else {
        gears_per_second -= mu.power;
        mu.power *= mu.powerUps[index].multiplier;
        gears_per_second += mu.power;
        nextLevelP.innerHTML = `+${mu.parsedIncrease} gears per second`;
      }
    }

    // Increment level
    mu.level.innerHTML++;
    const newLevel = parseInt(mu.level.innerHTML);

    // Check for next power-up
    index = powerUpIntervals.indexOf(parseFloat(mu.level.innerHTML));

    if (index !== -1) {
      upgradeDiv.style.cssText = `border-color: #02E218`;
      nextLevelDiv.style.cssText = `background-color: #DD571C; font-weight: bold`;
      nextLevelP.innerText = mu.powerUps[index].description;
      mu.cost.innerHTML = Math.round(mu.parsedCost * 2.5 * 1.004 ** parseFloat(mu.level.innerHTML));
    } else {
      mu.cost.innerHTML = Math.round(mu.parsedCost *= mu.costMultiplier);
      mu.parsedIncrease = parseFloat((mu.parsedIncrease * mu.gearMultiplier).toFixed(2));

      if (mu.name === 'Clicker') {
        nextLevelP.innerHTML = `+${mu.parsedIncrease} gears per click`;
      } else {
        nextLevelP.innerHTML = `+${mu.parsedIncrease} gears per second`;
      }
    }

    // Apply upgrade effects
    applyUpgradeEffects(mu);

    // Update achievements
    achievementManager.updateStats('upgrade_bought');
    achievementManager.updateStats('upgrade_level', newLevel);
    
    // Check for special upgrade achievements
    if (['Quantum_Processor', 'Time_Accelerator'].includes(mu.name) && newLevel === 1) {
      achievementManager.updateStats('special_upgrade', mu.name, { upgradeName: mu.name });
    }

    // Show upgrade success notification
    showUpgradeSuccess(mu.name, newLevel);
    
    // Update displays
    updateDisplays();
    updateUpgradeAffordability();
  } else {
    // Not enough gears
    showInsufficientFunds(actualCost);
    animationManager.shakeElement(upgradeDiv);
  }
}

function applyUpgradeEffects(upgrade) {
  const level = parseInt(upgrade.level.innerHTML);
  
  switch (upgrade.type) {
    case 'clicker':
      gears_per_click += upgrade.parsedIncrease;
      break;
      
    case 'generator':
      gears_per_second -= upgrade.power;
      upgrade.power += upgrade.parsedIncrease;
      gears_per_second += upgrade.power;
      break;
      
    case 'auto_clicker':
      autoClickerLevel = level;
      gears_per_second -= upgrade.power;
      upgrade.power += upgrade.parsedIncrease;
      gears_per_second += upgrade.power;
      break;
      
    case 'multiplier':
      globalMultiplier = 1 + (level * upgrade.parsedIncrease);
      break;
      
    case 'efficiency':
      costReductionFactor = Math.max(0.1, 1 - (level * upgrade.parsedIncrease));
      break;
      
    case 'luck':
      luckFactor = 1 + (level * upgrade.parsedIncrease);
      animationManager.updateCriticalHitChance(0.05 * luckFactor);
      break;
      
    case 'time':
      timeAccelerationFactor = 1 + (level * upgrade.parsedIncrease);
      break;
      
    case 'quantum':
      // Quantum effects - enhance all other upgrades slightly
      globalMultiplier *= 1 + (level * 0.01);
      break;
  }
}

function applySpecialUpgradeEffects(upgrade, powerUpIndex) {
  // Apply additional effects for power-up levels
  const powerUp = upgrade.powerUps[powerUpIndex];
  
  switch (upgrade.type) {
    case 'multiplier':
      globalMultiplier *= powerUp.multiplier;
      break;
    case 'efficiency':
      costReductionFactor /= powerUp.multiplier;
      break;
    case 'luck':
      luckFactor *= powerUp.multiplier;
      break;
    case 'time':
      timeAccelerationFactor *= powerUp.multiplier;
      break;
  }
}

function updateDisplays() {
  const bonuses = prestigeManager.getPrestigeBonuses();
  
  // Update stats display with prestige bonuses
  gears_per_clickText.innerHTML = Math.round(gears_per_click * globalMultiplier * bonuses.clickMultiplier);
  gears_per_secondText.innerHTML = Math.round(gears_per_second * globalMultiplier * timeAccelerationFactor * bonuses.passiveBoost);
  
  // Update achievement stats
  achievementManager.updateStats('gears_per_second', gears_per_second * globalMultiplier * timeAccelerationFactor * bonuses.passiveBoost);
  
  // Update prestige display
  prestigeManager.updatePrestigeDisplay();
}

function updateMultiplierDisplay() {
  const multiplierElement = document.getElementById('click-multiplier-value');
  if (multiplierElement) {
    const totalMultiplier = globalMultiplier * luckFactor;
    multiplierElement.textContent = totalMultiplier.toFixed(1);
    
    if (totalMultiplier > 1) {
      multiplierElement.parentElement.style.display = 'block';
    }
  }
}

function updateUpgradeAffordability() {
  const bonuses = prestigeManager.getPrestigeBonuses();
  
  upgrades.forEach(upgrade => {
    const upgradeElement = document.getElementById(`${upgrade.name}-upgrade`);
    // Use the displayed cost from the UI instead of the cached parsedCost
    // since parsedCost gets modified during purchases
    const displayedCost = parseFloat(upgrade.cost.innerHTML);
    const actualCost = displayedCost * costReductionFactor * bonuses.costReduction;
    
    if (upgradeElement) {
      if (parsedGear >= actualCost) {
        upgradeElement.classList.add('affordable');
      } else {
        upgradeElement.classList.remove('affordable');
      }
    }
  });
}

// Auto-clicker functionality
function processAutoClicker() {
  if (autoClickerLevel > 0) {
    // Simulate clicks based on auto-clicker level
    const clicksPerSecond = autoClickerLevel * 0.5 * timeAccelerationFactor;
    const gearsFromAutoClick = clicksPerSecond * gears_per_click * globalMultiplier;
    
    parsedGear += gearsFromAutoClick / 10; // Divide by 10 since this runs 10 times per second
    gear.innerHTML = Math.round(parsedGear);
    
    // Occasionally show auto-click animation
    if (Math.random() < 0.1) { // 10% chance per tick
      animationManager.animateAutoClick();
    }
  }
}

// Enhanced passive income with time acceleration
function processPassiveIncome() {
  if (gears_per_second > 0) {
    const bonuses = prestigeManager.getPrestigeBonuses();
    const passiveAmount = (gears_per_second * globalMultiplier * timeAccelerationFactor * bonuses.passiveBoost) / 10;
    parsedGear += passiveAmount;
    totalGears = Math.max(totalGears, parsedGear);
    gear.innerHTML = Math.round(parsedGear);
    
    // Track idle gears for achievements
    achievementManager.trackIdleGears(passiveAmount);
    
    // Occasionally show passive income animation
    if (Math.random() < 0.05 && passiveAmount > 1) { // 5% chance per tick
      animationManager.showPassiveIncome(passiveAmount * 10); // Show per-second amount
    }
  }
}

// Game loop - runs 10 times per second for smooth animations
setInterval(() => {
  processAutoClicker();
  processPassiveIncome();
  updateTitle();
  updateDisplays();
  updateUpgradeAffordability();
  achievementManager.updateStats('gears', totalGears);
}, 100);

function updateTitle() {
  document.title = `Gears - ${Math.round(parsedGear)} | Click n' Clank v2`;
}

// Enhanced save/load system
function save() {
  const saveData = {
    parsedGear: parsedGear,
    totalGears: totalGears,
    gears_per_click: gears_per_click,
    gears_per_second: gears_per_second,
    globalMultiplier: globalMultiplier,
    costReductionFactor: costReductionFactor,
    timeAccelerationFactor: timeAccelerationFactor,
    autoClickerLevel: autoClickerLevel,
    luckFactor: luckFactor,
    upgrades: upgrades.map(upgrade => ({
      name: upgrade.name,
      parsedLevel: parseFloat(upgrade.level.innerHTML),
      parsedCost: upgrade.parsedCost,
      parsedIncrease: upgrade.parsedIncrease,
      power: upgrade.power
    })),
    timestamp: Date.now(),
    version: "2.0"
  };
  
  localStorage.setItem("cnc_v2_game", JSON.stringify(saveData));
  achievementManager.saveProgress();
  
  showSaveSuccess();
}

function load() {
  try {
    const saveData = JSON.parse(localStorage.getItem("cnc_v2_game"));
    if (!saveData) {
      // Try to load v1 data for backward compatibility
      loadLegacyData();
      return;
    }
    
    // Load main game state
    parsedGear = saveData.parsedGear || 0;
    totalGears = saveData.totalGears || parsedGear;
    gears_per_click = saveData.gears_per_click || 1;
    gears_per_second = saveData.gears_per_second || 0;
    globalMultiplier = saveData.globalMultiplier || 1;
    costReductionFactor = saveData.costReductionFactor || 1;
    timeAccelerationFactor = saveData.timeAccelerationFactor || 1;
    autoClickerLevel = saveData.autoClickerLevel || 0;
    luckFactor = saveData.luckFactor || 1;
    
    // Load upgrade states
    if (saveData.upgrades) {
      saveData.upgrades.forEach(savedUpgrade => {
        const upgrade = upgrades.find(u => u.name === savedUpgrade.name);
        if (upgrade) {
          upgrade.parsedCost = savedUpgrade.parsedCost;
          upgrade.parsedIncrease = savedUpgrade.parsedIncrease;
          upgrade.level.innerHTML = savedUpgrade.parsedLevel;
          upgrade.cost.innerHTML = Math.round(upgrade.parsedCost);
          upgrade.increase.innerHTML = upgrade.parsedIncrease;
          upgrade.power = savedUpgrade.power || 0;
        }
      });
    }
    
    // Update displays
    gear.innerHTML = Math.round(parsedGear);
    updateDisplays();
    updateMultiplierDisplay();
    
    // Reapply prestige bonuses after loading
    applyPrestigeBonuses();
    
    showLoadSuccess();
  } catch (error) {
    console.error("Failed to load save data:", error);
    showNotification("Failed to load save data", "error");
  }
}

function loadLegacyData() {
  // Load v1 save data for backward compatibility
  const legacyUpgrades = ["Clicker", "Robot_MK1", "Robot_MK2", "Robot_MK3", "Robot_MK4"];
  let hasLegacyData = false;
  
  legacyUpgrades.forEach(name => {
    const savedData = localStorage.getItem(name);
    if (savedData) {
      hasLegacyData = true;
      const upgrade = upgrades.find(u => u.name === name);
      if (upgrade) {
        const data = JSON.parse(savedData);
        upgrade.parsedCost = data.parsedCost;
        upgrade.parsedIncrease = data.parsedIncrease;
        upgrade.level.innerHTML = data.parsedLevel;
        upgrade.cost.innerHTML = Math.round(upgrade.parsedCost);
        upgrade.increase.innerHTML = upgrade.parsedIncrease;
      }
    }
  });
  
  // Load legacy game state
  const legacyGears = localStorage.getItem("gear");
  const legacyGPC = localStorage.getItem("gears_per_click");
  const legacyGPS = localStorage.getItem("gears_per_second");
  
  if (legacyGears) {
    parsedGear = JSON.parse(legacyGears);
    totalGears = parsedGear;
    gear.innerHTML = Math.round(parsedGear);
  }
  
  if (legacyGPC) {
    gears_per_click = JSON.parse(legacyGPC);
  }
  
  if (legacyGPS) {
    gears_per_second = JSON.parse(legacyGPS);
  }
  
  if (hasLegacyData) {
    updateDisplays();
    showNotification("Legacy save data imported to v2!", "info", 5000);
    // Save the imported data in v2 format
    save();
  } else {
    showNotification("No save data found", "info");
  }
}

function resetGame() {
  if (confirm("Are you sure you want to reset all progress? This cannot be undone!")) {
    localStorage.removeItem("cnc_v2_game");
    localStorage.removeItem("cnc_v2_achievements");
    
    // Reset all variables
    parsedGear = 0;
    totalGears = 0;
    gears_per_click = 1;
    gears_per_second = 0;
    globalMultiplier = 1;
    costReductionFactor = 1;
    timeAccelerationFactor = 1;
    autoClickerLevel = 0;
    luckFactor = 1;
    
    // Reset upgrade displays
    upgrades.forEach(upgrade => {
      upgrade.level.innerHTML = 0;
      upgrade.parsedCost = parseFloat(upgrade.cost.innerHTML);
      upgrade.cost.innerHTML = upgrade.parsedCost;
      upgrade.power = 0;
    });
    
    gear.innerHTML = "0";
    updateDisplays();
    updateMultiplierDisplay();
    
    achievementManager.reset();
    
    showNotification("Game reset successfully", "success");
  }
}

// Achievements panel toggle
function toggleAchievements() {
  const panel = document.getElementById('achievements-panel');
  panel.classList.toggle('open');
}

// Settings modal toggle
function toggleSettings() {
  const modal = document.getElementById('settings-modal');
  modal.classList.toggle('open');
  
  // Update volume displays when opening
  if (modal.classList.contains('open')) {
    updateSettingsDisplay();
  }
}

// Update settings display
function updateSettingsDisplay() {
  const settings = audioManager.getSettings();
  
  document.getElementById('music-volume').value = settings.musicVolume * 100;
  document.getElementById('sound-volume').value = settings.soundVolume * 100;
  document.getElementById('music-volume-display').textContent = Math.round(settings.musicVolume * 100) + '%';
  document.getElementById('sound-volume-display').textContent = Math.round(settings.soundVolume * 100) + '%';
}

// Auto-save every 3 minutes
setInterval(() => {
  save();
  showAutoSave();
}, 180000);

// Load game on start
window.addEventListener('load', () => {
  load();
});

// Global function exports
window.incrementGear = incrementGear;
window.buyUpgrade = buyUpgrade;
window.save = save;
window.load = load;
window.resetGame = resetGame;
window.toggleAchievements = toggleAchievements;
window.toggleSettings = toggleSettings;

// Global variable exports for modules
window.achievementClickMultiplier = achievementClickMultiplier;
window.globalMultiplier = globalMultiplier;
window.parsedGear = parsedGear;
window.audioManager = audioManager;
window.prestigeManager = prestigeManager;
window.executePrestige = executePrestige;
window.applyPrestigeBonuses = applyPrestigeBonuses;
window.upgrades = upgrades;
window.totalGears = totalGears;
window.gears_per_second = gears_per_second;