/* =============================================================
   data.js — FOURNI. Banque de questions de départ.
   Chaque question suit EXACTEMENT ce format :
     { id, categorie, difficulte, intitule, options: [], bonne, explication }
   `bonne` est l'INDEX de la bonne réponse dans `options` (0, 1, 2 ou 3).

   Vous pouvez ajouter des questions ici, mais une PR qui ne fait
   qu'ajouter des questions ne vaut pas une fonctionnalité.
   ============================================================= */

App.QUESTIONS = [
  {
    id: 'js-01', categorie: 'JavaScript', difficulte: 'facile',
    intitule: "Quelle méthode ajoute un élément à la FIN d'un tableau ?",
    options: ['push()', 'shift()', 'unshift()', 'pop()'], bonne: 0,
    explication: "push() ajoute à la fin, pop() retire la fin, unshift() ajoute au début."
  },
  {
    id: 'js-02', categorie: 'JavaScript', difficulte: 'facile',
    intitule: "Comment écrit-on une fonction fléchée qui double un nombre ?",
    options: ['function (n) => n * 2', 'const doubler = (n) => n * 2', 'arrow doubler(n) { n * 2 }', 'const doubler = n * 2 => n'], bonne: 1,
    explication: "Une fonction fléchée s'écrit (parametres) => valeurDeRetour."
  },
  {
    id: 'js-03', categorie: 'JavaScript', difficulte: 'facile',
    intitule: "Quel caractère entoure un template literal ?",
    options: ["L'apostrophe '", 'Le guillemet "', "L'accent grave `", 'La barre oblique /'], bonne: 2,
    explication: "Les template literals utilisent les backticks et acceptent ${expression}."
  },
  {
    id: 'js-04', categorie: 'JavaScript', difficulte: 'moyen',
    intitule: "Que renvoie localStorage.getItem('inexistant') ?",
    options: ['undefined', 'null', 'une chaîne vide', 'une erreur'], bonne: 1,
    explication: "getItem() renvoie null quand la clé n'existe pas."
  },
  {
    id: 'js-05', categorie: 'JavaScript', difficulte: 'moyen',
    intitule: "Quelle différence entre localStorage et sessionStorage ?",
    options: [
      'Aucune, ce sont des synonymes',
      "sessionStorage est effacé à la fermeture de l'onglet",
      'localStorage est limité à 100 caractères',
      'sessionStorage fonctionne sans navigateur'
    ], bonne: 1,
    explication: "localStorage persiste ; sessionStorage disparaît quand l'onglet se ferme."
  },
  {
    id: 'js-06', categorie: 'JavaScript', difficulte: 'moyen',
    intitule: "Quel type de données peut-on stocker dans localStorage ?",
    options: ['Uniquement des chaînes de caractères', "N'importe quel objet", 'Des nombres uniquement', 'Des fonctions'], bonne: 0,
    explication: "Tout est converti en chaîne : on utilise JSON.stringify() et JSON.parse()."
  },
  {
    id: 'js-07', categorie: 'JavaScript', difficulte: 'difficile',
    intitule: "Que fait const { nom } = joueur ; ?",
    options: [
      'Crée un objet appelé nom',
      'Extrait la propriété nom de joueur',
      'Supprime la propriété nom',
      'Compare nom et joueur'
    ], bonne: 1,
    explication: "C'est la déstructuration d'objet, une nouveauté ES6."
  },
  {
    id: 'js-08', categorie: 'JavaScript', difficulte: 'difficile',
    intitule: "Que renvoie [1, 2, 3].map((n) => n * n) ?",
    options: ['[1, 2, 3]', '[2, 4, 6]', '[1, 4, 9]', '14'], bonne: 2,
    explication: "map() renvoie un NOUVEAU tableau avec le résultat de la fonction pour chaque élément."
  },

  {
    id: 'web-01', categorie: 'Web', difficulte: 'facile',
    intitule: "Que signifie CSS ?",
    options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style System', 'Coded Style Syntax'], bonne: 1,
    explication: "Cascading Style Sheets : feuilles de style en cascade."
  },
  {
    id: 'web-02', categorie: 'Web', difficulte: 'facile',
    intitule: "Quelle balise HTML crée un lien ?",
    options: ['<link>', '<a>', '<href>', '<url>'], bonne: 1,
    explication: "<a href=\"...\"> crée un lien. <link> sert à charger une ressource dans <head>."
  },
  {
    id: 'web-03', categorie: 'Web', difficulte: 'moyen',
    intitule: "Quelle propriété CSS place les éléments en colonne avec flexbox ?",
    options: ['flex-direction: column', 'display: column', 'align-column: true', 'flow: vertical'], bonne: 0,
    explication: "flex-direction: column change l'axe principal du conteneur flex."
  },
  {
    id: 'web-04', categorie: 'Web', difficulte: 'moyen',
    intitule: "Quel code HTTP correspond à « page introuvable » ?",
    options: ['200', '301', '404', '500'], bonne: 2,
    explication: "404 = ressource introuvable. 500 = erreur serveur."
  },
  {
    id: 'web-05', categorie: 'Web', difficulte: 'difficile',
    intitule: "À quoi sert l'attribut defer sur une balise <script> ?",
    options: [
      'Empêcher le script de se charger',
      "Exécuter le script après l'analyse du HTML",
      'Charger le script deux fois',
      'Placer le script dans le body'
    ], bonne: 1,
    explication: "defer télécharge le script en parallèle et l'exécute une fois le HTML analysé."
  },

  {
    id: 'git-01', categorie: 'Git', difficulte: 'facile',
    intitule: "Quelle commande crée une nouvelle branche et bascule dessus ?",
    options: ['git branch -d', 'git checkout -b', 'git merge', 'git init'], bonne: 1,
    explication: "git checkout -b nom-de-branche (ou git switch -c nom-de-branche)."
  },
  {
    id: 'git-02', categorie: 'Git', difficulte: 'facile',
    intitule: "Que fait git pull ?",
    options: [
      'Envoie les commits vers le dépôt distant',
      'Récupère et fusionne les changements distants',
      'Supprime une branche',
      'Annule le dernier commit'
    ], bonne: 1,
    explication: "git pull = git fetch + git merge."
  },
  {
    id: 'git-03', categorie: 'Git', difficulte: 'moyen',
    intitule: "Qu'est-ce qu'un conflit de fusion (merge conflict) ?",
    options: [
      'Une erreur de connexion internet',
      'Deux branches modifient les mêmes lignes du même fichier',
      "Un commit sans message",
      'Une branche protégée'
    ], bonne: 1,
    explication: "Git ne peut pas décider seul quelle version garder : c'est à l'humain de trancher."
  },
  {
    id: 'git-04', categorie: 'Git', difficulte: 'moyen',
    intitule: "À quoi sert une Pull Request ?",
    options: [
      'Télécharger un dépôt',
      'Proposer ses changements et les faire relire avant fusion',
      'Supprimer un dépôt',
      'Créer un compte GitHub'
    ], bonne: 1,
    explication: "La PR est le point de relecture : on discute du code avant de le fusionner dans main."
  },

  {
    id: 'cul-01', categorie: 'Culture générale', difficulte: 'facile',
    intitule: "Quelle est la capitale de la République Démocratique du Congo ?",
    options: ['Lubumbashi', 'Goma', 'Kinshasa', 'Kisangani'], bonne: 2,
    explication: "Kinshasa est la capitale et la plus grande ville du pays."
  },
  {
    id: 'cul-02', categorie: 'Culture générale', difficulte: 'moyen',
    intitule: "Quel volcan surplombe la ville de Goma ?",
    options: ['Le Nyiragongo', 'Le Kilimandjaro', 'Le Cameroun', 'Le Karisimbi'], bonne: 0,
    explication: "Le Nyiragongo, dans le parc national des Virunga, abrite un lac de lave permanent."
  },
  {
    id: 'cul-03', categorie: 'Culture générale', difficulte: 'moyen',
    intitule: "Combien de langues nationales la RDC reconnaît-elle ?",
    options: ['Deux', 'Trois', 'Quatre', 'Six'], bonne: 2,
    explication: "Lingala, kikongo, swahili et tshiluba, en plus du français comme langue officielle."
  },
  {
    id: 'cul-04', categorie: 'Culture générale', difficulte: 'difficile',
    intitule: "Quel lac borde la ville de Goma ?",
    options: ['Le lac Tanganyika', 'Le lac Kivu', 'Le lac Albert', 'Le lac Édouard'], bonne: 1,
    explication: "Le lac Kivu sépare la RDC du Rwanda."
  }
];
