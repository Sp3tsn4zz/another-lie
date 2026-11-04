// ===== MES CRÉATIONS =====
// Pour ajouter une création : copie un bloc { ... }, colle-le dans la liste
// et change les infos. Mets l'image dans img/galerie/.
//
// type : "cover", "logo" ou "artwork" (sert aux filtres de la galerie)
// image : chemin de l'image depuis la racine du site
// Si l'image n'existe pas encore, la carte affiche "SIGNAL PERDU".

const CREATIONS = [
  {
    type: "logo",
    titre: "Sigil vvh0sn3xt",
    annee: "2026",
    image: "img/logo.gif",
    description: "Logo animé du projet vvh0sn3xt."
  },
  {
    type: "cover",
    titre: "Cover exemple 1",
    annee: "2026",
    image: "img/galerie/cover-01.jpg",
    description: "Remplace ce bloc par une vraie cover."
  },
  {
    type: "cover",
    titre: "Cover exemple 2",
    annee: "2026",
    image: "img/galerie/cover-02.jpg",
    description: "Remplace ce bloc par une vraie cover."
  },
  {
    type: "artwork",
    titre: "Artwork exemple",
    annee: "2026",
    image: "img/galerie/artwork-01.jpg",
    description: "Un visuel lié au jeu ou à son histoire."
  }
];
