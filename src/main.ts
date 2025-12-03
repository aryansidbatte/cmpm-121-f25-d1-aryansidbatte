import "./style.css";

// Build the page UI using TypeScript (do not edit index.html)
const app = document.createElement("main");
app.className = "app-container";

// Button and counter
const button = document.createElement("button");
button.type = "button";
button.id = "magicButton";
// Use the chosen emoji as the button label; keep an accessible aria-label
button.textContent = "🗿";
button.setAttribute("aria-label", "Moyai — collect moyai");

const counter = document.createElement("p");
counter.id = "clickCounter";
let count = 0;
counter.textContent = "Moyai: 0";

// Growth rate in units per second (starts at 0 per Step 5 requirements)
let growthRate = 0;
// Upgrades configuration and ownership tracking (moyai-themed)
const UPGRADES = {
  A: { key: "A", cost: 10, rate: 0.1, displayName: "Tapper" },
  B: { key: "B", cost: 100, rate: 2.0, displayName: "Carver" },
  C: { key: "C", cost: 1000, rate: 50.0, displayName: "Monument" },
} as const;

const upgradesOwned: Record<string, number> = { A: 0, B: 0, C: 0 };

// dynamic current prices (start at the configured cost)
const upgradesCost: Record<string, number> = {
  A: UPGRADES.A.cost,
  B: UPGRADES.B.cost,
  C: UPGRADES.C.cost,
};

// UI for upgrade purchases and status
const growthDisplay = document.createElement("p");
growthDisplay.id = "growthDisplay";
growthDisplay.textContent = `Production: ${growthRate.toFixed(2)} moyai/s`;

// create buttons and owned-count displays for each upgrade
const upgradeAButton = document.createElement("button");
upgradeAButton.type = "button";
upgradeAButton.id = "upgradeAButton";
upgradeAButton.textContent =
  `Buy ${UPGRADES.A.displayName} (+${UPGRADES.A.rate}/s) (${
    upgradesCost.A.toFixed(2)
  })`;
upgradeAButton.setAttribute(
  "aria-label",
  `Purchase ${UPGRADES.A.displayName}: +${UPGRADES.A.rate} moyai/s for ${UPGRADES.A.cost} moyai`,
);

const upgradeBButton = document.createElement("button");
upgradeBButton.type = "button";
upgradeBButton.id = "upgradeBButton";
upgradeBButton.textContent =
  `Buy ${UPGRADES.B.displayName} (+${UPGRADES.B.rate}/s) (${
    upgradesCost.B.toFixed(2)
  })`;
upgradeBButton.setAttribute(
  "aria-label",
  `Purchase ${UPGRADES.B.displayName}: +${UPGRADES.B.rate} moyai/s for ${UPGRADES.B.cost} moyai`,
);

const upgradeCButton = document.createElement("button");
upgradeCButton.type = "button";
upgradeCButton.id = "upgradeCButton";
upgradeCButton.textContent =
  `Buy ${UPGRADES.C.displayName} (+${UPGRADES.C.rate}/s) (${
    upgradesCost.C.toFixed(2)
  })`;
upgradeCButton.setAttribute(
  "aria-label",
  `Purchase ${UPGRADES.C.displayName}: +${UPGRADES.C.rate} moyai/s for ${UPGRADES.C.cost} moyai`,
);

const upgradeACount = document.createElement("span");
upgradeACount.id = "upgradeACount";
upgradeACount.textContent = `${UPGRADES.A.displayName}: 0`;

const upgradeBCount = document.createElement("span");
upgradeBCount.id = "upgradeBCount";
upgradeBCount.textContent = `${UPGRADES.B.displayName}: 0`;

const upgradeCCount = document.createElement("span");
upgradeCCount.id = "upgradeCCount";
upgradeCCount.textContent = `${UPGRADES.C.displayName}: 0`;

// Initially disable buttons until affordable
upgradeAButton.disabled = true;
upgradeBButton.disabled = true;
upgradeCButton.disabled = true;

// Update UI helper
function updateCounterText() {
  const display = Number.isInteger(count) ? String(count) : count.toFixed(2);
  counter.textContent = `Moyai: ${display}`;
}

