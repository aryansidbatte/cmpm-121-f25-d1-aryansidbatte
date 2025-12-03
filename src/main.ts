import "./style.css";

// UI ELEMENTS

// Build the page UI using TypeScript (do not edit index.html)
const app = document.createElement("main");
app.className = "app-container";

// Main button (moyai)
const button = document.createElement("button");
button.type = "button";
button.id = "magicButton";
button.textContent = "🗿";
button.setAttribute("aria-label", "Moyai — collect moyai");

const counter = document.createElement("p");
counter.id = "clickCounter";
let count = 0;
counter.textContent = "Moyai: 0";

// Growth rate in units per second
let growthRate = 0;

// GAME DATA
interface Item {
  id: string;
  name: string;
  baseCost: number;
  rate: number;
  description?: string;
}

const availableItems: Item[] = [
  {
    id: "A",
    name: "Tapper",
    baseCost: 10,
    rate: 0.1,
    description: "A small tapper that gently produces 0.1 moyai per second.",
  },
  {
    id: "B",
    name: "Carver",
    baseCost: 100,
    rate: 2,
    description: "A dedicated carver who chips away at the stone (+2/s).",
  },
  {
    id: "C",
    name: "Monument",
    baseCost: 1000,
    rate: 50,
    description: "A grand monument that radiates moyai productivity (+50/s).",
  },
  {
    id: "D",
    name: "Shrine",
    baseCost: 5000,
    rate: 300,
    description:
      "A small shrine where offerings multiply moyai output (+300/s).",
  },
  {
    id: "E",
    name: "Cultivator",
    baseCost: 25000,
    rate: 2000,
    description:
      "A group of devoted cultivators accelerating moyai production (+2000/s).",
  },
];

// STATE MANAGEMENT
// state maps keyed by item id
const owned: Record<string, number> = {};
const currentCost: Record<string, number> = {};
const buttonMap: Record<string, HTMLButtonElement> = {} as Record<
  string,
  HTMLButtonElement
>;
const countMap: Record<string, HTMLSpanElement> = {} as Record<
  string,
  HTMLSpanElement
>;

// DISPLAY ELEMENTS
// production display
const growthDisplay = document.createElement("p");
growthDisplay.id = "growthDisplay";
growthDisplay.textContent = `Production: ${growthRate.toFixed(2)} moyai/s`;

// create UI for each available item
for (const item of availableItems) {
  owned[item.id] = 0;
  currentCost[item.id] = item.baseCost;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.id = `upgrade-${item.id}`;
  btn.textContent = `Buy ${item.name} (+${item.rate}/s) (${
    currentCost[item.id].toFixed(2)
  })`;
  btn.setAttribute(
    "aria-label",
    `Purchase ${item.name}: +${item.rate} moyai/s for ${item.baseCost} moyai`,
  );

  const span = document.createElement("span");
  span.id = `upgrade${item.id}Count`;
  span.textContent = `${item.name}: 0`;

  // description element (optional)
  const desc = document.createElement("div");
  desc.className = "item-description";
  desc.textContent = item.description || "";

  // group and append
  const group = document.createElement("p");
  group.appendChild(btn);
  group.appendChild(document.createTextNode(" "));
  group.appendChild(span);
  group.appendChild(document.createTextNode(" "));
  group.appendChild(desc);
  app.appendChild(group);

  // initial disabled state
  btn.disabled = true;

  // store references
  buttonMap[item.id] = btn;
  countMap[item.id] = span;

  // purchase handler
  btn.addEventListener("click", () => {
    const cost = currentCost[item.id];
    if (count >= cost) {
      count -= cost;
      owned[item.id] += 1;
      // increase price by 15%
      currentCost[item.id] *= 1.15;
      updateUI();
    }
  });
}

// HELPER FUNCTIONS
// Update UI helper
function updateCounterText() {
  const display = Number.isInteger(count) ? String(count) : count.toFixed(2);
  counter.textContent = `Moyai: ${display}`;
}

// Update all UI elements that depend on count/growthRate
function updateUI() {
  updateCounterText();
  // recompute growth rate from owned upgrades
  growthRate = availableItems.reduce(
    (sum, item) => sum + owned[item.id] * item.rate,
    0,
  );
  growthDisplay.textContent = `Production: ${growthRate.toFixed(2)} moyai/s`;

  // update per-item UI
  for (const item of availableItems) {
    countMap[item.id].textContent = `${item.name}: ${owned[item.id]}`;
    buttonMap[item.id].textContent = `Buy ${item.name} (+${item.rate}/s) (${
      currentCost[item.id].toFixed(2)
    })`;
    buttonMap[item.id].disabled = count < currentCost[item.id];
  }
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
}

// EVENT LISTENERS
// Click handler: use the shared increment function
button.addEventListener("click", () => incrementCount(1, false));

// Continuous growth: use requestAnimationFrame to add fractional amounts so the
// counter increases at growthRate units per second regardless of frame rate.
let lastTimestamp = performance.now();
function rafTick(ts: DOMHighResTimeStamp) {
  // delta is in seconds
  const delta = (ts - lastTimestamp) / 1000;
  lastTimestamp = ts;

  // add fractional units based on growthRate so growthRate units are added per frame
  if (growthRate !== 0) {
    incrementCount(delta * growthRate, true);
  }

  requestAnimationFrame(rafTick);
}

// start the animation loop
requestAnimationFrame(rafTick);

// COMPOSITION
// Compose and attach to document
app.appendChild(button);
app.appendChild(counter);
// place production display at the bottom of the app
app.appendChild(growthDisplay);

// attach app to body
document.body.appendChild(app);

// Export small API for tests / REPL (optional)
export { button, counter };
