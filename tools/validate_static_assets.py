#!/usr/bin/env python3
"""Verify that local HTML/CSS/JavaScript asset references resolve on disk."""

from __future__ import annotations

import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
TEXT_SUFFIXES = {".html", ".css", ".js"}
SKIP_SCHEMES = {"http", "https", "mailto", "tel", "data", "blob"}


def local_path(value: str, source: Path) -> Path | None:
    value = value.strip()
    if not value or value.startswith("#") or value.startswith("//"):
        return None
    parsed = urlsplit(value)
    if parsed.scheme.lower() in SKIP_SCHEMES:
        return None
    decoded = unquote(parsed.path).replace("/", "\\")
    if not decoded:
        return None
    if decoded.lower().startswith("assets\\"):
        return (ROOT / decoded).resolve()
    return (source.parent / decoded).resolve()


class ReferenceParser(HTMLParser):
    def __init__(self, source: Path) -> None:
        super().__init__()
        self.source = source
        self.references: list[str] = []

    def handle_starttag(self, _tag: str, attrs: list[tuple[str, str | None]]) -> None:
        for name, value in attrs:
            if not value:
                continue
            if name in {"src", "href", "poster"}:
                self.references.append(value)
            elif name == "srcset":
                self.references.extend(candidate.strip().rsplit(" ", 1)[0] for candidate in value.split(","))


def references_in(path: Path) -> set[Path]:
    text = path.read_text(encoding="utf-8")
    values: list[str] = []
    if path.suffix.lower() == ".html":
        parser = ReferenceParser(path)
        parser.feed(text)
        values.extend(parser.references)
    elif path.suffix.lower() == ".css":
        values.extend(match[1] for match in re.findall(r"url\(\s*(['\"]?)([^)'\"]+)\1\s*\)", text))
    else:
        values.extend(match[1] for match in re.findall(r"(['\"])(assets/[^'\"]+)\1", text))
    return {resolved for value in values if (resolved := local_path(value, path)) is not None}


def main() -> None:
    missing: list[tuple[Path, Path]] = []
    checked: set[Path] = set()
    sources = [
        path
        for path in ROOT.rglob("*")
        if path.is_file()
        and ".git" not in path.parts
        and path.suffix.lower() in TEXT_SUFFIXES
    ]
    for source in sources:
        for target in references_in(source):
            if not target.suffix:
                continue
            checked.add(target)
            if not target.is_file():
                missing.append((source, target))

    if missing:
        for source, target in missing:
            print(f"MISSING {source.relative_to(ROOT)} -> {target}")
        raise SystemExit(f"{len(missing)} unresolved local asset reference(s)")
    print(f"OK: {len(checked)} unique local asset references resolve across {len(sources)} text files")


if __name__ == "__main__":
    main()
