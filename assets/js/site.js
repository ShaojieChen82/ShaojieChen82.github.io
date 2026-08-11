const PORTFOLIO_MODE_KEY = "sc-portfolio-mode";
const VALID_MODES = new Set(["professional", "motorsport"]);
const MODE_PARAM = "mode";

let motorsportClickedThisPage = false;

const BACKGROUND_IMAGES = {
  professional: "assets/img/background/CHPMicrogrid_background.png",
  motorsport: "assets/img/background/Motorsport_background.png",
  contact: "assets/img/background/contact_background.png",
};

const PROFESSIONAL_MEDIA = [
  "assets/img/professional/1708355898376.jpg",
  "assets/img/professional/E200.jpg",
  "assets/img/professional/OP4S Engine.png",
  "assets/img/professional/Websupervisor.png",
  "assets/img/professional/load emulator thermal side.JPG",
  "assets/img/professional/motorized load bank with custom made PCB.JPG",
  "assets/img/professional/testing inverter.JPG",
];

const MOTORSPORT_MEDIA = [
  "assets/img/motorsport/galleries/3d printed wing and bracket prototype 1.JPG",
  "assets/img/motorsport/galleries/3d printed wing and bracket prototype 2.JPG",
  "assets/img/motorsport/galleries/3d printing failed 2.JPG",
  "assets/img/motorsport/galleries/3d printing failed 3.JPG",
  "assets/img/motorsport/galleries/3d printing failed 4.JPG",
  "assets/img/motorsport/galleries/3d printing wing core 1.JPG",
  "assets/img/motorsport/galleries/3d printing wing core 2.JPG",
  "assets/img/motorsport/galleries/3d printing wing core 3.JPG",
  "assets/img/motorsport/galleries/3d printing wing core 4.JPG",
  "assets/img/motorsport/galleries/3d priting failed 1.JPG",
  "assets/img/motorsport/galleries/C7 before track 1.jpg",
  "assets/img/motorsport/galleries/C7 before track 2.jpg",
  "assets/img/motorsport/galleries/active-aero-install.JPG",
  "assets/img/motorsport/galleries/aluminum bracket in wing.JPG",
  "assets/img/motorsport/galleries/brass insert at the wing end.JPG",
  "assets/img/motorsport/galleries/c7-track 1.jpg",
  "assets/img/motorsport/galleries/Camaro-track 1.jpg",
  "assets/img/motorsport/galleries/c7-track 2.jpg",
  "assets/img/motorsport/galleries/c7-track 3.jpg",
  "assets/img/motorsport/galleries/cabon fiber fab 4.JPG",
  "assets/img/motorsport/galleries/Camaro-track 2.jpg",
  "assets/img/motorsport/galleries/car in snow with wing 1.JPG",
  "assets/img/motorsport/galleries/car in snow with wing 2.JPG",
  "assets/img/motorsport/galleries/carbon cloth wrapping the 3d printing core prep 1.JPG",
  "assets/img/motorsport/galleries/carbon cloth wrapping the 3d printing core prep 2.JPG",
  "assets/img/motorsport/galleries/carbon cloth wrapping the 3d printing core prep 3.JPG",
  "assets/img/motorsport/galleries/carbon fiber fab 1.JPG",
  "assets/img/motorsport/galleries/carbon fiber fab 2.JPG",
  "assets/img/motorsport/galleries/carbon fiber fab 3.JPG",
  "assets/img/motorsport/galleries/carbon fiber fab post processing 1.JPG",
  "assets/img/motorsport/galleries/carbon fiber plastic bagging unwrap 1.JPG",
  "assets/img/motorsport/galleries/carbon fiber plastic bagging unwrap 2.JPG",
  "assets/img/motorsport/galleries/carbon fiber plastic bagging unwrap 3.JPG",
  "assets/img/motorsport/galleries/carbon wrapping the plastic core.JPG",
  "assets/img/motorsport/galleries/clear coating the wing 1.JPG",
  "assets/img/motorsport/galleries/clear coating the wing 2.JPG",
  "assets/img/motorsport/galleries/DSC_1292.jpg",
  "assets/img/motorsport/galleries/finish cutting the front splitter.JPG",
  "assets/img/motorsport/galleries/fitting the 3d printed plastic wing bracket + aluminum post + wing on car 2.JPG",
  "assets/img/motorsport/galleries/fitting the 3d printed plastic wing bracket + wing on car 1.JPG",
  "assets/img/motorsport/galleries/fitting the 3d printed plastic wing bracket + wing on car 2.JPG",
  "assets/img/motorsport/galleries/fitting the 3d printed plastic wing bracket + wing on car 3.JPG",
  "assets/img/motorsport/galleries/fitting the 3d printed plastic wing bracket + wing on car 4.JPG",
  "assets/img/motorsport/galleries/fitting the 3d printed plastic wing bracket on car 1.JPG",
  "assets/img/motorsport/galleries/fitting the 3d printed plastic wing bracket on car 2.JPG",
  "assets/img/motorsport/galleries/fitting the 3d printed plastic wing bracket on car 3.JPG",
  "assets/img/motorsport/galleries/fitting the 3d printed plastic wing bracket on car 4.JPG",
  "assets/img/motorsport/galleries/fitting the real aluminum bracket and wing 1.JPG",
  "assets/img/motorsport/galleries/fitting the real aluminum bracket and wing 2.JPG",
  "assets/img/motorsport/galleries/fixing C7 track side at night 1.jpg",
  "assets/img/motorsport/galleries/IMG_9811.HEIC",
  "assets/img/motorsport/galleries/IMG_9812.HEIC",
  "assets/img/motorsport/galleries/fixing C7 track side at night 2.jpg",
  "assets/img/motorsport/galleries/installing the front splitter 1.JPG",
  "assets/img/motorsport/galleries/installing the front splitter 2.JPG",
  "assets/img/motorsport/galleries/installing the front splitter 3.JPG",
  "assets/img/motorsport/galleries/installing the front splitter 4.JPG",
  "assets/img/motorsport/galleries/installing the front splitter 5.JPG",
  "assets/img/motorsport/galleries/installing the front splitter 6.JPG",
  "assets/img/motorsport/galleries/mating the 3d printed wing core 1.JPG",
  "assets/img/motorsport/galleries/mating the 3d printed wing core 2.JPG",
  "assets/img/motorsport/galleries/mating the 3d printed wing.JPG",
  "assets/img/motorsport/galleries/mating the 3d printing core prep 1.JPG",
  "assets/img/motorsport/galleries/mating the 3d printing core prep 2.JPG",
  "assets/img/motorsport/galleries/me and my friends after track day events (Track side).jpg",
  "assets/img/motorsport/galleries/me standing on my active wing (showing wing strength).jpg",
  "assets/img/motorsport/galleries/meeting with c8 zr1.JPG",
  "assets/img/motorsport/galleries/painting the wood splitter.JPG",
  "assets/img/motorsport/galleries/PCB 2d screenshot.png",
  "assets/img/motorsport/galleries/PCB 3d screenshot back.png",
  "assets/img/motorsport/galleries/PCB 3d screenshot.png",
  "assets/img/motorsport/galleries/prototype demo in car meet 2.JPG",
  "assets/img/motorsport/galleries/prototype demo in car meet 3.JPG",
  "assets/img/motorsport/galleries/prototype demo in car meet 4.JPG",
  "assets/img/motorsport/galleries/prototype demo in car meet 5.JPG",
  "assets/img/motorsport/galleries/prototype demo in car meet.JPG",
  "assets/img/motorsport/galleries/prototype of active wing carbon fiber wing + aluminum post + plastic braket.JPG",
  "assets/img/motorsport/galleries/replace front brake on a C7.jpg",
  "assets/img/motorsport/galleries/showing the front splitter ramp High df vs low drag.JPG",
  "assets/img/motorsport/galleries/sitting at driver seat on track.jpg",
  "assets/img/motorsport/galleries/testing ios app.PNG",
  "assets/img/motorsport/galleries/testing the ios app with real camera feed 2.JPG",
  "assets/img/motorsport/galleries/testing the ios app with real camera feed.JPG",
  "assets/img/motorsport/galleries/vaccum bag carbonfiber wing.JPG",
  "assets/img/motorsport/galleries/testing the actuation of wing on car  manually.MOV",
  "assets/img/motorsport/galleries/testing the actuation of wing on car via phone 1.MOV",
  "assets/img/motorsport/galleries/Testing wing control with IR remote.MP4",
  "assets/img/motorsport/galleries/testing the actuation of wing on car via phone 2.MOV",
];

