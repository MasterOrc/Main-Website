// upgrades.js - Data-driven upgrade system for Click n' Clank v2

// Upgrade configuration data
export const upgradeConfig = [
    {
        id: 'clicker',
        name: 'Clicker',
        description: 'Increases gears per click',
        image: '../assets/click-icon-black.png',
        baseCost: 10,
        baseIncrease: 1,
        costMultiplier: 1.12,
        increaseMultiplier: 1.025,
        type: 'click',
        powerUps: [
            { level: 10, name: '2x Clicker', description: 'Double clicking power', multiplier: 2 },
            { level: 20, name: '3x Clicker', description: 'Triple clicking power', multiplier: 3 },
            { level: 30, name: '2x Clicker', description: 'Double clicking power', multiplier: 2 }
        ]
    },
    {
        id: 'robot_mk1',
        name: 'Robot MK1',
        description: 'Generates gears automatically',
        image: '../assets/Robot_1.png',
        baseCost: 60,
        baseIncrease: 4,
        costMultiplier: 1.15,
        increaseMultiplier: 1.03,
        type: 'auto',
        powerUps: [
            { level: 10, name: '2x Robot MK1', description: 'Double Robot MK1 efficiency', multiplier: 2 },
            { level: 20, name: '3x Robot MK1', description: 'Triple Robot MK1 efficiency', multiplier: 3 },
            { level: 30, name: '2x Robot MK1', description: 'Double Robot MK1 efficiency', multiplier: 2 }
        ]
    },
    {
        id: 'robot_mk2',
        name: 'Robot MK2',
        description: 'Advanced gear generator',
        image: '../assets/Robot_2.png',
        baseCost: 480,
        baseIncrease: 32,
        costMultiplier: 1.11,
        increaseMultiplier: 1.035,
        type: 'auto',
        powerUps: [
            { level: 10, name: '2x Robot MK2', description: 'Double Robot MK2 efficiency', multiplier: 2 },
            { level: 20, name: '3x Robot MK2', description: 'Triple Robot MK2 efficiency', multiplier: 3 },
            { level: 30, name: '2x Robot MK2', description: 'Double Robot MK2 efficiency', multiplier: 2 }
        ]
    },
    {
        id: 'robot_mk3',
        name: 'Robot MK3',
        description: 'High-efficiency gear producer',
        image: '../assets/Robot_3.png',
        baseCost: 4240,
        baseIncrease: 410,
        costMultiplier: 1.08,
        increaseMultiplier: 1.04,
        type: 'auto',
        powerUps: [
            { level: 10, name: '2x Robot MK3', description: 'Double Robot MK3 efficiency', multiplier: 2 },
            { level: 20, name: '3x Robot MK3', description: 'Triple Robot MK3 efficiency', multiplier: 3 },
            { level: 30, name: '2x Robot MK3', description: 'Double Robot MK3 efficiency', multiplier: 2 }
        ]
    },
    {
        id: 'robot_mk4',
        name: 'Robot MK4',
        description: 'Ultimate gear production unit',
        image: '../assets/Robot_5.png',
        baseCost: 52800,
        baseIncrease: 5500,
        costMultiplier: 1.05,
        increaseMultiplier: 1.045,
        type: 'auto',
        powerUps: [
            { level: 10, name: '2x Robot MK4', description: 'Double Robot MK4 efficiency', multiplier: 2 },
            { level: 20, name: '3x Robot MK4', description: 'Triple Robot MK4 efficiency', multiplier: 3 },
            { level: 30, name: '2x Robot MK4', description: 'Double Robot MK4 efficiency', multiplier: 2 }
        ]
    }
];

