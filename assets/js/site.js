const PORTFOLIO_MODE_KEY = "sc-portfolio-mode";
const VALID_MODES = new Set(["professional", "motorsport"]);
const BACKGROUND_CANDIDATES = {
  professional: [
    "assets/img/background/CHPMicrogrid_background",
    "assets/img/background/CHPMicroGrid_background",
    "assets/img/background/CHPmicrogrid_background",
    "assets/img/background/CHP_Microgrid_background",
    "assets/img/professional/background",
  ],
  motorsport: [
    "assets/img/background/Motorsport_bacground",
    "assets/img/background/Motorsport_background",
    "assets/img/background/motorsport_background",
    "assets/img/motorsport/background",
  ],
};
const IMAGE_EXTENSIONS = ["jpg", "png", "jpeg"];

function normalizeMode(mode) {
  return VALID_MODES.has(mode) ? mode : "professional";
}

function setCustomBackground(mode) {
  const body = document.body;
  const bases = BACKGROUND_CANDIDATES[normalizeMode(mode)] || [];
  const candidates = bases.flatMap((base) => IMAGE_EXTENSIONS.map((ext) => `${base}.${ext}`));
  let index = 0;

  function tryNext() {
    if (index >= candidates.length) {
      body.style.removeProperty("--page-bg-image");
      return;
    }

    const src = candidates[index++];
    const probe = new Image();
    probe.onload = () => body.style.setProperty("--page-bg-image", `url('${src}?v=3')`);
    probe.onerror = tryNext;
    probe.src = `${src}?v=3`;
  }

  tryNext();
}

function ensureHomeNavLink() {
  const nav = document.querySelector(".nav");
  if (!nav || nav.querySelector('a[href="index.html"]')) return;

  const home = document.createElement("a");
  home.href = "index.html";
  home.textContent = "Home";
  nav.prepend(home);
}

function cleanHeaderIdentity() {
  document.querySelectorAll(".avatar-shell").forEach((avatar) => avatar.remove());
  document.querySelectorAll(".brand").forEach((brand) => {
    brand.classList.add("brand-text-only");
    const name = brand.querySelector(".brand-name");
    brand.textContent = name ? name.textContent : "Shaojie Chen";
  });
}

function relabelModeControls() {
  document.querySelectorAll('[data-mode-target="professional"]').forEach((button) => {
    button.textContent = "CHP/MicroGrid";
  });
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
    node.textContent = nextMode === "professional" ? "CHP / MicroGrid Engineer" : "Motorsport Engineer";
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
  cleanHeaderIdentity();
  ensureHomeNavLink();
  relabelModeControls();

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
