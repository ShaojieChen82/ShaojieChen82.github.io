# Image Import Guide

The website supports `.jpg`, `.png`, and `.jpeg` images. For most photos, use `.jpg` if file size matters. For screenshots, plots, wiring diagrams, and transparent graphics, use `.png`.

## Background Images

Only the **homepage** and **contact page** use background pictures. The other subpages use plain theme colors.

### CHP/MicroGrid homepage background

Upload your CHP/MicroGrid homepage background here:

```text
assets/img/background/CHPMicrogrid_background.png
```

Optional alternatives also supported:

```text
assets/img/background/CHPMicrogrid_background.jpg
assets/img/background/CHPMicrogrid_background.jpeg
```

Best composition: you on the **right side**, with text-safe space on the **left side**.

### Motorsport homepage background

Upload your Motorsport homepage background here:

```text
assets/img/background/Motorsport_background.png
```

Optional alternatives also supported:

```text
assets/img/background/Motorsport_background.jpg
assets/img/background/Motorsport_background.jpeg
```

Best composition: you or the car on the **left side**, with text-safe space on the **right side**.

### Contact page background

Upload the contact-page background here when ready:

```text
assets/img/background/contact_background.png
```

Optional alternatives also supported manually if the code is updated later, but the current contact page expects the `.png` path above.

Best composition: clean CHP/professional style with enough readable space for the contact cards.

## Professional / CHP-MicroGrid Project Images

These are single visual slots, not slideshows yet. Use either `.jpg`, `.png`, or `.jpeg`.

```text
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

- `e8kw-system` — approved prototype or system photo
- `e8kw-architecture` — public-safe architecture diagram
- `inverter-test` — bench test setup photo
- `ats-ripple-plot` — ATS timing, ripple, or efficiency plot
- `load-emulator` — load bank or test-cell photo
- `control-flow` — control diagram or test-flow diagram
- `comap-dashboard` — public-safe remote monitoring screenshot
- `access-matrix` — public-safe access strategy graphic

## Motorsport Slideshow Galleries

Each motorsport project gallery automatically rotates every 5 seconds. Visitors can click any image to enlarge it.

Use numbered filenames inside each folder:

```text
01.jpg or 01.png
02.jpg or 02.png
03.jpg or 03.png
...
12.jpg or 12.png
```

The website checks `.jpg`, `.png`, then `.jpeg` for each number.

### Gallery folders

```text
assets/img/motorsport/galleries/c7-aero/
assets/img/motorsport/galleries/can-controls/
assets/img/motorsport/galleries/track-data/
assets/img/motorsport/galleries/sensors/
```

Recommended content:

- `c7-aero` — full car, rear wing, actuator, linkage, installation, track photos.
- `can-controls` — ESP32 board, MCP2515, wiring, web dashboard, CAN screenshots, bench testing.
- `track-data` — PDR, Pi Toolbox, suspension travel plots, track maps, setup comparisons.
- `sensors` — suspension sensor concepts, tire thermal screenshots, wheel-well views, instrumentation mockups.

## Upload method in GitHub

1. Open the repository.
2. Navigate to the target folder.
3. Click **Add file → Upload files**.
4. Drag the image into the page.
5. Commit directly to `main`.

If the target folder does not exist, create a placeholder file first using **Add file → Create new file** with the full path.

## Image preparation

- Keep most images under 1 MB for faster loading.
- Use wide 16:9 or 21:9 images for homepage backgrounds.
- Use public-safe images only.
- Do not upload passwords, internal drawings, proprietary test reports, customer data, supplier confidential data, or unapproved internal screenshots.
