/* =============================================================
   10 — SAMMY BASEME                          [ niveau : simple ]
   Rôle : Classement top 10 persistant (localStorage)
   Branche : feat/classement

   MISSION
   -------
   1. À la fin d'une partie, ajouter le résultat dans localStorage
      (clé App.CLES.classement) : { joueur, score, total, categorie, duree, date }.
   2. Trier du meilleur au moins bon avec .sort(). En cas d'égalité de score,
      la partie la plus RAPIDE passe devant :
        (a, b) => b.score - a.score || a.duree - b.duree
      Ne garder que les 10 premiers (.slice(0, 10)).
   3. Afficher le tableau dans #classement-corps, une <tr> par entrée,
      générée avec .map() + .join('') + template literals.
      Colonnes : rang, joueur, score/total, catégorie, App.formaterDate(date).
   4. Masquer #classement-vide quand il y a des entrées, l'afficher sinon
      (propriété .hidden).
   5. #btn-vider-classement : confirm() puis effacement et réaffichage.
   6. Mettre à jour #info-meilleur sur l'écran d'accueil avec le meilleur score.

   CONTRAT
   -------
   - Écoute 'partie:terminee', 'ecran:change' et 'donnees:effacees'
   ============================================================= */

const lireClassement = () => App.local.lire(App.CLES.classement, []);

const enregistrerScore = (partie) => {
  // TODO 1 et 2
   // Lire le classement existant
  const classement = lireClassement();

  // Ajouter le nouveau score
  classement.push({
    joueur: partie.joueur,
    score: partie.score,
    total: partie.total,
    categorie: partie.categorie,
    duree: partie.duree,
    date: new Date().toISOString()
  });

  // Trier : meilleur score en premier
  // En cas d'égalité : le plus rapide en premier
  classement.sort(
    (a, b) => b.score - a.score || a.duree - b.duree
  );

  // Garder seulement les 10 meilleurs
  const top10 = classement.slice(0, 10);

  // Sauvegarder le classement
  App.local.ecrire(App.CLES.classement, top10)
};

const afficherClassement = () => {
  // TODO 3, 4 et 6
  const classement = lireClassement();

  // Générer les lignes du tableau
  const lignes = classement.map((entree, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${entree.joueur}</td>
      <td>${entree.score}/${entree.total}</td>
      <td>${entree.categorie}</td>
      <td>${App.formaterDate(entree.date)}</td>
    </tr>
  `).join('');

  // Afficher les lignes
  $('#classement-corps').innerHTML = lignes;

  // Afficher ou masquer le message "vide"
  $('#classement-vide').hidden = classement.length > 0;

  // Mettre à jour le meilleur score
  if (classement.length > 0) {
    const meilleur = classement[0];

    $('#info-meilleur').textContent =
      `${meilleur.score}/${meilleur.total}`;
  } else {
    $('#info-meilleur').textContent = '—';
  }
};

App.sur('partie:terminee', enregistrerScore);
App.sur('ecran:change', ({ nom }) => {
  if (nom === 'classement') afficherClassement();
});
App.sur('donnees:effacees', afficherClassement);
App.sur('app:pret', () => {
  // TODO 5 : brancher #btn-vider-classement
  const bouton = $('#btn-vider-classement');

  bouton.addEventListener('click', () => {
    if (confirm('Voulez-vous vraiment vider le classement ?')) {
      App.local.ecrire(App.CLES.classement, []);
      afficherClassement();
    }
  })
});
