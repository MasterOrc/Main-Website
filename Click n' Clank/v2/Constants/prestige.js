/**
 * Prestige System Constants for Click n' Clank v2
 * Defines prestige requirements, upgrades, and calculations
 */

/**
 * Prestige requirements - minimum values needed to unlock prestige
 */
export const PRESTIGE_REQUIREMENTS = {
  minTotalGears: 1000000,      // 1 million total gears earned
  minUpgradeLevel: 25,         // At least one upgrade at level 25
  minGearsPerSecond: 1000      // At least 1000 gears per second
};

/**
 * Prestige point calculation
 * Formula: Math.floor(Math.sqrt(totalGears / 100000))
 */
export function calculatePrestigePoints(totalGears) {
  if (totalGears < PRESTIGE_REQUIREMENTS.minTotalGears) return 0;
  return Math.floor(Math.sqrt(totalGears / 100000));
}

/**
 * Prestige upgrades that provide permanent bonuses
 */
export const PRESTIGE_UPGRADES = [
  {
    id: 'click_multiplier',
    name: 'Enhanced Clicking',
    description: 'Increases click power by 10% per level',
    baseCost: 1,
    costMultiplier: 2,
    maxLevel: 20,
    effect: (level) => 1 + (level * 0.1), // 1.1x, 1.2x, 1.3x, etc.
    icon: '👆'
  },
  {
    id: 'gear_multiplier',
    name: 'Gear Efficiency',
    description: 'Increases all gear generation by 5% per level',
    baseCost: 2,
    costMultiplier: 2.5,
    maxLevel: 15,
    effect: (level) => 1 + (level * 0.05),
    icon: '⚙️'
  },
  {
    id: 'cost_reduction',
    name: 'Bulk Discount',
    description: 'Reduces upgrade costs by 3% per level',
    baseCost: 3,
    costMultiplier: 3,
    maxLevel: 10,
    effect: (level) => 1 - (level * 0.03), // 0.97x, 0.94x, 0.91x, etc.
    icon: '💰'
  },
  {
    id: 'starting_bonus',
    name: 'Head Start',
    description: 'Start each prestige with bonus gears',
    baseCost: 2,
    costMultiplier: 2.2,
    maxLevel: 8,
    effect: (level) => level * 1000, // 1k, 2k, 3k, etc.
    icon: '🚀'
  },
  {
    id: 'critical_chance',
    name: 'Lucky Strikes',
    description: 'Increases critical hit chance by 1% per level',
    baseCost: 4,
    costMultiplier: 2.8,
    maxLevel: 12,
    effect: (level) => level * 0.01, // +1%, +2%, +3%, etc.
    icon: '🍀'
  },
  {
    id: 'passive_boost',
    name: 'Passive Power',
    description: 'Increases passive income by 8% per level',
    baseCost: 3,
    costMultiplier: 2.6,
    maxLevel: 15,
    effect: (level) => 1 + (level * 0.08),
    icon: '📈'
  },
  {
    id: 'achievement_boost',
    name: 'Achievement Hunter',
    description: 'Achievement rewards are 25% better per level',
    baseCost: 5,
    costMultiplier: 3.2,
    maxLevel: 6,
    effect: (level) => 1 + (level * 0.25),
    icon: '🏆'
  },
  {
    id: 'time_warp',
    name: 'Time Acceleration',
    description: 'All time-based effects are 5% faster per level',
    baseCost: 6,
    costMultiplier: 3.5,
    maxLevel: 10,
    effect: (level) => 1 + (level * 0.05),
    icon: '⏰'
  }
];

/**
 * Calculate the cost of a prestige upgrade at a specific level
 */
export function calculatePrestigeUpgradeCost(upgrade, currentLevel) {
  if (currentLevel >= upgrade.maxLevel) return Infinity;
  return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel));
}

/**
 * Get prestige upgrade by ID
 */
export function getPrestigeUpgrade(id) {
  return PRESTIGE_UPGRADES.find(upgrade => upgrade.id === id);
}

/**
 * Check if player meets prestige requirements
 */
export function canPrestige(gameState) {
  const { totalGears, gears_per_second, upgrades } = gameState;
  
  // Check total gears requirement
  if (totalGears < PRESTIGE_REQUIREMENTS.minTotalGears) return false;
  
  // Check gears per second requirement
  if (gears_per_second < PRESTIGE_REQUIREMENTS.minGearsPerSecond) return false;
  
  // Check upgrade level requirement
  const maxUpgradeLevel = upgrades.reduce((max, upgrade) => {
    const level = parseFloat(upgrade.level.innerHTML) || 0;
    return Math.max(max, level);
  }, 0);
  
  if (maxUpgradeLevel < PRESTIGE_REQUIREMENTS.minUpgradeLevel) return false;
  
  return true;
}

/**
 * Default prestige state
 */
export const DEFAULT_PRESTIGE_STATE = {
  totalPrestiges: 0,
  prestigePoints: 0,
  totalPrestigePoints: 0, // All time total
  lifetimeGears: 0,       // All time total gears across all prestiges
  prestigeUpgrades: {}    // Object with upgrade_id: level pairs
};

// Initialize prestige upgrade levels to 0
PRESTIGE_UPGRADES.forEach(upgrade => {
  DEFAULT_PRESTIGE_STATE.prestigeUpgrades[upgrade.id] = 0;
});