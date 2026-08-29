/* =============================================================
   02 — GAËL                                  [ niveau : simple ]
   Rôle : Réglages utilisateur et thème (localStorage)
   Branche : feat/reglages

   MISSION
   -------
   1. Au chargement, lire les réglages sauvegardés (clé App.CLES.reglages)
      et les fusionner dans App.config :
      App.config = { ...App.config, ...reglagesSauvegardes };   <-- spread ES6
   2. Appliquer le thème : document.body.dataset.theme = 'clair' | 'sombre'.
      Tout le CSS bascule automatiquement, tu n'as aucune couleur à écrire.
   3. Synchroniser les contrôles de l'écran Réglages avec App.config
      (#reg-theme, #reg-nb-questions, #reg-duree, #reg-melange) et mettre à
      jour les <output> en direct avec un template literal : `${valeur} s`.
   4. À chaque changement : mettre à jour App.config, sauvegarder dans
      localStorage, émettre 'reglages:modifies', notifier l'utilisateur
      avec App.notifier('Réglage enregistré').
   5. #btn-reinitialiser-reglages : rétablir les valeurs par défaut.
   6. #btn-tout-effacer : après confirmation (confirm()), vider TOUTES les
      clés (App.local.vider() + App.session.vider()) puis émettre
      'donnees:effacees'.

   ATTENTION — TON MODULE PASSE EN PREMIER
   ---------------------------------------
   Tu lis les réglages pendant la phase 'app:chargement'. N'famory et
   Theophile lisent App.config JUSTE APRÈS toi : si tu te trompes de nom de
   propriété, la partie entière part avec les mauvaises valeurs.
   Les noms exacts : nbQuestions, dureeQuestion, melangerReponses, theme.

   CONTRAT
   -------
   - Écoute 'app:chargement' (lire + appliquer) et 'app:pret' (brancher l'UI)
   - Émet 'reglages:modifies' avec { config } et 'donnees:effacees'
   ============================================================= */

/* =============================================================
   02-gael-reglages.js — Réglages utilisateur
   Branche : feat/reglages
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------------------------
     1. Charger les réglages sauvegardés
     ----------------------------------------------------------- */

  const reglagesSauvegardes = App.local.lire(App.CLES.reglages);

  if (reglagesSauvegardes) {
    App.config = {
      ...App.config,
      ...reglagesSauvegardes
    };
  }


  /* -----------------------------------------------------------
     2. Sélection des contrôles
     ----------------------------------------------------------- */

  const regTheme = $('#reg-theme');
  const regNbQuestions = $('#reg-nb-questions');
  const regDuree = $('#reg-duree');
  const regMelange = $('#reg-melange');

  const regNbQuestionsValeur = $('#reg-nb-questions-valeur');
  const regDureeValeur = $('#reg-duree-valeur');

  const btnReinitialiser = $('#btn-reinitialiser-reglages');
  const btnToutEffacer = $('#btn-tout-effacer');


  /* -----------------------------------------------------------
     3. Appliquer le thème
     ----------------------------------------------------------- */

  const appliquerTheme = () => {
    document.body.dataset.theme = App.config.theme;
  };


  /* -----------------------------------------------------------
     4. Synchroniser les contrôles avec App.config
     ----------------------------------------------------------- */

  const synchroniserControles = () => {

    // Thème
    if (regTheme) {
      regTheme.checked = App.config.theme === 'clair';
    }

    // Nombre de questions
    if (regNbQuestions) {
      regNbQuestions.value = App.config.nbQuestions;
    }

    if (regNbQuestionsValeur) {
      regNbQuestionsValeur.textContent = App.config.nbQuestions;
    }

    // Durée
    if (regDuree) {
      regDuree.value = App.config.dureeQuestion;
    }

    if (regDureeValeur) {
      regDureeValeur.textContent = `${App.config.dureeQuestion} s`;
    }

    // Mélanger les réponses
    if (regMelange) {
      regMelange.checked = App.config.melangerReponses;
    }
  };


  /* -----------------------------------------------------------
     5. Sauvegarder les réglages
     ----------------------------------------------------------- */

  const sauvegarderReglages = () => {

    App.local.ecrire(
      App.CLES.reglages,
      App.config
    );

    App.emettre('reglages:modifies');

    App.notifier('Réglage enregistré');
  };


  /* -----------------------------------------------------------
     6. Changement du thème
     ----------------------------------------------------------- */

  if (regTheme) {

    regTheme.addEventListener('change', () => {

      App.config.theme = regTheme.checked
        ? 'clair'
        : 'sombre';

      appliquerTheme();

      sauvegarderReglages();
    });
  }


  /* -----------------------------------------------------------
     7. Nombre de questions
     ----------------------------------------------------------- */

  if (regNbQuestions) {

    regNbQuestions.addEventListener('input', () => {

      App.config.nbQuestions = Number(
        regNbQuestions.value
      );

      if (regNbQuestionsValeur) {
        regNbQuestionsValeur.textContent =
          `${App.config.nbQuestions}`;
      }

      sauvegarderReglages();
    });
  }


  /* -----------------------------------------------------------
     8. Durée par question
     ----------------------------------------------------------- */

  if (regDuree) {

    regDuree.addEventListener('input', () => {

      App.config.dureeQuestion = Number(
        regDuree.value
      );

      if (regDureeValeur) {
        regDureeValeur.textContent =
          `${App.config.dureeQuestion} s`;
      }

      sauvegarderReglages();
    });
  }


  /* -----------------------------------------------------------
     9. Mélanger les réponses
     ----------------------------------------------------------- */

  if (regMelange) {

    regMelange.addEventListener('change', () => {

      App.config.melangerReponses =
        regMelange.checked;

      sauvegarderReglages();
    });
  }


  /* -----------------------------------------------------------
     10. Réinitialiser les réglages
     ----------------------------------------------------------- */

  if (btnReinitialiser) {

    btnReinitialiser.addEventListener('click', () => {

      App.config = {
        ...App.config,
        nbQuestions: 10,
        dureeQuestion: 20,
        melangerReponses: true,
        theme: 'sombre'
      };

      appliquerTheme();

      synchroniserControles();

      sauvegarderReglages();
    });
  }


  /* -----------------------------------------------------------
     11. Tout effacer
     ----------------------------------------------------------- */

  if (btnToutEffacer) {

    btnToutEffacer.addEventListener('click', () => {

      const confirmation = confirm(
        'Voulez-vous vraiment effacer toutes vos données ?'
      );

      if (!confirmation) {
        return;
      }

      App.local.vider();
      App.session.vider();

      App.emettre('donnees:effacees');

      App.notifier(
        'Toutes les données ont été effacées'
      );
    });
  }


  /* -----------------------------------------------------------
     12. Initialisation
     ----------------------------------------------------------- */

  appliquerTheme();

  synchroniserControles();

});

