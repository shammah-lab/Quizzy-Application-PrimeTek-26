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

// TODO 1 : Sauvegarder l'état actuel de la partie dans la session
const sauvegarderSession = () => {
  if (App.etat && App.etat.joueur) {
    App.session.ecrire(App.CLES.session, { ...App.etat });
  }
};

/**
 * Met à jour l'affichage du badge du joueur en haut à droite
 */
const mettreAJourBadgeJoueur = (pseudo) => {
  const badge = document.querySelector('#badge-joueur');
  const elNom = document.querySelector('#joueur-nom');
  const elInitiale = document.querySelector('#joueur-initiale');

  if (pseudo && pseudo.trim().length > 0) {
    const pseudoNettoye = pseudo.trim();
    if (elNom) elNom.textContent = pseudoNettoye;
    if (elInitiale) elInitiale.textContent = pseudoNettoye.charAt(0).toUpperCase();
    if (badge) badge.hidden = false;
  } else if (badge) {
    badge.hidden = true;
  }
};

/**
 * Lance une nouvelle partie
 */
const demarrerPartie = (evt) => {
  if (evt) evt.preventDefault();

  const elPseudo = document.querySelector('#champ-pseudo');
  const elErreur = document.querySelector('#erreur-accueil');
  const pseudo = elPseudo ? elPseudo.value.trim() : '';

  // 1. Validation du pseudo : non vide et au moins 3 caractères
  if (!pseudo || pseudo.length < 3) {
    if (elErreur) {
      elErreur.textContent = 'Le pseudo doit contenir au moins 3 caractères.';
      elErreur.hidden = false;
    }
    return;
  }

  // Masquer l'erreur si elle était affichée
  if (elErreur) elErreur.hidden = true;

  // TODO 2 : Lire les filtres
  const elCategorie = document.querySelector('#champ-categorie');
  const elDifficulte = document.querySelector('#champ-difficulte');
  const categorie = elCategorie ? elCategorie.value : 'toutes';
  const difficulte = elDifficulte ? elDifficulte.value : 'toutes';

  // TODO 3 : Tirer les questions via le module de N'famory
  const questions = App.tirerQuestions({ categorie, difficulte });

  // Si aucune question disponible : ne PAS lancer la partie
  if (!questions || questions.length === 0) {
    if (elErreur) {
      elErreur.textContent = 'Aucune question disponible pour ces critères.';
      elErreur.hidden = false;
    }
    return;
  }

  // Mémorisation du joueur (localStorage + sessionStorage)
  App.local.ecrire(App.CLES.joueur, pseudo);

  // TODO 4 : Remplir App.etat
  App.etat = {
    joueur: pseudo,
    questions,
    index: 0,
    score: 0,
    reponses: [],
    debutPartie: Date.now()
  };

  // Mettre à jour le badge visuel
  mettreAJourBadgeJoueur(pseudo);

  // Sauvegarder la session initiale
  sauvegarderSession();

  // TODO 5 : Émettre l'événement et basculer sur l'écran quiz
  App.emettre('partie:demarree', { joueur: pseudo, questions, categorie });
  App.allerA('quiz');
};

/**
 * Reprendre une partie en cours sauvegardée dans le sessionStorage
 */
const reprendrePartie = () => {
  const sessionEnCours = App.session.lire(App.CLES.session);

  if (sessionEnCours) {
    // Restaurer l'état
    App.etat = { ...sessionEnCours };

    // Mettre à jour l'affichage du badge
    mettreAJourBadgeJoueur(App.etat.joueur);

    // Relancer la partie où elle s'était arrêtée
    App.emettre('partie:demarree', {
      joueur: App.etat.joueur,
      questions: App.etat.questions,
      categorie: App.etat.categorie || 'toutes'
    });

    App.allerA('quiz');
  }
};

// Initialisation au chargement de l'application
App.sur('app:pret', () => {
  // TODO 6 : Pré-remplir #champ-pseudo depuis localStorage
  const dernierPseudo = App.local.lire(App.CLES.joueur) || '';
  const elPseudo = document.querySelector('#champ-pseudo');
  if (elPseudo && dernierPseudo) {
    elPseudo.value = dernierPseudo;
  }

  // TODO 7 : Gérer la soumission de #form-accueil
  const formAccueil = document.querySelector('#form-accueil');
  if (formAccueil) {
    formAccueil.addEventListener('submit', demarrerPartie);
  }

  // TODO 8 : Afficher #btn-reprendre s'il existe une partie en session
  const btnReprendre = document.querySelector('#btn-reprendre');
  const sessionSauvegardee = App.session.lire(App.CLES.session);

  if (btnReprendre) {
    if (sessionSauvegardee && sessionSauvegardee.questions) {
      btnReprendre.hidden = false;
      btnReprendre.addEventListener('click', reprendrePartie);
    } else {
      btnReprendre.hidden = true;
    }
  }

  // TODO 9 : Mettre à jour le badge joueur au démarrage si un pseudo existe
  if (dernierPseudo) {
    mettreAJourBadgeJoueur(dernierPseudo);
  }
});

// Écoute des événements pour sauvegarder la session en cours de jeu
App.sur('question:affichee', sauvegarderSession);
App.sur('reponse:validee', sauvegarderSession);