// Update all UI elements that depend on count/growthRate
function updateUI() {
  updateCounterText();
  // recompute growth rate from owned upgrades
  growthRate = upgradesOwned.A * UPGRADES.A.rate +
    upgradesOwned.B * UPGRADES.B.rate +
    upgradesOwned.C * UPGRADES.C.rate;
  growthDisplay.textContent = `Production: ${growthRate.toFixed(2)} moyai/s`;
  // update owned counts and button disabled states
  upgradeACount.textContent = `${UPGRADES.A.displayName}: ${upgradesOwned.A}`;
  upgradeBCount.textContent = `${UPGRADES.B.displayName}: ${upgradesOwned.B}`;
  upgradeCCount.textContent = `${UPGRADES.C.displayName}: ${upgradesOwned.C}`;
  // update button labels with current cost
  upgradeAButton.textContent =
    `Buy ${UPGRADES.A.displayName} (+${UPGRADES.A.rate}/s) (${
      upgradesCost.A.toFixed(2)
    })`;
  upgradeBButton.textContent =
    `Buy ${UPGRADES.B.displayName} (+${UPGRADES.B.rate}/s) (${
      upgradesCost.B.toFixed(2)
    })`;
  upgradeCButton.textContent =
    `Buy ${UPGRADES.C.displayName} (+${UPGRADES.C.rate}/s) (${
      upgradesCost.C.toFixed(2)
    })`;
  // enable/disable based on current dynamic price
  upgradeAButton.disabled = count < upgradesCost.A;
  upgradeBButton.disabled = count < upgradesCost.B;
  upgradeCButton.disabled = count < upgradesCost.C;
}

// Increment helper used by clicks and automatic ticks
function incrementCount(by = 1, isAuto = false) {
  count += by;
  updateUI();
  // For manual clicks, show a brief pressed state using the Web Animations API
  if (!isAuto) {
    // a short press animation; using animate avoids setTimeout
    button.animate(
      [
        { transform: "translateY(0)", boxShadow: "0 2px 0 rgba(0,0,0,0.12)" },
        {
          transform: "translateY(-3px)",
          boxShadow: "0 8px 16px rgba(0,0,0,0.12)",
        },
      ],
      { duration: 150, easing: "ease-out" },
    );
  }
  console.debug(`magicButton clicked, count=${count}, auto=${isAuto}`);
}

// Click handler: use the shared increment function
button.addEventListener("click", () => incrementCount(1, false));

// Continuous growth: use requestAnimationFrame to add fractional amounts so the
// counter increases at 1 unit per second regardless of frame rate.
let lastTimestamp = performance.now();
function rafTick(ts: DOMHighResTimeStamp) {
  // delta is in seconds
  const delta = (ts - lastTimestamp) / 1000;
  lastTimestamp = ts;

  // add fractional units based on growthRate so growthRate units are added per second
  // (i.e., delta seconds * growthRate units/second = units to add this frame)
  if (growthRate !== 0) {
    incrementCount(delta * growthRate, true);
  }

  requestAnimationFrame(rafTick);
}

// start the animation loop
requestAnimationFrame(rafTick);

// Compose and attach to document
app.appendChild(button);
app.appendChild(counter);
app.appendChild(growthDisplay);

// Group upgrade A
const upgradeAGroup = document.createElement("p");
upgradeAGroup.appendChild(upgradeAButton);
upgradeAGroup.appendChild(document.createTextNode(" "));
upgradeAGroup.appendChild(upgradeACount);
app.appendChild(upgradeAGroup);

// Group upgrade B
const upgradeBGroup = document.createElement("p");
upgradeBGroup.appendChild(upgradeBButton);
upgradeBGroup.appendChild(document.createTextNode(" "));
upgradeBGroup.appendChild(upgradeBCount);
app.appendChild(upgradeBGroup);

// Group upgrade C
const upgradeCGroup = document.createElement("p");
upgradeCGroup.appendChild(upgradeCButton);
upgradeCGroup.appendChild(document.createTextNode(" "));
upgradeCGroup.appendChild(upgradeCCount);
app.appendChild(upgradeCGroup);

document.body.appendChild(app);

// Purchase handlers for each upgrade
upgradeAButton.addEventListener("click", () => {
  const cost = upgradesCost.A;
  if (count >= cost) {
    count -= cost;
    upgradesOwned.A += 1;
    // increase price by 15%
    upgradesCost.A *= 1.15;
    updateUI();
  }
});

upgradeBButton.addEventListener("click", () => {
  const cost = upgradesCost.B;
  if (count >= cost) {
    count -= cost;
    upgradesOwned.B += 1;
    upgradesCost.B *= 1.15;
    updateUI();
  }
});

upgradeCButton.addEventListener("click", () => {
  const cost = upgradesCost.C;
  if (count >= cost) {
    count -= cost;
    upgradesOwned.C += 1;
    upgradesCost.C *= 1.15;
    updateUI();
  }
});

// Export small API for tests / REPL (optional)
export { button, counter };
