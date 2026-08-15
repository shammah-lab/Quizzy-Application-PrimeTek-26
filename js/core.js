/* =============================================================
   core.js — FOURNI PAR LE FORMATEUR. NE PAS MODIFIER.
   Toute modification de ce fichier sera refusée en revue de PR.

   Ce fichier met à disposition l'objet global `App` :
     App.config        réglages courants (durée, nombre de questions...)
     App.etat          état de la partie en cours
     App.local         raccourcis localStorage   (persiste après fermeture)
     App.session       raccourcis sessionStorage (effacé à la fermeture)
     App.sur(...)      s'abonner à un événement
     App.emettre(...)  déclencher un événement
     App.notifier(...) afficher une petite bulle en bas à droite
     $ / $$            sélecteurs DOM courts
   ============================================================= */

const $ = (selecteur, contexte = document) => contexte.querySelector(selecteur);
const $$ = (selecteur, contexte = document) => [...contexte.querySelectorAll(selecteur)];

const App = {

  /* ---- Réglages par défaut (Resia peut les écraser) ---- */
  config: {
    nbQuestions: 10,
    dureeQuestion: 20,
    melangerReponses: true,
    theme: 'sombre'
  },

  /* ---- État de la partie en cours ---- */
  etat: {
    joueur: null,        // string
    questions: [],       // tableau des questions tirées pour la partie
    index: 0,            // numéro de la question affichée (0 = première)
    score: 0,
    reponses: [],        // [{ id, choix, correcte }]
    debutPartie: null    // horodatage (Date.now())
  },

  /* ---- Clés de stockage : à utiliser telles quelles ---- */
  CLES: {
    classement: 'quizzy:classement',
    historique: 'quizzy:historique',
    reglages:   'quizzy:reglages',
    perso:      'quizzy:questions-perso',
    session:    'quizzy:partie-en-cours',
    joueur:     'quizzy:joueur'
  }
};

/* -------------------------------------------------------------
   Stockage : lecture/écriture JSON sécurisée.
   App.local.lire('quizzy:classement', [])  -> tableau ou valeur par défaut
   App.local.ecrire('quizzy:classement', tableau)
   Même API pour App.session.
   ------------------------------------------------------------- */
const creerStockage = (moteur) => ({
  lire: (cle, defaut = null) => {
    try {
      const brut = moteur.getItem(cle);
      return brut === null ? defaut : JSON.parse(brut);
    } catch (erreur) {
      console.warn(`Lecture impossible pour "${cle}" :`, erreur);
      return defaut;
    }
  },
  ecrire: (cle, valeur) => {
    try {
      moteur.setItem(cle, JSON.stringify(valeur));
      return true;
    } catch (erreur) {
      console.warn(`Écriture impossible pour "${cle}" :`, erreur);
      return false;
    }
  },
  supprimer: (cle) => moteur.removeItem(cle),
  vider: () => {
    Object.values(App.CLES).forEach((cle) => moteur.removeItem(cle));
  }
});

App.local = creerStockage(window.localStorage);
App.session = creerStockage(window.sessionStorage);

/* -------------------------------------------------------------
   Bus d'événements — c'est LE mécanisme qui permet à 12 personnes
   de coder sans se marcher dessus : personne n'appelle directement
   la fonction d'un collègue, on émet et on écoute des événements.

     App.sur('partie:terminee', (donnees) => { ... });
     App.emettre('partie:terminee', { score: 7 });
   ------------------------------------------------------------- */
App._abonnes = {};

App.sur = (evenement, rappel) => {
  if (!App._abonnes[evenement]) App._abonnes[evenement] = [];
  App._abonnes[evenement].push(rappel);
};

App.emettre = (evenement, donnees = {}) => {
  console.debug(`[event] ${evenement}`, donnees);
  (App._abonnes[evenement] || []).forEach((rappel) => {
    try {
      rappel(donnees);
    } catch (erreur) {
      console.error(`Erreur dans un écouteur de "${evenement}" :`, erreur);
    }
  });
};

/* -------------------------------------------------------------
   Petits utilitaires
   ------------------------------------------------------------- */
App.notifier = (message, type = 'info') => {
  const zone = $('#notifications');
  const bulle = document.createElement('div');
  bulle.className = `notification ${type === 'erreur' ? 'est-erreur' : ''}`;
  bulle.textContent = message;
  zone.appendChild(bulle);
  setTimeout(() => bulle.remove(), 3200);
};

App.melanger = (tableau) => [...tableau].sort(() => Math.random() - 0.5);

App.formaterDate = (horodatage) =>
  new Date(horodatage).toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
  });

App.LETTRES = ['A', 'B', 'C', 'D'];
