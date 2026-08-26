(() => {
  const PHONE_SHORT_EDGE_MAX = 560;
  const MOBILE_QUERY = "(max-width: 767px)";
  const nativeMatchMedia = window.matchMedia.bind(window);
  const syntheticMqls = new Set();

  function readScreenSize() {
    const width = Number(window.screen?.width) || Number(window.innerWidth) || 0;
    const height = Number(window.screen?.height) || Number(window.innerHeight) || 0;
    return {
      width,
      height,
      shortEdge: Math.min(width, height),
      longEdge: Math.max(width, height)
    };
  }

  function isTouchDevice() {
    return (navigator.maxTouchPoints || 0) > 0 || nativeMatchMedia("(pointer: coarse)").matches;
  }

  function isPhoneLayout() {
    const size = readScreenSize();
    const ua = navigator.userAgent || "";
    const uaMobile = navigator.userAgentData?.mobile === true || /iPhone|iPod|Windows Phone|Android.+Mobile/i.test(ua);

    // Width is the primary discriminator. Orientation does not matter because
    // the device short edge stays the same when a phone rotates.
    const phoneSized = size.shortEdge > 0 && size.shortEdge <= PHONE_SHORT_EDGE_MAX;
    return uaMobile || (phoneSized && isTouchDevice());
  }

  function createSyntheticMql(query) {
    const listeners = new Set();
    const legacyListeners = new Set();
    const mql = {
      media: query,
      get matches() { return isPhoneLayout(); },
      onchange: null,
      addEventListener(type, callback) {
        if (type === "change" && typeof callback === "function") listeners.add(callback);
      },
      removeEventListener(type, callback) {
        if (type === "change") listeners.delete(callback);
      },
      addListener(callback) {
        if (typeof callback === "function") legacyListeners.add(callback);
      },
      removeListener(callback) { legacyListeners.delete(callback); },
      dispatchEvent(event) {
        listeners.forEach((callback) => callback.call(mql, event));
        legacyListeners.forEach((callback) => callback.call(mql, event));
        if (typeof mql.onchange === "function") mql.onchange.call(mql, event);
        return true;
      },
      _notify() {
        const event = { matches: mql.matches, media: query };
        mql.dispatchEvent(event);
      }
    };
    syntheticMqls.add(mql);
    return mql;
  }

  window.matchMedia = function patchedMatchMedia(query) {
    if (String(query).trim() === MOBILE_QUERY) return createSyntheticMql(MOBILE_QUERY);
    return nativeMatchMedia(query);
  };

  function patchMediaRules(sheet) {
    if (!sheet) return;
    let rules;
    try { rules = sheet.cssRules; } catch (_) { return; }
    if (!rules) return;

    [...rules].forEach((rule) => {
      if (rule.type === CSSRule.IMPORT_RULE && rule.styleSheet) {
        patchMediaRules(rule.styleSheet);
        return;
      }
      if (rule.type === CSSRule.MEDIA_RULE) {
        if (/max-width\s*:\s*767px/i.test(rule.conditionText || rule.media?.mediaText || "")) {
          try { rule.media.mediaText = "all"; } catch (_) {}
        }
        [...(rule.cssRules || [])].forEach((nested) => {
          if (nested.type === CSSRule.MEDIA_RULE && /max-width\s*:\s*767px/i.test(nested.conditionText || nested.media?.mediaText || "")) {
            try { nested.media.mediaText = "all"; } catch (_) {}
          }
        });
      }
    });
  }

  function applyDeviceClassAndStyles() {
    const phone = isPhoneLayout();
    const size = readScreenSize();
    const html = document.documentElement;

    html.classList.toggle("sc-phone-layout", phone);
    html.classList.toggle("sc-tablet-desktop-layout", !phone && isTouchDevice() && size.shortEdge >= 600);
    html.dataset.deviceShortEdge = String(Math.round(size.shortEdge || 0));
    html.dataset.deviceLongEdge = String(Math.round(size.longEdge || 0));

    document.querySelectorAll('link[rel="stylesheet"][href*="assets/css/mobile-"]').forEach((link) => {
      link.media = phone ? "all" : "not all";
      if (phone) {
        const patch = () => patchMediaRules(link.sheet);
        patch();
        link.addEventListener("load", patch, { once: true });
      }
    });

    if (phone) {
      requestAnimationFrame(() => {
        document.querySelectorAll('link[rel="stylesheet"][href*="assets/css/mobile-"]').forEach((link) => patchMediaRules(link.sheet));
      });
    }
  }

  let lastPhoneState = isPhoneLayout();
  function handleViewportChange() {
    const next = isPhoneLayout();
    applyDeviceClassAndStyles();
    if (next !== lastPhoneState) {
      lastPhoneState = next;
      syntheticMqls.forEach((mql) => mql._notify());
    }
  }

  applyDeviceClassAndStyles();
  window.addEventListener("orientationchange", () => setTimeout(handleViewportChange, 120), { passive: true });
  window.addEventListener("resize", () => setTimeout(handleViewportChange, 80), { passive: true });
})();
