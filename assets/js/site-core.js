const PORTFOLIO_MODE_KEY = "sc-portfolio-mode";
const VALID_MODES = new Set(["professional", "motorsport"]);
const MODE_PARAM = "mode";

let motorsportClickedThisPage = false;

const BACKGROUND_IMAGES = {
  professional: "assets/img/background/CHPMicrogrid_background.webp",
  motorsport: "assets/img/background/Motorsport_background.webp",
  contact: "assets/img/background/CHPMicrogrid_background.webp",
};

const PROFESSIONAL_MEDIA = [
  "assets/img/professional/E8kW_WhiteUnit.webp",
  "assets/img/professional/EPS_mCHP_poster.webp",
  "assets/img/professional/E200.webp",
  "assets/img/professional/E200Diagram.webp",
  "assets/img/professional/OP4S Engine.webp",
  "assets/img/professional/Websupervisor.webp",
  "assets/img/professional/load emulator thermal side.webp",
  "assets/img/professional/motorized load bank with custom made PCB.webp",
  "assets/img/professional/testing inverter.webp",
];

const AERO_MEDIA = [
  "assets/img/motorsport/galleries/3d printed wing and bracket prototype 1.webp",
  "assets/img/motorsport/galleries/3d printed wing and bracket prototype 2.webp",
  "assets/img/motorsport/galleries/3d printing failed 2.webp",
  "assets/img/motorsport/galleries/3d printing failed 3.webp",
  "assets/img/motorsport/galleries/3d printing failed 4.webp",
  "assets/img/motorsport/galleries/3d printing wing core 1.webp",
  "assets/img/motorsport/galleries/3d printing wing core 2.webp",
  "assets/img/motorsport/galleries/3d printing wing core 3.webp",
  "assets/img/motorsport/galleries/3d printing wing core 4.webp",
  "assets/img/motorsport/galleries/3d priting failed 1.webp",
  "assets/img/motorsport/galleries/active-aero-install.webp",
  "assets/img/motorsport/galleries/aluminum bracket in wing.webp",
  "assets/img/motorsport/galleries/brass insert at the wing end.webp",
  "assets/img/motorsport/galleries/cabon fiber fab 4.webp",
  "assets/img/motorsport/galleries/car in snow with wing 1.webp",
  "assets/img/motorsport/galleries/car in snow with wing 2.webp",
  "assets/img/motorsport/galleries/carbon cloth wrapping the 3d printing core prep 1.webp",
  "assets/img/motorsport/galleries/carbon cloth wrapping the 3d printing core prep 2.webp",
  "assets/img/motorsport/galleries/carbon cloth wrapping the 3d printing core prep 3.webp",
  "assets/img/motorsport/galleries/carbon fiber fab 1.webp",
  "assets/img/motorsport/galleries/carbon fiber fab 2.webp",
  "assets/img/motorsport/galleries/carbon fiber fab 3.webp",
  "assets/img/motorsport/galleries/carbon fiber fab post processing 1.webp",
  "assets/img/motorsport/galleries/carbon fiber plastic bagging unwrap 1.webp",
  "assets/img/motorsport/galleries/carbon fiber plastic bagging unwrap 2.webp",
  "assets/img/motorsport/galleries/carbon fiber plastic bagging unwrap 3.webp",
  "assets/img/motorsport/galleries/carbon wrapping the plastic core.webp",
  "assets/img/motorsport/galleries/clear coating the wing 1.webp",
  "assets/img/motorsport/galleries/clear coating the wing 2.webp",
  "assets/img/motorsport/galleries/DSC_1292.webp",
  "assets/img/motorsport/galleries/finish cutting the front splitter.webp",
  "assets/img/motorsport/galleries/fitting the 3d printed plastic wing bracket + aluminum post + wing on car 2.webp",
  "assets/img/motorsport/galleries/fitting the 3d printed plastic wing bracket + wing on car 1.webp",
  "assets/img/motorsport/galleries/fitting the 3d printed plastic wing bracket + wing on car 2.webp",
  "assets/img/motorsport/galleries/fitting the 3d printed plastic wing bracket + wing on car 3.webp",
  "assets/img/motorsport/galleries/fitting the 3d printed plastic wing bracket + wing on car 4.webp",
  "assets/img/motorsport/galleries/fitting the 3d printed plastic wing bracket on car 1.webp",
  "assets/img/motorsport/galleries/fitting the 3d printed plastic wing bracket on car 2.webp",
  "assets/img/motorsport/galleries/fitting the 3d printed plastic wing bracket on car 3.webp",
  "assets/img/motorsport/galleries/fitting the 3d printed plastic wing bracket on car 4.webp",
  "assets/img/motorsport/galleries/fitting the real aluminum bracket and wing 1.webp",
  "assets/img/motorsport/galleries/fitting the real aluminum bracket and wing 2.webp",
  "assets/img/motorsport/galleries/installing the front splitter 1.webp",
  "assets/img/motorsport/galleries/installing the front splitter 2.webp",
  "assets/img/motorsport/galleries/installing the front splitter 3.webp",
  "assets/img/motorsport/galleries/installing the front splitter 4.webp",
  "assets/img/motorsport/galleries/installing the front splitter 5.webp",
  "assets/img/motorsport/galleries/installing the front splitter 6.webp",
  "assets/img/motorsport/galleries/mating the 3d printed wing core 1.webp",
  "assets/img/motorsport/galleries/mating the 3d printed wing core 2.webp",
  "assets/img/motorsport/galleries/mating the 3d printed wing.webp",
  "assets/img/motorsport/galleries/mating the 3d printing core prep 1.webp",
  "assets/img/motorsport/galleries/mating the 3d printing core prep 2.webp",
  "assets/img/motorsport/galleries/me standing on my active wing (showing wing strength).webp",
  "assets/img/motorsport/galleries/Me Standing on the Front Splitter 1.webp",
  "assets/img/motorsport/galleries/Me Standing on the Front Splitter 2.webp",
  "assets/img/motorsport/galleries/painting the wood splitter.webp",
  "assets/img/motorsport/galleries/prototype demo in car meet 2.webp",
  "assets/img/motorsport/galleries/prototype demo in car meet 3.webp",
  "assets/img/motorsport/galleries/prototype demo in car meet 4.webp",
  "assets/img/motorsport/galleries/prototype demo in car meet 5.webp",
  "assets/img/motorsport/galleries/prototype demo in car meet.webp",
  "assets/img/motorsport/galleries/prototype of active wing carbon fiber wing + aluminum post + plastic braket.webp",
  "assets/img/motorsport/galleries/showing the front splitter ramp High df vs low drag.webp",
  "assets/img/motorsport/galleries/vaccum bag carbonfiber wing.webp",
  "assets/img/motorsport/galleries/testing front ramp while front bumper disassembled.web.mp4",
  "assets/img/motorsport/galleries/testing front ramp while front bumper disassembled (underneath car).web.mp4",
  "assets/img/motorsport/galleries/using high pressure water to test the aerodynamics of the front ramp 1.web.mp4",
  "assets/img/motorsport/galleries/waterjet aluminum bracket and post 1.web.mp4",
  "assets/img/motorsport/galleries/waterjet aluminum bracket and post 2.web.mp4",
];

