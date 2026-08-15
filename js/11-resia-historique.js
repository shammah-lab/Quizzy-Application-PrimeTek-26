/* =============================================================
   11 — RESIA                                [ niveau : complexe ]
   Rôle : Historique complet, statistiques globales et graphe
   Branche : feat/historique-stats

   Le classement de Sammy ne garde que les 10 meilleurs scores. Toi, tu
   gardes la mémoire de TOUTES les parties et tu en tires des chiffres.

   MISSION
   -------
   1. Enregistrer chaque partie terminée dans localStorage
      (clé App.CLES.historique). Limiter à 50 entrées : quand la liste
      dépasse 50, on jette les plus anciennes.
   2. Calculer et afficher quatre statistiques, avec .reduce() et/ou .filter() :
      - #stat-parties   : nombre total de parties
      - #stat-moyenne   : pourcentage moyen de réussite sur toutes les parties
      - #stat-record    : meilleur score jamais obtenu
      - #stat-categorie : catégorie la plus jouée
        (compter les occurrences avec .reduce(), puis prendre le maximum —
         c'est la partie la plus exigeante de ton module)
   3. Construire un mini graphe dans #graphe-historique : une div par partie
      pour les 12 dernières parties, générée avec .map() + .join('') :

        <div class="graphe__barre"
             style="height: ${pourcentage}%"
             data-valeur="${score}"></div>

      Le CSS dessine tout, tu ne fournis que la hauteur en pourcentage.
   4. Lister les parties dans #liste-historique, la plus récente en premier
      (.reverse() ou tri par date), avec App.formaterDate(). Gérer
      #historique-vide (.hidden).
   5. #btn-vider-historique : confirm() puis effacement et réaffichage.
   6. Mettre à jour #info-nb-parties sur l'écran d'accueil.

   ATTENTION
   ---------
   Une division par zéro donne NaN à l'écran. Avant tout calcul de moyenne,
   vérifie que l'historique n'est pas vide.

   CONTRAT
   -------
   - Écoute 'partie:terminee', 'ecran:change', 'donnees:effacees', 'app:pret'
   ============================================================= */

const lireHistorique = () => App.local.lire(App.CLES.historique, []);

const enregistrerPartie = (partie) => {
  // TODO 1
};

const calculerStatistiques = (historique) => {
  // TODO 2 : renvoyer { parties, moyenne, record, categorie }
  return { parties: 0, moyenne: 0, record: 0, categorie: '—' };
};

const afficherHistorique = () => {
  // TODO 2 (affichage), 3, 4 et 6
};

App.sur('partie:terminee', enregistrerPartie);
App.sur('ecran:change', ({ nom }) => {
  if (nom === 'historique') afficherHistorique();
});
App.sur('donnees:effacees', afficherHistorique);
App.sur('app:pret', () => {
  // TODO 5 : brancher #btn-vider-historique
});
