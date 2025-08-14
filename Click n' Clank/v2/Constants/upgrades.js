import { defaultValues } from "./defaultValues.js";

function createUpgrades() {
  const upgradesContainer = document.getElementById("upgrades-container");
  const template = document.getElementById("upgrade-template").textContent;

  defaultValues.forEach((obj) => {
    let html = template;

    Object.keys(obj).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, `g`);
      html = html.replace(regex, obj[key]);
    });

    upgradesContainer.innerHTML += html;
  });
}

createUpgrades();

export const upgrades = [
  // Original upgrades
  {
    name: "Clicker",
    cost: document.querySelector(".Clicker-cost"),
    parsedCost: parseFloat(document.querySelector(".Clicker-cost").innerHTML),
    increase: document.querySelector(".Clicker-increase"),
    parsedIncrease: parseFloat(document.querySelector(".Clicker-increase").innerHTML),
    level: document.querySelector(".Clicker-level"),
    powerUps: [
      {
        name: "2x Clicker",
        description: "Double clicking power",
        multiplier: 2,
      },
      {
        name: "3x Clicker",
        description: "Triple clicking power",
        multiplier: 3,
      },
      {
        name: "5x Clicker",
        description: "5x clicking power",
        multiplier: 5,
      },
    ],
    gearMultiplier: 1.025,
    costMultiplier: 1.12,
    type: "clicker"
  },
  {
    name: "Robot_MK1",
    cost: document.querySelector(".Robot_MK1-cost"),
    parsedCost: parseFloat(document.querySelector(".Robot_MK1-cost").innerHTML),
    increase: document.querySelector(".Robot_MK1-increase"),
    parsedIncrease: parseFloat(document.querySelector(".Robot_MK1-increase").innerHTML),
    powerUps: [
      {
        name: "2x Robot_MK1",
        description: "Double Robot_MK1 efficiency",
        multiplier: 2,
      },
      {
        name: "3x Robot_MK1",
        description: "Triple Robot_MK1 efficiency",
        multiplier: 3,
      },
      {
        name: "4x Robot_MK1",
        description: "4x Robot_MK1 efficiency",
        multiplier: 4,
      },
    ],
    level: document.querySelector(".Robot_MK1-level"),
    power: 0,
    gearMultiplier: 1.03,
    costMultiplier: 1.15,
    type: "generator"
  },
  {
    name: "Robot_MK2",
    cost: document.querySelector(".Robot_MK2-cost"),
    parsedCost: parseFloat(document.querySelector(".Robot_MK2-cost").innerHTML),
    increase: document.querySelector(".Robot_MK2-increase"),
    parsedIncrease: parseFloat(document.querySelector(".Robot_MK2-increase").innerHTML),
    powerUps: [
      {
        name: "2x Robot_MK2",
        description: "Double Robot_MK2 efficiency",
        multiplier: 2,
      },
      {
        name: "3x Robot_MK2",
        description: "Triple Robot_MK2 efficiency",
        multiplier: 3,
      },
      {
        name: "4x Robot_MK2",
        description: "4x Robot_MK2 efficiency",
        multiplier: 4,
      },
    ],
    level: document.querySelector(".Robot_MK2-level"),
    power: 0,
    gearMultiplier: 1.035,
    costMultiplier: 1.11,
    type: "generator"
  },
  {
    name: "Robot_MK3",
    cost: document.querySelector(".Robot_MK3-cost"),
    parsedCost: parseFloat(document.querySelector(".Robot_MK3-cost").innerHTML),
    increase: document.querySelector(".Robot_MK3-increase"),
    parsedIncrease: parseFloat(document.querySelector(".Robot_MK3-increase").innerHTML),
    powerUps: [
      {
        name: "2x Robot_MK3",
        description: "Double Robot_MK3 efficiency",
        multiplier: 2,
      },
      {
        name: "3x Robot_MK3",
        description: "Triple Robot_MK3 efficiency",
        multiplier: 3,
      },
      {
        name: "5x Robot_MK3",
        description: "5x Robot_MK3 efficiency",
        multiplier: 5,
      },
    ],
    level: document.querySelector(".Robot_MK3-level"),
    power: 0,
    gearMultiplier: 1.04,
    costMultiplier: 1.1,
    type: "generator"
  },
  {
    name: "Robot_MK4",
    cost: document.querySelector(".Robot_MK4-cost"),
    parsedCost: parseFloat(document.querySelector(".Robot_MK4-cost").innerHTML),
    increase: document.querySelector(".Robot_MK4-increase"),
    parsedIncrease: parseFloat(document.querySelector(".Robot_MK4-increase").innerHTML),
    powerUps: [
      {
        name: "2x Robot_MK4",
        description: "Double Robot_MK4 efficiency",
        multiplier: 2,
      },
      {
        name: "4x Robot_MK4",
        description: "4x Robot_MK4 efficiency",
        multiplier: 4,
      },
      {
        name: "10x Robot_MK4",
        description: "10x Robot_MK4 efficiency",
        multiplier: 10,
      },
    ],
    level: document.querySelector(".Robot_MK4-level"),
    power: 0,
    gearMultiplier: 1.045,
    costMultiplier: 1.098,
    type: "generator"
  },
  // New v2 upgrades
  {
    name: "Auto_Clicker",
    cost: document.querySelector(".Auto_Clicker-cost"),
    parsedCost: parseFloat(document.querySelector(".Auto_Clicker-cost").innerHTML),
    increase: document.querySelector(".Auto_Clicker-increase"),
    parsedIncrease: parseFloat(document.querySelector(".Auto_Clicker-increase").innerHTML),
    powerUps: [
      {
        name: "Faster Auto-Click",
        description: "Auto-clicks 2x faster",
        multiplier: 2,
      },
      {
        name: "Multi Auto-Click",
        description: "Multiple clicks per tick",
        multiplier: 3,
      },
      {
        name: "Quantum Auto-Click",
        description: "Quantum speed clicking",
        multiplier: 5,
      },
    ],
    level: document.querySelector(".Auto_Clicker-level"),
    power: 0,
    gearMultiplier: 1.5,
    costMultiplier: 1.25,
    type: "auto_clicker"
  },
  {
    name: "Gear_Multiplier",
    cost: document.querySelector(".Gear_Multiplier-cost"),
    parsedCost: parseFloat(document.querySelector(".Gear_Multiplier-cost").innerHTML),
    increase: document.querySelector(".Gear_Multiplier-increase"),
    parsedIncrease: parseFloat(document.querySelector(".Gear_Multiplier-increase").innerHTML),
    powerUps: [
      {
        name: "Enhanced Multiplier",
        description: "Better gear multiplication",
        multiplier: 2,
      },
      {
        name: "Advanced Multiplier",
        description: "Advanced multiplication tech",
        multiplier: 3,
      },
      {
        name: "Quantum Multiplier",
        description: "Quantum multiplication field",
        multiplier: 5,
      },
    ],
    level: document.querySelector(".Gear_Multiplier-level"),
    power: 1,
    gearMultiplier: 1.1,
    costMultiplier: 1.35,
    type: "multiplier"
  },
  {
    name: "Efficiency_Engine",
    cost: document.querySelector(".Efficiency_Engine-cost"),
    parsedCost: parseFloat(document.querySelector(".Efficiency_Engine-cost").innerHTML),
    increase: document.querySelector(".Efficiency_Engine-increase"),
    parsedIncrease: parseFloat(document.querySelector(".Efficiency_Engine-increase").innerHTML),
    powerUps: [
      {
        name: "Cost Reduction",
        description: "Greater cost efficiency",
        multiplier: 2,
      },
      {
        name: "Bulk Discount",
        description: "Bulk purchase discounts",
        multiplier: 3,
      },
      {
        name: "Economic Mastery",
        description: "Master of efficiency",
        multiplier: 5,
      },
    ],
    level: document.querySelector(".Efficiency_Engine-level"),
    power: 1,
    gearMultiplier: 1.05,
    costMultiplier: 1.4,
    type: "efficiency"
  },
  {
    name: "Lucky_Clicker",
    cost: document.querySelector(".Lucky_Clicker-cost"),
    parsedCost: parseFloat(document.querySelector(".Lucky_Clicker-cost").innerHTML),
    increase: document.querySelector(".Lucky_Clicker-increase"),
    parsedIncrease: parseFloat(document.querySelector(".Lucky_Clicker-increase").innerHTML),
    powerUps: [
      {
        name: "Lucky Strike",
        description: "Better luck chances",
        multiplier: 2,
      },
      {
        name: "Fortune's Favor",
        description: "Enhanced critical hits",
        multiplier: 3,
      },
      {
        name: "Blessed Clicks",
        description: "Divine luck blessing",
        multiplier: 5,
      },
    ],
    level: document.querySelector(".Lucky_Clicker-level"),
    power: 0.01,
    gearMultiplier: 2,
    costMultiplier: 1.3,
    type: "luck"
  },
  {
    name: "Quantum_Processor",
    cost: document.querySelector(".Quantum_Processor-cost"),
    parsedCost: parseFloat(document.querySelector(".Quantum_Processor-cost").innerHTML),
    increase: document.querySelector(".Quantum_Processor-increase"),
    parsedIncrease: parseFloat(document.querySelector(".Quantum_Processor-increase").innerHTML),
    powerUps: [
      {
        name: "Quantum Entanglement",
        description: "Quantum gear generation",
        multiplier: 3,
      },
      {
        name: "Parallel Processing",
        description: "Multiple quantum states",
        multiplier: 5,
      },
      {
        name: "Quantum Supremacy",
        description: "Ultimate quantum power",
        multiplier: 10,
      },
    ],
    level: document.querySelector(".Quantum_Processor-level"),
    power: 0,
    gearMultiplier: 2.5,
    costMultiplier: 1.5,
    type: "quantum"
  },
  {
    name: "Time_Accelerator",
    cost: document.querySelector(".Time_Accelerator-cost"),
    parsedCost: parseFloat(document.querySelector(".Time_Accelerator-cost").innerHTML),
    increase: document.querySelector(".Time_Accelerator-increase"),
    parsedIncrease: parseFloat(document.querySelector(".Time_Accelerator-increase").innerHTML),
    powerUps: [
      {
        name: "Time Dilation",
        description: "Faster time flow",
        multiplier: 2,
      },
      {
        name: "Temporal Boost",
        description: "Enhanced time effects",
        multiplier: 4,
      },
      {
        name: "Chronos Engine",
        description: "Master of time itself",
        multiplier: 8,
      },
    ],
    level: document.querySelector(".Time_Accelerator-level"),
    power: 1,
    gearMultiplier: 1.25,
    costMultiplier: 1.6,
    type: "time"
  }
];

export const powerUpIntervals = [10, 25, 50, 100, 150, 250, 500, 1000];