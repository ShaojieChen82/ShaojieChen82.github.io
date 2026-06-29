const PORTFOLIO_MODE_KEY = "sc-portfolio-mode";
const MOTORSPORT_VISITED_KEY = "sc-motorsport-visited";
const VALID_MODES = new Set(["professional", "motorsport"]);

const BACKGROUND_IMAGES = {
  professional: "assets/img/background/CHPMicrogrid_background.png",
  motorsport: "assets/img/background/Motorsport_background.png",
};

const IMAGE_EXTENSIONS = ["jpg", "png", "jpeg"];

function normalizeMode(mode) {
  return VALID_MODES.has(mode) ? mode : "professional";
}

function ensureGlobalStylesheet() {
  if (document.querySelector('link[href^="assets/css/site-fixes.css"]')) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "assets/css/site-fixes.css?v=4";
  document.head.appendChild(link);
}

function setCustomBackground(mode) {
  const nextMode = normalizeMode(mode);
  const imagePath = BACKGROUND_IMAGES[nextMode];
  const position = nextMode === "professional" ? "center right" : "center left";

  document.body.style.setProperty("--page-bg-image", `url('${imagePath}?v=8')`);
  document.body.style.setProperty("--page-bg-position", position);
}

function ensureNavigation() {
  document.querySelectorAll(".nav").forEach((nav) => {
    nav.innerHTML = `
      <a href="index.html">Home</a>
      <a href="projects.html">Projects</a>
      <a href="capabilities.html">Capabilities</a>
      <a href="resume.html">Resume</a>
      <a href="faq.html">FAQ</a>
      <a href="contact.html">Contact</a>
    `;
  });
}

function cleanHeaderIdentity() {
  document.querySelectorAll(".avatar-shell").forEach((avatar) => avatar.remove());
  document.querySelectorAll(".brand").forEach((brand) => {
    const name = brand.querySelector(".brand-name");
    brand.classList.add("brand-text-only");
    brand.textContent = name ? name.textContent : "Shaojie Chen";
  });
}

function cleanFooter() {
  document.querySelectorAll(".site-footer").forEach((footer) => {
    footer.innerHTML = `<p>© 2026 Shaojie Chen. Built with GitHub Pages.</p>`;
  });
}

function relabelModeControls() {
  document.querySelectorAll('[data-mode-target="professional"]').forEach((button) => {
    button.textContent = "CHP/MicroGrid";
  });
}

function updateMotorsportGlow() {
  const hasVisited = localStorage.getItem(MOTORSPORT_VISITED_KEY) === "true";
  document.body.classList.toggle("motorsport-unvisited", !hasVisited);
}

function applyMode(mode) {
  const nextMode = normalizeMode(mode);
  const body = document.body;

  if (nextMode === "motorsport") {
    localStorage.setItem(MOTORSPORT_VISITED_KEY, "true");
  }

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
  updateMotorsportGlow();
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

function setupFallbackImages() {
  document.querySelectorAll("img[data-fallback]").forEach((image) => {
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
}

function padImageIndex(index) {
  return String(index).padStart(2, "0");
}

function imageExists(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(src);
    image.onerror = () => resolve(null);
    image.src = `${src}?v=8`;
  });
}

async function findGalleryImages(folder, count) {
  const found = [];
  for (let i = 1; i <= count; i += 1) {
    const base = `${folder}/${padImageIndex(i)}`;
    for (const ext of IMAGE_EXTENSIONS) {
      const match = await imageExists(`${base}.${ext}`);
      if (match) {
        found.push(match);
        break;
      }
    }
  }
  return found;
}

function createLightbox() {
  let lightbox = document.querySelector(".lightbox");
  if (lightbox) return lightbox;

  lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = `
    <button class="lightbox-close" type="button" aria-label="Close enlarged image">×</button>
    <button class="lightbox-prev" type="button" aria-label="Previous image">‹</button>
    <img alt="Enlarged project image" />
    <button class="lightbox-next" type="button" aria-label="Next image">›</button>
    <p class="lightbox-caption"></p>
  `;
  document.body.appendChild(lightbox);
  return lightbox;
}

function openLightbox(images, startIndex, captionText) {
  const lightbox = createLightbox();
  const image = lightbox.querySelector("img");
  const caption = lightbox.querySelector(".lightbox-caption");
  let index = startIndex;

  function render() {
    image.src = `${images[index]}?v=8`;
    caption.textContent = `${captionText} · ${index + 1}/${images.length}`;
  }

  lightbox.querySelector(".lightbox-close").onclick = () => lightbox.classList.remove("is-open");
  lightbox.querySelector(".lightbox-prev").onclick = (event) => {
    event.stopPropagation();
    index = (index - 1 + images.length) % images.length;
    render();
  };
  lightbox.querySelector(".lightbox-next").onclick = (event) => {
    event.stopPropagation();
    index = (index + 1) % images.length;
    render();
  };
  lightbox.onclick = (event) => {
    if (event.target === lightbox) lightbox.classList.remove("is-open");
  };

  render();
  lightbox.classList.add("is-open");
}

async function initSlideshows() {
  const slots = document.querySelectorAll("[data-slideshow-folder]");
  for (const slot of slots) {
    const folder = slot.dataset.slideshowFolder;
    const count = Number(slot.dataset.slideshowCount || "12");
    const captionText = slot.dataset.slideshowCaption || slot.querySelector("figcaption")?.textContent || "Project images";
    const images = await findGalleryImages(folder, count);

    if (!images.length) {
      slot.classList.add("is-empty");
      continue;
    }

    slot.classList.add("has-slideshow");
    slot.innerHTML = `
      <img src="${images[0]}?v=8" alt="${captionText}" />
      <span class="slide-counter">1/${images.length}</span>
      <figcaption>${captionText}</figcaption>
    `;

    const image = slot.querySelector("img");
    const counter = slot.querySelector(".slide-counter");
    let index = 0;

    function renderSlide(nextIndex) {
      index = nextIndex;
      image.src = `${images[index]}?v=8`;
      counter.textContent = `${index + 1}/${images.length}`;
    }

    if (images.length > 1) {
      setInterval(() => renderSlide((index + 1) % images.length), 5000);
    }

    slot.addEventListener("click", () => openLightbox(images, index, captionText));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  ensureGlobalStylesheet();
  cleanHeaderIdentity();
  ensureNavigation();
  cleanFooter();
  relabelModeControls();
  updateMotorsportGlow();
  setupFallbackImages();
  initSlideshows();

  const savedMode = normalizeMode(localStorage.getItem(PORTFOLIO_MODE_KEY));
  applyMode(savedMode);

  document.querySelectorAll("[data-mode-target]").forEach((button) => {
    button.addEventListener("click", () => applyMode(button.dataset.modeTarget));
  });
});
