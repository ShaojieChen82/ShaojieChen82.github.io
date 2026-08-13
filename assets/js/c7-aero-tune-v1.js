/* C7 Active Aero case-study tuning v1
   Runs after portfolio-v7 has created the generic case-study layout. */

(() => {
  const C7_AERO_MEDIA = [
    "assets/img/motorsport/galleries/fitting the real aluminum bracket and wing 1.JPG",
    "assets/img/motorsport/galleries/carbon cloth wrapping the 3d printing core prep 3.JPG",
    "assets/img/motorsport/galleries/fitting the real aluminum bracket and wing 2.JPG",
    "assets/img/motorsport/galleries/prototype of active wing carbon fiber wing + aluminum post + plastic braket.JPG",
    "assets/img/motorsport/galleries/testing front ramp while front bumper disassembled (underneath car).mp4",
    "assets/img/motorsport/galleries/using high pressure water to test the aerodynamics of the front ramp 1.mp4",
    "assets/img/motorsport/galleries/me standing on my active wing (showing wing strength).jpg",
  ];

  const C7_AERO_TITLES = {
    "fitting the real aluminum bracket and wing 1.JPG": "Final aluminum bracket and wing fitment — view 1",
    "carbon cloth wrapping the 3d printing core prep 3.JPG": "Carbon-fiber layup preparation",
    "fitting the real aluminum bracket and wing 2.JPG": "Final aluminum bracket and wing fitment — view 2",
    "prototype of active wing carbon fiber wing + aluminum post + plastic braket.JPG": "Prototype active-wing assembly: composite wing, aluminum post, and bracket",
    "testing front ramp while front bumper disassembled (underneath car).mp4": "Front-ramp actuation test — under-car view",
    "using high pressure water to test the aerodynamics of the front ramp 1.mp4": "Front-ramp flow visualization test",
    "me standing on my active wing (showing wing strength).jpg": "Active-wing structural load demonstration",
  };

  function configureVideos(scope) {
    scope.querySelectorAll('video').forEach((video) => {
      video.muted = true;
      video.defaultMuted = true;
      video.loop = true;
      video.autoplay = true;
      video.playsInline = true;
      video.controls = false;
      video.removeAttribute('controls');
      video.setAttribute('muted', '');
      video.setAttribute('autoplay', '');
      video.setAttribute('loop', '');
      video.setAttribute('playsinline', '');
      video.play().catch(() => {});
    });
  }

  function addVideoExpandButtons(scope) {
    scope.querySelectorAll('.media-card video').forEach((video) => {
      const card = video.closest('.media-card');
      if (!card || card.querySelector(':scope > .media-expand-button')) return;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'media-expand-button media-expand-v7';
      button.setAttribute('aria-label', 'Open video in large viewer');
      button.textContent = '↗';
      card.appendChild(button);
    });
  }

  function tuneC7Aero(attempt = 0) {
    const section = document.querySelector('body[data-page="home"] #c7-aero');
    if (!section || section.dataset.c7AeroTune === 'v1') return;

    const grid = section.querySelector(':scope > .visual-case-grid');
    const genericMainRow = grid?.querySelector(':scope > .case-main-row-v7');

    /* Wait until portfolio-v7 has completed its generic render first. */
    if (!grid || !grid.classList.contains('case-layout-v7') || !genericMainRow || typeof renderMediaGallery !== 'function') {
      if (attempt < 100) window.setTimeout(() => tuneC7Aero(attempt + 1), 50);
      return;
    }

    if (typeof EXACT_MEDIA_TITLES !== 'undefined') {
      Object.entries(C7_AERO_TITLES).forEach(([name, title]) => EXACT_MEDIA_TITLES.set(name, title));
    }
    if (typeof MEDIA_GROUPS !== 'undefined') MEDIA_GROUPS.c7Aero = C7_AERO_MEDIA.slice();

    const staging = document.createElement('div');
    staging.className = 'evidence-gallery compact gallery-story';
    renderMediaGallery(staging, C7_AERO_MEDIA);
    const cards = Array.from(staging.querySelectorAll(':scope > .media-card'));
    if (cards.length !== C7_AERO_MEDIA.length) return;

    const title = section.querySelector(':scope > .case-title');
    const intro = section.querySelector(':scope > .case-intro');
    const copy = grid.querySelector('.case-copy');
    if (!title || !copy) return;

    intro?.remove();

    const primary = document.createElement('div');
    primary.className = 'c7-aero-primary-v1';

    const left = document.createElement('div');
    left.className = 'c7-aero-left-v1';

    const leftSupport = document.createElement('div');
    leftSupport.className = 'c7-aero-left-support-v1';
    leftSupport.append(cards[1], cards[2]);

    left.append(title, copy, leftSupport);

    const feature = document.createElement('div');
    feature.className = 'c7-aero-feature-v1';
    feature.appendChild(cards[0]);

    primary.append(left, feature);

    const bottom = document.createElement('div');
    bottom.className = 'c7-aero-bottom-v1';
    cards.slice(3).forEach((card) => bottom.appendChild(card));

    grid.replaceChildren(primary, bottom);
    grid.classList.add('c7-aero-layout-v1');

    configureVideos(grid);
    addVideoExpandButtons(grid);
    section.dataset.c7AeroTune = 'v1';
  }

  function scheduleTune() {
    window.setTimeout(() => tuneC7Aero(), 0);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scheduleTune);
  else scheduleTune();
})();
