#!/usr/bin/env python3
"""Build a reproducible baseline inventory and media-optimization report."""

from __future__ import annotations

import json
import subprocess
from pathlib import Path
from urllib.parse import quote

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
MANIFEST_PATH = ROOT / "cloudbase-cn" / "media-optimization-manifest.json"
INVENTORY_PATH = ROOT / "cloudbase-cn" / "media-inventory.json"
REPORT_PATH = ROOT / "cloudbase-cn" / "MEDIA_OPTIMIZATION_REPORT.md"
MEDIA_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".mp4", ".mov"}
VIDEO_EXTENSIONS = {".mp4", ".mov"}
TEXT_EXTENSIONS = {".html", ".css", ".js"}


def mb(value: int) -> str:
    return f"{value / 1_000_000:.2f} MB"


def tracked_baseline_media() -> list[str]:
    result = subprocess.run(
        [
            "git",
            "-c",
            f"safe.directory={ROOT.as_posix()}",
            "ls-tree",
            "-r",
            "--name-only",
            "main",
        ],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    return sorted(
        line.strip()
        for line in result.stdout.splitlines()
        if Path(line.strip()).suffix.lower() in MEDIA_EXTENSIONS
    )


def probe_video(path: Path) -> dict:
    result = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration,bit_rate:stream=codec_type,codec_name,width,height,bit_rate",
            "-of",
            "json",
            str(path),
        ],
        check=True,
        capture_output=True,
        text=True,
    )
    probe = json.loads(result.stdout)
    video = next(stream for stream in probe["streams"] if stream.get("codec_type") == "video")
    return {
        "width": int(video["width"]),
        "height": int(video["height"]),
        "duration_seconds": round(float(probe["format"]["duration"]), 3),
        "codec": video.get("codec_name"),
        "bitrate": int(video.get("bit_rate") or probe["format"].get("bit_rate") or 0),
    }


def image_metadata(path: Path) -> dict:
    with Image.open(path) as image:
        oriented = ImageOps.exif_transpose(image)
        return {"width": oriented.width, "height": oriented.height}


def reference_locations(record: dict | None) -> list[str]:
    if not record:
        return []
    variants = {record["source"]}
    if record["kind"] == "image":
        variants.update({record["desktop"], record["mobile"]})
    else:
        variants.add(record["web"])
    needles: set[str] = set()
    for variant in variants:
        needles.add(variant)
        needles.add(quote(variant, safe="/-_."))
        if variant.startswith("assets/"):
            needles.add("../" + variant.removeprefix("assets/"))

    references: list[str] = []
    for path in ROOT.rglob("*"):
        if (
            not path.is_file()
            or ".git" in path.parts
            or path.suffix.lower() not in TEXT_EXTENSIONS
        ):
            continue
        for number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), start=1):
            if any(needle in line for needle in needles):
                references.append(f"{path.relative_to(ROOT).as_posix()}:{number}")
    return sorted(set(references))


