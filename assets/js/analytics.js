(() => {
  const SESSION_KEY = "sc-portfolio-session";
  const VISITOR_KEY = "sc-portfolio-visitor";
  const ATTRIBUTION_KEY = "sc-portfolio-attribution";
  let apiBasePromise = null;
  let feedbackStarted = false;
  let scrollTicking = false;
  let activeVisibleMs = 0;
  let visibleStartedAt = document.visibilityState === "visible" ? performance.now() : null;
  const sentScrollMilestones = new Set();
  const videoState = new WeakMap();

  function getSessionId() {
    try {
      let id = sessionStorage.getItem(SESSION_KEY);
      if (!id) {
        id = crypto.randomUUID();
        sessionStorage.setItem(SESSION_KEY, id);
      }
      return id;
    } catch (_) {
      return crypto.randomUUID();
    }
  }

  function getVisitorId() {
    try {
      let id = localStorage.getItem(VISITOR_KEY);
      if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem(VISITOR_KEY, id);
      }
      return id;
    } catch (_) {
      try {
        let id = sessionStorage.getItem(VISITOR_KEY);
        if (!id) {
          id = crypto.randomUUID();
          sessionStorage.setItem(VISITOR_KEY, id);
        }
        return id;
      } catch (_) {
        return crypto.randomUUID();
      }
    }
  }

  function getAttribution() {
    try {
      const existing = sessionStorage.getItem(ATTRIBUTION_KEY);
      if (existing) return JSON.parse(existing);

      const params = new URLSearchParams(location.search);
      const attribution = {
        utmSource: params.get("utm_source") || "",
        utmMedium: params.get("utm_medium") || "",
        utmCampaign: params.get("utm_campaign") || "",
        utmContent: params.get("utm_content") || "",
        utmTerm: params.get("utm_term") || "",
        landingPage: location.pathname + location.search,
        landingReferrer: document.referrer || ""
      };
      sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
      return attribution;
    } catch (_) {
      return {
        utmSource: "",
        utmMedium: "",
        utmCampaign: "",
        utmContent: "",
        utmTerm: "",
        landingPage: location.pathname + location.search,
        landingReferrer: document.referrer || ""
      };
    }
  }

  async function getApiBase() {
    if (!apiBasePromise) {
      apiBasePromise = (async () => {
        try {
          const response = await fetch("assets/config/portfolio-api.json?v=1", { cache: "no-store" });
          if (!response.ok) return "";
          const config = await response.json();
          return String(config.apiBase || "").replace(/\/+$/, "");
        } catch (_) {
          return "";
        }
      })();
    }
    return apiBasePromise;
  }

  function commonPayload() {
    const attribution = getAttribution();
    return {
      sessionId: getSessionId(),
      visitorId: getVisitorId(),
      page: location.pathname + location.search,
      referrer: document.referrer || "",
      language: navigator.language || "",
      screen: `${screen.width}x${screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      clientTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
      utmSource: attribution.utmSource,
      utmMedium: attribution.utmMedium,
      utmCampaign: attribution.utmCampaign,
      utmContent: attribution.utmContent,
      utmTerm: attribution.utmTerm
    };
  }

  async function post(path, payload) {
    const apiBase = await getApiBase();
    if (!apiBase) return false;

    try {
      const response = await fetch(`${apiBase}${path}`, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify(payload),
        keepalive: true,
        cache: "no-store"
      });
      return response.ok;
    } catch (_) {
      return false;
    }
  }

  function trackEvent(eventName, eventTarget = "", eventData = {}) {
    return post("/event", {
      ...commonPayload(),
      eventName,
      eventTarget,
      eventData
    });
  }

  function recordVisit() {
    return post("/visit", commonPayload());
  }

  function textLabel(element) {
    return String(
      element?.getAttribute?.("aria-label") ||
      element?.textContent ||
      ""
    ).trim().replace(/\s+/g, " ").slice(0, 180);
  }

  function relativeHref(anchor) {
    const raw = anchor.getAttribute("href") || "";
    try {
      const url = new URL(raw, location.href);
      if (url.origin === location.origin) return `${url.pathname}${url.search}${url.hash}`;
      return `${url.hostname}${url.pathname}`;
    } catch (_) {
      return raw.slice(0, 300);
    }
  }

  function mediaTarget(node) {
    const figure = node.closest("figure");
    const caption = figure?.querySelector("figcaption")?.textContent?.trim();
    if (caption) return caption.slice(0, 300);
    const alt = node.getAttribute?.("alt");
    if (alt) return alt.slice(0, 300);
    const src = node.currentSrc || node.src || "";
    try {
      return decodeURIComponent(new URL(src, location.href).pathname.split("/").pop() || "").slice(0, 300);
    } catch (_) {
      return String(src).slice(0, 300);
    }
  }

  function classifyClick(event) {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    const modeButton = target.closest("[data-mode-target]");
    if (modeButton) {
      trackEvent("mode_switch", modeButton.dataset.modeTarget || "", {
        label: textLabel(modeButton)
      });
      return;
    }

    const project = target.closest(".home-project-link");
    if (project) {
      const heading = project.querySelector("h3")?.textContent?.trim() || "";
      trackEvent("project_open", heading || relativeHref(project), {
        href: relativeHref(project)
      });
      return;
    }

    const resume = target.closest(".resume-open-button");
    if (resume) {
      trackEvent("resume_open", textLabel(resume), {
        href: relativeHref(resume)
      });
      return;
    }

    const image = target.closest(".media-card img, .dock-item img, .hero-proof img, .resume-preview-shell img");
    if (image) {
      const rawSrc = image.getAttribute("src") || "";
      trackEvent("media_open", mediaTarget(image), { src: rawSrc.slice(0, 300) });
      return;
    }

    const anchor = target.closest("a");
    if (anchor) {
      const href = anchor.getAttribute("href") || "";
      const label = textLabel(anchor);
      if (/^mailto:/i.test(href)) {
        trackEvent("email_click", "contact_email", { label });
        return;
      }
      if (/^tel:/i.test(href)) {
        trackEvent("phone_click", "contact_phone", { label });
        return;
      }

      try {
        const url = new URL(href, location.href);
        if (/linkedin\.com$/i.test(url.hostname) || /\.linkedin\.com$/i.test(url.hostname)) {
          trackEvent("linkedin_click", "linkedin", { label, href: `${url.hostname}${url.pathname}` });
          return;
        }
      } catch (_) {}

      trackEvent("link_click", label || relativeHref(anchor), {
        href: relativeHref(anchor)
      });
      return;
    }

    const button = target.closest("button");
    if (button && !button.closest("#review-form")) {
      trackEvent("button_click", textLabel(button), {
        id: button.id || "",
        className: String(button.className || "").slice(0, 300)
      });
    }
  }

  function initFeedbackTracking() {
    document.addEventListener("focusin", (event) => {
      if (feedbackStarted) return;
      const target = event.target instanceof Element ? event.target : null;
      if (!target?.closest("#review-form")) return;
      feedbackStarted = true;
      trackEvent("feedback_start", "contact_feedback_form");
    });
  }

  function initScrollTracking() {
    function evaluateScroll() {
      scrollTicking = false;
      const root = document.documentElement;
      const scrollable = Math.max(1, root.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / scrollable));

      [50, 100].forEach((milestone) => {
        if (progress >= milestone / 100 && !sentScrollMilestones.has(milestone)) {
          sentScrollMilestones.add(milestone);
          trackEvent(`scroll_${milestone}`, `${milestone}%`);
        }
      });
    }

    window.addEventListener("scroll", () => {
      if (scrollTicking) return;
      scrollTicking = true;
      requestAnimationFrame(evaluateScroll);
    }, { passive: true });

    evaluateScroll();
  }

  function getVideoState(video) {
    let state = videoState.get(video);
    if (!state) {
      state = { played: false, milestones: new Set(), completed: false };
      videoState.set(video, state);
    }
    return state;
  }

  function initVideoTracking() {
    document.addEventListener("play", (event) => {
      const video = event.target;
      if (!(video instanceof HTMLVideoElement)) return;
      const state = getVideoState(video);
      if (state.played) return;
      state.played = true;
      trackEvent("video_play", mediaTarget(video));
    }, true);

    document.addEventListener("timeupdate", (event) => {
      const video = event.target;
      if (!(video instanceof HTMLVideoElement)) return;
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;

      const state = getVideoState(video);
      const progress = (video.currentTime / video.duration) * 100;
      [25, 50, 75].forEach((milestone) => {
        if (progress >= milestone && !state.milestones.has(milestone)) {
          state.milestones.add(milestone);
          trackEvent(`video_${milestone}`, mediaTarget(video), {
            progressPercent: milestone
          });
        }
      });
    }, true);

    document.addEventListener("ended", (event) => {
      const video = event.target;
      if (!(video instanceof HTMLVideoElement)) return;
      const state = getVideoState(video);
      if (state.completed) return;
      state.completed = true;
      trackEvent("video_complete", mediaTarget(video), {
        progressPercent: 100
      });
    }, true);
  }

  function flushVisibleTime() {
    if (visibleStartedAt !== null) {
      activeVisibleMs += Math.max(0, performance.now() - visibleStartedAt);
      visibleStartedAt = null;
    }
  }

  function initEngagementTime() {
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        if (visibleStartedAt === null) visibleStartedAt = performance.now();
      } else {
        flushVisibleTime();
      }
    });

    window.addEventListener("pagehide", () => {
      flushVisibleTime();
      trackEvent("page_exit", "page", {
        activeSeconds: Math.round(activeVisibleMs / 1000)
      });
    });
  }

  window.PortfolioAnalytics = {
    track: trackEvent,
    sessionId: getSessionId,
    visitorId: getVisitorId
  };

  document.addEventListener("click", classifyClick, true);
  initFeedbackTracking();
  initScrollTracking();
  initVideoTracking();
  initEngagementTime();
  recordVisit();
})();
