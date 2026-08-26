(() => {
  if (!window.matchMedia("(max-width: 767px)").matches) return;
  if (document.querySelector('script[data-mobile-v3-loader="true"]')) return;
  const script = document.createElement("script");
  script.src = "assets/js/mobile-v3.js?v=3";
  script.dataset.mobileV3Loader = "true";
  document.head.appendChild(script);
})();
