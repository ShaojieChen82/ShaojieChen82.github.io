/* Layout tune v4 — precise Motorsport alignment, Build-gallery ordering, home mode behavior. */

(() => {
  function mediaPath(card) {
    const media = card.querySelector('img, video');
    if (!media) return '';
    const raw = media.currentSrc || media.querySelector?.('source')?.src || media.src || '';
    try {
      return decodeURIComponent(new URL(raw, window.location.href).pathname).toLowerCase();
    } catch (_) {
      return String(raw).toLowerCase();
    }
  }

  function isCarbonFabrication(path) {
    return (
      path.includes('carbon') ||
      path.includes('cabon') ||
      path.includes('vaccum bag carbonfiber') ||
      path.includes('vacuum bag carbonfiber') ||
      path.includes('clear coating the wing')
    );
  }

  function reorderBuildGallery() {
    const rail = document.querySelector('.media-archive [data-media-group="archiveAero"]');
    if (!rail || rail.dataset.buildOrderV4 === '1') return;

    const cards = Array.from(rail.querySelectorAll(':scope > .dock-item'));
    if (cards.length < 2) return;

    const generalBuild = [];
    const carbonFab = [];

    cards.forEach((card) => {
      (isCarbonFabrication(mediaPath(card)) ? carbonFab : generalBuild).push(card);
    });

    [...generalBuild, ...carbonFab].forEach((card) => rail.appendChild(card));
    rail.dataset.buildOrderV4 = '1';
    rail.__updateButtonsV7?.();

    if (typeof MEDIA_GROUPS !== 'undefined' && Array.isArray(MEDIA_GROUPS.archiveAero)) {
      const generalPaths = [];
      const carbonPaths = [];
      MEDIA_GROUPS.archiveAero.forEach((path) => {
        (isCarbonFabrication(String(path).toLowerCase()) ? carbonPaths : generalPaths).push(path);
      });
      MEDIA_GROUPS.archiveAero = [...generalPaths, ...carbonPaths];
    }
  }

  function installHomeModeTopBehavior() {
    if (document.body.dataset.page !== 'home') return;

    document.querySelectorAll('[data-mode-target]').forEach((button) => {
      if (button.dataset.modeTopV4 === '1') return;
      button.dataset.modeTopV4 = '1';

      button.addEventListener('click', () => {
        requestAnimationFrame(() => {
          const url = new URL(window.location.href);
          if (url.hash) {
            url.hash = '';
            window.history.replaceState({}, '', `${url.pathname}${url.search}`);
          }
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        });
      });
    });
  }

  function apply() {
    /* Sensor-section height is intentionally CSS-only now. The grid row is sized
       by the left story/support stack and the main media stretches to that exact edge. */
    document.querySelector('#sensors .case-feature-v2')?.style.removeProperty('height');
    reorderBuildGallery();
    installHomeModeTopBehavior();
  }

  function init() {
    requestAnimationFrame(() => requestAnimationFrame(apply));

    if ('MutationObserver' in window) {
      const observer = new MutationObserver(() => requestAnimationFrame(apply));
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'data-mode', 'data-case-tune'],
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
