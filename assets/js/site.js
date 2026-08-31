(() => {
  const CHINA_MIRROR_SUFFIXES = [
    "tcloudbaseapp.com",
    "app.tcloudbase.com",
    "run.tcloudbase.com"
  ];

  function isChinaMirrorHost() {
    const host = String(location.hostname || "").toLowerCase();
    return CHINA_MIRROR_SUFFIXES.some((suffix) =>
      host === suffix || host.endsWith(`.${suffix}`)
    );
  }

  function installChinaMirrorVideoFallbacks() {
    if (!isChinaMirrorHost()) return;

    const replacements = [
      "assets/img/motorsport/galleries/testing active aero on track gingerman.web.mp4",
      "assets/img/motorsport/galleries/testing full active aero on track grattan.web.mp4"
    ];
    document.querySelectorAll(".youtube-embed iframe").forEach((iframe, index) => {
      const source = replacements[index];
      if (!source) return;
      const video = document.createElement("video");
      video.controls = true;
      video.playsInline = true;
      video.preload = "metadata";
      video.setAttribute("aria-label", iframe.title || `On-track development video ${index + 1}`);
      const sourceElement = document.createElement("source");
      sourceElement.src = source;
      sourceElement.type = "video/mp4";
      video.appendChild(sourceElement);
      iframe.replaceWith(video);
    });
  }

  function installChinaMirrorApiRouter() {
    if (!isChinaMirrorHost() || window.__PORTFOLIO_CHINA_API_ROUTER__) return;

    const nativeFetch = window.fetch.bind(window);
    const globalApiHost = "portfolio-api.cheerioov2.workers.dev";

    window.fetch = function routedPortfolioFetch(input, init) {
      try {
        const raw = input instanceof Request ? input.url : String(input);
        const original = new URL(raw, location.href);

        if (original.hostname === globalApiHost) {
          const local = new URL(location.origin);
          local.pathname = `/portfolio-api${original.pathname}`.replace(/\/{2,}/g, "/");
          local.search = original.search;

          // Current portfolio API calls use URL strings. Preserve Request-based callers too.
          if (input instanceof Request) {
            const method = input.method || "GET";
            const requestInit = {
              method,
              headers: input.headers,
              credentials: input.credentials,
              cache: input.cache,
              redirect: input.redirect,
              referrer: input.referrer,
              referrerPolicy: input.referrerPolicy,
              integrity: input.integrity,
              keepalive: input.keepalive,
              signal: input.signal,
              ...init
            };
            if (method !== "GET" && method !== "HEAD" && !requestInit.body) {
              requestInit.body = input.body;
            }
            return nativeFetch(local.toString(), requestInit);
          }

          return nativeFetch(local.toString(), init);
        }
      } catch (_) {
        // Fall back to the browser's normal fetch behavior.
      }

      return nativeFetch(input, init);
    };

    window.__PORTFOLIO_CHINA_API_ROUTER__ = true;
    window.__PORTFOLIO_CHINA_MIRROR__ = true;
    document.documentElement.dataset.deliveryRegion = "china-mirror";
  }

  function loadClassicScript(src) {
    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    document.head.appendChild(script);
  }

  // Must be installed synchronously before analytics/reviews make API requests.
  installChinaMirrorApiRouter();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", installChinaMirrorVideoFallbacks, { once: true });
  } else {
    installChinaMirrorVideoFallbacks();
  }

  const independentMobile = window.matchMedia("(max-width: 767px)").matches
    && ["home", "faq", "contact"].includes(document.body?.dataset.page || "");

  // Mobile v3 owns presentation/mode behavior on these pages, so avoid booting the
  // desktop portfolio DOM/media system there. Analytics remains global.
  if (!independentMobile) loadClassicScript("assets/js/site-core.js?v=17");
  loadClassicScript("assets/js/analytics.js?v=3");
})();
