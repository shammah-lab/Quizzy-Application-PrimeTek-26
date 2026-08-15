/* =============================================================
   demarrage.js — FOURNI. Dernier script chargé.
   Il déclenche les deux phases de démarrage :
     1. 'app:chargement' -> on lit le stockage (réglages, questions perso, banque)
     2. 'app:pret'       -> on branche les écouteurs et on affiche l'écran d'accueil
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {
  App.emettre('app:chargement');
  App.emettre('app:pret');
  console.info('Quizzy prêt. Bon travail à toute l\'équipe.');
});
