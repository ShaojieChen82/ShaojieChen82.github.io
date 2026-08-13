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

  loadStylesheet('assets/css/portfolio-showcase-v3.css?v=3', 'showcase-v3');
  loadStylesheet('assets/css/portfolio-v7.css?v=1', 'portfolio-v7');

  if (!document.querySelector('script[data-portfolio-script="v7"]')) {
    const script = document.createElement('script');
    script.src = 'assets/js/portfolio-v7.js?v=1';
    script.async = false;
    script.dataset.portfolioScript = 'v7';
    document.head.appendChild(script);
  }
})();
