const assert = require("node:assert/strict");
const path = require("node:path");
const Module = require("node:module");

let feedbackCount = 0;
const inserts = [];
const db = {
  from(table) {
    return {
      insert(record) {
        inserts.push({ table, record });
        return Promise.resolve({ data: null, error: null });
      },
      select() {
        return {
          eq(column, value) {
            assert.equal(column, "ip");
            assert.equal(value, "203.0.113.9");
            return {
              gte(cutoffColumn, cutoff) {
                assert.equal(cutoffColumn, "created_at_ms");
                assert.equal(typeof cutoff, "number");
                return Promise.resolve({ data: null, count: feedbackCount, error: null });
              }
            };
          }
        };
      }
    };
  }
};

const originalLoad = Module._load;
Module._load = function load(request, parent, isMain) {
  if (request === "@cloudbase/node-sdk") {
    return {
      SYMBOL_CURRENT_ENV: Symbol("current-env"),
      init: () => ({ rdb: () => db })
    };
  }
  return originalLoad.call(this, request, parent, isMain);
};

const api = require(path.join(__dirname, "..", "cloudbase-cn", "functions", "portfolio-cn-api", "index.js"));
Module._load = originalLoad;

function request(method, endpoint, body = {}) {
  return api.main({
    httpMethod: method,
    path: `/portfolio-api${endpoint}`,
    headers: { "x-forwarded-for": "203.0.113.9, 10.0.0.1", "user-agent": "local-test" },
    body: JSON.stringify(body)
  });
}

(async () => {
  const health = await request("GET", "/health");
  const visit = await request("POST", "/visit", { visitorId: "visitor", sessionId: "session" });
  const invalidEvent = await request("POST", "/event", {});
  const event = await request("POST", "/event", { eventName: "project_open", eventData: { project: "E200" } });
  const honeypot = await request("POST", "/feedback", { company: "bot", name: "Bot", comment: "spam" });
  feedbackCount = 4;
  const feedback = await request("POST", "/feedback", { name: "Reviewer", comment: "Looks good" });
  feedbackCount = 5;
  const limited = await request("POST", "/feedback", { name: "Reviewer", comment: "Again" });

  assert.deepEqual(
    [health.statusCode, visit.statusCode, invalidEvent.statusCode, event.statusCode, honeypot.statusCode, feedback.statusCode, limited.statusCode],
    [200, 204, 400, 204, 201, 201, 429]
  );
  assert.deepEqual(inserts.map(({ table }) => table), ["visits", "events", "feedback"]);
  assert.equal(inserts[0].record.visitor_id, "visitor");
  assert.equal(inserts[1].record.event_name, "project_open");
  assert.deepEqual(inserts[1].record.event_data, { project: "E200" });
  assert.equal(inserts[2].record.github_mirrored, false);
  assert.equal(inserts[2].record.ip, "203.0.113.9");
  assert.match(inserts[2].record.id, /^[0-9a-f-]{36}$/i);
  console.log("portfolio-cn-api offline contract tests: PASS");
})();