const CONTROL_MEDIA = [
  "assets/img/motorsport/galleries/PCB 2d screenshot.webp",
  "assets/img/motorsport/galleries/PCB 3d screenshot back.webp",
  "assets/img/motorsport/galleries/PCB 3d screenshot.webp",
  "assets/img/motorsport/galleries/testing ios app.webp",
  "assets/img/motorsport/galleries/testing the actuation of wing on car manually.web.mp4",
  "assets/img/motorsport/galleries/testing the actuation of wing on car via phone 1.web.mp4",
  "assets/img/motorsport/galleries/testing the actuation of wing on car via phone 2.web.mp4",
  "assets/img/motorsport/galleries/Testing wing control with IR remote.web.mp4",
];

const TRACK_MEDIA = [
  "assets/img/motorsport/galleries/C7 before track 1.webp",
  "assets/img/motorsport/galleries/C7 before track 2.webp",
  "assets/img/motorsport/galleries/c7-track 1.webp",
  "assets/img/motorsport/galleries/c7-track 2.webp",
  "assets/img/motorsport/galleries/c7-track 3.webp",
  "assets/img/motorsport/galleries/Camaro-track 1.webp",
  "assets/img/motorsport/galleries/Camaro-track 2.webp",
  "assets/img/motorsport/galleries/fixing C7 track side at night 1.webp",
  "assets/img/motorsport/galleries/fixing C7 track side at night 2.webp",
  "assets/img/motorsport/galleries/me and my friends after track day events (Track side).webp",
  "assets/img/motorsport/galleries/meeting with c8 zr1.webp",
  "assets/img/motorsport/galleries/replace front brake on a C7.webp",
  "assets/img/motorsport/galleries/sitting at driver seat on track.webp",
  "assets/img/motorsport/galleries/testing active aero on track gingerman.web.mp4",
  "assets/img/motorsport/galleries/testing full active aero on track grattan.web.mp4",
];

