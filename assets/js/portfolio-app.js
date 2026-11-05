/* Portfolio v1: one content source, one state owner, responsive presentation. */
(() => {
  'use strict';
  const S = window.PortfolioState;
  const app = document.getElementById('portfolio-app');
  if (!app || !S || !window.CHP_CONTENT || !window.MS_CONTENT) return;
  const MODE_KEY = 'sc-portfolio-mode';
  const scrollPositions = new Map();
  let activeFilter = 'all';
  let mediaItems = [];
  let mediaIndex = 0;
  let state;
  const store = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch { /* URL state remains usable without storage. */ } }
  };
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const path = value => esc(encodeURI(value));
  const iconPaths = {
    overview: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    work: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v3h4v-3"/>',
    about: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
    connect: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    back: '<path d="m12 5-7 7 7 7M5 12h14"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h5"/>',
    copy: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
    external: '<path d="M15 3h6v6m0-6L10 14M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4"/>',
    play: '<path d="m9 5 11 7-11 7z"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2A20 20 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z"/>'
  };
  const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || iconPaths.arrow}</svg>`;
  const link = (view, mode = state.mode, id) => S.href(view, mode, id);
  const isMS = () => state.mode === 'motorsport';
  const resume = mode => mode === 'motorsport' ? 'assets/files/Shaojie_Chen_Resume_Motorsport.pdf' : 'assets/files/Shaojie_Chen_Resume_Microgrid_CHP.pdf';
  const projects = () => {
    const source = isMS() ? window.MS_CONTENT.projects : window.CHP_CONTENT.projects;
    const order = isMS() ? S.motorsportIds : S.energyIds;
    return order.map(id => source.find(p => p.id === id)).filter(Boolean);
  };
  const meta = {
    hems: { category:'test', role:'Independent platform build', stage:'Built & benchmark tested', summary:'Designed and assembled the mechanical and electrical platform, then led benchmark testing.', result:'A complete engine / PMG benchmark platform and reference data for in-house engine development.' },
    e200: { category:'controls', role:'Controls, commissioning & field support', stage:'Commissioning & field work', summary:'Radiator controls, PID tuning, ComAp integration and field software-update workflows.', result:'Radiator control carried from implementation through commissioning and PID tuning, alongside controller and field-update support.' },
    e8kw: { category:'integration', role:'Controls & hardware prototyping', stage:'Prototype development', summary:'Modbus SOC control, mechanical prototypes and engine-generator integration.', result:'SOC-based supervisory logic and physical prototypes supporting E8kW integration and testing.' },
    daq: { category:'test', role:'Measurement workflows & custom interfaces', stage:'Bench & system testing', summary:'Dewesoft measurement workflows with custom signal-conditioning hardware.', result:'Synchronized measurements and custom signal interfaces for prototype investigation and integration decisions.' },
    inverter: { category:'integration', role:'AC / DC test setup & evaluation', stage:'Instrumented validation', summary:'Measured source transfer, charging, ripple and load response in an integrated power system.', result:'Measured operating behavior translated into generator, inverter, battery and control architecture recommendations.' },
    comap: { category:'controls', role:'Connectivity & service workflows', stage:'Deployment & service support', summary:'AirGate, WebSupervisor, controller connectivity and field-usable documentation.', result:'Remote-monitoring, troubleshooting and update workflows for engineering and service teams.' },
    'c7-aero': { category:'build', role:'Personal C7 development project', stage:'Built · Bench + road evaluated', summary:'Composite aero hardware and an actuator experiment that exposed a speed-versus-holding tradeoff.', result:'The tested servo moved faster on the bench, but road evaluation exposed insufficient holding torque and no self-locking.' },
    'can-controls': { category:'controls', role:'PCB, embedded controls & HMI', stage:'V2 · Bench + road tested', summary:'A hand-assembled controller with CAN inputs, position feedback and explicit STOP priority.', result:'A designed, assembled and debugged V2 controller prototype. V1 was track-tested; V2 has not yet been track-tested.' },
    sensors: { category:'test', role:'Distributed sensing & HMI prototyping', stage:'Bench prototype', summary:'Visible / infrared bench prototypes, refined toward infrared-only tire sensing and an iOS HMI.', result:'Working bench demonstrations informed a narrower infrared-only sensing architecture. Track validation remains future work.' },
    'track-data': { category:'validation', role:'V1 track development & iteration', stage:'V1 · Track tested', summary:'Gingerman and Grattan sessions, PDR / Pi Toolbox review, setup checks and trackside troubleshooting.', result:'V1 active-aero track use supported data review, driver feedback and hardware iteration.' }
  };
  function nav(bottom = false) {
    return `<nav class="${bottom ? 'bottom-nav' : 'desktop-nav'}" aria-label="${bottom ? 'Mobile' : 'Primary'} navigation">${[
      ['overview','Overview'], ['work','Work'], ['about','About'], ['connect','Connect']
    ].map(([view, label]) => `<a data-route href="${link(view)}" ${state.view === view || (view === 'work' && state.view === 'case') ? 'aria-current="page"' : ''}>${bottom ? icon(view) : ''}<span>${label}</span></a>`).join('')}</nav>`;
  }
  function header() {
    return `<header class="app-header"><div class="header-inner"><a data-route class="brand" href="${link('overview')}" aria-label="Shaojie Chen overview"><span class="brand-mark">SC<span>.</span></span><span>Shaojie Chen<small>ENGINEERING PORTFOLIO</small></span></a>${nav()}<div class="desktop-modes" aria-label="Portfolio direction"><button data-mode-target="professional" aria-pressed="${!isMS()}">Energy</button><button data-mode-target="motorsport" aria-pressed="${isMS()}">Motorsport</button></div><button class="mobile-mode-button" data-action="mode" aria-haspopup="dialog">${isMS() ? 'Motorsport' : 'Energy'}${icon('down')}</button></div></header>`;
  }
  function projectRow(p, index, compact = false) {
    const m = meta[p.id];
    const image = p.feature.type === 'video' ? p.feature.poster : p.feature.small || p.feature.src;
    return `<a data-route href="${link('case',state.mode,p.id)}" class="project-row home-project-link ${compact ? 'compact' : ''}"><div class="project-thumb"><img src="${path(image)}" loading="lazy" alt="${esc(p.feature.caption)}"/></div><div class="project-row-copy"><span class="project-row-kicker">${String(index + 1).padStart(2,'0')} / ${esc(m.role)}</span><h3>${esc(p.shortTitle)}</h3><p>${esc(m.summary)}</p><span class="stage">${esc(m.stage)}</span></div><span class="row-arrow">${icon('arrow')}</span></a>`;
  }
  function proofStrip() {
    const facts = isMS() ? [['V1','Track tested'],['V2','Bench + road'],['IR','Bench prototype']] : [['200 kW','CHP field work'],['8 kW','Prototype development'],['DAQ','Custom interfaces']];
    return `<div class="proof-strip" aria-label="Engineering experience">${facts.map(([n,l])=>`<div><strong>${n}</strong><span>${l}</span></div>`).join('')}</div>`;
  }
  function overview() {
    const ps = projects();
    const feature = ps[0].feature;
    return `<section class="overview-hero"><div class="hero-copy"><p class="eyebrow">${isMS() ? 'MOTORSPORT / VEHICLE SYSTEMS' : 'ENERGY / SYSTEMS INTEGRATION'}</p><h1>${isMS() ? 'Built in the garage.<br>Proven through testing.' : 'Complex hardware.<br>Working systems.'}</h1><p class="hero-description">${isMS() ? 'Mechanical design, embedded controls and instrumentation. My C7 is the development platform that brings them together.' : 'I connect mechanical, electrical and control systems—from prototype builds and instrumented testing to commissioning and field support.'}</p><div class="hero-actions"><a class="button primary resume-open-button" href="${resume(state.mode)}" target="_blank" rel="noopener">${icon('file')}View resume</a><a data-route class="button secondary" href="${link('connect')}">Let’s connect ${icon('arrow')}</a></div><p class="hero-location">Detroit, MI <span>·</span> B.S. + M.S. Mechanical Engineering</p></div><figure class="hero-hardware"><img src="${path(feature.small || feature.src)}" alt="${esc(feature.caption)}" fetchpriority="high"/><figcaption><span>${isMS() ? 'C7 / PERSONAL DEVELOPMENT PLATFORM' : 'ENGINE / PMG BENCHMARK PLATFORM'}</span><span>${isMS() ? 'Design → build → test' : 'Independently designed & assembled'}</span></figcaption></figure></section>${proofStrip()}<section class="selected-work" aria-labelledby="selected-title"><div class="section-top"><div><p class="eyebrow">SELECTED WORK</p><h2 id="selected-title">${isMS() ? 'Four parts. One development loop.' : 'Hands-on, across the system.'}</h2></div><a data-route class="text-link" href="${link('work')}">All ${ps.length} projects ${icon('arrow')}</a></div><div class="selected-list">${ps.slice(0,isMS()?4:3).map((p,i)=>projectRow(p,i,true)).join('')}</div></section><section class="overview-note"><div><p class="eyebrow">THE COMMON THREAD</p><h2>Build. Measure. Understand. Improve.</h2></div><p>${isMS() ? 'The same systems approach connects my professional energy work with my personal vehicle development: hardware, controls, useful measurements and practical validation.' : 'These are selected contributions from a broader energy-systems program. Each case separates my work, the validation approach and the delivered outcome.'}</p><a data-route href="${link('about')}" class="text-link">A little more about me ${icon('arrow')}</a></section>`;
  }
  function work() {
    const filters = isMS() ? [['all','All work'],['build','Build'],['controls','Control'],['test','Measure'],['validation','Validate']] : [['all','All work'],['integration','Integration'],['controls','Controls'],['test','Test & DAQ']];
    const ps = projects().filter(p => activeFilter === 'all' || meta[p.id].category === activeFilter);
    return `<section class="work-page"><div class="page-heading"><p class="eyebrow">${isMS() ? 'MOTORSPORT / C7 DEVELOPMENT' : 'CHP / MICROGRID ENGINEERING'}</p><h1>Selected engineering work<span class="heading-count">${projects().length}</span></h1><p>${isMS() ? 'Personal development projects, with the validation stage called out for each.' : 'Selected projects from my energy-systems work. Individual contributions and supporting evidence inside.'}</p></div><div class="filter-bar" aria-label="Filter projects">${filters.map(([key,label])=>`<button data-filter="${key}" aria-pressed="${activeFilter===key}">${label}</button>`).join('')}</div><div class="work-list" aria-live="polite">${ps.map(p=>projectRow(p,projects().indexOf(p))).join('')}</div></section>`;
  }
  function flattenMedia(p) { return [p.feature,...p.support].flatMap(m => m.panels || [m]); }
  function mediaTile(m, index, feature = false) {
    const image = m.type === 'video' ? m.poster : m.small || m.src;
    return `<figure class="evidence-tile media-card ${feature ? 'feature-evidence' : ''}"><button class="media-open" data-media="${index}" aria-label="${m.type === 'video' ? 'Play video' : 'Enlarge image'}: ${esc(m.caption)}">${image ? `<img src="${path(image)}" alt="${esc(m.caption)}" loading="${feature?'eager':'lazy'}"/>` : `<span class="video-placeholder">Video evidence</span>`}${m.type === 'video' ? `<span class="play-badge">${icon('play')}<span>Watch test</span></span>` : `<span class="expand-badge">${icon('external')}</span>`}</button><figcaption>${esc(m.caption)}</figcaption></figure>`;
  }
  function caseStudy() {
    const p = projects().find(p => p.id === state.id);
    if (!p) return work();
    const m = meta[p.id];
    mediaItems = flattenMedia(p);
    const next = projects()[(projects().indexOf(p)+1)%projects().length];
    return `<article class="case-page"><a data-route class="back-link" href="${link('work')}">${icon('back')}All ${isMS()?'Motorsport':'Energy'} work</a><div class="case-heading"><p class="eyebrow">${esc(p.eyebrow)}</p><h1>${esc(p.title)}</h1><p class="case-intro">${esc(p.intro)}</p><div class="case-facts"><div><span>MY ROLE</span><strong>${esc(m.role)}</strong></div><div><span>VALIDATION STAGE</span><strong>${esc(m.stage)}</strong></div></div></div><div class="case-layout"><div class="case-narrative"><section class="outcome"><p class="eyebrow">${p.id==='c7-aero'?'KEY FINDING':'DELIVERED / LEARNED'}</p><p>${esc(m.result)}</p></section><nav class="case-jump" aria-label="Case sections"><a href="#story">Engineering story</a><a href="#evidence">Evidence <span>${mediaItems.length}</span></a></nav><div id="story">${p.story.map((block,i)=>`<section class="story-block" id="story-${i}"><h2>${esc(block.label)}</h2>${block.items ? `<ul>${block.items.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>` : `<p>${esc(block.text)}</p>`}</section>`).join('')}</div>${p.flow ? `<section class="control-flow"><h2>Control path</h2><ol>${p.flow.map(s=>`<li>${esc(s)}</li>`).join('')}</ol></section>` : ''}</div><aside class="case-feature">${mediaTile(mediaItems[0],0,true)}<p class="evidence-caption">${isMS() ? 'Personal development work. Bench, road and track stages are distinguished in the case.' : 'Selected evidence from the wider development program; descriptions identify my contribution.'}</p></aside></div><section class="case-evidence" id="evidence"><div class="section-top"><div><p class="eyebrow">SUPPORTING EVIDENCE</p><h2>Hardware, tests & observations.</h2></div><span class="media-count">${mediaItems.length} selected items</span></div><div class="media-grid">${mediaItems.slice(1,7).map((m,i)=>mediaTile(m,i+1)).join('')}</div>${mediaItems.length>7 ? `<details class="more-evidence"><summary>More supporting media (${mediaItems.length-7})</summary><div class="media-grid">${mediaItems.slice(7).map((m,i)=>mediaTile(m,i+7)).join('')}</div></details>`:''}</section><div class="case-next"><div><span class="eyebrow">NEXT CASE</span><a data-route href="${link('case',state.mode,next.id)}">${esc(next.shortTitle)} ${icon('arrow')}</a></div><a class="button secondary resume-open-button" href="${resume(state.mode)}" target="_blank" rel="noopener">${icon('file')}View resume</a></div></article>`;
  }
  function countdown() {
    const days = S.daysUntil('2026-11-30');
    if (days < 0) return '<strong class="count-value">Update pending</strong><span>Planning target has passed</span>';
    return `<strong class="count-value">${days===0?'Today':`${days}<small>days</small>`}</strong><span>${days===0?'Offer planning target':'to offer planning target'}</span>`;
  }
  function hiringTimeline() {
    return `<section class="hiring-panel" id="hiring" aria-labelledby="hiring-title"><div class="hiring-heading"><div><p class="eyebrow">HIRING NOTES</p><h2 id="hiring-title">Let’s plan the transition.</h2></div><span class="status-label">Open to opportunities</span></div><p>I’m currently on H-1B and need employer-supported H-1B transfer coordination.</p><div class="hiring-summary"><div class="countdown" data-countdown>${countdown()}</div><div><span class="eyebrow">OFFER PLANNING TARGET</span><strong><time datetime="2026-11-30">November 30, 2026</time></strong><span>Target for an accepted offer and employer / counsel kickoff.</span></div></div><ol class="hiring-steps"><li class="current"><span class="step-dot"></span><div><strong>Connect & interview</strong><span>Discuss the role and engineering fit.</span></div><span class="step-state">Now</span></li><li><span class="step-dot"></span><div><strong>Offer & counsel kickoff</strong><span>Planning target · Nov 30</span></div></li><li><span class="step-dot"></span><div><strong>Prepare & file petition</strong><span>Internal planning target · Dec 18</span></div></li><li class="estimated"><span class="step-dot"></span><div><strong>Estimated grace-period end</strong><span>Dec 29, 2026 · counsel confirmation pending</span></div></li></ol><p class="planning-note">Planning estimates, not confirmed legal deadlines. Dec 29 assumes an Oct 30 employment end and the full 60-calendar-day period. An offer alone does not extend the period. Filing requirements and dates must be confirmed with immigration counsel. Updated Nov 5, 2026; countdown uses Eastern Time.</p><a data-route class="text-link" href="${link('connect')}">Discuss a role ${icon('arrow')}</a></section>`;
  }
  function about() {
    const keywords = isMS() ? ['Active aero','CAN / ESP32','Closed-loop actuation','PCB / HMI','Composites','PDR / Pi Toolbox','Thermal sensing','Track development'] : ['CHP / Microgrid','Engine-generator integration','BESS / Inverter validation','DAQ / Instrumentation','ComAp IG500 / IG1000','Modbus / CAN','Thermal management','Commissioning'];
    return `<section class="about-intro"><div><p class="eyebrow">ABOUT / FAQ</p><h1>Engineer by trade.<br>Builder by instinct.</h1><p>I like the point where an idea becomes a working piece of hardware—and the testing that tells you what to do next.</p></div><img src="assets/img/background/CHPMicrogrid_background-1280.webp" alt="Shaojie Chen" class="about-portrait"/></section><div class="about-layout"><div class="about-stories"><section class="about-group"><p class="eyebrow">BACKGROUND</p><h2>From Shanghai to the test bench.</h2><dl class="background-list"><div><dt>Shanghai, China</dt><dd>Born and raised.</dd></div><div><dt>Miami, FL</dt><dd>B.S. and M.S. in Mechanical Engineering, University of Miami.</dd></div><div><dt>Detroit, MI</dt><dd>Engineering work at Enginuity Power Systems; now exploring my next role.</dd></div></dl></section><section class="about-group personality"><p class="eyebrow">OUTSIDE THE LAB</p><h2>Off the clock.</h2><div class="faq-answer"><h3>What motivates you?</h3><p>Overcoming technical difficulties and the sense of accomplishment that comes from making a system work.</p></div><div class="faq-answer garage-goals"><h3>What’s next in your garage?</h3><div><span><small>SHORT TERM</small><strong>C8 Z06</strong></span><span><small>LONG TERM</small><strong>GT3 RS</strong></span></div></div></section><section class="about-group patent"><p class="eyebrow">PATENT APPLICATION</p><h2>Methods and Devices for Selecting a Power Source</h2><p>Power-source selection methods and devices. Application reference: 3135-034US1. Assignment recorded May 28, 2026.</p><details><summary>View assignment recordation</summary><a href="assets/files/Patent%20Screenshot.webp" target="_blank" rel="noopener"><img loading="lazy" src="assets/files/Patent%20Screenshot-960.webp" alt="First page of the patent assignment recordation"/></a></details></section></div>${hiringTimeline()}</div><section class="keywords" id="${isMS()?'keywords-motorsport':'keywords'}"><p class="eyebrow">TOOLS & DOMAINS</p><h2>Where I spend my engineering time.</h2><div>${keywords.map(k=>`<span>${k}</span>`).join('')}</div><a data-route href="${link('work')}" class="text-link">See the work behind the keywords ${icon('arrow')}</a></section>`;
  }
  function resumeCard(mode, primary) {
    return `<a class="resume-item resume-open-button ${primary?'recommended':''}" href="${resume(mode)}" target="_blank" rel="noopener"><span class="contact-icon">${icon('file')}</span><span><span class="item-label">${primary?'CURRENT DIRECTION':'ALSO AVAILABLE'} · PDF</span><strong>${mode==='motorsport'?'Motorsport':'Energy Systems'} Resume</strong><span>${mode==='motorsport'?'Active aero · CAN · Instrumentation · Track development':'CHP · Microgrid · Controls · Validation'}</span></span>${icon('external')}</a>`;
  }
  function connect() {
    return `<section class="connect-intro"><p class="eyebrow">CONNECT</p><h1>Let’s talk engineering.</h1><p>Systems integration, hands-on development and useful measurements. Let’s talk about what your team is building.</p></section><div class="connect-layout"><section class="connect-resumes" id="resumes"><p class="eyebrow">START WITH THE RESUME</p><h2>The right context, in one PDF.</h2><div class="resume-list">${resumeCard(state.mode,true)}${resumeCard(isMS()?'professional':'motorsport',false)}</div><a data-route class="hiring-link" href="${link('about')}#hiring"><span class="status-dot"></span>H-1B transfer support required<span>View hiring notes ${icon('arrow')}</span></a></section><section class="contact-methods"><p class="eyebrow">GET IN TOUCH</p><h2>Direct is good.</h2><div class="contact-method"><a href="mailto:cheerioov2@gmail.com"><span class="contact-icon">${icon('connect')}</span><span><small>EMAIL</small><strong>cheerioov2@gmail.com</strong></span></a><button data-action="copy-email" class="icon-button" aria-label="Copy email address">${icon('copy')}</button></div><a class="contact-method" href="https://www.linkedin.com/in/shaojie-chen-332496206/" target="_blank" rel="noopener"><span class="contact-icon">${icon('external')}</span><span><small>LINKEDIN</small><strong>Shaojie Chen</strong></span>${icon('arrow')}</a><a class="contact-method" href="tel:+13053105596"><span class="contact-icon">${icon('phone')}</span><span><small>PHONE</small><strong>305-310-5596</strong></span>${icon('arrow')}</a><p class="location-note">Based in Detroit, Michigan.</p></section></div>`;
  }
  function footer() {
    return `<footer class="app-footer"><span>© ${new Date().getFullYear()} Shaojie Chen</span><span>Mechanical · Electrical · Controls · Validation</span><details><summary>Portfolio & privacy notes</summary><p>Selected public, personally generated or appropriately cleared project material. Descriptions identify individual contributions and validation stages.</p><p>For analytics and abuse prevention, the site records technical visit information including IP address, approximate IP-derived location, browser/device information, referrer, pages and meaningful interactions. A first-party anonymous browser ID groups repeat visits. No raw mouse tracking, keystroke recording or session replay. Submitted feedback is kept private and is not published automatically.</p></details></footer>`;
  }
  function render({restore = false} = {}) {
    state = S.route(new URL(location.href),store.get(MODE_KEY));
    // Normalize legacy links before in-case anchors can replace their project hash.
    const canonical = new URL(location.href);
    canonical.searchParams.set('mode',isMS()?'motorsport':'chp');
    if (state.view === 'case') canonical.searchParams.set('case',state.id);
    else canonical.searchParams.delete('case');
    if (canonical.href !== location.href) history.replaceState(history.state,'',canonical);
    store.set(MODE_KEY,state.mode);
    document.body.className = `portfolio-app mode-${state.mode}`;
    document.body.dataset.mode = state.mode;
    document.body.dataset.view = state.view;
    document.body.dataset.page = state.view === 'about' ? 'faq' : state.view === 'connect' ? 'contact' : 'home';
    document.documentElement.style.colorScheme = isMS() ? 'dark' : 'light';
    const title = state.view === 'case' ? projects().find(p=>p.id===state.id)?.shortTitle : ({overview:'Engineering Portfolio',work:'Selected Work',about:'About & FAQ',connect:'Connect / Resume'}[state.view]);
    document.title = `${title} | Shaojie Chen`;
    const content = state.view === 'case' ? caseStudy() : state.view === 'work' ? work() : state.view === 'about' ? about() : state.view === 'connect' ? connect() : overview();
    const feedback = document.getElementById('feedback');
    // Keep the original form nodes and their submission listeners across mode changes.
    if (feedback) feedback.remove();
    app.innerHTML = `${header()}<main class="app-main" id="main-content" tabindex="-1">${content}</main>${footer()}${nav(true)}`;
    if (feedback) document.querySelector('.connect-layout')?.after(feedback);
    if (restore) requestAnimationFrame(()=>window.scrollTo(0,scrollPositions.get(location.href)||0));
    refreshCountdown();
  }
  function rememberPosition() { scrollPositions.set(location.href,window.scrollY); }
  function navigate(url) {
    rememberPosition();
    const current = state;
    const next = S.route(url,store.get(MODE_KEY));
    // Native page navigation keeps feedback forms and browser history predictable.
    if (url.pathname !== location.pathname) { location.href=url.href; return; }
    const restoring = next.view === 'work' && current.view === 'case';
    history.pushState({portfolio:true},'',url);
    render({restore:restoring});
    if (!restoring) window.scrollTo(0,0);
    document.getElementById('main-content').focus({preventScroll:true});
  }
  const modeDialog = document.getElementById('mode-dialog');
  const mediaDialog = document.getElementById('media-dialog');
  function closeMedia() {
    mediaDialog.querySelector('video')?.pause();
    mediaDialog.close();
    mediaDialog.querySelector('.viewer-stage').replaceChildren();
  }
  function showMedia(index) {
    mediaIndex = (index+mediaItems.length)%mediaItems.length;
    const m = mediaItems[mediaIndex];
    const stage = mediaDialog.querySelector('.viewer-stage');
    stage.querySelector('video')?.pause();
    stage.innerHTML = m.type === 'video' ? `<video controls playsinline preload="metadata" ${m.poster?`poster="${path(m.poster)}"`:''} aria-label="${esc(m.caption)}"><source src="${path(m.src)}" type="video/mp4"/>Your browser cannot play this video. Use Open original.</video>` : `<img src="${path(m.src)}" alt="${esc(m.caption)}"/>`;
    mediaDialog.querySelector('.viewer-caption').textContent = m.caption;
    mediaDialog.querySelector('.viewer-count').textContent = `${mediaIndex+1} / ${mediaItems.length}`;
    mediaDialog.querySelector('.viewer-original').href = encodeURI(m.src);
    mediaDialog.querySelector('[data-action="media-prev"]').disabled = mediaItems.length < 2;
    mediaDialog.querySelector('[data-action="media-next"]').disabled = mediaItems.length < 2;
    if (!mediaDialog.open) mediaDialog.showModal();
  }
  document.addEventListener('click',async event=> {
    const el = event.target.closest('a,button');
    if (!el) return;
    if (el.hasAttribute('data-route') && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && event.button===0) {
      event.preventDefault(); navigate(new URL(el.href,location.href)); return;
    }
    if (el.dataset.filter) {
      activeFilter=el.dataset.filter;
      const y=window.scrollY;
      render(); window.scrollTo(0,y);
      app.querySelector(`[data-filter="${activeFilter}"]`)?.focus({preventScroll:true});
      return;
    }
    if (el.dataset.modeTarget) {
      const next=S.normalizeMode(el.dataset.modeTarget);
      store.set(MODE_KEY,next);
      if (modeDialog.open) modeDialog.close();
      activeFilter='all';
      navigate(new URL(S.href(state.view==='case'?'work':state.view,next),location.href));
      return;
    }
    if (el.dataset.media!==undefined) { showMedia(Number(el.dataset.media)); return; }
    const action=el.dataset.action;
    if (action==='mode') {
      modeDialog.querySelectorAll('[data-mode-target]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.modeTarget===state.mode)));
      modeDialog.showModal();
    }
    if (action==='close-mode') modeDialog.close();
    if (action==='close-media') closeMedia();
    if (action==='media-prev') showMedia(mediaIndex-1);
    if (action==='media-next') showMedia(mediaIndex+1);
    if (action==='copy-email') {
      try {
        await navigator.clipboard.writeText('cheerioov2@gmail.com');
        const toast=document.getElementById('app-status');
        toast.textContent='Email address copied';toast.classList.add('visible');
        setTimeout(()=>toast.classList.remove('visible'),2400);
      } catch {
        const toast=document.getElementById('app-status');
        toast.textContent='Select and copy cheerioov2@gmail.com';toast.classList.add('visible');
        setTimeout(()=>toast.classList.remove('visible'),4000);
      }
    }
  });
  [modeDialog,mediaDialog].forEach(dialog=>dialog.addEventListener('click',event=> {
    if(event.target!==dialog)return;
    const rect=dialog.getBoundingClientRect();
    if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom) {
      if(dialog===mediaDialog)closeMedia();else dialog.close();
    }
  }));
  mediaDialog.addEventListener('cancel',()=>{mediaDialog.querySelector('video')?.pause();});
  mediaDialog.addEventListener('keydown',event=> {
    if(event.target.closest('video'))return;
    if(event.key==='ArrowRight'){event.preventDefault();showMedia(mediaIndex+1);}
    if(event.key==='ArrowLeft'){event.preventDefault();showMedia(mediaIndex-1);}
  });
  let touchStart;
  mediaDialog.querySelector('.viewer-stage').addEventListener('touchstart',event=> {
    if(event.touches.length===1 && !event.target.closest('video'))touchStart={x:event.touches[0].clientX,y:event.touches[0].clientY};else touchStart=null;
  },{passive:true});
  mediaDialog.querySelector('.viewer-stage').addEventListener('touchend',event=> {
    if(!touchStart||event.changedTouches.length!==1)return;
    const dx=event.changedTouches[0].clientX-touchStart.x,dy=event.changedTouches[0].clientY-touchStart.y;
    touchStart=null;
    if(window.visualViewport?.scale>1.05)return;
    if(Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)*2)showMedia(mediaIndex+(dx<0?1:-1));
  },{passive:true});
  function refreshCountdown(){document.querySelectorAll('[data-countdown]').forEach(el=>el.innerHTML=countdown());}
  window.addEventListener('popstate',()=>render({restore:true}));
  window.addEventListener('hashchange',()=> {
    const next=S.route(new URL(location.href),store.get(MODE_KEY));
    if(next.view!==state.view||next.id!==state.id) {render();window.scrollTo(0,0);}
  });
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshCountdown();});
  setInterval(refreshCountdown,60000);
  render();
  if(['hiring','keywords','keywords-motorsport','resumes'].includes(location.hash.slice(1))) {
    requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView());
  }
})();