const MEDIA_GROUPS = {
  professionalAll: PROFESSIONAL_MEDIA,
  professionalPower: [
    "assets/img/professional/testing inverter.JPG",
    "assets/img/professional/motorized load bank with custom made PCB.JPG",
  ],
  professionalControls: [
    "assets/img/professional/load emulator thermal side.JPG",
    "assets/img/professional/motorized load bank with custom made PCB.JPG",
  ],
  professionalFleet: [
    "assets/img/professional/Websupervisor.png",
    "assets/img/professional/E200.jpg",
  ],
  professionalCHP: [
    "assets/img/professional/OP4S Engine.png",
    "assets/img/professional/1708355898376.jpg",
  ],
  c7Aero: [
    "assets/img/motorsport/galleries/active-aero-install.JPG",
    "assets/img/motorsport/galleries/prototype of active wing carbon fiber wing + aluminum post + plastic braket.JPG",
    "assets/img/motorsport/galleries/fitting the real aluminum bracket and wing 1.JPG",
    "assets/img/motorsport/galleries/vaccum bag carbonfiber wing.JPG",
    "assets/img/motorsport/galleries/showing the front splitter ramp High df vs low drag.JPG",
    "assets/img/motorsport/galleries/me standing on my active wing (showing wing strength).jpg",
    "assets/img/motorsport/galleries/testing the actuation of wing on car via phone 2.MOV",
  ],
  canControls: [
    "assets/img/motorsport/galleries/PCB 2d screenshot.png",
    "assets/img/motorsport/galleries/PCB 3d screenshot.png",
    "assets/img/motorsport/galleries/PCB 3d screenshot back.png",
    "assets/img/motorsport/galleries/testing ios app.PNG",
    "assets/img/motorsport/galleries/testing the actuation of wing on car via phone 1.MOV",
    "assets/img/motorsport/galleries/Testing wing control with IR remote.MP4",
  ],
  trackData: [
    "assets/img/motorsport/galleries/C7 before track 1.jpg",
    "assets/img/motorsport/galleries/c7-track 1.jpg",
    "assets/img/motorsport/galleries/c7-track 2.jpg",
    "assets/img/motorsport/galleries/c7-track 3.jpg",
    "assets/img/motorsport/galleries/sitting at driver seat on track.jpg",
    "assets/img/motorsport/galleries/fixing C7 track side at night 1.jpg",
    "assets/img/motorsport/galleries/fixing C7 track side at night 2.jpg",
    "assets/img/motorsport/galleries/me and my friends after track day events (Track side).jpg",
  ],
  sensors: [
    "assets/img/motorsport/galleries/testing the ios app with real camera feed.JPG",
    "assets/img/motorsport/galleries/testing the ios app with real camera feed 2.JPG",
    "assets/img/motorsport/galleries/testing ios app.PNG",
  ],
  motorsportAll: MOTORSPORT_MEDIA,
};

