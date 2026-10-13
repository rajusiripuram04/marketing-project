/* Soft silk movement, warm light, and a grounded festival composition. */
(() => {
  "use strict";
  const section = document.querySelector(".opening-section");
  if (!section) return;

  const stage = section.querySelector(".festival-stage");
  const depth = section.querySelector(".stage-depth");
  const fabric = section.querySelector(".fabric-fallback");
  const motionButton = section.querySelector(".festival-motion-toggle");
  const lightButton = section.querySelector(".festival-light-button");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const coarsePointer = matchMedia("(pointer: coarse)");
  let paused = false;
  let inView = true;
  let lit = false;
  let frameId = 0;
  let previousFrame = 0;
  let previousClothFrame = 0;
  let breezeTime = 0;
  let petalsTimer;
  let cloth;
  const pointer = { x: 0, y: 0, goalX: 0, goalY: 0 };
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const canAnimate = () => !paused && !reducedMotion.matches && inView && !document.hidden;

  function applyLightPosition() {
    stage.style.setProperty("--parallax-x", `${(pointer.x * 3).toFixed(2)}px`);
    stage.style.setProperty("--parallax-y", `${(pointer.y * 2).toFixed(2)}px`);
    stage.style.setProperty("--glow-x", `${(50 + pointer.x * 10).toFixed(2)}%`);
    stage.style.setProperty("--glow-y", `${(42 + pointer.y * 7).toFixed(2)}%`);
  }

  function resetPointer() {
    pointer.x = pointer.y = pointer.goalX = pointer.goalY = 0;
    applyLightPosition();
  }

  function requestFrame() {
    if (!frameId && canAnimate()) frameId = requestAnimationFrame(animate);
  }

  function animate(now) {
    frameId = 0;
    if (!canAnimate()) return;
    const elapsed = previousFrame ? Math.min(now - previousFrame, 60) : 16.7;
    previousFrame = now;
    const easing = 1 - Math.exp(-elapsed / 150);
    pointer.x += (pointer.goalX - pointer.x) * easing;
    pointer.y += (pointer.goalY - pointer.y) * easing;
    const movingPointer = Math.abs(pointer.goalX - pointer.x) + Math.abs(pointer.goalY - pointer.y) > .002;
    if (!movingPointer) {
      pointer.x = pointer.goalX;
      pointer.y = pointer.goalY;
    }
    applyLightPosition();
    breezeTime += elapsed / 1000;
    if (cloth && now - previousClothFrame >= 1000 / 30) {
      drawCloth(breezeTime);
      previousClothFrame = now;
    }
    if ((cloth && cloth.width && cloth.height) || movingPointer) requestFrame();
    else previousFrame = 0;
  }

  function traceCloth(context, points) {
    context.beginPath();
    context.moveTo(points[0].x, points[0].top);
    for (let index = 1; index < points.length; index++) context.lineTo(points[index].x, points[index].top);
    for (let index = points.length - 1; index >= 0; index--) context.lineTo(points[index].x, points[index].bottom);
    context.closePath();
  }

  function drawCloth(time) {
    if (!cloth || !cloth.width || !cloth.height) return;
    const { context, width, height, ratio, weave } = cloth;
    const strips = 64;
    const points = [];
    const phase = time * .7;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);

    for (let index = 0; index <= strips; index++) {
      const u = index / strips;
      const wave = u * Math.PI * 4.1 - phase;
      const fineWave = u * Math.PI * 7.4 - phase * .76;
      const envelope = .2 + .8 * u;
      // The left hem is attached; waves become deeper toward the free edge.
      const slope = .045 * (
        Math.cos(wave) * Math.PI * 4.1 * envelope + Math.sin(wave) * .8
        + .28 * Math.cos(fineWave) * Math.PI * 7.4
      );
      points.push({
        x: width * (.018 + u * .954 + Math.sin(wave) * u * .004),
        top: height * (.075 + .022 * u + Math.sin(wave) * .023 * u),
        bottom: height * (.925 - .045 * u + Math.sin(wave + .35) * .026 * u),
        slope
      });
    }

    for (let index = 0; index < strips; index++) {
      const left = points[index];
      const right = points[index + 1];
      const slope = (left.slope + right.slope) / 2;
      const surfaceLight = (.78 - .48 * slope) / Math.sqrt(1 + slope * slope);
      const sheen = Math.pow(clamp((surfaceLight - .52) / .48, 0, 1), 7) * .22;
      const shade = .62 + surfaceLight * .5 + sheen;
      const color = (red, green, blue) => `rgb(${Math.round(red * shade)}, ${Math.round(green * shade)}, ${Math.round(blue * shade)})`;
      const gradient = context.createLinearGradient(0, left.top, 0, left.bottom);
      gradient.addColorStop(0, color(157, 43, 44));
      gradient.addColorStop(.45, color(137, 32, 40));
      gradient.addColorStop(1, color(105, 23, 33));
      context.fillStyle = gradient;
      context.beginPath();
      context.moveTo(left.x, left.top);
      context.lineTo(right.x + .65, right.top);
      context.lineTo(right.x + .65, right.bottom);
      context.lineTo(left.x, left.bottom);
      context.closePath();
      context.fill();
    }

    if (weave) {
      context.save();
      traceCloth(context, points);
      context.clip();
      context.fillStyle = weave;
      context.fillRect(0, 0, width, height);
      context.restore();
    }

    traceCloth(context, points);
    context.strokeStyle = "rgba(74, 35, 21, .85)";
    context.lineWidth = 3;
    context.stroke();
    context.strokeStyle = "rgba(223, 174, 100, .78)";
    context.lineWidth = 1.15;
    context.stroke();
    context.beginPath();
    for (let index = 0; index < points.length; index++) {
      const point = points[index];
      if (!index) context.moveTo(point.x, point.top + 4);
      else context.lineTo(point.x, point.top + 4);
    }
    for (let index = points.length - 1; index >= 0; index--) {
      const point = points[index];
      if (index === points.length - 1) context.moveTo(point.x, point.bottom - 4);
      else context.lineTo(point.x, point.bottom - 4);
    }
    context.strokeStyle = "rgba(232, 182, 107, .28)";
    context.lineWidth = .7;
    context.stroke();
    fabric.classList.add("has-cloth");
  }

  function resizeCloth() {
    if (!cloth) return;
    const width = fabric.clientWidth;
    const height = fabric.clientHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    if (width !== cloth.width || height !== cloth.height || ratio !== cloth.ratio) {
      cloth.width = width;
      cloth.height = height;
      cloth.ratio = ratio;
      cloth.canvas.width = Math.max(1, Math.round(width * ratio));
      cloth.canvas.height = Math.max(1, Math.round(height * ratio));
      drawCloth(reducedMotion.matches ? 0 : breezeTime);
    }
    requestFrame();
  }

  function createCloth() {
    if (!fabric) return;
    const canvas = document.createElement("canvas");
    canvas.className = "festival-cloth-canvas";
    canvas.setAttribute("aria-hidden", "true");
    const context = canvas.getContext("2d");
    if (!context) return;
    const texture = document.createElement("canvas");
    texture.width = texture.height = 6;
    const textureContext = texture.getContext("2d");
    if (textureContext) {
      textureContext.fillStyle = "rgba(255, 223, 174, .026)";
      textureContext.fillRect(0, 0, 6, 1);
      textureContext.fillStyle = "rgba(35, 9, 15, .04)";
      textureContext.fillRect(1, 0, 1, 6);
    }
    cloth = { canvas, context, width: 0, height: 0, ratio: 1, weave: context.createPattern(texture, "repeat") };
    fabric.append(canvas);
    resizeCloth();
    if ("ResizeObserver" in window) new ResizeObserver(resizeCloth).observe(fabric);
    else window.addEventListener("resize", resizeCloth, { passive: true });
  }

  function syncMotion() {
    const active = canAnimate();
    section.classList.toggle("is-paused", !active);
    motionButton.hidden = reducedMotion.matches;
    if (frameId) cancelAnimationFrame(frameId);
    frameId = 0;
    previousFrame = previousClothFrame = 0;
    if (!active || coarsePointer.matches) resetPointer();
    if (reducedMotion.matches) {
      section.querySelector(".celebration-petals")?.remove();
      drawCloth(0);
    }
    if (active) requestFrame();
  }

  function followPointer(event) {
    if (!canAnimate() || coarsePointer.matches || event.pointerType === "touch") return;
    const bounds = stage.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    pointer.goalX = clamp(((event.clientX - bounds.left) / bounds.width - .5) * 2, -1, 1);
    pointer.goalY = clamp(((event.clientY - bounds.top) / bounds.height - .5) * 2, -1, 1);
    requestFrame();
  }

  function releasePointer() {
    pointer.goalX = pointer.goalY = 0;
    if (canAnimate()) requestFrame();
    else resetPointer();
  }

  function celebrate() {
    clearTimeout(petalsTimer);
    section.querySelector(".celebration-petals")?.remove();
    if (!canAnimate()) return;
    const petals = document.createElement("div");
    petals.className = "celebration-petals";
    petals.setAttribute("aria-hidden", "true");
    for (let index = 0; index < 18; index++) {
      const petal = document.createElement("i");
      petal.style.setProperty("--petal-x", `${12 + index * 37 % 78}%`);
      petal.style.setProperty("--petal-size", `${6 + index % 4 * 2}px`);
      petal.style.setProperty("--petal-duration", `${4.4 + index % 4 * .4}s`);
      petal.style.setProperty("--petal-delay", `${index * .07}s`);
      petal.style.setProperty("--petal-drift", `${index % 2 ? 36 : -36}px`);
      petals.append(petal);
    }
    depth.append(petals);
    petalsTimer = setTimeout(() => petals.remove(), 7600);
  }

  stage.addEventListener("pointermove", followPointer, { passive: true });
  stage.addEventListener("pointerleave", releasePointer, { passive: true });
  stage.addEventListener("pointercancel", releasePointer, { passive: true });
  window.addEventListener("blur", resetPointer);

  lightButton.addEventListener("click", () => {
    lit = !lit;
    section.classList.toggle("is-lit", lit);
    lightButton.setAttribute("aria-pressed", String(lit));
    lightButton.querySelector(".diya-label").textContent = lit ? "A light for new beginnings" : "Share the light";
    section.querySelector(".festival-live").textContent = lit
      ? "May the warmth of Vijayadashami stay with you and your loved ones."
      : "Wishing you and your loved ones a joyful Vijayadashami.";
    if (lit) celebrate();
    else section.querySelector(".celebration-petals")?.remove();
  });

  motionButton.addEventListener("click", () => {
    paused = !paused;
    motionButton.querySelector(".motion-label").textContent = paused ? "Play animation" : "Pause animation";
    motionButton.firstElementChild.textContent = paused ? "\u25b6" : "\u2161";
    syncMotion();
  });

  section.querySelectorAll(".stage-particles i").forEach((particle, index) => {
    particle.style.setProperty("--particle-x", `${9 + (index * 29) % 85}%`);
    particle.style.setProperty("--particle-y", `${10 + (index * 17) % 74}%`);
    particle.style.setProperty("--particle-duration", `${8 + index % 5}s`);
    particle.style.setProperty("--particle-delay", `${-index * 1.3}s`);
  });

  if ("IntersectionObserver" in window) {
    inView = false;
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncMotion();
    }, { threshold: 0 }).observe(section);
  }
  document.addEventListener("visibilitychange", syncMotion);
  reducedMotion.addEventListener("change", syncMotion);
  coarsePointer.addEventListener("change", syncMotion);
  try {
    createCloth();
  } catch {
    // Keep the CSS fabric and other interactions if canvas is unavailable.
    cloth = undefined;
    fabric?.classList.remove("has-cloth");
    fabric?.querySelector(".festival-cloth-canvas")?.remove();
  }
  syncMotion();
})();
