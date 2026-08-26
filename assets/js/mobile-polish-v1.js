(() => {
  if (!window.matchMedia("(max-width: 767px)").matches) return;

  function polishFAQ() {
    if (document.body?.dataset.page !== "faq") return;
    const paragraph = document.querySelector(".mobile-v3-root .mv3-faq-card:first-child p");
    if (!paragraph || paragraph.dataset.mobileAligned === "true") return;
    paragraph.dataset.mobileAligned = "true";
    paragraph.className = "mv3-background-lines";
    paragraph.innerHTML = `
      <span class="mv3-background-line"><strong>Shanghai, China</strong><span>— born and raised.</span></span>
      <span class="mv3-background-line"><strong>Miami, FL</strong><span>— B.S. and M.S. in Mechanical Engineering at the University of Miami.</span></span>
      <span class="mv3-background-line"><strong>Detroit, MI</strong><span>— engineering work at Enginuity Power Systems.</span></span>`;
  }

  function apply() { polishFAQ(); }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply, { once: true });
  } else {
    apply();
  }

  const observer = new MutationObserver(apply);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
