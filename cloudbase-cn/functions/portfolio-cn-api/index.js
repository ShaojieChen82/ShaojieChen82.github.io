const cloudbase = require("@cloudbase/node-sdk");
const crypto = require("node:crypto");

const app = cloudbase.init({
  env: cloudbase.SYMBOL_CURRENT_ENV,
  accessKey: process.env.CLOUDBASE_SERVER_API_KEY || undefined
});
// CloudBase Node SDK 3.x otherwise uses the environment ID as the RDB
// profile. PostgreSQL tables in this environment live in the public schema.
const db = app.rdb({ database: "public" });

const TABLES = {
  visits: "visits",
  events: "events",
  feedback: "feedback"
};

function headersLower(headers = {}) {
  return Object.fromEntries(
    Object.entries(headers || {}).map(([key, value]) => [String(key).toLowerCase(), value])
  );
}

function clean(value, max = 500) {
  return String(value == null ? "" : value).trim().slice(0, max);
}

function getIp(event, headers) {
  const forwarded = clean(headers["x-forwarded-for"], 500);
  if (forwarded) return forwarded.split(",")[0].trim();
  return clean(
    headers["x-real-ip"] ||
    headers["x-client-ip"] ||
    event?.requestContext?.sourceIp ||
    event?.requestContext?.identity?.sourceIp ||
    "",
    100
  );
}

function normalizePath(event) {
  let path = clean(event?.path || event?.requestContext?.path || "/", 500) || "/";
  try {
    if (/^https?:\/\//i.test(path)) path = new URL(path).pathname;
  } catch (_) {}

  const prefix = "/portfolio-api";
  if (path === prefix) return "/";
  if (path.startsWith(`${prefix}/`)) path = path.slice(prefix.length);
  return path || "/";
}

function parseBody(event) {
  if (event?.body && typeof event.body === "object") return event.body;
  let raw = String(event?.body || "");
  if (!raw) return {};
  if (event?.isBase64Encoded) {
    try { raw = Buffer.from(raw, "base64").toString("utf8"); }
    catch (_) { return {}; }
  }
  try { return JSON.parse(raw); }
  catch (_) { return {}; }
}

function response(statusCode, body = null) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Accept, Authorization",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
    },
    body: body == null ? "" : JSON.stringify(body)
  };
}

function commonRecord(payload, event, headers) {
  const now = new Date();
  const createdAt = now.toISOString();
  return {
    id: crypto.randomUUID(),
    created_at: createdAt,
    created_at_iso: createdAt,
    created_at_ms: now.getTime(),
    source: "china_cloudbase",
    visitor_id: clean(payload.visitorId, 120),
    session_id: clean(payload.sessionId, 120),
    page: clean(payload.page, 500),
    referrer: clean(payload.referrer, 1000),
    language: clean(payload.language, 100),
    screen: clean(payload.screen, 100),
    viewport: clean(payload.viewport, 100),
    client_timezone: clean(payload.clientTimezone, 100),
    ip: getIp(event, headers),
    user_agent: clean(headers["user-agent"], 1000)
  };
}

function assertDbResult(result, operation) {
  if (!result?.error) return result;

  const error = new Error(`${operation}: ${result.error.message || "PostgreSQL request failed"}`);
  error.code = result.error.code || "RDB_REQUEST_FAILED";
  throw error;
}

async function insertRecord(table, record) {
  const result = await db.from(table).insert(record);
  assertDbResult(result, `insert ${table}`);
}

async function saveVisit(payload, event, headers) {
  const record = commonRecord(payload, event, headers);
  await insertRecord(TABLES.visits, record);
  return response(204);
}

async function saveEvent(payload, event, headers) {
  const eventName = clean(payload.eventName, 100);
  if (!eventName) return response(400, { error: "eventName is required." });

  const record = {
    ...commonRecord(payload, event, headers),
    event_name: eventName,
    event_target: clean(payload.eventTarget, 500),
    event_data: payload.eventData && typeof payload.eventData === "object" ? payload.eventData : {},
    utm_source: clean(payload.utmSource, 200),
    utm_medium: clean(payload.utmMedium, 200),
    utm_campaign: clean(payload.utmCampaign, 200),
    utm_content: clean(payload.utmContent, 200),
    utm_term: clean(payload.utmTerm, 200)
  };

  await insertRecord(TABLES.events, record);
  return response(204);
}

async function saveFeedback(payload, event, headers) {
  const name = clean(payload.name, 80);
  const email = clean(payload.email, 200);
  const comment = clean(payload.comment, 2000);
  const company = clean(payload.company, 200);

  // Honeypot: make basic bots believe submission succeeded without storing it.
  if (company) {
    return response(201, { ok: true, stored: false, filtered: true, source: "china_cloudbase" });
  }

  if (!name) return response(400, { error: "Please enter your name." });
  if (!comment) return response(400, { error: "Please enter a comment." });

  const common = commonRecord(payload, event, headers);
  const ip = common.ip;

  // Match the global service's practical anti-abuse rule: 5 successful submissions
  // from the same observed public IP in a rolling 24-hour period.
  if (ip) {
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    const recent = await db.from(TABLES.feedback)
      .select("id", { count: "exact", head: true })
      .eq("ip", ip)
      .gte("created_at_ms", cutoff);
    assertDbResult(recent, "count recent feedback");
    if ((recent?.count || 0) >= 5) {
      return response(429, { error: "Too many feedback submissions. Please try again later." });
    }
  }

  const record = {
    ...common,
    name,
    email,
    comment,
    github_mirrored: false
  };

  await insertRecord(TABLES.feedback, record);

  // The free CloudBase environment currently has a short cloud-function timeout.
  // Keep the visitor-facing path reliable by treating CloudBase DB as the durable
  // China-side store instead of waiting on a cross-border GitHub API call here.
  return response(201, {
    ok: true,
    id: record.id,
    stored: true,
    source: "china_cloudbase",
    githubMirrored: false
  });
}

exports.main = async (event = {}, context = {}) => {
  const method = clean(event.httpMethod || event?.requestContext?.httpMethod || "GET", 20).toUpperCase();
  const path = normalizePath(event);
  const headers = headersLower(event.headers);

  if (method === "OPTIONS") return response(204);

  try {
    if (method === "GET" && path === "/health") {
      return response(200, {
        ok: true,
        service: "portfolio-cn-api",
        source: "china_cloudbase"
      });
    }

    if (method !== "POST") return response(404, { error: "Not found." });

    const payload = parseBody(event);
    if (path === "/visit") return await saveVisit(payload, event, headers);
    if (path === "/event") return await saveEvent(payload, event, headers);
    if (path === "/feedback") return await saveFeedback(payload, event, headers);

    return response(404, { error: "Not found." });
  } catch (error) {
    console.error("portfolio-cn-api error", {
      path,
      method,
      message: error?.message || String(error),
      requestId: context?.request_id || context?.requestId || ""
    });
    return response(500, { error: "Internal server error." });
  }
};
