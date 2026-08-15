/* =============================================================
   01 — SHAMMAH NDJIBU            [ LEAD INTÉGRATEUR ]
   Rôle : dépôt, revue et fusion des PR + navigation entre les écrans
   Branche : feat/navigation

   MISSION
   -------
   1. Faire fonctionner tous les boutons qui portent l'attribut
      data-aller="nom-ecran" (barre du haut + boutons dans les cartes).
   2. Afficher un seul écran à la fois et mettre l'onglet actif en surbrillance.
   3. Mémoriser le dernier écran visité dans sessionStorage pour que
      le rafraîchissement de la page ne renvoie pas toujours à l'accueil.

   CONTRAT (ne change pas ces noms, les 11 autres s'en servent)
   -----------------------------------------------------------
   - Expose App.allerA('accueil' | 'quiz' | 'resultat' | 'classement'
                       | 'historique' | 'editeur' | 'parametres')
   - Émet 'ecran:change' avec { nom }
   ============================================================= */

App.allerA = (nom) => {
  // TODO 1 : retirer .est-visible de tous les .ecran, puis l'ajouter à #ecran-<nom>
  //          Astuce : $$('.ecran').forEach((ecran) => ...)
  //          Astuce : $(`#ecran-${nom}`)   <-- template literal

  // TODO 2 : mettre à jour .est-actif sur les .lien-nav correspondants

  // TODO 3 : sauvegarder l'écran courant : App.session.ecrire('quizzy:ecran', nom)

  // TODO 4 : App.emettre('ecran:change', { nom });
};

App.sur('app:pret', () => {
  // TODO 5 : brancher un clic sur TOUS les éléments [data-aller]
  //          $$('[data-aller]').forEach((bouton) => bouton.addEventListener(...))
  //          Le nom de l'écran est dans bouton.dataset.aller

  // TODO 6 : au démarrage, retourner sur le dernier écran mémorisé
  //          (par défaut 'accueil'). Ne jamais restaurer 'quiz' directement :
  //          c'est Tresor qui gère la reprise de partie.
});
