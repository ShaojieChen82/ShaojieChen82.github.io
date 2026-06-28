# Image Import Guide

Upload images using these exact filenames so the website fills the reserved visual slots automatically.

## Shared profile image

```text
assets/img/profile.jpg
```

Use a square crop if possible. The site displays it as a circular thumbnail beside your name.

## Professional / Microgrid-CHP images

```text
assets/img/professional/portrait.jpg
assets/img/professional/e8kw-system.jpg
assets/img/professional/e8kw-architecture.jpg
assets/img/professional/inverter-test.jpg
assets/img/professional/ats-ripple-plot.jpg
assets/img/professional/load-emulator.jpg
assets/img/professional/control-flow.jpg
assets/img/professional/comap-dashboard.jpg
assets/img/professional/access-matrix.jpg
```

Recommended content:

- `portrait.jpg` — professional half-body shot
- `e8kw-system.jpg` — approved prototype or system photo
- `e8kw-architecture.jpg` — public-safe architecture diagram
- `inverter-test.jpg` — bench test setup photo
- `ats-ripple-plot.jpg` — ATS timing, ripple, or efficiency plot
- `load-emulator.jpg` — load bank or test-cell photo
- `control-flow.jpg` — control diagram or test-flow diagram
- `comap-dashboard.jpg` — public-safe remote monitoring screenshot
- `access-matrix.jpg` — public-safe access strategy graphic

## Motorsport images

```text
assets/img/motorsport/c7-track.jpg
assets/img/motorsport/active-aero-install.jpg
assets/img/motorsport/can-dashboard.jpg
assets/img/motorsport/wiring-diagram.jpg
assets/img/motorsport/track-data.jpg
assets/img/motorsport/cfd-aero.jpg
assets/img/motorsport/suspension-sensors.jpg
assets/img/motorsport/tire-thermal.jpg
```

Recommended content:

- `c7-track.jpg` — C7 Corvette track or road test photo
- `active-aero-install.jpg` — wing, actuator, linkage, or install photo
- `can-dashboard.jpg` — web dashboard, live data, or control UI screenshot
- `wiring-diagram.jpg` — controller wiring, PCB, or CAN architecture image
- `track-data.jpg` — Pi Toolbox, PDR, or track data screenshot
- `cfd-aero.jpg` — CFD, CAD, aero diagram, or flow visualization
- `suspension-sensors.jpg` — suspension sensor installation or concept
- `tire-thermal.jpg` — thermal camera / tire temperature image

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

- Use `.jpg` for photos and `.png` for diagrams/screenshots if needed.
- Keep most images under 1 MB for faster loading.
- Use public-safe images only. Do not upload confidential drawings, passwords, internal test reports, customer data, or unreleased supplier information.
