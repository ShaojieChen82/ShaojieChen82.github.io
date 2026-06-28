const PORTFOLIO_MODE_KEY = "sc-portfolio-mode";
const VALID_MODES = new Set(["professional", "motorsport"]);

function normalizeMode(mode) {
  return VALID_MODES.has(mode) ? mode : "professional";
}

function applyMode(mode) {
  const nextMode = normalizeMode(mode);
  const body = document.body;

  body.classList.remove("mode-professional", "mode-motorsport");
  body.classList.add(`mode-${nextMode}`);
  body.dataset.mode = nextMode;

  document.querySelectorAll("[data-mode-target]").forEach((button) => {
    const isActive = button.dataset.modeTarget === nextMode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  document.querySelectorAll("[data-role-label]").forEach((node) => {
    node.textContent = nextMode === "professional" ? "Microgrid / CHP Engineer" : "Motorsport Engineer";
  });

  localStorage.setItem(PORTFOLIO_MODE_KEY, nextMode);
}

document.addEventListener("DOMContentLoaded", () => {
  const savedMode = normalizeMode(localStorage.getItem(PORTFOLIO_MODE_KEY));
  applyMode(savedMode);

  document.querySelectorAll("[data-mode-target]").forEach((button) => {
    button.addEventListener("click", () => applyMode(button.dataset.modeTarget));
  });

  document.querySelectorAll("img[data-fallback]").forEach((image) => {
    image.addEventListener("error", () => {
      const slot = image.closest(".image-slot, .avatar-shell");
      if (slot) slot.classList.add("is-empty");
      image.remove();
    });
  });
});
