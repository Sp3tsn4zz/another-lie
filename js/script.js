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