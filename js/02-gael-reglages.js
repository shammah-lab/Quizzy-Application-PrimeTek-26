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

const appliquerReglages = () => {
  // TODO 1 : const sauvegardes = App.local.lire(App.CLES.reglages, {});
  // TODO 2 : fusionner dans App.config avec le spread
  // TODO 3 : appliquer le thème sur document.body.dataset.theme
};

const enregistrerReglages = () => {
  // TODO 4 : App.local.ecrire(App.CLES.reglages, App.config)
  //          puis App.emettre('reglages:modifies', { config: App.config })
};

App.sur('app:chargement', appliquerReglages);

App.sur('app:pret', () => {
  // TODO 5 : pré-remplir les 4 contrôles avec les valeurs de App.config
  // TODO 6 : brancher l'événement 'change' (ou 'input' pour les sliders)
  //          de chaque contrôle -> mettre à jour App.config + enregistrerReglages()
  // TODO 7 : brancher #btn-reinitialiser-reglages et #btn-tout-effacer
});
