/* Portfolio visual catalog + showcase behavior. */

(() => {
  if (typeof MEDIA_GROUPS === "undefined" || typeof EXACT_MEDIA_TITLES === "undefined") return;

  /* Load the newest Home-only layout without touching shared FAQ / Contact styling. */
  if (!document.querySelector('link[data-portfolio-showcase="v3"]')) {
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = "assets/css/portfolio-showcase-v3.css?v=1";
    stylesheet.dataset.portfolioShowcase = "v3";
    document.head.appendChild(stylesheet);
  }

  const DAQ_MEDIA = [
    "assets/img/professional/Dewesoft DAQ.jpg",
    "assets/img/professional/DIY_SignalAmplifier for DAQ.png",
  ];

  MEDIA_GROUPS.professionalDaq = DAQ_MEDIA;

  if (Array.isArray(MEDIA_GROUPS.professionalAll)) {
    DAQ_MEDIA.forEach((path) => {
      if (!MEDIA_GROUPS.professionalAll.includes(path)) MEDIA_GROUPS.professionalAll.push(path);
    });
  }

  /* Main case studies use the strongest visuals in engineering-story order.
     The gallery at the end keeps the broader development record. */
  MEDIA_GROUPS.c7Aero = [
    "assets/img/motorsport/galleries/active-aero-install.JPG",
    "assets/img/motorsport/galleries/prototype of active wing carbon fiber wing + aluminum post + plastic braket.JPG",
    "assets/img/motorsport/galleries/showing the front splitter ramp High df vs low drag.JPG",
    "assets/img/motorsport/galleries/waterjet aluminum bracket and post 1.mp4",
    "assets/img/motorsport/galleries/using high pressure water to test the aerodynamics of the front ramp 1.mp4",
  ];

  MEDIA_GROUPS.canControls = [
    "assets/img/motorsport/galleries/PCB 3d screenshot.png",
    "assets/img/motorsport/galleries/testing ios app.PNG",
    "assets/img/motorsport/galleries/testing the actuation of wing on car via phone 1.mp4",
    "assets/img/motorsport/galleries/Testing wing control with IR remote.MP4",
  ];

  MEDIA_GROUPS.sensors = [
    "assets/img/motorsport/galleries/testing the ios app with real camera feed.JPG",
    "assets/img/motorsport/galleries/testing thermal camera with esp32p4.mp4",
    "assets/img/motorsport/galleries/testing thermal camera with web interface.mp4",
  ];

  MEDIA_GROUPS.trackData = [
    "assets/img/motorsport/galleries/c7-track 1.jpg",
    "assets/img/motorsport/galleries/fixing C7 track side at night 1.jpg",
    "assets/img/motorsport/galleries/testing active aero on track gingerman.mp4",
    "assets/img/motorsport/galleries/testing full active aero on track grattan.mp4",
  ];

  EXACT_MEDIA_TITLES.set("Dewesoft DAQ.jpg", "Dewesoft data-acquisition hardware for system validation");
  EXACT_MEDIA_TITLES.set("DIY_SignalAmplifier for DAQ.png", "Custom signal-conditioning / amplifier hardware for DAQ measurements");
  EXACT_MEDIA_TITLES.set("prototype of active wing carbon fiber wing + aluminum post + plastic braket.JPG", "Prototype active-wing assembly: composite wing, aluminum post, and bracket");
  EXACT_MEDIA_TITLES.set("fixing C7 track side at night 1.jpg", "Trackside troubleshooting and repair during development");

  function setText(selector, text) {
    const node = document.querySelector(selector);
    if (node) node.textContent = text;
  }

  function updateShowcaseCopy() {
    setText(
      '.home-showcase[data-mode-section="professional"] .section-heading h2',
      "Systems I build, integrate, test, and support."
    );
    setText(
      '.home-showcase[data-mode-section="motorsport"] .showcase-intro',
      "The projects follow one development loop: hardware, controls, instrumentation, and track iteration."
    );

    const confidentiality = document.querySelector('.public-portfolio-note[data-mode-section="professional"] p');
    if (confidentiality) {
      confidentiality.textContent = "The project photos and information shown here are limited to material that is publicly available, personally generated, or otherwise appropriate for public display. No NDA-protected, proprietary, customer-confidential, credential, or controlled internal information is displayed. Where a source image could reveal sensitive details, those details have been blurred or excluded. This site showcases my engineering work and the systems I have built, integrated, tested, and supported.";
    }

    setText(
      '.track-video-section .lead',
      "Real track use closes the development loop: hardware, controls, setup, data, and driver feedback all meet here."
    );

    const professionalArchive = document.querySelector('.media-archive[data-mode-section="professional"]');
    if (professionalArchive) {
      const eyebrow = professionalArchive.querySelector('.eyebrow');
      const title = professionalArchive.querySelector('h2');
      const intro = professionalArchive.querySelector('.archive-intro');
      if (eyebrow) eyebrow.textContent = "CHP / MicroGrid Gallery";
      if (title) title.textContent = "Systems, hardware, controls, and test work.";
      if (intro) intro.textContent = "A visual tour through the hardware, instrumentation, controls, and validation work behind my CHP and microgrid projects.";
    }

    const motorsportArchive = document.querySelector('.media-archive[data-mode-section="motorsport"]');
    if (motorsportArchive) {
      const eyebrow = motorsportArchive.querySelector('.eyebrow');
      const title = motorsportArchive.querySelector('h2');
      const intro = motorsportArchive.querySelector('.archive-intro');
      if (eyebrow) eyebrow.textContent = "Motorsport Gallery";
      if (title) title.textContent = "The full development story.";
      if (intro) intro.textContent = "Prototype to fabrication, controls, instrumentation, track work, and iteration—shown as the project developed.";

      const groups = Array.from(motorsportArchive.querySelectorAll('.dock-group'));
      const findGroup = (keyword) => groups.find((group) => group.querySelector('h3')?.textContent.toLowerCase().includes(keyword));
      const ordered = [findGroup("build"), findGroup("control"), findGroup("measure"), findGroup("validate")].filter(Boolean);
      ordered.forEach((group) => motorsportArchive.appendChild(group));

      const groupCopy = [
        ["build", "Build · active aero · fabrication", "Prototype iterations, composite work, fit checks, front aero, final hardware, and fabrication."],
        ["control", "Control · PCB · HMI", "Controller design, board development, driver interface, vehicle signals, and actuation testing."],
        ["measure", "Measure · instrumentation · thermal imaging", "Camera integration, tire-thermal development, live visualization, and distributed sensing."],
        ["validate", "Validate · track development", "Gingerman, Grattan, trackside work, service, data review, and on-track iteration."],
      ];
      groupCopy.forEach(([keyword, heading, description]) => {
        const group = findGroup(keyword);
        if (!group) return;
        const h3 = group.querySelector('h3');
        const p = group.querySelector(':scope > p');
        if (h3) h3.textContent = heading;
        if (p) p.textContent = description;
      });
    }
  }

  function cleanLegacyDockListeners(rail) {
    Array.from(rail.children).forEach((item) => {
      if (!item.classList.contains("dock-item")) return;
      const cleanItem = item.cloneNode(true);
      item.replaceWith(cleanItem);
    });
  }

  function setupVideoPlayback(rail) {
    const cards = Array.from(rail.querySelectorAll('.dock-item'));
    if (!cards.length) return;

    cards.forEach((card) => {
      const video = card.querySelector('video');
      if (!video) return;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.controls = false;
      video.preload = "metadata";
      card.addEventListener("click", () => {
        if (video.paused) video.play().catch(() => {});
        else video.pause();
      });
    });

    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target.querySelector('video');
        if (!video) return;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.58) video.play().catch(() => {});
        else video.pause();
      });
    }, { root: rail, threshold: [0, 0.58, 0.9] });

    cards.forEach((card) => observer.observe(card));
  }

  function setupRailNavigation(rail, index) {
    rail.classList.add("showcase-rail");
    rail.setAttribute("aria-label", `Scrollable project gallery ${index + 1}`);

    const nav = document.createElement("div");
    nav.className = "showcase-rail-nav";

    const previous = document.createElement("button");
    previous.type = "button";
    previous.className = "showcase-rail-button showcase-rail-prev";
    previous.setAttribute("aria-label", "Previous gallery item");
    previous.textContent = "←";

    const next = document.createElement("button");
    next.type = "button";
    next.className = "showcase-rail-button showcase-rail-next";
    next.setAttribute("aria-label", "Next gallery item");
    next.textContent = "→";

    nav.append(previous, next);
    rail.parentNode.insertBefore(nav, rail);

    const amount = () => Math.max(280, Math.min(rail.clientWidth * 0.78, 980));
    previous.addEventListener("click", () => rail.scrollBy({ left: -amount(), behavior: "smooth" }));
    next.addEventListener("click", () => rail.scrollBy({ left: amount(), behavior: "smooth" }));

    let buttonFrame = 0;
    const updateButtons = () => {
      buttonFrame = 0;
      const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
      previous.disabled = rail.scrollLeft <= 3;
      next.disabled = rail.scrollLeft >= maxScroll - 3;
    };
    rail.__showcaseUpdateButtons = updateButtons;
    rail.addEventListener("scroll", () => {
      if (!buttonFrame) buttonFrame = requestAnimationFrame(updateButtons);
    }, { passive: true });
    window.addEventListener("resize", updateButtons, { passive: true });
    requestAnimationFrame(updateButtons);

    /* Standard wheel, tilt-wheel and trackpad gestures all move the rail horizontally.
       At either end, normal page scrolling resumes so the rail never traps the page. */
    rail.addEventListener("wheel", (event) => {
      const dominant = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (!dominant) return;
      const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
      const movingForward = dominant > 0;
      const canMove = movingForward ? rail.scrollLeft < maxScroll - 2 : rail.scrollLeft > 2;
      if (!canMove) return;
      event.preventDefault();
      rail.scrollBy({ left: dominant * 1.25, behavior: "auto" });
    }, { passive: false });
  }

  function refreshRailsAfterModeChange() {
    requestAnimationFrame(() => {
      document.querySelectorAll('.media-dock.showcase-rail').forEach((rail) => {
        rail.__showcaseUpdateButtons?.();
      });
    });
  }

  function initShowcaseRails() {
    document.querySelectorAll('.media-archive .media-dock').forEach((rail, index) => {
      cleanLegacyDockListeners(rail);
      setupRailNavigation(rail, index);
      setupVideoPlayback(rail);
    });

    if ("MutationObserver" in window) {
      const modeObserver = new MutationObserver(refreshRailsAfterModeChange);
      modeObserver.observe(document.body, { attributes: true, attributeFilter: ["class", "data-mode"] });
    }
  }

  function initShowcaseV3() {
    updateShowcaseCopy();
    initShowcaseRails();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initShowcaseV3);
  else initShowcaseV3();
})();