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
    parsedIncrease: parseFloat(
      document.querySelector(".Clicker-increase").innerHTML
    ),
    level: document.querySelector(".Clicker-level"),
    gearMultiplier: 1.025,
    costMultiplier: 1.12,
  },
  {
    name: "Robot_MK1",
    cost: document.querySelector(".Robot_MK1-cost"),
    parsedCost: parseFloat(document.querySelector(".Robot_MK1-cost").innerHTML),
    increase: document.querySelector(".Robot_MK1-increase"),
    parsedIncrease: parseFloat(
      document.querySelector(".Robot_MK1-increase").innerHTML
    ),
    level: document.querySelector(".Robot_MK1-level"),
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
    level: document.querySelector(".Robot_MK2-level"),
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
    level: document.querySelector(".Robot_MK3-level"),
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
    level: document.querySelector(".Robot_MK4-level"),
    gearMultiplier: 1.04,
    costMultiplier: 1.1,
  },
];
