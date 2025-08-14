export const defaultValues = [
  // Original upgrades
  {
    name: "Clicker",
    image: "./assets/click-icon-black.png",
    cost: 10,
    increase: 1,
    type: "click"
  },
  {
    name: "Robot_MK1",
    image: "./assets/Robot_1.png",
    cost: 60,
    increase: 4,
    type: "second"
  },
  {
    name: "Robot_MK2",
    image: "./assets/Robot_2.png",
    cost: 480,
    increase: 32,
    type: "second"
  },
  {
    name: "Robot_MK3",
    image: "./assets/Robot_3.png",
    cost: 4240,
    increase: 410,
    type: "second"
  },
  {
    name: "Robot_MK4",
    image: "./assets/Robot_5.png",
    cost: 52800,
    increase: 5500,
    type: "second"
  },
  // New v2 upgrades
  {
    name: "Auto_Clicker",
    image: "./assets/click-icon-white.png",
    cost: 1000,
    increase: 0.5,
    type: "second",
    description: "Automatically clicks the gear"
  },
  {
    name: "Gear_Multiplier",
    image: "./assets/Gear_Icon.png",
    cost: 5000,
    increase: 0.1,
    type: "multiplier",
    description: "Increases all gear generation by percentage"
  },
  {
    name: "Efficiency_Engine",
    image: "./assets/Robot_6.png",
    cost: 25000,
    increase: 0.05,
    type: "efficiency",
    description: "Reduces all upgrade costs"
  },
  {
    name: "Lucky_Clicker",
    image: "./assets/Gear.png",
    cost: 15000,
    increase: 0.01,
    type: "luck",
    description: "Chance for bonus gears on click"
  },
  {
    name: "Quantum_Processor",
    image: "./assets/Robot_3.png",
    cost: 100000,
    increase: 2,
    type: "quantum",
    description: "Unlocks quantum effects"
  },
  {
    name: "Time_Accelerator",
    image: "./assets/Robot_6.png",
    cost: 500000,
    increase: 0.25,
    type: "time",
    description: "Speeds up passive income"
  }
];