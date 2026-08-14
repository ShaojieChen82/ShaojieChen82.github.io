/* Layout tune v4 — precise Motorsport alignment, sensor crop, Build-gallery ordering. */

(() => {
  let sensorResizeObserver = null;

  function alignSensorFeature() {
    const section = document.querySelector('body.mode-motorsport[data-page="home"] #sensors');
    const left = section?.querySelector('.case-left-v2');
    const support = left?.querySelector('.case-left-support-v2');
    const feature = section?.querySelector('.case-feature-v2');
    if (!left || !feature) return;

    if (window.innerWidth <= 1000) {
      feature.style.removeProperty('height');
      return;
    }

    /* Exact visual alignment, not a percentage crop:
       - top of the main visual stays aligned with the title/story column
       - bottom of the main visual lands on the bottom of the two small support cards
       - object-position: bottom keeps the useful lower portion while the necessary crop
         comes from the top of the main image. */
    const featureTop = feature.getBoundingClientRect().top;
    const targetBottom = (support || left).getBoundingClientRect().bottom;
    const targetHeight = Math.round(targetBottom - featureTop);

    if (targetHeight > 100) feature.style.height = `${targetHeight}px`;
  }

  function observeSensorGeometry() {
    if (!("ResizeObserver" in window)) return;

    const section = document.querySelector('#sensors');
    const left = section?.querySelector('.case-left-v2');
    const support = left?.querySelector('.case-left-support-v2');
    if (!left) return;

    sensorResizeObserver?.disconnect();
    sensorResizeObserver = new ResizeObserver(() => requestAnimationFrame(alignSensorFeature));
    sensorResizeObserver.observe(left);
    if (support) sensorResizeObserver.observe(support);
  }

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

    /* Stable partition: keep the existing story order inside each group, but move all
       non-carbon build/fitting/front-aero evidence ahead of the carbon-fabrication sequence. */
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
        /* Run after the existing mode-switch handler. Clear any project hash so the
           newly selected home mode always starts at the hero instead of an old anchor. */
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

  function bindSensorMediaEvents() {
    document.querySelectorAll('#sensors .case-left-support-v2 img, #sensors .case-left-support-v2 video').forEach((media) => {
      if (media.dataset.sensorAlignV4 === '1') return;
      media.dataset.sensorAlignV4 = '1';
      media.addEventListener('load', () => requestAnimationFrame(alignSensorFeature));
      media.addEventListener('loadedmetadata', () => requestAnimationFrame(alignSensorFeature));
    });
  }

  function apply() {
    alignSensorFeature();
    observeSensorGeometry();
    bindSensorMediaEvents();
    reorderBuildGallery();
    installHomeModeTopBehavior();
  }

  function init() {
    requestAnimationFrame(() => requestAnimationFrame(apply));
    document.fonts?.ready?.then(() => requestAnimationFrame(alignSensorFeature));
    window.addEventListener('resize', () => requestAnimationFrame(alignSensorFeature), { passive: true });

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