// Upgrade state management
export class UpgradeManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.upgrades = new Map();
        this.container = null;
        
        this.initializeUpgrades();
    }

    initializeUpgrades() {
        // Initialize upgrade states
        upgradeConfig.forEach(config => {
            this.upgrades.set(config.id, {
                ...config,
                level: 0,
                currentCost: config.baseCost,
                currentIncrease: config.baseIncrease,
                totalProduction: 0,
                element: null
            });
        });
    }

    render(container) {
        this.container = container;
        container.innerHTML = '';
        
        this.upgrades.forEach((upgrade, id) => {
            const upgradeElement = this.createUpgradeElement(upgrade);
            container.appendChild(upgradeElement);
            upgrade.element = upgradeElement;
        });
        
        this.updateDisplay();
    }

    createUpgradeElement(upgrade) {
        const upgradeDiv = document.createElement('div');
        upgradeDiv.className = 'upgrade-item';
        upgradeDiv.dataset.upgradeId = upgrade.id;
        
        const nextPowerUp = this.getNextPowerUp(upgrade);
        const powerUpClass = nextPowerUp ? 'has-powerup' : '';
        
        upgradeDiv.innerHTML = `
            <div class="upgrade-content ${powerUpClass}">
                <div class="upgrade-icon">
                    <img src="${upgrade.image}" alt="${upgrade.name}" class="upgrade-img">
                    ${upgrade.level > 0 ? `<span class="level-badge">${upgrade.level}</span>` : ''}
                </div>
                <div class="upgrade-info">
                    <h3 class="upgrade-name">${upgrade.name}</h3>
                    <p class="upgrade-description">${upgrade.description}</p>
                    <div class="upgrade-stats">
                        <span class="upgrade-increase">+${Math.round(upgrade.currentIncrease)} ${upgrade.type === 'click' ? 'per click' : 'per second'}</span>
                    </div>
                </div>
                <div class="upgrade-purchase">
                    <div class="upgrade-cost">
                        <img src="../assets/Gear.png" alt="Cost" class="cost-gear">
                        <span class="cost-amount">${Math.round(upgrade.currentCost)}</span>
                    </div>
                    <button class="buy-btn ${this.canAfford(upgrade) ? 'affordable' : 'expensive'}" 
                            data-upgrade-id="${upgrade.id}"
                            ${this.canAfford(upgrade) ? '' : 'disabled'}>
                        Buy
                    </button>
                </div>
            </div>
            ${nextPowerUp ? `
                <div class="powerup-preview">
                    <span class="powerup-text">Next: ${nextPowerUp.description}</span>
                </div>
            ` : ''}
        `;
        
        // Add click handler
        const buyBtn = upgradeDiv.querySelector('.buy-btn');
        buyBtn.addEventListener('click', () => this.buyUpgrade(upgrade.id));
        
        return upgradeDiv;
    }

    getNextPowerUp(upgrade) {
        return upgrade.powerUps.find(powerUp => powerUp.level === upgrade.level + 1);
    }

    canAfford(upgrade) {
        return this.gameState.gears >= upgrade.currentCost;
    }

    buyUpgrade(upgradeId) {
        const upgrade = this.upgrades.get(upgradeId);
        if (!upgrade || !this.canAfford(upgrade)) {
            return false;
        }

        // Deduct cost
        this.gameState.gears -= upgrade.currentCost;
        
        // Check for power-up at current level
        const powerUp = upgrade.powerUps.find(pu => pu.level === upgrade.level);
        if (powerUp) {
            // Apply power-up multiplier to current production
            upgrade.totalProduction *= powerUp.multiplier;
            this.gameState.playUpgradeSound();
            this.gameState.showNotification(`${powerUp.name} activated! ${powerUp.description}`);
        }
        
        // Increment level
        upgrade.level++;
        
        // Update production
        if (upgrade.type === 'click') {
            this.gameState.gearsPerClick -= upgrade.totalProduction; // Remove old contribution
            upgrade.totalProduction += upgrade.currentIncrease;
            this.gameState.gearsPerClick += upgrade.totalProduction; // Add new contribution
        } else {
            this.gameState.gearsPerSecond -= upgrade.totalProduction; // Remove old contribution
            upgrade.totalProduction += upgrade.currentIncrease;
            this.gameState.gearsPerSecond += upgrade.totalProduction; // Add new contribution
        }
        
        // Update costs and increases for next level
        upgrade.currentCost = Math.round(upgrade.currentCost * upgrade.costMultiplier);
        upgrade.currentIncrease = parseFloat((upgrade.currentIncrease * upgrade.increaseMultiplier).toFixed(2));
        
        this.gameState.playUpgradeSound();
        this.updateDisplay();
        this.gameState.updateDisplay();
        
        return true;
    }

    updateDisplay() {
        if (!this.container) return;
        
        this.upgrades.forEach((upgrade, id) => {
            if (!upgrade.element) return;
            
            const costElement = upgrade.element.querySelector('.cost-amount');
            const increaseElement = upgrade.element.querySelector('.upgrade-increase');
            const buyBtn = upgrade.element.querySelector('.buy-btn');
            const levelBadge = upgrade.element.querySelector('.level-badge');
            const upgradeContent = upgrade.element.querySelector('.upgrade-content');
            const powerupPreview = upgrade.element.querySelector('.powerup-preview');
            
            // Update cost display
            costElement.textContent = Math.round(upgrade.currentCost);
            
            // Update increase display
            increaseElement.textContent = `+${Math.round(upgrade.currentIncrease)} ${upgrade.type === 'click' ? 'per click' : 'per second'}`;
            
            // Update affordability
            const affordable = this.canAfford(upgrade);
            buyBtn.disabled = !affordable;
            buyBtn.className = `buy-btn ${affordable ? 'affordable' : 'expensive'}`;
            
            // Update level badge
            if (upgrade.level > 0) {
                if (levelBadge) {
                    levelBadge.textContent = upgrade.level;
                } else {
                    const iconDiv = upgrade.element.querySelector('.upgrade-icon');
                    const badge = document.createElement('span');
                    badge.className = 'level-badge';
                    badge.textContent = upgrade.level;
                    iconDiv.appendChild(badge);
                }
            }
            
            // Update power-up preview
            const nextPowerUp = this.getNextPowerUp(upgrade);
            if (nextPowerUp) {
                upgradeContent.classList.add('has-powerup');
                if (powerupPreview) {
                    powerupPreview.querySelector('.powerup-text').textContent = `Next: ${nextPowerUp.description}`;
                } else {
                    const preview = document.createElement('div');
                    preview.className = 'powerup-preview';
                    preview.innerHTML = `<span class="powerup-text">Next: ${nextPowerUp.description}</span>`;
                    upgrade.element.appendChild(preview);
                }
            } else {
                upgradeContent.classList.remove('has-powerup');
                if (powerupPreview) {
                    powerupPreview.remove();
                }
            }
        });
    }

    // Save/load functionality
    getSaveData() {
        const saveData = {};
        this.upgrades.forEach((upgrade, id) => {
            saveData[id] = {
                level: upgrade.level,
                currentCost: upgrade.currentCost,
                currentIncrease: upgrade.currentIncrease,
                totalProduction: upgrade.totalProduction
            };
        });
        return saveData;
    }

    loadSaveData(saveData) {
        this.upgrades.forEach((upgrade, id) => {
            const saved = saveData[id];
            if (saved) {
                upgrade.level = saved.level || 0;
                upgrade.currentCost = saved.currentCost || upgrade.baseCost;
                upgrade.currentIncrease = saved.currentIncrease || upgrade.baseIncrease;
                upgrade.totalProduction = saved.totalProduction || 0;
            }
        });
        this.updateDisplay();
    }
}