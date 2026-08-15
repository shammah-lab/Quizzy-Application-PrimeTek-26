/* =============================================================
   06 — JEPHTE INIKI                         [ niveau : complexe ]
   Rôle : Validation des réponses, feedback, score et séries
   Branche : feat/validation-reponse

   C'est le module qui décide de tout : juste ou faux, combien de points,
   quelle série. Toutes les statistiques du projet dépendent de ce que tu
   écris dans App.etat.

   MISSION
   -------
   1. À la réception de 'reponse:choisie', déterminer si la réponse est juste :
      indexChoisi === question.bonne  (indexChoisi vient de data-index,
      donc c'est bien l'index AVANT mélange).
   2. Colorer les propositions : .est-juste sur la bonne, .est-fausse sur le
      mauvais choix de l'utilisateur, et désactiver tous les boutons (disabled).
      Il faut retrouver le bon bouton via son data-index :
      $(`.option[data-index="${question.bonne}"]`)
   3. Afficher l'explication dans #quiz-retour avec un template literal, et
      la classe .est-juste ou .est-fausse. Retirer l'attribut hidden.
   4. Gérer le score ET les séries :
      - App.etat.score += 1 si correcte, mise à jour de #quiz-score
      - App.etat.serie : série en cours (remise à 0 si faux)
      - App.etat.serieMax : la plus longue série de la partie
      C'est Julien qui affichera serieMax sur l'écran de résultat.
   5. Enregistrer chaque réponse dans App.etat.reponses :
      { id, intitule, indexChoisi, correcte, bonneReponse }
      (bonneReponse = le TEXTE de la bonne réponse, Julien en a besoin
       pour le récapitulatif)
   6. Activer #btn-suivant.

   CAS À NE PAS OUBLIER
   --------------------
   - 'temps:ecoule' (Theophile) : aucune réponse choisie, on compte faux,
     mais on montre quand même la bonne réponse en vert.
   - Une seule validation par question : un double clic rapide ne doit pas
     donner deux points. Le drapeau dejaValidee est là pour ça.

   CONTRAT
   -------
   - Écoute 'reponse:choisie', 'temps:ecoule', 'question:affichee'
   - Émet 'reponse:validee' avec { question, indexChoisi, correcte }
   ============================================================= */

let dejaValidee = false;

const validerReponse = ({ indexChoisi = null } = {}) => {
  if (dejaValidee) return;
  dejaValidee = true;

  // TODO 1 : const question = App.etat.questions[App.etat.index];
  // TODO 2 : const correcte = indexChoisi === question.bonne;
  // TODO 3 : colorer et désactiver les boutons
  // TODO 4 : afficher l'explication dans #quiz-retour
  // TODO 5 : score, serie, serieMax
  // TODO 6 : App.etat.reponses.push({ ... })
  // TODO 7 : activer #btn-suivant
  // TODO 8 : App.emettre('reponse:validee', { question, indexChoisi, correcte })
};

App.sur('reponse:choisie', validerReponse);
App.sur('temps:ecoule', () => validerReponse({ indexChoisi: null }));
App.sur('question:affichee', () => { dejaValidee = false; });
App.sur('partie:demarree', () => {
  // TODO 9 : remettre score, serie et serieMax à zéro et rafraîchir #quiz-score
});
