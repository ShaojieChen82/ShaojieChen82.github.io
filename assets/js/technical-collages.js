/* Approved technical-image viewer. Original files remain available at full resolution. */
(() => {
  let dialog, image, title, label, counter, previous, next, zoom, stage;
  let group, index = 0, lastTrigger, pageLock, touchX = null;
  function lockPage() {
    const root = document.documentElement, body = document.body;
    pageLock = {x: scrollX, y: scrollY, rootOverflow: root.style.overflow,
      bodyOverflow: body.style.overflow, padding: body.style.paddingRight,
      scrollBehavior: root.style.scrollBehavior};
    const scrollbar = Math.max(0, innerWidth - root.clientWidth);
    root.style.scrollBehavior = "auto";
    root.style.overflow = "hidden"; body.style.overflow = "hidden";
    if (scrollbar) body.style.paddingRight = `${parseFloat(getComputedStyle(body).paddingRight) + scrollbar}px`;
  }
  function unlockPage() {
    const lock = pageLock;
    if (!lock) return;
    const root = document.documentElement, body = document.body;
    root.style.overflow = lock.rootOverflow; body.style.overflow = lock.bodyOverflow;
    body.style.paddingRight = lock.padding;
    root.style.scrollBehavior = "auto";
    window.scrollTo(lock.x, lock.y);
    if (lastTrigger?.isConnected) lastTrigger.focus({preventScroll: true});
    requestAnimationFrame(() => {
      window.scrollTo(lock.x, lock.y);
      root.style.scrollBehavior = lock.scrollBehavior;
    });
    pageLock = null;
  }
  function findGroup(id) {
    return window.MS_CONTENT?.projects.flatMap(p => [p.feature, ...p.support, ...(p.analysis || [])]).find(m => m.technical && m.id === id);
  }
  function setZoom(active) {
    stage.classList.toggle("zoomed", active);
    zoom.setAttribute("aria-pressed", String(active));
    zoom.setAttribute("aria-label", active ? "Fit image to screen" : "Zoom image");
    if (active) stage.scrollLeft = (stage.scrollWidth - stage.clientWidth) / 2;
    else { stage.scrollLeft = 0; stage.scrollTop = 0; }
  }
  function render() {
    const panel = group.panels[index];
    image.src = encodeURI(panel.src); image.alt = panel.caption;
    title.textContent = panel.caption; label.textContent = group.title;
    counter.textContent = `${index + 1} / ${group.panels.length}`;
    previous.disabled = index === 0; next.disabled = index === group.panels.length - 1;
    setZoom(false);
  }
  function move(delta) {
    const target = index + delta;
    if (target < 0 || target >= group.panels.length) return;
    index = target; render();
  }
  function createViewer() {
    dialog = document.createElement("dialog");
    dialog.className = "technical-viewer";
    dialog.setAttribute("aria-labelledby", "technical-viewer-title");
    dialog.innerHTML = "\n    <div class=\"technical-viewer-header\"><div><span class=\"technical-viewer-group\"></span><h2 id=\"technical-viewer-title\"></h2></div><div class=\"technical-viewer-controls\"><button class=\"technical-viewer-zoom\" aria-label=\"Zoom image\" aria-pressed=\"false\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" aria-hidden=\"true\"><circle cx=\"10.5\" cy=\"10.5\" r=\"6.5\"/><path d=\"m16 16 5 5M7 10.5h7M10.5 7v7\"/></svg></button><button class=\"technical-viewer-close\" aria-label=\"Close image viewer\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" aria-hidden=\"true\"><path d=\"m6 6 12 12M6 18 18 6\"/></svg></button></div></div>\n    <div class=\"technical-viewer-stage\"><img alt=\"\"></div>\n    <div class=\"technical-viewer-footer\"><span class=\"technical-viewer-position\" aria-live=\"polite\"></span><span class=\"swipe-hint\" lang=\"zh-CN\">Swipe or use arrows</span><div class=\"technical-viewer-controls\"><button class=\"previous\" aria-label=\"Previous image\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" aria-hidden=\"true\"><path d=\"m14 6-6 6 6 6\"/></svg></button><button class=\"next\" aria-label=\"Next image\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" aria-hidden=\"true\"><path d=\"m10 6 6 6-6 6\"/></svg></button></div></div>\n  ";
    document.body.appendChild(dialog);
    image = dialog.querySelector(".technical-viewer-stage img");
    title = dialog.querySelector("#technical-viewer-title");
    label = dialog.querySelector(".technical-viewer-group");
    counter = dialog.querySelector(".technical-viewer-position");
    previous = dialog.querySelector(".previous"); next = dialog.querySelector(".next");
    zoom = dialog.querySelector(".technical-viewer-zoom"); stage = dialog.querySelector(".technical-viewer-stage");
    dialog.querySelector(".technical-viewer-close").addEventListener("click", () => dialog.close());
    dialog.addEventListener("close", () => {
      unlockPage();
    });
    dialog.addEventListener("click", event => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
    previous.addEventListener("click", () => move(-1)); next.addEventListener("click", () => move(1));
    dialog.addEventListener("keydown", event => {
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault(); event.stopPropagation(); move(event.key === "ArrowRight" ? 1 : -1);
      }
      if (event.key === "Escape") event.stopPropagation();
    });
    zoom.addEventListener("click", () => setZoom(!stage.classList.contains("zoomed")));
    image.addEventListener("dblclick", event => { event.preventDefault(); setZoom(!stage.classList.contains("zoomed")); });
    stage.addEventListener("touchstart", event => { touchX = event.touches.length === 1 ? event.touches[0].clientX : null; }, {passive: true});
    stage.addEventListener("touchend", event => {
      if (touchX === null) return;
      const delta = event.changedTouches[0].clientX - touchX; touchX = null;
      if (!stage.classList.contains("zoomed") && Math.abs(delta) > 50) move(delta < 0 ? 1 : -1);
    }, {passive: true});
  }
  document.addEventListener("click", event => {
    const trigger = event.target instanceof Element ? event.target.closest("[data-technical-index]") : null;
    const figure = trigger?.closest("[data-technical-group]");
    if (!figure) return;
    const selected = findGroup(figure.dataset.technicalGroup);
    const selectedIndex = Number(trigger.dataset.technicalIndex);
    if (!selected || !Number.isInteger(selectedIndex) || !selected.panels[selectedIndex]) return;
    event.preventDefault(); event.stopImmediatePropagation();
    if (!dialog) createViewer();
    group = selected; index = selectedIndex; lastTrigger = trigger;
    lockPage(); render(); dialog.showModal();
  }, true);
})();
