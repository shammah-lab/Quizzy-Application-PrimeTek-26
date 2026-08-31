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

const validerReponse = (donnees = {}) => {
  if (dejaValidee) return;

  // Sécurisation : extraction de l'index selon le format transmis par l'événement
  const indexChoisi = typeof donnees === 'object' && donnees !== null 
    ? donnees.indexChoisi ?? null 
    : donnees;

  const question = App.etat.questions[App.etat.index];
  if (!question) return;

  dejaValidee = true;
  const correcte = indexChoisi === question.bonne;

  // 1. Gestion des éléments DOM
  const boutonBonneReponse = $(`.option[data-index="${question.bonne}"]`);
  const boutonChoisi = indexChoisi !== null 
    ? $(`.option[data-index="${indexChoisi}"]`) 
    : null;

  if (boutonBonneReponse) boutonBonneReponse.classList.add('est-juste');
  if (boutonChoisi && !correcte) boutonChoisi.classList.add('est-fausse');
  
  $$('.option').forEach((bouton) => { 
    bouton.disabled = true; 
  });

  // 2. Feedback utilisateur
  const retour = $('#quiz-retour');
  retour.className = `retour ${correcte ? 'est-juste' : 'est-fausse'}`;
  retour.innerHTML = `<strong>${correcte ? 'Bonne réponse !' : 'Dommage !'}</strong> `;

  const explication = document.createTextNode(question.explication);
  retour.appendChild(explication);
  retour.hidden = false;

  // 3. Mise à jour de App.etat (Score & Séries)
  if (correcte) {
    App.etat.score += 1;
    App.etat.serie += 1;
    App.etat.serieMax = Math.max(App.etat.serieMax, App.etat.serie);
  } else {
    App.etat.serie = 0;
  }
  
  const quizScore = $('#quiz-score');
  if (quizScore) quizScore.textContent = App.etat.score;

  // 4. Enregistrement pour le récapitulatif
  App.etat.reponses.push({
    id: question.id,
    intitule: question.intitule,
    indexChoisi,
    correcte,
    bonneReponse: question.options[question.bonne]
  });

  // 5. Activation du bouton suivant & Émission
  const btnSuivant = $('#btn-suivant');
  if (btnSuivant) btnSuivant.disabled = false;

  App.emettre('reponse:validee', { question, indexChoisi, correcte });
};

// Écouteurs d'événements
App.sur('reponse:choisie', (data) => validerReponse(data));
App.sur('temps:ecoule', () => validerReponse({ indexChoisi: null }));
App.sur('question:affichee', () => { dejaValidee = false; });
App.sur('partie:demarree', () => {
  App.etat.score = 0;
  App.etat.serie = 0;
  App.etat.serieMax = 0;
  App.etat.reponses = [];
  const quizScore = $('#quiz-score');
  if (quizScore) quizScore.textContent = App.etat.score;
});