const SENSOR_MEDIA = [
  "assets/img/motorsport/galleries/testing the ios app with real camera feed.webp",
  "assets/img/motorsport/galleries/testing the ios app with real camera feed 2.webp",
  "assets/img/motorsport/galleries/testing thermal camera with esp32p4.web.mp4",
  "assets/img/motorsport/galleries/testing thermal camera with web interface.web.mp4",
];

const MEDIA_GROUPS = {
  professionalAll: PROFESSIONAL_MEDIA,
  professionalE8kw: ["assets/img/professional/E8kW_WhiteUnit.webp", "assets/img/professional/EPS_mCHP_poster.webp"],
  professionalE200: ["assets/img/professional/E200.webp", "assets/img/professional/E200Diagram.webp"],
  professionalPower: ["assets/img/professional/testing inverter.webp"],
  professionalControls: ["assets/img/professional/load emulator thermal side.webp", "assets/img/professional/motorized load bank with custom made PCB.webp"],
  professionalFleet: ["assets/img/professional/Websupervisor.webp"],
  c7Aero: [
    "assets/img/motorsport/galleries/active-aero-install.webp",
    "assets/img/motorsport/galleries/Me Standing on the Front Splitter 1.webp",
    "assets/img/motorsport/galleries/showing the front splitter ramp High df vs low drag.webp",
    "assets/img/motorsport/galleries/waterjet aluminum bracket and post 1.web.mp4",
    "assets/img/motorsport/galleries/using high pressure water to test the aerodynamics of the front ramp 1.web.mp4",
  ],
  canControls: [
    "assets/img/motorsport/galleries/PCB 3d screenshot.webp",
    "assets/img/motorsport/galleries/testing ios app.webp",
    "assets/img/motorsport/galleries/testing the actuation of wing on car via phone 1.web.mp4",
    "assets/img/motorsport/galleries/Testing wing control with IR remote.web.mp4",
  ],
  trackData: [
    "assets/img/motorsport/galleries/c7-track 1.webp",
    "assets/img/motorsport/galleries/sitting at driver seat on track.webp",
    "assets/img/motorsport/galleries/testing active aero on track gingerman.web.mp4",
    "assets/img/motorsport/galleries/testing full active aero on track grattan.web.mp4",
  ],
  sensors: [
    "assets/img/motorsport/galleries/testing the ios app with real camera feed.webp",
    "assets/img/motorsport/galleries/testing thermal camera with esp32p4.web.mp4",
    "assets/img/motorsport/galleries/testing thermal camera with web interface.web.mp4",
  ],
  archiveAero: AERO_MEDIA,
  archiveControls: CONTROL_MEDIA,
  archiveTrack: TRACK_MEDIA,
  archiveSensors: SENSOR_MEDIA,
};