def main() -> None:
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    by_source = {record["source"]: record for record in manifest["records"]}
    inventory = []
    for relative in tracked_baseline_media():
        path = ROOT / relative
        metadata = probe_video(path) if path.suffix.lower() in VIDEO_EXTENSIONS else image_metadata(path)
        record = by_source.get(relative)
        references = reference_locations(record)
        inventory.append(
            {
                "path": relative,
                "bytes": path.stat().st_size,
                "kind": "video" if path.suffix.lower() in VIDEO_EXTENSIONS else "image",
                **metadata,
                "references": references,
                "used_by_live_site": record is not None and bool(references),
            }
        )

    total_bytes = sum(item["bytes"] for item in inventory)
    live_bytes = sum(item["bytes"] for item in inventory if item["used_by_live_site"])
    image_bytes = sum(item["bytes"] for item in inventory if item["kind"] == "image")
    video_bytes = sum(item["bytes"] for item in inventory if item["kind"] == "video")
    optimized_image_bytes = sum(
        record["desktop_bytes"] for record in manifest["records"] if record["kind"] == "image"
    )
    optimized_video_bytes = sum(
        record["web_bytes"] for record in manifest["records"] if record["kind"] == "video"
    )
    optimized_bytes = optimized_image_bytes + optimized_video_bytes

    improvements = []
    for record in manifest["records"]:
        after = record["desktop_bytes"] if record["kind"] == "image" else record["web_bytes"]
        improvements.append(
            {
                "path": record["source"],
                "before": record["source_bytes"],
                "after": after,
                "saved": record["source_bytes"] - after,
                "reduction_percent": round((1 - after / record["source_bytes"]) * 100, 1),
            }
        )
    improvements.sort(key=lambda item: item["saved"], reverse=True)

    payload = {
        "baseline_branch": "main",
        "media_file_count": len(inventory),
        "image_file_count": sum(item["kind"] == "image" for item in inventory),
        "video_file_count": sum(item["kind"] == "video" for item in inventory),
        "working_tree_media_bytes_before": total_bytes,
        "referenced_media_bytes_before": live_bytes,
        "image_bytes_before": image_bytes,
        "video_bytes_before": video_bytes,
        "optimized_referenced_media_bytes": optimized_bytes,
        "optimized_image_bytes": optimized_image_bytes,
        "optimized_video_bytes": optimized_video_bytes,
        "bytes_saved": live_bytes - optimized_bytes,
        "reduction_percent": round((1 - optimized_bytes / live_bytes) * 100, 2),
        "largest_20": sorted(inventory, key=lambda item: item["bytes"], reverse=True)[:20],
        "largest_20_improvements": improvements[:20],
        "inventory": inventory,
    }
    INVENTORY_PATH.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")

    lines = [
        "# Media optimization report",
        "",
        "The baseline is the media tracked on `main` before derivatives were generated. Git history and clone-transfer size are excluded.",
        "",
        "## Before and after",
        "",
        "| Metric | Before | After |",
        "|---|---:|---:|",
        f"| Referenced media | {mb(live_bytes)} | {mb(optimized_bytes)} |",
        f"| Referenced images | {mb(sum(item['bytes'] for item in inventory if item['kind'] == 'image' and item['used_by_live_site']))} | {mb(optimized_image_bytes)} |",
        f"| Referenced videos | {mb(sum(item['bytes'] for item in inventory if item['kind'] == 'video' and item['used_by_live_site']))} | {mb(optimized_video_bytes)} |",
        "",
        f"Total working-tree source media: **{mb(total_bytes)}** across {len(inventory)} files.",
        f"Referenced source media: **{mb(live_bytes)}**.",
        f"Saved: **{mb(live_bytes - optimized_bytes)} ({payload['reduction_percent']:.2f}%)**.",
        f"Additional mobile image variants total **{mb(manifest['optimized_mobile_image_bytes'])}** and are selected with responsive markup where useful.",
        "",
        "Original media remains in the repository and Git history. CloudBase deployment uses the optimized derivatives and excludes the original heavy media.",
        "",
        "## Largest 20 source files",
        "",
        "| File | Size | Used by live site |",
        "|---|---:|:---:|",
    ]
    for item in payload["largest_20"]:
        lines.append(f"| `{item['path']}` | {mb(item['bytes'])} | {'yes' if item['used_by_live_site'] else 'no'} |")
    lines.extend(
        [
            "",
            "## Largest 20 improvements",
            "",
            "| File | Before | After | Reduction |",
            "|---|---:|---:|---:|",
        ]
    )
    for item in improvements[:20]:
        lines.append(
            f"| `{item['path']}` | {mb(item['before'])} | {mb(item['after'])} | {item['reduction_percent']:.1f}% |"
        )
    lines.extend(
        [
            "",
            "## Complete baseline inventory",
            "",
            "| Path | Size | Dimensions / video details | References | Live |",
            "|---|---:|---|---|:---:|",
        ]
    )
    for item in inventory:
        if item["kind"] == "image":
            details = f"{item['width']}×{item['height']} image"
        else:
            details = (
                f"{item['width']}×{item['height']}; {item['duration_seconds']:.3f}s; "
                f"{item['codec']}; {item['bitrate'] / 1000:.0f} kbps"
            )
        refs = "<br>".join(f"`{reference}`" for reference in item["references"]) or "—"
        lines.append(
            f"| `{item['path']}` | {mb(item['bytes'])} | {details} | {refs} | {'yes' if item['used_by_live_site'] else 'no'} |"
        )
    REPORT_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(json.dumps({key: value for key, value in payload.items() if key not in {"inventory", "largest_20", "largest_20_improvements"}}, indent=2))


if __name__ == "__main__":
    main()
