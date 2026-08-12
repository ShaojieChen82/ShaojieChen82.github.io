/* Portfolio visual catalog + showcase behavior. */

(() => {
  if (typeof MEDIA_GROUPS === "undefined" || typeof EXACT_MEDIA_TITLES === "undefined") return;

  function loadStylesheet(href, key) {
    if (document.querySelector(`link[data-portfolio-style="${key}"]`)) return;
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = href;
    stylesheet.dataset.portfolioStyle = key;
    document.head.appendChild(stylesheet);
  }

  loadStylesheet("assets/css/portfolio-showcase-v3.css?v=1", "showcase-v3");
  loadStylesheet("assets/css/portfolio-media-v4.css?v=1", "media-v4");

  const DAQ_MEDIA = [
    "assets/img/professional/DIY_SignalAmplifier for DAQ.png",
    "assets/img/professional/Dewesoft DAQ.jpg",
  ];

  MEDIA_GROUPS.professionalDaq = DAQ_MEDIA;

  if (Array.isArray(MEDIA_GROUPS.professionalAll)) {
    DAQ_MEDIA.forEach((path) => {
      if (!MEDIA_GROUPS.professionalAll.includes(path)) MEDIA_GROUPS.professionalAll.push(path);
    });
  }

  /* Use complementary visuals in the detail view instead of simply repeating overview-card art. */
  MEDIA_GROUPS.professionalE8kw = [
    "assets/img/professional/EPS_mCHP_poster.jpg",
    "assets/img/professional/E8kW_WhiteUnit.jpg",
  ];
  MEDIA_GROUPS.professionalE200 = [
    "assets/img/professional/E200Diagram.png",
    "assets/img/professional/E200.jpg",
  ];
  MEDIA_GROUPS.professionalControls = [
    "assets/img/professional/motorized load bank with custom made PCB.JPG",
    "assets/img/professional/load emulator thermal side.JPG",
  ];

  MEDIA_GROUPS.c7Aero = [
    "assets/img/motorsport/galleries/fitting the real aluminum bracket and wing 1.JPG",
    "assets/img/motorsport/galleries/prototype of active wing carbon fiber wing + aluminum post + plastic braket.JPG",
    "assets/img/motorsport/galleries/showing the front splitter ramp High df vs low drag.JPG",
    "assets/img/motorsport/galleries/waterjet aluminum bracket and post 1.mp4",
    "assets/img/motorsport/galleries/using high pressure water to test the aerodynamics of the front ramp 1.mp4",
  ];

  MEDIA_GROUPS.canControls = [
    "assets/img/motorsport/galleries/testing ios app.PNG",
    "assets/img/motorsport/galleries/PCB 3d screenshot back.png",
    "assets/img/motorsport/galleries/testing the actuation of wing on car via phone 1.mp4",
    "assets/img/motorsport/galleries/Testing wing control with IR remote.MP4",
  ];

  MEDIA_GROUPS.sensors = [
    "assets/img/motorsport/galleries/testing the ios app with real camera feed 2.JPG",
    "assets/img/motorsport/galleries/testing thermal camera with esp32p4.mp4",
    "assets/img/motorsport/galleries/testing thermal camera with web interface.mp4",
  ];

  MEDIA_GROUPS.trackData = [
    "assets/img/motorsport/galleries/c7-track 2.jpg",
    "assets/img/motorsport/galleries/fixing C7 track side at night 1.jpg",
    "assets/img/motorsport/galleries/testing active aero on track gingerman.mp4",
    "assets/img/motorsport/galleries/testing full active aero on track grattan.mp4",
  ];

  EXACT_MEDIA_TITLES.set("Dewesoft DAQ.jpg", "Dewesoft data-acquisition hardware for system validation");
  EXACT_MEDIA_TITLES.set("DIY_SignalAmplifier for DAQ.png", "Custom signal-conditioning / amplifier hardware for DAQ measurements");
  EXACT_MEDIA_TITLES.set("prototype of active wing carbon fiber wing + aluminum post + plastic braket.JPG", "Prototype active-wing assembly: composite wing, aluminum post, and bracket");
  EXACT_MEDIA_TITLES.set("fitting the real aluminum bracket and wing 1.JPG", "Final aluminum bracket and wing fitment");
  EXACT_MEDIA_TITLES.set("fixing C7 track side at night 1.jpg", "Trackside troubleshooting and repair during development");

  function setText(selector, text) {
    const node = document.querySelector(selector);
    if (node) node.textContent = text;
  }

  function updateShowcaseCopy() {
    setText(
      '.home-showcase[data-mode-section="professional"] .section-heading h2',
      "Systems I build, integrate, test, and support."
    );
    setText(
      '.home-showcase[data-mode-section="motorsport"] .showcase-intro',
      "The projects follow one development loop: hardware, controls, instrumentation, and track iteration."
    );

    const confidentiality = document.querySelector('.public-portfolio-note[data-mode-section="professional"] p');
    if (confidentiality) {
      confidentiality.textContent = "The project photos and information shown here are limited to material that is publicly available, personally generated, or otherwise appropriate for public display. No NDA-protected, proprietary, customer-confidential, credential, or controlled internal information is displayed. Where a source image could reveal sensitive details, those details have been blurred or excluded. This site showcases my engineering work and the systems I have built, integrated, tested, and supported.";
    }

    setText(
      '.track-video-section .lead',
      "Real track use closes the development loop: hardware, controls, setup, data, and driver feedback all meet here."
    );

    const professionalArchive = document.querySelector('.media-archive[data-mode-section="professional"]');
    if (professionalArchive) {
      const eyebrow = professionalArchive.querySelector('.eyebrow');
      const title = professionalArchive.querySelector('h2');
      const intro = professionalArchive.querySelector('.archive-intro');
      if (eyebrow) eyebrow.textContent = "CHP / MicroGrid Gallery";
      if (title) title.textContent = "Systems, hardware, controls, and test work.";
      if (intro) intro.textContent = "A visual tour through the hardware, instrumentation, controls, and validation work behind my CHP and microgrid projects.";
    }

    const motorsportArchive = document.querySelector('.media-archive[data-mode-section="motorsport"]');
    if (motorsportArchive) {
      const eyebrow = motorsportArchive.querySelector('.eyebrow');
      const title = motorsportArchive.querySelector('h2');
      const intro = motorsportArchive.querySelector('.archive-intro');
      if (eyebrow) eyebrow.textContent = "Motorsport Gallery";
      if (title) title.textContent = "The full development story.";
      if (intro) intro.textContent = "Prototype to fabrication, controls, instrumentation, track work, and iteration—shown as the project developed.";

      const groups = Array.from(motorsportArchive.querySelectorAll('.dock-group'));
      const findGroup = (keyword) => groups.find((group) => group.querySelector('h3')?.textContent.toLowerCase().includes(keyword));
      const ordered = [findGroup("build"), findGroup("control"), findGroup("measure"), findGroup("validate")].filter(Boolean);
      ordered.forEach((group) => motorsportArchive.appendChild(group));

      const groupCopy = [
        ["build", "Build · active aero · fabrication", "Prototype iterations, composite work, fit checks, front aero, final hardware, and fabrication."],
        ["control", "Control · PCB · HMI", "Controller design, board development, driver interface, vehicle signals, and actuation testing."],
        ["measure", "Measure · instrumentation · thermal imaging", "Camera integration, tire-thermal development, live visualization, and distributed sensing."],
        ["validate", "Validate · track development", "Gingerman, Grattan, trackside work, service, data review, and on-track iteration."],
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

  function cleanLegacyDockListeners(rail) {
    Array.from(rail.children).forEach((item) => {
      if (!item.classList.contains("dock-item")) return;
      const cleanItem = item.cloneNode(true);
      item.replaceWith(cleanItem);
    });
  }

  function mediaDimensions(media) {
    if (media instanceof HTMLImageElement) return [media.naturalWidth, media.naturalHeight];
    if (media instanceof HTMLVideoElement) return [media.videoWidth, media.videoHeight];
    return [0, 0];
  }

  function applyMediaRatio(card, media) {
    const apply = () => {
      const [width, height] = mediaDimensions(media);
      if (!width || !height) return;
      const ratio = width / height;
      card.dataset.mediaRatio = String(ratio);
      card.classList.toggle("media-tall", ratio < .82);
      card.classList.toggle("media-wide", ratio > 1.45);
      card.classList.toggle("media-square", ratio >= .82 && ratio <= 1.45);
    };

    if (media instanceof HTMLImageElement) {
      if (media.complete) apply();
      else media.addEventListener("load", apply, { once: true });
    } else if (media instanceof HTMLVideoElement) {
      if (media.readyState >= 1) apply();
      else media.addEventListener("loadedmetadata", apply, { once: true });
    }
  }

  function classifyAllMedia() {
    document.querySelectorAll('body[data-page="home"] .media-card, body[data-page="home"] .dock-item').forEach((card) => {
      const media = card.querySelector('img, video');
      if (media) applyMediaRatio(card, media);
    });
  }

  function viewerCaptionFor(node) {
    const figure = node.closest('figure');
    const caption = figure?.querySelector('figcaption')?.textContent?.trim();
    return caption || node.getAttribute('alt') || node.getAttribute('title') || "";
  }

  function formatTime(value) {
    if (!Number.isFinite(value)) return "0:00";
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  function createViewer() {
    if (document.querySelector('.media-viewer')) return document.querySelector('.media-viewer');

    const viewer = document.createElement('div');
    viewer.className = 'media-viewer';
    viewer.setAttribute('role', 'dialog');
    viewer.setAttribute('aria-modal', 'true');
    viewer.setAttribute('aria-label', 'Media viewer');
    viewer.innerHTML = `
      <div class="media-viewer-panel">
        <button type="button" class="media-viewer-close" aria-label="Close media viewer">×</button>
        <div class="media-viewer-stage"></div>
        <div class="media-viewer-footer">
          <div class="media-viewer-caption"></div>
          <div class="media-viewer-controls">
            <button type="button" class="media-viewer-control media-viewer-play">Pause</button>
            <button type="button" class="media-viewer-control media-viewer-mute">Unmute</button>
            <input class="media-viewer-progress" type="range" min="0" max="1000" value="0" aria-label="Video position" />
            <span class="media-viewer-time">0:00 / 0:00</span>
          </div>
        </div>
      </div>`;
    document.body.appendChild(viewer);

    const close = () => {
      const activeVideo = viewer.querySelector('.media-viewer-stage video');
      activeVideo?.pause();
      viewer.classList.remove('is-open', 'is-video');
      viewer.querySelector('.media-viewer-stage').replaceChildren();
      document.body.classList.remove('media-viewer-open');
    };

    viewer.querySelector('.media-viewer-close').addEventListener('click', close);
    viewer.addEventListener('click', (event) => {
      if (event.target === viewer) close();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && viewer.classList.contains('is-open')) close();
    });

    viewer.__closeViewer = close;
    return viewer;
  }

  function openImageViewer(image) {
    const viewer = createViewer();
    const stage = viewer.querySelector('.media-viewer-stage');
    const display = document.createElement('img');
    display.src = image.currentSrc || image.src;
    display.alt = image.alt || viewerCaptionFor(image);
    stage.replaceChildren(display);
    viewer.querySelector('.media-viewer-caption').textContent = viewerCaptionFor(image);
    viewer.classList.remove('is-video');
    viewer.classList.add('is-open');
    document.body.classList.add('media-viewer-open');
    viewer.querySelector('.media-viewer-close').focus();
  }

  function openVideoViewer(sourceVideo) {
    const viewer = createViewer();
    const stage = viewer.querySelector('.media-viewer-stage');
    const video = document.createElement('video');
    const source = sourceVideo.currentSrc || sourceVideo.querySelector('source')?.src || sourceVideo.src;
    video.src = source;
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.autoplay = true;
    video.controls = false;
    stage.replaceChildren(video);

    const caption = viewerCaptionFor(sourceVideo);
    viewer.querySelector('.media-viewer-caption').textContent = caption;
    viewer.classList.add('is-open', 'is-video');
    document.body.classList.add('media-viewer-open');

    const playButton = viewer.querySelector('.media-viewer-play');
    const muteButton = viewer.querySelector('.media-viewer-mute');
    const progress = viewer.querySelector('.media-viewer-progress');
    const time = viewer.querySelector('.media-viewer-time');

    const syncControls = () => {
      playButton.textContent = video.paused ? 'Play' : 'Pause';
      muteButton.textContent = video.muted ? 'Unmute' : 'Mute';
      const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 0;
      progress.value = duration ? String(Math.round((video.currentTime / duration) * 1000)) : '0';
      time.textContent = `${formatTime(video.currentTime)} / ${formatTime(duration)}`;
    };

    playButton.onclick = () => {
      if (video.paused) video.play().catch(() => {});
      else video.pause();
      syncControls();
    };
    muteButton.onclick = () => {
      video.muted = !video.muted;
      syncControls();
    };
    progress.oninput = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      video.currentTime = (Number(progress.value) / 1000) * video.duration;
    };
    video.addEventListener('timeupdate', syncControls);
    video.addEventListener('play', syncControls);
    video.addEventListener('pause', syncControls);
    video.addEventListener('loadedmetadata', () => {
      if (Number.isFinite(sourceVideo.currentTime)) video.currentTime = sourceVideo.currentTime;
      syncControls();
    }, { once: true });
    video.play().catch(() => {});
    viewer.querySelector('.media-viewer-close').focus();
  }

  function decorateInspectableMedia() {
    document.querySelectorAll('body[data-page="home"] .media-card img, body[data-page="home"] .dock-item img, body[data-page="home"] .project-cover img').forEach((image) => {
      if (image.dataset.viewerReady === 'true') return;
      image.dataset.viewerReady = 'true';
      image.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        openImageViewer(image);
      });
    });

    document.querySelectorAll('body[data-page="home"] .media-card video, body[data-page="home"] .dock-item video').forEach((video) => {
      const card = video.closest('.media-card, .dock-item');
      if (!card || card.querySelector('.media-expand-button')) return;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'media-expand-button';
      button.setAttribute('aria-label', 'Open video in large viewer');
      button.textContent = '↗';
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        openVideoViewer(video);
      });
      card.appendChild(button);
    });
  }

  function setupLocalAutoplayVideos() {
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
        if (entry.isIntersecting && entry.intersectionRatio >= .16) video.play().catch(() => {});
        else video.pause();
      });
    }, { threshold: [0, .16, .45] });

    videos.forEach((video) => observer.observe(video));
  }

  function setupYouTubeAutoplayAndViewer() {
    document.querySelectorAll('body[data-page="home"] .youtube-embed iframe').forEach((iframe) => {
      try {
        const url = new URL(iframe.src);
        const videoId = url.pathname.split('/').filter(Boolean).pop();
        url.searchParams.set('autoplay', '1');
        url.searchParams.set('mute', '1');
        url.searchParams.set('playsinline', '1');
        url.searchParams.set('loop', '1');
        if (videoId) url.searchParams.set('playlist', videoId);
        iframe.src = url.toString();
        iframe.removeAttribute('allowfullscreen');
      } catch (_) {}
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
      const minWidth = Math.max(230, targetHeight * .52);
      const maxWidth = Math.min(1020, window.innerWidth * .74);
      const targetWidth = Math.max(minWidth, Math.min(maxWidth, targetHeight * ratio));
      card.style.setProperty('--rail-item-height', `${targetHeight}px`);
      card.style.setProperty('--rail-item-height-mobile', `${targetHeight}px`);
      card.style.setProperty('--rail-item-width', `${targetWidth}px`);
    };

    if (media instanceof HTMLImageElement) {
      if (media.complete) apply();
      else media.addEventListener('load', apply, { once: true });
    } else if (media instanceof HTMLVideoElement) {
      if (media.readyState >= 1) apply();
      else media.addEventListener('loadedmetadata', apply, { once: true });
    }
    card.__sizeForRail = apply;
  }

  function setupRailNavigation(rail, index) {
    rail.classList.add('showcase-rail');
    rail.setAttribute('aria-label', `Scrollable project gallery ${index + 1}`);

    Array.from(rail.querySelectorAll('.dock-item')).forEach(sizeRailItem);

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
      rail.__lastManualInteraction = Date.now();
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
    rail.__showcaseUpdateButtons = updateButtons;
    rail.addEventListener('scroll', () => {
      if (!buttonFrame) buttonFrame = requestAnimationFrame(updateButtons);
    }, { passive: true });

    /* Only a real horizontal/tilt-wheel gesture controls the rail.
       Ordinary up/down wheel input always remains normal page scrolling. */
    rail.addEventListener('wheel', (event) => {
      if (Math.abs(event.deltaX) < 1 || Math.abs(event.deltaX) < Math.abs(event.deltaY) * .55) return;
      markInteraction();
      event.preventDefault();
      rail.scrollBy({ left: event.deltaX * 1.15, behavior: 'auto' });
    }, { passive: false });

    rail.addEventListener('pointerdown', markInteraction, { passive: true });
    rail.addEventListener('touchstart', markInteraction, { passive: true });

    rail.__autoAdvance = window.setInterval(() => {
      if (document.hidden || document.body.classList.contains('media-viewer-open')) return;
      if (Date.now() - (rail.__lastManualInteraction || 0) < 8000) return;
      const section = rail.closest('.mode-section');
      if (section && getComputedStyle(section).display === 'none') return;
      const items = cards();
      if (items.length < 2) return;
      const nextIndex = (currentIndex() + 1) % items.length;
      goTo(nextIndex);
    }, 6000);

    window.addEventListener('resize', () => {
      cards().forEach((card) => card.__sizeForRail?.());
      updateButtons();
    }, { passive: true });

    requestAnimationFrame(updateButtons);
  }

  function refreshRailsAfterModeChange() {
    requestAnimationFrame(() => {
      document.querySelectorAll('.media-dock.showcase-rail').forEach((rail) => {
        rail.querySelectorAll('.dock-item').forEach((card) => card.__sizeForRail?.());
        rail.__showcaseUpdateButtons?.();
      });
    });
  }

  function initShowcaseRails() {
    document.querySelectorAll('.media-archive .media-dock').forEach((rail, index) => {
      cleanLegacyDockListeners(rail);
      setupRailNavigation(rail, index);
    });

    if ("MutationObserver" in window) {
      const modeObserver = new MutationObserver(refreshRailsAfterModeChange);
      modeObserver.observe(document.body, { attributes: true, attributeFilter: ['class', 'data-mode'] });
    }
  }

  function initShowcaseV4() {
    updateShowcaseCopy();
    initShowcaseRails();
    classifyAllMedia();
    setupLocalAutoplayVideos();
    setupYouTubeAutoplayAndViewer();
    decorateInspectableMedia();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initShowcaseV4);
  else initShowcaseV4();
})();
