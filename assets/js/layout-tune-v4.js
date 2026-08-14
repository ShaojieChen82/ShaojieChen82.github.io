/* Layout tune v4 — precise Motorsport alignment, sensor crop, Build-gallery ordering. */

(() => {
  function cropSensorFeature() {
    const section = document.querySelector('body.mode-motorsport[data-page="home"] #sensors');
    const left = section?.querySelector('.case-left-v2');
    const feature = section?.querySelector('.case-feature-v2');
    if (!left || !feature) return;

    if (window.innerWidth <= 1000) {
      feature.style.removeProperty('height');
      return;
    }

    /* The old feature matched the complete left-story height. Show 75% of that height,
       with CSS anchoring the media to the bottom so the removed area comes from the top. */
    const leftHeight = left.getBoundingClientRect().height;
    if (leftHeight > 0) feature.style.height = `${Math.round(leftHeight * 0.75)}px`;
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

  function apply() {
    cropSensorFeature();
    reorderBuildGallery();
  }

  function init() {
    requestAnimationFrame(() => requestAnimationFrame(apply));
    window.addEventListener('resize', () => requestAnimationFrame(cropSensorFeature), { passive: true });

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
