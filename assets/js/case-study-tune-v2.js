/* Case-study tuning v2
   Generalizes the C7 Active Aero editorial layout across detailed Motorsport and CHP sections.
   Loaded after portfolio-v7 and c7-aero-tune-v1. */

(() => {
  const SECTION_CONFIGS = {
    'can-controls': {
      mediaGroup: 'canControls',
      items: [
        'assets/img/motorsport/galleries/PCB 3d screenshot.png',
        'assets/img/motorsport/galleries/testing ios app.PNG',
        'assets/img/motorsport/galleries/PCB 2d screenshot.png',
        'assets/img/motorsport/galleries/testing the actuation of wing on car via phone 1.mp4',
        'assets/img/motorsport/galleries/testing the actuation of wing on car via phone 2.mp4',
        'assets/img/motorsport/galleries/testing the actuation of wing on car manually.mp4',
        'assets/img/motorsport/galleries/Testing wing control with IR remote.MP4',
      ],
      leftSupportCount: 2,
      bottomCount: 4,
    },
    sensors: {
      mediaGroup: 'sensors',
      items: [
        'assets/img/motorsport/galleries/testing the ios app with real camera feed 2.JPG',
        'assets/img/motorsport/galleries/testing thermal camera with esp32p4.mp4',
        'assets/img/motorsport/galleries/testing thermal camera with web interface.mp4',
      ],
      leftSupportCount: 2,
      bottomCount: 0,
    },
    'track-data': {
      mediaGroup: 'trackData',
      items: [
        'assets/img/motorsport/galleries/c7-track 2.jpg',
        'assets/img/motorsport/galleries/fixing C7 track side at night 1.jpg',
        'assets/img/motorsport/galleries/sitting at driver seat on track.jpg',
        'assets/img/motorsport/galleries/C7 before track 1.jpg',
        'assets/img/motorsport/galleries/me and my friends after track day events (Track side).jpg',
        'assets/img/motorsport/galleries/testing active aero on track gingerman.mp4',
        'assets/img/motorsport/galleries/testing full active aero on track grattan.mp4',
      ],
      leftSupportCount: 2,
      bottomCount: 4,
    },
    e8kw: {
      mediaGroup: 'professionalE8kw',
      items: [
        'assets/img/professional/E8kW_WhiteUnit.jpg',
        'assets/img/professional/EPS_mCHP_poster.jpg',
      ],
      leftSupportCount: 1,
      bottomCount: 0,
    },
    e200: {
      mediaGroup: 'professionalE200',
      items: [
        'assets/img/professional/E200.jpg',
        'assets/img/professional/E200Diagram.png',
      ],
      leftSupportCount: 1,
      bottomCount: 0,
    },
    inverter: {
      mediaGroup: 'professionalPower',
      items: [
        'assets/img/professional/testing inverter.JPG',
      ],
      leftSupportCount: 0,
      bottomCount: 0,
    },
    daq: {
      mediaGroup: 'professionalDaq',
      items: [
        'assets/img/professional/Dewesoft DAQ.jpg',
        'assets/img/professional/DIY_SignalAmplifier for DAQ.png',
      ],
      leftSupportCount: 1,
      bottomCount: 0,
    },
    hems: {
      mediaGroup: 'professionalControls',
      items: [
        'assets/img/professional/load emulator thermal side.JPG',
        'assets/img/professional/motorized load bank with custom made PCB.JPG',
      ],
      leftSupportCount: 1,
      bottomCount: 0,
    },
    comap: {
      mediaGroup: 'professionalFleet',
      items: [
        'assets/img/professional/Websupervisor.png',
      ],
      leftSupportCount: 0,
      bottomCount: 0,
    },
  };

  const TITLES = {
    'PCB 3d screenshot.png': 'Active-aero controller PCB — 3D design',
    'testing ios app.PNG': 'Native iOS active-aero HMI',
    'PCB 2d screenshot.png': 'Active-aero controller PCB — board layout',
    'testing the actuation of wing on car via phone 1.mp4': 'On-car wing control from iOS HMI',
    'testing the actuation of wing on car via phone 2.mp4': 'Closed-loop wing actuation from phone',
    'testing the actuation of wing on car manually.mp4': 'Manual wing actuation validation',
    'Testing wing control with IR remote.MP4': 'Early remote-control actuation prototype',
    'testing the ios app with real camera feed 2.JPG': 'Live vehicle sensing interface',
    'testing thermal camera with esp32p4.mp4': 'ESP32-P4 thermal-camera integration test',
    'testing thermal camera with web interface.mp4': 'Live tire-thermal visualization test',
    'c7-track 2.jpg': 'C7 Grand Sport during track development',
    'fixing C7 track side at night 1.jpg': 'Trackside troubleshooting and repair',
    'sitting at driver seat on track.jpg': 'Driver-side track development',
    'C7 before track 1.jpg': 'C7 prepared for track validation',
    'me and my friends after track day events (Track side).jpg': 'Track-day development team',
    'testing active aero on track gingerman.mp4': 'Active-aero track validation — Gingerman',
    'testing full active aero on track grattan.mp4': 'Full active-aero track validation — Grattan',
  };

  function applyTitles() {
    if (typeof EXACT_MEDIA_TITLES === 'undefined') return;
    Object.entries(TITLES).forEach(([name, title]) => EXACT_MEDIA_TITLES.set(name, title));
  }

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

  function tuneSection(sectionId, config) {
    const section = document.getElementById(sectionId);
    if (!section || section.dataset.caseTune === 'v2') return true;

    const grid = section.querySelector(':scope > .visual-case-grid');
    const title = section.querySelector(':scope > .case-title');
    const copy = grid?.querySelector('.case-copy');
    if (!grid || !title || !copy || typeof renderMediaGallery !== 'function') return false;

    if (typeof MEDIA_GROUPS !== 'undefined' && config.mediaGroup) {
      MEDIA_GROUPS[config.mediaGroup] = config.items.slice();
    }

    const staging = document.createElement('div');
    staging.className = 'evidence-gallery compact';
    renderMediaGallery(staging, config.items);
    const cards = Array.from(staging.querySelectorAll(':scope > .media-card'));
    if (cards.length !== config.items.length || !cards.length) return false;

    section.querySelector(':scope > .case-intro')?.remove();

    const primary = document.createElement('div');
    primary.className = 'case-primary-v2';

    const left = document.createElement('div');
    left.className = 'case-left-v2';
    left.append(title, copy);

    const feature = document.createElement('div');
    feature.className = 'case-feature-v2';
    feature.appendChild(cards[0]);

    const leftCards = cards.slice(1, 1 + config.leftSupportCount);
    if (leftCards.length) {
      const support = document.createElement('div');
      support.className = `case-left-support-v2 support-count-${leftCards.length}`;
      leftCards.forEach((card) => support.appendChild(card));
      left.appendChild(support);
    }

    primary.append(left, feature);
    grid.replaceChildren(primary);

    const bottomCards = cards.slice(1 + config.leftSupportCount, 1 + config.leftSupportCount + config.bottomCount);
    if (bottomCards.length) {
      const bottom = document.createElement('div');
      bottom.className = `case-bottom-v2 bottom-count-${bottomCards.length}`;
      bottomCards.forEach((card) => bottom.appendChild(card));
      grid.appendChild(bottom);
    }

    grid.classList.add('case-layout-v7', 'case-layout-v2');
    section.classList.add('case-tuned-v2');
    section.dataset.caseTune = 'v2';

    configureVideos(grid);
    addVideoExpandButtons(grid);
    return true;
  }

  function renameTrackVideos() {
    const cards = document.querySelectorAll('#track-videos .youtube-card');
    const labels = ['Sebring International Raceway', 'Homestead-Miami Speedway'];
    cards.forEach((card, index) => {
      const label = labels[index];
      if (!label) return;
      const heading = card.querySelector('h3');
      const iframe = card.querySelector('iframe');
      if (heading) heading.textContent = label;
      if (iframe) iframe.title = label;
    });
  }

  function halveRailValue(card, cssName, dataName) {
    const raw = card.style.getPropertyValue(cssName);
    const value = parseFloat(raw);
    if (!Number.isFinite(value) || value <= 0) return;

    const lastHalf = parseFloat(card.dataset[dataName] || '0');
    if (lastHalf && Math.abs(value - lastHalf) < 0.5) return;

    const half = value * 0.5;
    card.style.setProperty(cssName, `${half}px`);
    card.dataset[dataName] = String(half);
  }

  function halveRailCard(card) {
    halveRailValue(card, '--rail-item-height', 'railHalfHeightV2');
    halveRailValue(card, '--rail-item-height-mobile', 'railHalfMobileV2');
    halveRailValue(card, '--rail-item-width', 'railHalfWidthV2');
  }

  function patchRailCard(card) {
    if (!card || card.dataset.railTuneV2 === '1') {
      halveRailCard(card);
      return;
    }

    const original = card.__sizeForRailV7;
    if (typeof original === 'function') {
      card.__sizeForRailV7 = () => {
        original();
        halveRailCard(card);
      };
    }

    const media = card.querySelector('img, video');
    if (media) {
      media.addEventListener('load', () => requestAnimationFrame(() => halveRailCard(card)));
      media.addEventListener('loadedmetadata', () => requestAnimationFrame(() => halveRailCard(card)));
    }

    card.dataset.railTuneV2 = '1';
    halveRailCard(card);
  }

  function tuneArchiveRails() {
    document.querySelectorAll('.media-archive .media-dock.showcase-rail-v7').forEach((rail) => {
      if (rail.__autoAdvanceV7) {
        clearInterval(rail.__autoAdvanceV7);
        rail.__autoAdvanceV7 = null;
      }
      rail.querySelectorAll('.dock-item').forEach(patchRailCard);
      rail.__updateButtonsV7?.();
    });
  }

  function tuneAll(attempt = 0) {
    applyTitles();

    let ready = true;
    Object.entries(SECTION_CONFIGS).forEach(([sectionId, config]) => {
      if (!tuneSection(sectionId, config)) ready = false;
    });

    renameTrackVideos();
    tuneArchiveRails();

    if ((!ready || !document.querySelector('.media-archive .media-dock.showcase-rail-v7')) && attempt < 120) {
      window.setTimeout(() => tuneAll(attempt + 1), 50);
    }
  }

  function init() {
    tuneAll();

    window.addEventListener('resize', () => requestAnimationFrame(tuneArchiveRails), { passive: true });

    if ('MutationObserver' in window) {
      const observer = new MutationObserver(() => requestAnimationFrame(() => {
        renameTrackVideos();
        tuneArchiveRails();
      }));
      observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'data-mode'] });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
