(() => {
  const mq = window.matchMedia("(max-width: 767px)");
  const MODE_KEY = "sc-portfolio-mode";
  const MOBILE_PAGES = new Set(["home", "faq", "contact"]);
  let root = null;
  let originalFeedbackPlaceholder = null;
  let feedbackSection = null;
  let initialized = false;
  let mediaObserver = null;
  let projectObserver = null;

  const THEMES = {
    professional: {
      hero: "assets/img/background/CHPMicrogrid_background-1280.webp",
      heroAlt: "Shaojie Chen professional portrait",
      heroTitle: "I build real energy systems.",
      heroBody: "Engines, generators, inverters, batteries, controls, testing, and data—working together."
    },
    motorsport: {
      hero: "assets/img/background/Motorsport_background-1280.webp",
      heroAlt: "Shaojie Chen at the track",
      heroTitle: "I build faster track systems.",
      heroBody: "Active aero, CAN controls, sensors, and track data—built around my C7 development platform."
    }
  };

  const PROJECTS = {
    professional: [
      {
        eyebrow: "01 · CHP · DER · SYSTEMS INTEGRATION",
        title: "E8kW Micro-CHP System Development",
        intro: "Engine-generator, heat recovery, inverter/battery, controls, and residential energy strategy brought together as one working system.",
        media: [
          ["image", "assets/img/professional/E8kW_WhiteUnit-960.webp", "E8kW micro-CHP prototype unit"],
          ["image", "assets/img/professional/EPS_mCHP_poster.webp", "Micro-CHP system overview"]
        ],
        details: [
          "Integrated engine-generator hardware with PMG/rectification, inverter, battery, sensors, heat recovery, and thermal loads.",
          "Developed operating logic around electrical demand, battery state of charge, thermal deadbands, hot-water demand, and residential behavior.",
          "Planned and executed electrical and thermal validation and translated prototype findings into engineering actions."
        ]
      },
      {
        eyebrow: "02 · FIELD / PRODUCT ENGINEERING",
        title: "E200 CHP Program",
        intro: "200 kW CHP controls, commissioning, connectivity, field support, and supervisory-control development.",
        media: [
          ["image", "assets/img/professional/E200-960.webp", "E200 200 kW CHP platform"],
          ["image", "assets/img/professional/E200Diagram-960.webp", "E200 system architecture overview"]
        ],
        details: [
          "Supported ComAp IG1000 / IG500 controller integration, configuration management, and commissioning workflows.",
          "Worked on 4G, AirGate, WebSupervisor, remote monitoring, diagnostics, and field software-update workflows.",
          "Troubleshot controller/module compatibility, CAN/Ethernet communication, and post-update validation issues."
        ]
      },
      {
        eyebrow: "03 · POWER ELECTRONICS · BESS",
        title: "Hybrid Inverter / BESS Validation",
        intro: "Instrumented AC/DC testing for transfer events, bypass, charging, waveform quality, ripple, and real system power paths.",
        media: [
          ["image", "assets/img/professional/testing inverter-960.webp", "Instrumented hybrid-inverter validation"]
        ],
        details: [
          "Built bench setups for source transfer, charging, bypass, generator input, and load-response testing.",
          "Measured transfer timing, waveform quality, ripple, efficiency, charging behavior, and power-path response.",
          "Converted measured behavior into practical generator, inverter, battery, and control integration decisions."
        ]
      },
      {
        eyebrow: "04 · INSTRUMENTATION · DAQ",
        title: "Data Acquisition & Measurement Hardware",
        intro: "Dewesoft workflows and custom signal-conditioning hardware that make prototype behavior measurable and debuggable.",
        media: [
          ["image", "assets/img/professional/Dewesoft DAQ-960.webp", "Dewesoft data acquisition hardware"],
          ["image", "assets/img/professional/DIY_SignalAmplifier for DAQ-960.webp", "Custom signal amplifier for DAQ"]
        ],
        details: [
          "Built Dewesoft-based measurement workflows for electrical, power-system, and system-level validation.",
          "Designed and assembled custom signal-conditioning hardware where practical interfacing was needed before acquisition.",
          "Used synchronized waveforms to investigate transitions, compare configurations, and verify engineering changes."
        ]
      },
      {
        eyebrow: "05 · TEST AUTOMATION · HEMS",
        title: "Residential Load Emulator",
        intro: "Repeatable electrical and thermal test infrastructure for generator, inverter, battery, controls, and hot-water behavior.",
        media: [
          ["image", "assets/img/professional/load emulator thermal side-960.webp", "Thermal-load emulation test hardware"],
          ["image", "assets/img/professional/motorized load bank with custom made PCB-960.webp", "Motorized electrical load bank and custom controls"]
        ],
        details: [
          "Developed electrical and thermal load-emulation hardware for system-level testing.",
          "Integrated PLC/Modbus, Arduino/ESP32-class controls, sensors, motorized loads, and custom electronics.",
          "Automated repeatable scenarios with practical limits, interlocks, and instrumentation."
        ]
      },
      {
        eyebrow: "06 · CONNECTED CONTROLS",
        title: "ComAp & Fleet Monitoring",
        intro: "Controller connectivity, remote monitoring, deployment workflows, software updates, and service-oriented field engineering.",
        media: [
          ["image", "assets/img/professional/Websupervisor-960.webp", "WebSupervisor remote fleet monitoring interface"]
        ],
        details: [
          "Worked with IG500/IG1000-class controller environments, 4G connectivity, commissioning tools, and WebSupervisor.",
          "Defined access, field-service, software-update, and troubleshooting workflows.",
          "Investigated controller/API data availability and created field-usable deployment documentation."
        ]
      }
    ],
    motorsport: [
      {
        eyebrow: "01 · BUILD · MECHANICAL DESIGN · FABRICATION",
        title: "C7 Active Aero Design & Fabrication",
        intro: "Prototype → composite structure → aluminum hardware → movable aero → full-vehicle installation.",
        media: [
          ["image", "assets/img/motorsport/galleries/active-aero-install-960.webp", "Installed C7 active-aero hardware"],
          ["image", "assets/img/motorsport/galleries/Me Standing on the Front Splitter 1-960.webp", "Front splitter structural demonstration"],
          ["image", "assets/img/motorsport/galleries/showing the front splitter ramp High df vs low drag-960.webp", "Front aero high-downforce versus low-drag states"],
          ["video", "assets/img/motorsport/galleries/waterjet aluminum bracket and post 1.web.mp4", "Waterjet-cut aluminum aero hardware"]
        ],
        details: [
          "Used 3D-printed prototypes to validate rear-wing geometry, brackets, mounting, and vehicle packaging before final hardware.",
          "Fabricated carbon-composite wing structures and transitioned prototype brackets/posts to aluminum hardware.",
          "Developed movable front-aero states and integrated actuation and feedback as a complete vehicle system."
        ]
      },
      {
        eyebrow: "02 · CONTROL · EMBEDDED SYSTEMS",
        title: "CAN / ESP32 Active-Aero Control",
        intro: "Vehicle signals, closed-loop actuation, custom electronics, safety logic, and a native iOS engineering interface.",
        media: [
          ["image", "assets/img/motorsport/galleries/PCB 3d screenshot-960.webp", "Active-aero controller PCB 3D design"],
          ["image", "assets/img/motorsport/galleries/testing ios app-960.webp", "Native iOS active-aero HMI"],
          ["video", "assets/img/motorsport/galleries/testing the actuation of wing on car via phone 1.web.mp4", "On-car wing control from iOS HMI"],
          ["video", "assets/img/motorsport/galleries/Testing wing control with IR remote.web.mp4", "Early remote-control actuation prototype"]
        ],
        details: [
          "Integrated ESP32 + MCP2515 CAN and decoded throttle, brake, wheel-speed, and steering-wheel inputs.",
          "Implemented closed-loop actuation, filtered feedback, deadband logic, watchdog behavior, STOP priority, and auto/manual modes.",
          "Moved prototype electronics toward a purpose-built PCB and native iOS HMI."
        ]
      },
      {
        eyebrow: "03 · MEASURE · INSTRUMENTATION",
        title: "Vehicle Instrumentation & Thermal Sensing",
        intro: "Suspension motion, loads, tire thermal behavior, distributed sensor nodes, and live visualization for development decisions.",
        media: [
          ["image", "assets/img/motorsport/galleries/testing the ios app with real camera feed-960.webp", "iOS HMI with live vehicle camera feed"],
          ["video", "assets/img/motorsport/galleries/testing thermal camera with esp32p4.web.mp4", "ESP32-P4 thermal-camera integration test"],
          ["video", "assets/img/motorsport/galleries/testing thermal camera with web interface.web.mp4", "Live tire-thermal web interface test"]
        ],
        details: [
          "Developing suspension-travel and wheel-side sensing concepts for setup and aero-correlation work.",
          "Exploring strain-gauge / HX711 load measurement and tire thermal imaging with distributed ESP32 nodes.",
          "Building iOS and web visualization paths so instrumentation is usable during development."
        ]
      },
      {
        eyebrow: "04 · VALIDATE · TRACK DEVELOPMENT",
        title: "Track Validation & Vehicle Development",
        intro: "Real track use closes the loop between design, data, driver feedback, troubleshooting, and the next hardware revision.",
        media: [
          ["image", "assets/img/motorsport/galleries/c7-track 1-960.webp", "C7 Grand Sport during track development"],
          ["image", "assets/img/motorsport/galleries/sitting at driver seat on track-960.webp", "Driver-side track development"],
          ["video", "assets/img/motorsport/galleries/testing active aero on track gingerman.web.mp4", "Active-aero track validation — Gingerman"],
          ["video", "assets/img/motorsport/galleries/testing full active aero on track grattan.web.mp4", "Full active-aero track validation — Grattan"]
        ],
        details: [
          "Run the C7 at Gingerman and Grattan and review PDR/Pi Toolbox data after sessions.",
          "Use suspension-travel behavior and observed limits to reason about aero balance, ride-height sensitivity, and high-speed understeer.",
          "Perform trackside troubleshooting, service work, setup checks, and hardware iteration as part of the development loop."
        ]
      }
    ]
  };

  const FAQS = [
    ["What is your background?", "Shanghai, China — born and raised. Miami, FL — B.S. and M.S. in Mechanical Engineering at the University of Miami. Detroit, MI — engineering work at Enginuity Power Systems."],
    ["Do you need sponsorship?", "Yes. Currently on H-1B and would need H-1B transfer support."],
    ["What motivates you?", "Overcoming technical difficulties and the sense of accomplishment that comes from making a system work."],
    ["What is your short and long term goal?", "Short: C8 Z06. Long: GT3 RS."],
    ["Any publication?", "I have a patent application titled Methods and Devices for Selecting a Power Source (3135-034US1). The assignment was formally recorded on May 28, 2026."]
  ];

  function currentMode() {
    const query = new URLSearchParams(location.search).get("mode");
    if (query === "motorsport") return "motorsport";
    if (query === "chp" || query === "professional") return "professional";
    try { return localStorage.getItem(MODE_KEY) === "motorsport" ? "motorsport" : "professional"; }
    catch (_) { return "professional"; }
  }

  function modeParam(mode) { return mode === "motorsport" ? "motorsport" : "chp"; }

  function modeHref(path, mode, hash = "") {
    const url = new URL(path, location.href);
    url.searchParams.set("mode", modeParam(mode));
    return `${url.pathname.split("/").pop() || "index.html"}?${url.searchParams.toString()}${hash}`;
  }

  function syncBodyMode(mode) {
    document.body.classList.remove("mode-professional", "mode-motorsport");
    document.body.classList.add(`mode-${mode}`);
    document.body.dataset.mode = mode;
    document.body.dataset.requestedMode = mode;
  }

  function setMode(mode, updateUrl = true) {
    const next = mode === "motorsport" ? "motorsport" : "professional";
    if (!root) return;
    try { localStorage.setItem(MODE_KEY, next); } catch (_) {}
    syncBodyMode(next);
    root.dataset.mode = next;
    root.querySelectorAll("[data-mobile-mode]").forEach((button) => {
      const active = button.dataset.mobileMode === next;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    if (updateUrl) {
      const url = new URL(location.href);
      url.searchParams.set("mode", modeParam(next));
      history.replaceState({}, "", `${url.pathname}?${url.searchParams.toString()}${url.hash}`);
    }
    renderMain(next);
  }

  function createHeader(mode) {
    const header = document.createElement("header");
    header.className = "mv3-header";
    header.innerHTML = `
      <div class="mv3-header-row">
        <span class="mv3-header-spacer" aria-hidden="true"></span>
        <a class="mv3-brand" href="${modeHref("index.html", mode)}">Shaojie Chen</a>
        <button class="mv3-menu-button" type="button" aria-label="Open navigation" aria-expanded="false"><span></span><span></span><span></span></button>
      </div>
      <div class="mv3-mode-switch" role="group" aria-label="Portfolio mode selector">
        <button type="button" data-mobile-mode="professional" data-mode-target="professional">CHP/MicroGrid</button>
        <button type="button" data-mobile-mode="motorsport" data-mode-target="motorsport">Motorsport</button>
      </div>
      <div class="mv3-menu-backdrop" hidden></div>
      <nav class="mv3-menu" aria-label="Mobile navigation" aria-hidden="true">
        <div class="mv3-menu-handle" aria-hidden="true"></div>
        <p class="mv3-menu-label">Navigate</p>
        <a href="${modeHref("index.html", mode)}" data-nav-page="index.html"><span>Home</span><b>→</b></a>
        <a href="${modeHref("faq.html", mode)}" data-nav-page="faq.html"><span>FAQ</span><b>→</b></a>
        <a href="${modeHref("contact.html", mode)}" data-nav-page="contact.html"><span>Contact</span><b>→</b></a>
      </nav>`;

    const menuButton = header.querySelector(".mv3-menu-button");
    const menu = header.querySelector(".mv3-menu");
    const backdrop = header.querySelector(".mv3-menu-backdrop");
    const closeMenu = () => {
      root?.classList.remove("menu-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
      menu.setAttribute("aria-hidden", "true");
      backdrop.hidden = true;
    };
    menuButton.addEventListener("click", () => {
      if (root?.classList.contains("menu-open")) return closeMenu();
      root?.classList.add("menu-open");
      menuButton.setAttribute("aria-expanded", "true");
      menuButton.setAttribute("aria-label", "Close navigation");
      menu.setAttribute("aria-hidden", "false");
      backdrop.hidden = false;
    });
    backdrop.addEventListener("click", closeMenu);
    menu.addEventListener("click", (event) => { if (event.target.closest("a")) closeMenu(); });
    header.querySelectorAll("[data-mobile-mode]").forEach((button) => button.addEventListener("click", () => setMode(button.dataset.mobileMode, true)));
    return header;
  }

  function refreshHeader(mode) {
    if (!root) return;
    root.querySelector(".mv3-brand")?.setAttribute("href", modeHref("index.html", mode));
    root.querySelectorAll(".mv3-menu [data-nav-page]").forEach((link) => link.href = modeHref(link.dataset.navPage, mode));
    root.querySelectorAll("[data-mobile-mode]").forEach((button) => {
      const active = button.dataset.mobileMode === mode;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function createHero(mode, compact = false) {
    const theme = THEMES[mode];
    const section = document.createElement("section");
    section.className = compact ? "mv3-hero mv3-hero-compact" : "mv3-hero";
    section.innerHTML = `
      <img class="mv3-hero-image" src="${theme.hero}" alt="${theme.heroAlt}" fetchpriority="high" decoding="async" />
      <div class="mv3-hero-shade"></div>
      <div class="mv3-hero-copy">
        <h1>${compact ? "Let’s connect." : theme.heroTitle}</h1>
        ${compact ? "<p>Contact, resumes, and visitor feedback in one place.</p>" : `<p>${theme.heroBody}</p>`}
      </div>`;
    return section;
  }

  function makeImageSlide(item) {
    const [, src, title] = item;
    const figure = document.createElement("figure");
    figure.className = "mv3-media-card";
    figure.innerHTML = `<img loading="lazy" decoding="async" fetchpriority="low" src="${encodeURI(src)}" alt="${title}" /><figcaption>${title}</figcaption>`;
    figure.querySelector("img")?.addEventListener("click", () => window.PortfolioAnalytics?.track?.("media_open", title, { src }));
    return figure;
  }

  function makeVideoSlide(item) {
    const [, src, title] = item;
    const figure = document.createElement("figure");
    figure.className = "mv3-media-card mv3-video-card";
    figure.innerHTML = `<video controls playsinline preload="metadata" src="${encodeURI(src)}"></video><figcaption>${title}</figcaption>`;
    return figure;
  }

  function makeMediaSlide(item) { return item[0] === "video" ? makeVideoSlide(item) : makeImageSlide(item); }

  function hydrateProject(article, project) {
    if (article.dataset.hydrated === "true") return;
    article.dataset.hydrated = "true";
    const slider = article.querySelector(".mv3-slider");
    slider.replaceChildren(...project.media.map(makeMediaSlide));
  }

  function createProject(project) {
    const article = document.createElement("article");
    article.className = "mv3-project";
    article.dataset.projectTitle = project.title;
    article.innerHTML = `
      <header class="mv3-project-heading">
        <p>${project.eyebrow}</p>
        <h2>${project.title}</h2>
        <div>${project.intro}</div>
      </header>
      <div class="mv3-slider" aria-label="${project.title} media"><div class="mv3-media-skeleton" aria-hidden="true"></div></div>
      <aside class="mv3-details-card">
        <p>Technical details</p>
        <ul>${project.details.map((detail) => `<li>${detail}</li>`).join("")}</ul>
      </aside>`;
    return article;
  }

  function setupProjectObservers(main, projects) {
    mediaObserver?.disconnect();
    projectObserver?.disconnect();
    const articles = [...main.querySelectorAll(".mv3-project")];
    mediaObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const index = articles.indexOf(entry.target);
        if (index >= 0) hydrateProject(entry.target, projects[index]);
        mediaObserver.unobserve(entry.target);
      });
    }, { rootMargin: "520px 0px" });
    articles.forEach((article) => mediaObserver.observe(article));

    const seen = new Set();
    projectObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.intersectionRatio < .35) return;
        const title = entry.target.dataset.projectTitle || "Project";
        if (seen.has(title)) return;
        seen.add(title);
        window.PortfolioAnalytics?.track?.("project_open", title, { source: "mobile_project_view" });
      });
    }, { threshold: [.35] });
    articles.forEach((article) => projectObserver.observe(article));
  }

  function createPublicNote() {
    const note = document.createElement("aside");
    note.className = "mv3-public-note-static";
    note.innerHTML = `<strong>Public portfolio note</strong><p>Only public-safe, personally generated, or otherwise appropriate material is shown here; no NDA-protected or customer-confidential information is displayed.</p>`;
    return note;
  }

  function createYouTubeEmbeds() {
    const section = document.createElement("section");
    section.className = "mv3-youtube-embeds";
    const chinaMirror = window.__PORTFOLIO_CHINA_MIRROR__ === true;
    const firstVideo = chinaMirror
      ? '<video controls playsinline preload="metadata" aria-label="On-track development video 01"><source src="assets/img/motorsport/galleries/testing active aero on track gingerman.web.mp4" type="video/mp4"></video>'
      : '<iframe loading="lazy" src="https://www.youtube-nocookie.com/embed/ZX2A2YhbPO8" title="On-track development video 01" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
    const secondVideo = chinaMirror
      ? '<video controls playsinline preload="metadata" aria-label="On-track development video 02"><source src="assets/img/motorsport/galleries/testing full active aero on track grattan.web.mp4" type="video/mp4"></video>'
      : '<iframe loading="lazy" src="https://www.youtube-nocookie.com/embed/KGgSzXkcqwg" title="On-track development video 02" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
    section.innerHTML = `
      <p>Track video</p>
      <h2>On-track development</h2>
      <div class="mv3-youtube-grid">
        <article><div class="mv3-youtube-frame">${firstVideo}</div><h3>On-track development 01</h3></article>
        <article><div class="mv3-youtube-frame">${secondVideo}</div><h3>On-track development 02</h3></article>
      </div>`;
    return section;
  }

  function renderHome(main, mode) {
    main.appendChild(createHero(mode));
    const group = document.createElement("section");
    group.className = "mv3-project-group";
    PROJECTS[mode].forEach((project) => group.appendChild(createProject(project)));
    main.appendChild(group);
    if (mode === "professional") main.appendChild(createPublicNote());
    if (mode === "motorsport") main.appendChild(createYouTubeEmbeds());
    setupProjectObservers(main, PROJECTS[mode]);
  }

  function makeFAQCard(question, answer) {
    const card = document.createElement("article");
    card.className = "mv3-faq-card";
    card.innerHTML = `<h2>${question}</h2><p>${answer}</p>`;
    if (question === "Any publication?") {
      const preview = document.createElement("img");
      preview.loading = "lazy";
      preview.decoding = "async";
      preview.src = "assets/files/Patent%20Screenshot-960.webp";
      preview.alt = "Patent assignment recordation first-page preview";
      preview.className = "mv3-patent-preview";
      card.appendChild(preview);
    }
    return card;
  }

  function renderFAQ(main) {
    const intro = document.createElement("section");
    intro.className = "mv3-faq-intro";
    intro.innerHTML = `<p>A little more about me</p><h1>FAQ</h1>`;
    main.appendChild(intro);
    const grid = document.createElement("section");
    grid.className = "mv3-faq-grid";
    FAQS.forEach((item) => grid.appendChild(makeFAQCard(item[0], item[1])));
    main.appendChild(grid);
  }

  function makeResumeCard(title, subtitle, image, pdf) {
    const card = document.createElement("article");
    card.className = "mv3-resume-card";
    card.innerHTML = `
      <img loading="lazy" decoding="async" fetchpriority="low" src="${image}" alt="${title} first-page preview" />
      <div><small>Resume</small><h2>${title}</h2><p>${subtitle}</p><a class="resume-open-button" href="${pdf}" target="_blank" rel="noopener">Open Resume ↗</a></div>`;
    return card;
  }

  function createContactInfoCard() {
    const card = document.createElement("article");
    card.className = "mv3-contact-info-card";
    card.innerHTML = `
      <p>Contact</p>
      <a href="mailto:cheerioov2@gmail.com"><span>Email</span><strong>cheerioov2@gmail.com</strong><b>↗</b></a>
      <a href="tel:+13053105596"><span>Phone</span><strong>305-310-5596</strong><b>↗</b></a>
      <a href="https://www.linkedin.com/in/shaojie-chen-332496206/" target="_blank" rel="noopener"><span>LinkedIn</span><strong>View profile</strong><b>↗</b></a>`;
    return card;
  }

  function compactFeedback(section) {
    if (!section) return;
    section.classList.add("mv3-feedback");
    const privacy = section.querySelector(".review-privacy-note");
    if (privacy && !section.querySelector(".mv3-privacy-toggle")) {
      privacy.classList.add("mv3-privacy-collapsed");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "mv3-privacy-toggle";
      button.textContent = "Privacy details +";
      button.addEventListener("click", () => {
        const collapsed = privacy.classList.toggle("mv3-privacy-collapsed");
        button.textContent = collapsed ? "Privacy details +" : "Privacy details −";
      });
      privacy.insertAdjacentElement("beforebegin", button);
    }
  }

  function renderContact(main, mode) {
    main.appendChild(createHero(mode, true));
    const section = document.createElement("section");
    section.className = "mv3-contact-resume-section";
    section.innerHTML = `<div class="mv3-section-title"><p>Contact & Resume</p><h2>Everything in one place.</h2></div>`;
    section.appendChild(createContactInfoCard());
    const resumeLabel = document.createElement("h3");
    resumeLabel.className = "mv3-resume-label";
    resumeLabel.textContent = "Resumes";
    section.appendChild(resumeLabel);
    const rail = document.createElement("div");
    rail.className = "mv3-resume-rail";
    rail.appendChild(makeResumeCard("Energy Systems", "CHP · Microgrid · BESS · Controls", "assets/files/CHP%20Resume%20Screenshot-960.webp", "assets/files/Shaojie_Chen_Resume_Microgrid_CHP.pdf"));
    rail.appendChild(makeResumeCard("Motorsport", "Active Aero · CAN · Vehicle Dynamics", "assets/files/Motorsport%20Resume%20Screenshot-960.webp", "assets/files/Shaojie_Chen_Resume_Motorsport.pdf"));
    section.appendChild(rail);
    main.appendChild(section);
    if (feedbackSection) {
      compactFeedback(feedbackSection);
      main.appendChild(feedbackSection);
    }
  }

  function renderMain(mode) {
    if (!root) return;
    refreshHeader(mode);
    const oldMain = root.querySelector(".mv3-main");
    const main = document.createElement("main");
    main.className = "mv3-main";
    oldMain?.replaceWith(main);
    if (!oldMain) root.appendChild(main);
    const page = document.body.dataset.page;
    if (page === "home") renderHome(main, mode);
    else if (page === "faq") renderFAQ(main);
    else if (page === "contact") renderContact(main, mode);
  }

  function init() {
    const page = document.body?.dataset.page;
    if (initialized || !mq.matches || !MOBILE_PAGES.has(page)) return;
    initialized = true;
    const mode = currentMode();
    syncBodyMode(mode);
    document.body.classList.add("mobile-v3-active");

    if (page === "contact") {
      feedbackSection = document.querySelector("body > main .reviews-section");
      if (feedbackSection?.parentNode) {
        originalFeedbackPlaceholder = document.createComment("mobile-v3-feedback-placeholder");
        feedbackSection.parentNode.insertBefore(originalFeedbackPlaceholder, feedbackSection);
      }
    }

    root = document.createElement("div");
    root.className = "mobile-v3-root";
    root.dataset.mode = mode;
    root.appendChild(createHeader(mode));
    const main = document.createElement("main");
    main.className = "mv3-main";
    root.appendChild(main);
    document.body.prepend(root);
    renderMain(mode);
  }

  function teardown() {
    if (!initialized) return;
    initialized = false;
    mediaObserver?.disconnect();
    projectObserver?.disconnect();
    if (feedbackSection && originalFeedbackPlaceholder?.parentNode) {
      originalFeedbackPlaceholder.parentNode.insertBefore(feedbackSection, originalFeedbackPlaceholder);
      originalFeedbackPlaceholder.remove();
    }
    feedbackSection = null;
    originalFeedbackPlaceholder = null;
    root?.remove();
    root = null;
    document.body.classList.remove("mobile-v3-active");
  }

  function sync() { mq.matches ? init() : teardown(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", sync, { once: true });
  else sync();
  if (typeof mq.addEventListener === "function") mq.addEventListener("change", sync);
  else if (typeof mq.addListener === "function") mq.addListener(sync);
})();
