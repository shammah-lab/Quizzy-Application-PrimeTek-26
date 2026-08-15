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
};

const afficherClassement = () => {
  // TODO 3, 4 et 6
};

App.sur('partie:terminee', enregistrerScore);
App.sur('ecran:change', ({ nom }) => {
  if (nom === 'classement') afficherClassement();
});
App.sur('donnees:effacees', afficherClassement);
App.sur('app:pret', () => {
  // TODO 5 : brancher #btn-vider-classement
});
