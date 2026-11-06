# Shaojie Chen Engineering Portfolio

Static GitHub Pages portfolio for two recruiter-facing engineering identities:

1. **CHP/MicroGrid mode** — CHP, DER, BESS, controls, and power-system validation.
2. **Motorsport mode** — Active aero, vehicle dynamics, CAN controls, sensors, and track testing.

The centered toggle switches:

- homepage message and background
- theme and colors
- project content
- capability matrix
- resume targeting

Contact information and FAQ are shared.

## Main files

- `index.html` — clean dual-mode homepage
- `projects.html` — project case studies; motorsport side includes slideshow galleries
- `capabilities.html` — dual-mode capability matrix
- `resume.html` — two targeted resume download sections
- `faq.html` — shared FAQ page
- `contact.html` — shared contact page
- `assets/css/style.css` — base theme and layout system
- `assets/css/home.css` — homepage layout
- `assets/css/site-fixes.css` — global fixes, centered toggle, glow, slideshow, lightbox
- `assets/js/site.js` — toggle, background switching, nav cleanup, slideshow, lightbox
- `assets/img/README.md` — image and gallery upload guide
- `assets/files/README.md` — resume PDF upload guide

## Background images

Homepage background images should be uploaded here:

```text
assets/img/background/CHPMicrogrid_background.png
assets/img/background/Motorsport_background.png
```

Use wide 16:9 or 21:9 images. CHP/MicroGrid should leave text-safe room on the left. Motorsport should leave text-safe room on the right.

## Motorsport slideshow galleries

Upload numbered images to these folders:

```text
assets/img/motorsport/galleries/c7-aero/
assets/img/motorsport/galleries/can-controls/
assets/img/motorsport/galleries/track-data/
assets/img/motorsport/galleries/sensors/
```

Use:

```text
01.jpg or 01.png
02.jpg or 02.png
...
12.jpg or 12.png
```

## Resume PDFs

Upload two targeted resumes:

```text
assets/files/Shaojie_Chen_Resume_Microgrid_CHP.pdf
assets/files/Shaojie_Chen_Resume_Motorsport.pdf
```

## Confidentiality note

Keep employer-confidential information out of the public repository:

- passwords
- internal drawings
- unreleased BOMs
- proprietary test reports
- customer-specific deployment information
- supplier confidential data

Use public-safe architecture diagrams, summarized plots, approved photos, and sanitized screenshots.
