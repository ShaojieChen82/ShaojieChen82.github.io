(() => {
  function loadMobileBundle() {
    if (!window.matchMedia("(max-width: 767px)").matches) return;

    if (!document.querySelector('script[data-mobile-v3-loader="true"]')) {
      const script = document.createElement("script");
      script.src = "assets/js/mobile-v3.js?v=4";
      script.dataset.mobileV3Loader = "true";
      document.head.appendChild(script);
    }

    if (!document.querySelector('script[data-mobile-bottom-nav-loader="true"]')) {
      const navScript = document.createElement("script");
      navScript.src = "assets/js/mobile-bottom-nav-v1.js?v=2";
      navScript.dataset.mobileBottomNavLoader = "true";
      document.head.appendChild(navScript);
    }
  }

  if (document.querySelector('script[data-mobile-device-gate="true"]')) {
    loadMobileBundle();
    return;
  }

  const gate = document.createElement("script");
  gate.src = "assets/js/mobile-device-gate-v1.js?v=1";
  gate.dataset.mobileDeviceGate = "true";
  gate.onload = loadMobileBundle;
  document.head.appendChild(gate);
})();
