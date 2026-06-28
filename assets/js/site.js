const PORTFOLIO_MODE_KEY = "sc-portfolio-mode";
const VALID_MODES = new Set(["professional", "motorsport"]);
const BACKGROUND_PATHS = {
  professional: "assets/img/professional/background",
  motorsport: "assets/img/motorsport/background",
};

function normalizeMode(mode) {
  return VALID_MODES.has(mode) ? mode : "professional";
}

function setCustomBackground(mode) {
  const basePath = BACKGROUND_PATHS[normalizeMode(mode)];
  const body = document.body;
  const jpg = `${basePath}.jpg`;
  const png = `${basePath}.png`;

  const probe = new Image();
  probe.onload = () => body.style.setProperty("--page-bg-image", `url('${jpg}')`);
  probe.onerror = () => {
    const fallbackProbe = new Image();
    fallbackProbe.onload = () => body.style.setProperty("--page-bg-image", `url('${png}')`);
    fallbackProbe.onerror = () => body.style.removeProperty("--page-bg-image");
    fallbackProbe.src = `${png}?v=${Date.now()}`;
  };
  probe.src = `${jpg}?v=${Date.now()}`;
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

  setCustomBackground(nextMode);
  localStorage.setItem(PORTFOLIO_MODE_KEY, nextMode);
}

function alternateImageSource(src) {
  const cleanSrc = src.split("?")[0].split("#")[0];

  if (cleanSrc.endsWith(".jpg")) return src.replace(/\.jpg(?=([?#]|$))/i, ".png");
  if (cleanSrc.endsWith(".jpeg")) return src.replace(/\.jpeg(?=([?#]|$))/i, ".png");
  if (cleanSrc.endsWith(".png")) return src.replace(/\.png(?=([?#]|$))/i, ".jpg");

  return null;
}

function showImagePlaceholder(image) {
  const slot = image.closest(".image-slot, .avatar-shell");
  if (slot) slot.classList.add("is-empty");
  image.remove();
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("img[data-fallback]").forEach((image) => {
    const src = image.getAttribute("src") || "";

    if (src === "assets/img/profile.jpg") {
      image.src = "assets/img/profile.png";
    }

    image.dataset.fallbackAttempted = "false";

    image.addEventListener("error", () => {
      if (image.dataset.fallbackAttempted !== "true") {
        const fallbackSrc = alternateImageSource(image.getAttribute("src") || "");
        image.dataset.fallbackAttempted = "true";

        if (fallbackSrc) {
          image.src = fallbackSrc;
          return;
        }
      }

      showImagePlaceholder(image);
    });
  });

  const savedMode = normalizeMode(localStorage.getItem(PORTFOLIO_MODE_KEY));
  applyMode(savedMode);

  document.querySelectorAll("[data-mode-target]").forEach((button) => {
    button.addEventListener("click", () => applyMode(button.dataset.modeTarget));
  });
});
