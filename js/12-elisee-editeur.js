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
      data.js :
      { id, categorie, difficulte, intitule, options, bonne, explication }
      avec un id unique : `perso-${Date.now()}`.

   3. Afficher la liste des questions perso dans #liste-questions avec un
      bouton Supprimer (class="supprimer") par ligne, généré avec .map() +
      .join(). Gérer #editeur-vide.

   4. Après CHAQUE ajout ou suppression :
      App.emettre('banque:modifiee')
      pour que N'famory recalcule la banque et les catégories.

   5. Export — #btn-exporter télécharge un .json des questions perso.

   6. Import — #champ-import lit un fichier avec FileReader, valide sa
      structure et fusionne les nouvelles questions sans écraser celles
      déjà présentes.

   CONTRAT
   -------
   - Émet 'banque:modifiee' à chaque changement
   - Écoute 'app:pret' et 'ecran:change' (nom === 'editeur')
   - Le format des questions est le contrat commun avec N'famory.
   ============================================================= */


// =============================================================
// 1. ÉLÉMENTS DU DOM
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
// 2. STOCKAGE DES QUESTIONS PERSONNELLES
// =============================================================

const lireQuestionsPerso = () => {

  const questions = App.local.lire(
    App.CLES.perso,
    []
  );

  return Array.isArray(questions)
    ? questions
    : [];

};


const sauvegarderQuestionsPerso = (questions) =>
  App.local.ecrire(
    App.CLES.perso,
    questions
  );


// =============================================================
// 3. PROTECTION DU TEXTE AFFICHÉ
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
// 5. RÉCUPÉRATION ET VALIDATION DU FORMULAIRE
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


  // Intitulé obligatoire.
  if (intitule === '') {

    afficherErreur(
      'Veuillez saisir l’intitulé de la question.'
    );

    return null;
  }


  // Catégorie obligatoire.
  if (categorie === '') {

    afficherErreur(
      'Veuillez saisir une catégorie.'
    );

    return null;
  }


  // Au moins deux propositions sont nécessaires.
  if (propositionsRemplies.length < 2) {

    afficherErreur(
      'Veuillez saisir au moins deux propositions de réponse.'
    );

    return null;
  }


  // Vérifie que la réponse choisie correspond réellement
  // à une proposition remplie.
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
// 6. CRÉATION D'UNE QUESTION QUIZZY
// =============================================================

