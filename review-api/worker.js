const DEFAULT_ORIGIN = "https://shaojiechen82.github.io";

const ALLOWED_EVENTS = new Set([
  "mode_switch",
  "project_open",
  "resume_open",
  "media_open",
  "email_click",
  "phone_click",
  "linkedin_click",
  "link_click",
  "button_click",
  "feedback_start",
  "feedback_submit",
  "scroll_50",
  "scroll_100",
  "video_play",
  "video_25",
  "video_50",
  "video_75",
  "video_complete",
  "page_exit"
]);

function clean(value, maxLength) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function allowedOrigin(env) {
  return clean(env.ALLOWED_ORIGIN || DEFAULT_ORIGIN, 300);
}

function corsHeaders(request, env) {
  const allowed = allowedOrigin(env);
  const origin = request.headers.get("Origin") || "";
  return {
    "Access-Control-Allow-Origin": origin === allowed ? origin : allowed,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}

function json(request, env, data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...corsHeaders(request, env)
    }
  });
}

function originIsAllowed(request, env) {
  const origin = request.headers.get("Origin");
  return !origin || origin === allowedOrigin(env);
}

async function readJson(request, maxBytes = 16000) {
  const contentLength = Number(request.headers.get("Content-Length") || 0);
  if (contentLength && contentLength > maxBytes) {
    throw new Error("PAYLOAD_TOO_LARGE");
  }

  const text = await request.text();
  if (text.length > maxBytes) throw new Error("PAYLOAD_TOO_LARGE");

  try {
    return JSON.parse(text || "{}");
  } catch (_) {
    throw new Error("INVALID_JSON");
  }
}

function requestMetadata(request, body = {}) {
  const cf = request.cf || {};
  return {
    createdAt: new Date().toISOString(),
    sessionId: clean(body.sessionId, 100),
    visitorId: clean(body.visitorId, 100),
    page: clean(body.page, 500),
    referrer: clean(body.referrer, 1000),
    utmSource: clean(body.utmSource, 200),
    utmMedium: clean(body.utmMedium, 200),
    utmCampaign: clean(body.utmCampaign, 300),
    utmContent: clean(body.utmContent, 300),
    utmTerm: clean(body.utmTerm, 300),
    ip: clean(request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "unknown", 100),
    country: clean(cf.country, 16),
    region: clean(cf.region, 160),
    city: clean(cf.city, 160),
    timezone: clean(cf.timezone, 100),
    colo: clean(cf.colo, 32),
    asn: Number(cf.asn || 0) || null,
    userAgent: clean(request.headers.get("User-Agent") || "unknown", 700),
    language: clean(body.language, 80),
    screen: clean(body.screen, 40),
    viewport: clean(body.viewport, 40),
    clientTimezone: clean(body.clientTimezone, 100)
  };
}

function eventDataText(value) {
  if (value == null) return "";
  try {
    return clean(typeof value === "string" ? value : JSON.stringify(value), 2000);
  } catch (_) {
    return "";
  }
}

