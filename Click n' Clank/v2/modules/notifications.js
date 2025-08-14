class NotificationManager {
  constructor() {
    this.container = document.getElementById('notification-container');
    this.activeNotifications = new Set();
  }

  show(message, type = 'info', duration = 3000, options = {}) {
    const notification = this.createNotification(message, type, duration, options);
    this.container.appendChild(notification);
    this.activeNotifications.add(notification);

    // Auto-remove after duration
    setTimeout(() => {
      this.removeNotification(notification);
    }, duration);

    return notification;
  }

  createNotification(message, type, duration, options) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Add icon based on type
    const icon = this.getIcon(type);
    
    notification.innerHTML = `
      <div class="notification-content">
        ${icon ? `<span class="notification-icon">${icon}</span>` : ''}
        <span class="notification-message">${message}</span>
        ${options.closable !== false ? '<button class="notification-close" onclick="this.closest(\'.notification\').remove()">×</button>' : ''}
      </div>
    `;

    // Add click handler if provided
    if (options.onClick) {
      notification.addEventListener('click', options.onClick);
      notification.style.cursor = 'pointer';
    }

    // Special handling for achievement notifications
    if (type === 'achievement') {
      notification.classList.add('achievement-notification');
      // Play achievement sound if available
      this.playAchievementSound();
    }

    return notification;
  }

  getIcon(type) {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
      achievement: '🏆',
      upgrade: '⬆️',
      critical: '💥'
    };
    return icons[type] || '';
  }

  removeNotification(notification) {
    if (this.activeNotifications.has(notification)) {
      notification.style.animation = 'notificationSlideOut 0.3s ease-in forwards';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
        this.activeNotifications.delete(notification);
      }, 300);
    }
  }

  playAchievementSound() {
    try {
      const audio = new Audio('./assets/Audio/upgrade.mp3');
      audio.volume = 0.3;
      audio.play().catch(e => console.log('Could not play achievement sound:', e));
    } catch (error) {
      console.log('Achievement sound not available');
    }
  }

  clear() {
    this.activeNotifications.forEach(notification => {
      this.removeNotification(notification);
    });
  }

  showUpgradeSuccess(upgradeName, level) {
    this.show(
      `${upgradeName} upgraded to level ${level}!`,
      'upgrade',
      2000
    );
  }

  showCriticalHit(amount) {
    this.show(
      `Critical Hit! +${amount} gears!`,
      'critical',
      1500,
      { closable: false }
    );
  }

  showInsufficientFunds(cost) {
    this.show(
      `Need ${Math.round(cost)} gears for this upgrade`,
      'error',
      2000
    );
  }

  showSaveSuccess() {
    this.show('Game saved successfully', 'success', 2000);
  }

  showLoadSuccess() {
    this.show('Game loaded successfully', 'success', 2000);
  }

  showAutoSave() {
    this.show('Game auto-saved', 'info', 1500, { closable: false });
  }
}

// Export singleton instance
const notificationManager = new NotificationManager();

export function showNotification(message, type = 'info', duration = 3000, options = {}) {
  return notificationManager.show(message, type, duration, options);
}

export function showUpgradeSuccess(upgradeName, level) {
  return notificationManager.showUpgradeSuccess(upgradeName, level);
}

export function showCriticalHit(amount) {
  return notificationManager.showCriticalHit(amount);
}

export function showInsufficientFunds(cost) {
  return notificationManager.showInsufficientFunds(cost);
}

export function showSaveSuccess() {
  return notificationManager.showSaveSuccess();
}

export function showLoadSuccess() {
  return notificationManager.showLoadSuccess();
}

export function showAutoSave() {
  return notificationManager.showAutoSave();
}

export default notificationManager;