// ===== GALERIE =====
// Les créations viennent de data/creations.js (variable CREATIONS)

const grille = document.getElementById("galerie-grille");
const boutonsFiltre = document.querySelectorAll(".filtre");

const visionneuse = document.getElementById("visionneuse");
const visionneuseImage = document.getElementById("visionneuse-image");
const visionneuseTitre = document.getElementById("visionneuse-titre");
const visionneuseInfo = document.getElementById("visionneuse-info");
const visionneuseTexte = document.getElementById("visionneuse-texte");
const visionneusePiece = document.getElementById("visionneuse-piece");
const visionneusePng = document.getElementById("visionneuse-png");
const boutonTelecharger = document.getElementById("visionneuse-telecharger");
const boutonOuvrirPng = document.getElementById("visionneuse-ouvrir");

const symboles = "!<>-_\\/[]{}=+*^?#░▒▓█⛧01";

// Types dont le nom est caché par des symboles tant qu'on ne survole pas la carte
// (ajoute "cover" ou "artwork" ici pour faire pareil sur les autres)
const TYPES_CACHES = ["logo", "patch"];

let filtreActif = "tout";
let affichees = [];   // créations visibles avec le filtre actuel
let indexOuvert = 0;  // création ouverte dans la visionneuse

// --- Texte qui se décode lettre par lettre (comme l'écran de démarrage) ---
function decoderTexte(element, texte) {
  let revele = 0;
  clearInterval(element.minuteur);
  element.minuteur = setInterval(function () {
    let affichage = "";
    for (let i = 0; i < texte.length; i++) {
      if (i < revele || texte[i] === " ") {
        affichage += texte[i];
      } else {
        affichage += symboles[Math.floor(Math.random() * symboles.length)];
      }
    }
    element.textContent = affichage;
    revele++;
    if (revele > texte.length) {
      clearInterval(element.minuteur);
    }
  }, 30);
}

// --- Nom caché : des symboles qui changent doucement, en continu ---
// Chaque lettre a sa propre horloge, donc les symboles ne changent pas tous
// en même temps : ça donne un mouvement fluide plutôt que des à-coups.
// Au survol, les lettres se révèlent de gauche à droite.
// Quand le curseur part, elles se recachent de droite à gauche.

const nomsCaches = [];         // tous les noms cachés de la page
const VITESSE_LETTRES = 22;    // lettres révélées (ou cachées) par seconde
const PAUSE_SYMBOLE_MIN = 350; // durée mini d'un symbole au repos (ms)
const PAUSE_SYMBOLE_MAX = 900; // durée maxi d'un symbole au repos (ms)

function symboleAuHasard() {
  return symboles[Math.floor(Math.random() * symboles.length)];
}

function creerNomCache(element, texte) {
  const nom = {
    element: element,
    texte: texte,
    revele: 0,      // nombre de lettres visibles (avec virgule pour la fluidité)
    cible: 0,       // 0 = tout caché, texte.length = tout révélé
    lettres: [],    // ce qui est affiché à chaque position
    prochains: []   // moment du prochain changement de chaque symbole
  };
  const maintenant = performance.now();
  for (let i = 0; i < texte.length; i++) {
    nom.lettres.push(symboleAuHasard());
    nom.prochains.push(maintenant + Math.random() * PAUSE_SYMBOLE_MAX);
  }
  nomsCaches.push(nom);
  return nom;
}

let derniereImage = performance.now();

function animerNomsCaches(maintenant) {
  const ecart = (maintenant - derniereImage) / 1000;
  derniereImage = maintenant;

  for (const nom of nomsCaches) {
    // La frontière avance vers la cible, lettre après lettre
    if (nom.revele < nom.cible) {
      nom.revele = Math.min(nom.cible, nom.revele + VITESSE_LETTRES * ecart);
    } else if (nom.revele > nom.cible) {
      nom.revele = Math.max(nom.cible, nom.revele - VITESSE_LETTRES * ecart);
    }

    const frontiere = Math.floor(nom.revele);
    let affichage = "";
    for (let i = 0; i < nom.texte.length; i++) {
      if (nom.texte[i] === " ") {
        affichage += " ";
      } else if (i < frontiere) {
        affichage += nom.texte[i];
      } else {
        // Près de la frontière, les symboles s'agitent plus vite (effet de décodage)
        const presDeLaFrontiere = nom.revele !== nom.cible && i - frontiere < 4;
        if (maintenant >= nom.prochains[i]) {
          nom.lettres[i] = symboleAuHasard();
          const pause = presDeLaFrontiere
            ? 40 + Math.random() * 40
            : PAUSE_SYMBOLE_MIN + Math.random() * (PAUSE_SYMBOLE_MAX - PAUSE_SYMBOLE_MIN);
          nom.prochains[i] = maintenant + pause;
        }
        affichage += nom.lettres[i];
      }
    }

    if (nom.element.textContent !== affichage) {
      nom.element.textContent = affichage;
    }
    nom.element.classList.toggle("nom-revele", frontiere >= nom.texte.length);
  }

  requestAnimationFrame(animerNomsCaches);
}

