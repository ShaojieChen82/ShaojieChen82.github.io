(() => {
  const form = document.getElementById("review-form");
  const list = document.getElementById("reviews-list");
  const averageEl = document.getElementById("reviews-average");
  const countEl = document.getElementById("reviews-count");
  const summaryStarsEl = document.getElementById("reviews-summary-stars");
  const statusEl = document.getElementById("review-form-status");

  if (!form || !list) return;

  const apiBase = String(window.REVIEW_API_URL || "").replace(/\/+$/, "");
  const submitButton = form.querySelector("button[type='submit']");

  function stars(rating) {
    const value = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
    return `${"★".repeat(value)}${"☆".repeat(5 - value)}`;
  }

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric"
    }).format(date);
  }

  function renderSummary(reviews) {
    if (!reviews.length) {
      averageEl.textContent = "—";
      summaryStarsEl.textContent = "☆☆☆☆☆";
      countEl.textContent = "No reviews yet";
      return;
    }

    const average = reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length;
    averageEl.textContent = average.toFixed(1);
    summaryStarsEl.textContent = stars(average);
    countEl.textContent = `${reviews.length} review${reviews.length === 1 ? "" : "s"}`;
  }

  function renderReviews(reviews) {
    list.replaceChildren();
    renderSummary(reviews);

    if (!reviews.length) {
      const empty = document.createElement("p");
      empty.className = "reviews-empty";
      empty.textContent = "No reviews yet. Be the first to leave one.";
      list.appendChild(empty);
      return;
    }

    for (const review of reviews) {
      const card = document.createElement("article");
      card.className = "review-card";

      const header = document.createElement("div");
      header.className = "review-card-header";

      const authorWrap = document.createElement("div");
      const author = document.createElement("p");
      author.className = "review-author";
      author.textContent = review.name || "Visitor";
      const rating = document.createElement("p");
      rating.className = "review-stars";
      rating.setAttribute("aria-label", `${review.rating} out of 5 stars`);
      rating.textContent = stars(review.rating);
      authorWrap.append(author, rating);

      const date = document.createElement("time");
      date.className = "review-date";
      date.dateTime = review.created_at || "";
      date.textContent = formatDate(review.created_at);

      const comment = document.createElement("p");
      comment.className = "review-comment";
      comment.textContent = review.comment || "";

      header.append(authorWrap, date);
      card.append(header, comment);
      list.appendChild(card);
    }
  }

  async function loadReviews() {
    if (!apiBase) {
      list.innerHTML = '<p class="reviews-error">Review service is not connected yet.</p>';
      submitButton.disabled = true;
      statusEl.textContent = "Backend endpoint required.";
      return;
    }

    try {
      const response = await fetch(`${apiBase}/reviews`, { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      renderReviews(Array.isArray(payload.reviews) ? payload.reviews : []);
    } catch (error) {
      console.error("Unable to load reviews", error);
      list.innerHTML = '<p class="reviews-error">Reviews could not be loaded right now.</p>';
    }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!apiBase) return;

    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || "").trim(),
      contact: String(data.get("contact") || "").trim(),
      rating: Number(data.get("rating")),
      comment: String(data.get("comment") || "").trim(),
      company: String(data.get("company") || "").trim()
    };

    submitButton.disabled = true;
    statusEl.textContent = "Submitting…";

    try {
      const response = await fetch(`${apiBase}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || `HTTP ${response.status}`);

      form.reset();
      statusEl.textContent = "Review submitted. Thank you.";
      await loadReviews();
    } catch (error) {
      console.error("Unable to submit review", error);
      statusEl.textContent = error.message || "Unable to submit review.";
    } finally {
      submitButton.disabled = false;
    }
  });

  loadReviews();
})();
