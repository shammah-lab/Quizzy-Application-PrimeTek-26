/* =============================================================
   08 — WILLIAMS                              [ niveau : simple ]
   Rôle : Barre de progression et enchaînement des questions
   Branche : feat/progression

   MISSION
   -------
   1. Mettre à jour la largeur de #barre-progression à chaque question :
      const pourcentage = ((index + 1) / total) * 100;
      $('#barre-progression').style.width = `${pourcentage}%`;   <-- template literal
   2. Gérer le clic sur #btn-suivant :
      - App.etat.index += 1
      - si on a dépassé la dernière question -> émettre 'partie:terminee'
      - sinon -> émettre 'question:suivante'
   3. Changer le libellé du bouton en « Voir mon résultat » quand on est sur
      la dernière question, et le remettre à « Question suivante » sinon.

   DONNÉES À ENVOYER AVEC 'partie:terminee'
   ----------------------------------------
   Trois modules écoutent cet événement (Julien, Sammy, Resia) : ils ont
   tous besoin du même objet, ne l'allège pas.

     App.emettre('partie:terminee', {
       joueur: App.etat.joueur,
       score: App.etat.score,
       total: App.etat.questions.length,
       serieMax: App.etat.serieMax,
       reponses: App.etat.reponses,
       categorie: $('#champ-categorie').value,
       duree: Math.round((Date.now() - App.etat.debutPartie) / 1000),
       date: Date.now()
     });

   CONTRAT
   -------
   - Écoute 'question:affichee'
   - Émet 'question:suivante' et 'partie:terminee'
   ============================================================= */

const majProgression = ({ index, total }) => {
  // TODO 1 : calculer et appliquer la largeur de #barre-progression
  // TODO 2 : adapter le libellé de #btn-suivant
};

const questionSuivante = () => {
  // TODO 3 : incrémenter App.etat.index
  // TODO 4 : fin de partie ou question suivante (voir ci-dessus)
};

App.sur('question:affichee', majProgression);
App.sur('app:pret', () => {
  // TODO 5 : brancher le clic de #btn-suivant sur questionSuivante
});
