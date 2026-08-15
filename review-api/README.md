# Contact Review Backend

This directory contains the server-side API for the Contact page review section. GitHub Pages cannot run server code, so this API is designed for Cloudflare Workers + D1.

## Data behavior

Public review response contains only:
- reviewer name
- 1–5 star rating
- review text
- review date

Private database fields additionally contain:
- contact information submitted by the reviewer
- IP address
- browser/device user-agent
- IP-derived country, region, city, and ASN when Cloudflare provides them

A visitor's MAC address is not available to a normal website browser and is intentionally not collected.

## Deploy

1. Install Wrangler and authenticate with Cloudflare.
2. Create a D1 database named `shaojiechen-reviews`.
3. Copy `wrangler.toml.example` to `wrangler.toml` and replace `REPLACE_WITH_D1_DATABASE_ID` with the database ID.
4. Apply `schema.sql` to the D1 database.
5. Deploy `worker.js` with Wrangler.
6. Copy the deployed Worker origin into `assets/js/review-config.js` as `window.REVIEW_API_URL`.
7. Test GET and POST `/reviews`, then merge the contact-review branch.

## API

### GET /reviews
Returns up to 100 approved reviews, newest first. Private fields are never returned.

### POST /reviews
JSON body:

```json
{
  "name": "Visitor Name",
  "contact": "visitor@example.com",
  "rating": 5,
  "comment": "Review text",
  "company": ""
}
```

The `company` field is a honeypot and should remain empty. The API limits a network to 3 accepted reviews per 24 hours.