function normalizeMode(mode) {
  if (mode === "chp") return "professional";
  return VALID_MODES.has(mode) ? mode : "professional";
}

function modeFromUrl() {
  const value = new URLSearchParams(window.location.search).get(MODE_PARAM);
  if (value === "motorsport") return "motorsport";
  if (value === "chp" || value === "professional") return "professional";
  return null;
}

function modeToParam(mode) {
  return normalizeMode(mode) === "motorsport" ? "motorsport" : "chp";
}

function ensureGlobalStylesheets() {
  if (!document.querySelector('link[href^="assets/css/site-fixes.css"]')) {
    const fixes = document.createElement("link");
    fixes.rel = "stylesheet";
    fixes.href = "assets/css/site-fixes.css?v=15";
    document.head.appendChild(fixes);
  }
  if (!document.querySelector('link[href^="assets/css/portfolio-refresh.css"]')) {
    const refresh = document.createElement("link");
    refresh.rel = "stylesheet";
    refresh.href = "assets/css/portfolio-refresh.css?v=1";
    document.head.appendChild(refresh);
  }
}

function ensureBackgroundLayer() {
  let layer = document.querySelector(".page-background-layer");
  if (layer) return layer;
  layer = document.createElement("div");
  layer.className = "page-background-layer";
  layer.setAttribute("aria-hidden", "true");
  document.body.prepend(layer);
  return layer;
}

