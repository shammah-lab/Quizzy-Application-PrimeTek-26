/* =============================================================
   03 — N'FAMORY TRAORE                      [ niveau : complexe ]
   Rôle : Banque de questions, catégories, filtres, tirage et mélange
   Branche : feat/banque-questions

   C'est le module le plus central du projet : personne ne peut jouer une
   partie tant que le tien ne renvoie pas un tirage correct.

   MISSION
   -------
   1. Construire la banque complète = questions de data.js + questions perso
      créées par l'utilisateur (localStorage, clé App.CLES.perso).
   2. Remplir dynamiquement le <select> #champ-categorie avec les catégories
      réellement présentes, SANS doublon et triées par ordre alphabétique.
      Astuce : [...new Set(App.banque.map((q) => q.categorie))].sort()
   3. Fournir App.tirerQuestions({ categorie, difficulte }) qui filtre,
      mélange, et renvoie au maximum App.config.nbQuestions questions.
      Gérer le cas « aucune question ne correspond » proprement.
   4. Préparer les propositions de CHAQUE question tirée : si
      App.config.melangerReponses est vrai, l'ordre des propositions change,
      mais on doit toujours savoir laquelle est la bonne.

   LE PIÈGE PRINCIPAL — LIS BIEN
   -----------------------------
   Si tu mélanges directement le tableau `options`, l'index stocké dans
   `bonne` ne pointe plus sur la bonne proposition et TOUTES les réponses
   deviennent fausses. La solution consiste à mélanger des paires plutôt
   que des textes :

     const propositions = question.options
       .map((texte, indexOrigine) => ({ texte, indexOrigine }));
     // puis App.melanger(propositions) si le réglage est actif

   Chaque question tirée doit donc repartir avec une propriété
   `propositions` = tableau de { texte, indexOrigine }.
   Fabrice se contente de l'afficher, Jephte compare indexOrigine à `bonne`.

   CONTRAT
   -------
   - Expose App.banque (tableau) et App.tirerQuestions({ categorie, difficulte })
   - Chaque question renvoyée porte : { ...question, propositions }
   - Écoute 'app:chargement', 'app:pret' et 'banque:modifiee' (émis par Elisée)
   ============================================================= */

App.banque = [];

const construireBanque = () => {
  // TODO 1 : const perso = App.local.lire(App.CLES.perso, []);
  const perso = App.local.lire(App.CLES.perso,[]);
  // TODO 2 : App.banque = [...App.QUESTIONS, ...perso];
  App.banque = [...App.QUESTIONS, ...perso];
  // TODO 3 : mettre à jour #info-nb-questions
  $('#info-nb-questions').textContent = App.banque.length;
};

const remplirCategories = () => {
  // TODO 4 : catégories uniques + triées, générées avec .map() + .join('')
  //          en gardant <option value="toutes">Toutes les catégories</option>
  const categoriesBrutes = App.banque.map((q) => q.categorie)
  const categories = [...new Set(categoriesBrutes)].sort()

  const options = categories.map((c) => `<option value="${c}">${c}</option>`).join('')
  const select = $('#champ-categorie');

  const contenu = `<option value="toutes">Toutes les catégories</option>` + options

  select.innerHTML = contenu

  select.addEventListener('change', () => {
  const categorie = select.value;

  const questionsDisponibles = App.banque.filter((q) => {
    return categorie === 'toutes' || q.categorie === categorie;
  });

    $('#info-nb-questions').textContent = questionsDisponibles.length;
  });
};

const preparerPropositions = (question) => {
  // TODO 5 : renvoyer { ...question, propositions } comme expliqué ci-dessus
  let propositions = question.options
  .map((texte, indexOrigine) => ({
    texte,
    indexOrigine
  }));
  if(App.config.melangerReponses){
    propositions = App.melanger(propositions)
  }
  
  return { ...question, propositions };
};

App.tirerQuestions = ({ categorie = 'toutes', difficulte = 'toutes' } = {}) => {
  // TODO 6 : filtrer App.banque ('toutes' = pas de filtre)
  const correspondantes = App.banque.filter((q) => {
    const categorieOK = categorie === "toutes" || q.categorie === categorie;
    const difficulteOK = difficulte === "toutes" || q.difficulte === difficulte;
    
   return categorieOK && difficulteOK;
  });
  
  // TODO 7 : mélanger (App.melanger) puis .slice(0, App.config.nbQuestions)
  // TODO 8 : passer chaque question dans preparerPropositions()
  // TODO 9 : si le résultat est vide -> App.notifier('...', 'erreur') et
  //          renvoyer un tableau vide (Tresor ne doit pas lancer la partie)
  if (correspondantes.length === 0) {
    App.notifier('Aucune question ne correspond à ce filtre', 'erreur');
    return [];
  }

  const tirees = App.melanger(correspondantes)
    .slice(0, App.config.nbQuestions)
    .map((q) => {
      return preparerPropositions(q);
  });

return tirees;
};

App.sur('app:chargement', construireBanque);
App.sur('app:pret', remplirCategories);
App.sur('banque:modifiee', () => {
  construireBanque();
  remplirCategories();
});
