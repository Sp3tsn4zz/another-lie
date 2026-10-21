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

const IDENTIFIANT = "vvh0sn3xt";
const CODE = "666";

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

  let lettre = 0;

  function taper() {
    if (lettre < donnees.texte.length) {
      p.textContent += donnees.texte[lettre];
      lettre++;
      tapes++;

      const progression = Math.round((tapes / totalCaracteres) * 100);
      barre.style.width = progression + "%";
      pourcent.textContent = progression + " %";

      setTimeout(taper, 20);
    } else {
      // Ligne finie : on ajoute le statut en couleur
      if (donnees.statut) {
        const span = document.createElement("span");
        span.textContent = " [" + donnees.statut + "]";
        span.classList.add(donnees.couleur);
        p.appendChild(span);
      }
      ligne++;
      setTimeout(demarrage, 350);
    }
  }

  taper();
}
if (sessionStorage.getItem("acces") === "ok") {
  porte.classList.add("cache");
} else {
  demarrage();
}

formAcces.addEventListener("submit", function (e) {
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

