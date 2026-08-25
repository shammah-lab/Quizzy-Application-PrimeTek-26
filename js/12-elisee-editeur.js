/* =============================================================
   12 — ELISEE JEAN PIERRE                   [ niveau : complexe ]
   Rôle : Éditeur de questions + export et import JSON
   Branche : feat/editeur-questions

   C'est le module le plus technique du projet : tu manipules des fichiers
   depuis le navigateur, sans serveur.

   MISSION
   -------
   1. Formulaire #form-question : valider la saisie avant tout enregistrement.
      - intitulé et catégorie non vides
      - au moins DEUX propositions remplies
      - la bonne réponse choisie doit pointer sur une proposition réellement
        remplie (choisir « C » alors que le champ C est vide = erreur)
      Messages d'erreur clairs dans #erreur-question, jamais un alert().
   2. Enregistrer dans localStorage (clé App.CLES.perso) au format EXACT de
      data.js : { id, categorie, difficulte, intitule, options, bonne, explication }
      avec un id unique : `perso-${Date.now()}`.
   3. Afficher la liste des questions perso dans #liste-questions avec un
      bouton Supprimer (class="supprimer") par ligne, généré avec .map() +
      .join(). Gérer #editeur-vide.
   4. Après CHAQUE ajout ou suppression : App.emettre('banque:modifiee')
      pour que N'famory recalcule la banque et les catégories.
   5. Export — #btn-exporter télécharge un .json des questions perso :
        const blob = new Blob([JSON.stringify(questions, null, 2)],
                              { type: 'application/json' });
        const lien = document.createElement('a');
        lien.href = URL.createObjectURL(blob);
        lien.download = `quizzy-questions-${Date.now()}.json`;
        lien.click();
        URL.revokeObjectURL(lien.href);
   6. Import — #champ-import lit un fichier avec FileReader :
        const lecteur = new FileReader();
        lecteur.onload = () => { ... JSON.parse(lecteur.result) ... };
        lecteur.readAsText(fichier);
      Valide la structure (tableau ? chaque entrée a bien intitule, options,
      bonne ?), refuse un fichier invalide avec un message clair, et FUSIONNE
      sans écraser les questions déjà présentes. Attention aux doublons d'id.

   CONTRAT
   -------
   - Émet 'banque:modifiee' à chaque changement
   - Écoute 'app:pret' et 'ecran:change' (nom === 'editeur')
   - Le format des questions est le contrat commun avec N'famory : une
     question mal formée casse la partie de tout le monde.
   ============================================================= */



// =============================================================
// 1. ELEMENTS DU DOM
// =============================================================

const formulaireQuestion = $('#form-question');

const champIntitule = $('#q-intitule');
const champCategorie = $('#q-categorie');
const champDifficulte = $('#q-difficulte');

const champOption0 = $('#q-opt-0');
const champOption1 = $('#q-opt-1');
const champOption2 = $('#q-opt-2');
const champOption3 = $('#q-opt-3');

const champBonneReponse = $('#q-bonne');

const messageErreur = $('#erreur-question');

const boutonExporter = $('#btn-exporter');
const champImport = $('#champ-import');

const listeQuestions = $('#liste-questions');
const editeurVide = $('#editeur-vide');

// =============================================================
// 2. LECTURE DES QUESTIONS PERSONNELLES
// =============================================================


const lireQuestionsPerso = () =>
  App.local.lire(
    App.CLES.perso,
    []
  );

const sauvegarderQuestionsPerso = (questions) =>
  App.local.ecrire(
    App.CLES.perso,
    questions
  );

// =============================================================
// 3. PROTECTION DU TEXTE AFFICHE
// =============================================================

const echapperHTML = (texte = '') => {

  return String(texte)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

};

// =============================================================
// 4. GESTION DES ERREURS DU FORMULAIRE
// =============================================================

const afficherErreur = (message) => {

  messageErreur.textContent = message;
  messageErreur.hidden = false;

};

const cacherErreur = () => {

  messageErreur.textContent = '';
  messageErreur.hidden = true;

};

// =============================================================
// 5. RECUPERATION DES DONNEES DU FORMULAIRE
// =============================================================


