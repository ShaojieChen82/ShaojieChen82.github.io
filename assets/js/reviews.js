(() => {
  const form = document.getElementById("review-form");
  const statusEl = document.getElementById("review-form-status");
  if (!form || !statusEl) return;

  const submitButton = form.querySelector("button[type='submit']");
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

  async function initialize() {
    const apiBase = await getApiBase();
    if (!apiBase) {
      submitButton.disabled = true;
      statusEl.textContent = "Feedback service is being configured.";
      return;
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const data = new FormData(form);
      const payload = {
        name: String(data.get("name") || "").trim(),
        email: String(data.get("email") || "").trim(),
        comment: String(data.get("comment") || "").trim(),
        company: String(data.get("company") || "").trim(),
        page: location.pathname + location.search,
        referrer: document.referrer || "",
        language: navigator.language || "",
        screen: `${screen.width}x${screen.height}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        clientTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
        sessionId: getSessionId()
      };

      submitButton.disabled = true;
      statusEl.textContent = "Sending…";

      try {
        const response = await fetch(`${apiBase}/feedback`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload)
        });

        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || `HTTP ${response.status}`);

        form.reset();
        statusEl.textContent = "Thank you — your feedback was submitted.";
      } catch (error) {
        console.error("Unable to submit feedback", error);
        statusEl.textContent = "Unable to submit right now. Please try again.";
      } finally {
        submitButton.disabled = false;
      }
    });
  }

  initialize();
})();