const EXACT_MEDIA_TITLES = new Map([
  ["E8kW_WhiteUnit.jpg", "E8kW micro-CHP prototype unit"],
  ["EPS_mCHP_poster.jpg", "Micro-CHP system overview"],
  ["E200.jpg", "E200 200 kW CHP platform"],
  ["E200Diagram.png", "E200 system architecture overview"],
  ["OP4S Engine.png", "Engine platform development hardware"],
  ["Websupervisor.png", "Remote fleet monitoring interface"],
  ["load emulator thermal side.JPG", "Thermal-load emulation test hardware"],
  ["motorized load bank with custom made PCB.JPG", "Motorized electrical load bank and custom controls"],
  ["testing inverter.JPG", "Instrumented hybrid-inverter validation"],
  ["active-aero-install.JPG", "Installed C7 active-aero hardware"],
  ["Me Standing on the Front Splitter 1.jpg", "Front splitter structural demonstration"],
  ["Me Standing on the Front Splitter 2.jpg", "Front splitter load demonstration"],
  ["showing the front splitter ramp High df vs low drag.JPG", "Front aero: high-downforce vs low-drag states"],
  ["waterjet aluminum bracket and post 1.mp4", "Waterjet-cut aluminum aero hardware"],
  ["waterjet aluminum bracket and post 2.MP4", "Aluminum bracket and post fabrication"],
  ["using high pressure water to test the aerodynamics of the front ramp 1.mp4", "Front-ramp flow visualization test"],
  ["PCB 3d screenshot.png", "Active-aero controller PCB — 3D design"],
  ["PCB 3d screenshot back.png", "Active-aero controller PCB — rear layout"],
  ["PCB 2d screenshot.png", "Active-aero controller PCB — board layout"],
  ["testing ios app.PNG", "Native iOS active-aero HMI"],
  ["testing the actuation of wing on car via phone 1.mp4", "On-car wing control from iOS HMI"],
  ["testing the actuation of wing on car via phone 2.mp4", "Closed-loop wing actuation from phone"],
  ["testing the actuation of wing on car manually.mp4", "Manual wing actuation validation"],
  ["Testing wing control with IR remote.MP4", "Early remote-control actuation prototype"],
  ["testing active aero on track gingerman.mp4", "Active-aero track validation — Gingerman"],
  ["testing full active aero on track grattan.mp4", "Full active-aero track validation — Grattan"],
  ["c7-track 1.jpg", "C7 Grand Sport during track development"],
  ["sitting at driver seat on track.jpg", "Driver-side track development"],
  ["testing thermal camera with esp32p4.mp4", "ESP32-P4 thermal-camera integration test"],
  ["testing thermal camera with web interface.mp4", "Live tire-thermal web interface test"],
  ["testing the ios app with real camera feed.JPG", "iOS HMI with live vehicle camera feed"],
  ["testing the ios app with real camera feed 2.JPG", "Live camera integration in iOS HMI"],
]);

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
function modeToParam(mode) { return normalizeMode(mode) === "motorsport" ? "motorsport" : "chp"; }
function ensureGlobalStylesheets() {
  if (!document.querySelector('link[href^="assets/css/site-fixes.css"]')) {
    const fixes = document.createElement("link"); fixes.rel = "stylesheet"; fixes.href = "assets/css/site-fixes.css?v=17"; document.head.appendChild(fixes);
  }
  if (!document.querySelector('link[href^="assets/css/portfolio-refresh.css"]')) {
    const refresh = document.createElement("link"); refresh.rel = "stylesheet"; refresh.href = "assets/css/portfolio-refresh.css?v=3"; document.head.appendChild(refresh);
  }
}
function ensureBackgroundLayer() {
  let layer = document.querySelector(".page-background-layer");
  if (layer) return layer;
  layer = document.createElement("div"); layer.className = "page-background-layer"; layer.setAttribute("aria-hidden", "true"); document.body.prepend(layer); return layer;
}
function clearBackgroundLayer() {
  const layer = document.querySelector(".page-background-layer"); if (layer) layer.remove();
  document.body.style.removeProperty("--page-bg-image"); document.body.style.removeProperty("--page-bg-position");
}
function setCustomBackground(mode) {
  const page = document.body.dataset.page;
  if (page !== "home" && page !== "contact") { clearBackgroundLayer(); return; }
  const nextMode = normalizeMode(mode); const layer = ensureBackgroundLayer();
  const imagePath = page === "contact" ? BACKGROUND_IMAGES.contact : BACKGROUND_IMAGES[nextMode];
  const position = page === "contact" ? "center right" : nextMode === "professional" ? "center right" : "center left";
  layer.style.backgroundImage = `url('${imagePath}?v=17')`; layer.style.backgroundPosition = position;
  document.body.style.setProperty("--page-bg-image", `url('${imagePath}?v=17')`); document.body.style.setProperty("--page-bg-position", position);
}
function ensureNavigation() {
  document.querySelectorAll(".nav").forEach((nav) => { nav.innerHTML = `<a href="index.html">Home</a><a href="faq.html">FAQ</a><a href="contact.html">Contact</a>`; });
}
function cleanHeaderIdentity() {
  document.querySelectorAll(".avatar-shell").forEach((avatar) => avatar.remove());
  document.querySelectorAll(".brand").forEach((brand) => { const name = brand.querySelector(".brand-name"); brand.classList.add("brand-text-only"); brand.textContent = name ? name.textContent : "Shaojie Chen"; });
}
function cleanFooter() { document.querySelectorAll(".site-footer").forEach((footer) => { footer.innerHTML = `<p>© 2026 Shaojie Chen.</p>`; }); }
function relabelModeControls() { document.querySelectorAll('[data-mode-target="professional"]').forEach((button) => { button.textContent = "CHP/MicroGrid"; }); }
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
      const url = new URL(raw, window.location.href); if (url.origin !== window.location.origin) return;
      const filename = url.pathname.split("/").pop() || ""; if (!filename.endsWith(".html")) return;
      url.searchParams.set(MODE_PARAM, param); link.setAttribute("href", `${filename}?${url.searchParams.toString()}${url.hash}`);
    } catch (_) {}
  });
}
function updateCurrentModeUrl(mode) {
  const url = new URL(window.location.href); url.searchParams.set(MODE_PARAM, modeToParam(mode));
  window.history.replaceState({}, "", `${url.pathname}?${url.searchParams.toString()}${url.hash}`);
}
function applyMode(mode, options = {}) {
  const requestedMode = normalizeMode(mode); const page = document.body.dataset.page; const visualMode = page === "contact" ? "professional" : requestedMode;
  if (requestedMode === "motorsport") motorsportClickedThisPage = true;
  document.body.classList.remove("mode-professional", "mode-motorsport"); document.body.classList.add(`mode-${visualMode}`);
  document.body.dataset.mode = visualMode; document.body.dataset.requestedMode = requestedMode;
  document.querySelectorAll("[data-mode-target]").forEach((button) => { const isActive = button.dataset.modeTarget === requestedMode; button.classList.toggle("is-active", isActive); button.setAttribute("aria-pressed", String(isActive)); });
  document.querySelectorAll("[data-role-label]").forEach((node) => { node.textContent = requestedMode === "professional" ? "CHP/MICROGRID SENIOR PROJECT ENGINEER" : "Motorsport Engineer"; });
  setCustomBackground(visualMode); updateMotorsportGlow(requestedMode); localStorage.setItem(PORTFOLIO_MODE_KEY, requestedMode); syncInternalLinks(requestedMode);
  if (options.updateUrl) updateCurrentModeUrl(requestedMode);
}
function fileExtension(path) { return path.split(".").pop().toLowerCase(); }
function isImage(path) { return ["jpg", "jpeg", "png", "webp"].includes(fileExtension(path)); }
function isVideo(path) { return ["mp4", "m4v"].includes(fileExtension(path)); }
function mediaTitle(path) {
  const filename = decodeURIComponent(path.split("/").pop() || path);
  if (EXACT_MEDIA_TITLES.has(filename)) return EXACT_MEDIA_TITLES.get(filename);
  const normalizedFilename = filename
    .replace(/\.web(?=\.mp4$)/i, "")
    .replace(/-\d+(?=\.webp$)/i, "");
  const normalizedBare = normalizedFilename.replace(/\.[^.]+$/, "").toLowerCase();
  for (const [sourceFilename, title] of EXACT_MEDIA_TITLES) {
    if (sourceFilename.replace(/\.[^.]+$/, "").toLowerCase() === normalizedBare) return title;
  }
  const bare = normalizedFilename.replace(/\.[^.]+$/, ""); const iteration = bare.match(/(?:^|\s)(\d+)$/)?.[1] || ""; const lower = bare.toLowerCase(); const suffix = iteration ? ` — iteration ${iteration}` : "";
  if (lower.includes("3d printing failed") || lower.includes("3d priting failed")) return `3D-print prototype failure and iteration${suffix}`;
  if (lower.includes("3d printing wing core")) return `3D-printed composite wing core${suffix}`;
  if (lower.includes("3d printed wing and bracket prototype")) return `Early wing and bracket prototype${suffix}`;
  if (lower.includes("carbon cloth wrapping")) return `Carbon-fiber layup preparation${suffix}`;
  if (lower.includes("carbon fiber plastic bagging unwrap")) return `Vacuum-bagged carbon wing demolding${suffix}`;
  if (lower.includes("carbon fiber fab post processing")) return `Carbon-composite post-processing${suffix}`;
  if (lower.includes("carbon fiber fab") || lower.includes("cabon fiber fab")) return `Carbon-composite wing fabrication${suffix}`;
  if (lower.includes("clear coating")) return `Composite wing finishing and clear coat${suffix}`;
  if (lower.includes("fitting the real aluminum bracket")) return `Final aluminum bracket and wing fitment${suffix}`;
  if (lower.includes("fitting the 3d printed")) return `3D-printed bracket vehicle fit check${suffix}`;
  if (lower.includes("installing the front splitter")) return `Front splitter installation${suffix}`;
  if (lower.includes("mating the 3d")) return `Wing-core assembly and fit-up${suffix}`;
  if (lower.includes("prototype demo in car meet")) return `Active-aero public prototype demonstration${suffix}`;
  if (lower.includes("car in snow with wing")) return `C7 active-aero installed configuration${suffix}`;
  if (lower.includes("before track")) return `C7 preparation before track testing${suffix}`;
  if (lower.includes("c7-track")) return `C7 on-track development${suffix}`;
  if (lower.includes("camaro-track")) return `Track-day vehicle development context${suffix}`;
  if (lower.includes("fixing c7 track side")) return `Trackside troubleshooting and repair${suffix}`;
  if (lower.includes("replace front brake")) return "Track-preparation front brake service";
  if (lower.includes("friends after track")) return "Post-session trackside team moment";
  if (lower.includes("meeting with c8 zr1")) return "Motorsport and vehicle-development event context";
  if (lower.includes("aluminum bracket")) return `Active-aero aluminum bracket hardware${suffix}`;
  if (lower.includes("brass insert")) return "Wing-end threaded insert integration";
  if (lower.includes("painting the wood splitter")) return "Front splitter prototype finishing";
  if (lower.includes("finish cutting the front splitter")) return "Front splitter fabrication";
  if (lower.includes("prototype of active wing")) return "Carbon wing / aluminum post / prototype bracket assembly";
  if (lower.includes("dsc_1292")) return "C7 development build detail";
  return bare.replace(/\b3d\b/gi, "3D").replace(/\bios\b/gi, "iOS").replace(/\bpcb\b/gi, "PCB").replace(/\bc7\b/gi, "C7").replace(/\bc8\b/gi, "C8").replace(/\bzr1\b/gi, "ZR1").replace(/\s+/g, " ").replace(/^./, (c) => c.toUpperCase());
}
function createMediaFigure(path, dock = false) {
  const figure = document.createElement("figure"); figure.className = dock ? "dock-item" : "media-card"; const title = mediaTitle(path);
  if (isImage(path)) {
    const img = document.createElement("img"); img.src = encodeURI(path); img.alt = title; img.loading = "lazy"; img.decoding = "async"; figure.appendChild(img);
  } else if (isVideo(path)) {
    figure.classList.add("media-video"); const video = document.createElement("video"); video.playsInline = true; video.muted = dock; video.loop = dock; video.preload = "metadata"; video.controls = !dock;
    const source = document.createElement("source"); source.src = encodeURI(path); source.type = "video/mp4"; video.appendChild(source);
    if (dock) {
      figure.addEventListener("mouseenter", () => video.play().catch(() => {})); figure.addEventListener("mouseleave", () => { video.pause(); video.currentTime = 0; });
      figure.addEventListener("focusin", () => video.play().catch(() => {})); figure.addEventListener("focusout", () => { video.pause(); video.currentTime = 0; }); figure.tabIndex = 0;
    }
    figure.appendChild(video);
  }
  const caption = document.createElement("figcaption"); caption.className = dock ? "dock-caption" : "media-caption"; caption.textContent = title; figure.appendChild(caption); return figure;
}
function renderMediaGallery(container, items) {
  if (!container || !items?.length) return; const dock = container.classList.contains("media-dock"); const fragment = document.createDocumentFragment();
  items.forEach((path) => fragment.appendChild(createMediaFigure(path, dock))); container.replaceChildren(fragment);
}
function initMediaGalleries() {
  document.querySelectorAll("[data-media-group]").forEach((container) => { const group = MEDIA_GROUPS[container.dataset.mediaGroup]; if (group) renderMediaGallery(container, group); });
}
function initPortfolio() {
  ensureGlobalStylesheets(); cleanHeaderIdentity(); ensureNavigation(); cleanFooter(); relabelModeControls();
  const requested = modeFromUrl(); const saved = normalizeMode(localStorage.getItem(PORTFOLIO_MODE_KEY)); const initialMode = requested || saved || "professional"; applyMode(initialMode, { updateUrl: false });
  document.querySelectorAll("[data-mode-target]").forEach((button) => { button.addEventListener("click", () => applyMode(button.dataset.modeTarget, { updateUrl: true })); });
  initMediaGalleries();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initPortfolio); else initPortfolio();
