const DEFAULT_ORIGIN = "https://shaojiechen82.github.io";

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
    page: clean(body.page, 500),
    referrer: clean(body.referrer, 1000),
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

async function insertVisit(env, meta) {
  await env.DB.prepare(`
    INSERT INTO visits (
      id, created_at, session_id, page, referrer, ip,
      country, region, city, timezone, colo, asn,
      user_agent, language, screen, viewport, client_timezone
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    crypto.randomUUID(), meta.createdAt, meta.sessionId, meta.page, meta.referrer, meta.ip,
    meta.country, meta.region, meta.city, meta.timezone, meta.colo, meta.asn,
    meta.userAgent, meta.language, meta.screen, meta.viewport, meta.clientTimezone
  ).run();
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 200;
}

function markdownSafe(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function createGitHubIssue(env, feedback, meta) {
  if (!env.GITHUB_TOKEN || !env.GITHUB_REPO) return null;

  const parts = String(env.GITHUB_REPO).split("/");
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    throw new Error("GITHUB_REPO must be owner/repository");
  }

  const repoPath = `${encodeURIComponent(parts[0])}/${encodeURIComponent(parts[1])}`;
  const issueBody = [
    "## Portfolio feedback",
    "",
    `**Name:** ${markdownSafe(feedback.name)}`,
    `**Email:** ${markdownSafe(feedback.email)}`,
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
    `- Session ID: ${markdownSafe(meta.sessionId)}`
  ].join("\n");

  const response = await fetch(`https://api.github.com/repos/${repoPath}/issues`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
      "Accept": "application/vnd.github+json",
      "Content-Type": "application/json",
      "User-Agent": "shaojiechen-portfolio-feedback-worker",
      "X-GitHub-Api-Version": "2022-11-28"
    },
    body: JSON.stringify({
      title: `Portfolio feedback — ${feedback.name}`,
      body: issueBody,
      labels: env.GITHUB_LABEL ? [String(env.GITHUB_LABEL)] : undefined
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`GitHub issue creation failed (${response.status}): ${message.slice(0, 300)}`);
  }

  const payload = await response.json();
  return clean(payload.html_url, 500) || null;
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
  ctx.waitUntil(
    insertVisit(env, meta).catch((error) => {
      console.error(JSON.stringify({ event: "visit_insert_failed", error: String(error) }));
    })
  );

  return new Response(null, {
    status: 204,
    headers: corsHeaders(request, env)
  });
}

async function handleFeedback(request, env) {
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
  if (!validEmail(feedback.email)) return json(request, env, { error: "Please enter a valid email address." }, 400);
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
      id, created_at, name, email, comment, page, referrer, session_id,
      ip, country, region, city, timezone, colo, asn,
      user_agent, language, screen, viewport, client_timezone,
      github_issue_url, github_mirrored
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, 0)
  `).bind(
    id, meta.createdAt, feedback.name, feedback.email, feedback.comment, meta.page, meta.referrer, meta.sessionId,
    meta.ip, meta.country, meta.region, meta.city, meta.timezone, meta.colo, meta.asn,
    meta.userAgent, meta.language, meta.screen, meta.viewport, meta.clientTimezone
  ).run();

  let githubIssueUrl = null;
  let githubMirrored = false;

  try {
    githubIssueUrl = await createGitHubIssue(env, feedback, meta);
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

    if (request.method === "POST" && url.pathname === "/feedback") {
      return handleFeedback(request, env);
    }

    return json(request, env, { error: "Not found." }, 404);
  }
};
