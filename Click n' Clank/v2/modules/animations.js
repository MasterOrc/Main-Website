class AnimationManager {
  constructor() {
    this.gearImgContainer = document.querySelector(".gear-img-container");
    this.gearImg = document.querySelector(".gear-img");
    this.criticalHitChance = 0.05; // 5% base critical hit chance
    this.isAnimating = false;
  }

  // Enhanced click animation with critical hit chance
  animateClick(event, amount, isCritical = false) {
    if (!this.gearImgContainer) return;

    const x = event.offsetX;
    const y = event.offsetY;

    const div = document.createElement("div");
    div.innerHTML = `+${Math.round(amount)}`;
    
    // Apply critical hit styling
    if (isCritical) {
      div.classList.add("critical-hit");
      div.innerHTML = `CRIT! +${Math.round(amount)}`;
      this.animateGearPulse();
    } else {
      div.style.cssText = `
        color: white; 
        position: absolute; 
        top: ${y}px; 
        left: ${x}px; 
        font-size: 15px; 
        pointer-events: none;
        font-weight: bold;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
        z-index: 100;
      `;
      div.classList.add("fade-up");
    }

    this.gearImgContainer.appendChild(div);

    // Remove element after animation
    const timeout = isCritical ? 800 : 1000;
    setTimeout(() => {
      if (div.parentNode) {
        div.remove();
      }
    }, timeout);
  }

  // Animate gear pulse effect for critical hits
  animateGearPulse() {
    if (this.gearImg && !this.isAnimating) {
      this.isAnimating = true;
      this.gearImg.style.animation = 'gearPulse 0.6s ease-out';
      
      setTimeout(() => {
        this.gearImg.style.animation = '';
        this.isAnimating = false;
      }, 600);
    }
  }

  // Animate upgrade purchase
  animateUpgradePurchase(upgradeName) {
    const upgradeElement = document.getElementById(`${upgradeName}-upgrade`);
    if (!upgradeElement) return;

    // Flash effect
    upgradeElement.style.animation = 'upgradeFlash 0.5s ease-out';
    
    setTimeout(() => {
      upgradeElement.style.animation = '';
    }, 500);

    // Update progress bar animation
    this.animateUpgradeProgress(upgradeName);
  }

  // Animate upgrade progress bar
  animateUpgradeProgress(upgradeName, progress = 0) {
    const progressFill = document.getElementById(`${upgradeName}-progress-fill`);
    if (!progressFill) return;

    progressFill.style.width = `${progress}%`;
  }

  // Animate gear counter update
  animateGearUpdate(newValue, oldValue) {
    const gearElement = document.querySelector(".gear-cost");
    if (!gearElement) return;

    if (newValue > oldValue) {
      gearElement.style.animation = 'gearIncrease 0.3s ease-out';
    } else {
      gearElement.style.animation = 'gearDecrease 0.3s ease-out';
    }

    setTimeout(() => {
      gearElement.style.animation = '';
    }, 300);
  }

  // Auto-clicker visual effect
  animateAutoClick() {
    if (!this.gearImg) return;

    this.gearImg.style.animation = 'autoClick 0.3s ease-out';
    setTimeout(() => {
      this.gearImg.style.animation = '';
    }, 300);
  }

  // Show multiplier update animation
  animateMultiplier(newMultiplier) {
    const multiplierDisplay = document.getElementById('click-multiplier-value');
    if (!multiplierDisplay) return;

    multiplierDisplay.style.animation = 'multiplierUpdate 0.5s ease-out';
    setTimeout(() => {
      multiplierDisplay.style.animation = '';
    }, 500);
  }

  // Animate achievement unlock
  animateAchievementUnlock(achievementElement) {
    if (!achievementElement) return;

    achievementElement.style.animation = 'achievementUnlock 1s ease-out';
    achievementElement.setAttribute('data-completed', 'true');
  }

  // Loading screen animation
  hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (!loadingScreen) return;

    setTimeout(() => {
      loadingScreen.classList.add('hidden');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 500);
    }, 1000);
  }

  // Add floating numbers for passive income
  showPassiveIncome(amount) {
    if (!this.gearImgContainer || amount <= 0) return;

    const div = document.createElement("div");
    div.innerHTML = `+${Math.round(amount)}`;
    div.style.cssText = `
      color: #00ff88; 
      position: absolute; 
      top: 50%; 
      right: -30px; 
      font-size: 12px; 
      pointer-events: none;
      font-weight: bold;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
      z-index: 50;
    `;
    div.classList.add("fade-right");

    this.gearImgContainer.appendChild(div);

    setTimeout(() => {
      if (div.parentNode) {
        div.remove();
      }
    }, 2000);
  }

  // Particle effect for major milestones
  createParticleEffect(x, y, color = '#ffff00') {
    if (!this.gearImgContainer) return;

    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        top: ${y}px;
        left: ${x}px;
        width: 4px;
        height: 4px;
        background: ${color};
        border-radius: 50%;
        pointer-events: none;
        z-index: 200;
      `;
      
      this.gearImgContainer.appendChild(particle);
      
      // Random direction and speed
      const angle = (i / 8) * Math.PI * 2;
      const speed = 50 + Math.random() * 30;
      const duration = 800 + Math.random() * 400;
      
      particle.style.animation = `particle ${duration}ms ease-out forwards`;
      particle.style.setProperty('--dx', Math.cos(angle) * speed + 'px');
      particle.style.setProperty('--dy', Math.sin(angle) * speed + 'px');
      
      setTimeout(() => {
        if (particle.parentNode) {
          particle.remove();
        }
      }, duration);
    }
  }

  // Shake animation for errors or insufficient funds
  shakeElement(element) {
    if (!element) return;

    element.style.animation = 'shake 0.5s ease-out';
    setTimeout(() => {
      element.style.animation = '';
    }, 500);
  }

  // Check if should show critical hit
  shouldCriticalHit() {
    return Math.random() < this.criticalHitChance;
  }

  // Update critical hit chance based on luck upgrades
  updateCriticalHitChance(newChance) {
    this.criticalHitChance = Math.min(newChance, 0.3); // Cap at 30%
  }

  // Initialize CSS animations if not already present
  initializeAnimations() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes gearPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); filter: brightness(120%) drop-shadow(0 0 20px var(--accent-color)); }
        100% { transform: scale(1); }
      }
      
      @keyframes upgradeFlash {
        0% { background: var(--primary-color); }
        50% { background: var(--accent-color); transform: scale(1.02); }
        100% { background: var(--primary-color); }
      }
      
      @keyframes gearIncrease {
        0% { transform: scale(1); color: var(--text-yellow); }
        50% { transform: scale(1.1); color: #00ff00; }
        100% { transform: scale(1); color: var(--text-yellow); }
      }
      
      @keyframes gearDecrease {
        0% { transform: scale(1); color: var(--text-yellow); }
        50% { transform: scale(0.95); color: #ff6666; }
        100% { transform: scale(1); color: var(--text-yellow); }
      }
      
      @keyframes autoClick {
        0% { transform: scale(1); }
        50% { transform: scale(0.95); opacity: 0.8; }
        100% { transform: scale(1); }
      }
      
      @keyframes multiplierUpdate {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); color: #00ff00; }
        100% { transform: scale(1); }
      }
      
      @keyframes achievementUnlock {
        0% { transform: scale(1); opacity: 1; }
        25% { transform: scale(1.05); opacity: 0.8; }
        50% { transform: scale(1.1); opacity: 1; background: rgba(46, 204, 113, 0.2); }
        100% { transform: scale(1); opacity: 1; }
      }
      
      @keyframes fade-right {
        0% { transform: translateX(0); opacity: 1; }
        100% { transform: translateX(50px); opacity: 0; }
      }
      
      @keyframes particle {
        0% { 
          transform: translate(0, 0) scale(1); 
          opacity: 1; 
        }
        100% { 
          transform: translate(var(--dx), var(--dy)) scale(0.3); 
          opacity: 0; 
        }
      }
      
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }
      
      @keyframes notificationSlideOut {
        to { transform: translateX(400px); opacity: 0; }
      }
    `;
    
    if (!document.head.querySelector('#cnc-animations')) {
      style.id = 'cnc-animations';
      document.head.appendChild(style);
    }
  }
}

// Export singleton instance
const animationManager = new AnimationManager();
export default animationManager;