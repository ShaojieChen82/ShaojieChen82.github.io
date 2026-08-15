const DEFAULT_ORIGIN = "https://shaojiechen82.github.io";

function corsHeaders(request, env) {
  const allowedOrigin = env.ALLOWED_ORIGIN || DEFAULT_ORIGIN;
  const origin = request.headers.get("Origin") || "";
  return {
    "Access-Control-Allow-Origin": origin === allowedOrigin ? origin : allowedOrigin,
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

function clean(value, maxLength) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function publicReview(row) {
  return {
    id: row.id,
    name: row.name,
    rating: row.rating,
    comment: row.comment,
    created_at: row.created_at
  };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");
    const allowedOrigin = env.ALLOWED_ORIGIN || DEFAULT_ORIGIN;

    if (request.method === "OPTIONS") {
      if (origin && origin !== allowedOrigin) {
        return new Response(null, { status: 403 });
      }
      return new Response(null, { status: 204, headers: corsHeaders(request, env) });
    }

    if (origin && origin !== allowedOrigin) {
      return json(request, env, { error: "Origin not allowed." }, 403);
    }

    if (url.pathname !== "/reviews") {
      return json(request, env, { error: "Not found." }, 404);
    }

    if (request.method === "GET") {
      const result = await env.REVIEWS_DB.prepare(`
        SELECT id, name, rating, comment, created_at
        FROM reviews
        WHERE approved = 1
        ORDER BY created_at DESC
        LIMIT 100
      `).all();

      return json(request, env, { reviews: (result.results || []).map(publicReview) });
    }

    if (request.method !== "POST") {
      return json(request, env, { error: "Method not allowed." }, 405);
    }

    const contentLength = Number(request.headers.get("Content-Length") || 0);
    if (contentLength > 12000) {
      return json(request, env, { error: "Request too large." }, 413);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json(request, env, { error: "Invalid JSON." }, 400);
    }

    // Hidden honeypot field. Pretend success so simple bots do not retry.
    if (clean(body.company, 100)) {
      return json(request, env, { ok: true }, 201);
    }

    const name = clean(body.name, 60);
    const contact = clean(body.contact, 160);
    const comment = clean(body.comment, 1200);
    const rating = Number(body.rating);

    if (name.length < 2) return json(request, env, { error: "Please enter your name." }, 400);
    if (contact.length < 3) return json(request, env, { error: "Please enter contact information." }, 400);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) return json(request, env, { error: "Rating must be 1–5 stars." }, 400);
    if (comment.length < 3) return json(request, env, { error: "Please enter a review." }, 400);

    const ip = clean(request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "unknown", 96);
    const userAgent = clean(request.headers.get("User-Agent") || "unknown", 512);
    const cf = request.cf || {};
    const country = clean(cf.country || "", 8);
    const region = clean(cf.region || "", 120);
    const city = clean(cf.city || "", 120);
    const asn = Number(cf.asn || 0) || null;
    const now = new Date().toISOString();
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    if (ip !== "unknown") {
      const recent = await env.REVIEWS_DB.prepare(`
        SELECT COUNT(*) AS count
        FROM reviews
        WHERE ip = ? AND created_at >= ?
      `).bind(ip, cutoff).first();

      if (Number(recent?.count || 0) >= 3) {
        return json(request, env, { error: "Review limit reached for this network. Please try again later." }, 429);
      }
    }

    const id = crypto.randomUUID();

    await env.REVIEWS_DB.prepare(`
      INSERT INTO reviews (
        id, name, contact, rating, comment, created_at,
        ip, user_agent, country, region, city, asn, approved
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `).bind(
      id, name, contact, rating, comment, now,
      ip, userAgent, country, region, city, asn
    ).run();

    return json(request, env, {
      ok: true,
      review: publicReview({ id, name, rating, comment, created_at: now })
    }, 201);
  }
};