requestAnimationFrame(animerNomsCaches);

// --- PATCHS EN 3D ---
// Un patch = une pièce en 3D faite en CSS : la face avant (l'image),
// la face arrière (le dos en feutre) et des disques empilés entre les deux
// pour donner de l'épaisseur quand on le voit de profil.
// Une seule boucle fait tourner tous les patchs de la page.

const pieces = [];                 // tous les patchs 3D affichés
const VITESSE_NORMALE = 22;        // degrés par seconde au repos
const VITESSE_SURVOL = 70;        // degrés par seconde quand on survole la carte
const mouvementReduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function creerPiece3D(creation, nbTranches) {
  const scene = document.createElement("div");
  scene.className = "piece-scene";

  const halo = document.createElement("div");
  halo.className = "piece-halo";

  const ombre = document.createElement("div");
  ombre.className = "piece-ombre";

  const flotte = document.createElement("div");
  flotte.className = "piece-flotte";

  const piece = document.createElement("div");
  piece.className = "piece";
  piece.style.setProperty("--bord", creation.bord || "#1a0000");
  piece.style.setProperty("--n", nbTranches);

  // L'épaisseur : des disques empilés
  for (let i = 0; i < nbTranches; i++) {
    const tranche = document.createElement("div");
    tranche.className = "piece-tranche";
    tranche.style.setProperty("--i", i);
    piece.appendChild(tranche);
  }

  // Face avant : l'image + un reflet qui glisse quand le patch tourne
  const avant = document.createElement("div");
  avant.className = "piece-face piece-avant";
  const img = document.createElement("img");
  img.src = creation.image;
  img.alt = creation.titre;
  img.draggable = false;
  const reflet = document.createElement("div");
  reflet.className = "piece-reflet";
  avant.appendChild(img);
  avant.appendChild(reflet);

  // Face arrière : le dos du patch
  const arriere = document.createElement("div");
  arriere.className = "piece-face piece-arriere";
  const dos = document.createElement("img");
  dos.src = creation.image;
  dos.alt = "";
  dos.draggable = false;
  const sceau = document.createElement("span");
  sceau.className = "piece-sceau";
  sceau.textContent = "⛧";
  arriere.appendChild(dos);
  arriere.appendChild(sceau);

  piece.appendChild(avant);
  piece.appendChild(arriere);
  flotte.appendChild(piece);
  scene.appendChild(halo);
  scene.appendChild(ombre);
  scene.appendChild(flotte);

  const donnees = {
    scene: scene,
    piece: piece,
    ombre: ombre,
    reflet: reflet,
    image: img,
    angle: Math.random() * 360,  // chaque patch démarre à un angle différent
    vitesse: VITESSE_NORMALE,
    cible: VITESSE_NORMALE,
    tenu: false                  // true quand on le fait tourner à la souris
  };
  pieces.push(donnees);
  return donnees;
}

let derniereImagePieces = performance.now();

function animerPieces(maintenant) {
  const ecart = Math.min(0.05, (maintenant - derniereImagePieces) / 1000);
  derniereImagePieces = maintenant;

  for (const p of pieces) {
    if (!p.tenu) {
      // La vitesse revient doucement vers la cible (effet d'élan)
      p.vitesse += (p.cible - p.vitesse) * Math.min(1, ecart * 3);
      p.angle += p.vitesse * ecart * (mouvementReduit ? 0.3 : 1);
    }
    const a = ((p.angle % 360) + 360) % 360;
    const rad = a * Math.PI / 180;
    p.piece.style.transform = "rotateY(" + a + "deg)";
    // L'ombre s'affine quand le patch est de profil
    p.ombre.style.transform = "translateX(-50%) scaleX(" + (0.35 + 0.65 * Math.abs(Math.cos(rad))) + ")";
    // Le reflet glisse sur la face avant
    p.reflet.style.backgroundPosition = (50 + Math.sin(rad) * 70) + "% 0";
  }

  requestAnimationFrame(animerPieces);
}

