/* =============================================================
   05 — FABRICE BODJENGA                       [ niveau : moyen ]
   Rôle : Affichage de la question et des propositions
   Branche : feat/affichage-question

   MISSION
   -------
   1. Afficher la question courante : intitulé (#quiz-question), catégorie
      (#quiz-categorie), difficulté (#quiz-difficulte), numéro (#quiz-index)
      et total (#quiz-total).
   2. Générer les boutons de réponse dans #quiz-options à partir du tableau
      `propositions` préparé par N'famory — obligatoirement avec des
      template literals, .map() et .join('').
   3. Remettre l'écran à zéro à chaque question : masquer #quiz-retour,
      désactiver #btn-suivant.
   4. Émettre 'reponse:choisie' au clic sur une proposition.

   FORME EXACTE ATTENDUE POUR CHAQUE BOUTON
   ----------------------------------------
     <button class="option" data-index="${indexOrigine}">
       <span class="option__lettre">${App.LETTRES[i]}</span>
       <span>${texte}</span>
     </button>

   data-index doit contenir indexOrigine (l'index AVANT mélange) : c'est ce
   que Jephte compare à question.bonne. Si tu y mets l'index d'affichage,
   toutes les réponses seront fausses.

   CONTRAT
   -------
   - Expose App.afficherQuestion(index)
   - Émet 'question:affichee' avec { question, index, total }
   - Émet 'reponse:choisie' avec { question, indexChoisi }
   ============================================================= */

App.afficherQuestion = (index) => {
  // TODO 1 : const question = App.etat.questions[index];
  //          si elle n'existe pas, on ne fait rien (Williams gère la fin)
  // TODO 2 : remplir les textes de l'entête
  // TODO 3 : générer $('#quiz-options').innerHTML avec .map() + .join('')
  // TODO 4 : masquer #quiz-retour, désactiver #btn-suivant
  // TODO 5 : brancher le clic de chaque .option
  //          -> App.emettre('reponse:choisie', { question, indexChoisi })
  //             avec indexChoisi = Number(bouton.dataset.index)
  // TODO 6 : App.emettre('question:affichee', { question, index, total });
};

App.sur('partie:demarree', () => App.afficherQuestion(App.etat.index));
App.sur('question:suivante', () => App.afficherQuestion(App.etat.index));