async function insertVisit(env, meta) {
  await env.DB.prepare(`
    INSERT INTO visits (
      id, created_at, session_id, visitor_id, page, referrer, ip,
      country, region, city, timezone, colo, asn,
      user_agent, language, screen, viewport, client_timezone
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    crypto.randomUUID(), meta.createdAt, meta.sessionId, meta.visitorId, meta.page, meta.referrer, meta.ip,
    meta.country, meta.region, meta.city, meta.timezone, meta.colo, meta.asn,
    meta.userAgent, meta.language, meta.screen, meta.viewport, meta.clientTimezone
  ).run();
}

async function insertEvent(env, meta, eventName, eventTarget = "", eventData = "") {
  await env.DB.prepare(`
    INSERT INTO events (
      id, created_at, session_id, visitor_id, event_name, event_target, event_data,
      page, referrer, utm_source, utm_medium, utm_campaign, utm_content, utm_term,
      ip, country, region, city, timezone, colo, asn,
      user_agent, language, screen, viewport, client_timezone
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    crypto.randomUUID(), meta.createdAt, meta.sessionId, meta.visitorId, eventName, clean(eventTarget, 300), eventDataText(eventData),
    meta.page, meta.referrer, meta.utmSource, meta.utmMedium, meta.utmCampaign, meta.utmContent, meta.utmTerm,
    meta.ip, meta.country, meta.region, meta.city, meta.timezone, meta.colo, meta.asn,
    meta.userAgent, meta.language, meta.screen, meta.viewport, meta.clientTimezone
  ).run();
}

function markdownSafe(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function markdownCell(value) {
  return markdownSafe(value).replace(/\|/g, "\\|").replace(/[\r\n]+/g, " ");
}

async function createPrivateGitHubIssue(env, title, body, labelName = "") {
  if (!env.GITHUB_TOKEN || !env.GITHUB_REPO) return null;

  const parts = String(env.GITHUB_REPO).split("/");
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    throw new Error("GITHUB_REPO must be owner/repository");
  }

  const repoPath = `${encodeURIComponent(parts[0])}/${encodeURIComponent(parts[1])}`;
  const response = await fetch(`https://api.github.com/repos/${repoPath}/issues`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
      "Accept": "application/vnd.github+json",
      "Content-Type": "application/json",
      "User-Agent": "shaojiechen-portfolio-worker",
      "X-GitHub-Api-Version": "2022-11-28"
    },
    body: JSON.stringify({
      title: clean(title, 240),
      body,
      labels: labelName ? [String(labelName)] : undefined
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`GitHub issue creation failed (${response.status}): ${message.slice(0, 300)}`);
  }

  const payload = await response.json();
  return clean(payload.html_url, 500) || null;
}

async function createFeedbackGitHubIssue(env, feedback, meta) {
  const issueBody = [
    "## Portfolio feedback",
    "",
    `**Name:** ${markdownSafe(feedback.name)}`,
    `**Email:** ${feedback.email ? markdownSafe(feedback.email) : "_Not provided_"}`,
    "",
    "### Comment",
    markdownSafe(feedback.comment),
    "",
    "---",
    "### Private technical metadata",
    `- Submitted: ${meta.createdAt}`,
    `- IP: ${markdownSafe(meta.ip)}`,
    `- Location: ${markdownSafe([meta.city, meta.region, meta.country].filter(Boolean).join(", "))}`,
    `- ASN: ${meta.asn ?? ""}`,
    `- Cloudflare colo: ${markdownSafe(meta.colo)}`,
    `- Page: ${markdownSafe(meta.page)}`,
    `- Referrer: ${markdownSafe(meta.referrer)}`,
    `- Browser/device UA: ${markdownSafe(meta.userAgent)}`,
    `- Screen: ${markdownSafe(meta.screen)}`,
    `- Viewport: ${markdownSafe(meta.viewport)}`,
    `- Client timezone: ${markdownSafe(meta.clientTimezone)}`,
    `- Session ID: ${markdownSafe(meta.sessionId)}`,
    `- Anonymous browser ID: ${markdownSafe(meta.visitorId)}`
  ].join("\n");

  return createPrivateGitHubIssue(
    env,
    `Portfolio feedback — ${feedback.name}`,
    issueBody,
    env.GITHUB_LABEL || ""
  );
}

async function rows(env, sql, bindings = []) {
  const result = await env.DB.prepare(sql).bind(...bindings).all();
  return Array.isArray(result.results) ? result.results : [];
}

function asNumber(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

function percentage(value, total) {
  if (!total) return "0%";
  return `${Math.round((value / total) * 1000) / 10}%`;
}

async function collectAnalyticsReport(env, periodStart, periodEnd) {
  const summaryRow = await env.DB.prepare(`
    SELECT
      COUNT(DISTINCT NULLIF(visitor_id, '')) AS unique_visitors,
      COUNT(DISTINCT NULLIF(session_id, '')) AS sessions,
      SUM(CASE WHEN event_name = 'page_view' THEN 1 ELSE 0 END) AS page_views,
      COUNT(*) AS total_events,
      COUNT(DISTINCT CASE WHEN event_name = 'project_open' THEN session_id END) AS project_sessions,
      COUNT(DISTINCT CASE WHEN event_name = 'resume_open' THEN session_id END) AS resume_sessions,
      COUNT(DISTINCT CASE WHEN event_name = 'page_view' AND page LIKE '/contact%' THEN session_id END) AS contact_sessions,
      COUNT(DISTINCT CASE WHEN event_name = 'feedback_submit' THEN session_id END) AS feedback_sessions
    FROM events
    WHERE created_at >= ? AND created_at < ?
  `).bind(periodStart, periodEnd).first();

  const visitorBreakdown = await env.DB.prepare(`
    WITH active_visitors AS (
      SELECT DISTINCT visitor_id
      FROM events
      WHERE created_at >= ? AND created_at < ?
        AND visitor_id IS NOT NULL AND visitor_id <> ''
    ),
    first_seen AS (
      SELECT e.visitor_id, MIN(e.created_at) AS first_seen
      FROM events e
      INNER JOIN active_visitors a ON a.visitor_id = e.visitor_id
      GROUP BY e.visitor_id
    )
    SELECT
      SUM(CASE WHEN first_seen < ? THEN 1 ELSE 0 END) AS returning_visitors,
      SUM(CASE WHEN first_seen >= ? THEN 1 ELSE 0 END) AS new_visitors
    FROM first_seen
  `).bind(periodStart, periodEnd, periodStart, periodStart).first();

  const topPages = await rows(env, `
    SELECT page, COUNT(*) AS views, COUNT(DISTINCT session_id) AS sessions
    FROM events
    WHERE created_at >= ? AND created_at < ? AND event_name = 'page_view'
    GROUP BY page
    ORDER BY sessions DESC, views DESC
    LIMIT 8
  `, [periodStart, periodEnd]);

  const topProjects = await rows(env, `
    SELECT event_target AS project, COUNT(*) AS opens, COUNT(DISTINCT session_id) AS sessions
    FROM events
    WHERE created_at >= ? AND created_at < ? AND event_name = 'project_open'
    GROUP BY event_target
    ORDER BY sessions DESC, opens DESC
    LIMIT 8
  `, [periodStart, periodEnd]);

  const resumeOpens = await rows(env, `
    SELECT event_target AS resume, COUNT(*) AS opens, COUNT(DISTINCT session_id) AS sessions
    FROM events
    WHERE created_at >= ? AND created_at < ? AND event_name = 'resume_open'
    GROUP BY event_target
    ORDER BY sessions DESC, opens DESC
    LIMIT 8
  `, [periodStart, periodEnd]);

  const sources = await rows(env, `
    SELECT COALESCE(NULLIF(utm_source, ''), '(direct / unknown)') AS source,
           COUNT(DISTINCT session_id) AS sessions
    FROM events
    WHERE created_at >= ? AND created_at < ? AND event_name = 'page_view'
    GROUP BY source
    ORDER BY sessions DESC
    LIMIT 8
  `, [periodStart, periodEnd]);

  const locations = await rows(env, `
    SELECT country, region, city, COUNT(DISTINCT session_id) AS sessions
    FROM events
    WHERE created_at >= ? AND created_at < ? AND event_name = 'page_view'
    GROUP BY country, region, city
    ORDER BY sessions DESC
    LIMIT 8
  `, [periodStart, periodEnd]);

  const repeatBrowsers = await rows(env, `
    SELECT visitor_id, COUNT(DISTINCT session_id) AS sessions, COUNT(*) AS events
    FROM events
    WHERE created_at >= ? AND created_at < ?
      AND visitor_id IS NOT NULL AND visitor_id <> ''
    GROUP BY visitor_id
    HAVING COUNT(DISTINCT session_id) > 1
    ORDER BY sessions DESC, events DESC
    LIMIT 8
  `, [periodStart, periodEnd]);

  const summary = {
    uniqueVisitors: asNumber(summaryRow?.unique_visitors),
    newVisitors: asNumber(visitorBreakdown?.new_visitors),
    returningVisitors: asNumber(visitorBreakdown?.returning_visitors),
    sessions: asNumber(summaryRow?.sessions),
    pageViews: asNumber(summaryRow?.page_views),
    totalEvents: asNumber(summaryRow?.total_events),
    projectSessions: asNumber(summaryRow?.project_sessions),
    resumeSessions: asNumber(summaryRow?.resume_sessions),
    contactSessions: asNumber(summaryRow?.contact_sessions),
    feedbackSessions: asNumber(summaryRow?.feedback_sessions)
  };

  return {
    periodStart,
    periodEnd,
    summary,
    topPages,
    topProjects,
    resumeOpens,
    sources,
    locations,
    repeatBrowsers
  };
}

function buildReportMarkdown(report) {
  const { summary } = report;
  const lines = [
    "# Portfolio analytics",
    "",
    `**Period:** ${report.periodStart} → ${report.periodEnd}`,
    "",
    "> Anonymous browser IDs identify a browser profile, not a confirmed person or physical device. Clearing site data, private browsing, another browser, or another device creates a different ID.",
    "",
    "## Overview",
    "",
    `- Unique anonymous browsers: **${summary.uniqueVisitors}**`,
    `- New browsers: **${summary.newVisitors}**`,
    `- Returning browsers: **${summary.returningVisitors}**`,
    `- Sessions: **${summary.sessions}**`,
    `- Page views: **${summary.pageViews}**`,
    `- Total tracked events: **${summary.totalEvents}**`,
    `- Sessions opening a project: **${summary.projectSessions}** (${percentage(summary.projectSessions, summary.sessions)})`,
    `- Sessions opening a resume: **${summary.resumeSessions}** (${percentage(summary.resumeSessions, summary.sessions)})`,
    `- Sessions visiting Contact: **${summary.contactSessions}** (${percentage(summary.contactSessions, summary.sessions)})`,
    `- Sessions submitting feedback: **${summary.feedbackSessions}** (${percentage(summary.feedbackSessions, summary.sessions)})`,
    ""
  ];

  function appendTable(title, headers, tableRows) {
    lines.push(`## ${title}`, "");
    if (!tableRows.length) {
      lines.push("_No data in this period._", "");
      return;
    }
    lines.push(`| ${headers.join(" | ")} |`);
    lines.push(`| ${headers.map(() => "---").join(" | ")} |`);
    tableRows.forEach((row) => lines.push(`| ${row.map(markdownCell).join(" | ")} |`));
    lines.push("");
  }

  appendTable("Top pages", ["Page", "Views", "Sessions"], report.topPages.map((row) => [row.page || "(unknown)", row.views, row.sessions]));
  appendTable("Top projects", ["Project", "Opens", "Sessions"], report.topProjects.map((row) => [row.project || "(unknown)", row.opens, row.sessions]));
  appendTable("Resume opens", ["Resume", "Opens", "Sessions"], report.resumeOpens.map((row) => [row.resume || "(unknown)", row.opens, row.sessions]));
  appendTable("Traffic sources", ["Source", "Sessions"], report.sources.map((row) => [row.source || "(direct / unknown)", row.sessions]));
  appendTable("Top locations", ["Location", "Sessions"], report.locations.map((row) => [[row.city, row.region, row.country].filter(Boolean).join(", ") || "(unknown)", row.sessions]));
  appendTable("Repeat browsers within this period", ["Anonymous browser ID", "Sessions", "Events"], report.repeatBrowsers.map((row) => [`${String(row.visitor_id || "").slice(0, 8)}…`, row.sessions, row.events]));

  lines.push("---", "", "Visitor identity statistics begin when persistent anonymous browser tracking is deployed; older rows without a visitor ID are excluded from unique/new/returning browser counts.");
  return lines.join("\n");
}

function reportWindow(periodName, now = new Date()) {
  const end = new Date(now);
  let start;
  let label;

  if (periodName === "last_30_days") {
    start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
    label = "Last 30 days";
  } else if (periodName === "week_to_date") {
    start = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate(), 0, 0, 0));
    const daysSinceMonday = (start.getUTCDay() + 6) % 7;
    start.setUTCDate(start.getUTCDate() - daysSinceMonday);
    label = "Week to date";
  } else {
    start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
    label = "Last 7 days";
  }

  return {
    periodStart: start.toISOString(),
    periodEnd: end.toISOString(),
    label
  };
}

