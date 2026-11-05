/* Regression checks for mode/deep-link consistency and deadline calendar math. */
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {resolve} = require('node:path');
require(resolve(__dirname, '../assets/js/portfolio-state.js'));
const S = globalThis.PortfolioState;
const route = (path, saved) => S.route(new URL(path, 'https://shaojiechen82.github.io/'), saved);
let checks = 0;
function check(name, test) { test(); checks++; console.log(`PASS ${name}`); }
check('explicit energy URL overrides a saved Motorsport preference', () => {
  assert.equal(route('faq.html?mode=chp', 'motorsport').mode, 'professional');
});
check('explicit Motorsport URL overrides a saved energy preference', () => {
  assert.equal(route('contact.html?mode=motorsport', 'professional').mode, 'motorsport');
});
check('a plain entry uses the saved preference', () => {
  assert.equal(route('index.html', 'motorsport').mode, 'motorsport');
});
check('every project has a direct, round-trip URL with the correct mode', () => {
  for (const [mode,ids] of [['professional',S.energyIds],['motorsport',S.motorsportIds]]) {
    for (const id of ids) assert.deepEqual(route(S.href('case',mode,id)), {mode,view:'case',id});
  }
});
check('legacy project links infer the project direction instead of displaying another mode', () => {
  assert.deepEqual(route('index.html?mode=motorsport#e200'), {mode:'professional',view:'case',id:'e200'});
  assert.deepEqual(route('index.html?mode=chp#can-controls'), {mode:'motorsport',view:'case',id:'can-controls'});
});
check('in-case evidence anchors retain their project and mode', () => {
  assert.deepEqual(route('index.html?mode=motorsport&case=can-controls#evidence'), {mode:'motorsport',view:'case',id:'can-controls'});
});
check('legacy project indexes open the work list', () => {
  assert.equal(route('index.html#professional-projects').view,'work');
  assert.equal(route('index.html#motorsport-projects').mode,'motorsport');
});
check('About and Connect keep their destination with anchor links', () => {
  assert.equal(route('faq.html?mode=chp#hiring').view,'about');
  assert.equal(route('contact.html?mode=motorsport#resumes').view,'connect');
});
check('malformed external fragments do not crash the portfolio', () => {
  assert.equal(route('index.html?mode=chp#%').view,'overview');
});
check('offer target counts calendar dates in Detroit', () => {
  assert.equal(S.daysUntil('2026-11-30',new Date('2026-11-05T17:00:00Z')),25);
});
check('countdown follows Eastern midnight instead of the visitor timezone', () => {
  assert.equal(S.daysUntil('2026-11-30',new Date('2026-11-06T04:30:00Z')),25);
  assert.equal(S.daysUntil('2026-11-30',new Date('2026-11-06T05:30:00Z')),24);
});
check('daylight saving changes do not add a calendar day', () => {
  assert.equal(S.daysUntil('2026-11-30',new Date('2026-10-31T16:00:00Z')),30);
  assert.equal(S.daysUntil('2026-11-30',new Date('2026-11-01T17:00:00Z')),29);
});
check('target day and elapsed target have explicit states', () => {
  assert.equal(S.daysUntil('2026-11-30',new Date('2026-11-30T17:00:00Z')),0);
  assert.equal(S.daysUntil('2026-11-30',new Date('2026-12-01T17:00:00Z')),-1);
});
check('all canonical project evidence exists, including collage panels', () => {
  const {existsSync} = require('node:fs');
  for(const name of ['chp-projects.json','motorsport-projects.json']) {
    const data = JSON.parse(readFileSync(resolve(__dirname,'../assets/data',name),'utf8'));
    for(const p of data.projects) for(const m of [p.feature,...p.support].flatMap(m=>m.panels||[m])) {
      for(const field of ['src','small','poster']) if(m[field]) assert.ok(existsSync(resolve(__dirname,'..',m[field])), `${p.id}: ${m[field]}`);
    }
  }
});
console.log(`\n${checks} regression groups passed.`);