const recupererDonneesFormulaire = () => {

  const intitule =
    champIntitule.value.trim();

  const categorie =
    champCategorie.value.trim();

  const difficulte =
    champDifficulte.value;

  const bonneChoisie =
    Number(champBonneReponse.value);

  const propositions = [

    {
      index: 0,
      texte: champOption0.value.trim()
    },

    {
      index: 1,
      texte: champOption1.value.trim()
    },

    {
      index: 2,
      texte: champOption2.value.trim()
    },

    {
      index: 3,
      texte: champOption3.value.trim()
    }

  ];

  const propositionsRemplies =
    propositions.filter(
      ({ texte }) => texte !== ''
    );


  if (intitule === '') {

    afficherErreur(
      'Veuillez saisir l’intitulé de la question.'
    );

    return null;
  }


  if (categorie === '') {

    afficherErreur(
      'Veuillez saisir une catégorie.'
    );

    return null;
  }


  if (propositionsRemplies.length < 2) {

    afficherErreur(
      'Veuillez saisir au moins deux propositions de réponse.'
    );

    return null;
  }


  const bonneReponseExiste =
    propositionsRemplies.some(
      ({ index }) =>
        index === bonneChoisie
    );


  if (!bonneReponseExiste) {

    afficherErreur(
      'La bonne réponse choisie doit correspondre à une proposition remplie.'
    );

    return null;
  }


  cacherErreur();


  return {
    intitule,
    categorie,
    difficulte,
    bonneChoisie,
    propositionsRemplies
  };

};

// =============================================================
// 6. CREATION D'UNE QUESTION QUIZZY
// =============================================================

// {
//   id,
//   categorie,
//   difficulte,
//   intitule,
//   options,
//   bonne,
//   explication
// }

// Nous devons donc effectuer cette transformation :

// données du formulaire
//         ↓
// construction
//         ↓
// objet Quizzy
//         ↓
// localStorage


const creerQuestion = ({
  intitule,
  categorie,
  difficulte,
  bonneChoisie,
  propositionsRemplies
}) => {

  const options = propositionsRemplies.map(
    ({ texte }) => texte
  );

  const bonne = propositionsRemplies.findIndex(
    ({ index }) => index === bonneChoisie
  );

  const id = `perso-${Date.now()}`;

  return {
    id,
    categorie,
    difficulte,
    intitule,
    options,
    bonne,
    explication: ''
  };

};

// =============================================================
// 7. AFFICHAGE DES QUESTIONS PERSONNELLES
// =============================================================



const afficherQuestionsPerso = () => {

  const questions = lireQuestionsPerso();

  if (questions.length === 0) {

    listeQuestions.innerHTML = '';
    editeurVide.hidden = false;

    return;
  }

  editeurVide.hidden = true;

  listeQuestions.innerHTML = questions
    .map(({ id, intitule, categorie, difficulte }) => {

      return `
        <li>

          <div>
            <strong>
              ${echapperHTML(intitule)}
            </strong>

            <small>
              ${echapperHTML(categorie)}
              —
              ${echapperHTML(difficulte)}
            </small>
          </div>

          <button
            type="button"
            class="supprimer"
            data-id="${echapperHTML(id)}"
          >
            Supprimer
          </button>

        </li>
      `;

    })
    .join('');

};

App.sur('ecran:change', ({ nom }) => {
  if (nom === 'editeur') afficherQuestionsPerso();
});

App.sur('app:pret', () => {
  // TODO 1, 2, 4, 5 et 6

  // Nous allons donc désactiver uniquement la validation automatique du navigateur depuis ton JavaScript, sans modifier index.html.

  formulaireQuestion.noValidate = true;

    // Solution partielle

    afficherQuestionsPerso();

   formulaireQuestion.addEventListener(
    'submit',
    (evenement) => {

      evenement.preventDefault();

      // le console.log() temporaire.


      // const donnees =
      //   recupererDonneesFormulaire();

      // if (!donnees) {
      //   return;
      // }

      // console.log(
      //   'Données valides :',
      //   donnees
      // );

      
      const donnees =
        recupererDonneesFormulaire();


      if (!donnees) {
        return;
      }


      const nouvelleQuestion =
        creerQuestion(donnees);


      const questionsExistantes =
        lireQuestionsPerso();


      const questionsMisesAJour = [
        ...questionsExistantes,
        nouvelleQuestion
      ];


      const sauvegardeReussie =
        sauvegarderQuestionsPerso(
          questionsMisesAJour
        );


      if (!sauvegardeReussie) {

        App.notifier(
          'Impossible d’enregistrer la question.',
          'erreur'
        );

        return;
      }


      afficherQuestionsPerso();

      formulaireQuestion.reset();

      cacherErreur();

      App.emettre(
        'banque:modifiee'
      );

      App.notifier(
        'Question enregistrée avec succès.'
      );

    }
  );




});