requestAnimationFrame(animerPieces);

// Dans la visionneuse : on peut attraper le patch et le faire tourner
function rendreTournable(p) {
  let dernierX = 0;
  let dernierMoment = 0;

  p.scene.addEventListener("pointerdown", function (e) {
    p.tenu = true;
    dernierX = e.clientX;
    dernierMoment = performance.now();
    p.scene.setPointerCapture(e.pointerId);
    p.scene.classList.add("tenu");
  });

  p.scene.addEventListener("pointermove", function (e) {
    if (!p.tenu) return;
    const maintenant = performance.now();
    const dx = e.clientX - dernierX;
    p.angle += dx * 0.6;
    // On garde la vitesse du geste pour le lancer
    const dt = Math.max(1, maintenant - dernierMoment) / 1000;
    p.vitesse = Math.max(-1500, Math.min(1500, (dx * 0.6) / dt));
    dernierX = e.clientX;
    dernierMoment = maintenant;
  });

  function lacher() {
    p.tenu = false;
    p.scene.classList.remove("tenu");
  }
  p.scene.addEventListener("pointerup", lacher);
  p.scene.addEventListener("pointercancel", lacher);
}

// --- Création d'une carte ---
function creerCarte(creation, index) {
  const carte = document.createElement("button");
  carte.className = "carte";
  carte.type = "button";
  carte.style.animationDelay = index * 0.08 + "s";

  const cadre = document.createElement("div");
  cadre.className = "carte-cadre";

  // Patch : une pièce en 3D qui tourne sur elle-même
  let piece = null;
  if (creation.type === "patch") {
    carte.classList.add("carte-patch");
    piece = creerPiece3D(creation, 10);
    cadre.appendChild(piece.scene);
  }

  // 3 calques de la même image : normal, rouge, cyan (effet RGB au survol)
  const calques = piece ? [] : ["", "calque-rouge", "calque-cyan"];
  for (const classe of calques) {
    const img = document.createElement("img");
    img.src = creation.image;
    img.alt = classe === "" ? creation.titre : "";
    img.loading = "lazy";
    if (classe !== "") {
      img.classList.add(classe);
    }
    cadre.appendChild(img);
  }

  // Image introuvable : on affiche "SIGNAL PERDU"
  (piece ? piece.image : cadre.querySelector("img")).addEventListener("error", function () {
    carte.classList.add("perdu");
  });

  const perdu = document.createElement("span");
  perdu.className = "signal-perdu";
  perdu.textContent = "SIGNAL PERDU";
  cadre.appendChild(perdu);

  const infos = document.createElement("div");
  infos.className = "carte-infos";
  const titre = document.createElement("h3");
  titre.textContent = creation.titre;
  const meta = document.createElement("p");
  meta.textContent = creation.type + " · " + creation.annee;
  infos.appendChild(titre);
  infos.appendChild(meta);

  carte.appendChild(cadre);
  carte.appendChild(infos);

  let nomCache = null;
  if (TYPES_CACHES.includes(creation.type)) {
    titre.classList.add("nom-cache");
    nomCache = creerNomCache(titre, creation.titre);
  }

  // Survol (ou sélection au clavier) : le vrai nom se révèle
  function reveler() {
    if (piece) {
      piece.cible = VITESSE_SURVOL;
    }
    if (nomCache) {
      nomCache.cible = creation.titre.length;
    } else {
      decoderTexte(titre, creation.titre);
    }
  }

  // Le curseur part : même effet dans l'autre sens
  function cacher() {
    if (piece) {
      piece.cible = VITESSE_NORMALE;
    }
    if (nomCache) {
      nomCache.cible = 0;
    }
  }

  carte.addEventListener("mouseenter", reveler);
  carte.addEventListener("focus", reveler);
  carte.addEventListener("blur", cacher);

  // La carte s'incline en suivant la souris
  carte.addEventListener("mousemove", function (e) {
    const zone = carte.getBoundingClientRect();
    const x = (e.clientX - zone.left) / zone.width - 0.5;
    const y = (e.clientY - zone.top) / zone.height - 0.5;
    carte.style.transform = "perspective(700px) rotateY(" + x * 14 + "deg) rotateX(" + -y * 14 + "deg)";
  });

  carte.addEventListener("mouseleave", function () {
    carte.style.transform = "";
    cacher();
  });

  carte.addEventListener("click", function () {
    ouvrirVisionneuse(index);
  });

  return carte;
}

