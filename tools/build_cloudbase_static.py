#!/usr/bin/env python3
"""Create a CloudBase static-hosting bundle without original heavy media."""

from __future__ import annotations

import json
import shutil
import tempfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INVENTORY = ROOT / "cloudbase-cn" / "media-inventory.json"


def main() -> None:
    inventory = json.loads(INVENTORY.read_text(encoding="utf-8"))
    original_media = {item["path"] for item in inventory["inventory"]}
    destination = Path(tempfile.mkdtemp(prefix="portfolio-cloudbase-static-"))

    for html in ROOT.glob("*.html"):
        shutil.copy2(html, destination / html.name)

    for source in (ROOT / "assets").rglob("*"):
        if not source.is_file():
            continue
        relative = source.relative_to(ROOT).as_posix()
        if relative in original_media:
            continue
        target = destination / source.relative_to(ROOT)
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, target)

    files = [path for path in destination.rglob("*") if path.is_file()]
    payload = {
        "path": str(destination),
        "file_count": len(files),
        "bytes": sum(path.stat().st_size for path in files),
        "excluded_original_media_count": len(original_media),
    }
    print(json.dumps(payload))


if __name__ == "__main__":
    main()
