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

console.log('Navigation de Shammah chargée');
console.log('app:pret reçu par Shammah');

App.allerA = (nom) => {
  // Cacher tous les écrans
  $$('.ecran').forEach((ecran) => {
    ecran.classList.remove('est-visible');
  });

  // Afficher l'écran demandé
  const ecran = $(`#ecran-${nom}`);

  if (ecran) {
    ecran.classList.add('est-visible');
  }

  // Mettre à jour l'onglet actif
  $$('.lien-nav').forEach((lien) => {
    lien.classList.remove('est-actif');

    if (lien.dataset.aller === nom) {
      lien.classList.add('est-actif');
    }
  });

  // Sauvegarder l'écran courant dans sessionStorage
  App.session.ecrire('quizzy:ecran', nom);

  // Informer les autres modules que l'écran a changé
  App.emettre('ecran:change', { nom });
};

App.sur('app:pret', () => {
  // Faire fonctionner tous les éléments avec data-aller
  $$('[data-aller]').forEach((bouton) => {
    bouton.addEventListener('click', () => {
      App.allerA(bouton.dataset.aller);
    });
  });

  // Restaurer le dernier écran visité
  const dernierEcran = App.session.lire(
    'quizzy:ecran',
    'accueil'
  );

  // Ne jamais restaurer directement le quiz
  if (dernierEcran === 'quiz') {
    App.allerA('accueil');
  } else {
    App.allerA(dernierEcran);
  }
});
