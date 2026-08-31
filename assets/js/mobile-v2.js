(() => {
  const mq = window.matchMedia("(max-width: 767px)");
  const MODE_KEY = "sc-portfolio-mode";
  const MOBILE_PAGES = new Set(["home", "contact"]);
  let root = null;
  let feedbackPlaceholder = null;
  let feedbackSection = null;
  let initialized = false;

  const PUBLIC_NOTE = "The project photos and information shown here are limited to material that is publicly available, personally generated, or otherwise appropriate for public display. No NDA-protected, proprietary, customer-confidential, credential, or controlled internal information is displayed.";

  const HOME_PROJECTS = {
    professional: [
      {
        id: "e8kw",
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
        id: "e200",
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
        id: "inverter",
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
        id: "daq",
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
        id: "hems",
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
        id: "comap",
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
        id: "c7-aero",
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
        id: "can-controls",
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
        id: "sensors",
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
        id: "track-data",
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

  function setMode(mode, updateUrl = true) {
    const next = mode === "motorsport" ? "motorsport" : "professional";
    if (!root) return;
    root.dataset.mode = next;
    root.querySelectorAll("[data-mobile-mode]").forEach((button) => {
      const active = button.dataset.mobileMode === next;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    document.body.classList.remove("mode-professional", "mode-motorsport");
    document.body.classList.add(`mode-${next}`);
    document.body.dataset.mode = next;
    document.body.dataset.requestedMode = next;
    document.querySelectorAll('.site-header [data-mode-target]').forEach((button) => {
      const active = button.dataset.modeTarget === next;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    try { localStorage.setItem(MODE_KEY, next); } catch (_) {}
    if (updateUrl) {
      const url = new URL(location.href);
      url.searchParams.set("mode", modeParam(next));
      history.replaceState({}, "", `${url.pathname}?${url.searchParams.toString()}${url.hash}`);
    }
    refreshModeLinks(next);
    if (document.body.dataset.page === "contact") orderResumeSlider(next);
  }

  function refreshModeLinks(mode) {
    if (!root) return;
    root.querySelectorAll("[data-mode-link]").forEach((link) => {
      const target = link.dataset.modeLink;
      const hash = link.dataset.modeHash || "";
      link.href = modeHref(target, mode, hash);
    });
  }

  function createHeader(mode) {
    const header = document.createElement("header");
    header.className = "mv2-header";
    header.innerHTML = `
      <div class="mv2-header-row">
        <a class="mv2-brand" href="${modeHref("index.html", mode)}" data-mode-link="index.html">Shaojie Chen</a>
        <button class="mv2-menu-button" type="button" aria-label="Open navigation" aria-expanded="false"><span></span><span></span><span></span></button>
      </div>
      <div class="mv2-mode-switch" role="group" aria-label="Portfolio mode selector">
        <button type="button" data-mobile-mode="professional" data-mode-target="professional"><span aria-hidden="true">⚡</span> CHP / MicroGrid</button>
        <button type="button" data-mobile-mode="motorsport" data-mode-target="motorsport"><span aria-hidden="true">🏁</span> Motorsport</button>
      </div>
      <div class="mv2-menu-backdrop" hidden></div>
      <nav class="mv2-menu" aria-label="Mobile navigation" aria-hidden="true">
        <a data-mode-link="index.html" href="${modeHref("index.html", mode)}">Home</a>
        <a data-mode-link="faq.html" href="${modeHref("faq.html", mode)}">FAQ</a>
        <a data-mode-link="contact.html" data-mode-hash="#resumes" href="${modeHref("contact.html", mode, "#resumes")}">Resume</a>
        <a data-mode-link="contact.html" href="${modeHref("contact.html", mode)}">Contact</a>
      </nav>`;

    const menuButton = header.querySelector(".mv2-menu-button");
    const menu = header.querySelector(".mv2-menu");
    const backdrop = header.querySelector(".mv2-menu-backdrop");
    const closeMenu = () => {
      root?.classList.remove("menu-open");
      menuButton?.setAttribute("aria-expanded", "false");
      menuButton?.setAttribute("aria-label", "Open navigation");
      menu?.setAttribute("aria-hidden", "true");
      if (backdrop) backdrop.hidden = true;
    };
    const openMenu = () => {
      root?.classList.add("menu-open");
      menuButton?.setAttribute("aria-expanded", "true");
      menuButton?.setAttribute("aria-label", "Close navigation");
      menu?.setAttribute("aria-hidden", "false");
      if (backdrop) backdrop.hidden = false;
    };
    menuButton.addEventListener("click", () => root?.classList.contains("menu-open") ? closeMenu() : openMenu());
    backdrop.addEventListener("click", closeMenu);
    menu.addEventListener("click", (event) => { if (event.target.closest("a")) closeMenu(); });
    header.querySelectorAll("[data-mobile-mode]").forEach((button) => {
      button.addEventListener("click", () => setMode(button.dataset.mobileMode, true));
    });
    return header;
  }

  function createHero(mode) {
    const professional = mode === "professional";
    const section = document.createElement("section");
    section.className = "mv2-hero";
    section.dataset.modeSection = mode;
    const photo = professional ? "assets/img/background/CHPMicrogrid_background-1280.webp" : "assets/img/background/Motorsport_background-1280.webp";
    section.innerHTML = `
      <figure class="mv2-hero-photo hero-proof">
        <img src="${photo}" alt="${professional ? "Shaojie Chen professional portrait" : "Shaojie Chen at the track"}" />
      </figure>
      <div class="mv2-hero-copy">
        <h1>${professional ? "I build real<br>energy systems." : "I build faster<br>track systems."}</h1>
        <p>${professional ? "Engines, generators, inverters, batteries, controls, testing, and data—working together." : "Active aero, CAN controls, sensors, and track data—built around my C7 development platform."}</p>
      </div>`;
    return section;
  }

  function createMediaFigure(item, index, total) {
    const [type, src, title] = item;
    const figure = document.createElement("figure");
    figure.className = "mv2-media-card media-card";
    if (type === "video") {
      const video = document.createElement("video");
      video.controls = true;
      video.playsInline = true;
      video.preload = "metadata";
      const source = document.createElement("source");
      source.src = encodeURI(src);
      source.type = "video/mp4";
      video.appendChild(source);
      figure.appendChild(video);
    } else {
      const img = document.createElement("img");
      img.src = encodeURI(src);
      img.alt = title;
      img.loading = "lazy";
      img.decoding = "async";
      figure.appendChild(img);
    }
    const caption = document.createElement("figcaption");
    caption.innerHTML = `<span>${title}</span><b>${index + 1} / ${total}</b>`;
    figure.appendChild(caption);
    return figure;
  }

  function bindSlider(slider, dots) {
    const cards = [...slider.children];
    if (cards.length < 2) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const center = slider.scrollLeft + slider.clientWidth / 2;
      let best = 0;
      let bestDistance = Infinity;
      cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(cardCenter - center);
        if (distance < bestDistance) { bestDistance = distance; best = index; }
      });
      dots.querySelectorAll("button").forEach((dot, index) => dot.classList.toggle("is-active", index === best));
    };
    slider.addEventListener("scroll", () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    }, { passive: true });
    update();
  }

  function createProject(project) {
    const section = document.createElement("section");
    section.className = "mv2-project";
    section.id = `mobile-${project.id}`;
    section.innerHTML = `
      <div class="mv2-project-heading">
        <p>${project.eyebrow}</p>
        <h2>${project.title}</h2>
        <div>${project.intro}</div>
      </div>
      <div class="mv2-slider" aria-label="${project.title} media"></div>
      <div class="mv2-slider-dots" aria-hidden="true"></div>
      <button class="mv2-details-toggle" type="button" aria-expanded="false">Technical details <span>+</span></button>
      <div class="mv2-details" hidden><ul>${project.details.map((detail) => `<li>${detail}</li>`).join("")}</ul></div>`;

    const slider = section.querySelector(".mv2-slider");
    const dots = section.querySelector(".mv2-slider-dots");
    project.media.forEach((item, index) => {
      slider.appendChild(createMediaFigure(item, index, project.media.length));
      const dot = document.createElement("button");
      dot.type = "button";
      dot.tabIndex = -1;
      dot.className = index === 0 ? "is-active" : "";
      dots.appendChild(dot);
    });
    if (project.media.length <= 1) dots.hidden = true;
    bindSlider(slider, dots);

    const toggle = section.querySelector(".mv2-details-toggle");
    const details = section.querySelector(".mv2-details");
    toggle.addEventListener("click", () => {
      const open = details.hidden;
      details.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
      toggle.querySelector("span").textContent = open ? "−" : "+";
      if (open && window.PortfolioAnalytics?.track) {
        window.PortfolioAnalytics.track("project_open", project.title, { source: "mobile_v2_details" });
      }
    });
    return section;
  }

  function buildHome(mode) {
    const main = document.createElement("main");
    main.className = "mv2-main mv2-home";
    const heroes = document.createElement("div");
    heroes.className = "mv2-heroes";
    heroes.append(createHero("professional"), createHero("motorsport"));
    main.appendChild(heroes);

    const projectShell = document.createElement("div");
    projectShell.className = "mv2-project-shell";
    ["professional", "motorsport"].forEach((projectMode) => {
      const group = document.createElement("div");
      group.className = "mv2-project-group";
      group.dataset.modeSection = projectMode;
      HOME_PROJECTS[projectMode].forEach((project) => group.appendChild(createProject(project)));
      if (projectMode === "professional") {
        const note = document.createElement("details");
        note.className = "mv2-public-note";
        note.innerHTML = `<summary>Public portfolio note <span>+</span></summary><p>${PUBLIC_NOTE}</p>`;
        note.addEventListener("toggle", () => note.querySelector("summary span").textContent = note.open ? "−" : "+");
        group.appendChild(note);
      }
      projectShell.appendChild(group);
    });
    main.appendChild(projectShell);
    return main;
  }

  function contactLink(label, href) {
    const a = document.createElement("a");
    a.href = href;
    a.textContent = label;
    if (/^https?:/.test(href)) { a.target = "_blank"; a.rel = "noopener"; }
    return a;
  }

  function createResumeCard(type) {
    const isMotorsport = type === "motorsport";
    const article = document.createElement("article");
    article.className = "mv2-resume-card";
    article.dataset.resumeType = type;
    const preview = isMotorsport ? "assets/files/Motorsport%20Resume%20Screenshot-960.webp" : "assets/files/CHP%20Resume%20Screenshot-960.webp";
    const pdf = isMotorsport ? "assets/files/Shaojie_Chen_Resume_Motorsport.pdf" : "assets/files/Shaojie_Chen_Resume_Microgrid_CHP.pdf";
    article.innerHTML = `
      <div class="mv2-resume-preview resume-preview-shell"><img loading="lazy" src="${preview}" alt="${isMotorsport ? "Motorsport" : "Energy Systems"} resume preview" /></div>
      <div class="mv2-resume-copy">
        <h2>${isMotorsport ? "Motorsport Resume" : "Energy Systems Resume"}</h2>
        <p>${isMotorsport ? "Active Aero · CAN · Vehicle Dynamics · Track Development" : "CHP · Microgrid · BESS · Controls · Validation"}</p>
        <a class="resume-open-button" href="${pdf}" target="_blank" rel="noopener">Open Resume ↗</a>
      </div>`;
    return article;
  }

  function orderResumeSlider(mode) {
    const slider = root?.querySelector(".mv2-resume-slider");
    if (!slider) return;
    const target = slider.querySelector(`[data-resume-type="${mode === "motorsport" ? "motorsport" : "professional"}"]`);
    requestAnimationFrame(() => {
      if (target) slider.scrollTo({ left: target.offsetLeft - slider.offsetLeft, behavior: "smooth" });
    });
  }

  function buildContact(mode) {
    const main = document.createElement("main");
    main.className = "mv2-main mv2-contact";
    const hero = document.createElement("section");
    hero.className = "mv2-contact-hero";
    hero.innerHTML = `
      <img class="mv2-contact-photo" src="${mode === "motorsport" ? "assets/img/background/Motorsport_background-1280.webp" : "assets/img/background/CHPMicrogrid_background-1280.webp"}" alt="Shaojie Chen" />
      <div class="mv2-contact-copy"><h1>Let’s connect.</h1><p>Engineering systems, motorsport development, and project collaboration.</p></div>
      <div class="mv2-contact-links"></div>`;
    const links = hero.querySelector(".mv2-contact-links");
    links.append(
      contactLink("Email", "mailto:cheerioov2@gmail.com"),
      contactLink("Phone", "tel:+13053105596"),
      contactLink("LinkedIn", "https://www.linkedin.com/in/shaojie-chen-332496206/")
    );
    main.appendChild(hero);

    const resumes = document.createElement("section");
    resumes.className = "mv2-resumes";
    resumes.id = "resumes";
    resumes.innerHTML = `<div class="mv2-section-title"><h2>Resume</h2><span>Swipe →</span></div><div class="mv2-resume-slider"></div>`;
    const slider = resumes.querySelector(".mv2-resume-slider");
    slider.append(createResumeCard("professional"), createResumeCard("motorsport"));
    main.appendChild(resumes);

    feedbackSection = document.getElementById("feedback");
    if (feedbackSection) {
      feedbackPlaceholder = document.createComment("mobile-v2-feedback-placeholder");
      feedbackSection.parentNode?.insertBefore(feedbackPlaceholder, feedbackSection);
      feedbackSection.classList.add("mv2-feedback");
      main.appendChild(feedbackSection);
    }
    return main;
  }

  function updateContactHero(mode) {
    const photo = root?.querySelector(".mv2-contact-photo");
    if (photo) photo.src = mode === "motorsport" ? "assets/img/background/Motorsport_background-1280.webp" : "assets/img/background/CHPMicrogrid_background-1280.webp";
  }

  function buildRoot() {
    const page = document.body.dataset.page;
    if (!MOBILE_PAGES.has(page)) return null;
    const mode = currentMode();
    const container = document.createElement("div");
    container.className = "mobile-v2-root";
    container.dataset.mode = mode;
    container.dataset.mobilePage = page;
    container.appendChild(createHeader(mode));
    container.appendChild(page === "home" ? buildHome(mode) : buildContact(mode));
    const footer = document.createElement("footer");
    footer.className = "mv2-footer";
    footer.textContent = "© 2026 Shaojie Chen.";
    container.appendChild(footer);
    return container;
  }

  function init() {
    if (initialized || !mq.matches || !MOBILE_PAGES.has(document.body?.dataset.page)) return;
    initialized = true;
    root = buildRoot();
    if (!root) return;
    document.body.classList.add("mobile-v2-active");
    document.body.prepend(root);
    const mode = currentMode();
    setMode(mode, false);
    if (document.body.dataset.page === "contact") {
      updateContactHero(mode);
      requestAnimationFrame(() => orderResumeSlider(mode));
    }
  }

  function teardown() {
    if (!initialized) return;
    initialized = false;
    if (feedbackSection && feedbackPlaceholder?.parentNode) {
      feedbackSection.classList.remove("mv2-feedback");
      feedbackPlaceholder.parentNode.insertBefore(feedbackSection, feedbackPlaceholder);
      feedbackPlaceholder.remove();
    }
    feedbackPlaceholder = null;
    feedbackSection = null;
    root?.remove();
    root = null;
    document.body.classList.remove("mobile-v2-active");
  }

  function sync() {
    if (mq.matches) init();
    else teardown();
  }

  document.addEventListener("click", (event) => {
    const button = event.target instanceof Element ? event.target.closest("[data-mobile-mode]") : null;
    if (!button || !root) return;
    const mode = button.dataset.mobileMode === "motorsport" ? "motorsport" : "professional";
    updateContactHero(mode);
  }, true);

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", sync, { once: true });
  else sync();
  if (typeof mq.addEventListener === "function") mq.addEventListener("change", sync);
  else if (typeof mq.addListener === "function") mq.addListener(sync);
})();
