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

const lireQuestionsPerso = () => App.local.lire(App.CLES.perso, []);

const afficherQuestionsPerso = () => {
  // TODO 3
};

App.sur('ecran:change', ({ nom }) => {
  if (nom === 'editeur') afficherQuestionsPerso();
});

App.sur('app:pret', () => {
  // TODO 1, 2, 4, 5 et 6
});
