#!/usr/bin/env python3
"""Create web media derivatives without modifying the source assets.

This is a development-only utility. The generated manifest is the source-to-web
mapping used by the Tencent CloudBase static deployment.
"""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
from fractions import Fraction
from pathlib import Path
from urllib.parse import quote

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
MANIFEST_PATH = ROOT / "cloudbase-cn" / "media-optimization-manifest.json"
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png"}
VIDEO_EXTENSIONS = {".mp4", ".mov"}
UNREFERENCED_MEDIA = {
    "assets/img/motorsport/active-aero-install.JPG",
    "assets/img/motorsport/c7-track.jpg",
    "assets/img/motorsport/can-dashboard.MP4",
    "assets/img/motorsport/portrait.png",
    "assets/img/professional/portrait.png",
    "assets/img/profile.png",
}
BACKGROUND_NAMES = {"CHPMicrogrid_background.png", "Motorsport_background.png"}
ENGINEERING_IMAGE_NAMES = {
    "CHP Resume Screenshot.png",
    "Motorsport Resume Screenshot.png",
    "Patent Screenshot.png",
    "PCB 2d screenshot.png",
    "PCB 3d screenshot.png",
    "PCB 3d screenshot back.png",
    "testing ios app.PNG",
    "DIY_SignalAmplifier for DAQ.png",
    "E200Diagram.png",
    "OP4S Engine.png",
    "Websupervisor.png",
}


