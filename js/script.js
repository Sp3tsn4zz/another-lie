const titre = document.querySelector("h1");
const texte = titre.textContent;
titre.textContent = "";

let i = 0;

function ecrire() {
  if (i < texte.length) {
    titre.textContent += texte[i];
    i++;
    setTimeout(ecrire, 150);
  }
}

ecrire();

// L'écran d'accès n'existe que sur l'accueil.
// Sur les autres pages, sans accès, on renvoie vers l'accueil.
if (!document.getElementById("porte") && sessionStorage.getItem("acces") !== "ok") {
  window.location.href = "index.html";
}

const IDENTIFIANT = "newid";
const CODE = "123";

const porte = document.getElementById("porte");
const boot = document.getElementById("boot");
const login = document.getElementById("login");
const bootTexte = document.getElementById("boot-texte");
const barre = document.getElementById("barre-remplie");
const pourcent = document.getElementById("boot-pourcent");
const formAcces = document.getElementById("form-acces");
const erreur = document.getElementById("erreur");

const lignes = [
  { texte: "> RÉACTIVATION DU TERMINAL... SECTEUR INCONNU" },
  { texte: "> Dernière synchronisation : il y a 3 241 ans" },
  { texte: "> Extension de la Mégastructure.........", statut: "HORS LIMITES", couleur: "orange" },
  { texte: "> Recherche des Constructeurs...........", statut: "AUCUNE RÉPONSE", couleur: "orange" },
  { texte: "> Connexion à la Netsphère..............", statut: "ÉCHEC", couleur: "rouge" },
  { texte: "> Signature biologique détectée.........", statut: "NON IDENTIFIÉE", couleur: "jaune" },
  { texte: "> Gène terminal du réseau...............", statut: "ABSENT", couleur: "jaune" },
  { texte: "> ALERTE : Sauvegarde notifiée.", couleur: "alerte" },
  { texte: "> Contact de l'Autorité établi. Prouvez votre accès." }
];

// Nombre total de lettres, pour faire avancer la barre lettre par lettre
let totalCaracteres = 0;
for (const l of lignes) {
  totalCaracteres += l.texte.length;
}

let ligne = 0;
let tapes = 0;

const glyphes = "!<>-_\\/[]{}=+*^?#░▒▓█⛧01";

function lettreAleatoire() {
  return glyphes[Math.floor(Math.random() * glyphes.length)];
}

function demarrage() {
  // Toutes les lignes sont écrites : gros glitch puis formulaire
  if (ligne >= lignes.length) {
    setTimeout(function () {
      porte.classList.add("glitch-fort");
      setTimeout(function () {
        boot.classList.add("cache");
        login.classList.remove("cache");
        porte.classList.remove("glitch-fort");
      }, 400);
    }, 800);
    return;
  }

  const donnees = lignes[ligne];
  const p = document.createElement("p");
  if (donnees.couleur === "alerte") {
    p.classList.add("alerte");
  }
  bootTexte.appendChild(p);

  let revele = 0;

  function decoder() {
    // Lettres déjà décodées + quelques caractères aléatoires devant
    let affichage = "";
    for (let i = 0; i < donnees.texte.length; i++) {
      if (i < revele) {
        affichage += donnees.texte[i];
      } else if (i < revele + 8) {
        affichage += lettreAleatoire();
      }
    }
    p.textContent = affichage;

    if (revele < donnees.texte.length) {
      revele++;
      tapes++;
      const progression = Math.round((tapes / totalCaracteres) * 100);
      barre.style.width = progression + "%";
      pourcent.textContent = progression + " %";
      setTimeout(decoder, 11);
    } else {
      // Ligne finie : on ajoute le statut en couleur
      if (donnees.statut) {
        const span = document.createElement("span");
        span.textContent = " [" + donnees.statut + "]";
        span.classList.add(donnees.couleur);
        p.appendChild(span);
      }
      ligne++;
      setTimeout(demarrage, 180);
    }
  }

  decoder();
}

if (porte) {
  if (sessionStorage.getItem("acces") === "ok") {
    porte.classList.add("cache");
  } else {
    demarrage();
  }
}

if (formAcces) formAcces.addEventListener("submit", function (e) {
  e.preventDefault();

  const id = document.getElementById("identifiant").value;
  const code = document.getElementById("code").value;

  if (id === IDENTIFIANT && code === CODE) {
    sessionStorage.setItem("acces", "ok");
    porte.classList.add("cache");
  } else {
    erreur.textContent = "Accès refusé. L'esprit-machine vous rejette.";
  }
});

// ===== GLITCH ALÉATOIRE =====
const couleursGlitch = ["#ff0000", "#000000", "#ffffff", "#000000"];

