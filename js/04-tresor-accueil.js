/* =============================================================
   04 — TRESOR VAKEKYA                         [ niveau : moyen ]
   Rôle : Écran d'accueil, profil joueur et reprise de partie (sessionStorage)
   Branche : feat/accueil-joueur

   MISSION
   -------
   1. Valider le formulaire d'accueil (#form-accueil) : pseudo non vide,
      au moins 3 caractères. Sinon afficher #erreur-accueil (retirer [hidden]).
   2. Mémoriser le joueur : le pseudo dans localStorage (pour le pré-remplir
      la prochaine fois) ET dans sessionStorage (joueur de la session en cours).
   3. Afficher le badge joueur en haut à droite (#badge-joueur, #joueur-nom,
      #joueur-initiale = première lettre en majuscule).
   4. Démarrer la partie : demander les questions à N'famory
      (App.tirerQuestions), remplir App.etat, puis émettre 'partie:demarree'
      et basculer sur l'écran quiz.
   5. Reprise : si sessionStorage contient une partie en cours, afficher
      #btn-reprendre et permettre de repartir à la question où l'on s'était
      arrêté (restaurer App.etat puis émettre 'partie:demarree').

   CONTRAT
   -------
   - Émet 'partie:demarree' avec { joueur, questions, categorie }
   - Écoute 'reponse:validee' et 'question:affichee' pour sauvegarder la session
   - Clés : App.CLES.joueur (localStorage) et App.CLES.session (sessionStorage)
   - Si App.tirerQuestions() renvoie un tableau vide : ne PAS lancer la partie
   ============================================================= */

const sauvegarderSession = () => {
  // TODO 1 : App.session.ecrire(App.CLES.session, { ...App.etat });
};

const demarrerPartie = (joueur) => {
  // TODO 2 : lire #champ-categorie et #champ-difficulte
  // TODO 3 : const questions = App.tirerQuestions({ categorie, difficulte });
  // TODO 4 : remplir App.etat : joueur, questions, index: 0, score: 0,
  //          reponses: [], debutPartie: Date.now()
  // TODO 5 : App.emettre('partie:demarree', { joueur, questions, categorie })
  //          puis App.allerA('quiz')
};

App.sur('app:pret', () => {
  // TODO 6 : pré-remplir #champ-pseudo depuis localStorage
  // TODO 7 : gérer la soumission de #form-accueil (evenement.preventDefault())
  // TODO 8 : afficher #btn-reprendre s'il existe une partie en session
  // TODO 9 : mettre à jour le badge joueur
});

App.sur('reponse:validee', sauvegarderSession);
App.sur('question:affichee', sauvegarderSession);