function clearBackgroundLayer() {
  const layer = document.querySelector(".page-background-layer");
  if (layer) layer.remove();
  document.body.style.removeProperty("--page-bg-image");
  document.body.style.removeProperty("--page-bg-position");
}

function setCustomBackground(mode) {
  const page = document.body.dataset.page;
  if (page !== "home" && page !== "contact") {
    clearBackgroundLayer();
    return;
  }

  const nextMode = normalizeMode(mode);
  const layer = ensureBackgroundLayer();
  const imagePath = page === "contact" ? BACKGROUND_IMAGES.contact : BACKGROUND_IMAGES[nextMode];
  const position = page === "contact" ? "center right" : nextMode === "professional" ? "center right" : "center left";
  layer.style.backgroundImage = `url('${imagePath}?v=15')`;
  layer.style.backgroundPosition = position;
  document.body.style.setProperty("--page-bg-image", `url('${imagePath}?v=15')`);
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

function updateMotorsportGlow(mode) {
  const shouldGlow = document.body.dataset.page === "home" && normalizeMode(mode) === "professional" && !motorsportClickedThisPage;
  document.body.classList.toggle("motorsport-unvisited", shouldGlow);
}

function syncInternalLinks(mode) {
  const param = modeToParam(mode);
  document.querySelectorAll('a[href]').forEach((link) => {
    const raw = link.getAttribute("href");
    if (!raw || raw.startsWith("#") || raw.startsWith("mailto:") || raw.startsWith("tel:") || raw.startsWith("javascript:")) return;
    try {
      const url = new URL(raw, window.location.href);
      if (url.origin !== window.location.origin) return;
      const filename = url.pathname.split("/").pop() || "";
      if (!filename.endsWith(".html")) return;
      url.searchParams.set(MODE_PARAM, param);
      link.setAttribute("href", `${filename}?${url.searchParams.toString()}${url.hash}`);
    } catch (_) {
      // Leave non-standard links untouched.
    }
  });
}

function updateCurrentModeUrl(mode) {
  const url = new URL(window.location.href);
  url.searchParams.set(MODE_PARAM, modeToParam(mode));
  window.history.replaceState({}, "", `${url.pathname}?${url.searchParams.toString()}${url.hash}`);
}

function applyMode(mode, options = {}) {
  const requestedMode = normalizeMode(mode);
  const page = document.body.dataset.page;
  const visualMode = page === "contact" ? "professional" : requestedMode;

  if (requestedMode === "motorsport") motorsportClickedThisPage = true;

  document.body.classList.remove("mode-professional", "mode-motorsport");
  document.body.classList.add(`mode-${visualMode}`);
  document.body.dataset.mode = visualMode;
  document.body.dataset.requestedMode = requestedMode;

  document.querySelectorAll("[data-mode-target]").forEach((button) => {
    const isActive = button.dataset.modeTarget === requestedMode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  document.querySelectorAll("[data-role-label]").forEach((node) => {
    node.textContent = requestedMode === "professional" ? "CHP/MICROGRID SENIOR PROJECT ENGINEER" : "Motorsport Engineer";
  });

  setCustomBackground(visualMode);
  updateMotorsportGlow(requestedMode);
  localStorage.setItem(PORTFOLIO_MODE_KEY, requestedMode);
  syncInternalLinks(requestedMode);
  if (options.updateUrl) updateCurrentModeUrl(requestedMode);
}

function fileExtension(path) {
  return path.split(".").pop().toLowerCase();
}

function isImage(path) {
  return ["jpg", "jpeg", "png", "webp"].includes(fileExtension(path));
}

function isVideo(path) {
  return ["mp4", "mov", "m4v"].includes(fileExtension(path));
}

function prettyCaption(path) {
  let name = decodeURIComponent(path.split("/").pop() || path).replace(/\.[^.]+$/, "");
  name = name
    .replace(/\b3d\b/gi, "3D")
    .replace(/\bios\b/gi, "iOS")
    .replace(/\bpcb\b/gi, "PCB")
    .replace(/\bc7\b/gi, "C7")
    .replace(/\bc8\b/gi, "C8")
    .replace(/\bzr1\b/gi, "ZR1")
    .replace(/\bdf\b/gi, "DF")
    .replace(/priting/gi, "printing")
    .replace(/braket/gi, "bracket")
    .replace(/cabon/gi, "carbon")
    .replace(/vaccum/gi, "vacuum")
    .replace(/carbonfiber/gi, "carbon fiber")
    .replace(/\s+/g, " ")
    .trim();
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function createLightbox() {
  let lightbox = document.querySelector(".lightbox");
  if (lightbox) return lightbox;
  lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = `
    <button class="lightbox-close" type="button" aria-label="Close enlarged image">×</button>
    <button class="lightbox-prev" type="button" aria-label="Previous image">‹</button>
    <img alt="Enlarged project evidence" />
    <button class="lightbox-next" type="button" aria-label="Next image">›</button>
    <p class="lightbox-caption"></p>
  `;
  document.body.appendChild(lightbox);
  return lightbox;
}

function openLightbox(images, startIndex) {
  if (!images.length) return;
  const lightbox = createLightbox();
  const image = lightbox.querySelector("img");
  const caption = lightbox.querySelector(".lightbox-caption");
  let index = Math.max(0, startIndex);

  const render = () => {
    image.src = encodeURI(`${images[index]}?v=1`);
    caption.textContent = `${prettyCaption(images[index])} · ${index + 1}/${images.length}`;
  };

  const close = () => lightbox.classList.remove("is-open");
  lightbox.querySelector(".lightbox-close").onclick = close;
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
  lightbox.onclick = (event) => { if (event.target === lightbox) close(); };
  render();
  lightbox.classList.add("is-open");
}

function renderMediaGallery(container, items) {
  if (!container || !items?.length) return;
  const imageItems = items.filter(isImage);
  const fragment = document.createDocumentFragment();

  items.forEach((path) => {
    const card = document.createElement("figure");
    card.className = "media-card";
    const captionText = prettyCaption(path);

    if (isImage(path)) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "media-card-button";
      button.setAttribute("aria-label", `Enlarge ${captionText}`);
      const img = document.createElement("img");
      img.src = encodeURI(path);
      img.alt = captionText;
      img.loading = "lazy";
      img.decoding = "async";
      const caption = document.createElement("span");
      caption.className = "media-caption";
      caption.textContent = captionText;
      button.append(img, caption);
      button.addEventListener("click", () => openLightbox(imageItems, imageItems.indexOf(path)));
      card.appendChild(button);
    } else if (isVideo(path)) {
      card.classList.add("media-video");
      const video = document.createElement("video");
      video.controls = true;
      video.preload = "metadata";
      video.playsInline = true;
      const source = document.createElement("source");
      source.src = encodeURI(path);
      source.type = fileExtension(path) === "mp4" ? "video/mp4" : "video/quicktime";
      video.appendChild(source);
      const caption = document.createElement("span");
      caption.className = "media-caption";
      caption.textContent = captionText;
      card.append(video, caption);
    } else {
      const link = document.createElement("a");
      link.className = "media-file-card";
      link.href = encodeURI(path);
      link.target = "_blank";
      link.rel = "noopener";
      link.innerHTML = `<div><strong>Source image · ${fileExtension(path).toUpperCase()}</strong><span>${captionText}<br>Open source file; JPG conversion recommended for universal browser preview.</span></div>`;
      card.appendChild(link);
    }

    fragment.appendChild(card);
  });

  container.replaceChildren(fragment);
  const countTarget = container.closest("section, details")?.querySelector("[data-media-count]");
  if (countTarget) countTarget.textContent = `${items.length} uploaded assets`;
}

function initMediaGalleries() {
  document.querySelectorAll("[data-media-group]").forEach((container) => {
    const group = MEDIA_GROUPS[container.dataset.mediaGroup];
    if (group) renderMediaGallery(container, group);
  });
}

function initPortfolio() {
  ensureGlobalStylesheets();
  cleanHeaderIdentity();
  ensureNavigation();
  cleanFooter();
  relabelModeControls();

  const requested = modeFromUrl();
  const saved = normalizeMode(localStorage.getItem(PORTFOLIO_MODE_KEY));
  const initialMode = requested || saved || "professional";
  applyMode(initialMode, { updateUrl: false });

  document.querySelectorAll("[data-mode-target]").forEach((button) => {
    button.addEventListener("click", () => applyMode(button.dataset.modeTarget, { updateUrl: true }));
  });

  initMediaGalleries();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPortfolio);
} else {
  initPortfolio();
}
