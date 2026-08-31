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

const echapperHTML = (texte) => {
  const div = document.createElement('div');
  div.textContent = texte;
  return div.innerHTML;
};

App.afficherQuestion = (index) => {

  // 1) Vérifier qu'il existe bien une question à cet index.
  //    Si elle n'existe pas, Williams gère la fin de partie.
  const question = App.etat.questions[index];

  if (!question) return;


  // 2) Calculer le nombre total de questions.
  const total = App.etat.questions.length;

  // L'index commence à 0, mais l'affichage commence à 1.
  const indexAffiche = Number(index) + 1;


  // 3) Remplir les informations de la question.
  $('#quiz-index').textContent = indexAffiche;
  $('#quiz-total').textContent = total;
  $('#quiz-categorie').textContent = question.categorie;
  $('#quiz-difficulte').textContent = question.difficulte;
  $('#quiz-question').textContent = question.intitule;


  // 4) Générer les boutons de réponse.
  //
  // On utilise question.propositions préparé par N'Famory.
  //
  // IMPORTANT :
  // data-index contient indexOrigine et non position.
  //
  // On échappe proposition.texte afin que des réponses comme
  // "<a>" ou "<link>" soient affichées correctement.
  const htmlOptions = question.propositions
    .map((proposition, position) => `
      <button class="option" data-index="${proposition.indexOrigine}">
        <span class="option__lettre">${App.LETTRES[position]}</span>
        <span>${echapperHTML(proposition.texte)}</span>
      </button>
    `)
    .join('');


  // Injecter les boutons dans l'interface.
  $('#quiz-options').innerHTML = htmlOptions;


  // 5) Remettre l'écran à zéro à chaque nouvelle question.

  const retour = $('#quiz-retour');

  retour.hidden = true;
  retour.className = 'retour';
  retour.textContent = '';


  const btnSuivant = $('#btn-suivant');

  if (btnSuivant) {
    btnSuivant.disabled = true;
  }


  // 6) Brancher le clic sur chaque proposition.

  $$('.option').forEach((bouton) => {

    bouton.addEventListener('click', () => {

      // Récupérer l'index original de la réponse.
      const indexChoisi = Number(bouton.dataset.index);

      // Envoyer l'information aux autres modules.
      App.emettre('reponse:choisie', {
        question,
        indexChoisi
      });

    });

  });


  // 7) Informer l'application que la question est affichée.

  App.emettre('question:affichee', {
    question,
    index,
    total
  });

};


// 8) À chaque démarrage d'une partie,
// afficher la première question.

App.sur('partie:demarree', () => {
  App.afficherQuestion(App.etat.index);
});


// 9) À chaque passage à la question suivante,
// afficher la nouvelle question.

App.sur('question:suivante', () => {
  App.afficherQuestion(App.etat.index);
});