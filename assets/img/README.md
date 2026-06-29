# Image Import Guide

Upload images using the listed base filenames. Each visual slot accepts either `.jpg` or `.png`.

Example: if the guide says `profile.jpg`, you may upload either:

```text
assets/img/profile.jpg
assets/img/profile.png
```

The site tries `.jpg` first and automatically falls back to `.png`. If you upload both, the `.jpg` version will display.

## Shared profile image

```text
assets/img/profile.jpg
assets/img/profile.png
```

Use a square crop if possible. If the header profile icon is used again later, the site can display it as a circular thumbnail.

## Custom page backgrounds

The homepage and other pages can use different background images for each portfolio mode. Each mode accepts `.jpg`, `.png`, or `.jpeg`.

CHP/MicroGrid background:

```text
assets/img/background/CHPMicrogrid_background.jpg
assets/img/background/CHPMicrogrid_background.png
assets/img/background/CHPMicrogrid_background.jpeg
```

Motorsport background:

```text
assets/img/background/Motorsport_background.jpg
assets/img/background/Motorsport_background.png
assets/img/background/Motorsport_background.jpeg
```

The code also checks the misspelled fallback name `Motorsport_bacground` in case that file name is uploaded. The site applies an overlay automatically so text remains readable.

Recommended background image types:

- CHP/MicroGrid: clean professional portrait on the right, lab/test setup, CHP unit, inverter bench, or engineering workspace photo.
- Motorsport: C7 track photo or portrait on the left, active aero close-up, pit/garage photo, CFD render, or dark technical vehicle image.

## Professional / CHP-MicroGrid images

You can use `.jpg` or `.png` for each base filename:

```text
assets/img/professional/portrait.jpg                  or portrait.png
assets/img/professional/e8kw-system.jpg               or e8kw-system.png
assets/img/professional/e8kw-architecture.jpg         or e8kw-architecture.png
assets/img/professional/inverter-test.jpg             or inverter-test.png
assets/img/professional/ats-ripple-plot.jpg           or ats-ripple-plot.png
assets/img/professional/load-emulator.jpg             or load-emulator.png
assets/img/professional/control-flow.jpg              or control-flow.png
assets/img/professional/comap-dashboard.jpg           or comap-dashboard.png
assets/img/professional/access-matrix.jpg             or access-matrix.png
```

Recommended content:

- `portrait` — professional half-body shot
- `e8kw-system` — approved prototype or system photo
- `e8kw-architecture` — public-safe architecture diagram
- `inverter-test` — bench test setup photo
- `ats-ripple-plot` — ATS timing, ripple, or efficiency plot
- `load-emulator` — load bank or test-cell photo
- `control-flow` — control diagram or test-flow diagram
- `comap-dashboard` — public-safe remote monitoring screenshot
- `access-matrix` — public-safe access strategy graphic

## Motorsport images

You can use `.jpg` or `.png` for each base filename:

```text
assets/img/motorsport/c7-track.jpg                    or c7-track.png
assets/img/motorsport/active-aero-install.jpg         or active-aero-install.png
assets/img/motorsport/can-dashboard.jpg               or can-dashboard.png
assets/img/motorsport/wiring-diagram.jpg              or wiring-diagram.png
assets/img/motorsport/track-data.jpg                  or track-data.png
assets/img/motorsport/cfd-aero.jpg                    or cfd-aero.png
assets/img/motorsport/suspension-sensors.jpg          or suspension-sensors.png
assets/img/motorsport/tire-thermal.jpg                or tire-thermal.png
```

Recommended content:

- `c7-track` — C7 Corvette track or road test photo
- `active-aero-install` — wing, actuator, linkage, or install photo
- `can-dashboard` — web dashboard, live data, or control UI screenshot
- `wiring-diagram` — controller wiring, PCB, or CAN architecture image
- `track-data` — Pi Toolbox, PDR, or track data screenshot
- `cfd-aero` — CFD, CAD, aero diagram, or flow visualization
- `suspension-sensors` — suspension sensor installation or concept
- `tire-thermal` — thermal camera / tire temperature image

## Upload method

GitHub web UI:

1. Open the repository.
2. Navigate to the target folder, such as `assets/img/motorsport/`.
3. Click **Add file → Upload files**.
4. Drag the image into the page.
5. Commit directly to `main`.

If the folder does not exist yet, click **Add file → Create new file**, type the full path such as:

```text
assets/img/motorsport/c7-track.jpg
```

Then upload through the GitHub interface or use Git locally.

## Image preparation

- Use `.jpg` for photos when file size matters.
- Use `.png` for diagrams, screenshots, plots, wiring diagrams, or transparent graphics.
- Keep most images under 1 MB for faster loading.
- Use a wide image, roughly 16:9 or 21:9, for background photos.
- Use public-safe images only. Do not upload confidential drawings, passwords, internal test reports, customer data, or unreleased supplier information.
