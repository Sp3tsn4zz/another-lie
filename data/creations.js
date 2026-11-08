// ===== MES CRÉATIONS =====
// Pour ajouter une création : copie un bloc { ... }, colle-le dans la liste
// et change les infos. Mets l'image dans img/galerie/.
//
// type : "cover", "logo", "artwork" ou "patch" (sert aux filtres de la galerie)
// image : chemin de l'image depuis la racine du site
// Si l'image n'existe pas encore, la carte affiche "SIGNAL PERDU".
//
// Les PATCHS s'affichent en 3D et tournent sur eux-mêmes. En plus :
//   png  : le PNG en grande taille, à télécharger depuis la visionneuse
//   bord : la couleur de la tranche du patch (l'épaisseur qu'on voit de profil)

const CREATIONS = [
  {
    type: "patch",
    titre: "Bad Reaper V1",
    annee: "2026",
    image: "img/galerie/patch-ecusson-demon-aile-560.png",
    png: "img/galerie/patch-ecusson-demon-aile.png",
    bord: "#1a1414",
    description: "Patch brodé vvh0sn3xt, bordure noire."
  },
  {
    type: "patch",
    titre: "Bad Reaper V2",
    annee: "2026",
    image: "img/galerie/patch-embleme-cyber-gothique-560.png",
    png: "img/galerie/patch-embleme-cyber-gothique.png",
    bord: "#8a2c06",
    description: "Patch brodé vvh0sn3xt, bordure orange."
  },
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
