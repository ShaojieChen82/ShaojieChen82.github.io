(() => {
  const mobileQuery = window.matchMedia("(max-width: 767px)");
  const MODE_KEY = "sc-portfolio-mode";
  let initialized = false;

  const capabilities = {
    professional: ["Controls", "Validation", "Remote Monitoring", "Thermal", "Power Electronics"],
    motorsport: ["Active Aero", "CAN / ESP32", "Instrumentation", "Track Data", "Fabrication"]
  };

  function requestedMode() {
    const param = new URLSearchParams(window.location.search).get("mode");
    if (param === "motorsport") return "motorsport";
    if (param === "chp" || param === "professional") return "professional";
    if (document.body.classList.contains("mode-motorsport")) return "motorsport";
    try {
      return localStorage.getItem(MODE_KEY) === "motorsport" ? "motorsport" : "professional";
    } catch (_) {
      return "professional";
    }
  }

  function modeParam(mode) {
    return mode === "motorsport" ? "motorsport" : "chp";
  }

  function buildMenu() {
    const header = document.querySelector(".site-header");
    const nav = header?.querySelector(".nav");
    if (!header || !nav || header.querySelector(".mobile-menu-button")) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "mobile-menu-button";
    button.setAttribute("aria-label", "Open navigation");
    button.setAttribute("aria-expanded", "false");
    button.innerHTML = "<span aria-hidden=\"true\"></span>";

    button.addEventListener("click", () => {
      const open = !document.body.classList.contains("mobile-nav-open");
      document.body.classList.toggle("mobile-nav-open", open);
      button.setAttribute("aria-expanded", String(open));
      button.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    });

    nav.addEventListener("click", (event) => {
      if (!event.target.closest("a")) return;
      document.body.classList.remove("mobile-nav-open");
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", "Open navigation");
    });

    header.appendChild(button);
  }

  function addSelectedWorkBars() {
    document.querySelectorAll(".home-showcase").forEach((section) => {
      if (section.querySelector(":scope > .mobile-section-bar")) return;
      const bar = document.createElement("div");
      bar.className = "mobile-section-bar";
      bar.dataset.mobileOnly = "true";
      bar.innerHTML = "<h2>Selected work</h2><span>Swipe to explore →</span>";
      const grid = section.querySelector(".visual-project-grid");
      if (grid) section.insertBefore(bar, grid);
    });
  }

  function buildQuickActions() {
    if (document.querySelector(".mobile-quick-actions")) return;

    const anchor = document.getElementById("motorsport-projects") || document.querySelector(".home-showcase:last-of-type");
    if (!anchor) return;

    const section = document.createElement("section");
    section.className = "mobile-quick-actions";
    section.dataset.mobileOnly = "true";
    section.innerHTML = `
      <h2>Capabilities</h2>
      <div class="mobile-capability-strip" aria-label="Key capabilities"></div>
      <div class="mobile-cta-grid">
        <a class="mobile-cta mobile-resume-link" href="contact.html#resumes">
          <strong>Resume</strong>
          <span>Experience and background</span>
          <b aria-hidden="true">→</b>
        </a>
        <a class="mobile-cta mobile-contact-link" href="contact.html">
          <strong>Contact</strong>
          <span>Get in touch</span>
          <b aria-hidden="true">→</b>
        </a>
      </div>`;

    anchor.insertAdjacentElement("afterend", section);
    updateQuickActions(requestedMode());
  }

  function updateQuickActions(mode) {
    const section = document.querySelector(".mobile-quick-actions");
    if (!section) return;

    const resolved = mode === "motorsport" ? "motorsport" : "professional";
    const strip = section.querySelector(".mobile-capability-strip");
    if (strip) {
      strip.replaceChildren(...capabilities[resolved].map((label) => {
        const pill = document.createElement("span");
        pill.textContent = label;
        return pill;
      }));
    }

    const param = modeParam(resolved);
    const resume = section.querySelector(".mobile-resume-link");
    const contact = section.querySelector(".mobile-contact-link");
    if (resume) {
      resume.href = `contact.html?mode=${param}#resumes`;
      resume.querySelector("strong").textContent = resolved === "motorsport" ? "Motorsport Resume" : "Energy Systems Resume";
    }
    if (contact) contact.href = `contact.html?mode=${param}`;
  }

  function addDetailToggles() {
    document.querySelectorAll(".case-study .visual-case-grid").forEach((grid, index) => {
      if (grid.querySelector(":scope > .mobile-detail-toggle")) return;
      const copy = grid.querySelector(":scope > .case-copy");
      if (!copy) return;

      const section = grid.closest(".case-study");
      const id = `mobile-case-details-${section?.id || index}`;
      copy.id = copy.id || id;

      const button = document.createElement("button");
      button.type = "button";
      button.className = "mobile-detail-toggle";
      button.dataset.mobileOnly = "true";
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-controls", copy.id);
      button.textContent = "Technical details";
      button.addEventListener("click", () => {
        const open = !grid.classList.contains("mobile-details-open");
        grid.classList.toggle("mobile-details-open", open);
        button.setAttribute("aria-expanded", String(open));
        button.textContent = open ? "Hide technical details" : "Technical details";
      });
      grid.appendChild(button);
    });
  }

  function addArchiveToggles() {
    document.querySelectorAll(".media-archive").forEach((archive) => {
      if (archive.querySelector(":scope > .mobile-archive-toggle")) return;
      const heading = archive.querySelector(":scope > .section-heading");
      if (!heading) return;

      const button = document.createElement("button");
      button.type = "button";
      button.className = "mobile-archive-toggle";
      button.dataset.mobileOnly = "true";
      button.setAttribute("aria-expanded", "false");
      button.textContent = "Browse full media archive";
      button.addEventListener("click", () => {
        const open = !archive.classList.contains("mobile-archive-open");
        archive.classList.toggle("mobile-archive-open", open);
        button.setAttribute("aria-expanded", String(open));
        button.textContent = open ? "Hide full media archive" : "Browse full media archive";
      });
      heading.insertAdjacentElement("afterend", button);
    });
  }

  function useMobileMotorsportHero() {
    const image = document.querySelector('.home-landing[data-mode-section="motorsport"] .hero-proof-main img');
    const caption = document.querySelector('.home-landing[data-mode-section="motorsport"] .hero-proof-main figcaption');
    if (!image || image.dataset.mobileHeroSwapped === "true") return;

    image.dataset.mobileHeroOriginalSrc = image.getAttribute("src") || "";
    image.dataset.mobileHeroOriginalAlt = image.getAttribute("alt") || "";
    image.dataset.mobileHeroSwapped = "true";
    image.setAttribute("src", "assets/img/motorsport/galleries/c7-track 1.jpg");
    image.setAttribute("alt", "C7 Grand Sport on track during development");

    if (caption) {
      const strong = caption.querySelector("strong");
      const span = caption.querySelector("span");
      if (strong) {
        strong.dataset.mobileOriginalText = strong.textContent;
        strong.textContent = "Track development";
      }
      if (span) {
        span.dataset.mobileOriginalText = span.textContent;
        span.textContent = "Build · control · measure · validate";
      }
    }
  }

  function restoreMotorsportHero() {
    const image = document.querySelector('.home-landing[data-mode-section="motorsport"] .hero-proof-main img');
    const caption = document.querySelector('.home-landing[data-mode-section="motorsport"] .hero-proof-main figcaption');
    if (!image || image.dataset.mobileHeroSwapped !== "true") return;

    image.setAttribute("src", image.dataset.mobileHeroOriginalSrc || image.getAttribute("src"));
    image.setAttribute("alt", image.dataset.mobileHeroOriginalAlt || "");
    delete image.dataset.mobileHeroOriginalSrc;
    delete image.dataset.mobileHeroOriginalAlt;
    delete image.dataset.mobileHeroSwapped;

    if (caption) {
      caption.querySelectorAll("[data-mobile-original-text]").forEach((node) => {
        node.textContent = node.dataset.mobileOriginalText || node.textContent;
        delete node.dataset.mobileOriginalText;
      });
    }
  }

  function bindModeUpdates() {
    document.querySelectorAll("[data-mode-target]").forEach((button) => {
      if (button.dataset.mobileModeBound === "true") return;
      button.dataset.mobileModeBound = "true";
      button.addEventListener("click", () => {
        const mode = button.dataset.modeTarget === "motorsport" ? "motorsport" : "professional";
        updateQuickActions(mode);
        document.body.classList.remove("mobile-nav-open");
        document.querySelector(".mobile-menu-button")?.setAttribute("aria-expanded", "false");
      });
    });
  }

  function init() {
    if (initialized || !mobileQuery.matches || document.body?.dataset.page !== "home") return;
    initialized = true;
    document.body.classList.add("mobile-home-enhanced");
    buildMenu();
    addSelectedWorkBars();
    buildQuickActions();
    addDetailToggles();
    addArchiveToggles();
    useMobileMotorsportHero();
    bindModeUpdates();
    updateQuickActions(requestedMode());
  }

  function teardown() {
    if (!initialized) return;
    initialized = false;
    document.body.classList.remove("mobile-home-enhanced", "mobile-nav-open");
    document.querySelectorAll("[data-mobile-only='true']").forEach((node) => node.remove());
    document.querySelectorAll(".mobile-details-open").forEach((node) => node.classList.remove("mobile-details-open"));
    document.querySelectorAll(".mobile-archive-open").forEach((node) => node.classList.remove("mobile-archive-open"));
    document.querySelectorAll("[data-mobile-mode-bound='true']").forEach((button) => delete button.dataset.mobileModeBound);
    restoreMotorsportHero();
  }

  function sync() {
    if (mobileQuery.matches) init();
    else teardown();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => requestAnimationFrame(sync), { once: true });
  } else {
    requestAnimationFrame(sync);
  }

  if (typeof mobileQuery.addEventListener === "function") mobileQuery.addEventListener("change", sync);
  else if (typeof mobileQuery.addListener === "function") mobileQuery.addListener(sync);
})();