const creerQuestion = ({
  intitule,
  categorie,
  difficulte,
  bonneChoisie,
  propositionsRemplies
}) => {

  const options =
    propositionsRemplies.map(
      ({ texte }) => texte
    );


  // Recalcule l'index après suppression éventuelle
  // d'une proposition vide.
  const bonne =
    propositionsRemplies.findIndex(
      ({ index }) =>
        index === bonneChoisie
    );


  const id =
    `perso-${Date.now()}`;


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
// 7. VALIDATION D'UNE QUESTION IMPORTÉE
// =============================================================

const estQuestionValide = (question) => {

  // Une question doit être un objet.
  if (
    !question ||
    typeof question !== 'object' ||
    Array.isArray(question)
  ) {
    return false;
  }


  const {
    id,
    categorie,
    difficulte,
    intitule,
    options,
    bonne,
    explication
  } = question;


  // Identifiant.
  if (
    typeof id !== 'string' ||
    id.trim() === ''
  ) {
    return false;
  }


  // Catégorie.
  if (
    typeof categorie !== 'string' ||
    categorie.trim() === ''
  ) {
    return false;
  }


  // Difficulté autorisée.
  if (
    ![
      'facile',
      'moyen',
      'difficile'
    ].includes(difficulte)
  ) {
    return false;
  }


  // Intitulé.
  if (
    typeof intitule !== 'string' ||
    intitule.trim() === ''
  ) {
    return false;
  }


  // Il faut au moins deux propositions.
  if (
    !Array.isArray(options) ||
    options.length < 2
  ) {
    return false;
  }


  // Toutes les propositions doivent être
  // des chaînes non vides.
  const optionsValides =
    options.every(
      (option) =>
        typeof option === 'string' &&
        option.trim() !== ''
    );


  if (!optionsValides) {
    return false;
  }


  // "bonne" doit être un index entier existant.
  if (
    !Number.isInteger(bonne) ||
    bonne < 0 ||
    bonne >= options.length
  ) {
    return false;
  }


  // Le contrat commun prévoit toujours explication.
  if (
    typeof explication !== 'string'
  ) {
    return false;
  }


  return true;

};


// =============================================================
// 8. AFFICHAGE DES QUESTIONS PERSONNELLES
// =============================================================

const afficherQuestionsPerso = () => {

  const questions =
    lireQuestionsPerso();


  // Cas où aucune question n'existe.
  if (questions.length === 0) {

    listeQuestions.innerHTML = '';
    editeurVide.hidden = false;

    return;
  }


  editeurVide.hidden = true;


  listeQuestions.innerHTML =
    questions
      .map(
        ({
          id,
          intitule,
          categorie,
          difficulte
        }) => {

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

        }
      )
      .join('');

};


// =============================================================
// 9. ACTUALISATION LORS DU CHANGEMENT D'ÉCRAN
// =============================================================

App.sur(
  'ecran:change',
  ({ nom }) => {

    if (nom === 'editeur') {
      afficherQuestionsPerso();
    }

  }
);


// =============================================================
// 10. INITIALISATION DU MODULE
// =============================================================

App.sur(
  'app:pret',
  () => {

    // Nous utilisons notre propre validation JavaScript.
    formulaireQuestion.noValidate = true;

    // Prépare immédiatement la liste depuis localStorage.
    afficherQuestionsPerso();


    // =========================================================
    // 10.1 AJOUT D'UNE QUESTION
    // =========================================================

    formulaireQuestion.addEventListener(
      'submit',
      (evenement) => {

        evenement.preventDefault();


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


    // =========================================================
    // 10.2 SUPPRESSION D'UNE QUESTION
    // =========================================================

    listeQuestions.addEventListener(
      'click',
      (evenement) => {

        const boutonSupprimer =
          evenement.target.closest(
            '.supprimer'
          );


        // Le clic n'était pas effectué
        // sur un bouton Supprimer.
        if (
          !boutonSupprimer ||
          !listeQuestions.contains(
            boutonSupprimer
          )
        ) {
          return;
        }


        const { id } =
          boutonSupprimer.dataset;


        const questions =
          lireQuestionsPerso();


        const questionsRestantes =
          questions.filter(
            ({ id: questionId }) =>
              questionId !== id
          );


        // Aucun identifiant correspondant trouvé.
        if (
          questionsRestantes.length ===
          questions.length
        ) {
          return;
        }


        const sauvegardeReussie =
          sauvegarderQuestionsPerso(
            questionsRestantes
          );


        if (!sauvegardeReussie) {

          App.notifier(
            'Impossible de supprimer la question.',
            'erreur'
          );

          return;
        }


        afficherQuestionsPerso();


        App.emettre(
          'banque:modifiee'
        );


        App.notifier(
          'Question supprimée.'
        );

      }
    );


    // =========================================================
    // 10.3 EXPORT DES QUESTIONS EN JSON
    // =========================================================

    boutonExporter.addEventListener(
      'click',
      () => {

        const questions =
          lireQuestionsPerso();


        const contenuJSON =
          JSON.stringify(
            questions,
            null,
            2
          );


        const blob =
          new Blob(
            [contenuJSON],
            {
              type: 'application/json'
            }
          );


        const lien =
          document.createElement('a');


        lien.href =
          URL.createObjectURL(blob);


        lien.download =
          `quizzy-questions-${Date.now()}.json`;


        lien.click();


        URL.revokeObjectURL(
          lien.href
        );


        App.notifier(
          'Questions exportées en JSON.'
        );

      }
    );


    // =========================================================
    // 10.4 IMPORT DES QUESTIONS EN JSON
    // =========================================================

    champImport.addEventListener(
      'change',
      () => {

        const [fichier] =
          champImport.files;


        // L'utilisateur a annulé le choix du fichier.
        if (!fichier) {
          return;
        }


        const lecteur =
          new FileReader();


        lecteur.onload = () => {

          try {

            const donneesImportees =
              JSON.parse(
                lecteur.result
              );


            // Le fichier doit contenir un tableau.
            if (
              !Array.isArray(
                donneesImportees
              )
            ) {

              App.notifier(
                'Le fichier doit contenir un tableau de questions.',
                'erreur'
              );

              return;
            }


            // Toutes les questions doivent respecter
            // le contrat commun Quizzy.
            const toutesValides =
              donneesImportees.every(
                estQuestionValide
              );


            if (!toutesValides) {

              App.notifier(
                'Le fichier contient une ou plusieurs questions invalides.',
                'erreur'
              );

              return;
            }


            const questionsExistantes =
              lireQuestionsPerso();


            // Ensemble des identifiants déjà connus.
            const idsConnus =
              new Set(
                questionsExistantes.map(
                  ({ id }) => id
                )
              );


            // Ignore :
            // - les questions déjà présentes
            // - les doublons internes au fichier importé
            const questionsNouvelles =
              donneesImportees.filter(
                ({ id }) => {

                  if (
                    idsConnus.has(id)
                  ) {
                    return false;
                  }


                  idsConnus.add(id);

                  return true;

                }
              );


            // Rien de réellement nouveau.
            if (
              questionsNouvelles.length === 0
            ) {

              App.notifier(
                'Aucune nouvelle question à importer.'
              );

              return;
            }


            // Fusion sans écraser les questions existantes.
            const questionsFusionnees = [
              ...questionsExistantes,
              ...questionsNouvelles
            ];


            const sauvegardeReussie =
              sauvegarderQuestionsPerso(
                questionsFusionnees
              );


            if (!sauvegardeReussie) {

              App.notifier(
                'Impossible d’enregistrer les questions importées.',
                'erreur'
              );

              return;
            }


            afficherQuestionsPerso();


            App.emettre(
              'banque:modifiee'
            );


            const nombreImporte =
              questionsNouvelles.length;


            App.notifier(
              nombreImporte === 1
                ? '1 question importée.'
                : `${nombreImporte} questions importées.`
            );

          } catch (erreur) {

            App.notifier(
              'Le fichier JSON est invalide.',
              'erreur'
            );

          } finally {

            // Permet de sélectionner de nouveau
            // exactement le même fichier.
            champImport.value = '';

          }

        };


        lecteur.onerror = () => {

          App.notifier(
            'Impossible de lire le fichier sélectionné.',
            'erreur'
          );


          champImport.value = '';

        };


        lecteur.readAsText(
          fichier
        );

      }
    );

  }
);