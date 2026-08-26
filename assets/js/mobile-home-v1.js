(() => {
  if (!window.matchMedia("(max-width: 767px)").matches) return;
  if (document.querySelector('script[data-mobile-v2-loader="true"]')) return;
  const script = document.createElement("script");
  script.src = "assets/js/mobile-v2.js?v=2";
  script.dataset.mobileV2Loader = "true";
  document.head.appendChild(script);
})();
