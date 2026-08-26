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

  function mount(root) {
    if (!root || root.querySelector(".mv3-bottom-nav")) return;

    root.classList.remove("menu-open");
    root.querySelectorAll(".mv3-menu-button, .mv3-menu, .mv3-menu-backdrop, .mv3-header-spacer")
      .forEach((element) => element.remove());

    const nav = document.createElement("nav");
    nav.className = "mv3-bottom-nav";
    nav.setAttribute("aria-label", "Primary mobile navigation");
    nav.innerHTML = `
      <a href="#" data-bottom-page="home">Home</a>
      <a href="#" data-bottom-page="faq">FAQ</a>
      <a href="#" data-bottom-page="contact">Contact</a>`;

    root.appendChild(nav);
    updateNav(root, nav);

    const modeObserver = new MutationObserver(() => updateNav(root, nav));
    modeObserver.observe(root, { attributes: true, attributeFilter: ["data-mode"] });
  }

  function scan() {
    const root = document.querySelector(".mobile-v3-root");
    if (root) mount(root);
  }

  function boot() {
    scan();
    const observer = new MutationObserver(scan);
    observer.observe(document.body, { childList: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
