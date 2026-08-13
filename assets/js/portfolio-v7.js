/* Portfolio v7 — deterministic media selection, explicit case-study layout, native rails, stable viewer. */

(() => {
  const DETAIL_GROUPS = {
    professionalE8kw: [
      "assets/img/professional/EPS_mCHP_poster.jpg",
      "assets/img/professional/E8kW_WhiteUnit.jpg",
    ],
    professionalE200: [
      "assets/img/professional/E200Diagram.png",
      "assets/img/professional/E200.jpg",
    ],
    professionalPower: [
      "assets/img/professional/testing inverter.JPG",
    ],
    professionalDaq: [
      "assets/img/professional/Dewesoft DAQ.jpg",
      "assets/img/professional/DIY_SignalAmplifier for DAQ.png",
    ],
    professionalControls: [
      "assets/img/professional/load emulator thermal side.JPG",
      "assets/img/professional/motorized load bank with custom made PCB.JPG",
    ],
    professionalFleet: [
      "assets/img/professional/Websupervisor.png",
    ],
    c7Aero: [
      "assets/img/motorsport/galleries/fitting the real aluminum bracket and wing 1.JPG",
      "assets/img/motorsport/galleries/carbon cloth wrapping the 3d printing core prep 3.JPG",
      "assets/img/motorsport/galleries/fitting the real aluminum bracket and wing 2.JPG",
      "assets/img/motorsport/galleries/prototype of active wing carbon fiber wing + aluminum post + plastic braket.JPG",
      "assets/img/motorsport/galleries/testing front ramp while front bumper disassembled.mp4",
    ],
    canControls: [
      "assets/img/motorsport/galleries/PCB 3d screenshot.png",
      "assets/img/motorsport/galleries/testing ios app.PNG",
      "assets/img/motorsport/galleries/testing the actuation of wing on car via phone 1.mp4",
      "assets/img/motorsport/galleries/Testing wing control with IR remote.MP4",
    ],
    sensors: [
      "assets/img/motorsport/galleries/testing thermal camera with esp32p4.mp4",
      "assets/img/motorsport/galleries/testing the ios app with real camera feed 2.JPG",
      "assets/img/motorsport/galleries/testing thermal camera with web interface.mp4",
    ],
    trackData: [
      "assets/img/motorsport/galleries/c7-track 2.jpg",
      "assets/img/motorsport/galleries/fixing C7 track side at night 1.jpg",
      "assets/img/motorsport/galleries/testing active aero on track gingerman.mp4",
      "assets/img/motorsport/galleries/testing full active aero on track grattan.mp4",
    ],
  };

  const TITLES = {
    "carbon cloth wrapping the 3d printing core prep 3.JPG": "Carbon-fiber layup preparation",
    "fitting the real aluminum bracket and wing 1.JPG": "Final aluminum bracket and wing fitment — view 1",
    "fitting the real aluminum bracket and wing 2.JPG": "Final aluminum bracket and wing fitment — view 2",
    "prototype of active wing carbon fiber wing + aluminum post + plastic braket.JPG": "Prototype active-wing assembly: composite wing, aluminum post, and bracket",
    "testing front ramp while front bumper disassembled.mp4": "Front-ramp actuation test with bumper removed",
  };

  function setText(selector, text) {
    const node = document.querySelector(selector);
    if (node) node.textContent = text;
  }

  function updateShowcaseCopy() {
    setText(
      '.home-showcase[data-mode-section="professional"] .section-heading h2',
      'Systems I build, integrate, test, and support.'
    );
    setText(
      '.home-showcase[data-mode-section="professional"] .showcase-intro',
      'CHP, power electronics, DAQ, controls, and field systems—shown through the hardware, interfaces, and test work themselves.'
    );
    setText(
      '.home-showcase[data-mode-section="motorsport"] .showcase-intro',
      'One vehicle-development loop: build the hardware, control it, instrument it, then validate it on track.'
    );
    setText(
      '.track-video-section .lead',
      'Track use closes the loop: hardware, controls, setup, data, and driver feedback all meet here.'
    );

    const confidentiality = document.querySelector('.public-portfolio-note[data-mode-section="professional"] p');
    if (confidentiality) {
      confidentiality.textContent = 'The project photos and information shown here are limited to material that is publicly available, personally generated, or otherwise appropriate for public display. No NDA-protected, proprietary, customer-confidential, credential, or controlled internal information is displayed. Where a source image could reveal sensitive details, those details have been blurred or excluded. This site showcases the engineering systems and work I have built, integrated, tested, and supported.';
    }

    const professionalArchive = document.querySelector('.media-archive[data-mode-section="professional"]');
    if (professionalArchive) {
      const eyebrow = professionalArchive.querySelector('.eyebrow');
      const title = professionalArchive.querySelector('h2');
      const intro = professionalArchive.querySelector('.archive-intro');
      if (eyebrow) eyebrow.textContent = 'CHP / MicroGrid Gallery';
      if (title) title.textContent = 'Systems, hardware, controls, and test work.';
      if (intro) intro.textContent = 'A visual tour through the hardware, instrumentation, controls, and validation work behind my CHP and microgrid projects.';
    }

    const motorsportArchive = document.querySelector('.media-archive[data-mode-section="motorsport"]');
    if (motorsportArchive) {
      const eyebrow = motorsportArchive.querySelector('.eyebrow');
      const title = motorsportArchive.querySelector('h2');
      const intro = motorsportArchive.querySelector('.archive-intro');
      if (eyebrow) eyebrow.textContent = 'Motorsport Gallery';
      if (title) title.textContent = 'The full development story.';
      if (intro) intro.textContent = 'Prototype to fabrication, controls, instrumentation, track work, and iteration—shown as the project developed.';

      const groups = Array.from(motorsportArchive.querySelectorAll('.dock-group'));
      const findGroup = (keyword) => groups.find((group) => group.querySelector('h3')?.textContent.toLowerCase().includes(keyword));
      const ordered = [findGroup('build'), findGroup('control'), findGroup('measure'), findGroup('validate')].filter(Boolean);
      ordered.forEach((group) => motorsportArchive.appendChild(group));

      const groupCopy = [
        ['build', 'Build · active aero · fabrication', 'Prototype iterations, composite work, fit checks, front aero, final hardware, and fabrication.'],
        ['control', 'Control · PCB · HMI', 'Controller design, board development, driver interface, vehicle signals, and actuation testing.'],
        ['measure', 'Measure · instrumentation · thermal imaging', 'Camera integration, tire-thermal development, live visualization, and distributed sensing.'],
        ['validate', 'Validate · track development', 'Gingerman, Grattan, trackside work, service, data review, and on-track iteration.'],
      ];

      groupCopy.forEach(([keyword, heading, description]) => {
        const group = findGroup(keyword);
        if (!group) return;
        const h3 = group.querySelector('h3');
        const p = group.querySelector(':scope > p');
        if (h3) h3.textContent = heading;
        if (p) p.textContent = description;
      });
    }
  }

  function setExactTitles() {
    if (typeof EXACT_MEDIA_TITLES === 'undefined') return;
    Object.entries(TITLES).forEach(([name, title]) => EXACT_MEDIA_TITLES.set(name, title));
  }

  function rerenderDetailGroups() {
    if (typeof renderMediaGallery !== 'function') return;

    Object.entries(DETAIL_GROUPS).forEach(([groupName, items]) => {
      if (typeof MEDIA_GROUPS !== 'undefined') MEDIA_GROUPS[groupName] = items.slice();
      document.querySelectorAll(`[data-media-group="${groupName}"]`).forEach((container) => {
        renderMediaGallery(container, items);
      });
    });
  }

  function organizeCaseStudies() {
    document.querySelectorAll('body[data-page="home"] .case-study > .visual-case-grid').forEach((grid) => {
      if (grid.classList.contains('case-layout-v7')) return;

      const copy = grid.querySelector(':scope > .case-copy');
      const gallery = grid.querySelector('[data-media-group]');
      if (!copy || !gallery) return;

      const cards = Array.from(gallery.querySelectorAll(':scope > .media-card'));
      if (!cards.length) return;

      const feature = cards.shift();
      const mainRow = document.createElement('div');
      mainRow.className = 'case-main-row-v7';

      const featureWrap = document.createElement('div');
      featureWrap.className = 'case-feature-v7';
      featureWrap.appendChild(feature);
      mainRow.append(copy, featureWrap);

      grid.replaceChildren(mainRow);
      grid.classList.add('case-layout-v7');

      if (cards.length) {
        const support = document.createElement('div');
        support.className = `case-support-v7 support-count-${Math.min(cards.length, 6)}`;
        cards.forEach((card) => support.appendChild(card));
        grid.appendChild(support);
      }
    });
  }

  function mediaDimensions(media) {
    if (media instanceof HTMLImageElement) return [media.naturalWidth, media.naturalHeight];
    if (media instanceof HTMLVideoElement) return [media.videoWidth, media.videoHeight];
    return [0, 0];
  }

  function annotateMediaRatios() {
    document.querySelectorAll('body[data-page="home"] .media-card, body[data-page="home"] .dock-item').forEach((card) => {
      const media = card.querySelector('img, video');
      if (!media) return;

      const apply = () => {
        const [width, height] = mediaDimensions(media);
        if (!width || !height) return;
        const ratio = width / height;
        card.dataset.mediaRatio = String(ratio);
        card.style.setProperty('--media-ratio', `${width} / ${height}`);
        card.classList.toggle('media-tall', ratio < .82);
        card.classList.toggle('media-wide', ratio > 1.45);
        card.classList.toggle('media-square', ratio >= .82 && ratio <= 1.45);
      };

      if (media instanceof HTMLImageElement) {
        if (media.complete && media.naturalWidth) apply();
        else media.addEventListener('load', apply, { once: true });
      } else if (media.readyState >= 1) {
        apply();
      } else {
        media.addEventListener('loadedmetadata', apply, { once: true });
      }
    });
  }

  function setMutedAutoplay() {
    const videos = Array.from(document.querySelectorAll('body[data-page="home"] .media-card video, body[data-page="home"] .dock-item video'));

    videos.forEach((video) => {
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
    });

    if (!("IntersectionObserver" in window)) {
      videos.forEach((video) => video.play().catch(() => {}));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting && entry.intersectionRatio >= .14) video.play().catch(() => {});
        else video.pause();
      });
    }, { threshold: [0, .14, .45] });

    videos.forEach((video) => observer.observe(video));
  }

  function normalizeYouTubeUrl(source) {
    try {
      const url = new URL(source, window.location.href);
      const videoId = url.pathname.split('/').filter(Boolean).pop();
      url.searchParams.set('autoplay', '1');
      url.searchParams.set('mute', '1');
      url.searchParams.set('playsinline', '1');
      url.searchParams.set('loop', '1');
      if (videoId) url.searchParams.set('playlist', videoId);
      return url.toString();
    } catch (_) {
      return source;
    }
  }

  function setupYouTubeAutoplay() {
    document.querySelectorAll('body[data-page="home"] .youtube-embed iframe').forEach((iframe) => {
      iframe.src = normalizeYouTubeUrl(iframe.src);
      iframe.removeAttribute('allowfullscreen');
    });
  }

  function cleanLegacyDockListeners(rail) {
    Array.from(rail.children).forEach((item) => {
      if (!item.classList.contains('dock-item')) return;
      const clean = item.cloneNode(true);
      item.replaceWith(clean);
    });
  }

  function railHeight() {
    if (window.innerWidth <= 580) return Math.max(270, Math.min(330, window.innerWidth * .78));
    if (window.innerWidth <= 900) return Math.max(320, Math.min(390, window.innerWidth * .48));
    return Math.max(360, Math.min(520, window.innerWidth * .32));
  }

  function sizeRailItem(card) {
    const media = card.querySelector('img, video');
    if (!media) return;

    const apply = () => {
      const [width, height] = mediaDimensions(media);
      const ratio = width && height ? width / height : 16 / 9;
      const targetHeight = railHeight();
      const minWidth = Math.max(220, targetHeight * .48);
      const maxWidth = Math.min(1050, window.innerWidth * .76);
      const targetWidth = Math.max(minWidth, Math.min(maxWidth, targetHeight * ratio));
      card.style.setProperty('--rail-item-height', `${targetHeight}px`);
      card.style.setProperty('--rail-item-height-mobile', `${targetHeight}px`);
      card.style.setProperty('--rail-item-width', `${targetWidth}px`);
    };

    if (media instanceof HTMLImageElement) {
      if (media.complete && media.naturalWidth) apply();
      else media.addEventListener('load', apply, { once: true });
    } else if (media.readyState >= 1) {
      apply();
    } else {
      media.addEventListener('loadedmetadata', apply, { once: true });
    }

    card.__sizeForRailV7 = apply;
  }

  function setupRailNavigation(rail, index) {
    if (rail.classList.contains('showcase-rail-v7')) return;
    cleanLegacyDockListeners(rail);
    rail.classList.add('showcase-rail', 'showcase-rail-v7');
    rail.setAttribute('aria-label', `Scrollable project gallery ${index + 1}`);
    Array.from(rail.querySelectorAll('.dock-item')).forEach(sizeRailItem);

    const oldNav = rail.parentElement?.querySelector(':scope > .showcase-rail-nav');
    oldNav?.remove();

    const nav = document.createElement('div');
    nav.className = 'showcase-rail-nav';

    const previous = document.createElement('button');
    previous.type = 'button';
    previous.className = 'showcase-rail-button showcase-rail-prev';
    previous.setAttribute('aria-label', 'Previous gallery item');
    previous.textContent = '←';

    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'showcase-rail-button showcase-rail-next';
    next.setAttribute('aria-label', 'Next gallery item');
    next.textContent = '→';

    nav.append(previous, next);
    rail.parentNode.insertBefore(nav, rail);

    const cards = () => Array.from(rail.querySelectorAll('.dock-item'));
    const paddingLeft = () => parseFloat(getComputedStyle(rail).paddingLeft) || 0;

    const currentIndex = () => {
      const items = cards();
      if (!items.length) return 0;
      const target = rail.scrollLeft + paddingLeft();
      let best = 0;
      let bestDistance = Infinity;
      items.forEach((card, cardIndex) => {
        const distance = Math.abs(card.offsetLeft - target);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = cardIndex;
        }
      });
      return best;
    };

    const markInteraction = () => {
      rail.__lastManualInteractionV7 = Date.now();
    };

    const goTo = (cardIndex, behavior = 'smooth') => {
      const items = cards();
      if (!items.length) return;
      const safeIndex = Math.max(0, Math.min(items.length - 1, cardIndex));
      rail.scrollTo({ left: Math.max(0, items[safeIndex].offsetLeft - paddingLeft()), behavior });
    };

    previous.addEventListener('click', () => {
      markInteraction();
      goTo(currentIndex() - 1);
    });

    next.addEventListener('click', () => {
      markInteraction();
      goTo(currentIndex() + 1);
    });

    let buttonFrame = 0;
    const updateButtons = () => {
      buttonFrame = 0;
      const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
      previous.disabled = rail.scrollLeft <= 3;
      next.disabled = rail.scrollLeft >= maxScroll - 3;
    };

    rail.__updateButtonsV7 = updateButtons;
    rail.addEventListener('scroll', () => {
      if (!buttonFrame) buttonFrame = requestAnimationFrame(updateButtons);
    }, { passive: true });

    /* Native trackpad horizontal momentum is intentionally untouched. */
    rail.addEventListener('wheel', (event) => {
      if (Math.abs(event.deltaX) > 1) markInteraction();
    }, { passive: true });
    rail.addEventListener('pointerdown', markInteraction, { passive: true });
    rail.addEventListener('touchstart', markInteraction, { passive: true });

    rail.__autoAdvanceV7 = window.setInterval(() => {
      if (document.hidden || document.body.classList.contains('media-viewer-v7-open')) return;
      if (Date.now() - (rail.__lastManualInteractionV7 || 0) < 8000) return;
      const section = rail.closest('.mode-section');
      if (section && getComputedStyle(section).display === 'none') return;
      const items = cards();
      if (items.length < 2) return;
      goTo((currentIndex() + 1) % items.length);
    }, 6000);

    window.addEventListener('resize', () => {
      cards().forEach((card) => card.__sizeForRailV7?.());
      updateButtons();
    }, { passive: true });

    requestAnimationFrame(updateButtons);
  }

  function initShowcaseRails() {
    document.querySelectorAll('.media-archive .media-dock').forEach((rail, index) => setupRailNavigation(rail, index));

    if ('MutationObserver' in window) {
      const observer = new MutationObserver(() => {
        requestAnimationFrame(() => {
          document.querySelectorAll('.media-dock.showcase-rail-v7').forEach((rail) => {
            rail.querySelectorAll('.dock-item').forEach((card) => card.__sizeForRailV7?.());
            rail.__updateButtonsV7?.();
          });
        });
      });
      observer.observe(document.body, { attributes: true, attributeFilter: ['class', 'data-mode'] });
    }
  }

  function removeLegacyExpandButtons() {
    document.querySelectorAll('body[data-page="home"] .media-expand-button').forEach((button) => button.remove());
  }

  function addExpandButtons() {
    document.querySelectorAll('body[data-page="home"] .media-card video, body[data-page="home"] .dock-item video').forEach((video) => {
      const card = video.closest('.media-card, .dock-item');
      if (!card || card.querySelector(':scope > .media-expand-button')) return;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'media-expand-button media-expand-v7';
      button.setAttribute('aria-label', 'Open video in large viewer');
      button.textContent = '↗';
      card.appendChild(button);
    });

    document.querySelectorAll('body[data-page="home"] .youtube-embed').forEach((container) => {
      if (container.querySelector(':scope > .media-expand-button')) return;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'media-expand-button media-expand-v7';
      button.setAttribute('aria-label', 'Open track video in large viewer');
      button.textContent = '↗';
      container.appendChild(button);
    });
  }

  function viewerCaptionFor(node) {
    const figure = node.closest('figure');
    const caption = figure?.querySelector('figcaption')?.textContent?.trim();
    return caption || node.getAttribute('alt') || node.getAttribute('title') || '';
  }

  function formatTime(value) {
    if (!Number.isFinite(value)) return '0:00';
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  function createViewer() {
    const existing = document.querySelector('.media-viewer-v7');
    if (existing) return existing;

    const viewer = document.createElement('div');
    viewer.className = 'media-viewer-v7';
    viewer.setAttribute('role', 'dialog');
    viewer.setAttribute('aria-modal', 'true');
    viewer.setAttribute('aria-label', 'Media viewer');
    viewer.innerHTML = `
      <div class="media-viewer-v7-panel">
        <button type="button" class="media-viewer-v7-close" aria-label="Close media viewer">×</button>
        <div class="media-viewer-v7-stage"></div>
        <div class="media-viewer-v7-footer">
          <div class="media-viewer-v7-caption"></div>
          <div class="media-viewer-v7-controls">
            <button type="button" class="media-viewer-v7-control media-viewer-v7-play">Pause</button>
            <button type="button" class="media-viewer-v7-control media-viewer-v7-mute">Unmute</button>
            <input class="media-viewer-v7-progress" type="range" min="0" max="1000" value="0" aria-label="Video position" />
            <span class="media-viewer-v7-time">0:00 / 0:00</span>
          </div>
        </div>
      </div>`;
    document.body.appendChild(viewer);

    viewer.querySelector('.media-viewer-v7-close').addEventListener('click', () => closeViewer(viewer));
    viewer.addEventListener('click', (event) => {
      if (event.target === viewer) closeViewer(viewer);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && viewer.classList.contains('is-open')) closeViewer(viewer);
    });

    return viewer;
  }

  function lockPage(viewer, opener) {
    if (viewer.__pageLock) return;

    const root = document.documentElement;
    const body = document.body;
    const x = window.scrollX;
    const y = window.scrollY;
    const scrollbarWidth = Math.max(0, window.innerWidth - root.clientWidth);

    viewer.__pageLock = {
      x,
      y,
      opener,
      rootOverflow: root.style.overflow,
      rootPaddingRight: root.style.paddingRight,
      rootScrollBehavior: root.style.scrollBehavior,
      bodyOverflow: body.style.overflow,
      bodyPaddingRight: body.style.paddingRight,
    };

    root.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    if (scrollbarWidth) body.style.paddingRight = `${scrollbarWidth}px`;
    body.classList.add('media-viewer-v7-open');
  }

  function unlockPage(viewer) {
    const lock = viewer.__pageLock;
    if (!lock) return;

    const root = document.documentElement;
    const body = document.body;
    root.style.overflow = lock.rootOverflow;
    root.style.paddingRight = lock.rootPaddingRight;
    body.style.overflow = lock.bodyOverflow;
    body.style.paddingRight = lock.bodyPaddingRight;
    body.classList.remove('media-viewer-v7-open');

    const moved = Math.abs(window.scrollY - lock.y) > 1 || Math.abs(window.scrollX - lock.x) > 1;
    if (moved) {
      root.style.scrollBehavior = 'auto';
      window.scrollTo(lock.x, lock.y);
      requestAnimationFrame(() => {
        root.style.scrollBehavior = lock.rootScrollBehavior;
      });
    } else {
      root.style.scrollBehavior = lock.rootScrollBehavior;
    }

    if (lock.opener instanceof HTMLElement) {
      try { lock.opener.focus({ preventScroll: true }); } catch (_) {}
    }
    viewer.__pageLock = null;
  }

  function closeViewer(viewer) {
    viewer.querySelector('.media-viewer-v7-stage video')?.pause();
    const frame = viewer.querySelector('.media-viewer-v7-stage iframe');
    if (frame) frame.src = 'about:blank';
    viewer.classList.remove('is-open', 'is-video', 'is-youtube');
    viewer.querySelector('.media-viewer-v7-stage').replaceChildren();
    unlockPage(viewer);
  }

  function openViewerShell(viewer, caption, mode, opener) {
    viewer.querySelector('.media-viewer-v7-caption').textContent = caption || '';
    viewer.classList.remove('is-video', 'is-youtube');
    if (mode) viewer.classList.add(mode);
    lockPage(viewer, opener);
    viewer.classList.add('is-open');
    requestAnimationFrame(() => viewer.querySelector('.media-viewer-v7-close')?.focus({ preventScroll: true }));
  }

  function openImageViewer(image) {
    const viewer = createViewer();
    const display = document.createElement('img');
    display.src = image.currentSrc || image.src;
    display.alt = image.alt || viewerCaptionFor(image);
    viewer.querySelector('.media-viewer-v7-stage').replaceChildren(display);
    openViewerShell(viewer, viewerCaptionFor(image), null, image.closest('a, button') || image);
  }

  function openVideoViewer(sourceVideo) {
    const viewer = createViewer();
    const video = document.createElement('video');
    const source = sourceVideo.currentSrc || sourceVideo.querySelector('source')?.src || sourceVideo.src;
    video.src = source;
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.autoplay = true;
    video.controls = false;
    viewer.querySelector('.media-viewer-v7-stage').replaceChildren(video);

    const playButton = viewer.querySelector('.media-viewer-v7-play');
    const muteButton = viewer.querySelector('.media-viewer-v7-mute');
    const progress = viewer.querySelector('.media-viewer-v7-progress');
    const time = viewer.querySelector('.media-viewer-v7-time');

    const sync = () => {
      playButton.textContent = video.paused ? 'Play' : 'Pause';
      muteButton.textContent = video.muted ? 'Unmute' : 'Mute';
      const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 0;
      progress.value = duration ? String(Math.round((video.currentTime / duration) * 1000)) : '0';
      time.textContent = `${formatTime(video.currentTime)} / ${formatTime(duration)}`;
    };

    playButton.onclick = () => {
      if (video.paused) video.play().catch(() => {});
      else video.pause();
      sync();
    };
    muteButton.onclick = () => {
      video.muted = !video.muted;
      sync();
    };
    progress.oninput = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) video.currentTime = Number(progress.value) / 1000 * video.duration;
    };
    video.addEventListener('timeupdate', sync);
    video.addEventListener('play', sync);
    video.addEventListener('pause', sync);
    video.addEventListener('loadedmetadata', () => {
      if (Number.isFinite(sourceVideo.currentTime)) video.currentTime = sourceVideo.currentTime;
      sync();
    }, { once: true });

    openViewerShell(viewer, viewerCaptionFor(sourceVideo), 'is-video', sourceVideo);
    video.play().catch(() => {});
  }

  function openYouTubeViewer(frame) {
    const viewer = createViewer();
    const display = document.createElement('iframe');
    display.src = normalizeYouTubeUrl(frame.src);
    display.title = frame.title || 'Track video';
    display.allow = 'autoplay; encrypted-media; picture-in-picture';
    display.referrerPolicy = 'strict-origin-when-cross-origin';
    viewer.querySelector('.media-viewer-v7-stage').replaceChildren(display);
    openViewerShell(viewer, frame.title || 'Track video', 'is-youtube', frame);
  }

  function installViewerCapture() {
    document.addEventListener('click', (event) => {
      const expand = event.target.closest?.('.media-expand-button');
      if (expand && document.body.contains(expand)) {
        const container = expand.closest('.media-card, .dock-item, .youtube-embed');
        const video = container?.querySelector('video');
        const frame = container?.querySelector('iframe');
        if (video || frame) {
          event.preventDefault();
          event.stopImmediatePropagation();
          if (video) openVideoViewer(video);
          else openYouTubeViewer(frame);
          return;
        }
      }

      const image = event.target.closest?.('body[data-page="home"] .media-card img, body[data-page="home"] .dock-item img, body[data-page="home"] .project-cover img');
      if (image) {
        event.preventDefault();
        event.stopImmediatePropagation();
        openImageViewer(image);
      }
    }, true);
  }

  function initV7() {
    updateShowcaseCopy();
    setExactTitles();
    rerenderDetailGroups();
    organizeCaseStudies();
    initShowcaseRails();
    annotateMediaRatios();
    removeLegacyExpandButtons();
    addExpandButtons();
    setMutedAutoplay();
    setupYouTubeAutoplay();
    installViewerCapture();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initV7);
  else initV7();
})();
