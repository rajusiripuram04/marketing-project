/* Dismiss the opening Vijayadashami greeting after its four-second banner. */
(() => {
  "use strict";
  const intro = document.getElementById("festivalIntro");
  if (!intro) return;

  window.setTimeout(() => {
    intro.hidden = true;
    intro.setAttribute("aria-hidden", "true");
  }, 4000);
})();
