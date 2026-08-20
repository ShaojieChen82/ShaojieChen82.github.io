(() => {
  const SESSION_KEY = "sc-portfolio-session";

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

  async function getApiBase() {
    try {
      const response = await fetch("assets/config/portfolio-api.json?v=1", { cache: "no-store" });
      if (!response.ok) return "";
      const config = await response.json();
      return String(config.apiBase || "").replace(/\/+$/, "");
    } catch (_) {
      return "";
    }
  }

  async function recordVisit() {
    const apiBase = await getApiBase();
    if (!apiBase) return;

    const payload = {
      sessionId: getSessionId(),
      page: location.pathname + location.search,
      referrer: document.referrer || "",
      language: navigator.language || "",
      screen: `${screen.width}x${screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      clientTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone || ""
    };

    try {
      await fetch(`${apiBase}/visit`, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify(payload),
        keepalive: true,
        cache: "no-store"
      });
    } catch (_) {
      // Analytics must never interfere with the portfolio experience.
    }
  }

  recordVisit();
})();
