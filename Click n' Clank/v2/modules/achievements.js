import { achievements } from '../Constants/achievements.js';
import { showNotification } from './notifications.js';

class AchievementManager {
  constructor() {
    this.achievements = [...achievements];
    this.speedBuyingStartTime = null;
    this.speedBuyingCount = 0;
    this.criticalStreak = 0;
    this.totalPlayTime = 0;
    this.sessionStartTime = Date.now();
    this.idleStartTime = null;
    this.idleGearsGenerated = 0;
    this.isIdle = false;
    this.stats = {
      totalClicks: 0,
      totalGears: 0,
      upgradesBought: 0,
      highestUpgradeLevel: 0,
      gearsPerSecond: 0,
      totalUpgrades: {}
    };
    
    this.loadProgress();
    this.initializeAchievements();
    this.startPlayTimeTracking();
    this.startIdleTracking();
  }

  initializeAchievements() {
    this.renderAchievements();
    this.updateAchievementProgress();
  }

  renderAchievements() {
    const achievementsList = document.getElementById('achievements-list');
    const template = document.getElementById('achievement-template').textContent;
    
    achievementsList.innerHTML = '';
    
    this.achievements.forEach(achievement => {
      let html = template;
      const progressPercent = Math.min((achievement.progress / achievement.target) * 100, 100);
      const progressDisplay = achievement.unlocked ? 'none' : 'block';
      const rewardDisplay = achievement.unlocked ? 'block' : 'none';
      
      const replacements = {
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        completed: achievement.unlocked,
        progressPercent: progressPercent.toFixed(1),
        progress: achievement.progress,
        target: achievement.target,
        reward: achievement.reward,
        progressDisplay: progressDisplay,
        rewardDisplay: rewardDisplay
      };
      
      Object.keys(replacements).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        html = html.replace(regex, replacements[key]);
      });
      
      achievementsList.innerHTML += html;
    });
    
    this.updateAchievementCounts();
  }

  updateAchievementCounts() {
    const completed = this.achievements.filter(a => a.unlocked).length;
    const total = this.achievements.length;
    
    document.getElementById('achievements-completed').textContent = completed;
    document.getElementById('achievements-total').textContent = total;
    
    const progressPercent = (completed / total) * 100;
    document.getElementById('achievement-progress-fill').style.width = `${progressPercent}%`;
  }

  checkAchievement(type, value, additionalData = {}) {
    let achievementsUnlocked = false;
    
    this.achievements.forEach(achievement => {
      if (achievement.unlocked || achievement.type !== type) return;
      
      let shouldUnlock = false;
      let newProgress = achievement.progress;
      
      switch (type) {
        case 'clicks':
        case 'gears_total':
        case 'upgrades_bought':
        case 'gears_per_second':
        case 'time_played':
        case 'idle_gears':
          newProgress = Math.max(value, achievement.progress);
          shouldUnlock = newProgress >= achievement.target;
          break;
          
        case 'upgrade_level':
          newProgress = Math.max(value, achievement.progress);
          shouldUnlock = newProgress >= achievement.target;
          break;
          
        case 'special_upgrade':
          if (additionalData.upgradeName === achievement.target) {
            shouldUnlock = true;
            newProgress = 1;
          }
          break;
          
        case 'critical_streak':
          newProgress = value;
          shouldUnlock = newProgress >= achievement.target;
          break;
          
        case 'efficiency':
          newProgress = value;
          shouldUnlock = newProgress <= achievement.target;
          break;
          
        case 'special':
          if (achievement.id === 'speed_buyer') {
            newProgress = value;
            shouldUnlock = newProgress >= achievement.target;
          }
          break;
          
        case 'meta':
          if (achievement.id === 'completionist') {
            const otherUnlocked = this.achievements.filter(a => a.unlocked && a.id !== 'completionist').length;
            newProgress = otherUnlocked;
            shouldUnlock = newProgress >= achievement.target;
          }
          break;
      }
      
      achievement.progress = newProgress;
      
      if (shouldUnlock) {
        this.unlockAchievement(achievement);
        achievementsUnlocked = true;
      }
    });
    
    if (achievementsUnlocked) {
      this.renderAchievements();
      this.saveProgress();
    } else {
      this.updateAchievementProgress();
    }
  }

  unlockAchievement(achievement) {
    achievement.unlocked = true;
    
    showNotification(
      `Achievement Unlocked: ${achievement.name}!`,
      'achievement',
      5000
    );
    
    // Apply achievement rewards
    this.applyAchievementReward(achievement);
    
    // Check meta achievements
    this.checkAchievement('meta', 0);
  }

  applyAchievementReward(achievement) {
    const rewardText = achievement.reward.toLowerCase();
    
    if (rewardText.includes('gears') && rewardText.match(/\d+/)) {
      // Convert flat gear rewards to click multiplier bonuses
      const gearReward = parseInt(rewardText.match(/\d+/)[0]);
      // Convert to a multiplier bonus: small rewards = 1.1x, larger rewards = more multiplier
      const multiplierBonus = 1 + (gearReward / 1000); // 10 gears = 1.01x, 100 gears = 1.1x, etc.
      
      // Access the global click multiplier
      if (typeof window.achievementClickMultiplier === 'undefined') {
        window.achievementClickMultiplier = 1;
      }
      window.achievementClickMultiplier *= multiplierBonus;
      
      // Update the click multiplier display
      this.updateClickMultiplierDisplay();
      
      showNotification(`Click Power +${((multiplierBonus - 1) * 100).toFixed(1)}% from achievement!`, 'success');
    } else if (rewardText.includes('click multiplier')) {
      // Handle explicit click multiplier rewards
      const multiplierMatch = rewardText.match(/(\d+)x/);
      if (multiplierMatch) {
        const multiplier = parseFloat(multiplierMatch[1]);
        if (typeof window.achievementClickMultiplier === 'undefined') {
          window.achievementClickMultiplier = 1;
        }
        window.achievementClickMultiplier *= multiplier;
        this.updateClickMultiplierDisplay();
        showNotification(`Click Power x${multiplier} from achievement!`, 'success');
      }
    } else if (rewardText.includes('% all production')) {
      // Handle global production bonuses
      const percentMatch = rewardText.match(/(\d+)%/);
      if (percentMatch) {
        const percent = parseFloat(percentMatch[1]) / 100;
        // Need to access the global multiplier from main game
        if (typeof window.globalMultiplier !== 'undefined') {
          window.globalMultiplier *= (1 + percent);
        }
        showNotification(`All Production +${percentMatch[1]}% from achievement!`, 'success');
      }
    }
    
    // Other reward types would be applied here
    // This is where you'd implement efficiency boosts, etc.
  }

  /**
   * Update the click multiplier display in the UI
   */
  updateClickMultiplierDisplay() {
    const multiplierElement = document.getElementById('click-multiplier-value');
    if (multiplierElement && typeof window.achievementClickMultiplier !== 'undefined') {
      multiplierElement.textContent = window.achievementClickMultiplier.toFixed(1);
    }
  }

  updateStats(type, value, additionalData = {}) {
    switch (type) {
      case 'click':
        this.stats.totalClicks++;
        this.checkAchievement('clicks', this.stats.totalClicks);
        break;
        
      case 'gears':
        this.stats.totalGears = Math.max(value, this.stats.totalGears);
        this.checkAchievement('gears_total', this.stats.totalGears);
        break;
        
      case 'upgrade_bought':
        this.stats.upgradesBought++;
        this.checkAchievement('upgrades_bought', this.stats.upgradesBought);
        
        // Track speed buying
        const now = Date.now();
        if (!this.speedBuyingStartTime || now - this.speedBuyingStartTime > 30000) {
          this.speedBuyingStartTime = now;
          this.speedBuyingCount = 1;
        } else {
          this.speedBuyingCount++;
          if (this.speedBuyingCount >= 10) {
            this.checkAchievement('special', 10);
            this.speedBuyingCount = 0;
            this.speedBuyingStartTime = null;
          }
        }
        break;
        
      case 'upgrade_level':
        const level = parseInt(value);
        this.stats.highestUpgradeLevel = Math.max(level, this.stats.highestUpgradeLevel);
        this.checkAchievement('upgrade_level', this.stats.highestUpgradeLevel);
        break;
        
      case 'gears_per_second':
        this.stats.gearsPerSecond = value;
        this.checkAchievement('gears_per_second', value);
        break;
        
      case 'special_upgrade':
        this.checkAchievement('special_upgrade', value, additionalData);
        break;
        
      case 'critical_hit':
        this.criticalStreak++;
        this.checkAchievement('critical_streak', this.criticalStreak);
        break;
        
      case 'normal_hit':
        this.criticalStreak = 0;
        break;
    }
    
    this.updateStatsDisplay();
  }

  updateStatsDisplay() {
    const totalClicksElement = document.getElementById('TotalClicks-text');
    if (totalClicksElement) {
      totalClicksElement.textContent = this.stats.totalClicks;
    }
  }

  updateAchievementProgress() {
    this.achievements.forEach(achievement => {
      if (achievement.unlocked) return;
      
      const achievementElement = document.getElementById(`achievement-${achievement.id}`);
      if (!achievementElement) return;
      
      const progressBar = achievementElement.querySelector('.achievement-progress-fill');
      const progressText = achievementElement.querySelector('.achievement-progress-text');
      
      if (progressBar) {
        const progressPercent = Math.min((achievement.progress / achievement.target) * 100, 100);
        progressBar.style.width = `${progressPercent}%`;
      }
      
      if (progressText) {
        progressText.textContent = `${achievement.progress}/${achievement.target}`;
      }
    });
  }

  startPlayTimeTracking() {
    setInterval(() => {
      this.totalPlayTime += 1;
      this.checkAchievement('time_played', this.totalPlayTime);
    }, 1000);
  }

  startIdleTracking() {
    let lastActivity = Date.now();
    
    // Track user activity
    ['click', 'mousemove', 'keypress'].forEach(event => {
      document.addEventListener(event, () => {
        lastActivity = Date.now();
        if (this.isIdle) {
          this.isIdle = false;
          this.idleStartTime = null;
        }
      });
    });
    
    // Check for idle state every 10 seconds
    setInterval(() => {
      const now = Date.now();
      const timeSinceActivity = now - lastActivity;
      
      if (timeSinceActivity > 60000 && !this.isIdle) { // 1 minute idle
        this.isIdle = true;
        this.idleStartTime = now;
        this.idleGearsGenerated = 0;
      }
      
      if (this.isIdle && this.idleGearsGenerated > 0) {
        this.checkAchievement('idle_gears', this.idleGearsGenerated);
      }
    }, 10000);
  }

  trackIdleGears(amount) {
    if (this.isIdle) {
      this.idleGearsGenerated += amount;
    }
  }

  saveProgress() {
    const saveData = {
      achievements: this.achievements,
      stats: this.stats,
      totalPlayTime: this.totalPlayTime
    };
    
    localStorage.setItem('cnc_v2_achievements', JSON.stringify(saveData));
  }

  loadProgress() {
    const saved = localStorage.getItem('cnc_v2_achievements');
    if (!saved) return;
    
    try {
      const data = JSON.parse(saved);
      
      if (data.achievements) {
        // Merge saved progress with current achievement definitions
        data.achievements.forEach(savedAchievement => {
          const currentAchievement = this.achievements.find(a => a.id === savedAchievement.id);
          if (currentAchievement) {
            currentAchievement.unlocked = savedAchievement.unlocked;
            currentAchievement.progress = savedAchievement.progress;
          }
        });
      }
      
      if (data.stats) {
        this.stats = { ...this.stats, ...data.stats };
      }
      
      if (data.totalPlayTime) {
        this.totalPlayTime = data.totalPlayTime;
      }
    } catch (error) {
      console.error('Failed to load achievement progress:', error);
    }
  }

  reset() {
    this.achievements = achievements.map(a => ({ 
      ...a, 
      unlocked: false, 
      progress: 0 
    }));
    this.stats = {
      totalClicks: 0,
      totalGears: 0,
      upgradesBought: 0,
      highestUpgradeLevel: 0,
      gearsPerSecond: 0,
      totalUpgrades: {}
    };
    this.totalPlayTime = 0;
    this.saveProgress();
    this.renderAchievements();
  }
}

export default AchievementManager;