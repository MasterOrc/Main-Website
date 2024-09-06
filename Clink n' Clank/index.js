let gear = document.querySelector(".gear-cost");
let parsedGear = parseFloat(gear.innerHTML);

let gears_per_clickText = document.getElementById("GearsPerClick-text");
let gears_per_secondText = document.getElementById("GearsPerSecond-text");

let gearImgContainer = document.querySelector(".gear-img-container");

let gears_per_click = 1;

let gears_per_second = 0;

const upgrades = [
  {
    name: "clicker",
    cost: document.querySelector(".clicker-cost"),
    parsedCost: parseFloat(document.querySelector(".clicker-cost").innerHTML),
    increase: document.querySelector(".clicker-increase"),
    parsedIncrease: parseFloat(
      document.querySelector(".clicker-increase").innerHTML
    ),
    level: document.querySelector(".clicker-level"),
    gearMultiplier: 1.025,
    costMultiplier: 1.12,
  },
  {
    name: "robot_1",
    cost: document.querySelector(".robot_1-cost"),
    parsedCost: parseFloat(document.querySelector(".robot_1-cost").innerHTML),
    increase: document.querySelector(".robot_1-increase"),
    parsedIncrease: parseFloat(
      document.querySelector(".robot_1-increase").innerHTML
    ),
    level: document.querySelector(".robot_1-level"),
    gearMultiplier: 1.03,
    costMultiplier: 1.115,
  },
  {
    name: "robot_2",
    cost: document.querySelector(".robot_2-cost"),
    parsedCost: parseFloat(document.querySelector(".robot_2-cost").innerHTML),
    increase: document.querySelector(".robot_2-increase"),
    parsedIncrease: parseFloat(
      document.querySelector(".robot_2-increase").innerHTML
    ),
    level: document.querySelector(".robot_2-level"),
    gearMultiplier: 1.035,
    costMultiplier: 1.11,
  },
  {
    name: "robot_3",
    cost: document.querySelector(".robot_3-cost"),
    parsedCost: parseFloat(document.querySelector(".robot_3-cost").innerHTML),
    increase: document.querySelector(".robot_3-increase"),
    parsedIncrease: parseFloat(
      document.querySelector(".robot_3-increase").innerHTML
    ),
    level: document.querySelector(".robot_3-level"),
    gearMultiplier: 1.04,
    costMultiplier: 1.1,
  },
];

/**
 * Function to update the title with the current gear count.
 */
function updateTitle() {
  document.title = `${Math.round(parsedGear)} Gears - Click n' Clank`;
}

/**
 * Function to increment the gear value by 1 and update the gear display on the UI.
 */
function incrementGear(event) {
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

  if (parsedGear >= mu.parsedCost) {
    gear.innerHTML = Math.round((parsedGear -= mu.parsedCost));

    mu.level.innerHTML++;

    mu.parsedIncrease = parseFloat(
      (mu.parsedIncrease * mu.gearMultiplier).toFixed(2)
    );
    mu.increase.innerHTML = mu.parsedIncrease;

    mu.parsedCost *= mu.costMultiplier;
    mu.cost.innerHTML = Math.round(mu.parsedCost);

    if (mu.name === "clicker") {
      gears_per_click += mu.parsedIncrease;
    } else {
      gears_per_second += mu.parsedIncrease;
    }
  }
}

function save() {
  localStorage.clear()

  upgrades.map((upgrade) => {
    const obj = JSON.stringify({
      parsedLevel: parseFloat(upgrade.level.innerHTML),
      parsedCost: upgrade.parsedCost,
      parsedIncrease: upgrade.parsedIncrease,
    });

    localStorage.setItem(upgrade.name, obj)
  });

  localStorage.setItem("gears_per_click", JSON.stringify(gears_per_click))
  localStorage.setItem("gears_per_second", JSON.stringify(gears_per_second))
  localStorage.setItem("gear", JSON.stringify(parsedGear));
}

function load() {
  upgrades.map((upgrade) => {
    const savedValues = JSON.parse(localStorage.getItem(upgrade.name))

    upgrade.parsedCost = savedValues.parsedCost
    upgrade.parsedIncrease = savedValues.parsedIncrease

    upgrade.level.innerHTML = savedValues.parsedLevel
    upgrade.cost.innerHTML = Math.round(upgrade.parsedCost)
    upgrade.increase.innerHTML = upgrade.parsedIncrease
  })

  gears_per_click = JSON.parse(localStorage.getItem('gears_per_click'))
  gears_per_second = JSON.parse(localStorage.getItem('gears_per_second'))
  parsedGear = JSON.parse(localStorage.getItem('gear'))

  gear.innerHTML = Math.round(parsedGear)
}

setInterval(() => {
  parsedGear += gears_per_second / 10;
  gear.innerHTML = Math.round(parsedGear);
  gears_per_clickText.innerHTML = Math.round(gears_per_click);
  gears_per_secondText.innerHTML = Math.round(gears_per_second);

  updateTitle(); // Update the title regularly
}, 100);
