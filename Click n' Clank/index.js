import { powerUpIntervals, upgrades } from "./Constants/upgrades.js";

let gear = document.querySelector(".gear-cost");
let parsedGear = parseFloat(gear.innerHTML);

let gears_per_clickText = document.getElementById("GearsPerClick-text");
let gears_per_secondText = document.getElementById("GearsPerSecond-text");

let gearImgContainer = document.querySelector(".gear-img-container");

let gears_per_click = 1;

let gears_per_second = 0;

const bgm = new Audio("./assets/Audio/bgm.mp3");
bgm.volume = 0.05;

function incrementGear(event) {
  const clickingSound = new Audio("./assets/Audio/click.wav");
  clickingSound.play();
  gear.innerHTML = Math.round((parsedGear += gears_per_click));
  updateTitle(); // Update the title after incrementing the gears

  const x = event.offsetX;
  const y = event.offsetY;

  const div = document.createElement("div");
  div.innerHTML = `+${Math.round(gears_per_click)}`;
  div.style.cssText = `color: white; position: absolute; top: ${y}px; left: ${x}px; font-size: 15px; pointer-events: none;`;
  gearImgContainer.appendChild(div);

  div.classList.add("fade-up");

  timeout(div);
}

const timeout = (div) => {
  setTimeout(() => {
    div.remove();
  }, 800);
};

function buyUpgrade(upgrade) {
  const mu = upgrades.find((u) => {
    if (u.name === upgrade) return u;
  });

  const upgradeDiv = document.getElementById(`${mu.name}-upgrade`)
  const nextLevelDiv = document.getElementById(`${mu.name}-next-level`)
  const nextLevelP = document.getElementById(`${mu.name}-next-p`)

  if (parsedGear >= mu.parsedCost) {
    const upgradeSound = new Audio("./assets/Audio/upgrade.mp3");
    upgradeSound.volume = 0.1;
    upgradeSound.play();

    gear.innerHTML = Math.round((parsedGear -= mu.parsedCost));

    let index = powerUpIntervals.indexOf(parseFloat(mu.level.innerHTML))
    
    if  (index !== -1) {
      upgradeDiv.style.cssText = `border-color: rgb(105, 105, 105)`;
      nextLevelDiv.style.cssText = `background-color: rgb(105, 105, 105); font-weight: normal`;
      mu.cost.innerHTML = Math.round(mu.parsedCost *= mu.costMultiplier)

      if (mu.name === 'Clicker') {
        gears_per_click *= mu.powerUps[index].multiplier
        nextLevelP.innerHTML = `+${mu.parsedIncrease} gears per click`
      } else {
        gears_per_second -= mu.power
        mu.power *= mu.powerUps[index].multiplier
        gears_per_second += mu.power
        nextLevelP.innerHTML = `+${mu.parsedIncrease} gears per second`
      }
    }

    mu.level.innerHTML++;

    index = powerUpIntervals.indexOf(parseFloat(mu.level.innerHTML))

    if ( index !== -1) {
      upgradeDiv.style.cssText = `border-color: #02E218`;
      nextLevelDiv.style.cssText = `background-color: #DD571C; font-weight: bold`;
      nextLevelP.innerText = mu.powerUps[index].description;

      mu.cost.innerHTML = Math.round(mu.parsedCost * 2.5 * 1.004 ** parseFloat(mu.level.innerHTML))
    } else {
      mu.cost.innerHTML = Math.round(mu.parsedCost *= mu.costMultiplier);
      mu.parsedIncrease = parseFloat((mu.parsedIncrease * mu.gearMultiplier).toFixed(2));

      if (mu.name === 'Clicker') nextLevelP.innerHTML = `+${mu.parsedIncrease} gears per click`
      else nextLevelP.innerHTML = `+${mu.parsedIncrease} gears per second`
    }

    if (mu.name === 'Clicker') gears_per_click += mu.parsedIncrease
    else{
      gears_per_second -= mu.power
      mu.power += mu.parsedIncrease
      gears_per_second += mu.power
    }

  }
  //console.log(gears_per_click)
  //console.log(gears_per_second)
}

function updateTitle() {
  document.title = `Gears - ${Math.round(parsedGear)} | Click n' Clank`;
}

setInterval(() => {
  parsedGear += gears_per_second / 10;
  gear.innerHTML = Math.round(parsedGear);
  gears_per_clickText.innerHTML = Math.round(gears_per_click);
  gears_per_secondText.innerHTML = Math.round(gears_per_second);
  bgm.play();

  updateTitle(); // Update the title regularly
}, 100);

function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.innerText = message;
  notification.style.display = "block";

  setTimeout(() => {
    notification.style.display = "none";
  }, 2000); // Hide notification after 2 seconds
}

// Auto-save interval set to 3 minutes (180000 milliseconds)
setInterval(() => {
  save();
  showNotification("Game auto-saved");
}, 180000); // 3 minutes in milliseconds

// Game Saving Logic
function save() {
  localStorage.clear();
  upgrades.map((upgrade) => {
    const obj = JSON.stringify({
      parsedLevel: parseFloat(upgrade.level.innerHTML),
      parsedCost: upgrade.parsedCost,
      parsedIncrease: upgrade.parsedIncrease,
    });
    localStorage.setItem(upgrade.name, obj);
  });
  localStorage.setItem("gears_per_click", JSON.stringify(gears_per_click));
  localStorage.setItem("gears_per_second", JSON.stringify(gears_per_second));
  localStorage.setItem("gear", JSON.stringify(parsedGear));

  // Show notification when game is manually saved
  showNotification("Game saved successfully");
}

// Game Loading Logic
function load() {
  upgrades.map((upgrade) => {
    const savedValues = JSON.parse(localStorage.getItem(upgrade.name));
    upgrade.parsedCost = savedValues.parsedCost;
    upgrade.parsedIncrease = savedValues.parsedIncrease;
    upgrade.level.innerHTML = savedValues.parsedLevel;
    upgrade.cost.innerHTML = Math.round(upgrade.parsedCost);
    upgrade.increase.innerHTML = upgrade.parsedIncrease;
  });
  gears_per_click = JSON.parse(localStorage.getItem("gears_per_click"));
  gears_per_second = JSON.parse(localStorage.getItem("gears_per_second"));
  parsedGear = JSON.parse(localStorage.getItem("gear"));
  gear.innerHTML = Math.round(parsedGear);

  // Show notification when game is successfully loaded
  showNotification("Game loaded successfully");
}

window.incrementGear = incrementGear;
window.buyUpgrade = buyUpgrade;
window.save = save;
window.load = load;