function glitchAleatoire() {
  if (!porte || porte.classList.contains("cache")) return;

  // 1 à 4 blocs de couleur à des endroits au hasard
  const nombre = 1 + Math.floor(Math.random() * 4);
  for (let n = 0; n < nombre; n++) {
    const bloc = document.createElement("div");
    bloc.className = "bloc-glitch";
    bloc.style.left = Math.random() * 100 + "%";
    bloc.style.top = Math.random() * 100 + "%";
    bloc.style.width = 5 + Math.random() * 40 + "%";
    bloc.style.height = 0.5 + Math.random() * 4 + "%";
    bloc.style.backgroundColor = couleursGlitch[Math.floor(Math.random() * couleursGlitch.length)];
    porte.appendChild(bloc);
    setTimeout(function () { bloc.remove(); }, 50 + Math.random() * 150);
  }

  // Une fois sur trois environ : l'écran se découpe et saute
  if (Math.random() < 0.35) {
    const cible = boot.classList.contains("cache") ? login : boot;
    cible.classList.add("saut");
    setTimeout(function () { cible.classList.remove("saut"); }, 200);
  }

  setTimeout(glitchAleatoire, 100 + Math.random() * 900);
}
glitchAleatoire();

// ===== MENU : lien de la page actuelle en surbrillance =====
const pageActuelle = window.location.pathname.split("/").pop() || "index.html";
for (const lien of document.querySelectorAll("nav a")) {
  if (lien.getAttribute("href") === pageActuelle) {
    lien.classList.add("actif");
  }
}

// ===== TRANSITION GLITCH ENTRE LES PAGES =====
// On arrive sur la page : petit glitch d'entrée
document.body.classList.add("page-entree");

for (const lien of document.querySelectorAll("nav a, a.portail")) {
  lien.addEventListener("click", function (e) {
    const destination = lien.getAttribute("href");
    if (destination === pageActuelle) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    document.body.classList.add("page-sortie");
    setTimeout(function () {
      window.location.href = destination;
    }, 350);
  });
}

// Retour arrière du navigateur : on enlève l'effet de sortie
window.addEventListener("pageshow", function () {
  document.body.classList.remove("page-sortie");
});

// ===== APPARITION DES SECTIONS AU SCROLL =====
const observateur = new IntersectionObserver(function (entrees) {
  for (const entree of entrees) {
    if (entree.isIntersecting) {
      entree.target.classList.add("visible");
      observateur.unobserve(entree.target);
    }
  }
}, { threshold: 0.15 });

for (const section of document.querySelectorAll("section")) {
  section.classList.add("apparition");
  observateur.observe(section);
}

// ===== PLUIE DE SIGILS : fond animé du site (remplace la vidéo) =====
(function () {
  const reduitMouvement = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduitMouvement) return;

  const canvas = document.createElement("canvas");
  canvas.id = "pluie-sigils";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);

  const ctx = canvas.getContext("2d");
  const GLYPHES = "⛧☠†‡Ψ⟁⚶⚝✦✧☾Ѫ҂֍⚷Ж".split("");
  const TAILLE_POLICE = 22;
  const VITESSE = 2;

  let largeur, hauteur, colonnes, gouttes;

  function redimensionner() {
    largeur = canvas.width = window.innerWidth;
    hauteur = canvas.height = window.innerHeight;
    const nbColonnes = Math.ceil(largeur / TAILLE_POLICE);
    gouttes = new Array(nbColonnes).fill(0).map(function () {
      return {
        y: Math.random() * -100,
        vit: 0.4 + Math.random() * 0.9
      };
    });
    colonnes = nbColonnes;
  }

  function dessiner() {
    ctx.fillStyle = "rgba(5,3,4,0.14)";
    ctx.fillRect(0, 0, largeur, hauteur);
    ctx.font = TAILLE_POLICE + "px serif";
    ctx.textAlign = "center";

    for (let i = 0; i < colonnes; i++) {
      const g = gouttes[i];
      const x = i * TAILLE_POLICE + TAILLE_POLICE / 2;
      const y = g.y * TAILLE_POLICE;

      ctx.fillStyle = "rgba(255,170,170,0.9)";
      ctx.fillText(GLYPHES[Math.floor(Math.random() * GLYPHES.length)], x, y);
      ctx.fillStyle = "rgba(179,0,0,0.75)";
      ctx.fillText(GLYPHES[Math.floor(Math.random() * GLYPHES.length)], x, y - TAILLE_POLICE);

      g.y += g.vit * (VITESSE / 4);
      if (y > hauteur && Math.random() > 0.975) {
        g.y = Math.random() * -40;
        g.vit = 0.4 + Math.random() * 0.9;
      }
    }

    requestAnimationFrame(dessiner);
  }

  window.addEventListener("resize", redimensionner);
  redimensionner();
  requestAnimationFrame(dessiner);
})();