async function createAnalyticsReportIssue(env, report, titlePrefix) {
  const markdown = buildReportMarkdown(report);
  const date = report.periodEnd.slice(0, 10);
  const issueUrl = await createPrivateGitHubIssue(
    env,
    `${titlePrefix} — ${date}`,
    markdown,
    env.GITHUB_REPORT_LABEL || ""
  );
  return { markdown, issueUrl };
}

async function storeReportRecord(env, reportKey, reportType, report, issueUrl) {
  await env.DB.prepare(`
    INSERT INTO analytics_reports (
      id, created_at, report_key, report_type, period_start, period_end, github_issue_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(
    crypto.randomUUID(), new Date().toISOString(), reportKey, reportType,
    report.periodStart, report.periodEnd, issueUrl || null
  ).run();
}

async function runWeeklyReport(env, scheduledTime = Date.now()) {
  const end = new Date(scheduledTime);
  const window = reportWindow("last_7_days", end);
  const reportKey = `weekly:${end.toISOString().slice(0, 10)}`;
  const existing = await env.DB.prepare(`
    SELECT github_issue_url FROM analytics_reports WHERE report_key = ?
  `).bind(reportKey).first();
  if (existing) return existing.github_issue_url || null;

  const report = await collectAnalyticsReport(env, window.periodStart, window.periodEnd);
  const { issueUrl } = await createAnalyticsReportIssue(env, report, "Portfolio analytics — weekly");
  await storeReportRecord(env, reportKey, "weekly", report, issueUrl);
  return issueUrl;
}

function reportRequestAuthorized(request, env) {
  const expected = clean(env.REPORT_TOKEN, 500);
  if (!expected) return false;
  const supplied = request.headers.get("Authorization") || "";
  return supplied === `Bearer ${expected}`;
}

async function handleAdminReport(request, env) {
  if (!env.REPORT_TOKEN) {
    return json(request, env, { error: "REPORT_TOKEN is not configured." }, 503);
  }
  if (!reportRequestAuthorized(request, env)) {
    return json(request, env, { error: "Unauthorized." }, 401);
  }

  let body;
  try {
    body = await readJson(request, 4000);
  } catch (error) {
    if (error.message === "PAYLOAD_TOO_LARGE") return json(request, env, { error: "Request too large." }, 413);
    return json(request, env, { error: "Invalid JSON." }, 400);
  }

  const requestedPeriod = clean(body.period, 40) || "week_to_date";
  const allowedPeriods = new Set(["week_to_date", "last_7_days", "last_30_days"]);
  if (!allowedPeriods.has(requestedPeriod)) {
    return json(request, env, { error: "Unsupported report period." }, 400);
  }

  const window = reportWindow(requestedPeriod);
  const report = await collectAnalyticsReport(env, window.periodStart, window.periodEnd);
  const createIssue = body.createIssue !== false;
  let githubIssueUrl = null;
  let markdown = buildReportMarkdown(report);

  if (createIssue) {
    const created = await createAnalyticsReportIssue(env, report, `Portfolio analytics — ${window.label}`);
    githubIssueUrl = created.issueUrl;
    markdown = created.markdown;
    await storeReportRecord(env, `manual:${crypto.randomUUID()}`, "manual", report, githubIssueUrl);
  }

  return json(request, env, {
    ok: true,
    period: requestedPeriod,
    periodStart: report.periodStart,
    periodEnd: report.periodEnd,
    summary: report.summary,
    topPages: report.topPages,
    topProjects: report.topProjects,
    resumeOpens: report.resumeOpens,
    sources: report.sources,
    locations: report.locations,
    repeatBrowsers: report.repeatBrowsers,
    githubIssueUrl,
    markdown
  });
}

async function handleVisit(request, env, ctx) {
  let body;
  try {
    body = await readJson(request, 8000);
  } catch (error) {
    if (error.message === "PAYLOAD_TOO_LARGE") return json(request, env, { error: "Request too large." }, 413);
    return json(request, env, { error: "Invalid JSON." }, 400);
  }

  const meta = requestMetadata(request, body);
  ctx.waitUntil(Promise.all([
    insertVisit(env, meta).catch((error) => {
      console.error(JSON.stringify({ event: "visit_insert_failed", error: String(error) }));
    }),
    insertEvent(env, meta, "page_view", meta.page).catch((error) => {
      console.error(JSON.stringify({ event: "page_view_event_insert_failed", error: String(error) }));
    })
  ]));

  return new Response(null, {
    status: 204,
    headers: corsHeaders(request, env)
  });
}

async function handleEvent(request, env) {
  let body;
  try {
    body = await readJson(request, 12000);
  } catch (error) {
    if (error.message === "PAYLOAD_TOO_LARGE") return json(request, env, { error: "Request too large." }, 413);
    return json(request, env, { error: "Invalid JSON." }, 400);
  }

  const eventName = clean(body.eventName, 80);
  if (!ALLOWED_EVENTS.has(eventName)) {
    return json(request, env, { error: "Unsupported event." }, 400);
  }

  const meta = requestMetadata(request, body);
  await insertEvent(env, meta, eventName, body.eventTarget, body.eventData);

  return new Response(null, {
    status: 204,
    headers: corsHeaders(request, env)
  });
}

async function handleFeedback(request, env, ctx) {
  let body;
  try {
    body = await readJson(request, 20000);
  } catch (error) {
    if (error.message === "PAYLOAD_TOO_LARGE") return json(request, env, { error: "Request too large." }, 413);
    return json(request, env, { error: "Invalid JSON." }, 400);
  }

  // Honeypot: return success without storing so simple bots do not retry.
  if (clean(body.company, 100)) {
    return json(request, env, { ok: true }, 201);
  }

  const feedback = {
    name: clean(body.name, 80),
    email: clean(body.email, 200),
    comment: clean(body.comment, 2000)
  };

  if (feedback.name.length < 2) return json(request, env, { error: "Please enter your name." }, 400);
  if (feedback.comment.length < 3) return json(request, env, { error: "Please enter a comment." }, 400);

  const meta = requestMetadata(request, body);
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  if (meta.ip !== "unknown") {
    const recent = await env.DB.prepare(`
      SELECT COUNT(*) AS count
      FROM feedback
      WHERE ip = ? AND created_at >= ?
    `).bind(meta.ip, cutoff).first();

    if (Number(recent?.count || 0) >= 5) {
      return json(request, env, { error: "Feedback limit reached for this network. Please try again later." }, 429);
    }
  }

  const id = crypto.randomUUID();

  await env.DB.prepare(`
    INSERT INTO feedback (
      id, created_at, name, email, comment, page, referrer, session_id, visitor_id,
      ip, country, region, city, timezone, colo, asn,
      user_agent, language, screen, viewport, client_timezone,
      github_issue_url, github_mirrored
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, 0)
  `).bind(
    id, meta.createdAt, feedback.name, feedback.email, feedback.comment, meta.page, meta.referrer, meta.sessionId, meta.visitorId,
    meta.ip, meta.country, meta.region, meta.city, meta.timezone, meta.colo, meta.asn,
    meta.userAgent, meta.language, meta.screen, meta.viewport, meta.clientTimezone
  ).run();

  ctx.waitUntil(
    insertEvent(env, meta, "feedback_submit", "contact_feedback_form", { feedbackId: id }).catch((error) => {
      console.error(JSON.stringify({ event: "feedback_event_insert_failed", feedback_id: id, error: String(error) }));
    })
  );

  let githubIssueUrl = null;
  let githubMirrored = false;

  try {
    githubIssueUrl = await createFeedbackGitHubIssue(env, feedback, meta);
    githubMirrored = Boolean(githubIssueUrl);
  } catch (error) {
    console.error(JSON.stringify({ event: "github_mirror_failed", feedback_id: id, error: String(error) }));
  }

  if (githubMirrored) {
    await env.DB.prepare(`
      UPDATE feedback
      SET github_issue_url = ?, github_mirrored = 1
      WHERE id = ?
    `).bind(githubIssueUrl, id).run();
  }

  return json(request, env, {
    ok: true,
    id,
    githubMirrored
  }, 201);
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      if (!originIsAllowed(request, env)) return new Response(null, { status: 403 });
      return new Response(null, { status: 204, headers: corsHeaders(request, env) });
    }

    if (!originIsAllowed(request, env)) {
      return json(request, env, { error: "Origin not allowed." }, 403);
    }

    if (request.method === "GET" && url.pathname === "/health") {
      return json(request, env, { ok: true, service: "portfolio-api" });
    }

    if (request.method === "POST" && url.pathname === "/visit") {
      return handleVisit(request, env, ctx);
    }

    if (request.method === "POST" && url.pathname === "/event") {
      return handleEvent(request, env);
    }

    if (request.method === "POST" && url.pathname === "/feedback") {
      return handleFeedback(request, env, ctx);
    }

    if (request.method === "POST" && url.pathname === "/admin/report") {
      return handleAdminReport(request, env);
    }

    return json(request, env, { error: "Not found." }, 404);
  },

  async scheduled(controller, env, ctx) {
    ctx.waitUntil(
      runWeeklyReport(env, controller.scheduledTime).catch((error) => {
        console.error(JSON.stringify({ event: "weekly_report_failed", error: String(error) }));
      })
    );
  }
};
