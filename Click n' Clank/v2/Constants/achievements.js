export const achievements = [
  // Click-based achievements
  {
    id: "first_click",
    name: "First Click",
    description: "Click the gear for the first time",
    icon: "👆",
    type: "clicks",
    target: 1,
    reward: "10 gears",
    unlocked: false,
    progress: 0
  },
  {
    id: "click_novice",
    name: "Click Novice",
    description: "Click 100 times",
    icon: "🔄",
    type: "clicks",
    target: 100,
    reward: "100 gears",
    unlocked: false,
    progress: 0
  },
  {
    id: "click_expert",
    name: "Click Expert", 
    description: "Click 1,000 times",
    icon: "⚡",
    type: "clicks",
    target: 1000,
    reward: "1,000 gears",
    unlocked: false,
    progress: 0
  },
  {
    id: "click_master",
    name: "Click Master",
    description: "Click 10,000 times",
    icon: "💫",
    type: "clicks", 
    target: 10000,
    reward: "2x click multiplier",
    unlocked: false,
    progress: 0
  },
  
  // Gear accumulation achievements
  {
    id: "first_hundred",
    name: "First Hundred",
    description: "Accumulate 100 gears",
    icon: "💰",
    type: "gears_total",
    target: 100,
    reward: "50 gears",
    unlocked: false,
    progress: 0
  },
  {
    id: "gear_collector",
    name: "Gear Collector",
    description: "Accumulate 10,000 gears",
    icon: "🏆",
    type: "gears_total", 
    target: 10000,
    reward: "500 gears",
    unlocked: false,
    progress: 0
  },
  {
    id: "gear_tycoon",
    name: "Gear Tycoon",
    description: "Accumulate 1,000,000 gears",
    icon: "👑",
    type: "gears_total",
    target: 1000000,
    reward: "5% all production",
    unlocked: false,
    progress: 0
  },
  
  // Upgrade achievements
  {
    id: "first_upgrade",
    name: "First Upgrade",
    description: "Buy your first upgrade",
    icon: "🛠️",
    type: "upgrades_bought", 
    target: 1,
    reward: "25 gears",
    unlocked: false,
    progress: 0
  },
  {
    id: "upgrade_collector",
    name: "Upgrade Collector", 
    description: "Buy 50 upgrades",
    icon: "🔧",
    type: "upgrades_bought",
    target: 50,
    reward: "1,000 gears",
    unlocked: false,
    progress: 0
  },
  {
    id: "automation_master",
    name: "Automation Master",
    description: "Reach level 25 on any robot",
    icon: "🤖", 
    type: "upgrade_level",
    target: 25,
    reward: "10% robot efficiency",
    unlocked: false,
    progress: 0
  },
  
  // Production achievements
  {
    id: "passive_income",
    name: "Passive Income",
    description: "Generate 100 gears per second",
    icon: "📈",
    type: "gears_per_second",
    target: 100,
    reward: "2,000 gears",
    unlocked: false,
    progress: 0
  },
  {
    id: "industrial_complex",
    name: "Industrial Complex", 
    description: "Generate 10,000 gears per second",
    icon: "🏭",
    type: "gears_per_second",
    target: 10000,
    reward: "25,000 gears",
    unlocked: false,
    progress: 0
  },
  
  // Special achievements 
  {
    id: "speed_buyer",
    name: "Speed Buyer",
    description: "Buy 10 upgrades in 30 seconds",
    icon: "⚡",
    type: "special",
    target: 10,
    reward: "Speed boost effect",
    unlocked: false,
    progress: 0,
    timeLimit: 30
  },
  {
    id: "lucky_seven",
    name: "Lucky Seven",
    description: "Get 7 critical hits in a row",
    icon: "🍀",
    type: "critical_streak",
    target: 7,
    reward: "Permanent luck boost",
    unlocked: false,
    progress: 0
  },
  {
    id: "efficiency_expert",
    name: "Efficiency Expert",
    description: "Reduce upgrade costs by 50%",
    icon: "💡",
    type: "efficiency",
    target: 0.5,
    reward: "Cost reduction bonus",
    unlocked: false,
    progress: 0
  },
  
  // Time-based achievements
  {
    id: "dedicated_player",
    name: "Dedicated Player",
    description: "Play for 1 hour total",
    icon: "⏰",
    type: "time_played",
    target: 3600, // seconds
    reward: "Time bonus multiplier",
    unlocked: false,
    progress: 0
  },
  {
    id: "idle_master",
    name: "Idle Master",
    description: "Generate 100,000 gears while idle",
    icon: "😴",
    type: "idle_gears",
    target: 100000,
    reward: "Idle efficiency boost",
    unlocked: false,
    progress: 0
  },
  
  // Advanced achievements
  {
    id: "quantum_leap",
    name: "Quantum Leap",
    description: "Purchase the Quantum Processor",
    icon: "⚛️",
    type: "special_upgrade",
    target: "Quantum_Processor",
    reward: "Quantum effects unlock",
    unlocked: false,
    progress: 0
  },
  {
    id: "time_lord",
    name: "Time Lord",
    description: "Purchase the Time Accelerator",
    icon: "🕐", 
    type: "special_upgrade",
    target: "Time_Accelerator",
    reward: "Temporal powers",
    unlocked: false,
    progress: 0
  },
  {
    id: "completionist",
    name: "Completionist",
    description: "Unlock all other achievements",
    icon: "🌟",
    type: "meta",
    target: 17, // Total other achievements
    reward: "Ultimate prestige bonus",
    unlocked: false,
    progress: 0
  }
];