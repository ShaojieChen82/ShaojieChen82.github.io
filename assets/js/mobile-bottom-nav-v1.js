(() => {
  const mq = window.matchMedia("(max-width: 767px)");
  if (!mq.matches) return;

  const pageToPath = {
    home: "index.html",
    faq: "faq.html",
    contact: "contact.html"
  };

  function currentMode(root) {
    const mode = root?.dataset?.mode;
    if (mode === "motorsport") return "motorsport";
    return "professional";
  }

  function modeParam(mode) {
    return mode === "motorsport" ? "motorsport" : "chp";
  }

  function modeHref(path, mode) {
    const url = new URL(path, location.href);
    url.searchParams.set("mode", modeParam(mode));
    return `${url.pathname.split("/").pop() || "index.html"}?${url.searchParams.toString()}`;
  }

  function updateNav(root, nav) {
    const mode = currentMode(root);
    const currentPage = document.body?.dataset?.page || "home";
    nav.querySelectorAll("a[data-bottom-page]").forEach((link) => {
      const page = link.dataset.bottomPage;
      link.href = modeHref(pageToPath[page], mode);
      const active = page === currentPage;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  function polishFAQ(root) {
    if (document.body?.dataset?.page !== "faq") return;
    const paragraph = root?.querySelector(".mv3-faq-card:first-child p");
    if (!paragraph || paragraph.dataset.mobileAligned === "true") return;
    paragraph.dataset.mobileAligned = "true";
    paragraph.className = "mv3-background-lines";
    paragraph.innerHTML = `
      <span class="mv3-background-line"><strong>Shanghai, China</strong><span>— born and raised.</span></span>
      <span class="mv3-background-line"><strong>Miami, FL</strong><span>— B.S. and M.S. in Mechanical Engineering at the University of Miami.</span></span>
      <span class="mv3-background-line"><strong>Detroit, MI</strong><span>— engineering work at Enginuity Power Systems.</span></span>`;
  }

  function mount(root) {
    if (!root) return;

    root.classList.remove("menu-open");
    root.querySelectorAll(".mv3-menu-button, .mv3-menu, .mv3-menu-backdrop, .mv3-header-spacer")
      .forEach((element) => element.remove());

    let nav = root.querySelector(".mv3-bottom-nav");
    if (!nav) {
      nav = document.createElement("nav");
      nav.className = "mv3-bottom-nav";
      nav.setAttribute("aria-label", "Primary mobile navigation");
      nav.innerHTML = `
        <a href="#" data-bottom-page="home">Home</a>
        <a href="#" data-bottom-page="faq">FAQ</a>
        <a href="#" data-bottom-page="contact">Contact</a>`;
      root.appendChild(nav);

      const modeObserver = new MutationObserver(() => updateNav(root, nav));
      modeObserver.observe(root, { attributes: true, attributeFilter: ["data-mode"] });
    }

    updateNav(root, nav);
    polishFAQ(root);
  }

  function scan() {
    const root = document.querySelector(".mobile-v3-root");
    if (root) mount(root);
  }

  function boot() {
    scan();
    const observer = new MutationObserver(scan);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
