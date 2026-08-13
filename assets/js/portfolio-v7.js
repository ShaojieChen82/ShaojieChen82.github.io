/* Portfolio v7 — deterministic media selection, case-study structure, and viewport-stable viewer. */

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

  function titleForPath(path) {
    const filename = decodeURIComponent(path.split('/').pop() || path);
    if (TITLES[filename]) return TITLES[filename];
    if (typeof mediaTitle === 'function') return mediaTitle(path);
    return filename.replace(/\.[^.]+$/, '');
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
    document.querySelectorAll('body[data-page="home"] .media-card video, body[data-page="home"] .dock-item video').forEach((video) => {
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
      document.querySelectorAll('body[data-page="home"] .media-card video, body[data-page="home"] .dock-item video').forEach((video) => video.play().catch(() => {}));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting && entry.intersectionRatio >= .14) video.play().catch(() => {});
        else video.pause();
      });
    }, { threshold: [0, .14, .45] });

    document.querySelectorAll('body[data-page="home"] .media-card video, body[data-page="home"] .dock-item video').forEach((video) => observer.observe(video));
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

    const close = () => closeViewer(viewer);
    viewer.querySelector('.media-viewer-v7-close').addEventListener('click', close);
    viewer.addEventListener('click', (event) => {
      if (event.target === viewer) close();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && viewer.classList.contains('is-open')) close();
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

    /* Overflow locking should preserve scroll position by itself. This correction is only
       a guard against browser focus/anchor behavior and is forced to be non-animated. */
    const moved = Math.abs(window.scrollY - lock.y) > 1 || Math.abs(window.scrollX - lock.x) > 1;
    if (moved) {
      const previousBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';
      window.scrollTo(lock.x, lock.y);
      requestAnimationFrame(() => {
        root.style.scrollBehavior = previousBehavior || lock.rootScrollBehavior;
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
    const activeVideo = viewer.querySelector('.media-viewer-v7-stage video');
    activeVideo?.pause();
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
      if (Number.isFinite(video.duration) && video.duration > 0) {
        video.currentTime = Number(progress.value) / 1000 * video.duration;
      }
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

  function normalizeOverviewCopy() {
    const motorsportIntro = document.querySelector('.home-showcase[data-mode-section="motorsport"] .showcase-intro');
    if (motorsportIntro) motorsportIntro.textContent = 'The projects follow one development loop: hardware, controls, instrumentation, and track iteration.';
  }

  function initV7() {
    setExactTitles();
    rerenderDetailGroups();
    organizeCaseStudies();
    annotateMediaRatios();
    removeLegacyExpandButtons();
    addExpandButtons();
    setMutedAutoplay();
    normalizeOverviewCopy();
    installViewerCapture();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initV7);
  } else {
    initV7();
  }
})();
