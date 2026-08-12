/* Portfolio visual case-study redesign v2
   Extends the media catalog before site.js renders galleries on DOMContentLoaded. */

(() => {
  if (typeof MEDIA_GROUPS === "undefined" || typeof EXACT_MEDIA_TITLES === "undefined") return;

  const DAQ_MEDIA = [
    "assets/img/professional/Dewesoft DAQ.jpg",
    "assets/img/professional/DIY_SignalAmplifier for DAQ.png",
  ];

  MEDIA_GROUPS.professionalDaq = DAQ_MEDIA;

  if (Array.isArray(MEDIA_GROUPS.professionalAll)) {
    DAQ_MEDIA.forEach((path) => {
      if (!MEDIA_GROUPS.professionalAll.includes(path)) MEDIA_GROUPS.professionalAll.push(path);
    });
  }

  /* Main case studies use the strongest visual evidence in engineering-story order.
     The full archive remains unchanged and keeps the broader build record. */
  MEDIA_GROUPS.c7Aero = [
    "assets/img/motorsport/galleries/active-aero-install.JPG",
    "assets/img/motorsport/galleries/prototype of active wing carbon fiber wing + aluminum post + plastic braket.JPG",
    "assets/img/motorsport/galleries/showing the front splitter ramp High df vs low drag.JPG",
    "assets/img/motorsport/galleries/waterjet aluminum bracket and post 1.mp4",
    "assets/img/motorsport/galleries/using high pressure water to test the aerodynamics of the front ramp 1.mp4",
  ];

  MEDIA_GROUPS.canControls = [
    "assets/img/motorsport/galleries/PCB 3d screenshot.png",
    "assets/img/motorsport/galleries/testing ios app.PNG",
    "assets/img/motorsport/galleries/testing the actuation of wing on car via phone 1.mp4",
    "assets/img/motorsport/galleries/Testing wing control with IR remote.MP4",
  ];

  MEDIA_GROUPS.sensors = [
    "assets/img/motorsport/galleries/testing the ios app with real camera feed.JPG",
    "assets/img/motorsport/galleries/testing thermal camera with esp32p4.mp4",
    "assets/img/motorsport/galleries/testing thermal camera with web interface.mp4",
  ];

  MEDIA_GROUPS.trackData = [
    "assets/img/motorsport/galleries/c7-track 1.jpg",
    "assets/img/motorsport/galleries/fixing C7 track side at night 1.jpg",
    "assets/img/motorsport/galleries/testing active aero on track gingerman.mp4",
    "assets/img/motorsport/galleries/testing full active aero on track grattan.mp4",
  ];

  EXACT_MEDIA_TITLES.set("Dewesoft DAQ.jpg", "Dewesoft data-acquisition hardware for system validation");
  EXACT_MEDIA_TITLES.set("DIY_SignalAmplifier for DAQ.png", "Custom signal-conditioning / amplifier hardware for DAQ measurements");
  EXACT_MEDIA_TITLES.set("prototype of active wing carbon fiber wing + aluminum post + plastic braket.JPG", "Prototype active-wing assembly: composite wing, aluminum post, and bracket");
  EXACT_MEDIA_TITLES.set("fixing C7 track side at night 1.jpg", "Trackside troubleshooting and repair during development");
})();
