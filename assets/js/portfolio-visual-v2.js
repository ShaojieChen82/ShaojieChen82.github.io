/* Portfolio bootstrap v7 — intentionally small so one hard refresh moves the site to the new layout system. */

(() => {
  function loadStylesheet(href, key) {
    if (document.querySelector(`link[data-portfolio-style="${key}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.dataset.portfolioStyle = key;
    document.head.appendChild(link);
  }

  function loadScript(src, key) {
    if (document.querySelector(`script[data-portfolio-script="${key}"]`)) return;
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.dataset.portfolioScript = key;
    document.head.appendChild(script);
  }

  loadStylesheet('assets/css/portfolio-showcase-v3.css?v=3', 'showcase-v3');
  loadStylesheet('assets/css/portfolio-v7.css?v=1', 'portfolio-v7');
  loadStylesheet('assets/css/c7-aero-tune-v1.css?v=1', 'c7-aero-tune-v1');
  loadStylesheet('assets/css/case-study-tune-v2.css?v=1', 'case-study-tune-v2');

  loadScript('assets/js/portfolio-v7.js?v=1', 'v7');
  loadScript('assets/js/c7-aero-tune-v1.js?v=1', 'c7-aero-tune-v1');
  loadScript('assets/js/case-study-tune-v3.js?v=1', 'case-study-tune-v3');
})();
