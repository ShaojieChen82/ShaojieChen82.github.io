#!/usr/bin/env python3
"""Serve the site with phone input/screen signals for local responsive testing."""

from __future__ import annotations

from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PHONE_SHIM = """<script>
Object.defineProperty(navigator, "maxTouchPoints", { configurable: true, value: 5 });
Object.defineProperty(screen, "width", { configurable: true, get: () => innerWidth });
Object.defineProperty(screen, "height", { configurable: true, get: () => innerHeight });
</script>"""


class PhoneTestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self) -> None:  # noqa: N802 - stdlib handler method name
        path = self.translate_path(self.path.split("?", 1)[0])
        if Path(path).suffix.lower() != ".html":
            return super().do_GET()
        target = Path(path)
        if not target.is_file():
            return super().do_GET()
        body = target.read_text(encoding="utf-8").replace("</head>", PHONE_SHIM + "\n</head>")
        encoded = body.encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(encoded)))
        self.end_headers()
        self.wfile.write(encoded)


if __name__ == "__main__":
    ThreadingHTTPServer(("127.0.0.1", 4174), PhoneTestHandler).serve_forever()
