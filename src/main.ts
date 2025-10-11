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

// Click handler: increment counter and toggle a visual state
button.addEventListener("click", () => {
  count += 1;
  counter.textContent = `Button clicked ${count} time${
    count === 1 ? "" : "s"
  }.`;
  button.classList.toggle("clicked");
  console.debug(`magicButton clicked, count=${count}`);
});

// Compose and attach to document
app.appendChild(button);
app.appendChild(counter);
document.body.appendChild(app);

// Export small API for tests / REPL (optional)
export { button, counter };
