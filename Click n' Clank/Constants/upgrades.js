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
        name: "2x Clicker",
        description: "Double clicking power",
        multiplier: 2,
      },
    ],
    gearMultiplier: 1.025,
    costMultiplier: 1.12,
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
        name: "2x Robot_MK1",
        description: "Double Robot_MK1 efficiency",
        multiplier: 2,
      },
    ],

    level: document.querySelector(".Robot_MK1-level"),
    power: 0,
    gearMultiplier: 1.03,
    costMultiplier: 1.15,
  },
  {
    name: "Robot_MK2",
    cost: document.querySelector(".Robot_MK2-cost"),
    parsedCost: parseFloat(document.querySelector(".Robot_MK2-cost").innerHTML),
    increase: document.querySelector(".Robot_MK2-increase"),
    parsedIncrease: parseFloat(
      document.querySelector(".Robot_MK2-increase").innerHTML
    ),
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
        name: "2x Robot_MK2",
        description: "Double Robot_MK2 efficiency",
        multiplier: 2,
      },
    ],
    level: document.querySelector(".Robot_MK2-level"),
    power: 0,
    gearMultiplier: 1.035,
    costMultiplier: 1.11,
  },
  {
    name: "Robot_MK3",
    cost: document.querySelector(".Robot_MK3-cost"),
    parsedCost: parseFloat(document.querySelector(".Robot_MK3-cost").innerHTML),
    increase: document.querySelector(".Robot_MK3-increase"),
    parsedIncrease: parseFloat(
      document.querySelector(".Robot_MK3-increase").innerHTML
    ),
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
        name: "2x Robot_MK3",
        description: "Double Robot_MK3 efficiency",
        multiplier: 2,
      },
    ],
    level: document.querySelector(".Robot_MK3-level"),
    power: 0,
    gearMultiplier: 1.04,
    costMultiplier: 1.1,
  },
  {
    name: "Robot_MK4",
    cost: document.querySelector(".Robot_MK4-cost"),
    parsedCost: parseFloat(document.querySelector(".Robot_MK4-cost").innerHTML),
    increase: document.querySelector(".Robot_MK4-increase"),
    parsedIncrease: parseFloat(
      document.querySelector(".Robot_MK4-increase").innerHTML
    ),
    powerUps: [
      {
        name: "2x Robot_MK4",
        description: "Double Robot_MK4 efficiency",
        multiplier: 2,
      },
      {
        name: "3x Robot_MK4",
        description: "Triple Robot_MK4 efficiency",
        multiplier: 3,
      },
      {
        name: "2x Robot_MK4",
        description: "Double Robot_MK4 efficiency",
        multiplier: 2,
      },
    ],
    level: document.querySelector(".Robot_MK4-level"),
    power: 0,
    gearMultiplier: 1.045,
    costMultiplier: 1.098,
  },
];

export const powerUpIntervals = [10, 20, 30, //50, 70, 100, 150, 200, 250, 300
  ];