// --- Affichage de la grille selon le filtre ---
function afficherGalerie() {
  // On oublie les noms cachés des anciennes cartes avant de les supprimer
  nomsCaches.length = 0;
  pieces.length = 0;
  pieceVisionneuse = null;
  grille.innerHTML = "";
  affichees = CREATIONS.filter(function (c) {
    return filtreActif === "tout" || c.type === filtreActif;
  });

  affichees.forEach(function (creation, index) {
    grille.appendChild(creerCarte(creation, index));
  });
}

for (const bouton of boutonsFiltre) {
  bouton.addEventListener("click", function () {
    for (const b of boutonsFiltre) {
      b.classList.remove("actif");
    }
    bouton.classList.add("actif");
    filtreActif = bouton.dataset.filtre;
    afficherGalerie();
  });
}

// --- Visionneuse plein écran ---
let pieceVisionneuse = null;  // le patch 3D affiché en grand

function retirerPieceVisionneuse() {
  if (pieceVisionneuse) {
    const position = pieces.indexOf(pieceVisionneuse);
    if (position !== -1) pieces.splice(position, 1);
    pieceVisionneuse = null;
  }
  visionneusePiece.innerHTML = "";
}

function montrerCreation() {
  const creation = affichees[indexOuvert];
  retirerPieceVisionneuse();

  if (creation.type === "patch") {
    // Patch : grand modèle 3D qu'on peut faire tourner + boutons PNG
    visionneuseImage.classList.add("cache");
    visionneuseImage.removeAttribute("src");
    visionneusePiece.classList.remove("cache");
    pieceVisionneuse = creerPiece3D(creation, 18);
    rendreTournable(pieceVisionneuse);
    visionneusePiece.appendChild(pieceVisionneuse.scene);

    const png = creation.png || creation.image;
    boutonTelecharger.href = png;
    boutonTelecharger.download = png.split("/").pop();
    boutonOuvrirPng.href = png;
    visionneusePng.classList.remove("cache");
  } else {
    visionneuseImage.classList.remove("cache");
    visionneusePiece.classList.add("cache");
    visionneusePng.classList.add("cache");
    visionneuseImage.src = creation.image;
  }

  visionneuseImage.alt = creation.titre;
  visionneuseInfo.textContent = creation.type + " · " + creation.annee;
  visionneuseTexte.textContent = creation.description || "";
  decoderTexte(visionneuseTitre, creation.titre);

  // On relance l'animation de glitch à chaque image
  visionneuse.classList.remove("glitch-entree");
  void visionneuse.offsetWidth;
  visionneuse.classList.add("glitch-entree");
}

function ouvrirVisionneuse(index) {
  indexOuvert = index;
  visionneuse.classList.remove("cache");
  document.body.style.overflow = "hidden";
  montrerCreation();
}

function fermerVisionneuse() {
  retirerPieceVisionneuse();
  visionneuse.classList.add("cache");
  document.body.style.overflow = "";
}

function changerCreation(sens) {
  indexOuvert = (indexOuvert + sens + affichees.length) % affichees.length;
  montrerCreation();
}

document.getElementById("visionneuse-fermer").addEventListener("click", fermerVisionneuse);
document.getElementById("visionneuse-precedent").addEventListener("click", function () { changerCreation(-1); });
document.getElementById("visionneuse-suivant").addEventListener("click", function () { changerCreation(1); });

// Clic sur le fond noir : on ferme
visionneuse.addEventListener("click", function (e) {
  if (e.target === visionneuse) {
    fermerVisionneuse();
  }
});

// Clavier : Échap, flèche gauche, flèche droite
document.addEventListener("keydown", function (e) {
  if (visionneuse.classList.contains("cache")) return;
  if (e.key === "Escape") fermerVisionneuse();
  if (e.key === "ArrowLeft") changerCreation(-1);
  if (e.key === "ArrowRight") changerCreation(1);
});

afficherGalerie();
