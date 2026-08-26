(() => {
  function loadClassicScript(src) {
    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    document.head.appendChild(script);
  }

  const independentMobile = window.matchMedia("(max-width: 767px)").matches
    && ["home", "faq", "contact"].includes(document.body?.dataset.page || "");

  // Mobile v3 owns presentation/mode behavior on these pages, so avoid booting the
  // desktop portfolio DOM/media system there. Analytics remains global.
  if (!independentMobile) loadClassicScript("assets/js/site-core.js?v=17");
  loadClassicScript("assets/js/analytics.js?v=3");
})();
