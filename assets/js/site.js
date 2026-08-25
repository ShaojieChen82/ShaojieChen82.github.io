(() => {
  function loadClassicScript(src) {
    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    document.head.appendChild(script);
  }

  // Preserve the existing portfolio behavior unchanged, then add analytics as a separate module.
  loadClassicScript("assets/js/site-core.js?v=17");
  loadClassicScript("assets/js/analytics.js?v=3");
})();
