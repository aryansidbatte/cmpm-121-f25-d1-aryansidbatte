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

// UI for upgrade purchases
const growthDisplay = document.createElement("p");
growthDisplay.id = "growthDisplay";
growthDisplay.textContent = `Growth: ${growthRate}/s`;

const upgradeButton = document.createElement("button");
upgradeButton.type = "button";
upgradeButton.id = "upgradeButton";
upgradeButton.textContent = "Buy +1/s (10)";
upgradeButton.setAttribute(
  "aria-label",
  "Purchase: increase growth rate by one per second for cost of 10 units",
);
upgradeButton.disabled = true; // initially disabled until player has 10 units

// Update UI helper
function updateCounterText() {
  const display = Number.isInteger(count) ? String(count) : count.toFixed(2);
  const unit = Math.abs(count - 1) < 0.5 ? "time" : "times";
  counter.textContent = `Button clicked ${display} ${unit}.`;
}

// Update all UI elements that depend on count/growthRate
function updateUI() {
  updateCounterText();
  growthDisplay.textContent = `Growth: ${growthRate}/s`;
  upgradeButton.disabled = count < 10;
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
app.appendChild(upgradeButton);
document.body.appendChild(app);

// Purchase handler: deduct cost and increase growth rate by 1 when affordable
upgradeButton.addEventListener("click", () => {
  const cost = 10;
  if (count >= cost) {
    count -= cost;
    growthRate += 1; // increase growth by 1 unit/sec
    updateUI();
  }
});

// Export small API for tests / REPL (optional)
export { button, counter };
