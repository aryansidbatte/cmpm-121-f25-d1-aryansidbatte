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
button.setAttribute("aria-label", "Moai statue — increment the counter");

const counter = document.createElement("p");
counter.id = "clickCounter";
let count = 0;
counter.textContent = "Button clicked 0 times.";

// Growth rate in units per second (starts at 0 per Step 5 requirements)
let growthRate = 0;
// Upgrades configuration and ownership tracking
const UPGRADES = {
  A: { key: "A", cost: 10, rate: 0.1, label: "A (+0.1/s)" },
  B: { key: "B", cost: 100, rate: 2.0, label: "B (+2/s)" },
  C: { key: "C", cost: 1000, rate: 50.0, label: "C (+50/s)" },
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
growthDisplay.textContent = `Growth: ${growthRate}/s`;

// create buttons and owned-count displays for each upgrade
const upgradeAButton = document.createElement("button");
upgradeAButton.type = "button";
upgradeAButton.id = "upgradeAButton";
upgradeAButton.textContent = `Buy A ${UPGRADES.A.label} (${
  upgradesCost.A.toFixed(2)
})`;
upgradeAButton.setAttribute(
  "aria-label",
  `Purchase upgrade A: +${UPGRADES.A.rate}/s for ${UPGRADES.A.cost} units`,
);

const upgradeBButton = document.createElement("button");
upgradeBButton.type = "button";
upgradeBButton.id = "upgradeBButton";
upgradeBButton.textContent = `Buy B ${UPGRADES.B.label} (${
  upgradesCost.B.toFixed(2)
})`;
upgradeBButton.setAttribute(
  "aria-label",
  `Purchase upgrade B: +${UPGRADES.B.rate}/s for ${UPGRADES.B.cost} units`,
);

const upgradeCButton = document.createElement("button");
upgradeCButton.type = "button";
upgradeCButton.id = "upgradeCButton";
upgradeCButton.textContent = `Buy C ${UPGRADES.C.label} (${
  upgradesCost.C.toFixed(2)
})`;
upgradeCButton.setAttribute(
  "aria-label",
  `Purchase upgrade C: +${UPGRADES.C.rate}/s for ${UPGRADES.C.cost} units`,
);

const upgradeACount = document.createElement("span");
upgradeACount.id = "upgradeACount";
upgradeACount.textContent = "Owned: 0";

const upgradeBCount = document.createElement("span");
upgradeBCount.id = "upgradeBCount";
upgradeBCount.textContent = "Owned: 0";

const upgradeCCount = document.createElement("span");
upgradeCCount.id = "upgradeCCount";
upgradeCCount.textContent = "Owned: 0";

// Initially disable buttons until affordable
upgradeAButton.disabled = true;
upgradeBButton.disabled = true;
upgradeCButton.disabled = true;

// Update UI helper
function updateCounterText() {
  const display = Number.isInteger(count) ? String(count) : count.toFixed(2);
  const unit = Math.abs(count - 1) < 0.5 ? "time" : "times";
  counter.textContent = `Button clicked ${display} ${unit}.`;
}

// Update all UI elements that depend on count/growthRate
function updateUI() {
  updateCounterText();
  // recompute growth rate from owned upgrades
  growthRate = upgradesOwned.A * UPGRADES.A.rate +
    upgradesOwned.B * UPGRADES.B.rate +
    upgradesOwned.C * UPGRADES.C.rate;
  growthDisplay.textContent = `Growth: ${growthRate.toFixed(2)}/s`;
  // update owned counts and button disabled states
  upgradeACount.textContent = `Owned: ${upgradesOwned.A}`;
  upgradeBCount.textContent = `Owned: ${upgradesOwned.B}`;
  upgradeCCount.textContent = `Owned: ${upgradesOwned.C}`;
  // update button labels with current cost
  upgradeAButton.textContent = `Buy A ${UPGRADES.A.label} (${
    upgradesCost.A.toFixed(2)
  })`;
  upgradeBButton.textContent = `Buy B ${UPGRADES.B.label} (${
    upgradesCost.B.toFixed(2)
  })`;
  upgradeCButton.textContent = `Buy C ${UPGRADES.C.label} (${
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
