/* Shared, dependency-free URL and calendar rules for every screen size. */
((root) => {
  const energyIds = ['hems', 'e200', 'e8kw', 'daq', 'inverter', 'comap'];
  const motorsportIds = ['c7-aero', 'can-controls', 'sensors', 'track-data'];
  const normalizeMode = value => value === 'motorsport' ? 'motorsport' : 'professional';
  function route(url, savedMode) {
    const requested = url.searchParams.get('mode');
    let mode = requested === null ? normalizeMode(savedMode) : normalizeMode(requested);
    let fragment = url.hash.slice(1);
    try { fragment = decodeURIComponent(fragment); } catch { /* Malformed external fragments are treated as unknown anchors. */ }
    const id = url.searchParams.get('case') || fragment;
    const page = url.pathname.split('/').pop() || 'index.html';
    let view = page === 'faq.html' ? 'about' : page === 'contact.html' ? 'connect' : 'overview';
    if (view === 'overview') {
      if (energyIds.includes(id) || motorsportIds.includes(id)) {
        mode = motorsportIds.includes(id) ? 'motorsport' : 'professional';
        view = 'case';
      } else if (url.searchParams.get('view') === 'work' || ['professional-projects', 'motorsport-projects'].includes(id)) {
        if (id) mode = id === 'motorsport-projects' ? 'motorsport' : 'professional';
        view = 'work';
      }
    }
    return { mode, view, id: view === 'case' ? id : null };
  }
  function href(view, mode, id) {
    const page = view === 'about' ? 'faq.html' : view === 'connect' ? 'contact.html' : 'index.html';
    const query = new URLSearchParams({ mode: mode === 'motorsport' ? 'motorsport' : 'chp' });
    if (view === 'work') query.set('view', 'work');
    if (view === 'case' && id) query.set('case', id);
    return `${page}?${query}${view === 'case' && id ? `#${encodeURIComponent(id)}` : ''}`;
  }
  function daysUntil(target, now = new Date(), timeZone = 'America/Detroit') {
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
      timeZone, year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(now).filter(p => p.type !== 'literal').map(p => [p.type, p.value]));
    const today = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day));
    const [y, m, d] = target.split('-').map(Number);
    return Math.round((Date.UTC(y, m - 1, d) - today) / 86400000);
  }
  root.PortfolioState = { normalizeMode, route, href, daysUntil, energyIds, motorsportIds };
})(typeof window === 'undefined' ? globalThis : window);