def relative(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def probe_video(path: Path, ffprobe: str) -> dict:
    command = [
        ffprobe,
        "-v",
        "error",
        "-show_entries",
        "format=duration,bit_rate:stream=index,codec_type,codec_name,width,height,pix_fmt,avg_frame_rate,bit_rate",
        "-of",
        "json",
        str(path),
    ]
    result = subprocess.run(command, check=True, capture_output=True, text=True)
    return json.loads(result.stdout)


def frame_rate(probe: dict) -> float:
    video = next(stream for stream in probe["streams"] if stream.get("codec_type") == "video")
    value = video.get("avg_frame_rate") or "0/1"
    try:
        return float(Fraction(value))
    except (ValueError, ZeroDivisionError):
        return 0.0


def image_class(path: Path) -> str:
    if path.name in BACKGROUND_NAMES:
        return "photographic_background"
    if path.name in ENGINEERING_IMAGE_NAMES:
        return "engineering_graphic"
    return "photograph"


def prepared_image(path: Path) -> Image.Image:
    with Image.open(path) as source:
        source.seek(0)
        image = ImageOps.exif_transpose(source).copy()
    if "A" in image.getbands() or "transparency" in image.info:
        return image.convert("RGBA")
    return image.convert("RGB")


def resized(image: Image.Image, long_edge: int | None) -> Image.Image:
    output = image.copy()
    if long_edge and max(output.size) > long_edge:
        output.thumbnail((long_edge, long_edge), Image.Resampling.LANCZOS)
    return output


def save_webp(image: Image.Image, output: Path, quality: int) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    image.save(
        output,
        "WEBP",
        quality=quality,
        method=6,
        exact="A" in image.getbands(),
        exif=b"",
        icc_profile=None,
    )


def optimize_image(path: Path, force: bool) -> dict:
    category = image_class(path)
    source = prepared_image(path)
    source_has_alpha = "A" in source.getbands()
    desktop_limit = None if category == "engineering_graphic" else 1920
    mobile_limit = 1280 if category == "photographic_background" else 960
    desktop_quality = 92 if category == "engineering_graphic" else 84
    mobile_quality = 90 if category == "engineering_graphic" else 82

    desktop = resized(source, desktop_limit)
    desktop_path = path.with_suffix(".webp")
    if force or not desktop_path.exists():
        save_webp(desktop, desktop_path, desktop_quality)

    if max(desktop.size) > mobile_limit:
        mobile = resized(source, mobile_limit)
        mobile_path = path.with_name(f"{path.stem}-{mobile_limit}.webp")
        if force or not mobile_path.exists():
            save_webp(mobile, mobile_path, mobile_quality)
    else:
        mobile = desktop
        mobile_path = desktop_path

    return {
        "kind": "image",
        "class": category,
        "source": relative(path),
        "source_bytes": path.stat().st_size,
        "source_width": source.width,
        "source_height": source.height,
        "has_transparency": source_has_alpha,
        "desktop": relative(desktop_path),
        "desktop_bytes": desktop_path.stat().st_size,
        "desktop_width": desktop.width,
        "desktop_height": desktop.height,
        "mobile": relative(mobile_path),
        "mobile_bytes": mobile_path.stat().st_size,
        "mobile_width": mobile.width,
        "mobile_height": mobile.height,
    }


def optimize_video(path: Path, ffmpeg: str, ffprobe: str, force: bool) -> dict:
    before = probe_video(path, ffprobe)
    video = next(stream for stream in before["streams"] if stream.get("codec_type") == "video")
    width = int(video["width"])
    height = int(video["height"])
    is_detail_clip = path.name.lower() == "testing thermal camera with web interface.mp4"
    if is_detail_clip:
        max_width, max_height = width, height
    elif width >= height:
        max_width, max_height = 1280, 720
    else:
        max_width, max_height = 720, 1280

    filters = [
        f"scale=w='min(iw,{max_width})':h='min(ih,{max_height})':"
        "force_original_aspect_ratio=decrease:force_divisible_by=2:out_range=tv",
        "format=yuv420p",
    ]
    if frame_rate(before) > 30.01:
        filters.append("fps=30")

    lower_name = path.name.lower()
    crf = 23 if "track" in lower_name else 24
    output = path.with_name(f"{path.stem}.web.mp4")
    command = [
        ffmpeg,
        "-hide_banner",
        "-loglevel",
        "error",
        "-y",
        "-i",
        str(path),
        "-map",
        "0:v:0",
        "-map",
        "0:a:0?",
        "-vf",
        ",".join(filters),
        "-c:v",
        "libx264",
        "-preset",
        "slow",
        "-crf",
        str(crf),
        "-pix_fmt",
        "yuv420p",
        "-color_range",
        "tv",
        "-c:a",
        "aac",
        "-b:a",
        "96k",
        "-movflags",
        "+faststart",
        "-map_metadata",
        "-1",
        str(output),
    ]
    if force or not output.exists():
        subprocess.run(command, check=True)

    after = probe_video(output, ffprobe)
    after_video = next(stream for stream in after["streams"] if stream.get("codec_type") == "video")
    atoms = output.read_bytes()
    moov_position = atoms.find(b"moov")
    mdat_position = atoms.find(b"mdat")
    return {
        "kind": "video",
        "class": "engineering_detail_video" if is_detail_clip else "web_video",
        "source": relative(path),
        "source_bytes": path.stat().st_size,
        "source_width": width,
        "source_height": height,
        "source_duration_seconds": float(before["format"]["duration"]),
        "source_codec": video.get("codec_name"),
        "source_bitrate": int(before["format"].get("bit_rate") or 0),
        "source_frame_rate": frame_rate(before),
        "web": relative(output),
        "web_bytes": output.stat().st_size,
        "web_width": int(after_video["width"]),
        "web_height": int(after_video["height"]),
        "web_duration_seconds": float(after["format"]["duration"]),
        "web_codec": after_video.get("codec_name"),
        "web_pixel_format": after_video.get("pix_fmt"),
        "web_bitrate": int(after["format"].get("bit_rate") or 0),
        "web_frame_rate": frame_rate(after),
        "faststart": 0 <= moov_position < mdat_position,
        "has_audio": any(stream.get("codec_type") == "audio" for stream in after["streams"]),
    }


def responsive_src_attributes(record: dict) -> str:
    desktop = quote(record["desktop"], safe="/-_.")
    mobile = quote(record["mobile"], safe="/-_.")
    if desktop == mobile:
        return f'src="{desktop}"'
    return (
        f'src="{desktop}" srcset="{mobile} {record["mobile_width"]}w, '
        f'{desktop} {record["desktop_width"]}w" '
        'sizes="(max-width: 767px) 92vw, 45vw"'
    )


def rewrite_references(records: list[dict]) -> None:
    text_files = [
        path
        for path in ROOT.rglob("*")
        if path.is_file()
        and ".git" not in path.parts
        and path.suffix.lower() in {".html", ".css", ".js"}
    ]
    image_records = [record for record in records if record["kind"] == "image"]
    video_records = [record for record in records if record["kind"] == "video"]

    for path in text_files:
        text = path.read_text(encoding="utf-8")
        original = text
        is_mobile_script = path.name in {"mobile-v2.js", "mobile-v3.js"}

        for record in image_records:
            source = record["source"]
            encoded_source = quote(source, safe="/-_.")
            replacement = record["mobile"] if is_mobile_script else record["desktop"]
            if path.suffix.lower() == ".html":
                text = text.replace(f'src="{source}"', responsive_src_attributes(record))
                text = text.replace(f'src="{encoded_source}"', responsive_src_attributes(record))
            text = text.replace(source, replacement)
            text = text.replace(encoded_source, quote(replacement, safe="/-_."))
            if path.suffix.lower() == ".css":
                text = text.replace(source.removeprefix("assets/"), replacement.removeprefix("assets/"))
                text = text.replace(
                    "../" + source.removeprefix("assets/"),
                    "../" + replacement.removeprefix("assets/"),
                )

        for record in video_records:
            text = text.replace(record["source"], record["web"])

        if text != original:
            path.write_text(text, encoding="utf-8", newline="")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--force", action="store_true")
    parser.add_argument("--rewrite-references", action="store_true")
    args = parser.parse_args()

    ffmpeg = shutil.which("ffmpeg")
    ffprobe = shutil.which("ffprobe")
    if not ffmpeg or not ffprobe:
        raise SystemExit("ffmpeg and ffprobe must be available on PATH")

    sources = sorted(
        path
        for path in ROOT.rglob("*")
        if path.is_file()
        and ".git" not in path.parts
        and relative(path) not in UNREFERENCED_MEDIA
        and path.suffix.lower() in IMAGE_EXTENSIONS | VIDEO_EXTENSIONS
        and not path.name.lower().endswith(".web.mp4")
    )
    records = []
    for path in sources:
        print(f"optimizing {relative(path)}", flush=True)
        if path.suffix.lower() in IMAGE_EXTENSIONS:
            records.append(optimize_image(path, args.force))
        else:
            records.append(optimize_video(path, ffmpeg, ffprobe, args.force))

    manifest = {
        "version": 1,
        "source_media_bytes": sum(record["source_bytes"] for record in records),
        "optimized_desktop_media_bytes": sum(
            record["desktop_bytes"] if record["kind"] == "image" else record["web_bytes"]
            for record in records
        ),
        "optimized_mobile_image_bytes": sum(
            record["mobile_bytes"] for record in records if record["kind"] == "image"
        ),
        "records": records,
    }
    MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    if args.rewrite_references:
        rewrite_references(records)

    print(json.dumps({key: value for key, value in manifest.items() if key != "records"}, indent=2))


if __name__ == "__main__":
    main()
