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

// Update UI helper
function updateCounterText() {
  counter.textContent = `Button clicked ${count} time${
    count === 1 ? "" : "s"
  }.`;
}

// Increment helper used by clicks and automatic ticks
function incrementCount(by = 1, isAuto = false) {
  count += by;
  updateCounterText();
  // For manual clicks, show a brief pressed state
  if (!isAuto) {
    button.classList.add("clicked");
    // remove the pressed visual shortly after
    setTimeout(() => button.classList.remove("clicked"), 150);
  }
  console.debug(`magicButton clicked, count=${count}, auto=${isAuto}`);
}

// Click handler: use the shared increment function
button.addEventListener("click", () => incrementCount(1, false));

// Automatic clicking: increment once every 1000ms
setInterval(() => incrementCount(1, true), 1000);

// Compose and attach to document
app.appendChild(button);
app.appendChild(counter);
document.body.appendChild(app);

// Export small API for tests / REPL (optional)
export { button, counter };
