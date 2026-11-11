// ===== ACCUEIL : curseur-sigil, bascule 3D de l'emblème, runes cachées =====
// Propre à index.html — ne touche à rien du boot/login géré par script.js.
(function () {
  const zone = document.querySelector(".ac-main");
  if (!zone) return;

  const point = document.querySelector(".ac-curseur-point");
  const anneau = document.querySelector(".ac-curseur-anneau");
  const emblem = document.querySelector(".ac-emblem-cercle");
  const runes = document.querySelector(".ac-runes-cachees");
  const runesLabel = document.querySelector(".ac-runes-label");

  zone.addEventListener("mousemove", function (e) {
    const x = e.clientX;
    const y = e.clientY;

    if (point) {
      point.style.left = x + "px";
      point.style.top = y + "px";
    }
    if (anneau) {
      anneau.style.left = x + "px";
      anneau.style.top = y + "px";
    }

    if (emblem) {
      // Bascule 3D de l'emblème vers le curseur
      const mx = x / window.innerWidth;
      const my = y / window.innerHeight;
      const rotY = ((mx - 0.5) * 26).toFixed(1);
      const rotX = ((0.5 - my) * 18).toFixed(1);
      emblem.style.transform = "perspective(700px) rotateY(" + rotY + "deg) rotateX(" + rotX + "deg)";

      // Runes cachées : révélées seulement si le curseur approche vraiment
      // le centre de l'emblème (mesuré en direct, pas une position fixe).
      const rect = emblem.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(x - cx, y - cy);
      const opacity = dist < 300 ? Math.max(0, 1 - dist / 300) : 0;

      if (runes) runes.style.opacity = opacity;
      if (runesLabel) runesLabel.style.opacity = opacity;
    }
  });
})();

// ===== PENTACLE-NAV : survol sur ordinateur, tap sur tactile =====
(function () {
  const zone = document.getElementById("ac-emblem-zone");
  const bouton = document.getElementById("ac-emblem-bouton");
  if (!zone || !bouton) return;

  const sansHover = window.matchMedia("(hover: none)").matches;
  if (!sansHover) return; // le survol CSS suffit sur ordinateur

  function fermer(e) {
    if (!zone.contains(e.target)) {
      zone.classList.remove("actif");
      document.removeEventListener("click", fermer);
    }
  }

  bouton.addEventListener("click", function (e) {
    e.preventDefault();
    const ouvert = zone.classList.toggle("actif");
    if (ouvert) {
      document.addEventListener("click", fermer);
    }
  });
})();
