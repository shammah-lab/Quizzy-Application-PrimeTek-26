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
  // 1) Vérifier qu'il existe bien une question à cet index.
  //    Si elle n'existe pas, on s'arrête ici : Williams gère la fin de partie.
  const question = App.etat.questions[index];
  if (!question) return;

  // 2) Calculer le nombre total de questions de la partie.
  //    On affiche aussi le numéro de la question courante (index + 1).
  const total = App.etat.questions.length;
  const indexAffiche = Number(index) + 1;

  // 3) Remplir les libellés de l'en-tête de la question.
  $('#quiz-index').textContent = indexAffiche;
  $('#quiz-total').textContent = total;
  $('#quiz-categorie').textContent = question.categorie;
  $('#quiz-difficulte').textContent = question.difficulte;
  $('#quiz-question').textContent = question.intitule;

  // 4) Générer les boutons de réponse depuis les propositions préparées par N'famory.
  //    Important : on s'appuie sur `indexOrigine` car c'est la valeur de référence
  //    que Jephte comparera avec `question.bonne`. L'index de mélange n'est pas le bon.
  const htmlOptions = question.propositions
    .map((proposition, position) => `
      <button class="option" data-index="${proposition.indexOrigine}">
        <span class="option__lettre">${App.LETTRES[position]}</span>
        <span>${proposition.texte}</span>
      </button>
    `)
    .join('');

  $('#quiz-options').innerHTML = htmlOptions;

  // 5) Remettre l'écran à zéro pour cette question.
  //    Cela évite que le feedback d'une question précédente reste affiché.
  const retour = $('#quiz-retour');
  retour.hidden = true;
  retour.className = 'retour';
  retour.textContent = '';

  const btnSuivant = $('#btn-suivant');
  if (btnSuivant) btnSuivant.disabled = true;

  // 6) Brancher le clic sur chaque proposition.
  //    On émet un événement portant l'index d'origine de la proposition choisie.
  $$('.option').forEach((bouton) => {
    bouton.addEventListener('click', () => {
      const indexChoisi = Number(bouton.dataset.index);
      App.emettre('reponse:choisie', { question, indexChoisi });
    });
  });

  // 7) Notifier le reste de l'application que cette question est affichée.
  App.emettre('question:affichee', { question, index, total });
};

// 8) À chaque démarrage de partie, afficher la première question.
App.sur('partie:demarree', () => App.afficherQuestion(App.etat.index));

// 9) À chaque passage à la question suivante, afficher celle-ci.
App.sur('question:suivante', () => App.afficherQuestion(App.etat.index));
